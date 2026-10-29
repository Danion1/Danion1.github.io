import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// One Markdown file in src/content/projects/ = one project.
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(), // one sentence, shown on the card and under the title
    order: z.number(), // smaller comes first on the home page
    status: z.enum(['published', 'coming-next']).default('published'), // coming-next: card only, no page
    tags: z.array(z.string()).max(5).default([]),
    cover: z.string().optional(), // image in public/, e.g. /media/robot-arm/arm_cad.png
    coverAlt: z.string().optional(),
    video: z.string().optional(), // mp4 in public/, shown at the top of the page
    videoCaption: z.string().optional(),
    images: z.array(z.object({ src: z.string(), alt: z.string(), caption: z.string().optional() })).default([]),
    facts: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
    repo: z.string().url().optional(),
    note: z.string().optional(), // e.g. "Simulated only", shown as a badge
  }),
});

export const collections = { projects };
