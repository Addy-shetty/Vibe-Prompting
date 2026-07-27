import { useRef, useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const updates = [
  {
    date: "2026.01.08",
    title: "Expert Persona Injection",
    label: "EXPERT MODE",
    note: "Auto-injects 'Staff Engineer' constraints. The Architect Agent now refines prompts against strict Clean Code and SOLID principles before execution.",
  },
  {
    date: "2026.01.07",
    title: "Token Arbitrage Engine",
    label: "ROI CALCULATOR",
    note: "Predictive modeling for feature costs. The system now estimates 'Development Tokens' vs. 'Business Value' to flag low-ROI tasks before you build.",
  },
  {
    date: "2026.01.05",
    title: "Vibe Shield / OWASP",
    label: "SECURITY AUDIT",
    note: "Integrated 'Pitt' scanner modules. All prompts are now pre-scanned for injection vulnerabilities and data leakage risks prior to deployment.",
  },
  {
    date: "2025.12.29",
    title: "Deep RAG Ingestion",
    label: "CONTEXT WINDOW",
    note: "Expanded vector memory. You can now upload 50MB+ PDFs (PRDs, Compliance Docs) which the Architect references during sprint planning.",
  },
  {
    date: "2025.12.20",
    title: "X-Ray Vision",
    label: "VISUALIZATION",
    note: "Hold 'Alt' on the Kanban board to reveal the raw execution prompts and system instructions behind every task card.",
  },
  {
    date: "2025.12.15",
    title: "Rust Bridge v2.0",
    label: "INFRASTRUCTURE",
    note: "Replaced Node.js middleware with Actix-web. Prompt-to-Plan compilation latency reduced by 400ms for complex architectural queries.",
  },
]

export function SignalsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current || !headerRef.current || !cardsRef.current) return

    const ctx = gsap.context(() => {
      // Header slide in from left
      gsap.fromTo(
        headerRef.current,
        { x: -60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      )

      const cards = cardsRef.current?.querySelectorAll("article")
      if (cards) {
        gsap.fromTo(
          cards,
          { x: -100, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          },
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="updates" ref={sectionRef} className="relative py-32 pl-6 md:pl-28">
      {/* Section header */}
      <div ref={headerRef} className="mb-16 pr-6 md:pr-12">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-noir-yellow">01 / Updates</span>
        <h2 className="mt-4 font-display text-5xl md:text-7xl tracking-tight text-white">WHAT'S NEW</h2>
      </div>

      {/* Horizontal scroll container */}
      <div
        ref={cardsRef}
        className="flex gap-8 overflow-x-auto pb-8 pr-12 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {updates.map((update, index) => (
          <SignalCard key={index} update={update} index={index} />
        ))}
      </div>
    </section>
  )
}

function SignalCard({
  update,
  index,
}: {
  update: { date: string; title: string; label: string; note: string }
  index: number
}) {
  return (
    <article
      className="group relative flex-shrink-0 w-80 transition-transform duration-500 ease-out hover:-translate-y-2"
    >
      {/* Card */}
      <div className="relative bg-neutral-900/50 border border-neutral-800 p-8 backdrop-blur-sm hover:border-noir-yellow/50 transition-all duration-300">
        {/* Top edge glow on hover */}
        <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-noir-yellow/0 to-transparent group-hover:via-noir-yellow/60 transition-all duration-500" />

        {/* Issue number + label - editorial style */}
        <div className="flex items-baseline justify-between mb-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-noir-yellow">
            No. {String(index + 1).padStart(2, "0")} — {update.label}
          </span>
        </div>
        
        {/* Date */}
        <time className="font-mono text-[10px] text-neutral-600 block mb-6">{update.date}</time>

        {/* Title */}
        <h3 className="font-display text-3xl tracking-tight mb-4 text-white group-hover:text-noir-yellow transition-colors duration-300">
          {update.title}
        </h3>

        {/* Divider line */}
        <div className="w-12 h-px bg-noir-yellow/60 mb-6 group-hover:w-full transition-all duration-500" />

        {/* Description */}
        <p className="font-mono text-xs text-neutral-400 leading-relaxed">{update.note}</p>

        {/* Bottom right corner accent */}
        <div className="absolute bottom-2 right-2 w-2 h-2 border-r border-b border-noir-yellow/30 group-hover:border-noir-yellow/60 transition-colors duration-300" />
      </div>

      {/* Shadow layer on hover */}
      <div className="absolute inset-0 -z-10 translate-x-1 translate-y-1 bg-noir-yellow/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </article>
  )
}
