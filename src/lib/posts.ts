import { getCollection, type CollectionEntry } from 'astro:content';
import { categories, type CategoryKey } from '../site.config';

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

export function categoryUrl(key: CategoryKey): string {
  return `/category/${key}/`;
}

export function categoryLabel(key: CategoryKey): string {
  return categories[key];
}

export const categoryKeys = Object.keys(categories) as CategoryKey[];

const taipei = (date: Date, opts: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Taipei', ...opts }).formatToParts(date);

const part = (parts: Intl.DateTimeFormatPart[], type: Intl.DateTimeFormatPartTypes) =>
  parts.find((p) => p.type === type)?.value ?? '';

/** 2026.09.06 —— 版面上的數字日期，等寬字用 */
export function formatDateNumeric(date: Date): string {
  const p = taipei(date, { year: 'numeric', month: '2-digit', day: '2-digit' });
  return `${part(p, 'year')}.${part(p, 'month')}.${part(p, 'day')}`;
}

/** 09.06 —— 列表已經有年份分隔時，日期只留月日 */
export function formatMonthDay(date: Date): string {
  const p = taipei(date, { month: '2-digit', day: '2-digit' });
  return `${part(p, 'month')}.${part(p, 'day')}`;
}

/** 台北時區的年份字串，文章列表分組用 */
export function postYear(post: Post): string {
  return part(taipei(post.data.pubDate, { year: 'numeric' }), 'year');
}

/** 依年份分組，新到舊。傳入的 posts 必須已經排序。 */
export function groupByYear(posts: Post[]): { year: string; posts: Post[] }[] {
  const out: { year: string; posts: Post[] }[] = [];
  for (const post of posts) {
    const year = postYear(post);
    const last = out[out.length - 1];
    if (last && last.year === year) last.posts.push(post);
    else out.push({ year, posts: [post] });
  }
  return out;
}
