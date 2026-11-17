import { XMLParser } from 'fast-xml-parser';

export interface Post {
  title: string;
  url: string;
  date: Date;
  description: string;
}

// Runs at build time. A failing feed should not break the deploy,
// so errors return an empty list and the section shows a fallback.
export async function getLatestPosts(feedUrl: string, count: number): Promise<Post[]> {
  if (!feedUrl) return [];
  try {
    const res = await fetch(feedUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = await res.text();
    const parsed = new XMLParser().parse(xml);
    const raw = parsed?.rss?.channel?.item ?? [];
    const entries = Array.isArray(raw) ? raw : [raw];
    return entries.slice(0, count).map((item) => ({
      title: String(item.title),
      url: String(item.link),
      date: new Date(item.pubDate),
      description: String(item.description ?? ''),
    }));
  } catch (err) {
    console.warn(`[substack] Could not load ${feedUrl}: ${(err as Error).message}`);
    return [];
  }
}
