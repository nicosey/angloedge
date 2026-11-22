// Company pages: data loading and display rules for the per-company RNS files
// exported by the pipeline into src/data/. Fully static — read at build time.
//
// Only our own fields are rendered: timestamp, category, headline, and
// our generated score/insight/themes. Announcement body text is never stored
// here and must never be rendered or synthesised.

export interface Announcement {
  timestamp: string;
  category: string | null;
  headline: string;
  url: string | null;
  enriched: boolean;
  impact_score: number | null;
  insight: string | null;
  key_themes: string[] | null;
}

export interface Company {
  name: string;
  ticker: string;
  slug: string;
  announcement_count: number;
  latest_announcement: string | null;
  announcements: Announcement[];
}

export interface CompanyIndexEntry {
  name: string;
  ticker: string;
  slug: string;
  announcement_count: number;
  latest_announcement: string | null;
}

// ── tunables ────────────────────────────────────────────────

/** Show the insight (and themes) only at or above this impact score. */
export const INSIGHT_MIN_SCORE = 5;

/** A company with no filing for longer than this is shown as inactive. */
export const INACTIVE_AFTER_DAYS = 90;

/** Cap on announcements listed in the schema.org ItemList. */
export const ITEMLIST_MAX = 100;

/**
 * Routine filing types, first match wins. A routine announcement that was
 * enriched with a score >= INSIGHT_MIN_SCORE is treated as substantive.
 * Deliberately excludes admission to trading, gearing, EQS-PVR and block
 * listings — admissions in particular are substantive events.
 */
export const ROUTINE_TYPES: { label: string; pattern: RegExp }[] = [
  { label: 'Transaction in Own Shares', pattern: /transactions? in own shares/i },
  { label: 'Holding(s) in Company',     pattern: /holding\(?s?\)? in company|notification of major holdings|\btr-?1\b/i },
  { label: 'Total Voting Rights',       pattern: /total voting rights/i },
  { label: 'Form 8.3',                  pattern: /form 8\.3/i },
  { label: 'Form 8 (DD)',               pattern: /form 8 \(dd\)/i },
  { label: 'Form 38.5',                 pattern: /(?:rule|form)\s*-?\s*38\.5/i },
  { label: 'Final Terms',               pattern: /final terms/i },
  { label: 'Disclosure Table',          pattern: /disclosure table/i },
];

// ── data ────────────────────────────────────────────────────

export function getAllCompanies(): Company[] {
  const modules = import.meta.glob<{ default: Company }>('../data/companies/*.json', { eager: true });
  return Object.values(modules).map((m) => m.default);
}

// ── dates ───────────────────────────────────────────────────
// Timestamps are naive ISO strings in UK local time. Treat them as UTC and
// format in UTC so the displayed date/time is exactly what was stored,
// whatever timezone the build runs in.

export function parseTimestamp(ts: string | null | undefined): Date | null {
  if (!ts || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(ts)) return null;
  const d = new Date(ts.endsWith('Z') ? ts : `${ts}Z`);
  return Number.isNaN(d.getTime()) ? null : d;
}

