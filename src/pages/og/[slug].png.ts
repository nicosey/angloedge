import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import fs from 'node:fs';
import path from 'node:path';

const NAVY  = '#0A2540';
const BRASS = '#B8956A';
const WHITE = '#FFFFFF';
const DIM   = 'rgba(255,255,255,0.55)';
const TILE  = 'rgba(255,255,255,0.1)';
const GREEN = '#4ADE80';
const RED   = '#F87171';

interface Prices {
  ftse: string; ftseChg: string; ftseUp: boolean;
  gbp:  string; gbpChg:  string; gbpUp:  boolean;
  brent: string; brentChg: string; brentUp: boolean;
  gold:  string; goldChg:  string; goldUp:  boolean;
  asOf: string;
}

async function fetchPrices(): Promise<Prices> {
  const asOf = new Date().toLocaleString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZone: 'Europe/London', timeZoneName: 'short',
  });
  const blank = (): Prices => ({
    ftse: '—', ftseChg: '', ftseUp: true,
    gbp:  '—', gbpChg:  '', gbpUp:  true,
    brent:'—', brentChg:'', brentUp: true,
    gold: '—', goldChg: '', goldUp:  true,
    asOf,
  });

  const fetchSymbol = async (sym: string) => {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?interval=1d&range=1d`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AngloEdge-OG/1.0)' },
      signal: AbortSignal.timeout(8_000),
    });
    if (!res.ok) return null;
    const json = await res.json() as any;
    return json?.chart?.result?.[0]?.meta ?? null;
  };

  try {
    const [ftse, gbp, brent, gold] = await Promise.all([
      fetchSymbol('^FTSE'),
      fetchSymbol('GBPUSD=X'),
      fetchSymbol('BZ=F'),
      fetchSymbol('GC=F'),
    ]);

    const fmt = (n: number, dec = 0) =>
      n.toLocaleString('en-GB', { minimumFractionDigits: dec, maximumFractionDigits: dec });
    const pct = (meta: any) =>
      meta ? (meta.regularMarketPrice - meta.chartPreviousClose) / meta.chartPreviousClose * 100 : 0;
    const chg = (p: number) => `${p >= 0 ? '▲' : '▼'} ${Math.abs(p).toFixed(2)}%`;

    return {
      ftse:     ftse  ? fmt(ftse.regularMarketPrice)       : '—',
      ftseChg:  ftse  ? chg(pct(ftse))                    : '',
      ftseUp:   ftse  ? pct(ftse) >= 0                    : true,
      gbp:      gbp   ? fmt(gbp.regularMarketPrice, 4)    : '—',
      gbpChg:   gbp   ? chg(pct(gbp))                     : '',
      gbpUp:    gbp   ? pct(gbp) >= 0                     : true,
      brent:    brent ? `$${fmt(brent.regularMarketPrice, 2)}` : '—',
      brentChg: brent ? chg(pct(brent))                   : '',
      brentUp:  brent ? pct(brent) >= 0                   : true,
      gold:     gold  ? `$${fmt(gold.regularMarketPrice)}` : '—',
      goldChg:  gold  ? chg(pct(gold))                    : '',
      goldUp:   gold  ? pct(gold) >= 0                    : true,
      asOf,
    };
  } catch {
    return blank();
  }
}

// Satori requires every <div> to have an explicit display mode.
// Flex is used throughout to satisfy that requirement.
function tile(label: string, value: string, change: string, up: boolean) {
  return {
    type: 'div',
    props: {
      style: {
        display: 'flex', flexDirection: 'column' as const,
        backgroundColor: TILE, borderRadius: '10px',
        padding: '18px 22px', flex: '1', gap: '6px',
      },
      children: [
        {
          type: 'div',
          props: {
            style: { display: 'flex' },
            children: [{ type: 'span', props: { style: { fontSize: '11px', fontWeight: 400, color: DIM, letterSpacing: '0.1em', textTransform: 'uppercase' as const }, children: label } }],
          },
        },
        {
          type: 'div',
          props: {
            style: { display: 'flex' },
            children: [{ type: 'span', props: { style: { fontSize: '24px', fontWeight: 700, color: WHITE, lineHeight: 1.1 }, children: value } }],
          },
        },
        {
          type: 'div',
          props: {
            style: { display: 'flex' },
            children: [{ type: 'span', props: { style: { fontSize: '13px', fontWeight: 400, color: change ? (up ? GREEN : RED) : DIM }, children: change || ' ' } }],
          },
        },
      ],
    },
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  const briefings = await getCollection('briefings');
  return briefings.map(b => ({ params: { slug: b.slug } }));
};

export const GET: APIRoute = async ({ params }) => {
  const briefings = await getCollection('briefings');
  const briefing  = briefings.find(b => b.slug === params.slug);
  const title     = briefing?.data.title ?? 'AngloEdge';
  const prices    = await fetchPrices();

  const fontDir     = path.join(process.cwd(), 'node_modules/@fontsource/inter/files');
  const fontRegular = fs.readFileSync(path.join(fontDir, 'inter-latin-400-normal.woff'));
  const fontBold    = fs.readFileSync(path.join(fontDir, 'inter-latin-700-normal.woff'));

  const fontSize = title.length > 70 ? 36 : title.length > 50 ? 42 : 50;

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '1200px', height: '630px',
          backgroundColor: NAVY,
          display: 'flex', flexDirection: 'column' as const,
          padding: '60px 64px',
          fontFamily: 'Inter',
        },
        children: [
          // Brand bar
          {
            type: 'div',
            props: {
              style: { display: 'flex', flexDirection: 'row' as const, alignItems: 'center', gap: '14px', marginBottom: '44px' },
              children: [
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex', width: '36px', height: '3px', backgroundColor: BRASS },
                    children: [],
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex' },
                    children: [{ type: 'span', props: { style: { fontSize: '13px', fontWeight: 700, color: BRASS, letterSpacing: '0.14em' }, children: 'ANGLOEDGE' } }],
                  },
                },
              ],
            },
          },
          // Title
          {
            type: 'div',
            props: {
              style: { display: 'flex', flex: '1', alignItems: 'center' },
              children: [{
                type: 'div',
                props: {
                  style: { display: 'flex' },
                  children: [{
                    type: 'span',
                    props: {
                      style: { fontSize: `${fontSize}px`, fontWeight: 700, color: WHITE, lineHeight: 1.25, maxWidth: '1000px' },
                      children: title,
                    },
                  }],
                },
              }],
            },
          },
          // Price tiles row
          {
            type: 'div',
            props: {
              style: { display: 'flex', flexDirection: 'row' as const, gap: '12px', marginBottom: '20px' },
              children: [
                tile('FTSE 100', prices.ftse,  prices.ftseChg,  prices.ftseUp),
                tile('GBP/USD',  prices.gbp,   prices.gbpChg,   prices.gbpUp),
                tile('Brent',    prices.brent, prices.brentChg, prices.brentUp),
                tile('Gold',     prices.gold,  prices.goldChg,  prices.goldUp),
              ],
            },
          },
          // Footer
          {
            type: 'div',
            props: {
              style: { display: 'flex', flexDirection: 'row' as const, justifyContent: 'space-between', alignItems: 'center' },
              children: [
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex' },
                    children: [{ type: 'span', props: { style: { fontSize: '12px', color: DIM }, children: `Prices at ${prices.asOf}` } }],
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex' },
                    children: [{ type: 'span', props: { style: { fontSize: '13px', fontWeight: 700, color: BRASS }, children: 'angloedge.com' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Inter', data: fontRegular, weight: 400, style: 'normal' },
        { name: 'Inter', data: fontBold,    weight: 700, style: 'normal' },
      ],
    }
  );

  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();

  return new Response(png, {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=86400' },
  });
};
