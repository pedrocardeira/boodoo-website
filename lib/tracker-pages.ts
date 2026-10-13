export type TrackerPageContent = {
  slug: string;
  metadataTitle: string;
  title: string;
  description: string;
  eyebrow: string;
  intro: string;
  image: string;
  imageAlt: string;
  highlights: Array<{ title: string; text: string }>;
  sections: Array<{
    title: string;
    paragraphs: string[];
    bullets?: string[];
  }>;
  faq: Array<{ question: string; answer: string }>;
  sources: Array<{ label: string; href: string }>;
};

export const trackerPages = {
  feeding: {
    slug: "baby-feeding-tracker",
    metadataTitle: "Baby Feeding Tracker App for Milk & Bottles | BooDoo",
    title: "Baby Feeding Tracker for Milk, Bottles & Daily Goals",
    description:
      "Log milk and bottle feeds in seconds, review daily totals, follow feeding intervals and set age-adapted goals with the BooDoo baby feeding tracker.",
    eyebrow: "Baby feeding tracker",
    intro:
      "Record each feed with one tap and immediately see how much your baby has had, when the last feed happened and how the day compares with your goal. BooDoo keeps the useful details visible without making tired parents search through menus.",
    image: "/screenshots/02-daily-report-milk.png",
    imageAlt: "BooDoo baby feeding tracker showing daily milk totals and reports",
    highlights: [
      {
        title: "Log feeds in seconds",
        text: "Add the milk amount quickly, even during a busy night feed."
      },
      {
        title: "See timing clearly",
        text: "Review the last feed, the interval and what comes next at a glance."
      },
      {
        title: "Understand the day",
        text: "Daily totals, goals and reports turn separate entries into a useful overview."
      }
    ],
    sections: [
      {
        title: "A feeding log built for real newborn days",
        paragraphs: [
          "Newborn feeds can blur together, especially overnight. BooDoo creates a simple record of milk amounts and feeding times so you do not have to rely on memory when someone asks when your baby last ate.",
          "The dashboard keeps the latest feed, today's total and your daily goal together. That makes it easier for parents and caregivers to understand the same information without maintaining separate notes."
        ],
        bullets: [
          "Quick milk and bottle-feed entries",
          "Last-feed time and feeding interval",
          "Daily total and goal progress",
          "History and reports with BooDoo Pro",
          "Optional feed reminders"
        ]
      },
      {
        title: "From individual feeds to a clear routine",
        paragraphs: [
          "A single entry tells you what just happened. A consistent feeding log shows the rhythm of the whole day. BooDoo organizes those entries into totals, averages and reports so changes are easier to notice and explain.",
          "You can use the record during conversations with another caregiver or a healthcare professional. BooDoo provides educational context, but feeding needs are individual and the app never replaces professional advice."
        ]
      },
      {
        title: "Guidance with visible sources",
        paragraphs: [
          "BooDoo connects its feeding guidance to recognized pediatric sources and adapts the information to your baby's age. References remain visible so you can see where the educational information comes from instead of accepting an unexplained number.",
          "Your baby's own cues, growth and medical circumstances still matter. Contact a qualified healthcare professional whenever you are worried about feeding, hydration, weight gain or your baby's general condition."
        ]
      }
    ],
    faq: [
      {
        question: "What can I record in the BooDoo feeding tracker?",
        answer:
          "You can record the time and milk amount for a feed, then review daily totals, intervals, goals and historical reports."
      },
      {
        question: "Can BooDoo remind me about the next feed?",
        answer:
          "Yes. Feed alerts and custom feeding intervals are available among BooDoo Pro features."
      },
      {
        question: "Does BooDoo decide how much my baby should drink?",
        answer:
          "No. BooDoo presents age-adapted educational guidance with visible sources. Individual feeding decisions should follow your baby's cues and advice from a qualified healthcare professional."
      },
      {
        question: "Can I review feeding history?",
        answer:
          "Yes. The current day is easy to see on the dashboard, while BooDoo Pro unlocks full history and deeper reports."
      }
    ],
    sources: [
      {
        label: "American Academy of Pediatrics: How often and how much should your baby eat?",
        href: "https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/how-often-and-how-much-should-your-baby-eat.aspx"
      },
      {
        label: "American Academy of Pediatrics: Baby's first month—feeding and nutrition",
        href: "https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/The-First-Month-Feeding-and-Nutrition.aspx"
      }
    ]
  },
  sleep: {
    slug: "baby-sleep-tracker",
    metadataTitle: "Baby Sleep Tracker for Naps & Wake Windows | BooDoo",
    title: "Baby Sleep Tracker for Naps, Wake Windows & Routines",
    description:
      "Track baby sleep, naps and awake time in seconds. See sleep totals, wake windows, reminders and daily patterns with the BooDoo newborn sleep tracker.",
    eyebrow: "Baby sleep tracker",
    intro:
      "Tap when your baby falls asleep and when they wake. BooDoo calculates the duration, keeps the current wake window visible and brings the day's sleep into one clear view.",
    image: "/screenshots/03-interval-and-awake-window.png",
    imageAlt: "BooDoo baby sleep tracker showing sleep duration and awake window",
    highlights: [
      {
        title: "One-tap sleep logging",
        text: "Switch between sleeping and awake without completing a long form."
      },
      {
        title: "Visible wake windows",
        text: "See how long your baby has been awake directly on the dashboard."
      },
      {
        title: "Daily sleep patterns",
        text: "Review totals and reports instead of trying to remember every nap."
      }
    ],
    sections: [
      {
        title: "Track sleep while it happens",
        paragraphs: [
          "Sleep tracking only helps when it is easy enough to use consistently. BooDoo places sleep and wake controls on the main dashboard so you can log a change in seconds, even when your hands and attention are already occupied.",
          "The app records the timing for you and shows the current state clearly. You can check when sleep started, how long it has lasted or how long your baby has been awake without calculating it yourself."
        ],
        bullets: [
          "Quick asleep and awake controls",
          "Automatic sleep-duration calculation",
          "Current awake-window display",
          "Daily sleep totals and goals",
          "Optional sleep reminders and historical reports"
        ]
      },
      {
        title: "Understand patterns—not just one difficult night",
        paragraphs: [
          "A single short nap does not explain a routine. A continuous log gives you a clearer view of total sleep and the timing of naps across several days. BooDoo's reports help you review those patterns without turning your baby's day into a spreadsheet.",
          "The information can also make handovers between parents and caregivers easier. Everyone can start from the same record rather than comparing different memories of the day."
        ]
      },
      {
        title: "Age-adapted educational context",
        paragraphs: [
          "Sleep changes rapidly during infancy. BooDoo presents age-adapted educational guidance and keeps its source links visible in the app so parents can understand the basis for a recommendation.",
          "BooDoo does not diagnose sleep problems and does not replace safe-sleep guidance or advice from your child's healthcare professional. Seek professional help whenever your baby's sleep, breathing, feeding or general condition concerns you."
        ]
      }
    ],
    faq: [
      {
        question: "Does BooDoo track naps and nighttime sleep?",
        answer:
          "Yes. You can use the same quick sleep controls for naps and nighttime sleep, then review the durations together in your daily record."
      },
      {
        question: "What is a wake-window tracker?",
        answer:
          "It records how long your baby has been awake between sleep periods. BooDoo displays the current awake time automatically after a wake entry."
      },
      {
        question: "Can I receive sleep reminders?",
        answer:
          "Yes. Feed and sleep alerts are available among BooDoo Pro features."
      },
      {
        question: "Does BooDoo guarantee that my baby will sleep?",
        answer:
          "No. BooDoo helps you record and understand patterns. It cannot guarantee sleep or diagnose a medical or developmental issue."
      }
    ],
    sources: [
      {
        label: "American Academy of Sleep Medicine: Recommended sleep duration for pediatric populations",
        href: "https://jcsm.aasm.org/doi/10.5664/jcsm.5866"
      }
    ]
  },
  growth: {
    slug: "baby-growth-tracker",
    metadataTitle: "Baby Growth Tracker for Weight & Height | BooDoo",
    title: "Baby Growth Tracker for Weight, Height & Daily Context",
    description:
      "Record your baby's weight and height and review growth alongside feeding, sleep and daily routines with the BooDoo baby growth tracker for iPhone and iPad.",
    eyebrow: "Baby growth tracker",
    intro:
      "Keep weight and height records together with the feeds, sleep and daily details that give growth its context. BooDoo makes the information easy to review without presenting it as a diagnosis.",
    image: "/screenshots/01-dashboard-photo-sources.png",
    imageAlt: "BooDoo baby growth tracker dashboard with baby age, weight and height",
    highlights: [
      {
        title: "Weight and height together",
        text: "Keep the two essential measurements in the same baby record."
      },
      {
        title: "Daily context included",
        text: "Review growth alongside feeding, sleep and routine information."
      },
      {
        title: "A history you can share",
        text: "Bring an organized record to conversations with caregivers or clinicians."
      }
    ],
    sections: [
      {
        title: "A simple record of growth over time",
        paragraphs: [
          "Growth is easier to discuss when measurements are recorded consistently. BooDoo lets you keep your baby's weight and height with the rest of the daily record instead of scattering measurements across notes, messages and photographs.",
          "The latest information stays close to your baby's age and routine. Historical access in BooDoo Pro helps you look back at previous entries and understand how the record has changed over time."
        ],
        bullets: [
          "Weight entries in one baby profile",
          "Height or length records",
          "Baby age visible with current measurements",
          "Feeding and sleep information in the same app",
          "Full history with BooDoo Pro"
        ]
      },
      {
        title: "Growth makes more sense with context",
        paragraphs: [
          "A measurement on its own is only one moment. Feeding totals, sleep patterns and the dates of previous measurements can provide useful context when you speak with your child's healthcare professional.",
          "BooDoo is designed to organize that information, not interpret a child's health independently. Measurements can vary because of technique, equipment and timing, so professional assessment remains important."
        ]
      },
      {
        title: "Built around recognized growth standards",
        paragraphs: [
          "The World Health Organization publishes child growth standards for measures such as weight-for-age, length or height-for-age and weight-for-length. BooDoo keeps links to trusted sources visible where educational guidance is presented.",
          "Only a qualified healthcare professional can assess whether an individual child's growth is appropriate. Contact your clinician if you are concerned about weight, length, feeding, development or a change in your baby's condition."
        ]
      }
    ],
    faq: [
      {
        question: "Which growth measurements can I record?",
        answer:
          "BooDoo supports weight and height or length records in your baby's profile."
      },
      {
        question: "Can I review earlier measurements?",
        answer:
          "Yes. BooDoo Pro includes full history so you can look back at earlier growth entries."
      },
      {
        question: "Does BooDoo diagnose growth problems?",
        answer:
          "No. BooDoo organizes your records and provides educational source links. Growth assessment and medical decisions belong with a qualified healthcare professional."
      },
      {
        question: "Why track feeding and sleep with growth?",
        answer:
          "Keeping these records together gives you a more complete timeline to review or discuss with your child's healthcare professional."
      }
    ],
    sources: [
      {
        label: "World Health Organization: Child Growth Standards",
        href: "https://www.who.int/tools/child-growth-standards/standards"
      },
      {
        label: "World Health Organization: Length and height for age",
        href: "https://www.who.int/tools/child-growth-standards/standards/length-height-for-age"
      }
    ]
  },
  poop: {
    slug: "baby-poop-tracker",
    metadataTitle: "Baby Poop Tracker & Diaper Color Log | BooDoo",
    title: "Baby Poop Tracker for Color, Timing & Daily Patterns",
    description:
      "Log baby poop color and timing quickly, review daily patterns and see source-linked educational explanations with the BooDoo diaper and poop tracker.",
    eyebrow: "Baby poop tracker",
    intro:
      "Record a dirty diaper by selecting the color and time, then keep the day's pattern visible beside feeds and sleep. BooDoo adds clear, source-linked educational explanations without pretending to diagnose your baby.",
    image: "/screenshots/07-dashboard-poo-selected.png",
    imageAlt: "BooDoo baby poop tracker showing selectable diaper colors",
    highlights: [
      {
        title: "Fast color logging",
        text: "Choose the closest color and record the entry from the dashboard."
      },
      {
        title: "Patterns in context",
        text: "See poop entries beside feeding and sleep rather than as isolated notes."
      },
      {
        title: "Visible references",
        text: "Read educational explanations with their medical sources attached."
      }
    ],
    sections: [
      {
        title: "A cleaner way to remember every dirty diaper",
        paragraphs: [
          "Parents are often asked about diaper frequency and appearance when a baby is unwell or feeding changes. BooDoo gives you a quick way to record the information at the moment it happens, before the details disappear into a busy day.",
          "Choose the closest poop color, save the entry and continue with your routine. The dashboard keeps the log beside feeds and sleep so the day's information remains easy to review."
        ],
        bullets: [
          "One-tap access from the main dashboard",
          "Selectable poop colors",
          "Time-stamped daily entries",
          "Pattern history and reports with BooDoo Pro",
          "Educational feedback with source links"
        ]
      },
      {
        title: "Why a poop log can be useful",
        paragraphs: [
          "Baby poop varies with age, feeding and individual routine. Recording what you actually observe gives you a clearer timeline than trying to reconstruct several days from memory.",
          "That timeline can support a more specific conversation with your child's healthcare professional. BooDoo does not analyze a diaper as a medical test and cannot determine whether your baby is healthy."
        ]
      },
      {
        title: "Clear information without alarm",
        paragraphs: [
          "Recognized pediatric sources explain that several stool colors can occur normally, while some changes deserve professional attention. BooDoo links educational feedback to its sources so parents can read the context behind it.",
          "If your baby seems unwell, has unusual stool, is feeding poorly, has fewer wet diapers or you are otherwise concerned, contact a qualified healthcare professional promptly rather than relying on an app."
        ]
      }
    ],
    faq: [
      {
        question: "What does the BooDoo poop tracker record?",
        answer:
          "It records the selected poop color and time, placing the entry into your baby's daily log and longer history."
      },
      {
        question: "Is poop the same as a diaper tracker?",
        answer:
          "BooDoo focuses on dirty-diaper or poop entries, including color and timing. It should not be described as a complete wet-diaper tracker unless that feature is added to the app."
      },
      {
        question: "Can BooDoo tell whether a poop color is dangerous?",
        answer:
          "No. BooDoo provides educational explanations and visible source links, but it cannot diagnose your baby or replace professional assessment."
      },
      {
        question: "Can I see poop patterns over time?",
        answer:
          "Yes. BooDoo Pro includes full history, reports, scores and averages for feeds, sleep and poop."
      }
    ],
    sources: [
      {
        label: "American Academy of Pediatrics: The many colors of baby poop",
        href: "https://www.healthychildren.org/English/ages-stages/baby/Pages/The-Many-Colors-of-Poop.aspx"
      },
      {
        label: "American Academy of Pediatrics: Pooping by the numbers",
        href: "https://www.healthychildren.org/English/ages-stages/baby/Pages/Pooping-By-the-Numbers.aspx"
      }
    ]
  },
  newborn: {
    slug: "newborn-tracker",
    metadataTitle: "Newborn Tracker App for Feeding, Sleep & Growth | BooDoo",
    title: "Newborn Tracker for Feeding, Sleep, Poop & Growth",
    description:
      "Track your newborn's feeding, sleep, poop, weight and height in one clear app with daily goals, reminders, reports and visible medical references.",
    eyebrow: "All-in-one newborn tracker",
    intro:
      "Newborn days contain hundreds of small details. BooDoo brings feeds, sleep, poop and growth into one simple dashboard, then helps you understand the daily record with goals, reports and source-linked educational guidance.",
    image: "/screenshots/01-dashboard-photo-sources.png",
    imageAlt: "BooDoo newborn tracker dashboard showing feeding, sleep and poop logs",
    highlights: [
      {
        title: "Everything on one screen",
        text: "See feeds, sleep, poop and growth without switching between several apps."
      },
      {
        title: "Built for tired parents",
        text: "Log the essential details quickly with large, clear dashboard controls."
      },
      {
        title: "More than a list",
        text: "Goals, intervals and reports help explain what the day's entries mean."
      }
    ],
    sections: [
      {
        title: "One newborn log for the whole day",
        paragraphs: [
          "BooDoo replaces scattered notes with a single daily record. Add milk feeds, start or stop sleep, record poop color and update weight or height without rebuilding the day's timeline later.",
          "The dashboard prioritizes what parents repeatedly need: the last feed, today's total, the current sleep state, awake time and the most recent entries. Important information stays visible at a glance."
        ],
        bullets: [
          "Milk and bottle-feed logging",
          "Nap, sleep and awake-window tracking",
          "Poop color and timing entries",
          "Weight and height records",
          "Daily goals, reminders, history and reports"
        ]
      },
      {
        title: "Designed to reduce guessing",
        paragraphs: [
          "Most trackers stop after storing an entry. BooDoo connects entries into totals, intervals and daily summaries so you can understand the routine rather than stare at a list of timestamps.",
          "This also creates a clearer record for handovers between caregivers and for conversations with your child's healthcare professional. You decide what to record and when to share it."
        ]
      },
      {
        title: "Educational guidance with sources attached",
        paragraphs: [
          "BooDoo adapts educational guidance to your baby's age and shows its source links throughout the app. That makes it possible to check where information comes from and read the original material.",
          "The app is an organization and education tool. It is not a medical device and does not replace professional advice, diagnosis or treatment. Contact a qualified healthcare professional whenever your baby's feeding, sleep, diapers, growth or general condition concerns you."
        ]
      }
    ],
    faq: [
      {
        question: "What can I track for my newborn in BooDoo?",
        answer:
          "You can track milk feeds, sleep and awake time, poop color and timing, weight and height, plus daily goals and reminders."
      },
      {
        question: "Is BooDoo available for iPhone and iPad?",
        answer:
          "Yes. BooDoo is optimized for both iPhone and iPad and is available through the Apple App Store."
      },
      {
        question: "What is included in BooDoo Pro?",
        answer:
          "BooDoo Pro adds full history, deeper reports, scores and averages, feed and sleep alerts, custom feeding intervals, themes and other Pro features."
      },
      {
        question: "Is BooDoo a medical app?",
        answer:
          "BooDoo provides educational information with visible references. It is not a substitute for professional medical advice, diagnosis or treatment."
      }
    ],
    sources: [
      {
        label: "American Academy of Pediatrics: Newborn feeding and nutrition",
        href: "https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/The-First-Month-Feeding-and-Nutrition.aspx"
      },
      {
        label: "World Health Organization: Child Growth Standards",
        href: "https://www.who.int/tools/child-growth-standards/standards"
      }
    ]
  }
} satisfies Record<string, TrackerPageContent>;

export const allTrackerPages = Object.values(trackerPages);
