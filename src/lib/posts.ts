import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

/**
 * 是否顯示草稿與尚未到發布時間的文章。
 * - 本機 dev：一律顯示。
 * - Cloudflare Pages Preview 環境：設 SHOW_DRAFTS=true 顯示。
 * - Production：不顯示。
 */
export const showDrafts =
  import.meta.env.DEV || import.meta.env.SHOW_DRAFTS === 'true';

export function isPublished(post: Post, now = new Date()): boolean {
  if (post.data.draft) return false;
  return post.data.pubDate.getTime() <= now.getTime();
}

/** 取得要在網站上顯示的文章，新到舊排序。 */
export async function getVisiblePosts(): Promise<Post[]> {
  const now = new Date();
  const all = await getCollection('posts');
  return all
    .filter((p) => showDrafts || isPublished(p, now))
    .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}

/** 只有正式發布的文章。RSS、sitemap、llms.txt 用這個。 */
export async function getPublishedPosts(): Promise<Post[]> {
  const now = new Date();
  const all = await getCollection('posts');
  return all
    .filter((p) => isPublished(p, now))
    .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}

export function postUrl(post: Post): string {
  return `/posts/${post.id}/`;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Taipei',
  }).format(date);
}
