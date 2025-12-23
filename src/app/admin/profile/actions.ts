'use server'

import crypto from 'node:crypto'
import path from 'node:path'
import { mkdir, unlink, writeFile } from 'node:fs/promises'
import { z } from 'zod'
import { getSetting, setSetting } from '@/lib/settings'

const ProfileSchema = z.object({
  name: z.string().min(1).max(80),
  title: z.string().min(1).max(120),
  bio: z.string().max(5000).optional().default(''),
  location: z.string().max(120).optional().default(''),
  profileImageUrl: z.string().url().or(z.literal('')).optional().default(''),
})

export async function saveProfile(input: unknown) {
  const parsed = ProfileSchema.parse(input)
  await Promise.all([
    setSetting('profile.name', parsed.name),
    setSetting('profile.title', parsed.title),
    setSetting('profile.bio', parsed.bio),
    setSetting('profile.location', parsed.location),
    setSetting('profile.imageUrl', parsed.profileImageUrl),
  ])
}

const MAX_PROFILE_IMAGE_BYTES = 2 * 1024 * 1024 // 2MB
const ALLOWED_PROFILE_IMAGE_MIMES = new Set(['image/png', 'image/jpeg', 'image/webp'])

export async function uploadProfileImage(formData: FormData): Promise<{ url: string } | null> {
  if (!process.env.DATABASE_URL) throw new Error('Database not configured')

  const file = formData.get('profileImage')
  if (!(file instanceof File)) return null
  if (file.size === 0) return null
  if (file.size > MAX_PROFILE_IMAGE_BYTES) {
    throw new Error(`Profile image too large. Max size is ${MAX_PROFILE_IMAGE_BYTES} bytes.`)
  }

  const mime = (file.type || '').toLowerCase()
  const name = (file.name || '').toLowerCase()

  const ext = mime === 'image/png' || name.endsWith('.png') ? 'png' : mime === 'image/webp' || name.endsWith('.webp') ? 'webp' : 'jpg'
  const resolvedMime = mime || (ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg')

  if (!ALLOWED_PROFILE_IMAGE_MIMES.has(resolvedMime)) {
    throw new Error('Only PNG, JPG, or WEBP images are allowed.')
  }

  const dir = path.join(process.cwd(), 'public', 'uploads', 'profile')
  await mkdir(dir, { recursive: true })

  // Single active avatar file (overwrite) keeps things simple.
  const fileName = `avatar.${ext}`
  const url = `/uploads/profile/${fileName}`

  const arrayBuffer = await file.arrayBuffer()
  await writeFile(path.join(dir, fileName), Buffer.from(arrayBuffer))

  await setSetting('profile.imageUrl', url)
  return { url }
}

const MAX_RESUME_BYTES = 8 * 1024 * 1024 // 8MB

export type ResumeEntry = {
  id: string
  originalName: string
  fileName: string
  url: string
  uploadedAt: string
}

type ResumeSettings = {
  activeId: string | null
  items: ResumeEntry[]
}

const ResumeSettingsSchema: z.ZodType<ResumeSettings> = z.object({
  activeId: z.string().nullable(),
  items: z
    .array(
      z.object({
        id: z.string().min(1),
        originalName: z.string().min(1).max(200),
        fileName: z.string().min(1),
        url: z.string().min(1),
        uploadedAt: z.string().min(1),
      }),
    )
    .default([]),
})

async function getResumeSettings(): Promise<ResumeSettings> {
  const raw = await getSetting<unknown>('profile.resumes')
  const parsed = ResumeSettingsSchema.safeParse(raw ?? { activeId: null, items: [] })
  if (parsed.success) return parsed.data
  return { activeId: null, items: [] }
}

async function persistResumeSettings(next: ResumeSettings) {
  await setSetting('profile.resumes', next)
  const active = next.activeId ? next.items.find((x) => x.id === next.activeId) : null
  // Backwards compatibility: keep a single resume URL setting too.
  await setSetting('profile.resumeUrl', active?.url ?? '')
}

export async function uploadResumes(formData: FormData) {
  if (!process.env.DATABASE_URL) throw new Error('Database not configured')

  const files = formData.getAll('resumes').filter((x): x is File => x instanceof File)
  if (files.length === 0) return

  const dir = path.join(process.cwd(), 'public', 'uploads', 'resumes')
  await mkdir(dir, { recursive: true })

  const current = await getResumeSettings()
  const next: ResumeSettings = { ...current, items: [...current.items] }

  for (const file of files) {
    if (file.size === 0) continue
    if (file.size > MAX_RESUME_BYTES) {
      throw new Error(`Resume too large. Max size is ${MAX_RESUME_BYTES} bytes.`)
    }

    const mime = (file.type || '').toLowerCase()
    const name = (file.name || '').toLowerCase()

    const isPdf = mime === 'application/pdf' || name.endsWith('.pdf')
    if (!isPdf) {
      throw new Error('Only PDF resumes are allowed.')
    }

    const id = crypto.randomUUID()
    const safeOriginal = (file.name || 'resume.pdf').replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 200)
    const fileName = `${id}.pdf`
    const url = `/uploads/resumes/${fileName}`

    const arrayBuffer = await file.arrayBuffer()
    await writeFile(path.join(dir, fileName), Buffer.from(arrayBuffer))

    next.items.unshift({
      id,
      originalName: safeOriginal,
      fileName,
      url,
      uploadedAt: new Date().toISOString(),
    })

    // If nothing is active yet, make the first upload active.
    if (!next.activeId) next.activeId = id
  }

  await persistResumeSettings(next)
}

