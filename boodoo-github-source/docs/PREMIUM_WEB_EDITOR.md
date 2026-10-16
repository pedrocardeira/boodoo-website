# Premium web book editor

Implemented in the existing `/family` album flow, not a separate app. Website only; the iOS PR is a read-only model reference. Existing main-branch source selection, framing contracts, and draft creation were inspected and retained where compatible. The previously unmounted `components/AlbumEditor.tsx` is not the live route; the live implementation remains `components/v2/album-studio.tsx`.

## Saved contract

`Album.composition.version = 2` adds pages (`id`, `layout`, `sourceIDs`, `slots`), independent slots (`id`, `momentID`, `framing`), cover/back photo IDs and framing, age title, full name and book-only `textEdits`. Page/layout vocabulary follows `BooDooBookCompositionV2` in iOS PR #44. This is a portable model, not implemented cross-platform draft synchronization. Existing `Album.moments` remain intact during migration, including unknown source fields; original Moment records and image bytes are never edited by crops/captions.

Changing to fewer slots creates real following pages for overflow. Replacing the last visible use of a photograph retains it on another page. Explicit remove-page is undoable and only affects the book. Single photographs use bounded cover geometry without distortion, blur, or letterboxing. Photo-less memories join photographic pages; when no photos exist a text memory remains editable without a fake photo placeholder. Long text remains scrollable in the editor and is flagged for future print typesetting.

## Persistence

Owner-scoped IndexedDB stores browser drafts and uploaded originals, avoiding localStorage photo-size limits. Every edit queues a transaction. Existing demo localStorage drafts migrate without deleting the originals; the newer revision wins when browser/cloud copies are loaded. Save draft additionally calls the existing cloud path only when configured. Browser autosave is not cloud synchronization. Browser data can be cleared; JSON backup download/restore preserves the whole draft and validates child identity, source references and crop values. History supports 50 in-session undo steps; undo history itself is not persisted.

## Printing

Existing authenticated Prodigi sandbox quote is unchanged. No order/payment endpoint is added. Checkout remains disabled until verified SKU-specific dimensions, bleed, trim, gutter, spine, page-count limits and effective resolution validation plus a production renderer are implemented. The spine strip is a content preview with full name, age title and logo; it does not pretend to show validated physical spine dimensions. Center gutter is illustrative. Personal browser printing is not a certified print proof.

## Verification

`pnpm test`: composition migrations, chronology, 1–4 slots, crop bounds/aspect ratio across portrait/landscape frames, layout overflow, join/split, source preservation, completed calendar ages, persistence round-trip, owner isolation, backup rejection, and print lock.

`pnpm build`: production compilation, TypeScript, static routes.

Interactive local browser QA was blocked by the computer-use URL security gate. Touch/pinch behavior, responsive visual review, personal print pagination, and a real signed-in Firebase save still require interactive acceptance. Cloud rules remain an additive proposal until emulator and real-account checks pass; cloud saving is still deployment-gated. Do not claim production printing or end-to-end web/iOS draft synchronization.
