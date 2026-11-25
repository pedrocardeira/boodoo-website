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
  // The registered website app is the source of truth for BooDoo. In particular,
  // do not let a stale Vercel NEXT_PUBLIC_FIREBASE_API_KEY or appId override the
  // valid key for this project and make every login look like invalid credentials.
  return registeredWebConfig;
}
// The deployed BooDoo website must never drift to a different Firebase project
// because of stale public Vercel variables. Alternate projects remain available
// through resolveFirebaseConfig for isolated tests, but are always opt-in there.
export const firebaseWebConfig = registeredWebConfig;