export async function setActiveResume(id: string) {
  const current = await getResumeSettings()
  if (!current.items.some((x) => x.id === id)) return
  await persistResumeSettings({ ...current, activeId: id })
}

export async function deleteResume(id: string) {
  const current = await getResumeSettings()
  const entry = current.items.find((x) => x.id === id)
  if (!entry) return

  const dir = path.join(process.cwd(), 'public', 'uploads', 'resumes')
  try {
    await unlink(path.join(dir, entry.fileName))
  } catch {
    // ignore missing file
  }

  const items = current.items.filter((x) => x.id !== id)
  const activeId = current.activeId === id ? (items[0]?.id ?? null) : current.activeId
  await persistResumeSettings({ activeId, items })
}

// ----------------------------
// Education entries
// ----------------------------

export type EducationEntry = {
  id: string
  institute: string
  program: string // e.g. Matric / Intermediate / BS CS
  major: string
  percentage: number | null // 0-100
  grade: string // optional free-text (e.g. "A+" or "3.7/4.0")
  startYear: number | null
  endYear: number | null
  city: string
  notes: string
}

const EducationEntrySchema: z.ZodType<EducationEntry> = z.object({
  id: z.string().min(1),
  institute: z.string().min(1).max(160),
  program: z.string().min(1).max(160),
  major: z.string().max(160).optional().default(''),
  percentage: z
    .number()
    .min(0)
    .max(100)
    .nullable()
    .optional()
    .default(null),
  grade: z.string().max(60).optional().default(''),
  startYear: z.number().int().min(1900).max(2200).nullable().optional().default(null),
  endYear: z.number().int().min(1900).max(2200).nullable().optional().default(null),
  city: z.string().max(120).optional().default(''),
  notes: z.string().max(1000).optional().default(''),
})

const EducationListSchema = z.array(EducationEntrySchema).max(200)

function parseNullableNumber(v: FormDataEntryValue | null): number | null {
  if (v == null) return null
  const raw = String(v).trim()
  if (!raw) return null
  const n = Number(raw)
  return Number.isFinite(n) ? n : null
}

function parseNullableInt(v: FormDataEntryValue | null): number | null {
  const n = parseNullableNumber(v)
  if (n == null) return null
  const i = Math.trunc(n)
  return Number.isFinite(i) ? i : null
}

