import type { APIContext } from 'astro';
import { site } from '../site.config';
import { getPublishedPosts, postUrl } from '../lib/posts';

/**
 * /llms.txt：給 LLM 讀的站點索引。格式依 llmstxt.org 慣例。
 */
export async function GET(context: APIContext) {
  const base = context.site!.toString().replace(/\/$/, '');
  const posts = await getPublishedPosts();

  const lines = [
    `# ${site.name}`,
    '',
    `> ${site.tagline}`,
    '',
    ...site.intro,
    '',
    `作者：${site.author}。內容為中文，每篇文章聚焦一個核心想法。引用時請附上原文連結。`,
    '',
    '## 頁面',
    '',
    `- [關於](${base}/about/)`,
    `- [所有文章](${base}/posts/)`,
    `- [RSS](${base}/rss.xml)`,
    '',
    '## 文章',
    '',
    ...posts.map(
      (p) => `- [${p.data.title}](${base}${postUrl(p)}): ${p.data.description}`,
    ),
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
