// Keep the published storefront prices separate from unreleased app features.
// Source: Apple Spain storefront, checked 15 October 2026. StoreKit remains
// authoritative for the customer's region and the purchase terms.
export const appStoreUrl = 'https://apps.apple.com/app/id6784456363';
export const priceSourceUrl = 'https://apps.apple.com/es/app/boodoo-baby-newborn-tracker/id6784456363';
export const proPrices = { monthly: 1.99, yearly: 17.99 } as const;
export const euro = (amount: number) => `€${amount.toFixed(2)}`;

export const freeFeatures = [
  'Quick feeding, sleep and diaper logging from one main screen',
  'Breastfeeding timers, bottles, pumped milk and solid foods',
  'Today’s overview and daily records',
  'Pregnancy appointments, wellbeing check-ins and preparation lists',
  'Photos, Moments and milestones in your child’s personal story',
  'Child profiles, weight and height records',
  'Join a family shared by a Pro subscriber',
];

export const proFeatures = [
  'Full care history beyond today',
  'Insights, patterns, predictions, reports and averages',
  'Custom feeding intervals and feed and sleep notifications',
  'Share with multiple caregivers through the family owner’s registered Pro account',
  'Custom colors and themes for your family’s space',
];

export const nextUpdateFeatures = [
  { title: 'Make a plan for their sleep.', description: 'Build an editable nap and bedtime plan from your chosen windows and recent sleep records. Adjust times, add routine notes and reopen saved plans.', label: 'Personal sleep planning' },
  { title: 'See what changed this week.', description: 'Create daily, weekly, monthly or custom reviews from your records. Compare periods and keep your own notes.', label: 'Reviews & comparisons' },
  { title: 'Arrive with the details ready.', description: 'Prepare a summary and editable questions for the next appointment. Share the summary as text or PDF.', label: 'Appointment preparation' },
  { title: 'Give everyday memories a chapter.', description: 'Gather saved memories into an editable recap and save it as a new Moment, keeping the originals.', label: 'Memory recaps' },
  { title: 'Keep a book you can open anywhere.', description: 'Export your edited photo book as a digital PDF, with your photographs, captions and page arrangements.', label: 'Digital book export' },
];
