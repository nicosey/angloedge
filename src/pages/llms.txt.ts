import { getCollection } from 'astro:content';

const MAX_BRIEFINGS = 30;

const clean = (text: string) =>
  text
    .replace(/\s+/g, ' ')
    .replace(/^Today's UK Capital Markets Digest\s*/i, '')
    .trim();

export async function GET(context) {
  const url = (path: string) => new URL(path, context.site).href;

  const briefings = (await getCollection('briefings'))
    .sort((a, b) => new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime())
    .slice(0, MAX_BRIEFINGS);

  const briefingLines = briefings.map((item) => {
    const date = item.data.pubDate.toISOString().slice(0, 10);
    return `- [${item.data.title}](${url(`/briefings/${item.slug}/`)}): ${date}. ${clean(item.data.description)}`;
  });

  const body = `# AngloEdge

> Intelligence for UK capital markets. AngloEdge publishes daily briefings covering UK capital markets, equity research, and regulatory insights.

Briefings are published daily as a digest of the day's UK market developments (equities, gilts, sterling, corporate activity and regulation). They are general market commentary, not investment advice. The ${briefings.length} most recent briefings are listed below; the full archive is linked under Site.

## Site

- [Home](${url('/')}): Latest briefing and UK markets snapshot
- [Briefings](${url('/briefings/')}): Full archive of briefings
- [Services](${url('/services/')}): Custom research, consulting, and advisory services for institutional investors and corporate strategists
- [About](${url('/about/')}): The team behind AngloEdge and its approach to UK capital markets intelligence
- [Contact](${url('/contact/')}): Research, speaking, advisory, and general inquiries

## Latest briefings

${briefingLines.join('\n')}

## Optional

- [RSS feed](${url('/rss.xml')}): All briefings as an RSS feed
- [Sitemap](${url('/sitemap-index.xml')}): XML sitemap of every page
- [Privacy Policy](${url('/privacy/')}): How AngloEdge handles your data
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
