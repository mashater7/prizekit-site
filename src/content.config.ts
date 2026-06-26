import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
  }),
});

// Статьи-зеркало MAX-группы «Охватория». Файлы генерирует scripts/generate-site-data.mjs
// на сервере из постов группы. image/sourceUrl опциональны (пост без картинки/без ссылки).
const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    image: z.string().optional(),
    sourceUrl: z.string().optional(),
  }),
});

export const collections = { blog, articles };
