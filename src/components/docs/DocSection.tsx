interface DocSectionProps {
  id: string
  title: string
  children: React.ReactNode
}

export function DocSection({ id, title, children }: DocSectionProps) {
  return (
    <section id={id} className="mb-12 scroll-mt-24">
      <h2 className="text-2xl md:text-3xl font-black mb-6 text-white font-mono uppercase">
        {title}
      </h2>
      <div className="text-[#A1A1AA]">
        {children}
      </div>
    </section>
  )
}
