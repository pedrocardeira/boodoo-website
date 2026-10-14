"use client";

import { useMemo, useState } from "react";
import {
  ArrowDown, ArrowLeft, ArrowUp, BookOpen, Camera, Check,
  Heart, Moon, Pencil, RotateCcw, Save, Sparkles, Star,
  Utensils, Activity, Ruler, ShieldCheck, Type, EyeOff, Eye,
  AlertCircle
} from "lucide-react";
import {
  AlbumDraft, BookPage, BooDooBookCategory, BOODOO_TEMPLATE_ID
} from "@/lib/album-types";

/**
 * The reusable authenticated editor body. No public route or direct Firestore
 * writes here: parent shells must authenticate, authorize household+child and
 * supply a revision-checked onSave callback. Private photo URLs must be
 * short-lived and supplied only AFTER authorization.
 */
export type AlbumEditorProps = {
  draft: AlbumDraft;
  mediaUrls?: Record<string, string>;
  onSave: (draft: AlbumDraft, expectedRevision: number) => Promise<AlbumDraft>;
  onClose?: () => void;
};

type SaveStatus = "idle" | "saving" | "saved" | "failed";
const palette: Record<BooDooBookCategory, { fg: string; bg: string; label: string }> = {
  moment: { fg: "#A44D69", bg: "#FBEFF2", label: "Moment" },
  reflection: { fg: "#95694E", bg: "#FCF4E7", label: "Daily reflection" },
  feeding: { fg: "#C36734", bg: "#FFF2E7", label: "Feeding" },
  sleep: { fg: "#4277AE", bg: "#EDF5FE", label: "Sleep" },
  potty: { fg: "#2A887E", bg: "#E8F7F3", label: "Independence" },
  growth: { fg: "#607E55", bg: "#F0F6E8", label: "Growth" },
  health: { fg: "#B34D60", bg: "#FBEFF1", label: "Care" },
  development: { fg: "#7758AB", bg: "#F4EEFF", label: "Achievement" },
  activities: { fg: "#477BAC", bg: "#EAF4FA", label: "Activities" },
  family: { fg: "#A85077", bg: "#F9EEF5", label: "Family" }
};
const icons: Record<BooDooBookCategory, typeof Star> = {
  moment: Camera, reflection: Heart, feeding: Utensils, sleep: Moon,
  potty: Check, growth: Ruler, health: ShieldCheck,
  development: Star, activities: Activity, family: Heart
};

function cloneDraft(draft: AlbumDraft): AlbumDraft {
  return {
    ...draft,
    pages: draft.pages.map((p) => ({
      ...p,
      media: p.media.map((m) => ({ ...m, crop: m.crop ? { ...m.crop } : undefined })),
      sourceRefs: p.sourceRefs.map((s) => ({ ...s }))
    }))
  };
}

const controlStyle = {
  border: "1px solid #d9dce7", background: "#fff", borderRadius: 11,
  padding: "9px 12px", display: "inline-flex", alignItems: "center",
  gap: 7, color: "#263349", fontWeight: 600, cursor: "pointer"
} as const;

function Photo({
  page, mediaUrls, alt
}: {
  page: BookPage; mediaUrls: Record<string, string>; alt: string;
}) {
  const url = page.media[0]?.storagePath
    ? mediaUrls[page.media[0].storagePath] : undefined;
  if (!url) {
    return <div style={{
      display: "grid", placeItems: "center", minHeight: 180,
      background: "#F7F3F6", borderRadius: 14, color: "#7B7D89"
    }}><Camera size={30} aria-label="Photo not yet available" /></div>;
  }
  // mediaUrls comes from the authorized parent shell; never store or embed
  // permanent publicly accessible Firebase Storage download URLs.
  return <img
    src={url} alt={alt}
    style={{ width: "100%", maxHeight: 380, objectFit: "cover", borderRadius: 14 }}
  />;
}

