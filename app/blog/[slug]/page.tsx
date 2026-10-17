import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import EscButton from "@/components/EscButton";
import { getPost, getPosts, formatDate } from "@/lib/posts";

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const post = getPost((await params).slug);
  return post ? { title: `${post.title} · tanishq`, description: post.summary } : {};
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  return (
    <main className="wrap article">
      <EscButton href="/#blog" />
      <h1>{post.title}</h1>
      <p className="mono post-date">{formatDate(post.date)}</p>
      <div className="prose">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.body}</ReactMarkdown>
      </div>
    </main>
  );
}
