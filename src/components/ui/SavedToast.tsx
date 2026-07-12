'use client'

import { useEffect, useRef } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useToast } from './Toast'

export function SavedToast() {
  const { show } = useToast()
  const sp = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const done = useRef(false)

  useEffect(() => {
    if (done.current) return
    const saved = sp.get('saved')
    const error = sp.get('error')

    if (saved === '1') {
      done.current = true
      show('Saved successfully!')
      const params = new URLSearchParams(sp.toString())
      params.delete('saved')
      const qs = params.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    } else if (error) {
      done.current = true
      show(decodeURIComponent(error), 'error')
      const params = new URLSearchParams(sp.toString())
      params.delete('error')
      const qs = params.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    }
  }, [sp, show, router, pathname])

  return null
}
