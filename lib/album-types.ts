/**
 * BooDoo Signature Photo Book — shared, versioned editorial draft contract.
 *
 * This is a typed contract for the upcoming secure web editor, NOT a live
 * checkout or a printable document. Authorization must be enforced by Firebase
 * backend and Firestore/Storage rules, not by client-side route checks.
 *
 * Source spec: pedrocardeira/boodoo-ios/docs/BOODOO_SIGNATURE_BOOK_SPEC.md
 */

export const BOODOO_TEMPLATE_ID = "boodoo-signature-v1" as const;

export type BooDooBookProductId =
  | "firstMonth"
  | "threeMonths"
  | "sixMonths"
  | "firstYear"
  | "yearTwo"
  | "yearThree"
  | "yearFour"
  | "yearFive";

export type BooDooBookCategory =
  | "moment"
  | "reflection"
  | "feeding"
  | "sleep"
  | "potty"
  | "growth"
  | "health"
  | "development"
  | "activities"
  | "family";

export type BookBlockType =
  | "cover"
  | "chapterOpening"
  | "photoStory"
  | "mixedStory"
  | "achievement"
  | "growthContext"
  | "dailyReflection"
  | "closing";

export type BookSourceType = "moment" | "care" | "development" | "parentEdit";

export type BookSourceRef = {
  type: BookSourceType;
  id: string;
};

export type BookMediaRef = {
  /** Private Cloud Storage object path, never a public URL. */
  storagePath: string;
  /** Source record ID for parental consent and provenance. */
  sourceId: string;
  /** Parent-chosen crop, normalized to the unit square. */
  crop?: { x: number; y: number; width: number; height: number };
  focalPoint?: { x: number; y: number };
  /** Never store permanent public download URLs in book drafts. */
};

export type BookPage = {
  id: string;
  blockType: BookBlockType;
  category: BooDooBookCategory;
  eventDate?: string;
  sourceRefs: BookSourceRef[];
  title?: string;
  caption?: string;
  note?: string;
  media: BookMediaRef[];
  layoutId: string;
  hidden?: boolean;
  /** Explicit completed achievement; never inferred from typical age. */
  verifiedAchievement?: boolean;
};

export type AlbumDraftStatus = "draft" | "preview" | "lockedForCheckout" | "ordered";

export type AlbumDraft = {
  schemaVersion: 1;
  id: string;
  householdId: string;
  childId: string;
  ownerUid: string;
  templateId: typeof BOODOO_TEMPLATE_ID;
  productId: BooDooBookProductId;
  title: string;
  /** ISO-8601; birth-date/anniversary periods validated by backend. */
  intervalStart: string;
  intervalEnd: string;
  cover?: BookMediaRef;
  pages: BookPage[];
  status: AlbumDraftStatus;
  /** Optimistic concurrency protection for autosaved edits. */
  revision: number;
  createdAt: string;
  updatedAt: string;
};

/**
 * Derived availability is for presentation only. The backend must recompute
 * product eligibility and validate household/child ownership on each write.
 */
export type BookAvailability = {
  productId: BooDooBookProductId;
  ageComplete: boolean;
  hasEnoughMemories: boolean;
  hasEnoughPhotos: boolean;
  hasEnoughDistinctDays: boolean;
  canCreate: boolean;
};
