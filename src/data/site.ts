/* ------------------------------------------------------------------
   Central content source.
   Sourced from github.com/chavansrikar and linkedin.com/in/chavansrikar
------------------------------------------------------------------ */

export const profile = {
  name: 'Chavan Srikar',
  firstName: 'Chavan',
  lastName: 'Srikar',
  handle: 'chavansrikar',
  role: 'AI Generalist & Full-Stack Builder',
  tagline: 'I turn ideas into working prototypes in 5–10 minutes.',
  location: 'Bhongir, Telangana, India',
  company: 'AIML Dashers',
  email: 'chavansrikar@gmail.com',
  bio: `AI generalist and full-stack builder based in India. I work across computer
    vision, deep learning, and LLM tooling, and I lean heavily on "vibe coding" — for a
    well-scoped problem with the right data or APIs already available, I can get a working
    prototype up in 5–10 minutes, then spend the real time making it accurate and robust.`,
  summary: `Most of my work follows the same loop: get something running fast enough to see if
    the idea holds up, then go back and do it properly — real preprocessing, model tuning,
    proper outputs, a UI someone else could actually use.`,
  mission: `I finished the AI & ML diploma, then took the lateral entry seat into B.Tech CSE
    at ACE Engineering College (TG ECET, rank 1965) — because after living inside the model
    layer I wanted to understand the hardware architecture and infrastructure underneath it.
    The goal is simple: build things that hold up, and put them to work for Bharat and
    Viksit Bharat 2047.`,
  links: {
    github: 'https://github.com/chavansrikar',
    linkedin: 'https://www.linkedin.com/in/chavansrikar/',
    instagram: 'https://www.instagram.com/srikar_24_9/',
    huggingface: 'https://huggingface.co/srikarrr',
    email: 'mailto:chavansrikar@gmail.com',
  },
} as const

export const roles = [
  'AI / ML Engineer',
  'Computer Vision Dev',
  'Deep Learning Explorer',
  'LLM Tool Orchestrator',
  'Full-Stack Builder',
  'Vibe Coder',
] as const

export const stats = [
  { value: 19, suffix: '', label: 'Public Repos', sub: 'on GitHub' },
  { value: 11, suffix: '', label: 'Stars Earned', sub: 'across repos' },
  { value: 7, suffix: '', label: 'Followers', sub: 'GitHub' },
  { value: 35, suffix: '+', label: 'Hackathon Tools', sub: 'curated & shipped' },
] as const

export const focusAreas = [
  {
    title: 'Computer Vision',
    icon: 'camera',
    desc: 'Pose estimation, object detection and video analysis that run end-to-end on real footage.',
  },
  {
    title: 'Deep Learning',
    icon: 'brain',
    desc: 'LSTM sequence models, anomaly detection and image classification pipelines.',
  },
  {
    title: 'LLM Orchestration',
    icon: 'sparkles',
    desc: 'Wiring models, APIs and tools together into end-to-end AI products.',
  },
  {
    title: 'Full-Stack Products',
    icon: 'layers',
    desc: 'From local SQLite databases to deployed web apps someone else can actually use.',
  },
] as const

export type Skill = {
  name: string
  level: number
  category: 'AI / ML' | 'Computer Vision' | 'Languages' | 'Frontend' | 'Backend & Data' | 'DevOps'
}
export const skillCategories = [
  'AI / ML',
  'Computer Vision',
  'Languages',
  'Frontend',
  'Backend & Data',
  'DevOps',
] as const

/**
 * Compact ASCII illustrations for every technology.
 * These render inside the skill tiles and glitch on hover.
 */
export const skillArt: Record<string, string[]> = {
  Python: ['╔═╗', '║ ║', '╚═╝'],
  'TensorFlow / Keras': ['●──●', '│╲ │', '●─●─●'],
  PyTorch: [' ▄█ ', ' ███ ', '█▀█▀█', ' ▀▀▀ '],
  'scikit-learn': ['╭───╮', '│◉◉◉│', '╰───╯'],
  'LSTM / Time-Series': ['╭─╮ ╭─', '│ │ │ ╰', '╰─╯ ╰─'],
  'Isolation Forest': ['  ╱╲  ', ' ╱▓▓╲ ', '╱▓▓▓▓╲'],
  'Pandas / NumPy': ['┌─┬─┐', '├─┼─┤', '└─┴─┘'],
  'LLM Tool Orchestration': ['╭────╮', '│••••│', '╰──┬─╯'],
  OpenCV: [' ╭──╮ ', '╱ ◉◉ ╲', ' ╰──╯ '],
  'MediaPipe Pose': ['  ●  ', ' ╱│╲ ', '● ● ●', '  │  '],
  YOLOv8: ['┌─────┐', '│  ●  │', '└─────┘'],
  'Image Processing': ['▲   ▲', '▲▲ ▲ ▲', '───────'],
  'ffmpeg / Video IO': ['┌─┬─┬─┐', '│ │ │ │', '└─┴─┴─┘'],
  JavaScript: ['╔═╗', '║J║', '╚═╝'],
  Java: ['( (', ' ) )', '‿‿'],
  TypeScript: ['╔═╗', '║T║', '╚═╝'],
  SQL: ['╭──╮', '│▓▓│', '╰──╯'],
  'C / C++': ['$_', ' |', '‾'],
  'React / Next.js': [' ╭╮ ', '─╯╰─', ' ╰╯ '],
  'Tailwind CSS': ['≈≈≈≈', '~~~~'],
  Gradio: ['●─●─●', ' │ ║ │', ' ●─●─●'],
  Streamlit: ['▁▂▃▅▇', '▁▂▃▅▇'],
  'HTML / CSS': ['</', ' >', '   '],
  'Framer Motion': ['→ →', '  →', '→ →'],
  'Node.js / Express': ['╱╲', '╱ ╲', '╲ ╱'],
  SQLite: ['═══', '▓▓▓', '═══'],
  SQLAlchemy: ['╔═╗', '║║║', '╚═╝'],
  Pydantic: ['╱▔▔╲', '╲__╱'],
  'Plotly / Matplotlib': ['•  •', '   ••'],
  'REST APIs': ['→  →', '←  ←'],
  'Git / GitHub': ['╭─╮', '│ ╰╮', '╰─╯'],
  Docker: ['▄▄▄▄▄', '▟█████', '▔▔▔▔▔'],
  'Hugging Face Spaces': [' ◕‿◕ ', ' ‾‿‾ '],
  'Vercel / Render': [' ▲ ', '▲▲▲'],
  'Linux / Bash': ['$_', ' ║ '],
}

