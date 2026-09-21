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
    phase: 'Product Manager · Major contributor',
    kind: 'Current work',
    image: '/media/projects/flot.webp',
    summary:
      'A connected financial ecosystem bringing wallets, payments, cards, WhatsApp banking, travel, business finance, and developer infrastructure into one experience.',
    website: { href: 'https://flotme.ai', label: 'flotme.ai' }
  },
  {
    number: '02',
    title: 'Mocha',
    phase: 'Co-founder · WhatsApp-native money movement',
    kind: 'Co-founded product',
    image: '/media/projects/mocha.webp',
    summary:
      'A WhatsApp-native money movement experience that makes it easier to send, spend, and earn with stablecoins through conversations.',
    website: { href: 'https://getmocha.io', label: 'getmocha.io' }
  },
  {
    number: '03',
    title: 'LightPath SDA',
    phase: 'Scripture-grounded answers and offline Bible companion',
    kind: 'GitHub',
    image: '/media/projects/lightpath-concept.avif',
    summary:
      'A citation-led, no-login study companion that turns Scripture, Adventist doctrine, and the church calendar into grounded answers for people in Sierra Leone and West Africa.'
  },
  {
    number: '04',
    title: 'Taskflow',
    phase: 'Public repository · TypeScript',
    kind: 'GitHub',
    image: '/media/projects/taskflow-concept.avif',
    summary: 'A collaborative to-do workspace for turning shared tasks into a clear, workable list.'
  },
  {
    number: '05',
    title: 'Attendlog',
    phase: 'Public repository · JavaScript',
    kind: 'GitHub',
    image: '/media/projects/attendlog-concept.avif',
    summary:
      'A lightweight attendance-log interface being shaped as a React project for recording attendance with less friction.'
  },
  {
    number: '06',
    title: 'Yans Fitness',
    phase: 'Public repository',
    kind: 'GitHub',
    image: '/media/projects/yans-fitness-concept.avif',
    summary:
      'The public archive for a Yans Fitness experience, currently held as an early-stage project space.'
  },
  {
    number: '07',
    title: 'SS Wears',
    phase: 'Public repository · JavaScript',
    kind: 'GitHub',
    image: '/media/projects/ss-wears-concept.avif',
    summary:
      'A focused storefront landing page for SS Wears, built as a clean entry point for a fashion brand.'
  },
  {
    number: '08',
    title: 'Phae Task Manager',
    phase: 'Public repository · TypeScript',
    kind: 'GitHub',
    image: '/media/projects/phae-task-manager.webp',
    summary:
      'An offline-capable collaborative task manager with shared lists, priorities, notes, a calendar view, Pomodoro sessions, and optional AI subtask suggestions.'
  },
  {
    number: '09',
    title: 'Expense Tracker',
    phase: 'Public repository · JavaScript',
    kind: 'GitHub',
    image: '/media/projects/expense-concept.webp',
    summary:
      'A private-by-default, local-first tracker that turns everyday expenses into clear category, trend, and streak views without requiring an account.'
  },
  {
    number: '10',
    title: 'Voting Platform',
    phase: 'Public repository',
    kind: 'GitHub',
    image: '/media/projects/voting-platform-concept.avif',
    summary:
      'An early voting-platform project space, kept intentionally lean while its public build takes shape.'
  },
  {
    number: '11',
    title: 'Basketball Scoreboard',
    phase: 'Public repository · CSS',
    kind: 'GitHub',
    image: '/media/projects/basketball-scoreboard-concept.avif',
    summary:
      'A focused basketball scoreboard prototype for keeping the game’s score visible at a glance.'
  },
  {
    number: '12',
    title: 'Calculator',
    phase: 'Public repository · HTML',
    kind: 'GitHub',
    image: '/media/projects/calculator-concept.avif',
    summary:
      'A compact calculator prototype that distils essential arithmetic into a single, tactile interface.'
  },
  {
    number: '13',
    title: 'Passenger Counter',
    phase: 'Passenger counter app · HTML, CSS and JavaScript',
    kind: 'GitHub',
    image: '/media/projects/passenger-counter-concept.avif',
    summary:
      'A simple passenger-counting interface that turns a repeated everyday count into one clear, live number.'
  },
  {
    number: '14',
    title: 'Flot Business',
    phase: 'Public product collaboration',
    kind: 'GitHub collaboration',
    image: '/media/projects/flot-business.webp',
    summary:
      'A business-facing Flot product collaboration, built as a Svelte web experience for the wider financial ecosystem.'
  },
  {
    number: '15',
    title: 'Flot Platform',
    phase: 'Public product collaboration',
    kind: 'GitHub collaboration',
    image: '/media/projects/flot-platform.webp',
    summary:
      'A multi-vertical commerce showcase connecting hotel, restaurant, travel, and store flows through one white-label Flot checkout with dual USD and Le pricing.'
  },
  {
    number: '16',
    title: 'Flot Website Dashboard',
    phase: 'Public product collaboration',
    kind: 'GitHub collaboration',
    image: '/media/projects/flot-dashboard.webp',
    summary:
      'A public Flot dashboard collaboration built with Next.js, providing an early interface layer for the connected product ecosystem.'
  },
  {
    number: '17',
    title: 'Belvoir Hotel',
    phase: 'Public website collaboration',
    kind: 'GitHub collaboration',
    image: '/media/projects/belvoir-hotel.webp',
    summary:
      'An editorial digital front door for Belvoir Hotel & Furnished Residence in Freetown, presenting a luxury stay with clarity and restraint.'
  },
  {
    number: '18',
    title: 'Bondumani',
    phase: 'Public website collaboration',
    kind: 'GitHub collaboration',
    image: '/media/projects/bondumani.webp',
    summary:
      'A dual-world digital gateway for Bondumani Art & Resort, pairing a Freetown hospitality narrative with cinematic motion and responsive editorial layouts.'
  },
  {
    number: '19',
    title: 'Bridges of Hope',
    phase: 'Public website collaboration',
    kind: 'GitHub collaboration',
    image: '/media/projects/bridges-of-hope.webp',
    summary:
      'A public website collaboration for Bridges of Hope, delivered as a responsive Next.js experience.'
  },
  {
    number: '20',
    title: 'Dove Group',
    phase: 'Public website collaboration',
    kind: 'GitHub collaboration',
    image: '/media/projects/dove-group.webp',
    summary:
      'A Sierra Leonean group-of-companies website that brings its marketplace into a connected Flot checkout experience.'
  },
  {
    number: '21',
    title: 'Sierra 247',
    phase: 'Public website collaboration',
    kind: 'GitHub collaboration',
    image: '/media/projects/sierra-247.webp',
    summary:
      'A professional web presence for Sierra 24/7 Securicor and Logistics Services, designed to make a security business feel clear and credible.'
  }
];
