import { site } from "./site";

export type Video = {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  published: string;
};

const decode = (s: string) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

// Public RSS feed: no API key needed. Refreshes at most once an hour.
export async function getLatestVideos(limit = 4): Promise<Video[]> {
  try {
    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${site.youtubeChannelId}`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return [];
    const xml = await res.text();
    return xml
      .split("<entry>")
      .slice(1, limit + 1)
      .map((e) => {
        const id = /<yt:videoId>(.*?)<\/yt:videoId>/.exec(e)?.[1] ?? "";
        return {
          id,
          title: decode(/<title>(.*?)<\/title>/.exec(e)?.[1] ?? ""),
          url: `https://www.youtube.com/watch?v=${id}`,
          thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
          published: /<published>(.*?)<\/published>/.exec(e)?.[1] ?? "",
        };
      })
      .filter((v) => v.id);
  } catch {
    return [];
  }
}
