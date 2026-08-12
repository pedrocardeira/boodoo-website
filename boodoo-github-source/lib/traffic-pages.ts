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
  },
  newbornChecklist: {
    slug: "what-to-track-for-a-newborn",
    metadataTitle: "What to Track for a Newborn: Simple Checklist | BooDoo",
    description:
      "Learn what is useful to track for a newborn—feeding, diapers, sleep and growth—without turning every day into a spreadsheet.",
    eyebrow: "What to track for a newborn",
    title: "Track the details that help—not every detail possible.",
    intro:
      "A simple newborn record can answer practical questions during a tired week: when your baby last fed, how sleep is spread across the day, how diaper output is changing and what to mention at the next appointment.",
    highlights: [
      {
        title: "Start with four basics",
        text: "Feeding, diapers, sleep and growth usually provide the clearest daily picture."
      },
      {
        title: "Record facts, not diagnoses",
        text: "A log supports memory and conversations; it cannot determine whether a baby is healthy."
      },
      {
        title: "Keep it sustainable",
        text: "Choose a level of detail that remains manageable during feeds and night waking."
      }
    ],
    sections: [
      {
        title: "The four things most families find useful",
        paragraphs: [
          "Newborn care repeats quickly, and the events can blur together. A useful record begins with feeding, diapers, sleep and growth rather than a long list of optional measurements.",
          "You do not need perfect data. A consistent, simple log is more useful than a complicated system that is abandoned after two days."
        ],
        bullets: [
          "Feeding type, start time and amount or duration",
          "Wet, dirty or mixed diaper changes",
          "Sleep start and wake time",
          "Weight and length measured by a professional",
          "Short notes about questions for your clinician",
          "Medicines only according to professional instructions"
        ]
      },
      {
        title: "What to record about feeding",
        paragraphs: [
          "For breastfeeding, parents may record the start time, duration and breast used when that information is helpful. For bottles, the time and amount offered or taken are usually the most practical details. Pumping can be kept separately so expressed milk is not confused with milk the baby actually drank.",
          "Feeding needs vary with age, birth history, growth and feeding method. Use the plan agreed with your pediatrician, midwife or feeding specialist rather than changing feeds to make the log look more regular."
        ]
      },
      {
        title: "Why diapers belong beside feeds",
        paragraphs: [
          "Wet and dirty diapers give useful context to a feeding record. Logging both in the same place can help a parent describe changes clearly instead of relying on memory.",
          "Output changes during the first days of life and differs between breastfed and formula-fed babies. A log can reveal a change, but only a qualified professional can interpret it for an individual newborn."
        ]
      },
      {
        title: "Track sleep without turning it into a target",
        paragraphs: [
          "Newborn sleep is fragmented and highly variable. Record when sleep begins and ends if the information helps with handovers or gives you a clearer 24-hour view, but do not expect a newborn chart to resemble an adult schedule.",
          "Tracking never changes safe-sleep practice: place babies on their back on a firm, flat sleep surface, and keep soft bedding and toys out of the sleep space."
        ]
      },
      {
        title: "Growth and the notes worth keeping",
        paragraphs: [
          "Growth is best understood as a trend using accurate measurements, not as a single home number. Keep dates and measurements from health appointments together so the professional following your baby can interpret them on an appropriate growth chart.",
          "A short note can also preserve a question you want to ask. If tracking increases anxiety or becomes compulsive, simplify it or pause and discuss the concern with a healthcare professional."
        ]
      }
    ],
    faq: [
      {
        question: "Do I need to track everything my newborn does?",
        answer:
          "No. Many families only need feeding, diapers and sleep for a limited period. Track what has a clear practical purpose for your household or healthcare plan."
      },
      {
        question: "How detailed should a newborn feeding log be?",
        answer:
          "Usually the feeding type, time, duration or amount and an optional short note are enough. Follow any additional instructions given for your baby."
      },
      {
        question: "Should I record every nap?",
        answer:
          "Only if it is useful. A full sleep record can help show the 24-hour pattern, but it should not add unnecessary stress."
      },
      {
        question: "Can a baby tracker tell me whether my newborn is healthy?",
        answer:
          "No. A tracker organizes observations. Concerns about feeding, hydration, breathing, temperature, growth or behavior require professional medical advice."
      }
    ],
    externalSources: [
      {
        label: "American Academy of Pediatrics: how often and how much babies eat",
        href: "https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/how-often-and-how-much-should-your-baby-eat.aspx"
      },
      {
        label: "CDC: helping babies sleep safely",
        href: "https://www.cdc.gov/reproductive-health/features/babies-sleep.html"
      },
      {
        label: "WHO: child growth standards",
        href: "https://www.who.int/tools/child-growth-standards"
      }
    ]
  },
  feedingDiaperLog: {
    slug: "newborn-feeding-and-diaper-log",
    metadataTitle: "Newborn Feeding and Diaper Log: What to Record | BooDoo",
    description:
      "Use a simple newborn feeding and diaper log to record breastfeeds, bottles, wet diapers and stools, with a practical printable-style checklist.",
    eyebrow: "Newborn feeding and diaper log",
    title: "Keep feeds and diapers together so the day makes sense.",
    intro:
      "A combined feeding and diaper log makes it easier to answer two everyday questions: what went in, and what happened afterward. The goal is a clear record—not a scorecard for your baby.",
    highlights: [
      {
        title: "One connected timeline",
        text: "View breastfeeds, bottles and diaper changes in the order they happened."
      },
      {
        title: "Easy caregiver handovers",
        text: "The next caregiver can see the latest feed and change without guessing."
      },
      {
        title: "Useful appointment notes",
        text: "Bring a concise pattern and your questions instead of reconstructing several days."
      }
    ],
    sections: [
      {
        title: "What each row of the log should contain",
        paragraphs: [
          "A newborn log works best when an entry takes only a few seconds. Use one row per feed or diaper change and keep optional notes short.",
          "Record the event when it happens when possible. If you add it later, an approximate time is still better than inventing detail you do not remember."
        ],
        bullets: [
          "Date and time",
          "Breast, expressed milk or formula",
          "Breastfeeding duration or bottle amount",
          "Wet, dirty or mixed diaper",
          "Optional stool color or brief observation",
          "A note only when something needs follow-up"
        ]
      },
      {
        title: "How diaper output adds context",
        paragraphs: [
          "The American Academy of Pediatrics notes that wet-diaper counts change across the first days after birth. Its general guidance describes two to three wet diapers per day in the earliest days and at least five to six per day after day four or five, while stool frequency varies more by feeding method and age.",
          "Those figures are educational context, not a diagnosis or a personalized target. Prematurity, illness, feeding difficulties and an individual care plan can change what your clinical team expects."
        ]
      },
      {
        title: "How to review the log without overreacting",
        paragraphs: [
          "Look for a clear change from your baby’s recent pattern rather than judging one isolated feed or diaper. Add a short factual note and contact the professional responsible for your baby when you are concerned.",
          "Do not delay medical help while waiting to collect more data. A log supports a conversation; it is not a test that has to be completed first."
        ]
      },
      {
        title: "Paper, notes app or baby tracker?",
        paragraphs: [
          "Paper is excellent for a temporary bedside log and is easy to share in the room. A phone tracker becomes more useful when several days need to be summarized, intervals are hard to calculate or more than one caregiver needs the latest information.",
          "Choose the method you will actually use. BooDoo keeps feeding, diapers, sleep and growth in one record and calculates useful timing from the entries you make."
        ]
      },
      {
        title: "Questions the record can help you ask",
        paragraphs: [
          "A clear log helps turn a vague concern into a specific question: feeding sessions have become shorter, wet diapers changed from the recent pattern, or the baby is difficult to wake for feeds.",
          "Urgent warning signs vary by age and situation. Contact an appropriate healthcare service promptly whenever you are worried about hydration, breathing, fever, unusual sleepiness, repeated vomiting or feeding."
        ]
      }
    ],
    faq: [
      {
        question: "What should I include in a newborn feeding and diaper log?",
        answer:
          "Record the time, feeding type, duration or amount, and whether each diaper was wet, dirty or mixed. Add notes only when useful."
      },
      {
        question: "Should I count wet and dirty diapers separately?",
        answer:
          "Yes. Separate categories make the record easier to describe. A diaper containing both can be marked as mixed."
      },
      {
        question: "How long should I keep a newborn log?",
        answer:
          "There is no universal duration. Some families use it during the early weeks; others continue when a clinician asks for a record or multiple caregivers need it."
      },
      {
        question: "Does a low diaper count mean my baby is dehydrated?",
        answer:
          "A change can be important, but a tracker cannot diagnose dehydration. Contact a qualified healthcare professional promptly if you are concerned."
      }
    ],
    externalSources: [
      {
        label: "American Academy of Pediatrics: feeding amounts and daily diapers",
        href: "https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/how-often-and-how-much-should-your-baby-eat.aspx"
      },
      {
        label: "WHO: infant and young child feeding",
        href: "https://www.who.int/news-room/fact-sheets/detail/infant-and-young-child-feeding"
      },
      {
        label: "BooDoo: printable baby feeding log",
        href: "https://www.boodoo.app/baby-feeding-log-template"
      }
    ]
  },
  wakeWindows: {
    slug: "baby-wake-windows-by-age",
    metadataTitle: "Baby Wake Windows by Age: A Flexible Guide | BooDoo",
    description:
      "Understand baby wake windows by age, why exact schedules vary, and how to combine sleepy cues with a simple 24-hour sleep record.",
    eyebrow: "Baby wake windows by age",
    title: "Use wake windows as observations—not deadlines.",
    intro:
      "A wake window is simply the time between one sleep period ending and the next beginning. It can help describe a pattern, but it is not a medical threshold and no single timetable fits every baby.",
    highlights: [
      {
        title: "Age changes the pattern",
        text: "Awake periods usually become more organized as sleep matures during the first years."
      },
      {
        title: "Cues still matter",
        text: "Behavior, feeding and the day’s previous sleep add context that a timer cannot provide."
      },
      {
        title: "Total sleep comes first",
        text: "Review sleep across 24 hours rather than optimizing one interval in isolation."
      }
    ],
    sections: [
      {
        title: "What wake windows can and cannot tell you",
        paragraphs: [
          "Wake windows are popular because they give parents a simple way to describe time awake. They can help you notice that a baby tends to settle after a similar sequence of feeding, interaction and quiet time.",
          "They cannot prove why a baby is unsettled, diagnose a sleep problem or guarantee a nap. Growth spurts, illness, travel, feeding and normal development can all change the pattern."
        ]
      },
      {
        title: "A flexible age-by-age view",
        paragraphs: [
          "During the newborn months, sleep and waking are usually spread across day and night, and awake periods often contain little more than feeding, changing and brief interaction. Under four months, variation is so wide that the American Academy of Sleep Medicine does not publish a formal total-sleep recommendation.",
          "From four to twelve months, sleep often becomes more organized, but naps and awake periods continue to change. The AASM recommends 12 to 16 hours of total sleep per 24 hours, including naps, for this age group. From one to two years, its recommendation is 11 to 14 hours, including naps."
        ],
        bullets: [
          "Birth to 3 months: expect irregular sleep and brief, variable awake periods",
          "4 to 6 months: daytime patterns may become easier to observe",
          "7 to 12 months: longer awake periods and changing naps are common",
          "12 to 24 months: daytime sleep often consolidates gradually",
          "After illness or travel: expect temporary changes",
          "At every age: use the whole day and your baby’s behavior as context"
        ]
      },
      {
        title: "How to identify your baby’s actual pattern",
        paragraphs: [
          "Record sleep start and end times for several ordinary days. BooDoo can calculate the awake interval between those entries, letting you compare your baby with their own recent pattern instead of a rigid internet chart.",
          "Look at the sequence as well as the number: when the last nap ended, whether feeding is due, how stimulating the environment has been and whether sleepy behavior is appearing."
        ]
      },
      {
        title: "Sleepy cues and overtired behavior",
        paragraphs: [
          "Reduced engagement, staring away, quieter movement, rubbing the face or fussiness may occur around sleep, but no individual cue is perfectly reliable. Hunger, discomfort and illness can look similar.",
          "Begin a calm routine when the pattern and behavior suggest sleep may be approaching. If a baby does not settle, respond to the baby rather than forcing the clock."
        ]
      },
      {
        title: "Safe sleep is never replaced by a schedule",
        paragraphs: [
          "Whatever time a nap begins, safe-sleep guidance remains the same: place babies on their back on a firm, flat surface intended for infant sleep and keep pillows, blankets, bumpers and soft toys out of the sleep area.",
          "Speak with a pediatrician or qualified health professional about persistent sleep concerns, breathing problems, unusual difficulty waking, poor feeding or growth."
        ]
      }
    ],
    faq: [
      {
        question: "What is a baby wake window?",
        answer:
          "It is the elapsed time from waking at the end of one sleep period until the beginning of the next."
      },
      {
        question: "Are wake windows scientifically fixed by age?",
        answer:
          "No. They are practical observations, not universal medical thresholds. Sleep needs and daily patterns vary between babies."
      },
      {
        question: "Should I wake my baby to maintain a wake-window schedule?",
        answer:
          "Do not change sleep or feeding solely to match an online schedule. Follow the care plan given for your baby and ask a qualified professional when unsure."
      },
      {
        question: "What matters more: wake windows or total sleep?",
        answer:
          "Both can describe the day, but established professional recommendations focus on total sleep across 24 hours rather than exact wake-window targets."
      }
    ],
    externalSources: [
      {
        label: "American Academy of Sleep Medicine: child sleep duration advisory",
        href: "https://aasm.org/advocacy/position-statements/child-sleep-duration-health-advisory/"
      },
      {
        label: "CDC: helping babies sleep safely",
        href: "https://www.cdc.gov/reproductive-health/features/babies-sleep.html"
      },
      {
        label: "BooDoo: baby sleep tracker",
        href: "https://www.boodoo.app/baby-sleep-tracker"
      }
    ]
  },
  feedingAndSleep: {
    slug: "how-to-track-baby-feeding-and-sleep",
    metadataTitle: "How to Track Baby Feeding and Sleep | BooDoo",
    description:
      "Learn how to track baby feeding and sleep in one simple timeline, what details to record and how to review patterns without chasing perfection.",
    eyebrow: "How to track baby feeding and sleep",
    title: "Build one timeline that another tired caregiver can understand.",
    intro:
      "Feeding and sleep influence the shape of a baby’s day, but the log should remain simple. Record the facts you will use, review them in context and leave diagnosis to qualified professionals.",
    highlights: [
      {
        title: "Log in the moment",
        text: "A quick entry is easier and usually more accurate than reconstructing the day at night."
      },
      {
        title: "Connect feeds and sleep",
        text: "A shared timeline shows what happened before and after each rest period."
      },
      {
        title: "Review patterns weekly",
        text: "Several ordinary days provide more context than one unusually difficult night."
      }
    ],
    sections: [
      {
        title: "Decide why you are tracking",
        paragraphs: [
          "A clear purpose prevents the log from expanding endlessly. You may want easier caregiver handovers, a reminder of the last feed, a 24-hour sleep view or a short record requested by a healthcare professional.",
          "Choose only the fields needed for that purpose. You can always add detail later, but a complicated routine is difficult to sustain."
        ]
      },
      {
        title: "Record feeding consistently",
        paragraphs: [
          "For breastfeeds, record the start time and duration, with the breast used if that helps your routine. For bottles, record the time and amount taken. Keep pumping entries distinct from feeds so milk expressed is not mistaken for milk consumed.",
          "Do not compare feeding methods as though one set of numbers should look like another. Follow responsive feeding and the individualized advice provided for your baby."
        ],
        bullets: [
          "Time the feed started",
          "Breast, expressed milk or formula",
          "Duration or amount",
          "Optional note when something changed",
          "No pressure to make every interval identical",
          "Professional advice takes priority over the app"
        ]
      },
      {
        title: "Record sleep as start and end times",
        paragraphs: [
          "Mark when sleep begins and when the baby wakes. Those two facts allow a tracker to calculate duration, total sleep and the awake interval without asking you to do mental arithmetic at night.",
          "Record naps and night sleep in the same 24-hour view. The distinction can still be useful, but babies do not always organize sleep according to the labels adults use."
        ]
      },
      {
        title: "Review several days, not one event",
        paragraphs: [
          "Look for a repeated sequence across several ordinary days: feeds becoming easier or harder, sleep shifting later, or caregiver handovers creating missed entries. A pattern is more useful when the underlying data is reasonably consistent.",
          "Avoid treating the dashboard as a grade. Babies are variable, and a different day is not automatically a bad day."
        ]
      },
      {
        title: "Share the record and know when to stop",
        paragraphs: [
          "During a handover, the next caregiver usually needs only the latest feed, current sleep state, recent diapers and any important note. A clean record reduces repeated questions and duplicated feeds.",
          "Pause or simplify tracking if it adds anxiety without helping a decision. Contact a healthcare professional promptly for concerns about feeding, hydration, breathing, fever, unusual sleepiness, growth or behavior rather than waiting for the chart to become clearer."
        ]
      }
    ],
    faq: [
      {
        question: "What is the easiest way to track baby feeding and sleep?",
        answer:
          "Use one timeline and record only feeding type, time, amount or duration, and sleep start and end times. Consistency matters more than excessive detail."
      },
      {
        question: "Should I track naps and nighttime sleep separately?",
        answer:
          "They can be labeled separately while still contributing to the same 24-hour total. This makes both the daily pattern and total sleep easier to review."
      },
      {
        question: "How many days are needed to see a pattern?",
        answer:
          "There is no fixed number. Several ordinary days provide more context than one day, but normal development can change the pattern quickly."
      },
      {
        question: "Can feeding and sleep data diagnose a problem?",
        answer:
          "No. The record may help you describe a concern, but diagnosis and personalized advice require a qualified healthcare professional."
      }
    ],
    externalSources: [
      {
        label: "American Academy of Pediatrics: how often and how much babies eat",
        href: "https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/how-often-and-how-much-should-your-baby-eat.aspx"
      },
      {
        label: "American Academy of Sleep Medicine: child sleep duration advisory",
        href: "https://aasm.org/advocacy/position-statements/child-sleep-duration-health-advisory/"
      },
      {
        label: "CDC: helping babies sleep safely",
        href: "https://www.cdc.gov/reproductive-health/features/babies-sleep.html"
      }
    ]
  }
} satisfies Record<string, TrafficPageContent>;

export const allTrafficPages = Object.values(trafficPages);
