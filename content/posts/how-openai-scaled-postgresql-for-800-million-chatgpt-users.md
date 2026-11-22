---
author: Tanishq Sharma
source: "https://medium.com/@tvnisxq/how-openai-scaled-postgresql-for-800-million-chatgpt-users-a-beginner-friendly-guide-cda5826014e8"
title: How OpenAI Scaled PostgreSQL for 800 Million ChatGPT Users
---

# How OpenAI Scaled PostgreSQL for 800 Million ChatGPT Users

*How a familiar relational database can support an enormous read-heavy
workload through careful engineering.*

**Original article:** [Read on
Medium](https://medium.com/@tvnisxq/how-openai-scaled-postgresql-for-800-million-chatgpt-users-a-beginner-friendly-guide-cda5826014e8)

**Based on:** OpenAI Engineering, ["Scaling PostgreSQL to power 800
million ChatGPT users"](https://openai.com/index/scaling-postgresql/) by
Bohan Zhang (January 2026).

When you send a message to ChatGPT, several systems work behind the
scenes. A database stores information such as user settings and
conversation data. Now imagine serving that workload for hundreds of
millions of people around the world.

You might expect a completely new database technology to be responsible
for that scale. The interesting part is that a significant portion of
this workload is handled by **PostgreSQL**---a mature, open-source
relational database.

The architecture described by OpenAI uses one primary database to handle
writes and nearly 50 read replicas to serve read traffic. Instead of
immediately splitting everything across many independent databases, the
team focused on getting more out of this architecture while carefully
controlling write-heavy workloads.

This article breaks down the architecture, the failure patterns, and the
engineering techniques in beginner-friendly terms.

## First, a few fundamentals

Before looking at the architecture, let's establish a few terms.

-   **Database:** Software that stores data and allows applications to
    read and modify it. PostgreSQL, often called Postgres, is one
    example.
-   **Query:** A request made to a database, such as retrieving a user's
    settings. QPS means queries per second.
-   **Read vs. write:** A read retrieves data; a write creates, updates,
    or deletes data. A read-heavy workload performs significantly more
    reads than writes.
-   **Primary and replicas:** The primary accepts writes. Replicas
    receive changes from the primary and can serve read queries.
-   **Scaling up vs. scaling out:** Scaling up means using a larger
    machine. Scaling out means adding more machines.
-   **Sharding:** Splitting data across multiple independent database
    partitions. It can distribute write load, but introducing it into an
    established application can require substantial application changes.

## The surprising choice: no sharding for the main Postgres deployment

OpenAI's main PostgreSQL deployment remains **unsharded**: one primary
handles writes, while replicas distribute read traffic.

Why not shard everything?

Sharding an established application is not simply a database
configuration change. The application must understand where data lives,
how queries cross shard boundaries, and how operations behave when data
is distributed. Retrofitting this can require changes across many parts
of a codebase.

Because the workload is heavily read-oriented, the team chose to
optimize the existing primary-and-replica architecture first.

That does not mean write scaling was ignored. Write-heavy workloads that
can be separated cleanly have been moved to sharded systems such as
Azure Cosmos DB. The engineering post also describes a rule that new
tables should not be added to the main PostgreSQL deployment by default.

## Where things cracked: the vicious cycle under load

Several serious incidents followed a similar pattern:

1.  An upstream issue increases database traffic. A cache failure, an
    expensive query, or a feature launch can trigger the spike.
2.  PostgreSQL becomes overloaded and queries slow down.
3.  Requests time out.
4.  Applications retry those requests.
5.  The retries create even more database traffic, making the original
    slowdown worse.

This is a **retry storm** or cascading failure: a small problem can
amplify itself until the system becomes unavailable.

![The Vicious Cycle](/images/openAI-800-mil/vicious_cycle.png)

The important lesson is that retries are not automatically harmless.
Without backoff, limits, and load shedding, retries can turn a temporary
slowdown into a much larger incident.

## Why heavy writes are difficult for PostgreSQL: MVCC

PostgreSQL uses **MVCC (Multiversion Concurrency Control)** to provide
consistent views of data while transactions run concurrently.

When a row is updated, PostgreSQL generally creates a new row version
rather than overwriting the existing version in place. Older versions
may need to remain available while transactions that started earlier are
still using them.

This design is valuable for concurrency and correctness, but heavy
update workloads introduce costs:

-   **Write amplification:** Updating a field can create a new row
    version, even when only a small part of the logical record changed.
-   **Read amplification:** Queries may need to skip obsolete row
    versions to find the visible version.
-   **Bloat:** Dead row versions can occupy table and index space until
    they are cleaned up.
-   **Autovacuum tuning:** PostgreSQL's background cleanup process must
    keep up with the rate at which obsolete versions are created.

This helps explain why controlling write traffic is so important in the
architecture.

## The nine engineering techniques

### 1. Protect the primary

With one primary accepting writes, sudden write spikes can overwhelm it.
The goal is to keep its workload as small and predictable as possible.

The techniques described include:

-   Send read queries to replicas whenever possible.
-   Move suitable write-heavy workloads to sharded systems.
-   Fix application bugs that generate unnecessary duplicate writes.
-   Use lazy writes where appropriate to spread work over time.
-   Rate-limit backfills when populating new columns for existing rows.

### 2. Fix expensive queries

A small number of inefficient queries can consume a disproportionate
amount of database CPU.

The engineering post describes an expensive query that joined 12 tables
and contributed to major incidents.

Possible mitigations include:

-   Avoid unnecessarily large multi-table joins. In some cases, separate
    queries combined in application code are more efficient.
-   Inspect SQL generated by ORMs rather than assuming generated queries
    are optimal.
-   Use timeouts such as `idle_in_transaction_session_timeout` to
    prevent forgotten idle transactions from interfering with cleanup.

### 3. Avoid a single point of failure

If a read replica fails, traffic can be redirected to another replica.
If the only primary fails, writes can stop.

The architecture uses several safeguards:

-   Keep critical read paths available even when the primary is
    unavailable. This does not preserve writes, but it can prevent a
    complete service outage.
-   Run the primary in High Availability (HA) mode with a hot standby
    that can take over.
-   Maintain multiple replicas per region with spare capacity.

### 4. Isolate workloads: the noisy-neighbor problem

A resource-intensive feature can affect every other feature sharing the
same database. This is known as the **noisy-neighbor problem**.

The mitigation is workload isolation: separate high-priority and
low-priority traffic and route them to different database instances.
Similar isolation can be applied across products so one product's
traffic spike does not destabilize another.

### 5. Pool connections with PgBouncer

Database connections are finite resources. When every application
instance opens its own database connection, a traffic spike can exhaust
the connection limit.

**PgBouncer** acts as a connection pooler between applications and
PostgreSQL. Applications use connections from a reusable pool instead of
each maintaining a separate database connection.

![Implementing PgSQL Bouncer](/images/openAI-800-mil/pgbouncer.png)

In the reported tests, average connection time dropped from **50 ms to 5
ms**. The post also emphasizes keeping poolers, clients, and replicas in
the same region to avoid unnecessary cross-region latency and cost.

### 6. Use caching---and protect against cache-miss storms

A cache stores frequently requested data in faster storage so the
database does not need to serve every request.

But what happens when the cache fails or a popular key expires? Many
requests can miss the cache simultaneously and hit PostgreSQL at once.
This is a **cache-miss storm**.

The described solution is cache locking, also called leasing. When many
requests miss the same key, only one request is allowed to fetch the
value from PostgreSQL and repopulate the cache. Other requests wait for
that result.

Instead of thousands of identical database queries, the database handles
one refill operation.

### 7. Scale replicas carefully with cascading replication

The primary sends its change log, the **WAL (Write-Ahead Log)**, to
replicas. With nearly 50 replicas, distributing WAL directly from the
primary can consume substantial network bandwidth and CPU. Replicas can
also fall behind, creating replication lag.

Cascading replication introduces intermediate replicas. Some replicas
receive WAL from the primary and forward it to downstream replicas.

![Cascading Replication](/images/openAI-800-mil/cascading_replication.png)

This topology can reduce the direct replication fan-out from the primary
and provide a path toward supporting more replicas. It also introduces
operational complexity, particularly around failover. The engineering
post describes this work as still being tested rather than already in
production.

### 8. Rate-limit at every layer

Traffic spikes, expensive queries, and retry storms can exhaust CPU,
I/O, and database connections.

Rate limiting should not exist only at the application boundary. The
described approach applies controls at multiple layers:

-   Application
-   Connection pooler
-   Proxy
-   Query level

Very short retry intervals should be avoided. The team also describes
extending ORM behavior to support rate limiting and blocking specific
query patterns when necessary. This kind of targeted load shedding helps
a system recover during a surge.

### 9. Treat schema changes carefully

A seemingly small schema change---such as altering a column type---can
require PostgreSQL to rewrite a very large table.

The safeguards described include:

-   Allow only lightweight schema changes that do not rewrite tables.
-   Enforce a strict five-second timeout for schema changes.
-   Create and drop indexes concurrently where appropriate.
-   Restrict schema changes to existing tables; direct new tables to
    sharded systems.
-   Rate-limit backfills, even when that means they take more than a
    week.

The objective is to make database maintenance predictable and avoid
destabilizing production.

## What did this architecture achieve?

The OpenAI engineering post reports the following outcomes:

-   Millions of queries per second on PostgreSQL.
-   Nearly 50 read replicas across multiple regions, with replication
    lag kept near zero.
-   Low double-digit millisecond p99 latency.
-   Five-nines availability (99.999%).
-   One SEV-0 incident in a 12-month period, associated with the viral
    ChatGPT image-generation launch and a write-traffic increase of more
    than 10x as over 100 million new users signed up in a week.

The work is ongoing. The post describes continued migration of
write-heavy workloads, experimentation with cascading replication, and
openness to sharded PostgreSQL or other distributed systems in the
future.

## Key takeaways

1.  **Do not over-engineer too early.** A primary with many read
    replicas can go a long way when the workload is read-heavy.
2.  **Understand the workload first.** Read/write ratios influence
    database architecture decisions.
3.  **Protect the database.** Caches, connection poolers, rate limits,
    and timeouts reduce unnecessary pressure.
4.  **Design for cascading failures.** Retries and cache misses can
    amplify an outage unless they are controlled.
5.  **Isolate critical workloads.** One noisy feature should not take
    down unrelated functionality.
6.  **Operational discipline matters.** Careful schema changes and
    rate-limited backfills help protect production.
7.  **Understand database trade-offs.** PostgreSQL's MVCC model is
    powerful, but write-heavy workloads require careful management.

The broader lesson is that scaling is not always about replacing a
familiar technology or distributing everything immediately. It is often
about understanding the workload, identifying the bottlenecks, and
applying the right safeguards at each layer.

## References

-   Bohan Zhang, OpenAI Engineering: 
    [Scaling PostgreSQL to power 800
    million ChatGPT users](https://openai.com/index/scaling-postgresql/)

This article is a plain-language summary and interpretation of the cited
engineering post.

## Author

**Tanishq Sharma**

-   YouTube: [@tensharq](https://youtube.com/@tensharq)
-   Instagram: [@tvnisxq](https://instagram.com/tvnisxq)
