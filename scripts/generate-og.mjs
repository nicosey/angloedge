import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

// Load Inter font (fallback to system if not available)
let fontData;
try {
  fontData = readFileSync(join(root, 'scripts/Inter-SemiBold.ttf'));
} catch {
  // Download Inter if not present
  const res = await fetch('https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hiJ-Ek-_EeA.woff2');
  const buf = await res.arrayBuffer();
  // satori needs TTF, use a bundled fallback
  fontData = null;
}

async function getFont() {
  // Use Google Fonts API to get TTF
  const css = await fetch(
    'https://fonts.googleapis.com/css2?family=Inter:wght@600&family=Source+Serif+4:wght@700&display=swap',
    { headers: { 'User-Agent': 'Mozilla/5.0' } }
  ).then(r => r.text());

  const urls = [...css.matchAll(/src: url\((.+?)\) format\('(opentype|truetype)'\)/g)].map(m => m[1]);
  const buffers = await Promise.all(urls.map(u => fetch(u).then(r => r.arrayBuffer())));
  return buffers;
}

async function generate({ title, subtitle, filename }) {
  const fonts = await getFont();

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '1200px',
          height: '630px',
          backgroundColor: '#0A2540',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 72px',
          fontFamily: 'Inter',
        },
        children: [
          // Top: logo wordmark + accent
          {
            type: 'div',
            props: {
              style: { display: 'flex', flexDirection: 'column', gap: '0px' },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      width: '48px',
                      height: '4px',
                      backgroundColor: '#B8956A',
                      marginBottom: '28px',
                    },
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '22px',
                      fontWeight: '600',
                      color: '#B8956A',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                    },
                    children: 'ANGLOEDGE',
                  },
                },
              ],
            },
          },

          // Middle: title
          {
            type: 'div',
            props: {
              style: {
                fontSize: title.length > 60 ? '48px' : '58px',
                fontWeight: '700',
                color: '#FFFFFF',
                lineHeight: '1.2',
                maxWidth: '900px',
              },
              children: title,
            },
          },

          // Bottom: subtitle
          {
            type: 'div',
            props: {
              style: {
                fontSize: '20px',
                color: '#94A3B8',
                letterSpacing: '0.02em',
              },
              children: subtitle,
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Inter', data: fonts[0], weight: 600, style: 'normal' },
      ],
    }
  );

  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
  const png = resvg.render().asPng();
  writeFileSync(join(root, 'public', filename), png);
  console.log(`✓ Generated public/${filename}`);
}

await generate({
  title: 'Intelligence for UK capital markets',
  subtitle: 'angloedge.com',
  filename: 'og-image.png',
});

console.log('Done.');