export const skills: Skill[] = [
  // AI / ML
  { name: 'Python', level: 92, category: 'AI / ML' },
  { name: 'TensorFlow / Keras', level: 88, category: 'AI / ML' },
  { name: 'PyTorch', level: 78, category: 'AI / ML' },
  { name: 'scikit-learn', level: 85, category: 'AI / ML' },
  { name: 'LSTM / Time-Series', level: 82, category: 'AI / ML' },
  { name: 'Isolation Forest', level: 84, category: 'AI / ML' },
  { name: 'Pandas / NumPy', level: 90, category: 'AI / ML' },
  { name: 'LLM Tool Orchestration', level: 80, category: 'AI / ML' },
  // CV
  { name: 'OpenCV', level: 87, category: 'Computer Vision' },
  { name: 'MediaPipe Pose', level: 89, category: 'Computer Vision' },
  { name: 'YOLOv8', level: 84, category: 'Computer Vision' },
  { name: 'Image Processing', level: 83, category: 'Computer Vision' },
  { name: 'ffmpeg / Video IO', level: 76, category: 'Computer Vision' },
  // Languages
  { name: 'JavaScript', level: 82, category: 'Languages' },
  { name: 'Java', level: 80, category: 'Languages' },
  { name: 'TypeScript', level: 76, category: 'Languages' },
  { name: 'SQL', level: 79, category: 'Languages' },
  { name: 'C / C++', level: 68, category: 'Languages' },
  // Frontend
  { name: 'React / Next.js', level: 80, category: 'Frontend' },
  { name: 'Tailwind CSS', level: 84, category: 'Frontend' },
  { name: 'Gradio', level: 92, category: 'Frontend' },
  { name: 'Streamlit', level: 88, category: 'Frontend' },
  { name: 'HTML / CSS', level: 85, category: 'Frontend' },
  { name: 'Framer Motion', level: 72, category: 'Frontend' },
  // Backend & Data
  { name: 'Node.js / Express', level: 83, category: 'Backend & Data' },
  { name: 'SQLite', level: 88, category: 'Backend & Data' },
  { name: 'SQLAlchemy', level: 78, category: 'Backend & Data' },
  { name: 'Pydantic', level: 80, category: 'Backend & Data' },
  { name: 'Plotly / Matplotlib', level: 86, category: 'Backend & Data' },
  { name: 'REST APIs', level: 82, category: 'Backend & Data' },
  // DevOps
  { name: 'Git / GitHub', level: 90, category: 'DevOps' },
  { name: 'Docker', level: 70, category: 'DevOps' },
  { name: 'Hugging Face Spaces', level: 85, category: 'DevOps' },
  { name: 'Vercel / Render', level: 75, category: 'DevOps' },
  { name: 'Linux / Bash', level: 72, category: 'DevOps' },
]

export type Project = {
  slug: string
  title: string
  tagline: string
  description: string
  problem: string
  built: string
  why: string
  stack: string[]
  category: 'AI / ML' | 'Computer Vision' | 'Full-Stack' | 'DevTools' | 'Blockchain'
  featured: boolean
  year: string
  url?: string
  demo?: string
  stars?: number
  ascii: string
  accent: string
  metrics?: { label: string; value: string }[]
}