const fmt = (opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', ...opts });
const dayFmt   = fmt({ day: 'numeric', month: 'short', year: 'numeric' });
const longFmt  = fmt({ day: 'numeric', month: 'long', year: 'numeric' });
const monthFmt = fmt({ month: 'short', year: 'numeric' });
const timeFmt  = fmt({ hour: '2-digit', minute: '2-digit', hour12: false });

export const formatDay   = (d: Date) => dayFmt.format(d);
export const formatLong  = (d: Date) => longFmt.format(d);
export const formatMonth = (d: Date) => monthFmt.format(d);
export const formatTime  = (d: Date) => timeFmt.format(d);

/** Display text for one announcement's timestamp; raw text if unparseable. */
export function displayDate(ts: string): string {
  const d = parseTimestamp(ts);
  return d ? formatDay(d) : ts;
}

/** '3–19 Nov 2026', '28 Oct – 4 Nov 2026', '30 Dec 2025 – 2 Jan 2026', or a single day. */
export function formatDayRange(from: Date, to: Date): string {
  if (formatDay(from) === formatDay(to)) return formatDay(to);
  const sameYear  = from.getUTCFullYear() === to.getUTCFullYear();
  const sameMonth = sameYear && from.getUTCMonth() === to.getUTCMonth();
  if (sameMonth) return `${from.getUTCDate()}–${formatDay(to)}`;
  if (sameYear)  return `${fmt({ day: 'numeric', month: 'short' }).format(from)} – ${formatDay(to)}`;
  return `${formatDay(from)} – ${formatDay(to)}`;
}

export function dateSpan(company: Company): { first: Date | null; last: Date | null } {
  const dates = company.announcements.map((a) => parseTimestamp(a.timestamp)).filter((d): d is Date => d !== null);
  if (!dates.length) return { first: null, last: null };
  const times = dates.map((d) => d.getTime());
  return { first: new Date(Math.min(...times)), last: new Date(Math.max(...times)) };
}

const BUILD_TIME = Date.now();

/** Latest filing date if the company is inactive (no filing for INACTIVE_AFTER_DAYS), else null. */
export function inactiveSince(latest: string | null): Date | null {
  const d = parseTimestamp(latest);
  if (!d) return null;
  return BUILD_TIME - d.getTime() > INACTIVE_AFTER_DAYS * 86_400_000 ? d : null;
}

// ── display rules ───────────────────────────────────────────

export function showInsight(a: Announcement): boolean {
  return a.enriched && (a.impact_score ?? 0) >= INSIGHT_MIN_SCORE && !!a.insight;
}

/** 'minor_administrative' -> 'Minor Administrative'; keeps 'M&A' intact; de-duplicated. */
export function normaliseThemes(themes: string[] | null): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of themes ?? []) {
    const t = raw.replace(/_/g, ' ').replace(/\s+/g, ' ').trim()
      .split(' ').map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w)).join(' ');
    const key = t.toLowerCase();
    if (t && !seen.has(key)) { seen.add(key); out.push(t); }
  }
  return out;
}

/** Routine type label for an announcement, or null if it is substantive. */
export function routineType(a: Announcement): string | null {
  if (a.enriched && (a.impact_score ?? 0) >= INSIGHT_MIN_SCORE) return null;
  const hit = ROUTINE_TYPES.find((t) => t.pattern.test(a.headline ?? ''));
  return hit ? hit.label : null;
}

export type TimelineItem =
  | { kind: 'full'; a: Announcement }
  | { kind: 'compact'; a: Announcement; label: string }
  | {
      kind: 'group';
      items: Announcement[];
      counts: [string, number][];
      range: string;
    };

/**
 * Collapse routine filings. Walking newest first, every maximal run of >= 2
 * consecutive routine announcements (any mix of routine types) becomes one
 * expandable group; a lone routine announcement becomes a compact row; all
 * others render in full.
 */
export function buildTimeline(announcements: Announcement[]): TimelineItem[] {
  const out: TimelineItem[] = [];
  let run: { a: Announcement; label: string }[] = [];

  const flush = () => {
    if (run.length === 1) {
      out.push({ kind: 'compact', a: run[0].a, label: run[0].label });
    } else if (run.length > 1) {
      const counts = new Map<string, number>();
      for (const r of run) counts.set(r.label, (counts.get(r.label) ?? 0) + 1);
      const dates = run.map((r) => parseTimestamp(r.a.timestamp)).filter((d): d is Date => d !== null);
      // Range only when the run spans more than one day (the row already shows the latest date)
      const from = dates[dates.length - 1], to = dates[0];
      const range = dates.length && formatDay(from) !== formatDay(to) ? formatDayRange(from, to) : '';
      out.push({
        kind: 'group',
        items: run.map((r) => r.a),
        counts: [...counts.entries()].sort((x, y) => y[1] - x[1]),
        range,
      });
    }
    run = [];
  };

  for (const a of announcements) {
    const label = routineType(a);
    if (label) {
      run.push({ a, label });
    } else {
      flush();
      out.push({ kind: 'full', a });
    }
  }
  flush();
  return out;
}

// ── SEO ─────────────────────────────────────────────────────

export function pageTitle(c: Company): string {
  return `${c.name} (${c.ticker}) — RNS Announcements & Analysis`;
}

export function metaDescription(c: Company): string {
  const { first, last } = dateSpan(c);
  const n = c.announcement_count;
  const noun = n === 1 ? 'RNS announcement' : 'RNS announcements';
  let span = '';
  if (first && last) {
    span = formatMonth(first) === formatMonth(last) ? ` in ${formatMonth(last)}` : ` from ${formatMonth(first)} to ${formatMonth(last)}`;
  }
  const inactive = inactiveSince(c.latest_announcement);
  const latest = inactive
    ? ` No filings since ${formatDay(inactive)}.`
    : last ? ` Latest ${formatDay(last)}.` : '';
  return `${c.name} (${c.ticker}): ${n} ${noun}${span}.${latest} Headlines, impact scores and analysis from AngloEdge.`;
}

