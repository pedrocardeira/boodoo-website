// This portal only supports professional identity, verification and consented
// record access. Requests must not fall through to other backend operations.
const requestFields = {
  status: [],
  profile: [],
  register: ['name', 'city', 'languages', 'biography', 'registrationNumber', 'visaNumber', 'authority', 'insuranceValidUntil', 'credentialPath', 'country', 'requestedRegions'],
  setAvailability: ['acceptingPatients'],
  patients: [],
  medicalRecords: ['linkID', 'scope'],
  reviewQueue: [],
  review: ['doctorUID', 'status', 'verificationSource', 'verificationExpiresAt', 'licensedRegions', 'identityVerified', 'licenseVerified', 'specialistVerified', 'insuranceVerified'],
} as const;

export type PediatricsPortalAction = keyof typeof requestFields;

export function isPortalRequest(input: unknown): input is Record<string, unknown> & { action: PediatricsPortalAction } {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return false;
  const request = input as Record<string, unknown>;
  if (typeof request.action !== 'string' || !Object.hasOwn(requestFields, request.action)) return false;
  const allowed: readonly string[] = requestFields[request.action as PediatricsPortalAction];
  return Object.keys(request).every(key => key === 'action' || allowed.includes(key));
}

const profileFields = ['uid', 'name', 'city', 'country', 'languages', 'biography', 'status', 'acceptingPatients', 'profileCode', 'verification'];
const verificationFields = ['registrationNumber', 'visaNumber', 'authority', 'credentialPath', 'insuranceValidUntil'];
function select(value: unknown, fields: readonly string[]): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value).filter(([key]) => fields.includes(key)));
}
function profile(value: unknown) {
  if (!value) return null;
  const result = select(value, profileFields);
  if (result.verification) result.verification = select(result.verification, verificationFields);
  return result;
}

// Project legacy responses too: old commercial configuration must never reach
// the browser, even while a preview is pointed at an older backend revision.
export function portalResponse(action: PediatricsPortalAction, body: unknown): unknown {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return body;
  const value = body as Record<string, unknown>;
  if (value.error) return select(value, ['error']);
  switch (action) {
    case 'status': return select(value, ['enabled', 'registrationEnabled', 'clinicalEnabled', 'reviewer']);
    case 'profile': return { profile: profile(value.profile) };
    case 'reviewQueue': return { profiles: Array.isArray(value.profiles) ? value.profiles.map(profile) : [] };
    default: return body;
  }
}
