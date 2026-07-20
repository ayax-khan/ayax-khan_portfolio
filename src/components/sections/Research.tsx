'use client'

import { Shield, Route, BrainCircuit, ExternalLink } from 'lucide-react'
import { ScrollReveal } from '@/components/motion/ScrollReveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { StaggerContainer, StaggerItem } from '@/components/motion/StaggerContainer'

const researchItems = [
  {
    icon: Shield,
    title: 'Effect-Based Testing and Safety Layer for AI Agents',
    description:
      'Exploring algebraic effect handlers, built on Python generators and contextvars, as a lightweight library layer for making LLM agent tool-use safer and more testable — not a new runtime. This research focuses on capability-based access control, so an agent allowed tools are structurally restricted, and on deterministic mocking of tool calls for unit testing. The goal is a thin layer that plugs into existing frameworks like LangChain, not a low-level execution engine.',
  },
  {
    icon: Route,
    title: 'Adaptive Tool Routing for LLM Agents via Contextual Bandits',
    description:
      'Investigating how contextual bandit algorithms (LinUCB, Thompson Sampling) can let AI agents learn which tool or model to call for a given query type, instead of the LLM deciding from scratch every time. This research studies regret-bound routing policies balancing accuracy, latency, and cost, aiming to reduce redundant or wrong tool calls in production agent systems.',
  },
  {
    icon: BrainCircuit,
    title: 'Statistically Calibrated Escalation for AI Agents Using Conformal Prediction',
    description:
      'Exploring conformal prediction — a distribution-free statistical method with finite-sample guarantees — as a principled way for agents to decide when to trust a tool output versus escalate to a human. Unlike verbalized model confidence, this gives formal coverage guarantees; research focuses on applying it at tool-output verification and multi-step reasoning stopping points.',
  },
]

export function Research() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-5xl px-6">
        <ScrollReveal>
          <SectionHeading
            subtitle="Research"
            title="Research"
            description="Exploring safety, routing, and calibration for LLM agent systems."
            align="center"
          />
        </ScrollReveal>

        <StaggerContainer className="mt-8 grid gap-3">
          {researchItems.map((item) => {
            const Icon = item.icon
            return (
              <StaggerItem key={item.title}>
                <div className="group flex flex-col gap-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:p-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
                      <Icon size={20} />
                    </div>
                    <h3 className="text-sm font-semibold text-[var(--fg)]">{item.title}</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-[var(--muted)]">{item.description}</p>
                </div>
              </StaggerItem>
            )
          })}
        </StaggerContainer>
      </div>
    </section>
  )
}
