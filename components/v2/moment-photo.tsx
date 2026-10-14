"use client";

import type { Moment, MomentFraming } from "@/lib/v2/model";

export function normalizedMomentFraming(moment: Moment): MomentFraming {
  const f = moment.photoFraming;
  return {
    layout: f?.layout === "fillFrame" ? "fillFrame" : "entirePhoto",
    zoom: Number.isFinite(f?.zoom) ? Math.min(3, Math.max(1, f!.zoom)) : 1,
    offsetX: Number.isFinite(f?.offsetX) ? Math.min(.5, Math.max(-.5, f!.offsetX)) : 0,
    offsetY: Number.isFinite(f?.offsetY) ? Math.min(.5, Math.max(-.5, f!.offsetY)) : 0
  };
}

export function MomentPhotoInBook({ moment }: { moment: Moment }) {
  if (!moment.image) return null;
  const f = normalizedMomentFraming(moment);
  const fill = f.layout === "fillFrame";
  return <div className="studio-moment-photo-frame">
    <img
      className="page-photo"
      src={moment.image}
      alt={moment.title || "Album photograph"}
      style={{
        width: "100%",
        height: "100%",
        maxHeight: "none",
        objectFit: fill ? "cover" : "contain",
        transform: fill
          ? `translate(${f.offsetX * 100}%, ${f.offsetY * 100}%) scale(${f.zoom})`
          : "none",
        transformOrigin: "center"
      }}
    />
  </div>;
}

export function MomentPhotoControls({
  moment, onChange
}: {
  moment: Moment;
  onChange: (framing: MomentFraming) => void;
}) {
  if (!moment.image) return null;
  const framing = normalizedMomentFraming(moment);
  const patch = (fields: Partial<MomentFraming>) =>
    onChange({ ...framing, ...fields });

  return <fieldset className="studio-photo-framing">
    <legend>Photo alignment</legend>
    <div className="studio-photo-modes">
      <button
        type="button"
        className={framing.layout === "entirePhoto" ? "selected" : ""}
        aria-pressed={framing.layout === "entirePhoto"}
        onClick={() => patch({ layout: "entirePhoto" })}
      >Entire photo</button>
      <button
        type="button"
        className={framing.layout === "fillFrame" ? "selected" : ""}
        aria-pressed={framing.layout === "fillFrame"}
        onClick={() => patch({ layout: "fillFrame" })}
      >Fill frame</button>
    </div>
    {framing.layout === "fillFrame" && <>
      {([
        ["zoom", "Zoom", 1, 3, .05],
        ["offsetX", "Move horizontally", -.5, .5, .01],
        ["offsetY", "Move vertically", -.5, .5, .01]
      ] as const).map(([field, label, min, max, step]) =>
        <label key={field}>{label}
          <input type="range" min={min} max={max} step={step}
            aria-label={label}
            value={framing[field]}
            onChange={e=>patch({[field]:Number(e.target.value)})} />
        </label>
      )}
    </>}
    <button
      type="button"
      onClick={() => onChange({
        layout: "entirePhoto", zoom: 1, offsetX: 0, offsetY: 0
      })}
    >Reset alignment</button>
    <p>The original, full-size photograph is kept. Framing changes only its display in this album.</p>
  </fieldset>;
}