export const projects: Project[] = [
  {
    slug: 'ngpme',
    title: 'NGPME — Prosthetic Mobility Enhancer',
    tagline: 'Turn a phone video into a clinical-grade gait report',
    description:
      'A video-based gait analysis system that turns a plain smartphone video into biomechanical insight — pose landmarks, 18+ metrics, an LSTM classifier, an Isolation Forest anomaly detector and a single fall-risk score.',
    problem:
      'Prosthetic users and clinicians need expensive motion-capture labs to assess gait quality and fall risk.',
    built:
      'MediaPipe extracts 33 body landmarks from every frame. The system derives 18+ biomechanical metrics — cadence, knee asymmetry, pelvic tilt range, stride variability and minimum toe clearance — then runs an LSTM classifier for gait pattern and an Isolation Forest for irregular movement. Output is an annotated HUD video, Plotly charts and a unified fall-risk score.',
    why: 'Makes biomechanical assessment accessible from a phone camera. No lab required.',
    stack: [
      'Python',
      'Gradio',
      'MediaPipe',
      'OpenCV',
      'TensorFlow',
      'scikit-learn',
      'SQLite',
      'ffmpeg',
    ],
    category: 'AI / ML',
    featured: true,
    year: '2025',
    url: 'https://github.com/chavansrikar/NGPME_major_project',
    demo: 'https://huggingface.co/spaces/srikarrr/NGPME_major_project',
    stars: 0,
    ascii: '🦿',
    accent: 'from-cyan-500/25 to-blue-600/10',
    metrics: [
      { label: 'Landmarks', value: '33' },
      { label: 'Biomech metrics', value: '18+' },
      { label: 'Risk score', value: '0-100' },
    ],
  },
  {
    slug: 'bharat-health',
    title: 'Bharat Health Detective Care',
    tagline: 'A district-level health operations operating picture',
    description:
      'An integrated healthcare operations and public-health intelligence workspace. 17 screens covering infrastructure, workforce, screening, diagnostics, referrals, campaigns, employment, analytics and a consent-led citizen portal — all computed live from a local SQLite database.',
    problem:
      'Public-health capacity is invisible. Facilities, workforce, screening and referrals live in silos, so gaps go unnoticed.',
    built:
      'Gradio 5 UI over a strict service layer and SQLAlchemy 2 ORM — UI callbacks contain no SQL. 8 role-based workspaces, a referral state machine with urgent-destination safety rules, 12 CSV report exports, and a deterministic demo reset.',
    why:
      'Turns fragmented capacity into one governed picture that an administrator can act on.',
    stack: ['Python', 'Gradio 5', 'SQLAlchemy', 'SQLite', 'Pydantic', 'Pandas', 'Plotly'],
    category: 'AI / ML',
    featured: true,
    year: '2026',
    url: 'https://github.com/chavansrikar/Bharat-Health-Detective-Care',
    stars: 0,
    ascii: '🏥',
    accent: 'from-emerald-500/25 to-teal-600/10',
    metrics: [
      { label: 'Screens', value: '17' },
      { label: 'Roles', value: '8' },
      { label: 'CSV exports', value: '12' },
    ],
  },
  {
    slug: 'dr-shalini',
    title: "Dr. Shalini's Homoeopathy",
    tagline: 'A production clinic site with a no-code content editor',
    description:
      'A complete rebuild of a live homoeopathy clinic website on Next.js 15 with an embedded Sanity Studio, so the practice owner can publish articles and edit copy without touching code.',
    problem:
      'The clinic needed a fast, modern site with an editing path that required zero developer time.',
    built:
      'Next.js 15 App Router, TypeScript, Tailwind CSS 4, Sanity headless CMS with embedded Studio, Framer Motion transitions, react-hook-form + Zod validation, and Vercel deployment.',
    why:
      'Real, live, client-facing production work — not a toy demo.',
    stack: ['Next.js 15', 'TypeScript', 'Tailwind 4', 'Sanity CMS', 'Framer Motion', 'Vercel'],
    category: 'Full-Stack',
    featured: true,
    year: '2026',
    url: 'https://github.com/chavansrikar/Dr_shalini',
    demo: 'https://www.drshalinis.com',
    stars: 0,
    ascii: '🌿',
    accent: 'from-pink-500/25 to-rose-600/10',
    metrics: [
      { label: 'Live site', value: 'YES' },
      { label: 'CMS', value: 'Sanity' },
      { label: 'Editor at', value: '/admin' },
    ],
  },
  {
    slug: 'nostromo-guard',
    title: 'Nostromo Guard',
    tagline: 'Pre-flight smart-contract risk audit, fully offline',
    description:
      'A privacy-first DeFi risk optimizer that heuristically audits smart contract code and simulates liquidity and volatility trends — nothing ever leaves the machine.',
    problem:
      'DeFi launchpads and investors have no fast, local way to sanity-check a contract before committing funds.',
    built:
      'A custom regex heuristic engine scanning for reentrancy, `tx.origin` phishing and unchecked external calls, producing a 0–100 risk score, plus a Monte-Carlo random walk simulating 30-day TVL with automatic liquidity-crunch detection.',
    why: 'Instant, zero-cost, offline risk signal before you deploy or invest.',
    stack: ['Python', 'Gradio', 'Regex Heuristics', 'Monte Carlo', 'Matplotlib'],
    category: 'Blockchain',
    featured: true,
    year: '2025',
    url: 'https://github.com/chavansrikar/Nostromo-Guard-AI-Powered-DeFi-Risk-Optimizer',
    stars: 0,
    ascii: '🛡️',
    accent: 'from-purple-500/25 to-orange-600/10',
    metrics: [
      { label: 'Risk score', value: '0-100' },
      { label: 'TVL horizon', value: '30d' },
      { label: 'Network calls', value: '0' },
    ],
  },
  {
    slug: 'crowd-density',
    title: 'Crowd Density & Stampede Prevention',
    tagline: 'Real-time crowd monitoring with pre-threshold alerts',
    description:
      'A YOLOv8 + OpenCV Streamlit application that detects people in a video feed, computes crowd density and raises alerts before density crosses unsafe thresholds.',
    problem:
      'Overcrowding at events and public spaces is a real safety hazard that is hard to monitor manually.',
    built:
      'Ultralytics YOLOv8 person detection over an OpenCV frame pipeline, with NumPy-based density estimation, threshold alerting and a friendly local Streamlit interface.',
    why: 'A lightweight, easy-to-run demo of applied CV for public safety.',
    stack: ['Python', 'Streamlit', 'YOLOv8', 'OpenCV', 'NumPy'],
    category: 'Computer Vision',
    featured: false,
    year: '2025',
    url: 'https://github.com/chavansrikar/crowd-density-prevention',
    stars: 1,
    ascii: '👥',
    accent: 'from-lime-500/25 to-green-600/10',
    metrics: [
      { label: 'Detector', value: 'YOLOv8' },
      { label: 'Interface', value: 'Streamlit' },
      { label: 'Runs', value: 'Local' },
    ],
  },
  {
    slug: 'omnix',
    title: 'Omnix Voice Assistant',
    tagline: 'A browser voice assistant with speech in and speech out',
    description:
      'A voice-controlled virtual assistant using the Web Speech API for both recognition and synthesis — opens sites, runs quick Google and YouTube searches and answers back out loud. Led a team of six on this.',
    problem:
      'Most voice-assistant tutorials stop at recognition and never reach real usability.',
    built:
      'HTML5, CSS3 and ES6 on the front with an Express Node backend, Web Speech API for recognition and TTS, and a modern animated interface. Deployed on Render.',
    why: 'Team-lead project for the Diploma College Project Expo — architecture, coordination and prototyping were mine.',
    stack: ['JavaScript', 'Node.js', 'Express', 'Web Speech API'],
    category: 'Full-Stack',
    featured: false,
    year: '2025',
    url: 'https://github.com/chavansrikar/project-on-voice-assistant',
    demo: 'https://project-on-voice-assistant-060.onrender.com/',
    stars: 1,
    ascii: '🎙️',
    accent: 'from-indigo-500/25 to-violet-600/10',
    metrics: [
      { label: 'Team size', value: '6' },
      { label: 'Role', value: 'Lead' },
      { label: 'Voice I/O', value: '2-way' },
    ],
  },
  {
    slug: 'wheat-disease',
    title: 'Automated Wheat Disease Detection',
    tagline: 'Upload a wheat leaf photo, get a diagnosis',
    description:
      'An end-to-end deep-learning pipeline with a Gradio front end that classifies wheat leaf images into disease categories.',
    problem: 'Farmers need a fast, low-cost way to identify crop disease before it spreads.',
    built:
      'A convolutional image classifier wrapped in a Gradio interface so diagnosis is as simple as uploading a photo.',
    why: 'Lowers the barrier from "something is wrong" to "here is what it is".',
    stack: ['Python', 'Gradio', 'Deep Learning', 'Computer Vision'],
    category: 'AI / ML',
    featured: false,
    year: '2026',
    url: 'https://github.com/chavansrikar/Automated-Wheat-Disease-Detection',
    stars: 0,
    ascii: '🌾',
    accent: 'from-yellow-500/25 to-purple-600/10',
    metrics: [
      { label: 'Input', value: '1 photo' },
      { label: 'Output', value: 'Disease' },
      { label: 'Interface', value: 'Gradio' },
    ],
  },
  {
    slug: 'error-explainer',
    title: 'Universal Error Explainer',
    tagline: 'Stack traces translated into plain language',
    description:
      'A web-based platform that explains programming errors across Python, Java, C/C++, JavaScript and SQL with concise, beginner-friendly explanations and debugging tips.',
    problem:
      'Beginners get stuck on cryptic errors from five different languages with no single place to understand them.',
    built:
      'A Python web application with a curated error-pattern matching engine covering six languages, fully browser-accessible with no local setup required.',
    why: 'Built for people who are still learning to read a stack trace.',
    stack: ['Python', 'Web', 'NLP Rules'],
    category: 'DevTools',
    featured: false,
    year: '2025',
    url: 'https://github.com/chavansrikar/universal-error-explainer-tool',
    stars: 2,
    ascii: '🐞',
    accent: 'from-rose-500/25 to-pink-600/10',
    metrics: [
      { label: 'Languages', value: '6' },
      { label: 'Access', value: 'Browser' },
      { label: 'Stars', value: '2' },
    ],
  },
  {
    slug: 'tools-for-hackathon',
    title: 'Tools-For-Hackathon',
    tagline: 'The 35+ toolkit behind the 5-minute build',
    description:
      'A curated, battle-tested list of 35+ tools, websites and frameworks for winning hackathons — from pitch decks and prototyping to deployment, AI tooling and backend shortcuts.',
    problem: 'Under a hackathon deadline, discovering the right tool is itself a bottleneck.',
    built:
      'A carefully organised reference across pitching, UI/UX, AI and LLM frameworks, datasets and models, backend APIs and databases, deployment and hosting, and development tooling.',
    why: 'The exact toolkit I use to hit 5–10 minute prototype speed — shared so others can move just as fast.',
    stack: ['Markdown', 'Open Source', 'Community'],
    category: 'DevTools',
    featured: false,
    year: '2025',
    url: 'https://github.com/chavansrikar/Tools-For-Hackathon',
    stars: 4,
    ascii: '🧰',
    accent: 'from-cyan-500/25 to-sky-600/10',
    metrics: [
      { label: 'Tools', value: '35+' },
      { label: 'Stars', value: '4' },
      { label: 'Forks', value: '0' },
    ],
  },
]

