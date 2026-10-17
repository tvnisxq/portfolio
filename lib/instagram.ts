import manual from "@/data/reels.json";

export type Reel = { url: string; thumbnail: string; title?: string };

// Mode 1 (automatic): set INSTAGRAM_ACCESS_TOKEN (Instagram Graph API, Business/Creator account).
// Mode 2 (manual): list reels in data/reels.json. Used when no token is set or the API call fails.
export async function getLatestReels(limit = 4): Promise<Reel[]> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (token) {
    try {
      const res = await fetch(
        `https://graph.instagram.com/me/media?fields=id,caption,media_type,thumbnail_url,permalink&limit=30&access_token=${token}`,
        { next: { revalidate: 3600 } },
      );
      if (res.ok) {
        const json = (await res.json()) as {
          data: {
            caption?: string;
            media_type: string;
            thumbnail_url?: string;
            permalink: string;
          }[];
        };
        const reels = json.data
          .filter((m) => m.media_type === "VIDEO" && m.thumbnail_url)
          .slice(0, limit)
          .map((m) => ({
            url: m.permalink,
            thumbnail: m.thumbnail_url as string,
            title: m.caption?.split("\n")[0]?.slice(0, 80),
          }));
        if (reels.length) return reels;
      }
    } catch {
      /* fall through to manual list */
    }
  }
  return (manual as Reel[]).slice(0, limit);
}
