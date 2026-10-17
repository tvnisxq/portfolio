import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const dir = path.join(process.cwd(), "content/posts");

export type Post = { slug: string; title: string; date: string; summary: string; body: string };

export function getPosts(): Post[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const { data, content } = matter(fs.readFileSync(path.join(dir, f), "utf8"));
      return {
        slug: f.replace(/\.md$/, ""),
        title: String(data.title ?? f),
        date: data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date ?? ""),
        summary: String(data.summary ?? ""),
        body: content,
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export const getPost = (slug: string) => getPosts().find((p) => p.slug === slug);

export const formatDate = (iso: string) =>
  iso
    ? new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric" }).toLowerCase()
    : "";
