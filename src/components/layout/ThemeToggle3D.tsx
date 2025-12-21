'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

export type ThemeName = 'light' | 'navy'

function normalizeTheme(input: unknown): ThemeName | null {
  return input === 'light' || input === 'navy' ? input : null
}

function applyTheme(theme: ThemeName) {
  document.documentElement.dataset.theme = theme
  try {
    localStorage.setItem('theme', theme)
  } catch {
    // ignore
  }
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false
}

type ToggleSceneApi = {
  setTheme: (t: ThemeName) => void
}

const canvasApi = new WeakMap<HTMLCanvasElement, ToggleSceneApi>()

export function ThemeToggle3D({ className }: { className?: string }) {
  // Hydration-safe: stable initial render.
  const [mounted, setMounted] = useState(false)
  const [theme, setTheme] = useState<ThemeName>('light')

  const containerRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const rafRef = useRef<number | null>(null)
  const reducedMotion = useMemo(() => prefersReducedMotion(), [])

  useEffect(() => {
    const existing = normalizeTheme(document.documentElement.dataset.theme)

    let stored: ThemeName | null = null
    try {
      stored = normalizeTheme(localStorage.getItem('theme'))
    } catch {
      // ignore
    }

    const resolved = stored ?? existing ?? 'light'
    document.documentElement.dataset.theme = resolved

    Promise.resolve().then(() => {
      setTheme(resolved)
      setMounted(true)
    })
  }, [])

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return

    const container = containerRef.current
    const canvas = canvasRef.current

    const scene = new THREE.Scene()

    // Camera
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50)
    camera.position.set(0, 1.6, 4.0)

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.85)
    scene.add(ambient)
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.0)
    keyLight.position.set(3, 4, 2)
    scene.add(keyLight)

    // Water
    const waterGeom = new THREE.PlaneGeometry(4.8, 2.2, 60, 28)
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x2563eb,
      roughness: 0.25,
      metalness: 0.05,
      transparent: true,
      opacity: 0.95,
    })
    const water = new THREE.Mesh(waterGeom, waterMat)
    water.rotation.x = -Math.PI / 2.25
    water.position.y = 0
    scene.add(water)

    // Sky (simple gradient plane behind)
    const skyGeom = new THREE.PlaneGeometry(6, 3.5)
    const skyMat = new THREE.MeshBasicMaterial({ color: 0xbfe7ff })
    const sky = new THREE.Mesh(skyGeom, skyMat)
    sky.position.set(0, 1.2, -2.0)
    scene.add(sky)

    // Procedural ship
    const ship = new THREE.Group()

    const hullMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.45, metalness: 0.1 })
    const deckMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.6 })
    const mastMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5 })
    const sailMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8, side: THREE.DoubleSide })

    const hull = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.18, 0.35), hullMat)
    hull.position.y = 0.18
    ship.add(hull)

    const deck = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.08, 0.28), deckMat)
    deck.position.set(-0.05, 0.28, 0)
    ship.add(deck)

    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.8, 10), mastMat)
    mast.position.set(0.1, 0.7, 0)
    ship.add(mast)

    const sail = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.45, 1, 1), sailMat)
    sail.position.set(0.35, 0.75, 0)
    sail.rotation.y = Math.PI / 2
    ship.add(sail)

    ship.position.set(-1.35, 0.02, 0.25)
    ship.rotation.y = 0.12
    scene.add(ship)

    // Ripple ring
    const rippleMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.0,
      side: THREE.DoubleSide,
    })
    const ripple = new THREE.Mesh(new THREE.RingGeometry(0.06, 0.11, 32), rippleMat)
    ripple.rotation.x = -Math.PI / 2
    ripple.position.set(ship.position.x, 0.01, ship.position.z)
    scene.add(ripple)

    // Resize handling
    const resize = () => {
      const rect = container.getBoundingClientRect()
      const w = Math.max(1, Math.floor(rect.width))
      const h = Math.max(1, Math.floor(rect.height))
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }

    const ro = new ResizeObserver(resize)
    ro.observe(container)
    resize()

    // Animation state
    let last = performance.now()
    const posAttr = waterGeom.attributes.position as THREE.BufferAttribute
    const basePositions = (posAttr.array as Float32Array).slice()

    let targetX = ship.position.x
    let splashT = 0

    const setPalette = (t: ThemeName) => {
      if (t === 'navy') {
        skyMat.color.setHex(0x08122a)
        waterMat.color.setHex(0x0b3a74)
        hullMat.color.setHex(0xe7eefc)
        deckMat.color.setHex(0xcbd5e1)
        mastMat.color.setHex(0xe2e8f0)
        sailMat.color.setHex(0xc7d2fe)
        ambient.intensity = 0.7
      } else {
        skyMat.color.setHex(0xbfe7ff)
        waterMat.color.setHex(0x2563eb)
        hullMat.color.setHex(0x0f172a)
        deckMat.color.setHex(0x111827)
        mastMat.color.setHex(0xf8fafc)
        sailMat.color.setHex(0xffffff)
        ambient.intensity = 0.85
      }
    }

    setPalette(theme)

    const animate = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now

      // Ship tween
      ship.position.x = THREE.MathUtils.damp(ship.position.x, targetX, 10, dt)
      ship.rotation.z = THREE.MathUtils.damp(ship.rotation.z, (targetX - ship.position.x) * 0.18, 10, dt)

      // Water waves (CPU displacement)
      if (!reducedMotion) {
        const arr = posAttr.array as Float32Array
        for (let i = 0; i < arr.length; i += 3) {
          const x = basePositions[i + 0]
          const y = basePositions[i + 1]
          const wave = Math.sin(x * 2.2 + now * 0.0018) * 0.035 + Math.cos(y * 2.0 + now * 0.0012) * 0.02
          arr[i + 2] = basePositions[i + 2] + wave
        }
        posAttr.needsUpdate = true
        waterGeom.computeVertexNormals()
      }

      // ship bob
      ship.position.y = 0.02 + Math.sin(now * 0.004) * 0.025

      // ripple
      if (splashT > 0) {
        splashT = Math.max(0, splashT - dt)
        const p = 1 - splashT
        rippleMat.opacity = 0.55 * (1 - p)
        ripple.scale.setScalar(1 + p * 5)
        ripple.position.x = ship.position.x
      } else {
        rippleMat.opacity = 0
      }

      renderer.render(scene, camera)
      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)

    const api: ToggleSceneApi = {
      setTheme: (next) => {
        setPalette(next)
        targetX = next === 'navy' ? 1.35 : -1.35
        splashT = 0.55
        ripple.scale.setScalar(1)
        ripple.position.x = ship.position.x
      },
    }

    canvasApi.set(canvas, api)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      ro.disconnect()
      canvasApi.delete(canvas)

      waterGeom.dispose()
      waterMat.dispose()
      skyGeom.dispose()
      skyMat.dispose()
      hull.geometry.dispose()
      hullMat.dispose()
      deck.geometry.dispose()
      deckMat.dispose()
      mast.geometry.dispose()
      mastMat.dispose()
      sail.geometry.dispose()
      sailMat.dispose()
      ripple.geometry.dispose()
      rippleMat.dispose()
      renderer.dispose()
    }
    // We intentionally run this once. Theme changes are handled via api.setTheme.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion])

  useEffect(() => {
    if (!mounted) return
    const canvas = canvasRef.current
    if (!canvas) return
    const api = canvasApi.get(canvas)
    api?.setTheme(theme)
  }, [mounted, theme])

  const isNavy = mounted && theme === 'navy'

  return (
    <button
      type="button"
      onClick={() => {
        const next: ThemeName = theme === 'navy' ? 'light' : 'navy'
        setTheme(next)
        applyTheme(next)
      }}
      className={`relative inline-flex h-10 w-[120px] items-center justify-center overflow-hidden rounded-full border border-[color:var(--border)] bg-[color:var(--surface-2)] shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--selection)] ${
        className ?? ''
      }`}
      role="switch"
      aria-checked={mounted ? isNavy : false}
      aria-label="Toggle theme"
      title={mounted ? (isNavy ? 'Navy theme' : 'Light theme') : 'Theme'}
      suppressHydrationWarning
    >
      <div ref={containerRef} className="absolute inset-0">
        <canvas ref={canvasRef} className="h-full w-full" />
      </div>
      <span className="relative z-10 flex w-full items-center justify-between px-3 text-[11px] font-semibold text-[color:var(--fg)] mix-blend-difference select-none">
        <span>L</span>
        <span>N</span>
      </span>
    </button>
  )
}
