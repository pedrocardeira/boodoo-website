export type TrafficPageContent = {
  slug: string;
  metadataTitle: string;
  description: string;
  eyebrow: string;
  title: string;
  intro: string;
  highlights: Array<{ title: string; text: string }>;
  sections: Array<{
    title: string;
    paragraphs: string[];
    bullets?: string[];
  }>;
  faq: Array<{ question: string; answer: string }>;
  externalSources?: Array<{ label: string; href: string }>;
};

export const trafficPages = {
  free: {
    slug: "free-baby-tracker-app",
    metadataTitle: "Free Baby Tracker App for Feeding, Sleep & Diapers | BooDoo",
    description:
      "Download BooDoo free and track your baby’s feeding, sleep, diapers and growth in one calm iPhone and iPad app with visible medical references.",
    eyebrow: "Free baby tracker app",
    title: "Start tracking your baby for free—without the clutter.",
    intro:
      "BooDoo brings feeds, sleep, diapers, growth and daily goals into one clear dashboard. Start with the free experience, then choose Pro only if you want longer history, deeper reports and additional customization.",
    highlights: [
      {
        title: "One calm dashboard",
        text: "See the latest feed, sleep state, diapers and daily progress together."
      },
      {
        title: "Useful from day one",
        text: "Record the details parents are most often asked to remember."
      },
      {
        title: "Sources stay visible",
        text: "Educational guidance links back to recognized pediatric sources."
      }
    ],
    sections: [
      {
        title: "What you can track with BooDoo",
        paragraphs: [
          "Newborn days are full of small details that are easy to forget: the last bottle, the length of a nap, a diaper change or a new weight measurement. BooDoo keeps those entries together so you can check the day instead of reconstructing it from memory.",
          "The free experience is designed to let parents understand the core workflow before deciding whether the additional Pro tools are useful for their family."
        ],
        bullets: [
          "Milk and bottle-feed entries",
          "Sleep and awake-time tracking",
          "Poop and diaper records",
          "Weight and height records",
          "Daily goals and age-adapted context",
          "Visible links to medical references"
        ]
      },
      {
        title: "When BooDoo Pro becomes useful",
        paragraphs: [
          "Some families only need a simple daily log. Others want to look back across several days, compare patterns, receive alerts or change the way the app looks. BooDoo Pro is for that second stage.",
          "Pro adds full history, deeper reports, feed and sleep alerts, custom feeding intervals and visual customization. Current prices and trial eligibility are always shown in the App Store before purchase."
        ]
      },
      {
        title: "A tracker—not a medical diagnosis",
        paragraphs: [
          "BooDoo organizes the information you enter and provides educational context. It cannot determine whether an individual baby is healthy and never replaces professional medical advice.",
          "Contact a qualified healthcare professional whenever you are concerned about feeding, hydration, breathing, sleep, growth, diaper output or your baby’s general condition."
        ]
      }
    ],
    faq: [
      {
        question: "Is BooDoo free to download?",
        answer:
          "Yes. BooDoo is free to download. Optional BooDoo Pro features and current regional pricing are shown in the App Store."
      },
      {
        question: "What does the free baby tracker record?",
        answer:
          "BooDoo’s core experience brings feeding, sleep, diapers, weight, height and daily context into one baby record."
      },
      {
        question: "Do I need Pro immediately?",
        answer:
          "No. Start with the free experience and decide later whether full history, deeper reports, alerts and customization are useful to you."
      },
      {
        question: "Is BooDoo medical software?",
        answer:
          "No. BooDoo is a tracking and educational app. It does not diagnose, treat or replace advice from a qualified healthcare professional."
      }
    ]
  },
  iphone: {
    slug: "baby-tracker-iphone",
    metadataTitle: "Baby Tracker for iPhone & iPad | BooDoo",
    description:
      "Track feeding, sleep, diapers, wake windows and growth on iPhone and iPad with BooDoo’s fast, one-tap baby dashboard.",
    eyebrow: "Baby tracker for iPhone",
    title: "A baby tracker designed for the iPhone in your hand at 3 a.m.",
    intro:
      "BooDoo keeps the essential actions close: record a feed, switch between asleep and awake, log a diaper and check the day without searching through layers of menus.",
    highlights: [
      {
        title: "Fast on iPhone",
        text: "Quick controls are built around one-handed use during busy feeds and wake-ups."
      },
      {
        title: "Comfortable on iPad",
        text: "The same baby record is optimized for both iPhone and iPad."
      },
      {
        title: "One connected day",
        text: "Feeds, sleep, diapers and growth stay in the same visual timeline."
      }
    ],
    sections: [
      {
        title: "The important information stays on the dashboard",
        paragraphs: [
          "A baby tracker should reduce mental work, not create another admin task. BooDoo’s main screen keeps the latest feed, current sleep state, awake time, daily totals and quick logging controls together.",
          "That means fewer calculations and fewer taps when your attention is already divided between your baby, a bottle and the rest of the family."
        ],
        bullets: [
          "Quick feeding entries",
          "Sleep and awake controls",
          "Automatic duration and interval calculations",
          "Diaper color and timing records",
          "Weight and height tracking",
          "Reports and alerts with BooDoo Pro"
        ]
      },
      {
        title: "Made for everyday tracking—not endless setup",
        paragraphs: [
          "You can begin with the information that matters today and add detail as your routine develops. The interface is deliberately calm, with clear actions and readable summaries instead of a crowded clinical screen.",
          "BooDoo also keeps educational sources visible, so a recommendation is not presented as an unexplained number."
        ]
      },
      {
        title: "From a quick tap to a useful record",
        paragraphs: [
          "One feed or nap only describes a moment. Consistent entries create a clearer picture of the day and make conversations with another caregiver or healthcare professional easier.",
          "BooDoo helps you organize that record. It remains an educational tracker and does not provide a medical diagnosis."
        ]
      }
    ],
    faq: [
      {
        question: "Does BooDoo work on both iPhone and iPad?",
        answer: "Yes. BooDoo is designed for iPhone and iPad."
      },
      {
        question: "Can I track feeding and sleep in the same app?",
        answer:
          "Yes. Feeding, sleep, awake time, diapers, weight and height are kept in the same baby record."
      },
      {
        question: "Can BooDoo calculate intervals?",
        answer:
          "BooDoo shows useful timing such as the last feed interval, sleep duration and current awake time from your entries."
      },
      {
        question: "Is there a free version?",
        answer:
          "Yes. BooDoo is free to download, with optional Pro tools for full history, deeper reports, alerts and customization."
      }
    ]
  },
  huckleberry: {
    slug: "huckleberry-alternative",
    metadataTitle: "Huckleberry Alternative for Simple Baby Tracking | BooDoo",
    description:
      "Compare BooDoo and Huckleberry for feeding, sleep, diaper and growth tracking. See which approach better fits your family’s daily routine.",
    eyebrow: "Huckleberry alternative",
    title: "BooDoo or Huckleberry? Choose the kind of help you actually need.",
    intro:
      "Both apps can help parents record daily care, but they emphasize different things. Huckleberry offers a broad sleep-focused membership system; BooDoo focuses on a calm all-in-one log with age-adapted explanations and visible medical sources.",
    highlights: [
      {
        title: "Choose BooDoo for clarity",
        text: "A focused iPhone and iPad tracker with daily goals and visible references."
      },
      {
        title: "Choose Huckleberry for sleep depth",
        text: "Its paid plans emphasize sleep predictions, insights and expert-designed plans."
      },
      {
        title: "Try before deciding",
        text: "Both products offer a free starting point; compare the workflow that feels natural."
      }
    ],
    sections: [
      {
        title: "The short comparison",
        paragraphs: [
          "BooDoo is built for parents who want feeds, sleep, diapers, growth, goals and explanations in a compact daily dashboard. It keeps source links visible and uses the information you enter to explain the day without presenting itself as a diagnosis.",
          "Huckleberry’s free tier includes tracking and reports. Its Plus and Premium memberships add tools such as SweetSpot sleep predictions, data-driven insights, easier logging methods, an AI parenting assistant and expert-designed sleep plans. Feature availability may vary by age, device and plan."
        ],
        bullets: [
          "BooDoo: iPhone and iPad",
          "Huckleberry: iOS and Android",
          "Both: feeding, sleep and diaper tracking",
          "BooDoo: visible source-linked educational guidance",
          "Huckleberry paid plans: deeper prediction and coaching tools",
          "Both: optional paid upgrades"
        ]
      },
      {
        title: "When BooDoo may fit better",
        paragraphs: [
          "Consider BooDoo if you want a simpler dashboard, your main routine is bottle or milk tracking alongside sleep and diapers, and you value seeing the source behind age-adapted guidance.",
          "BooDoo is also a natural choice when your household uses iPhone or iPad and you prefer a focused tracker over a larger parenting membership."
        ]
      },
      {
        title: "When Huckleberry may fit better",
        paragraphs: [
          "Consider Huckleberry if sleep prediction is your highest priority, you want Android support, or you specifically want its Plus or Premium sleep and coaching features.",
          "The best test is practical: enter several real feeds, naps and diaper changes in each app and keep the one you can still use comfortably during a difficult night."
        ]
      }
    ],
    faq: [
      {
        question: "Is BooDoo connected to Huckleberry?",
        answer:
          "No. BooDoo and Huckleberry are separate products. This independent comparison is published by BooDoo and clearly reflects that perspective."
      },
      {
        question: "Does BooDoo predict sleep like Huckleberry SweetSpot?",
        answer:
          "BooDoo tracks sleep, awake time, goals and patterns. Parents specifically seeking Huckleberry’s SweetSpot predictions should compare that paid feature directly."
      },
      {
        question: "Which app is better for visible medical references?",
        answer:
          "BooDoo is deliberately designed to keep recognized medical source links visible alongside its educational guidance."
      },
      {
        question: "Can I try both apps for free?",
        answer:
          "Both products currently offer a free starting tier. Check each App Store listing for the latest plan, trial and regional pricing details."
      }
    ],
    externalSources: [
      {
        label: "Huckleberry: current membership features and pricing",
        href: "https://huckleberrycare.com/pricing"
      }
    ]
  }
} satisfies Record<string, TrafficPageContent>;

export const allTrafficPages = Object.values(trafficPages);
