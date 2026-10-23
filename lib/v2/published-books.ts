/** Shared contract for immutable PDFs explicitly published by the iPhone app. */
export const publishedBookKind = 'boodoo-digital-book-v1';
export const maxPublishedBookBytes = 75 * 1024 * 1024;
export type PublishedBook = { path: string; title: string; date: string; pages: number };
type Metadata = { fullPath: string; contentType?: string; size: number; timeCreated: string; customMetadata?: Record<string,string> };
export function publishedBooksPath(uid: string, childID: string): string {
  if (![uid,childID].every(value => value.length > 0 && !value.includes('/'))) throw new Error('Invalid library identity');
  return `users/${uid}/publishedBooks/${childID}`;
}
export function publishedBookFromMetadata(metadata: Metadata, uid: string, childID: string): PublishedBook | null {
  const prefix = publishedBooksPath(uid, childID) + '/';
  const values = metadata.customMetadata;
  const filename = metadata.fullPath.slice(prefix.length);
  const pages = Number(values?.pageCount);
  if (!metadata.fullPath.startsWith(prefix) || !/^[a-zA-Z0-9-]+\.pdf$/.test(filename)
      || metadata.contentType !== 'application/pdf' || metadata.size <= 0 || metadata.size >= maxPublishedBookBytes
      || values?.kind !== publishedBookKind || values.childID !== childID
      || !values.title?.trim() || values.title.length > 320
      || !Number.isSafeInteger(pages) || pages < 1 || !Number.isFinite(Date.parse(metadata.timeCreated))) return null;
  return { path: metadata.fullPath, title: values.title, date: metadata.timeCreated, pages };
}
export async function originalBookPDF(blob: Blob): Promise<Blob> {
  if (blob.size <= 0 || blob.size >= maxPublishedBookBytes || await blob.slice(0,5).text() !== '%PDF-') throw new Error('Invalid PDF');
  // Set a safe MIME type without re-rendering, recompressing or changing any bytes.
  return new Blob([blob], { type: 'application/pdf' });
}