export type TimelineEntry = {
  period: string
  title: string
  org: string
  location: string
  points: string[]
  type: 'work' | 'education' | 'certification' | 'achievement'
  current?: boolean
}

export const timeline: TimelineEntry[] = [
  {
    period: '2026 — Present',
    title: 'B.Tech — Computer Science & Engineering (Lateral Entry)',
    org: 'ACE Engineering College',
    location: 'Hyderabad, India',
    points: [
      'Entered through the lateral entry route after finishing the AI & ML diploma.',
      'Rank 1965 in the TG ECET (CBT) entrance exam — ACE Engineering College, Hyderabad.',
      'Chose CSE to get past the model layer and understand the hardware architecture and infrastructure underneath it.',
      'Building towards solutions that contribute to Viksit Bharat 2047.',
    ],
    type: 'education',
    current: true,
  },
  {
    period: '2023 — 2026',
    title: 'AI & ML Diploma',
    org: 'Samskruti College, Ghatkesar',
    location: 'Hyderabad, India',
    points: [
      'Completed the AI & Machine Learning diploma — computer vision, deep learning, model tuning and applied ML engineering.',
      'Final-year project: NGPME, a video-based gait analysis blueprint for prosthetic users.',
      'Published the Bharat Health Detective Care healthcare operations platform as the capstone build.',
    ],
    type: 'education',
  },
  {
    period: '2025 — 2026',
    title: 'Google for Developers',
    org: 'Developer Program',
    location: 'Remote',
    points: [
      'Practical work with cloud tooling, APIs and deployment pipelines.',
      'Applied the AWS Lambda and cloud-computing track to real projects and demos.',
    ],
    type: 'work',
  },
  {
    period: '2025 — 2026',
    title: 'Infosys Springboard — Deep Learning',
    org: 'Infosys',
    location: 'Virtual Internship',
    points: [
      'Completed the Deep Learning certification track covering neural networks, training and evaluation.',
      'Shipped the Nostromo Guard prototype for the Qubic Nostromo Launchpad hackathon track.',
    ],
    type: 'certification',
  },
  {
    period: '2025 — 2026',
    title: 'Infosys Foundation — Centum Foundation, SkillUp',
    org: 'Infosys Foundation',
    location: 'Remote',
    points: [
      'Selected for the SkillUp skilling track focused on job-ready applied technology skills.',
    ],
    type: 'certification',
  },
  {
    period: '2025',
    title: 'Omnix Voice Assistant — Team Lead',
    org: 'Diploma 2nd Year College Project Expo',
    location: 'Hyderabad, India',
    points: [
      'Led and coordinated a team of six through architecture, prototyping and the expo demo.',
      'Built the Web Speech API recognition and synthesis pipeline with an Express backend.',
    ],
    type: 'achievement',
  },
  {
    period: '2026',
    title: 'TG ECET — Rank 1965',
    org: 'Telangana Common Entrance Test (CBT)',
    location: 'Telangana, India',
    points: [
      'Ranked 1965 in the computer-based entrance exam that secured the lateral entry seat at ACE Engineering College.',
    ],
    type: 'achievement',
  },
  {
    period: '2025 — 2026',
    title: 'VBYLD 2026 — Viksit Bharat Young Leaders Dialogue',
    org: 'Government of Telangana · Dept. of Youth Services',
    location: 'Vidyas Nagar, Hyderabad',
    points: [
      'Participation certificate for the Viksit Bharat Challenge — Telangana, 19–20 December 2025.',
      'Entered as an individual participant representing Yadadri Bhuvanagiri, with the theme #AatmanirbharBharat — how AI and ML can solve real-world challenges.',
      'Presented the pitch to a panel at the state-level championship in Hyderabad.',
    ],
    type: 'achievement',
  },
  {
    period: '2026',
    title: 'My Bharat Budget — National Quiz',
    org: 'Ministry of Finance, Govt. of India',
    location: 'National Level',
    points: [
      'Participated in national-level quizzes tracking the Union Budget and fiscal policy.',
    ],
    type: 'achievement',
  },
  {
    period: '2025 — Present',
    title: 'GeeksforGeeks Community',
    org: 'GfG Connect',
    location: 'Remote',
    points: [
      'Regular contributor to the developer community through GfG Connect and practice tracks.',
    ],
    type: 'achievement',
  },
]

