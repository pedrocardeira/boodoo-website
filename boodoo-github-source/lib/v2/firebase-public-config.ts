// Firebase browser configuration is public, not a server credential.
// Registered BooDoo Website app, same project as iOS.
// https://firebase.google.com/docs/projects/api-keys
const registeredWebConfig = {
  "apiKey": "AIzaSyCRrupeQgkYW2YN41BhTZk6YI0F7ukAh4s",
  "authDomain": "boodoo-e5d55.firebaseapp.com",
  "projectId": "boodoo-e5d55",
  "storageBucket": "boodoo-e5d55.firebasestorage.app",
  "appId": "1:1002578931892:web:9ab899ccd77755b098a7e1"
};

type ClientConfig = typeof registeredWebConfig;
export function resolveFirebaseConfig(overrides: Partial<ClientConfig> = {}): Partial<ClientConfig> {
  const supplied = Object.fromEntries(Object.entries(overrides).filter(([,value]) => Boolean(value)));
  // Never combine production credentials with an explicitly different project.
  if (overrides.projectId && overrides.projectId !== registeredWebConfig.projectId) return supplied;
  return {...registeredWebConfig,...supplied};
}
export const firebaseWebConfig = resolveFirebaseConfig({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
});
