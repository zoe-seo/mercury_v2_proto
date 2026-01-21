export function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">Welcome to Mercury V2</h1>
      <p className="text-lg text-muted-foreground mb-8">
        This is a production-ready React + Vite application with TypeScript, Zustand, TanStack
        Query, and Tailwind CSS.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="p-6 border rounded-lg bg-card">
          <h2 className="text-2xl font-semibold mb-3">Page A</h2>
          <p className="text-muted-foreground mb-4">
            Demonstrates TanStack Query for server state management with resource CRUD operations.
          </p>
          <a
            href="/page-a"
            className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            View Page A
          </a>
        </div>

        <div className="p-6 border rounded-lg bg-card">
          <h2 className="text-2xl font-semibold mb-3">Page B</h2>
          <p className="text-muted-foreground mb-4">
            Demonstrates Zustand for client-side state management with an editor example.
          </p>
          <a
            href="/page-b"
            className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            View Page B
          </a>
        </div>
      </div>
    </div>
  )
}