export type Achievement = {
  title: string
  detail: string
  emoji: string
  href?: string
}

export const achievements: Achievement[] = [
  {
    title: 'VBYLD 2026 — Participation Certificate',
    detail: 'Viksit Bharat Young Leaders Dialogue · Solo participant',
    emoji: '🏆',
    href: 'https://lnkd.in/p/d5VwF7Dm',
  },
  {
    title: 'My Bharat Budget Quest 2026',
    detail: 'National level quiz participant',
    emoji: '📊',
  },
  {
    title: 'Infosys Springboard',
    detail: 'Deep Learning — Virtual Internship 2025',
    emoji: '🧠',
  },
  {
    title: 'Infosys Foundation SkillUp',
    detail: 'Centum Foundation skilling track',
    emoji: '🌱',
  },
  {
    title: 'Google for Developers',
    detail: 'Developer program participant',
    emoji: '🔵',
  },
  {
    title: 'Qubic Nostromo Launchpad',
    detail: 'Hackathon — Nostromo Guard prototype',
    emoji: '🛡️',
  },
  {
    title: 'GeeksforGeeks Connect',
    detail: 'Community contributor',
    emoji: '💻',
  },
  {
    title: 'Pull Shark',
    detail: 'GitHub achievement — merged PRs',
    emoji: '🦈',
  },
]