async function readEducationFromLegacyJson(): Promise<EducationEntry[] | null> {
  const legacy = await getSetting<string>('profile.educationJson')
  if (!legacy) return null
  try {
    const parsed = JSON.parse(legacy) as unknown
    if (!Array.isArray(parsed)) return null

    const entries: EducationEntry[] = parsed.map((x) => {
      const obj = (x ?? {}) as Record<string, unknown>
      // supports old keys: school/degree/start/end
      const institute = String(obj.institute ?? obj.school ?? '').trim()
      const program = String(obj.program ?? obj.degree ?? '').trim()
      const major = String(obj.major ?? '').trim()
      const startYear = parseNullableInt(obj.start ? String(obj.start) : obj.startYear ? String(obj.startYear) : null)
      const endYear = parseNullableInt(obj.end ? String(obj.end) : obj.endYear ? String(obj.endYear) : null)

      return {
        id: crypto.randomUUID(),
        institute: institute || 'Institute',
        program: program || 'Program',
        major,
        percentage: null,
        grade: '',
        startYear,
        endYear,
        city: '',
        notes: '',
      }
    })

    return EducationListSchema.safeParse(entries).success ? entries : null
  } catch {
    return null
  }
}

export async function getEducationEntries(): Promise<EducationEntry[]> {
  const raw = await getSetting<unknown>('profile.education')
  const parsed = EducationListSchema.safeParse(raw)
  if (parsed.success) return parsed.data

  const legacy = await readEducationFromLegacyJson()
  if (legacy) {
    // One-time migration: write structured format.
    await setSetting('profile.education', legacy)
    return legacy
  }

  return []
}

export async function addEducationEntry(formData: FormData) {
  const current = await getEducationEntries()

  const nextEntry: EducationEntry = EducationEntrySchema.parse({
    id: crypto.randomUUID(),
    institute: String(formData.get('institute') ?? '').trim(),
    program: String(formData.get('program') ?? '').trim(),
    major: String(formData.get('major') ?? '').trim(),
    percentage: parseNullableNumber(formData.get('percentage')),
    grade: String(formData.get('grade') ?? '').trim(),
    startYear: parseNullableInt(formData.get('startYear')),
    endYear: parseNullableInt(formData.get('endYear')),
    city: String(formData.get('city') ?? '').trim(),
    notes: String(formData.get('notes') ?? '').trim(),
  })

  const next = EducationListSchema.parse([nextEntry, ...current])
  await setSetting('profile.education', next)
}

export async function updateEducationEntry(id: string, formData: FormData) {
  const current = await getEducationEntries()
  const existing = current.find((e) => e.id === id)
  if (!existing) return

  const updated: EducationEntry = EducationEntrySchema.parse({
    ...existing,
    institute: String(formData.get('institute') ?? '').trim(),
    program: String(formData.get('program') ?? '').trim(),
    major: String(formData.get('major') ?? '').trim(),
    percentage: parseNullableNumber(formData.get('percentage')),
    grade: String(formData.get('grade') ?? '').trim(),
    startYear: parseNullableInt(formData.get('startYear')),
    endYear: parseNullableInt(formData.get('endYear')),
    city: String(formData.get('city') ?? '').trim(),
    notes: String(formData.get('notes') ?? '').trim(),
  })

  const next = EducationListSchema.parse(current.map((e) => (e.id === id ? updated : e)))
  await setSetting('profile.education', next)
}

export async function deleteEducationEntry(id: string) {
  const current = await getEducationEntries()
  const next = current.filter((e) => e.id !== id)
  await setSetting('profile.education', EducationListSchema.parse(next))
}

// ----------------------------
// Experience entries
// ----------------------------

export type ExperienceEntry = {
  id: string
  company: string
  role: string
  location: string
  start: string
  end: string
  highlights: string[]
  notes: string
}

