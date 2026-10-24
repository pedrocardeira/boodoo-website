export type FamilyPermission = 'full' | 'input' | 'removed';
/** Missing accessMode is a legacy full membership. Unknown modes fail closed. */
export function familyPermission(exists: boolean, data?: {accessMode?: unknown}): FamilyPermission {
 if (!exists) return 'removed';
 if (data?.accessMode === undefined || data.accessMode === 'full') return 'full';
 return data?.accessMode === 'input' ? 'input' : 'removed';
}
