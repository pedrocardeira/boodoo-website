/**
 * Zero-dependency, print-size PDF proof builder for the BooDoo web editor.
 * It rasterizes each complete page at 300 dpi into RGB JPEG, then packages
 * the pixels into a PDF with exact physical MediaBoxes. No browser print CSS,
 * placeholder photos, crop marks, blank filler or external PDF service.
 *
 * Important: this is a PRINT PROOF, not a certified PDF/X-4 file. An operator
 * must inspect artwork and Prodigi SKU/print-area requirements before signing.
 */
import type { Album, Moment } from './model';

const DPI = 300;
const MM_TO_IN = 1 / 25.4;
const PT_PER_MM = 72 / 25.4;
export type PrintFormat = { widthMm: number; heightMm: number; minPages: number; maxPages: number };
export const SQUARE_HARDCOVER: PrintFormat = { widthMm: 210, heightMm: 210, minPages: 24, maxPages: 300 };
export type PrintProof = { blob: Blob; pageCount: number; widthMm: number; heightMm: number; warnings: string[] };

type PlannedPage =
  | { kind: 'cover'|'back'; moment: Moment | undefined }
  | { kind: 'story'; moment: Moment; part: string; first: boolean }
  | { kind: 'chapter' };

function assertFormat(f: PrintFormat) {
  if (![f.widthMm, f.heightMm, f.minPages, f.maxPages].every(Number.isFinite) ||
      f.widthMm < 140 || f.widthMm > 300 || f.heightMm < 140 || f.heightMm > 300 ||
      f.minPages < 18 || f.maxPages > 300 || f.maxPages < f.minPages)
    throw new Error('Unsupported print dimensions or book page range.');
}
function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const out: string[] = [];
  for (const paragraph of text.replace(/\r/g, '').split('\n')) {
    if (!paragraph.trim()) { out.push(''); continue; }
    let line = '';
    for (const word of paragraph.split(/\s+/)) {
      if (!word) continue;
      if (ctx.measureText(word).width > maxWidth) {
        throw new Error('A word is too long to print without clipping. Edit the memory text.');
      }
      const proposal = line ? line + ' ' + word : word;
      if (line && ctx.measureText(proposal).width > maxWidth) {
        out.push(line); line = word;
      } else line = proposal;
    }
    if (line) out.push(line);
  }
  return out;
}
function canvasFor(f: PrintFormat) {
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(f.widthMm * MM_TO_IN * DPI);
  canvas.height = Math.round(f.heightMm * MM_TO_IN * DPI);
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) throw new Error('Your browser cannot generate a print proof.');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  return { canvas, ctx };
}
function parseDate(date: string): string {
  const parsed = Date.parse(date);
  return Number.isFinite(parsed)
    ? new Date(parsed).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';
}
async function photo(moment: Moment | undefined): Promise<HTMLImageElement | null> {
  if (!moment?.image) return null;
  if (!moment.width || !moment.height || Math.min(moment.width, moment.height) < 1800)
    throw new Error('Replace a low-resolution photo in ' + (moment.title || 'this memory') + ' before exporting.');
  if (/^data:/i.test(moment.image) && !/^data:image\/(jpeg|png|webp);base64,/i.test(moment.image))
    throw new Error('Unsupported embedded image type.');
  if (!/^data:/i.test(moment.image)) {
    const parsed = new URL(moment.image, window.location.origin);
    if (!['https:', 'http:'].includes(parsed.protocol)) throw new Error('Unsupported memory photo URL.');
  }
  const image = new Image();
  image.crossOrigin = 'anonymous';
  image.decoding = 'sync';
  image.src = moment.image;
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error('A full-resolution photo could not be loaded. Check image access/CORS.'));
  });
  return image;
}
function photoDraw(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number,
                   width: number, height: number, moment: Moment, minDpi: number) {
  const { width: sw, height: sh } = img;
  // No artificial blur, photo repetition, or incorrect stretching.
  const framing = moment.photoFraming;
  const mode = framing?.layout === 'entirePhoto' ? 'contain' : 'cover';
  const zoom = Math.max(1, Math.min(3, framing?.zoom || 1));
  const base = mode === 'contain' ? Math.min(width / sw, height / sh) : Math.max(width / sw, height / sh);
  const scale = base * zoom;
  // Reject blurry effective resolution instead of silently upscaling photographs.
  const embeddedDpi = DPI / Math.max(scale, 0.000001);
  if (embeddedDpi < minDpi) throw new Error('A photograph has insufficient pixels for its chosen print crop (minimum ' + minDpi + ' dpi).');
  const offsetX = Math.min(1, Math.max(-1, framing?.offsetX || 0));
  const offsetY = Math.min(1, Math.max(-1, framing?.offsetY || 0));
  const dw = sw * scale, dh = sh * scale;
  const px = x + (width - dw) / 2 + offsetX * Math.max(0, dw - width) / 2;
  const py = y + (height - dh) / 2 + offsetY * Math.max(0, dh - height) / 2;
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, width, height); ctx.clip();
  ctx.fillStyle = '#f4efe9'; ctx.fillRect(x, y, width, height);
  ctx.drawImage(img, px, py, dw, dh); ctx.restore();
}
function textLines(ctx: CanvasRenderingContext2D, lines: string[], x: number, y: number,
                   lineHeight: number, maxY: number) {
  for (const line of lines) {
    if (y + lineHeight > maxY) throw new Error('Story text would be cut. Split it into another page.');
    if (line) ctx.fillText(line, x, y); y += lineHeight;
  }
}
function splitStory(moment: Moment, format: PrintFormat, title: string): PlannedPage[] {
  // Estimate line count using the same browser canvas and fonts as final draw.
  // Long memories extend to text-only continuation pages, never clip.
  const { canvas, ctx } = canvasFor(format);
  const px = canvas.width / format.widthMm;
  const side = Boolean(moment.image);
  const contentWidth = (side ? format.widthMm * 0.36 - 18 : format.widthMm - 36) * px;
  const fontSize = Math.max(11, Math.round(3.1 * px));
  ctx.font = fontSize + 'px system-ui, Arial, sans-serif';
  const lines = wrap(ctx, moment.notes || '', contentWidth);
  const lineHeight = Math.round(4.8 * px);
  const maxLines = side ? Math.max(2, Math.floor((format.heightMm - 100) * px / lineHeight))
                        : Math.max(2, Math.floor((format.heightMm - 95) * px / lineHeight));
  const out: PlannedPage[] = [];
  // First page has the photo when present, plus a limited narrative side column.
  const first = lines.splice(0, maxLines).join('\n');
  out.push({ kind: 'story', moment, part: first, first: true });
  while (lines.length) {
    const extra = lines.splice(0, Math.max(2, maxLines + 5)).join('\n');
    out.push({ kind: 'story', moment, part: extra, first: false });
  }
  return out;
}
export function planPrintPages(album: Album, format: PrintFormat = SQUARE_HARDCOVER): PlannedPage[] {
  assertFormat(format);
  if (!album.title?.trim() || !Array.isArray(album.moments)) throw new Error('Finish the album first.');
  const moments = album.moments.filter(m => m.title?.trim() || m.notes?.trim() || m.image);
  if (!moments.length) throw new Error('A book needs memories to print.');
  const pages: PlannedPage[] = [{ kind: 'cover', moment: moments.find(m => m.image) }];
  for (const moment of moments) pages.push(...splitStory(moment, format, album.title));
  // An odd interior page count is balanced with an authentic contents/chronology page.
  if ((pages.length + 1) % 2 !== 0) pages.push({ kind: 'chapter' });
  pages.push({ kind: 'back', moment: [...moments].reverse().find(m => m.image) });
  if (pages.length < format.minPages) throw new Error(
    'This book needs at least ' + format.minPages + ' printable pages, including the covers. It currently has ' +
    pages.length + '. Add meaningful memories rather than blank pages.');
  if (pages.length > format.maxPages) throw new Error('This book exceeds the supplier page limit.');
  return pages;
}
function drawPage(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, album: Album,
                  page: PlannedPage, loaded: HTMLImageElement | null, format: PrintFormat, num: number) {
  const px = canvas.width / format.widthMm, W = canvas.width, H = canvas.height;
  const safe = 10 * px;
  ctx.fillStyle = '#fffaf5'; ctx.fillRect(0, 0, W, H);
  if (page.kind === 'cover' || page.kind === 'back') {
    if (loaded && page.moment) photoDraw(ctx, loaded, 0, 0, W, H, page.moment, 260);
    else { ctx.fillStyle = '#d9d7d0'; ctx.fillRect(0, 0, W, H); }
    const baseY = H - safe - 38 * px;
    const grad = ctx.createLinearGradient(0, H * 0.55, 0, H);
    grad.addColorStop(0, 'rgba(13,22,37,0)'); grad.addColorStop(1, 'rgba(13,22,37,.78)');
    ctx.fillStyle = grad; ctx.fillRect(0, H * 0.5, W, H * 0.5);
    ctx.fillStyle = '#fffaf2'; ctx.textAlign = 'left';
    if (page.kind === 'cover') {
      ctx.font = 'bold ' + (10 * px) + 'px system-ui, Arial, sans-serif';
      const heading = wrap(ctx, album.title, W - 2 * safe);
      if (heading.length > 3) throw new Error('The cover title is too long.');
      textLines(ctx, heading, safe, baseY, 13 * px, H - safe - 12 * px);
      ctx.font = (3.2 * px) + 'px system-ui, Arial, sans-serif';
      ctx.fillText(album.period || '', safe, H - safe - 4 * px);
    } else {
      ctx.font = (3.3 * px) + 'px system-ui, Arial, sans-serif';
      ctx.fillText(album.period || '', safe, H - safe - 5 * px);
    }
  } else if (page.kind === 'chapter') {
    ctx.textAlign = 'left'; ctx.fillStyle = '#263449';
    ctx.font = 'bold ' + (8 * px) + 'px system-ui, Arial, sans-serif';
    ctx.fillText('Our chapter', safe + 4 * px, safe + 20 * px);
    ctx.font = (3.7 * px) + 'px system-ui, Arial, sans-serif';
    const dates = album.moments.map(m => Date.parse(m.date)).filter(Number.isFinite).sort((a,b) => a - b);
    const start = dates.length ? parseDate(new Date(dates[0]).toISOString()) : '';
    const end = dates.length ? parseDate(new Date(dates[dates.length - 1]).toISOString()) : '';
    const lines = [album.period || '', start && end ? start + ' - ' + end : '', '',
      ...album.moments.filter(m => m.title?.trim()).slice(0, 12).map(m => m.title.trim())];
    textLines(ctx, lines, safe + 4 * px, safe + 34 * px, 9 * px, H - safe);
  } else {
    const m = page.moment;
    const first = page.first;
    const withPhoto = first && loaded && Boolean(m.image);
    const sidebarWidth = W * 0.36;
    if (withPhoto) photoDraw(ctx, loaded!, 0, 0, W - sidebarWidth, H, m, 260);
    ctx.textAlign = 'left'; ctx.fillStyle = '#263449';
    const startX = withPhoto ? W - sidebarWidth + 9 * px : safe + 8 * px;
    const available = withPhoto ? sidebarWidth - 18 * px : W - 2 * safe - 16 * px;
    let y = safe + 13 * px;
    ctx.font = (2.6 * px) + 'px system-ui, Arial, sans-serif';
    ctx.fillStyle = '#997663';
    ctx.fillText(parseDate(m.date), startX, y);
    y += 11 * px;
    ctx.fillStyle = '#243248'; ctx.font = 'bold ' + (withPhoto ? 4.4 : 7) * px + 'px system-ui, Arial, sans-serif';
    const titleLines = wrap(ctx, m.title || 'A little memory', available);
    if (titleLines.length > (withPhoto ? 4 : 5)) throw new Error('A memory title is too long for print.');
    textLines(ctx, titleLines, startX, y, (withPhoto ? 6.2 : 9) * px, H - safe - 28 * px);
    y += 8 * px;
    ctx.font = (3.1 * px) + 'px system-ui, Arial, sans-serif';
    const lines = wrap(ctx, page.part, available);
    textLines(ctx, lines, startX, y, 4.8 * px, H - safe);
    if (!m.image && !m.notes.trim() && !m.title.trim()) throw new Error('Empty story page.');
    if (first && m.image && !m.title.trim() && !m.notes.trim()) {
      // Photo without a caption or story fills the whole page, no text overlay.
      ctx.fillStyle = '#fffaf5'; ctx.fillRect(0, 0, W, H);
      photoDraw(ctx, loaded!, 0, 0, W, H, m, 260);
    }
  }
}
async function jpg(canvas: HTMLCanvasElement): Promise<Uint8Array> {
  const b = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(v => v ? resolve(v) : reject(new Error('JPEG export failed.')), 'image/jpeg', 0.93));
  return new Uint8Array(await b.arrayBuffer());
}
/** Simple PDF 1.4 writer with one full-bleed RGB DCTDecode image per page. */
function packageImages(frames: Uint8Array[], format: PrintFormat, width: number, height: number): Blob {
  const encoder = new TextEncoder();
  const parts: BlobPart[] = [];
  let offset = 0;
  const xrefs: number[] = [0];
  function append(chunk: string | Uint8Array) {
    const bytes = typeof chunk === 'string' ? encoder.encode(chunk) : chunk;
    parts.push(bytes as BlobPart); offset += bytes.length;
  }
  function object(id: number, body: string | Uint8Array[]) {
    xrefs[id] = offset;
    append(id + ' 0 obj\n');
    if (typeof body === 'string') append(body);
    else for (const part of body) append(part);
    append('\nendobj\n');
  }
  const ptW = (format.widthMm * PT_PER_MM).toFixed(3);
  const ptH = (format.heightMm * PT_PER_MM).toFixed(3);
  append('%PDF-1.4\n');
  const total = 2 + frames.length * 3;
  object(1, '<< /Type /Catalog /Pages 2 0 R >>');
  object(2, '<< /Type /Pages /Count ' + frames.length + ' /Kids [' +
    frames.map((_, i) => (3 + i * 3) + ' 0 R').join(' ') + '] >>');
  frames.forEach((frame, i) => {
    const id = 3 + i * 3;
    const contents = 'q\n' + ptW + ' 0 0 ' + ptH + ' 0 0 cm\n/Photo Do\nQ\n';
    const stream = encoder.encode(contents);
    object(id, '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ' + ptW + ' ' + ptH +
      '] /Resources << /XObject << /Photo ' + (id + 1) + ' 0 R >> >> /Contents ' + (id + 2) + ' 0 R >>');
    object(id + 1, [
      encoder.encode('<< /Type /XObject /Subtype /Image /Width ' + width + ' /Height ' + height +
        ' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ' + frame.length +
        ' >>\nstream\n'), frame, encoder.encode('\nendstream') ]);
    object(id + 2, '<< /Length ' + stream.length + ' >>\nstream\n' + contents + 'endstream');
  });
  const startXref = offset;
  append('xref\n0 ' + (total + 1) + '\n0000000000 65535 f \n');
  for (let i = 1; i <= total; i++) append(String(xrefs[i]).padStart(10, '0') + ' 00000 n \n');
  append('trailer\n<< /Size ' + (total + 1) + ' /Root 1 0 R >>\nstartxref\n' + startXref + '\n%%EOF\n');
  return new Blob(parts, { type: 'application/pdf' });
}
export async function createPrintProof(
  album: Album, format: PrintFormat = SQUARE_HARDCOVER,
  progress?: (current: number, total: number) => void
): Promise<PrintProof> {
  const pages = planPrintPages(album, format);
  const {canvas, ctx} = canvasFor(format);
  const frames: Uint8Array[] = [];
  // Sequential load/render is deliberate: limits peak memory and makes failures clear.
  for (let i = 0; i < pages.length; i++) {
    const current = pages[i];
    const loaded = current.kind === 'cover' || current.kind === 'back' || current.kind === 'story' && current.first
      ? await photo(current.moment) : null;
    drawPage(ctx, canvas, album, current, loaded, format, i);
    frames.push(await jpg(canvas));
    progress?.(i + 1, pages.length);
  }
  return {
    blob: packageImages(frames, format, canvas.width, canvas.height),
    pageCount: frames.length, widthMm: format.widthMm, heightMm: format.heightMm,
    warnings: ['Proof requires manual SKU/page-count/colour/PDF/X-4 preflight and approval before live printing.'],
  };
}
