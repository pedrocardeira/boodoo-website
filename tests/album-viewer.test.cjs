const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
test('family album route exposes viewing and export without authoring or deletion',()=>{
 const route=fs.readFileSync('components/v2/family-space.tsx','utf8');
 assert.match(route,/<AlbumViewer/);
 assert.doesNotMatch(route,/AlbumStudio|Create a book|Edit book|removeAlbum|async function saveAlbum|setDoc\(/);
 const viewer=fs.readFileSync('components/v2/album-viewer.tsx','utf8');
 assert.match(viewer,/JSON.stringify\(initial/);
 assert.match(viewer,/window.print\(\)/);
 assert.doesNotMatch(viewer,/onCrop=|onSelect=|saveLocalDraft|setDoc|contentEditable|<input|<textarea/);
});
