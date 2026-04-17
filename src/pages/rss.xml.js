import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_METADATA } from '../settings';

export async function GET(context) {
	const posts = await getCollection('blog');
	return rss({
		title: SITE_METADATA.title,
		description: SITE_METADATA.description,
		site: context.site,
		items: posts.map((post) => ({
			...post.data,
			link: `/blog/${post.id}/`,
		})),
	});
}
