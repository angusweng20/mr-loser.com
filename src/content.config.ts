import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * 文章。
 * - 檔案位置：src/content/posts/<slug>.md
 * - URL：/posts/<slug>/  （由 frontmatter 的 slug 決定，不是檔名）
 * - 已發布的 slug 不可更改；真的要改，走 public/_redirects 做 301。
 */
const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string().min(1),
    slug: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug 只能用小寫英文、數字與連字號'),
    description: z.string().min(1).max(160),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    /** 分類，對應 site.config.ts 的 categories */
    category: z.enum(['how-to-lose', 'adhd', 'ai-technology']),
    /** 作者屬性：human 人寫、ai-assisted AI 協助整理、ai AI 產文 */
    authorship: z.enum(['human', 'ai-assisted', 'ai']).default('human'),
    /** OG 圖片，路徑以 /images/ 開頭 */
    image: z.string().optional(),
    imageAlt: z.string().optional(),
  }),
});

/** 單頁內容，例如 About。 */
const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().optional(),
  }),
});

export const collections = { posts, pages };
