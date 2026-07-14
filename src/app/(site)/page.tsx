import {
  Hero,
  Skills,
  ProjectsSection,
  ExperienceTimeline,
  Research,
  BlogSection,
  ContactSection,
  Footer,
} from '@/components/sections'
import { getProjectsFromGithub } from '@/lib/github/repos'
import { listPublishedPosts } from '@/lib/blog'
import { getPublicProfile, publicSocialLinks } from '@/lib/publicProfile'
import { getExperienceEntries } from '@/app/admin/profile/actions'

export const metadata = {
  title: 'Home',
  description: 'AI Engineer & Full Stack Developer building intelligent products.',
}

export default async function HomePage() {
  const [projects, posts, profile, experiences] = await Promise.all([
    getProjectsFromGithub(),
    listPublishedPosts(),
    getPublicProfile(),
    getExperienceEntries(),
  ])

  const featured = projects.filter((p) => p.featured)
  const socials = publicSocialLinks(profile)

  const socialMap: Record<string, string> = {}
  for (const s of socials) {
    socialMap[s.label] = s.href
  }

  return (
    <>
      <Hero
        name={profile.name}
        title={profile.title}
        bio={profile.bio}
        imageUrl={profile.imageUrl}
        github={socialMap['GitHub']}
        linkedin={socialMap['LinkedIn']}
      />

      <ProjectsSection projects={featured} />
      <ExperienceTimeline experiences={experiences} />
      <Skills />
      <Research />
      <BlogSection posts={posts} />
      <ContactSection />
      <Footer name={profile.name} socials={socialMap} />
    </>
  )
}
