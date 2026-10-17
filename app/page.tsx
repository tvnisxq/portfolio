import { getLatestVideos } from "@/lib/youtube";
import { getLatestReels } from "@/lib/instagram";
import { getPosts, formatDate } from "@/lib/posts";
import { projects, site } from "@/lib/site";
import HeroArt from "@/components/HeroArt";
import CrtTv from "@/components/CrtTv";
import Rail from "@/components/Rail";

export const revalidate = 3600;

export default async function Home() {
  const [videos, reels] = await Promise.all([getLatestVideos(5), getLatestReels(8)]);
  const posts = getPosts();

  return (
    <main>
      <section className="panel panel-hero" id="home">
        <div className="wrap hero panel-inner">
          <div className="hero-grid">
            <div className="hero-copy">
              <h1>{site.name}</h1>
              <p>
                i'm an <strong>ai/ml engineer</strong>. i build rag systems and agents, and i make
                videos about the <strong>financial side of artificial intelligence</strong>.
              </p>
              <nav className="links mono" aria-label="Social links">
                <a href={site.links.github} target="_blank" rel="noopener noreferrer" className="ilink" aria-label="github" title="github">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/icons/github.webp" alt="" width={24} height={24} />
                </a>
                <a href={site.links.youtube} target="_blank" rel="noopener noreferrer" className="ilink" aria-label="youtube" title="youtube">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/icons/youtube.webp" alt="" width={24} height={24} />
                </a>
                <a href={site.links.instagram} target="_blank" rel="noopener noreferrer" className="ilink" aria-label="instagram" title="instagram">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/icons/instagram.webp" alt="" width={24} height={24} />
                </a>
                <a href={site.links.linkedin} target="_blank" rel="noopener noreferrer" className="ilink" aria-label="linkedin" title="linkedin">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/icons/linkedin.webp" alt="" width={24} height={24} />
                </a>
                <a href="/resume" className="ilink" aria-label="resume" title="resume">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/icons/resume.webp" alt="" width={24} height={24} />
                </a>
              </nav>
            </div>
            <HeroArt />
          </div>
        </div>
      </section>

      <section className="panel" id="about">
        <span className="bgword" aria-hidden="true">about</span>
        <div className="wrap panel-inner">
          <div className="about-grid">
            <CrtTv />
            <div className="about-copy">
              <h2 className="sr-only">about</h2>
              <p>
                i'm a <strong>machine learning engineer</strong> focused on agentic ai and rag. i build
                systems where llms use tools, retrieve from vector databases, and answer from real
                documents. i also make videos about the financial side of ai.
              </p>
              <dl className="facts mono">
                <div><dt>focus</dt><dd>agentic ai, rag, llm orchestration</dd></div>
                <div><dt>stack</dt><dd>python, fastapi, langchain, langgraph, pinecone, chromadb</dd></div>
                <div><dt>education</dt><dd>b.e. computer science, 2026</dd></div>
                <div><dt>looking for</dt><dd>ai/ml engineer roles</dd></div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section className="panel" id="projects">
        <span className="bgword" aria-hidden="true">projects</span>
        <div className="panel-full">
          <h2 className="sr-only">projects</h2>
          <div className="marquee">
            <ul className="marquee-track">
              {[...projects, ...projects].map((p, i) => {
                const copy = i >= projects.length;
                return (
                  <li key={`${p.title}-${i}`} className="marquee-item" aria-hidden={copy || undefined}>
                    <a
                      href={p.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pcard"
                      tabIndex={copy ? -1 : undefined}
                    >
                      <span className="pcard-thumb">
                        {p.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.image} alt="" loading="lazy" />
                        ) : (
                          <span className="pcard-fallback">{p.title}</span>
                        )}
                      </span>
                      <span className="pcard-title">{p.title}</span>
                      <span className="pcard-sum">{p.summary}</span>
                      <span className="pcard-tags mono">{p.tags}</span>
                      <span className="pcard-go mono">view →</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      <section className="panel" id="socials">
        <span className="bgword" aria-hidden="true">socials</span>
        <div className="wrap panel-inner">
          <h2 className="sr-only">socials</h2>

          <div className="soc-block">
            <header className="soc-head">
              <a className="soc-id" href={site.links.youtube} target="_blank" rel="noopener noreferrer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/icons/youtube.webp" alt="" width={24} height={24} />
                <span className="soc-name">youtube</span>
                <span className="soc-handle mono">@tensharq</span>
              </a>
              <a className="soc-more mono" href={site.links.youtube} target="_blank" rel="noopener noreferrer">
                all videos →
              </a>
            </header>

            {videos.length ? (
              <div className="yt-grid">
                <a className="yt-feature" href={videos[0].url} target="_blank" rel="noopener noreferrer">
                  <span className="thumb-wrap">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={videos[0].thumbnail} alt="" loading="lazy" />
                    <span className="play" aria-hidden="true" />
                  </span>
                  <span className="yt-feature-title">{videos[0].title}</span>
                  <span className="meta mono">latest · {formatDate(videos[0].published)}</span>
                </a>
                <ul className="yt-list">
                  {videos.slice(1).map((v) => (
                    <li key={v.id}>
                      <a className="yt-row" href={v.url} target="_blank" rel="noopener noreferrer">
                        <span className="thumb-wrap">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={v.thumbnail} alt="" loading="lazy" />
                          <span className="play" aria-hidden="true" />
                        </span>
                        <span className="yt-row-text">
                          <span className="yt-row-title">{v.title}</span>
                          <span className="meta mono">{formatDate(v.published)}</span>
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <a className="soc-fallback" href={site.links.youtube} target="_blank" rel="noopener noreferrer">
                <span>watch my latest videos on youtube</span>
                <span className="mono">@tensharq →</span>
              </a>
            )}
          </div>

          <div className="soc-block">
            <header className="soc-head">
              <a className="soc-id" href={site.links.instagram} target="_blank" rel="noopener noreferrer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/icons/instagram.webp" alt="" width={24} height={24} />
                <span className="soc-name">instagram</span>
                <span className="soc-handle mono">@{site.handle}</span>
              </a>
              <a className="soc-more mono" href={site.links.instagram} target="_blank" rel="noopener noreferrer">
                follow →
              </a>
            </header>

            {reels.length ? (
              <Rail label="Latest Instagram reels">
                {reels.map((r) => (
                  <li key={r.url} className="rail-item reel-item">
                    <a className="reel" href={r.url} target="_blank" rel="noopener noreferrer">
                      <span className="thumb-wrap reel-wrap">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={r.thumbnail} alt="" loading="lazy" referrerPolicy="no-referrer" />
                        <span className="play" aria-hidden="true" />
                      </span>
                      {r.title ? <span className="reel-cap">{r.title}</span> : null}
                    </a>
                  </li>
                ))}
              </Rail>
            ) : (
              <a className="soc-fallback" href={site.links.instagram} target="_blank" rel="noopener noreferrer">
                <span>see my latest reels on instagram</span>
                <span className="mono">@{site.handle} →</span>
              </a>
            )}
          </div>
        </div>
      </section>

      <section className="panel" id="blog">
        <span className="bgword" aria-hidden="true">blog</span>
        <div className="wrap panel-inner">
          <h2 className="sr-only">blog</h2>
          {posts.length ? (
            <ul className="list">
              {posts.map((p) => (
                <li key={p.slug}>
                  <a href={`/blog/${p.slug}`} className="row">
                    <span className="row-title">{p.title}</span>
                    <span className="row-meta mono">{formatDate(p.date)}</span>
                    <span className="row-sum">{p.summary}</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty">No posts yet. Add a .md file to content/posts/.</p>
          )}
        </div>
      </section>
    </main>
  );
}