const ExperienceEntrySchema: z.ZodType<ExperienceEntry> = z.object({
  id: z.string().min(1),
  company: z.string().min(1).max(160),
  role: z.string().min(1).max(160),
  location: z.string().max(160).optional().default(''),
  start: z.string().max(40).optional().default(''),
  end: z.string().max(40).optional().default(''),
  highlights: z.array(z.string().min(1).max(300)).max(50).optional().default([]),
  notes: z.string().max(1500).optional().default(''),
})

const ExperienceListSchema = z.array(ExperienceEntrySchema).max(200)

function parseHighlights(v: FormDataEntryValue | null): string[] {
  const raw = String(v ?? '')
  return raw
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean)
}

async function readExperienceFromLegacyJson(): Promise<ExperienceEntry[] | null> {
  const legacy = await getSetting<string>('profile.experienceJson')
  if (!legacy) return null

  try {
    const parsed = JSON.parse(legacy) as unknown
    if (!Array.isArray(parsed)) return null

    const entries: ExperienceEntry[] = parsed.map((x) => {
      const obj = (x ?? {}) as Record<string, unknown>
      const company = String(obj.company ?? '').trim()
      const role = String(obj.role ?? '').trim()
      const start = String(obj.start ?? '').trim()
      const end = String(obj.end ?? '').trim()
      const highlightsRaw = obj.highlights

      const highlights = Array.isArray(highlightsRaw)
        ? highlightsRaw.map((h) => String(h).trim()).filter(Boolean)
        : []

      return {
        id: crypto.randomUUID(),
        company: company || 'Company',
        role: role || 'Role',
        location: String(obj.location ?? '').trim(),
        start,
        end,
        highlights,
        notes: String(obj.notes ?? '').trim(),
      }
    })

    return ExperienceListSchema.safeParse(entries).success ? entries : null
  } catch {
    return null
  }
}

export async function getExperienceEntries(): Promise<ExperienceEntry[]> {
  const raw = await getSetting<unknown>('profile.experience')
  const parsed = ExperienceListSchema.safeParse(raw)
  if (parsed.success) return parsed.data

  const legacy = await readExperienceFromLegacyJson()
  if (legacy) {
    await setSetting('profile.experience', legacy)
    return legacy
  }

  return []
}

export async function addExperienceEntry(formData: FormData) {
  const current = await getExperienceEntries()

  const nextEntry: ExperienceEntry = ExperienceEntrySchema.parse({
    id: crypto.randomUUID(),
    company: String(formData.get('company') ?? '').trim(),
    role: String(formData.get('role') ?? '').trim(),
    location: String(formData.get('location') ?? '').trim(),
    start: String(formData.get('start') ?? '').trim(),
    end: String(formData.get('end') ?? '').trim(),
    highlights: parseHighlights(formData.get('highlights')),
    notes: String(formData.get('notes') ?? '').trim(),
  })

  const next = ExperienceListSchema.parse([nextEntry, ...current])
  await setSetting('profile.experience', next)
}

export async function updateExperienceEntry(id: string, formData: FormData) {
  const current = await getExperienceEntries()
  const existing = current.find((e) => e.id === id)
  if (!existing) return

  const updated: ExperienceEntry = ExperienceEntrySchema.parse({
    ...existing,
    company: String(formData.get('company') ?? '').trim(),
    role: String(formData.get('role') ?? '').trim(),
    location: String(formData.get('location') ?? '').trim(),
    start: String(formData.get('start') ?? '').trim(),
    end: String(formData.get('end') ?? '').trim(),
    highlights: parseHighlights(formData.get('highlights')),
    notes: String(formData.get('notes') ?? '').trim(),
  })

  const next = ExperienceListSchema.parse(current.map((e) => (e.id === id ? updated : e)))
  await setSetting('profile.experience', next)
}

export async function deleteExperienceEntry(id: string) {
  const current = await getExperienceEntries()
  const next = current.filter((e) => e.id !== id)
  await setSetting('profile.experience', ExperienceListSchema.parse(next))
}
