import { useRef, useEffect, type ReactNode } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface HighlightTextProps {
  children: ReactNode
  className?: string
  parallaxSpeed?: number
}

export function HighlightText({ children, className = "", parallaxSpeed = 0.3 }: HighlightTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null)
  const highlightRef = useRef<HTMLSpanElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!containerRef.current || !highlightRef.current || !textRef.current) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "top -20%",
          toggleActions: "play reverse play reverse",
        },
      })

      // Animate highlight in from scaleX 0 to 1
      tl.fromTo(
        highlightRef.current,
        {
          scaleX: 0,
          transformOrigin: "left center",
        },
        {
          scaleX: 1,
          duration: 1.2,
          ease: "power3.out",
        },
      )

      // Text color change from white to black
      tl.fromTo(
        textRef.current,
        {
          color: "rgb(250, 250, 250)",
        },
        {
          color: "#09090b",
          duration: 0.6,
          ease: "power2.out",
        },
        0.5,
      )

      // Parallax effect
      gsap.to(highlightRef.current, {
        yPercent: -20 * parallaxSpeed,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      })
    }, containerRef)

    return () => ctx.revert()
  }, [parallaxSpeed])

  return (
    <span ref={containerRef} className={`relative inline-block ${className}`}>
      <span
        ref={highlightRef}
        className="absolute bg-noir-yellow"
        style={{
          left: "-0.1em",
          right: "-0.1em",
          top: "0.1em",
          bottom: "0.05em",
          transform: "scaleX(0)",
          transformOrigin: "left center",
        }}
      />
      <span ref={textRef} className="relative z-10">
        {children}
      </span>
    </span>
  )
}
