# Premium web book editor

Implemented in the existing `/family` album flow, not a separate app. Website only; the iOS PR is a read-only model reference. Existing main-branch source selection, framing contracts, and draft creation were inspected and retained where compatible. The previously unmounted `components/AlbumEditor.tsx` is not the live route; the live implementation remains `components/v2/album-studio.tsx`.

## Saved contract

`Album.composition.version = 2` adds pages (`id`, `layout`, `sourceIDs`, `slots`), independent slots (`id`, `momentID`, `framing`), cover/back photo IDs and framing, age title, full name and book-only `textEdits`. Page/layout vocabulary follows `BooDooBookCompositionV2` in iOS PR #44. This is a portable model, not implemented cross-platform draft synchronization. Existing `Album.moments` remain intact during migration, including unknown source fields; original Moment records and image bytes are never edited by crops/captions.

Changing to fewer slots creates real following pages for overflow. Replacing the last visible use of a photograph retains it on another page. Explicit remove-page is undoable and only affects the book. Single photographs use bounded cover geometry without distortion, blur, or letterboxing. Photo-less memories join photographic pages; when no photos exist a text memory remains editable without a fake photo placeholder. Long text remains scrollable in the editor and is flagged for future print typesetting.

## Persistence

Owner-scoped IndexedDB stores browser drafts and uploaded originals, avoiding localStorage photo-size limits. Every edit queues a transaction. Existing demo localStorage drafts migrate without deleting the originals; the newer revision wins when browser/cloud copies are loaded. Save draft additionally calls the existing cloud path only when configured. Browser autosave is not cloud synchronization. Browser data can be cleared; JSON backup download/restore preserves the whole draft and validates child identity, source references and crop values. History supports 50 in-session undo steps; undo history itself is not persisted.

## Printing

The latest main-branch authenticated checkout, webhook, immutable private proof upload, staff approval and order tracking integration is preserved. The production PDF renderer now consumes the versioned composition: chosen cover/back photos, independent crops, captions, page layouts and facing-page spreads. It rejects missing sources, insufficient image resolution, text overflow and invalid physical page counts rather than silently omitting content or adding filler. Preview and export share normalized slot geometry.

Checkout remains deployment-gated and requires server-side approval tied to the exact saved revision and immutable artwork. No live order was submitted. SKU-specific trim, bleed, gutter and spine must receive production approval. The spine strip remains a content preview, not validated physical spine artwork. Personal browser printing and generated review PDFs are not certified print proofs.

## Verification

`pnpm test`: composition migrations, chronology, 1–4 slots, crop bounds/aspect ratio across portrait/landscape frames, layout overflow, join/split, source preservation, completed calendar ages, persistence round-trip, owner isolation, backup rejection, and print lock.

`pnpm build`: production compilation, TypeScript, static routes.

Local browser QA verified layout changes and save/reopen persistence. Automated PDF tests cover composition layout, source preservation and rejection paths using a mocked canvas; they are not physical print validation. Touch/pinch behavior, personal print pagination, and a real signed-in Firebase save still require interactive acceptance. Cloud rules remain an additive proposal until emulator and real-account checks pass; cloud saving is still deployment-gated. Do not claim production printing or end-to-end web/iOS draft synchronization.