function PreviewPage({ page, draft, mediaUrls }: {
  page: BookPage; draft: AlbumDraft; mediaUrls: Record<string, string>;
}) {
  const theme = palette[page.category] || palette.moment;
  const Icon = icons[page.category] || BookOpen;
  const isCover = page.blockType === "cover";
  return <article
    aria-label={"Album page: " + (page.title || page.blockType)}
    style={{
      maxWidth: 580, minHeight: 560, margin: "0 auto", padding: 26,
      boxShadow: "0 5px 28px #25324916",
      borderRadius: 20, background: isCover ? "#F9EDF1" : "#FFFCF9",
      display: "flex", flexDirection: "column", gap: 18
    }}
  >
    <div style={{
      display: "flex", alignItems: "center", gap: 9,
      color: theme.fg, fontWeight: 700, fontSize: 13
    }}><Icon size={17} /><span>{isCover ? "BooDoo Signature" : theme.label}</span></div>
    {isCover && <div style={{ fontSize: 14, letterSpacing: 2, color: "#A75072", fontWeight: 800 }}>
      BOODOO • A LIFE IN STORIES
    </div>}
    {page.media.length > 0 && <Photo page={page} mediaUrls={mediaUrls} alt={page.title || "Album photograph"} />}
    {page.verifiedAchievement && page.blockType === "achievement" && <div
      style={{
        alignSelf: "flex-start", padding: "7px 13px",
        background: "#F0E8FB", color: "#7758AB", borderRadius: 18,
        display: "flex", alignItems: "center", gap: 9, fontSize: 14, fontWeight: 800
      }}
    ><Sparkles size={17} /> A moment to celebrate! <Star size={14} /></div>}
    <div style={{ marginTop: "auto" }}>
      <h2 style={{
        margin: "0 0 10px", fontSize: isCover ? 34 : 29,
        fontWeight: 800, lineHeight: 1.18, color: "#273348",
        overflowWrap: "anywhere"
      }}>{page.title || (isCover ? draft.title : "Our story")}</h2>
      {page.caption && <p style={{ color: "#475367", fontSize: 17, lineHeight: 1.5 }}>{page.caption}</p>}
      {page.note && <p style={{ color: "#5A6171", fontSize: 15, lineHeight: 1.55 }}>{page.note}</p>}
    </div>
    <div style={{ borderTop: "1px solid #EEE9E9", paddingTop: 12, color: "#9295A0", fontSize: 11 }}>
      BooDoo Signature • {BOODOO_TEMPLATE_ID}
    </div>
  </article>;
}

