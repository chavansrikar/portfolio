import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement>

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export const GithubIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...p} aria-hidden>
    <path
      {...base}
      d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
    />
  </svg>
)

export const LinkedinIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...p} aria-hidden>
    <path
      {...base}
      d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6ZM2 9h4v12H2zM4 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z"
    />
  </svg>
)

export const InstagramIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...p} aria-hidden>
    <rect {...base} x="2" y="2" width="20" height="20" rx="5" />
    <circle {...base} cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
  </svg>
)

export const HuggingFaceIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...p} aria-hidden>
    <path
      {...base}
      d="M9 2v5.5a1.5 1.5 0 0 1-3 0V2M15 2v5.5a1.5 1.5 0 0 0 3 0V2M6 7.5h12M6 7.5V13a6 6 0 0 0 12 0V7.5M9.5 11.5v2M14.5 11.5v2"
    />
  </svg>
)

export const MailIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...p} aria-hidden>
    <rect {...base} x="2" y="4" width="20" height="16" rx="2" />
    <path {...base} d="m2 7 10 6 10-6" />
  </svg>
)

export const LocationIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...p} aria-hidden>
    <path {...base} d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle {...base} cx="12" cy="10" r="3" />
  </svg>
)

export const ArrowUpRightIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...p} aria-hidden>
    <path {...base} d="M7 17 17 7M8 7h9v9" />
  </svg>
)

export const ArrowRightIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...p} aria-hidden>
    <path {...base} d="M5 12h14m-6-7 7 7-7 7" />
  </svg>
)

export const StarIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...p} aria-hidden>
    <path
      {...base}
      d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.5l6.1-.9Z"
    />
  </svg>
)

export const ForkIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...p} aria-hidden>
    <circle {...base} cx="6" cy="4" r="2.4" />
    <circle {...base} cx="18" cy="4" r="2.4" />
    <circle {...base} cx="12" cy="20" r="2.4" />
    <path {...base} d="M6 6.4v1.2a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V6.4M12 10.6V17" />
  </svg>
)

export const CopyIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...p} aria-hidden>
    <rect {...base} x="9" y="9" width="12" height="12" rx="2" />
    <path {...base} d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
)

export const CheckIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...p} aria-hidden>
    <path {...base} d="m5 13 4 4L19 7" />
  </svg>
)

export const SendIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...p} aria-hidden>
    <path {...base} d="M21 3 10.5 13.5M21 3l-6.8 18-3.7-7.5L3 9.8 21 3Z" />
  </svg>
)

export const MenuIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...p} aria-hidden>
    <path {...base} d="M3 6h18M3 12h18M3 18h18" />
  </svg>
)

export const CloseIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...p} aria-hidden>
    <path {...base} d="M6 6l12 12M18 6 6 18" />
  </svg>
)

export const SparklesIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...p} aria-hidden>
    <path
      {...base}
      d="M12 3v4M12 17v4M3 12h4M17 12h4M6.3 6.3 9 9M15 15l2.7 2.7M17.7 6.3 15 9M9 15l-2.7 2.7"
    />
  </svg>
)

export const TerminalIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...p} aria-hidden>
    <rect {...base} x="2" y="4" width="20" height="16" rx="2" />
    <path {...base} d="m6 9 3 3-3 3M12 15h5" />
  </svg>
)

export const CodeIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...p} aria-hidden>
    <path {...base} d="m9 18-6-6 6-6M15 6l6 6-6 6" />
  </svg>
)

export const ExternalLinkIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...p} aria-hidden>
    <path {...base} d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
  </svg>
)

export const BriefcaseIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...p} aria-hidden>
    <rect {...base} x="2" y="7" width="20" height="14" rx="2" />
    <path {...base} d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
)

export const GraduationIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...p} aria-hidden>
    <path {...base} d="m12 3 10 5-10 5L2 8l10-5ZM6 10.5V16c0 1.5 3 3 6 3s6-1.5 6-3v-5.5" />
  </svg>
)

export const AwardIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...p} aria-hidden>
    <circle {...base} cx="12" cy="9" r="6" />
    <path {...base} d="m8.5 14-1.5 7 5-3 5 3-1.5-7" />
  </svg>
)

export const CameraIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...p} aria-hidden>
    <path {...base} d="M3 8a2 2 0 0 1 2-2h2l1.5-2h7L17 6h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
    <circle {...base} cx="12" cy="13" r="3.5" />
  </svg>
)

export const BrainIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...p} aria-hidden>
    <path
      {...base}
      d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-1 5.8A3 3 0 0 0 7 18a3 3 0 0 0 5 1.4V4ZM15 4a3 3 0 0 1 3 3 3 3 0 0 1 1 5.8A3 3 0 0 1 17 18a3 3 0 0 1-5 1.4V4Z"
    />
  </svg>
)

export const LayersIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...p} aria-hidden>
    <path {...base} d="m12 3 9 5-9 5-9-5 9-5ZM3 13l9 5 9-5M3 17l9 5 9-5" />
  </svg>
)

export const SunIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...p} aria-hidden>
    <circle {...base} cx="12" cy="12" r="4" />
    <path {...base} d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
)

export const MoonIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...p} aria-hidden>
    <path {...base} d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
  </svg>
)
