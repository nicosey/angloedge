import { digest, POST_DELIMITER } from '../../lib/rnsToday';

// One post per block, blocks separated by a line holding only "---".
// Empty on days with nothing to post.
export function GET() {
  const body = digest.posts.length ? digest.posts.join(`\n${POST_DELIMITER}\n`) + '\n' : '';
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
