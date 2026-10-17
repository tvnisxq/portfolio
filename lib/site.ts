export const site = {
  name: "tanishq",
  handle: "tvnisxq",
  youtubeChannelId: "UC5dQg8wNIMs4mexJHOHEvBA",
  links: {
    github: "https://github.com/tvnisxq",
    youtube: "https://www.youtube.com/@tensharq",
    instagram: "https://instagram.com/tvnisxq",
    linkedin: "https://linkedin.com/in/tvnisxq",
  },
};

export type Project = {
  title: string;
  /** One powerful line. */
  summary: string;
  tags: string;
  href: string;
  /** Thumbnail in /public, 16:9. Without one, the card shows the title instead. */
  image?: string;
};

export const projects: Project[] = [
  {
    title: "LegalAdvisor",
    summary: "Ask your legal documents anything and get answers grounded in the source.",
    tags: "langchain, rag, pinecone, fastapi, groq",
    href: "https://github.com/tvnisxq",
    image: "/projects/legaladvisor.webp",
  },
  {
    title: "LangVid",
    summary: "Turns any recording into summaries, action items and grounded answers.",
    tags: "langchain, rag, chromadb, whisper",
    href: "https://github.com/tvnisxq",
  },
  {
    title: "ContentAlchemist",
    summary: "One idea in; a blog post, social posts and a newsletter out.",
    tags: "langgraph, multi-agent, gemini, flask",
    href: "https://github.com/tvnisxq",
    image: "/projects/contentalchemist.webp",
  },
  {
    title: "Smoking Status Prediction",
    summary: "Predicts smoker status from health indicators, served as an API.",
    tags: "xgboost, fastapi, github actions",
    href: "https://github.com/tvnisxq",
    image: "/projects/smoking-status.webp",
  },
];