export function AlbumEditor({ draft, mediaUrls = {}, onSave, onClose }: AlbumEditorProps) {
  const [working, setWorking] = useState<AlbumDraft>(() => cloneDraft(draft));
  const [selectedId, setSelectedId] = useState<string>(draft.pages[0]?.id || "");
  const [undo, setUndo] = useState<AlbumDraft[]>([]);
  const [dirty, setDirty] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [error, setError] = useState("");
  const [savedRevision, setSavedRevision] = useState(draft.revision);
  const selected = useMemo(() => working.pages.find((page) => page.id === selectedId),
    [working.pages, selectedId]);

  const apply = (pages: BookPage[]) => {
    if (working.status !== "draft") return;
    setUndo((history) => [...history.slice(-24), cloneDraft(working)]);
    setWorking({ ...working, pages });
    setDirty(true);
    setSaveStatus("idle");
  };

  const patch = (id: string, changes: Partial<BookPage>) =>
    apply(working.pages.map((page) => page.id === id ? { ...page, ...changes } : page));

  const move = (id: string, delta: number) => {
    const index = working.pages.findIndex((page) => page.id === id);
    const next = index + delta;
    if (index < 0 || next < 0 || next >= working.pages.length) return;
    const pages = working.pages.slice();
    [pages[index], pages[next]] = [pages[next], pages[index]];
    apply(pages);
  };

  const undoLast = () => {
    if (!undo.length || working.status !== "draft") return;
    const previous = undo[undo.length - 1];
    setUndo(undo.slice(0, -1));
    setWorking(previous);
    setDirty(true);
    setSaveStatus("idle");
  };

  const save = async () => {
    if (!dirty || saveStatus === "saving" || working.status !== "draft") return;
    setSaveStatus("saving");
    setError("");
    try {
      const updated = await onSave(cloneDraft(working), savedRevision);
      if (updated.id !== working.id || updated.childId !== working.childId
        || updated.householdId !== working.householdId) {
        throw new Error("Server returned a different album.");
      }
      setWorking(cloneDraft(updated));
      setSavedRevision(updated.revision);
      setDirty(false);
      setUndo([]);
      setSaveStatus("saved");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save this album. Please retry.");
      setSaveStatus("failed");
    }
  };

  const isEditable = working.status === "draft";
  return <main style={{
    background: "#F6F7FA", minHeight: "80vh", padding: "20px 16px 48px",
    color: "#263349", fontFamily: "system-ui, -apple-system, sans-serif"
  }}>
    <header style={{ maxWidth: 1360, margin: "0 auto 18px", display: "flex",
      alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {onClose && <button style={controlStyle} onClick={onClose} aria-label="Back to albums"><ArrowLeft size={17} /></button>}
        <div><div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1, color: "#9F5A78" }}>BOODOO SIGNATURE</div>
          <h1 style={{ fontSize: 25, fontWeight: 800, margin: 0 }}>{working.title}</h1></div>
      </div>
      <div style={{ display: "flex", gap: 9, alignItems: "center", flexWrap: "wrap" }}>
        <span aria-live="polite" style={{ fontSize: 13, color: saveStatus === "failed" ? "#B34252" : "#697383" }}>
          {saveStatus === "saving" ? "Saving…" : dirty ? "Unsaved changes"
            : saveStatus === "saved" ? "Saved" : "Saved draft"}
        </span>
        <button style={controlStyle} onClick={undoLast} disabled={!undo.length || !isEditable}>
          <RotateCcw size={16} /> Undo
        </button>
        <button onClick={save} disabled={!dirty || !isEditable || saveStatus === "saving"}
          style={{
            ...controlStyle, background: "#9F5A78", color: "white", borderColor: "#9F5A78",
            opacity: !dirty || !isEditable ? 0.6 : 1
          }}><Save size={16} /> Save draft</button>
      </div>
    </header>
    {error && <p role="alert" style={{ maxWidth: 1360, margin: "0 auto 16px",
      color: "#9A273B", background: "#FCE7E9", padding: 13, borderRadius: 12 }}>
      <AlertCircle size={16} style={{ verticalAlign: "middle" }} /> {error}
    </p>}
    <div style={{
      maxWidth: 1360, margin: "0 auto", display: "grid", gap: 16,
      gridTemplateColumns: "minmax(170px, .55fr) minmax(300px, 1.65fr) minmax(220px, .8fr)"
    }}>
      <nav aria-label="Album pages" style={{ background: "#fff", borderRadius: 18, padding: 14, alignSelf: "start", minWidth: 0 }}>
        <div style={{ fontWeight: 800, marginBottom: 12 }}>Pages ({working.pages.length})</div>
        <div style={{ display: "grid", gap: 10 }}>
          {working.pages.map((page, i) => {
            const entry = palette[page.category] || palette.moment;
            const Icon = icons[page.category] || Pencil;
            return <button key={page.id} onClick={() => setSelectedId(page.id)}
              aria-current={page.id === selectedId ? "page" : undefined}
              style={{
                textAlign: "left", display: "flex", gap: 8, padding: 10,
                border: page.id === selectedId ? "2px solid #AB5C7F" : "1px solid #E7E9EF",
                borderRadius: 12, background: page.hidden ? "#F4F4F4" : entry.bg,
                color: "#263349", cursor: "pointer", overflowWrap: "anywhere"
              }}><Icon size={17} color={entry.fg} />
                <span style={{ fontSize: 13 }}><strong>{i + 1}.</strong> {page.title || page.blockType}
                  {page.hidden && <small> (hidden)</small>}</span></button>;
          })}
        </div>
      </nav>
      <section aria-label="Album page preview" style={{ minWidth: 0 }}>
        {selected ? <PreviewPage page={selected} draft={working} mediaUrls={mediaUrls} />
          : <p>No pages in this book yet.</p>}
      </section>
      <aside aria-label="Edit selected page" style={{
        minWidth: 0, padding: 17, borderRadius: 18, background: "#fff",
        alignSelf: "start", display: "grid", gap: 14
      }}>
        <div style={{ display: "flex", gap: 9, alignItems: "center" }}><Type size={18} />
          <strong>Edit this page</strong></div>
        {!isEditable && <p>This book is locked for checkout or has been ordered. No edits are allowed.</p>}
        {selected && <>
          <label style={{ display: "grid", gap: 5, fontSize: 13, fontWeight: 700 }}>
            Title
            <input value={selected.title || ""} disabled={!isEditable}
              onChange={(e) => patch(selected.id, { title: e.target.value })}
              style={{ border: "1px solid #D9DEE8", borderRadius: 10, padding: 9, width: "100%" }} />
          </label>
          <label style={{ display: "grid", gap: 5, fontSize: 13, fontWeight: 700 }}>
            Caption
            <textarea value={selected.caption || ""} disabled={!isEditable} rows={4}
              onChange={(e) => patch(selected.id, { caption: e.target.value })}
              style={{ border: "1px solid #D9DEE8", borderRadius: 10, padding: 9, resize: "vertical", width: "100%" }} />
          </label>
          <label style={{ display: "grid", gap: 5, fontSize: 13, fontWeight: 700 }}>
            Story note
            <textarea value={selected.note || ""} disabled={!isEditable} rows={4}
              onChange={(e) => patch(selected.id, { note: e.target.value })}
              style={{ border: "1px solid #D9DEE8", borderRadius: 10, padding: 9, resize: "vertical", width: "100%" }} />
          </label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button style={controlStyle} disabled={!isEditable || working.pages[0]?.id === selected.id}
              onClick={() => move(selected.id, -1)}><ArrowUp size={16} /> Earlier</button>
            <button style={controlStyle} disabled={!isEditable || working.pages.at(-1)?.id === selected.id}
              onClick={() => move(selected.id, 1)}><ArrowDown size={16} /> Later</button>
          </div>
          <button style={controlStyle} disabled={!isEditable || selected.blockType === "cover"}
            onClick={() => patch(selected.id, { hidden: !selected.hidden })}>
            {selected.hidden ? <Eye size={16} /> : <EyeOff size={16} />}
            {selected.hidden ? "Restore this page" : "Hide from final book"}
          </button>
          <p style={{ color: "#727C8C", fontSize: 12, lineHeight: 1.5, margin: 0 }}>
            Changing or hiding an album page never deletes the original Moment or Care entry.
            Photo crop, replacement, print preview and ordering are later stages.
          </p>
        </>}
      </aside>
    </div>
  </main>;
}
