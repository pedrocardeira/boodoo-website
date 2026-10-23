const {test}=require('node:test');
const assert=require('node:assert/strict');
const {publishedBooksPath,publishedBookFromMetadata,originalBookPDF}=require('./compiled/published-books');
const valid={fullPath:'users/owner/publishedBooks/baby/book.pdf',contentType:'application/pdf',size:120,timeCreated:'2026-10-23T12:00:00Z',customMetadata:{kind:'boodoo-digital-book-v1',childID:'baby',title:'My story',pageCount:'8'}};
test('only valid snapshots for this owner and child enter the library',()=>{
 assert.equal(publishedBookFromMetadata(valid,'owner','baby').pages,8);
 assert.equal(publishedBookFromMetadata(valid,'other','baby'),null);
 assert.equal(publishedBookFromMetadata(valid,'owner','other'),null);
 for(const change of [{size:0},{size:75*1024*1024},{fullPath:valid.fullPath+'/nested.pdf'},{contentType:'text/html'},{timeCreated:'invalid'},{customMetadata:{...valid.customMetadata,pageCount:'NaN'}},{customMetadata:{...valid.customMetadata,kind:'unknown'}}])assert.equal(publishedBookFromMetadata({...valid,...change},'owner','baby'),null);
 assert.throws(()=>publishedBooksPath('owner','../baby'));
 assert.throws(()=>publishedBooksPath('owner',''));
});
test('download preserves all original PDF bytes including page boundaries',async()=>{
 const bytes=Uint8Array.from(Buffer.from('%PDF-1.4\n1 0 obj<</Type/Pages/Count 2>>endobj\n\u0000\u00ff\n%%EOF','latin1'));
 const pdf=await originalBookPDF(new Blob([bytes]));
 assert.equal(pdf.type,'application/pdf');
 assert.deepEqual(new Uint8Array(await pdf.arrayBuffer()),bytes);
 await assert.rejects(originalBookPDF(new Blob(['<html>not a PDF</html>'])));
});
