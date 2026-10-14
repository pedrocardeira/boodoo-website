import { getApps, initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserSessionPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
export function firebaseReady(){return Boolean(process.env.NEXT_PUBLIC_FIREBASE_API_KEY&&process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);}
export const cloudAlbumsEnabled=process.env.NEXT_PUBLIC_WEB_ALBUMS_ENABLED==='true';
export function firebaseClient(){
 if(!firebaseReady())throw new Error('Account access is being prepared. You can explore the demo in the meantime.');
 const app=getApps()[0]??initializeApp({apiKey:process.env.NEXT_PUBLIC_FIREBASE_API_KEY,authDomain:process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,projectId:process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,storageBucket:process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,appId:process.env.NEXT_PUBLIC_FIREBASE_APP_ID});
 return{auth:getAuth(app),db:getFirestore(app),storage:getStorage(app)};
}
export async function prepareSession(){const client=firebaseClient();await setPersistence(client.auth,browserSessionPersistence);return client;}
export function friendlyError(error:unknown){const code=(error as {code?:string})?.code;
 if(code==='auth/invalid-credential'||code==='auth/wrong-password'||code==='auth/user-not-found')return 'The email or password is incorrect. Please try again.';
 if(code==='permission-denied'||code==='storage/unauthorized')return 'Your account cannot access this information. Check Family & sync in the Boodoo app, or contact support.';
 if(code==='auth/too-many-requests')return 'Too many attempts. Please wait a little before trying again.';
 if(code==='auth/network-request-failed'||code==='unavailable')return 'We could not connect. Check your connection and try again.';
 if(code==='auth/invalid-api-key'||code==='auth/app-not-authorized'||code==='auth/operation-not-allowed')return 'Account access is not configured for this website yet. Please use the Boodoo app.';
 return error instanceof Error?error.message:'Something went wrong. Please try again.';
}
