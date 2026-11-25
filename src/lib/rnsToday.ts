// The daily digest written by the pipeline's rns_digest.py into src/data/rns-today.json.
// The pipeline composes the posts (each within X's 280-character limit); the site
// only renders them. Only AngloEdge's own fields: no announcement text, no outbound links.
import raw from '../data/rns-today.json';

export interface DigestItem {
  ticker: string;
  company: string;
  slug: string | null;
  score: number;
  headline: string;
  insight: string;
  timestamp: string;
}

export interface Digest {
  date: string | null;
  generated_at: string | null;
  items: DigestItem[];
  posts: string[];
}

export const digest = raw as Digest;

/** Delimiter line between posts in /rns/today.txt. Must match rns_digest.POST_DELIMITER. */
export const POST_DELIMITER = '---';
