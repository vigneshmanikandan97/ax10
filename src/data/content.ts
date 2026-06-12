/** Site-wide copy and navigation. Keep marketing text here, not scattered in components. */

export const navLinks = [
  { label: 'What We Do', href: '#what-we-do' },
  { label: 'Why Us', href: '#why-us' },
  { label: 'Stories', href: '#stories' },
] as const

export const footerLinks = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
  { label: 'Contact', href: '/contact' },
] as const

export const CONTACT_EMAIL = 'launch@ax10.in'
export const SUPPORT_EMAIL = 'harish@ax10.in'

export const siteMeta = {
  title: 'AX10 | High-Performance Experience Engineering',
  description:
    'AX10 is an AI-native engineering studio in Chennai. We build software that makes complex systems useful to real people.',
} as const

export const heroCopy = {
  badge: 'Available for new projects',
  headlineLead: 'High-Performance',
  headlineAccent: 'Experience Engineering',
  subhead:
    'We build software that makes complex AI useful to real people. Based in Chennai, working with teams worldwide.',
} as const

export const capabilitiesIntro = {
  title: 'What we do',
  body: 'We design and ship AI-native products: the architecture underneath, the interface on top, and the path from idea to production.',
} as const

export const capabilities = [
  {
    icon: 'architecture',
    title: 'Architectural Design',
    tag: 'SYSTEM DESIGN',
    description:
      'Systems that grow with you. We design backends and data layers built to last, not just to launch.',
  },
  {
    icon: 'dynamic_form',
    title: 'Adaptive Interfaces',
    tag: 'USER EXPERIENCE',
    description:
      'Interfaces that respond to what users actually need, not just what a wireframe assumed on day one.',
  },
  {
    icon: 'precision_manufacturing',
    title: 'Streamlined Delivery',
    tag: 'PRODUCT EXECUTION',
    description:
      'We cut noise until only the essential work remains, then ship it with care from first commit to production.',
  },
] as const

export const capabilityPillars = [
  {
    index: '01',
    label: 'Synthetic Architecture',
    summary:
      'Foundations that handle scale early, so you are not rebuilding when traffic arrives.',
  },
  {
    index: '02',
    label: 'Intelligent UI Layers',
    summary:
      'UI that adapts to context and intent, so users spend less time figuring out your product.',
  },
  {
    index: '03',
    label: 'Frictionless Delivery',
    summary:
      'Small teams, clear milestones, and AI where it saves time. Every release reviewed by a human.',
  },
] as const

export const whyUsProcess = {
  headline: 'You dream it. We build it.',
  body: 'No theatre. No filler phases. We scope the work, show progress early, and ship production code your team can run.',
  steps: [
    {
      title: 'You bring the problem and the outcome',
      description:
        'Tell us what is broken and what success looks like. We ask the awkward questions early, agree on scope, and put a realistic timeline on the table before a single line of code is written.',
    },
    {
      title: 'We design, build, and validate in the open',
      description:
        'You see work in progress every week, not a big reveal at the end. Demos run on real data, your feedback lands directly in the build, and nothing disappears into a black box.',
    },
    {
      title: 'You get working software, not a slide deck',
      description:
        'We hand over production code your team can read, run, and extend. Documentation, deploy pipelines and a proper walkthrough come included, so you own it from day one.',
    },
  ],
} as const

export const whyUsCards = [
  {
    index: '01',
    title: 'Technical Expertise',
    body:
      'Senior engineers who have shipped production systems at scale—not slide decks. We write code your team can read, extend, and own: clear architecture, sensible abstractions, and documentation that survives the first handoff.',
    accent: '#69C991',
  },
  {
    index: '02',
    title: 'Strategic Assets',
    body:
      'Every build is treated as business infrastructure, not a one-off deliverable. We design for reusable IP, maintainable systems, and decisions that compound—so what we ship keeps paying off long after we step back.',
    accent: '#9FFFB0',
  },
  {
    index: '03',
    title: 'Purposeful Simplicity',
    body:
      'We strip steps, screens, and jargon until the product feels inevitable. Simplicity is not decoration—it is the hard work of knowing what to leave out so users never have to think twice.',
    accent: '#69C991',
  },
  {
    index: '04',
    title: 'AI-First Delivery',
    body:
      'AI handles the repetitive layers—boilerplate, tests, migrations—so our team spends time on judgment, taste, and your context. You get faster delivery without trading away quality or accountability.',
    accent: '#9FFFB0',
  },
  {
    index: '05',
    title: 'Human-Centric by Default',
    body:
      'Every feature starts with a real person and a real problem. We design for the humans using the software, not the architecture diagram. Technology should shorten someone’s day, not add to it.',
    accent: '#69C991',
  },
] as const

/** Placeholder quotes until real client approvals are in place. */
export const testimonials = [
  {
    initials: 'JD',
    quote:
      'AX10 did not just hand us an app. They built internal tooling that cut our ops load by a third within six months.',
    name: 'John Doe',
    role: 'CTO, NexaCorp',
  },
  {
    initials: 'SL',
    quote:
      'Response times improved immediately after launch. Our support team finally has a workflow they trust.',
    name: 'Sarah Liao',
    role: 'VP Engineering, FluxAI',
  },
  {
    initials: 'MK',
    quote:
      'Technically sharp and easy to work with. They understood our constraints and did not over-engineer the answer.',
    name: 'Marcus Koenig',
    role: 'Founder, Quantum Ledger',
  },
] as const

export const testimonialsHeading = 'What clients say about working with us'
