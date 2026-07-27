interface DocsLayoutProps {
  sections: { id: string; title: string }[]
  children: React.ReactNode
}

export function DocsLayout({ sections, children }: DocsLayoutProps) {
  const handleSectionClick = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="flex gap-8">
      {/* Left Sidebar */}
      <aside className="w-56 sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto">
        <nav className="space-y-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => handleSectionClick(section.id)}
              className="w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-[#0A0A0A] text-[#A1A1AA] hover:text-white"
            >
              {section.title}
            </button>
          ))}
        </nav>
      </aside>

      {/* Right Content Area */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
