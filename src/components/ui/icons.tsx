import { type SVGProps } from 'react'

type Props = SVGProps<SVGSVGElement>

function IconBase(props: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    />
  )
}

export function IconDashboard(props: Props) {
  return (
    <IconBase {...props}>
      <path d="M3 13h8V3H3v10z" />
      <path d="M13 21h8V11h-8v10z" />
      <path d="M13 3h8v6h-8V3z" />
      <path d="M3 21h8v-6H3v6z" />
    </IconBase>
  )
}

export function IconFolder(props: Props) {
  return (
    <IconBase {...props}>
      <path d="M3 7h6l2 2h10v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
      <path d="M3 7V5a2 2 0 0 1 2-2h5l2 2h9a2 2 0 0 1 2 2v2" />
    </IconBase>
  )
}

export function IconFileText(props: Props) {
  return (
    <IconBase {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
      <path d="M10 9H8" />
    </IconBase>
  )
}

export function IconMail(props: Props) {
  return (
    <IconBase {...props}>
      <path d="M4 4h16v16H4z" />
      <path d="m22 6-10 7L2 6" />
    </IconBase>
  )
}

export function IconSettings(props: Props) {
  return (
    <IconBase {...props}>
      <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
      <path d="M19.4 15a1.9 1.9 0 0 0 .4 2.1l.1.1a2 2 0 0 1-1.4 3.4h-.2a2 2 0 0 1-1.4-.6l-.1-.1a1.9 1.9 0 0 0-2.1-.4 1.9 1.9 0 0 0-1.1 1.8V22a2 2 0 0 1-4 0v-.2a1.9 1.9 0 0 0-1.1-1.8 1.9 1.9 0 0 0-2.1.4l-.1.1a2 2 0 0 1-1.4.6h-.2A2 2 0 0 1 2 17.7l.1-.1a1.9 1.9 0 0 0 .4-2.1 1.9 1.9 0 0 0-1.8-1.1H.5a2 2 0 0 1 0-4h.2a1.9 1.9 0 0 0 1.8-1.1 1.9 1.9 0 0 0-.4-2.1l-.1-.1A2 2 0 0 1 3.4 2h.2a2 2 0 0 1 1.4.6l.1.1a1.9 1.9 0 0 0 2.1.4 1.9 1.9 0 0 0 1.1-1.8V1.5a2 2 0 0 1 4 0v.2a1.9 1.9 0 0 0 1.1 1.8 1.9 1.9 0 0 0 2.1-.4l.1-.1a2 2 0 0 1 1.4-.6h.2A2 2 0 0 1 22 6.3l-.1.1a1.9 1.9 0 0 0-.4 2.1 1.9 1.9 0 0 0 1.8 1.1h.2a2 2 0 0 1 0 4h-.2a1.9 1.9 0 0 0-1.8 1.1z" />
    </IconBase>
  )
}

export function IconUser(props: Props) {
  return (
    <IconBase {...props}>
      <path d="M20 21a8 8 0 0 0-16 0" />
      <path d="M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
    </IconBase>
  )
}

export function IconSparkles(props: Props) {
  return (
    <IconBase {...props}>
      <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z" />
      <path d="M5 14l.8 2.4L8 17l-2.2.6L5 20l-.8-2.4L2 17l2.2-.6L5 14z" />
      <path d="M19 14l.8 2.4L22 17l-2.2.6L19 20l-.8-2.4L16 17l2.2-.6L19 14z" />
    </IconBase>
  )
}

export function IconBriefcase(props: Props) {
  return (
    <IconBase {...props}>
      <path d="M10 6V5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v1" />
      <rect x="3" y="6" width="18" height="14" rx="2" />
      <path d="M3 12h18" />
    </IconBase>
  )
}

export function IconGraduationCap(props: Props) {
  return (
    <IconBase {...props}>
      <path d="M22 10L12 5 2 10l10 5 10-5z" />
      <path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" />
    </IconBase>
  )
}

export function IconLink(props: Props) {
  return (
    <IconBase {...props}>
      <path d="M10 13a5 5 0 0 1 0-7l1-1a5 5 0 0 1 7 7l-1 1" />
      <path d="M14 11a5 5 0 0 1 0 7l-1 1a5 5 0 0 1-7-7l1-1" />
    </IconBase>
  )
}