/** Posts published on LinkedIn — surfaced as a writing feed. */
export type Post = {
  title: string
  excerpt: string
  tags: string[]
  platform: 'LinkedIn'
  date?: string
  url: string
}

/** Where the LinkedIn post lives. */
const POST_URL = 'https://www.linkedin.com/in/chavansrikar/recent-activity/all/'

/** Verified permalinks for individual posts. */
const POST_LINKS: Record<string, string> = {
  'My Bharat Budget Quest 2026':
    'https://www.linkedin.com/posts/chavansrikar_learningneverstops-mybharat-budget2026-activity-7424484938600615936-MoEO',
  'Moving from Localhost to the Cloud':
    'https://www.linkedin.com/posts/chavansrikar_geeksforgeeks-gfgconnect-awslambda-activity-7415405898216443905-EqSX',
  'Infosys Springboard — Deep Learning':
    'https://www.linkedin.com/posts/chavan-srikar-b394732bb_course-completion-certificate-from-infosys-activity-7334961888876736512-sK01',
  'From State-Level to National Aspirations — My VBYLD 2026 Journey':
    'https://lnkd.in/p/d5VwF7Dm',
}

/** ASCII illustration per post, shown in the feed panel. */
export const postArt: Record<string, string[]> = {
  'From State-Level to National Aspirations — My VBYLD 2026 Journey': [
    '      ╔═══════════╗',
    '   ╔══╣  ▄▄▄▄▄▄▄▄  ╠══╗',
    '   ║  ║  █ V B Y L D  ║  ║',
    '   ║  ╚══╤═══════╤══╝  ║',
    '   ║     │ 8 / 13 │     ║',
    '   ║  ╔══╧═══════╧══╗  ║',
    '   ╚══╣   ★ SOLO   ╠══╝',
    '      ╚═══════╤═════╝',
    '              ▼',
  ],
  'My Bharat Budget Quest 2026': [
    '  ╭───────╮',
    '  │ ███▓▓░ │',
    '  │ ▓▓░░░░ │',
    '  ╰───┬───╯',
    '    ₹ │ ₹   ',
    '  ┌───┴───┐ ',
    '  │ budget │ ',
  ],
  'Moving from Localhost to the Cloud': [
    '      ╭────╮',
    '      │  ↓  │',
    '   ╭──┴────┴──╮',
    '   │  λ deploy │',
    '   ╰──┬────┬──╯',
    '      │    │',
    '  local     prod',
  ],
  'Infosys Springboard — Deep Learning': [
    '   ●───●───●',
    '   │╲  │  ╱│',
    '   │ ╲ │ ╱ │',
    '   ●───●───●',
    '   │╱  │  ╲│',
    '   │╱  │  ╲│',
    '   ●───●───●',
  ],
  'Infosys Foundation SkillUp — Centum Foundation': [
    '            ╱▔╲',
    '         ╱▔▔▔▔╲',
    '      ╱▔▔▔▔▔▔▔▔╲',
    '   ╱▔▔▔▔▔▔▔▔▔▔▔▔▔╲',
    '  ╱▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔╲',
    ' ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔',
    '        ▲ skill',
  ],
  'Turning Ideas Into Impactful Startup Plans': [
    '      ▲',
    '     ▄█▄',
    '    ▀███▀',
    '   ▄█████▄',
    '  ▀███████▀',
    ' ░░░░░░░░░░',
    '    ╱    ╲',
  ],
}

