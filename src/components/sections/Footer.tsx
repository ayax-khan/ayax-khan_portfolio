'use client'

import { Mail, ExternalLink } from 'lucide-react'
import { GithubIcon, LinkedinIcon, TwitterIcon } from '@/components/ui/brand-icons'
import Link from 'next/link'

type Props = {
  name: string
  socials: Record<string, string>
}

const socialIconMap: Record<string, typeof GithubIcon> = {
  GitHub: GithubIcon,
  LinkedIn: LinkedinIcon,
  Twitter: TwitterIcon,
  X: TwitterIcon,
}

export function Footer({ name, socials }: Props) {
  const githubUrl = socials['GitHub'] ?? 'https://github.com/DEVSSDO'

  return (
    <footer className="border-t border-[var(--border)]">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <div className="flex flex-col items-center gap-1 sm:items-start">
            <Link href="/" className="text-base font-bold text-[var(--fg)]">
              {name}
            </Link>
            <p className="text-xs text-[var(--muted-2)]">
              Vision AI Engineer
            </p>
          </div>

          <div className="flex items-center gap-1">
            {Object.entries(socials).map(([label, href]) => {
              const Icon = socialIconMap[label]
              if (!Icon) return null
              return (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted-2)] transition-all hover:bg-[var(--surface-2)] hover:text-[var(--fg)]"
                  aria-label={label}
                >
                  <Icon size={16} />
                </a>
              )
            })}
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center gap-2 border-t border-[var(--border)] pt-6 sm:flex-row sm:justify-between">
          <div className="flex flex-col items-center gap-1 sm:items-start">
            <a
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs text-[var(--muted-2)] transition-colors hover:text-[var(--fg)]"
            >
              <GithubIcon size={14} />
              {githubUrl.replace('https://', '')}
              <ExternalLink size={10} />
            </a>
            <a
              href="mailto:deskmen112@gmail.com"
              className="inline-flex items-center gap-1 text-xs text-[var(--muted-2)] transition-colors hover:text-[var(--fg)]"
            >
              <Mail size={14} />
              deskmen112@gmail.com
            </a>
          </div>
          <div />
        </div>
      </div>
    </footer>
  )
}