export function structuredData(c: Company, pageUrl: string): object {
  const notable = c.announcements.filter((a) => !routineType(a)).slice(0, ITEMLIST_MAX);
  const graph: object[] = [
    {
      '@type': 'Corporation',
      '@id': `${pageUrl}#company`,
      name: c.name,
      tickerSymbol: c.ticker,
      url: pageUrl,
    },
  ];
  if (notable.length) {
    graph.push({
      '@type': 'ItemList',
      name: `${c.name} RNS announcements`,
      about: { '@id': `${pageUrl}#company` },
      itemListOrder: 'https://schema.org/ItemListOrderDescending',
      numberOfItems: notable.length,
      itemListElement: notable.map((a, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: displayHeadline(a.headline, c.name),
      })),
    });
  }
  return { '@context': 'https://schema.org', '@graph': graph };
}

/** Escape JSON for safe embedding inside a <script> element. */
export function jsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

// ── headline display ────────────────────────────────────────
// EQS-routed headlines often start "Company Name plc: …", which repeats the
// page title. Strip that prefix for display only — stored data is untouched.

/** Legal forms: a prefix longer than the stored name must end in one of these. */
const LEGAL_FORMS = new Set([
  'plc', 'limited', 'ltd', 'se', 'ag', 'sa', 'sas', 'asa', 'ab', 'as', 'nv', 'oy', 'oyj',
  'inc', 'corp', 'corporation', 'kgaa', 'aktiengesellschaft', 'spa', 'llc', 'lp', 'publ',
]);

/** Legal forms plus generic and share-class words ignored when comparing names. */
const NAME_NOISE = new Set([
  ...LEGAL_FORMS, 'group', 'groupe', 'holdings', 'holding', 'the', 'and', 'company', 'co',
  'ord', 'shs', 'shares', 'n', 'e', 'cdi', 'di', 'npv', 'pref', 'reg',
]);

function nameTokens(text: string): string[] {
  return text
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .split(' ')
    .filter(Boolean);
}

const nameCore = (tokens: string[]) => tokens.filter((t) => !NAME_NOISE.has(t));

/** True if a's tokens start b's (or are equal). */
const startsWith = (a: string[], b: string[]) => a.length <= b.length && a.every((t, i) => t === b[i]);

/**
 * True when a headline prefix names the same company. Legal forms and
 * share-class words are ignored, then either the cores are identical, the
 * prefix is a short form of the name ("Novo" for "Novo Nordisk A/S"), or the
 * prefix is a fuller form that still ends in a legal form ("IDEX Biometrics
 * ASA" for "Idex Asa"). A longer prefix that doesn't end in a legal form is
 * headline content ("Aperam - Third quarter results"), so it never matches.
 */
export function isSameCompany(prefix: string, companyName: string): boolean {
  const raw = nameTokens(prefix);
  const p = nameCore(raw), n = nameCore(nameTokens(companyName));
  if (!p.length || !n.length || p[0].length < 2) return false;
  if (p.length === n.length) return p.every((t, i) => t === n[i]);
  if (p.length < n.length) return p[0].length >= 3 && startsWith(p, n);
  const last = raw.filter((t) => t !== 'company').pop() ?? '';   // 'Inc. ("Company")'
  return n[0].length >= 3 && startsWith(n, p) && LEGAL_FORMS.has(last);
}

/** Headline for display, without a leading "<this company>:" prefix. */
export function displayHeadline(headline: string, companyName: string): string {
  const m = /^\s*([^:]{2,80}?)\s*:\s+(.*)$/s.exec(headline ?? '');
  if (!m || !isSameCompany(m[1], companyName)) return headline;
  const rest = m[2].trim();
  // Keep the original if nothing meaningful is left (e.g. "Acme plc: ...")
  return /[a-z0-9]/i.test(rest.replace(/\.{3}|…/g, '')) ? rest : headline;
}

/** Index grouping key: A–Z, or '#' for names not starting with a letter. */
export function indexLetter(name: string): string {
  const ch = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().charAt(0).toUpperCase();
  return /[A-Z]/.test(ch) ? ch : '#';
}

