import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const writing = defineCollection({
  loader: glob({
    base: "./src/content/writing",
    pattern: "**/*.md"
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    language: z.enum(["it", "en"]),
    externalUrl: z.string().url().optional(),
    draft: z.boolean().default(false)
  })
});

export const collections = { writing };
