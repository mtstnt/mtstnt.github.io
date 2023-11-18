import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
		description: z.string(),
		publishDate: z.coerce.date(),
		heroImage: z.string().optional(),
		tags: z.array(z.string()).optional(),
		show: z.boolean().default(true),
	}),
});

const portfolios = defineCollection({
	schema: z.object({
		title: z.string(),
		description: z.string(),
		publishDate: z.coerce.date(),
	})
})

export const collections = { blog, portfolios };
