/** Server-only supplier adapter. Quotes never place or pay for an order. */
export type PrintRequest={countryCode:string;pageCount:number;copies:number};
export function validatePrintRequest(value:unknown):PrintRequest {
 const x=value as Partial<PrintRequest>|null;
 if(!x||x.countryCode!=='US')throw new Error('This first supplier evaluation supports US destinations only.');
 if(!Number.isInteger(x.pageCount)||x.pageCount!<24||x.pageCount!>300||x.pageCount!%2!==0)throw new Error('Page count must be an even number between 24 and 300; final SKU limits still apply.');
 if(!Number.isInteger(x.copies)||x.copies!<1||x.copies!>10)throw new Error('Copies must be between 1 and 10.');
 return {countryCode:'US',pageCount:x.pageCount!,copies:x.copies!};
}
export function quotePayload(input:PrintRequest,sku:string){return{destinationCountryCode:input.countryCode,currencyCode:'USD',items:[{sku,copies:input.copies,attributes:{},assets:[{printArea:'default',pageCount:input.pageCount}]}]};}
export async function quoteProductionCost(input:PrintRequest){
 const key=process.env.PRODIGI_API_KEY,sku=process.env.PRODIGI_BOOK_SKU;
 if(!key||!sku)throw new Error('Supplier credentials and a verified book SKU are required.');
 const origin=process.env.PRODIGI_ENVIRONMENT==='production'?'https://api.prodigi.com':'https://api.sandbox.prodigi.com';
 const response=await fetch(origin+'/v4.0/quotes',{method:'POST',headers:{'X-API-Key':key,'Content-Type':'application/json'},body:JSON.stringify(quotePayload(input,sku)),cache:'no-store',signal:AbortSignal.timeout(15000)});
 if(!response.ok)throw new Error('The supplier could not return a quote. Check the configured product and supplier account.');
 const result=await response.json();if(!Array.isArray(result.quotes))throw new Error('The supplier returned an unexpected quote response.');
 return{mode:process.env.PRODIGI_ENVIRONMENT==='production'?'production':'sandbox',currency:'USD',kind:'supplier-production-cost-not-retail-price',quotes:result.quotes};
}
