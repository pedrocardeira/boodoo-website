import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
// Reuse the authenticated iOS quote service. It owns the supplier secret and
// verifies Firebase ID tokens. A fixed destination prevents token forwarding
// to arbitrary hosts; this route never creates an order.
const endpoint = 'https://europe-west1-boodoo-e5d55.cloudfunctions.net/prodigiSandboxQuote';
export async function POST(request: Request) {
  const authorization = request.headers.get('authorization');
  if (!authorization || !/^Bearer [A-Za-z0-9._-]+$/.test(authorization)) {
    return NextResponse.json({ error: 'Sign in to test print pricing.' }, { status: 401 });
  }
  try {
    const raw = await request.text();
    if (raw.length > 4096) return NextResponse.json({ error: 'Request too large.' }, { status: 413 });
    let input;
    try { input = JSON.parse(raw); } catch { return NextResponse.json({ error: 'Invalid request.' }, { status: 400 }); }
    if (!input || !['US', 'NL', 'BE', 'GB', 'PT'].includes(input.destinationCountryCode)
      || !['USD', 'EUR', 'GBP'].includes(input.currencyCode)
      || !Number.isInteger(input.pageCount) || input.pageCount < 24 || input.pageCount > 200
      || !Number.isInteger(input.copies) || input.copies < 1 || input.copies > 10) {
      return NextResponse.json({ error: 'Choose a supported destination, 24–200 pages, and 1–10 copies.' }, { status: 400 });
    }
    const response = await fetch(endpoint, {
      method: 'POST', headers: { Authorization: authorization, 'Content-Type': 'application/json' },
      body: JSON.stringify({ destinationCountryCode: input.destinationCountryCode, currencyCode: input.currencyCode, pageCount: input.pageCount, copies: input.copies }),
      cache: 'no-store', signal: AbortSignal.timeout(20000)
    });
    if (!response.ok) return NextResponse.json({ error: response.status === 401 ? 'Your session expired. Sign in again.' : 'Print pricing is unavailable. Please try again later.' }, { status: response.status === 401 ? 401 : 502 });
    const quote = await response.json();
    if (quote.sandbox !== true || !Array.isArray(quote.estimates)) throw new Error('Unexpected quote');
    return NextResponse.json({ sandbox: true, estimates: quote.estimates, pageCount: quote.pageCount, copies: quote.copies }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch {
    return NextResponse.json({ error: 'Print pricing is unavailable. No order was placed.' }, { status: 502 });
  }
}
