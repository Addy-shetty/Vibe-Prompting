import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

const navItems = [
  { id: "hero", label: "Vibe" },
  { id: "updates", label: "What's New" },
  { id: "demo", label: "Experiments" },
  { id: "features", label: "Principles" },
  { id: "cta", label: "Initialize" },
]

export function SideNav() {
  const [activeSection, setActiveSection] = useState("hero")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.3 },
    )

    navItems.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <nav className="fixed left-0 top-0 z-40 h-screen w-16 md:w-20 hidden md:flex flex-col justify-center">
      <div className="flex flex-col gap-6 px-4">
        {navItems.map(({ id, label }) => (
          <button 
            key={id} 
            onClick={() => scrollToSection(id)} 
            className="group relative flex items-center gap-3"
          >
            <span
              className={cn(
                "h-2 w-2 rounded-full transition-all duration-300",
                activeSection === id 
                  ? "bg-noir-yellow scale-150 shadow-[0_0_12px_4px_rgba(250,204,21,0.7)]" 
                  : "bg-neutral-600 group-hover:bg-neutral-400",
              )}
            />
            <span
              className={cn(
                "absolute left-6 px-2 py-1 font-mono text-[10px] uppercase tracking-widest opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:left-8 whitespace-nowrap rounded",
                activeSection === id 
                  ? "text-noir-yellow bg-noir-yellow/10 backdrop-blur-sm" 
                  : "text-neutral-400 bg-black/50 backdrop-blur-sm",
              )}
            >
              {label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  )
}
