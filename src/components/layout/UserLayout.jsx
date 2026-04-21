import React from "react";

export default function UserLayout({
  sidebar,
  header,
  children,
  sidebarCollapsed = false,
  showHeader = true,
  headerContainerClassName = "max-w-5xl",
  contentContainerClassName = "max-w-5xl",
}) {
  const sidebarWidth = sidebarCollapsed ? "w-20" : "w-64";

  return (
    <div className="flex min-h-screen bg-[var(--color-bg-page)] font-sans text-[var(--color-text-primary)]">
      <aside
        className={`sticky top-0 z-30 h-screen shrink-0 border-r border-[var(--color-border-default)] bg-[var(--color-bg-sidebar)] transition-all duration-200 ${sidebarWidth}`}
      >
        <div className="h-full overflow-y-auto">{sidebar}</div>
      </aside>

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        {showHeader ? (
          <header className="sticky top-0 z-20 border-b border-[var(--color-border-default)] bg-[var(--color-bg-surface)]/90 backdrop-blur">
            <div className={`mx-auto w-full px-4 py-4 ${headerContainerClassName}`}>{header}</div>
          </header>
        ) : null}

        <main className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          <div className={`mx-auto w-full ${contentContainerClassName}`}>{children}</div>
        </main>
      </div>
    </div>
  );
}
