import { useRef, useState, useEffect } from "react"
import gsap from "gsap"

export function CursorFollower() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!cursorRef.current) return

    const cursor = cursorRef.current

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true)
      
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.5,
        ease: "power3.out",
      })
    }

    const handleMouseLeave = () => setIsVisible(false)

    // Use window instead of document for better Firefox support
    window.addEventListener("mousemove", handleMouseMove)
    document.body.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      document.body.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [isVisible])

  return (
    <div
      ref={cursorRef}
      className={`
        pointer-events-none fixed top-0 left-0 z-[9999]
        -translate-x-1/2 -translate-y-1/2
        w-12 h-12 rounded-full
        bg-yellow-400 border-2 border-yellow-400
        transition-opacity duration-300
        ${isVisible ? "opacity-100" : "opacity-0"}
      `}
      style={{ mixBlendMode: "difference" }}
    />
  )
}