/** Small single-character mark per post, shown in the feed list. */
export const postGlyph: Record<string, string> = {
  'From State-Level to National Aspirations — My VBYLD 2026 Journey': '★',
  'My Bharat Budget Quest 2026': '$',
  'Moving from Localhost to the Cloud': '~',
  'Infosys Springboard — Deep Learning': '*',
  'Infosys Foundation SkillUp — Centum Foundation': '^',
  'Turning Ideas Into Impactful Startup Plans': '>',
}

export const posts: Post[] = [
  {
    title: 'From State-Level to National Aspirations — My VBYLD 2026 Journey',
    excerpt:
      'Representing Yadadri Bhuvanagiri at the Viksit Bharat Young Leaders Dialogue 2026 state championship in Hyderabad, as an individual participant. I pitched #AatmanirbharBharat — how AI and ML can solve real-world challenges — and am now awaiting the results for the national selection in New Delhi.',
    tags: [
      '#VBYLD2026',
      '#AatmanirbharBharat',
      '#ViksitBharat2047',
      '#MyBharat',
      '#YoungLeaders',
      '#AIML',
    ],
    platform: 'LinkedIn',
    date: 'Dec 2025',
    url: POST_LINKS['From State-Level to National Aspirations — My VBYLD 2026 Journey'],
  },
  {
    title: 'My Bharat Budget Quest 2026',
    excerpt:
      'Budget insights were already on my radar from 1st February, and recently I had the opportunity to participate in two national-level quizzes by MY — a deep dive into fiscal policy, allocations and what they mean on the ground.',
    tags: ['#MyBharatBudget2026', '#LearningNeverStops', '#Budget2026'],
    platform: 'LinkedIn',
    date: '2026',
    url: POST_LINKS['My Bharat Budget Quest 2026'],
  },
  {
    title: 'Moving from Localhost to the Cloud',
    excerpt:
      'My 1:1 session with a GfG Expert. As an AI/ML student I know that building a model is only 50% of the work — the real challenge is making that model survive deployment, costs and real users.',
    tags: ['#GeeksForGeeks', '#GfGConnect', '#AWSLambda', '#CloudComputing', '#AIML'],
    platform: 'LinkedIn',
    date: '2026',
    url: POST_LINKS['Moving from Localhost to the Cloud'],
  },
  {
    title: 'Infosys Springboard — Deep Learning',
    excerpt:
      'Feeling proud of my progress, and thankful to Infosys for making this journey free and valuable. A full Deep Learning track — neural networks, training, evaluation — and a confirmed virtual internship along the way.',
    tags: ['#DeepLearning', '#InfosysSpringboard', '#NeuralNetworks', '#Internship2025'],
    platform: 'LinkedIn',
    date: '2025',
    url: POST_LINKS['Infosys Springboard — Deep Learning'],
  },
  {
    title: 'Infosys Foundation SkillUp — Centum Foundation',
    excerpt:
      'Selected for the Centum Foundation SkillUp track as an AI & ML diploma student — job-ready applied technology skills, funded end to end.',
    tags: ['#SkillUp', '#InfosysFoundation', '#CentumFoundation', '#AIML'],
    platform: 'LinkedIn',
    date: '2025',
    url: POST_URL,
  },
  {
    title: 'Turning Ideas Into Impactful Startup Plans',
    excerpt:
      'As an AI & ML diploma student at Samskruti College, Ghatkesar, my focus is on turning innovative ideas into startup plans that survive contact with real users.',
    tags: ['#PassionateCoder', '#Startup', '#AIML'],
    platform: 'LinkedIn',
    date: '2026',
    url: POST_URL,
  },
]

/** VBYLD 2026 — state championship details. */
export const myBharat = {
  theme: 'Healthcare & Wellbeing',
  role: 'Individual — solo participant',
  status: 'Awaiting national selection',
  programme: 'VBYLD 2026 — State Level Championship',
  organiser: 'Government of Telangana · Dept. of Youth Services',
  initiative: 'Viksit Bharat Young Leaders Dialogue (VBYLD) 2026',
  district: 'Yadadri Bhuvanagiri',
  link: 'https://lnkd.in/p/d5VwF7Dm',
} as const

export type GitHubRepo = {
  name: string
  description: string
  language: string
  stars: number
  forks: number
  html_url: string
  updated_at: string
  topics?: string[]
}

