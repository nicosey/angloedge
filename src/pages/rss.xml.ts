import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const briefings = await getCollection('briefings');
  return rss({
    title: 'AngloEdge',
    description: 'Intelligence for UK capital markets',
    site: context.site,
    items: briefings
      .sort((a, b) => new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime())
      .map((item) => ({
        title: item.data.title,
        description: item.data.description,
        pubDate: item.data.pubDate,
        link: `/briefings/${item.slug}/`,
      })),
    customData: `<language>en-gb</language>`,
  });
}
