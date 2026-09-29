export type Project = {
  number: string;
  title: string;
  phase: string;
  kind: string;
  image: string;
  summary: string;
  website?: { href: string; label: string };
};

export const projects: Project[] = [
  {
    number: '01',
    title: 'Flot',
    phase: 'Product Manager · Current role',
    kind: 'Current work',
    image: '/media/projects/flot.webp',
    summary:
      'I am Product Manager at Flot, a Sierra Leonean financial ecosystem connecting personal wallets, WhatsApp banking, cards, business finance, and developer payments.',
    website: { href: 'https://flotme.ai', label: 'flotme.ai' }
  },
  {
    number: '02',
    title: 'Mocha',
    phase: 'Co-founder and Product Manager',
    kind: 'Co-founded product',
    image: '/media/projects/mocha.webp',
    summary:
      'As co-founder and Product Manager, I helped build Mocha from idea into a WhatsApp-based way to deposit, send USDC, and withdraw to leones. The team has processed over $2.5M through the product.',
    website: { href: 'https://getmocha.io', label: 'getmocha.io' }
  },
  {
    number: '03',
    title: 'LightPath SDA',
    phase: 'Adventist study companion · early build',
    kind: 'Study product',
    image: '/media/projects/lightpath-concept.avif',
    summary:
      'LightPath SDA is a no-login study companion for Adventist users in Sierra Leone and West Africa. The current app combines citation-led answers, a Bible reader with offline support, and a church calendar. Its local question-answering demo uses a small public-domain source set; broader source coverage is still pending licensing.'
  },
  {
    number: '04',
    title: 'Taskflow',
    phase: 'Personal tasks and shared workspaces',
    kind: 'Workspace app',
    image: '/media/projects/taskflow-concept.avif',
    summary:
      'Taskflow brings personal tasks and shared workspaces together. Invite codes support collaboration, while boards track work through To Do, In Progress, and Done; task details include dates, assignees, and subtasks. The code also includes databases with table, board, gallery, list, and calendar views.'
  },
  {
    number: '05',
    title: 'Attendlog',
    phase: 'Attendance product concept and waitlist',
    kind: 'Concept site',
    image: '/media/projects/attendlog-concept.avif',
    summary:
      'Attendlog is a concept and waitlist site for an attendance product aimed at Sierra Leonean businesses. The page explains planned location-verified clock-ins, offline sync, and tamper-resistant records, and lets visitors join a waitlist. The repository contains the promotional site and signup endpoint, not a working attendance-tracking app.'
  },
  {
    number: '06',
    title: 'Yans Fitness',
    phase: 'Early fitness concept',
    kind: 'Concept',
    image: '/media/projects/yans-fitness-concept.avif',
    summary:
      'Yans Fitness is an early concept in the archive. No implementation or project documentation is available in the public repository yet, so this card is a visual preview rather than a working product.'
  },
  {
    number: '07',
    title: 'SS Wears',
    phase: 'Fashion brand landing page',
    kind: 'Website',
    image: '/media/projects/ss-wears-concept.avif',
    summary:
      'A React landing page for SS Wears that introduces the fashion brand through an animated hero and galleries for clothing, bags, and hair. Location and contact details sit alongside WhatsApp ordering, so customers move from browsing to a conversation rather than an on-site checkout.'
  },
  {
    number: '08',
    title: 'Phae Task Manager',
    phase: 'Task-management prototype',
    kind: 'Prototype',
    image: '/media/projects/phae-task-manager.webp',
    summary:
      'Phae is a task-management prototype with personal lists, priorities, subtasks, a calendar view, dark mode, and a Pomodoro timer. It explores shared-list invitations and optional AI subtask suggestions. The current code keeps tasks in session state and simulates invitations; persistent collaboration and offline task syncing are not implemented.'
  },
  {
    number: '09',
    title: 'Expense Tracker',
    phase: 'Local-first expense tracker',
    kind: 'Web app',
    image: '/media/projects/expense-concept.webp',
    summary:
      'A browser-based expense tracker for logging amounts, categories, dates, and notes without an account. It stores records locally and turns them into monthly and weekly totals, category and trend charts, a searchable expense list, and logging streaks.'
  },
  {
    number: '10',
    title: 'Voting Platform',
    phase: 'Early voting concept',
    kind: 'Concept',
    image: '/media/projects/voting-platform-concept.avif',
    summary:
      'An early voting-platform concept. The public repository has no application code or README yet, so its features and outcomes are not documented.'
  },
  {
    number: '11',
    title: 'Basketball Scoreboard',
    phase: 'HTML · CSS · JavaScript',
    kind: 'Prototype',
    image: '/media/projects/basketball-scoreboard-concept.avif',
    summary:
      'A browser-based basketball scoreboard for two teams, with large digital-style totals that are easy to read at a glance. Each side has one-, two-, and three-point controls, and a reset button clears both scores. Built as a focused HTML, CSS, and JavaScript prototype.'
  },
  {
    number: '12',
    title: 'Calculator',
    phase: 'HTML · CSS · JavaScript',
    kind: 'Prototype',
    image: '/media/projects/calculator-concept.avif',
    summary:
      'A compact calculator interface exercise with a number pad, decimal input, four arithmetic operators, equals, and clear controls. The repository contains JavaScript for evaluating and saving expressions, but the checked-in page still needs its stylesheet and script paths corrected before it works as a standalone demo.'
  },
  {
    number: '13',
    title: 'Passenger Counter',
    phase: 'HTML · CSS · JavaScript',
    kind: 'Prototype',
    image: '/media/projects/passenger-counter-concept.avif',
    summary:
      'A simple passenger-counting page with a live total and one-tap increment. Saving a count adds it to a visible history line and resets the active tally for the next group. The history lasts only for the current page session.'
  },
  {
    number: '14',
    title: 'Flot Business',
    phase: 'Business website collaboration',
    kind: 'Website collaboration',
    image: '/media/projects/flot-business.webp',
    summary:
      'A Svelte marketing site for Flot’s business offering. It explains merchant onboarding, payment channels, and settlement through a four-step interactive section, and introduces the mobile app, flight benefits, and download options. The repository contains the presentation website rather than the payment or flight-booking systems.'
  },
  {
    number: '15',
    title: 'Flot Platform',
    phase: 'Commerce prototype collaboration',
    kind: 'Product collaboration',
    image: '/media/projects/flot-platform.webp',
    summary:
      'A multi-vertical commerce prototype that brings hotel stays, restaurant ordering, travel, and a fashion and art store under one Flot-branded experience. Each flow leads into a shared checkout interface with USD and leone pricing. Payments in this showcase are simulated, so it demonstrates the journey rather than processing real charges.'
  },
  {
    number: '16',
    title: 'Flot Website Dashboard',
    phase: 'Merchant dashboard collaboration',
    kind: 'Product collaboration',
    image: '/media/projects/flot-dashboard.webp',
    summary:
      'A merchant workspace connecting Flot payments with the websites that take orders. Merchants can review transactions and order status, edit site content and products, and see website analytics; public APIs make that data available to merchant sites. The repository is a shared product collaboration.'
  },
  {
    number: '17',
    title: 'Belvoir Hotel',
    phase: 'Hotel website collaboration',
    kind: 'Website collaboration',
    image: '/media/projects/belvoir-hotel.webp',
    summary:
      'An editorial hotel site for rooms and serviced apartments in Freetown, with individual room pages and a direct booking journey. Guests can check room availability, submit booking details, and receive a Flot payment link; a separate admin interface supports reservation operations. The work is presented as a website collaboration.'
  },
  {
    number: '18',
    title: 'Bondumani',
    phase: 'Public website collaboration',
    kind: 'Website collaboration',
    image: '/media/projects/bondumani.webp',
    summary:
      'A public website collaboration for Bondumani Art & Resort in Freetown. A motion-led gateway gives visitors separate paths into the art studio and bamboo village. The art page includes a marketplace and cart, while the resort page lets visitors explore stays and begin a booking flow.'
  },
  {
    number: '19',
    title: 'Bridges of Hope',
    phase: 'Public website collaboration',
    kind: 'Website collaboration',
    image: '/media/projects/bridges-of-hope.webp',
    summary:
      'A public website collaboration for a Sierra Leone humanitarian initiative, built in Next.js. Program profiles load from Sanity and open into detailed cause views. Visitors can choose a donation amount and reach a Flot checkout interface.'
  },
  {
    number: '20',
    title: 'Dove Group',
    phase: 'Public website collaboration',
    kind: 'Website collaboration',
    image: '/media/projects/dove-group.webp',
    summary:
      'A public website collaboration for Dove Group of Companies, presenting its subsidiaries and products in one place. The marketplace includes search, category filters, sorting, quantity controls, and a cart. Its checkout flow captures an order and opens Flot’s hosted payment interface.'
  },
  {
    number: '21',
    title: 'Sierra 247',
    phase: 'Public website collaboration',
    kind: 'Website collaboration',
    image: '/media/projects/sierra-247.webp',
    summary:
      'A public website collaboration for Sierra 24/7 Securicor and Logistics Services. Visitors can explore service details, browse company information, and reach contact and careers paths. The site includes a careers submission form and a payment overlay connected to Flot.'
  }
];
