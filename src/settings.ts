export const PROFILE = {
	username: 'mtstnt',
	fullName: 'Matthew Sutanto',
	emailMasked: 'matthew.sutanto0612 [at] gmail [dot] com',
	links: {
		linkedin: 'https://www.linkedin.com/in/matthewsutanto/',
		github: 'https://github.com/mtstnt',
	},
} as const;

export const SITE_METADATA = {
	title: 'Matthew Sutanto | Portfolio & Blog',
	description: 'Personal portfolio and engineering blog.',
	url: 'https://mtstnt.github.io',
	locale: 'en_US',
	type: 'website',
	twitterCard: 'summary_large_image',
	defaultImage: '/favicon.svg',
	keywords: [
		'Matthew Sutanto',
		'mtstnt',
		'portfolio',
		'blog',
		'software engineering',
		'frontend',
		'astro',
	],
} as const;

export const WEBSITE_STRUCTURED_DATA = {
	'@context': 'https://schema.org',
	'@type': 'WebSite',
	name: SITE_METADATA.title,
	url: SITE_METADATA.url,
	description: SITE_METADATA.description,
	inLanguage: 'en',
	publisher: {
		'@type': 'Person',
		name: PROFILE.fullName,
	},
	author: {
		'@type': 'Person',
		name: PROFILE.fullName,
	},
} as const;
