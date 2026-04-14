import { defineCollection, z } from 'astro:content';

const briefingSchema = z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.coerce.date(),
  author: z.string().default('AngloEdge'),
  image: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

export const collections = {
  briefings: defineCollection({
    type: 'content',
    schema: briefingSchema,
  }),
};
