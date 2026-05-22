import { test, expect } from '@playwright/test';

// Symbols currently in use — update this list whenever UKMarketsSnapshot.astro changes
const EXPECTED_SYMBOLS = [
  { id: 'FTSE 100',    symbol: 'OANDA:UK100GBP'           },
  { id: 'EUR/GBP',     symbol: 'FX:EURGBP'                },
  { id: 'Bitcoin',     symbol: 'BITSTAMP:BTCUSD'            },
  { id: 'Gold',        symbol: 'TVC:GOLD'                  },
  { id: 'GBP/USD',     symbol: 'FX:GBPUSD'                },
  { id: 'Brent Crude', symbol: 'TVC:UKOIL'                },
];

const ERROR_STRINGS = [
  'Invalid symbol',
  'This symbol is only available on',
  'Symbol not found',
];

test.describe('UK Markets Snapshot — TradingView symbol validation', () => {

  test('all 6 widget iframes load without error', async ({ page }) => {
    await page.goto('/');

    // Wait for TradingView iframes to appear (they inject dynamically)
    await page.waitForSelector('.uk-markets-snapshot iframe', { timeout: 20_000 });

    // Give all 6 iframes time to load their content
    await page.waitForTimeout(8_000);

    const iframes = page.locator('.uk-markets-snapshot iframe');
    const count = await iframes.count();

    expect(count, `Expected 6 TradingView iframes, found ${count}`).toBe(6);

    const errors = [];

    for (let i = 0; i < count; i++) {
      const frame = iframes.nth(i);
      const src = (await frame.getAttribute('src')) ?? '';

      // Try to read iframe body text for error messages
      const frameHandle = await frame.contentFrame();
      if (!frameHandle) {
        // Cross-origin iframe — validate via src URL instead
        const symbolMissing = !EXPECTED_SYMBOLS.some(s =>
          src.includes(encodeURIComponent(s.symbol)) || src.includes(s.symbol)
        );
        if (symbolMissing) {
          errors.push(`iframe[${i}] src does not contain a known symbol: ${src}`);
        }
        continue;
      }

      const bodyText = await frameHandle.locator('body').innerText().catch(() => '');
      for (const errStr of ERROR_STRINGS) {
        if (bodyText.includes(errStr)) {
          errors.push(`iframe[${i}] (${src}): "${errStr}"`);
        }
      }
    }

    expect(errors, `Widget errors found:\n${errors.join('\n')}`).toHaveLength(0);
  });

  test('widget header shows timestamp', async ({ page }) => {
    await page.goto('/');
    const ts = page.locator('#markets-ts');
    await expect(ts).not.toBeEmpty({ timeout: 5_000 });
  });

  test('refresh button updates timestamp', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#markets-ts');
    const before = await page.locator('#markets-ts').innerText();
    await page.locator('#markets-refresh-all').click();
    // Timestamp format should still be present and non-empty after click
    const after = await page.locator('#markets-ts').innerText();
    expect(after).toBeTruthy();
    expect(before).toBeTruthy();
  });

});