/** Fallback snapshot of the GitHub repos API, used if the live request fails. */
export const repoFallback: GitHubRepo[] = [
  {
    name: 'Bharat-Health-Detective-Care',
    description:
      'District healthcare operations and public-health intelligence platform with a citizen portal.',
    language: 'Python',
    stars: 0,
    forks: 0,
    html_url: 'https://github.com/chavansrikar/Bharat-Health-Detective-Care',
    updated_at: '2026-10-31',
  },
  {
    name: 'java-lab',
    description: 'Java lab experiments and programs.',
    language: 'Java',
    stars: 1,
    forks: 0,
    html_url: 'https://github.com/chavansrikar/java-lab',
    updated_at: '2026-10-06',
  },
  {
    name: 'Dr_shalini',
    description: 'Modern clinic website rebuild with embedded Sanity content studio.',
    language: 'TypeScript',
    stars: 0,
    forks: 0,
    html_url: 'https://github.com/chavansrikar/Dr_shalini',
    updated_at: '2026-09-29',
  },
  {
    name: 'Tools-For-Hackathon',
    description: 'A curated list of 35+ tools and frameworks for winning hackathons.',
    language: 'Markdown',
    stars: 4,
    forks: 0,
    html_url: 'https://github.com/chavansrikar/Tools-For-Hackathon',
    updated_at: '2026-09-24',
  },
  {
    name: 'vighnaraja',
    description: 'Gradio / Hugging Face Space configuration project.',
    language: 'Python',
    stars: 0,
    forks: 0,
    html_url: 'https://github.com/chavansrikar/vighnaraja',
    updated_at: '2026-09-07',
  },
  {
    name: 'sticker-sheet-generator',
    description: 'Utility for generating printable sticker and label sheets.',
    language: 'Python',
    stars: 0,
    forks: 0,
    html_url: 'https://github.com/chavansrikar/sticker-sheet-generator',
    updated_at: '2026-06-12',
  },
  {
    name: 'python-dsa-journey',
    description: 'Personal data structures and algorithms practice journey.',
    language: 'Python',
    stars: 0,
    forks: 0,
    html_url: 'https://github.com/chavansrikar/python-dsa-journey',
    updated_at: '2026-05-28',
  },
  {
    name: 'Automated-Wheat-Disease-Detection',
    description: 'Deep learning wheat leaf disease classification with a Gradio UI.',
    language: 'Python',
    stars: 0,
    forks: 0,
    html_url: 'https://github.com/chavansrikar/Automated-Wheat-Disease-Detection',
    updated_at: '2026-02-06',
  },
  {
    name: 'RoadSafe-Analytics-Road-Accidents-Exploratory',
    description: 'Exploratory data analysis on road accident datasets.',
    language: 'Python',
    stars: 0,
    forks: 0,
    html_url: 'https://github.com/chavansrikar/RoadSafe-Analytics-Road-Accidents-Exploratory',
    updated_at: '2026-01-20',
  },
  {
    name: 'NGPME_major_project',
    description: 'Next-Gen Prosthetic Mobility Enhancer — video-based gait analysis.',
    language: 'Python',
    stars: 0,
    forks: 0,
    html_url: 'https://github.com/chavansrikar/NGPME_major_project',
    updated_at: '2025-10-30',
  },
  {
    name: 'project-on-voice-assistant',
    description: 'Omnix — a browser voice assistant built with the Web Speech API.',
    language: 'JavaScript',
    stars: 1,
    forks: 0,
    html_url: 'https://github.com/chavansrikar/project-on-voice-assistant',
    updated_at: '2025-10-08',
  },
  {
    name: 'Nostromo-Guard-AI-Powered-DeFi-Risk-Optimizer',
    description: 'Privacy-first offline smart-contract risk auditor.',
    language: 'Python',
    stars: 0,
    forks: 0,
    html_url:
      'https://github.com/chavansrikar/Nostromo-Guard-AI-Powered-DeFi-Risk-Optimizer',
    updated_at: '2025-12-06',
  },
  {
    name: 'crowd-density-prevention',
    description: 'Crowd density & stampede prevention with YOLOv8 and Streamlit.',
    language: 'Python',
    stars: 1,
    forks: 0,
    html_url: 'https://github.com/chavansrikar/crowd-density-prevention',
    updated_at: '2025-10-06',
  },
  {
    name: 'recommendation_system-for-movies',
    description: 'Recommender system experiments for movie suggestions.',
    language: 'Python',
    stars: 1,
    forks: 0,
    html_url: 'https://github.com/chavansrikar/recommendation_system-for-movies',
    updated_at: '2025-10-06',
  },
  {
    name: 'universal-error-explainer-tool',
    description: 'Explains programming errors in plain language across six languages.',
    language: 'Python',
    stars: 2,
    forks: 0,
    html_url: 'https://github.com/chavansrikar/universal-error-explainer-tool',
    updated_at: '2025-10-08',
  },
  {
    name: 'python-fullstack-snippets',
    description: 'Reusable Python snippets from full-stack work.',
    language: 'Python',
    stars: 2,
    forks: 0,
    html_url: 'https://github.com/chavansrikar/python-fullstack-snippets',
    updated_at: '2025-10-08',
  },
]

export const navLinks = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'work', label: 'Work' },
  { id: 'journey', label: 'Journey' },
  { id: 'posts', label: 'Posts' },
  { id: 'github', label: 'GitHub' },
  { id: 'contact', label: 'Contact' },
] as const

export const marqueeItems = [
  'Python',
  'TypeScript',
  'MediaPipe',
  'TensorFlow',
  'Next.js',
  'OpenCV',
  'YOLOv8',
  'Gradio',
  'Streamlit',
  'SQLAlchemy',
  'Node.js',
  'scikit-learn',
  'Sanity',
  'Tailwind',
  'SQLite',
  'Hugging Face',
  'Docker',
  'FastAPI',
  'Plotly',
  'Pandas',
]
