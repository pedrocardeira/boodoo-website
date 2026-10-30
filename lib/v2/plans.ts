// Published storefront prices; StoreKit confirms regional pricing.
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
  'Join a Pro family with the permissions set by its owner',
];

export const proFeatures = [
  'Full care history beyond today',
  'Insights, patterns, predictions, reports and averages',
  'Ask BooDoo conversations with your child’s records as context',
  'Custom feeding intervals and feed and sleep notifications',
  'Invite caregivers, choose full or input-only access, and remove access in the updated app',
  'Custom colors and themes for your family’s space',
  'Editable sleep plans, reviews and period comparisons',
  'Appointment summaries and questions, memory recaps and digital book PDF export',
];

export const proTools = [
  { title: 'Make a plan for their sleep.', description: 'See naps and bedtime on a visual timeline, with total planned sleep and the next event. Activate your saved plan, choose alerts or open Edit to adjust times and routine notes. Turning the plan off cancels its alerts.', label: 'Personal sleep planning' },
  { title: 'See what changed this week.', description: 'See what changed in feeding, sleep and daily care with visual comparisons between periods. Check how many days have records, add your own notes and reopen saved reviews. Results appear first; choose Edit to change the review.', label: 'Reviews & comparisons' },
  { title: 'Arrive with the details ready.', description: 'Prepare a summary and editable questions for the next appointment. Share the summary as text or PDF.', label: 'Appointment preparation' },
  { title: 'Give everyday memories a chapter.', description: 'Gather saved memories into an editable recap and save it as a new Moment, keeping the originals.', label: 'Memory recaps' },
  { title: 'Keep a book you can open anywhere.', description: 'Export your edited photo book as a digital PDF, with your photographs, captions and page arrangements.', label: 'Digital book export' },
];
