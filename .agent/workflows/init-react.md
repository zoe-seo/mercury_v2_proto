---
description: Initialize a production-ready React project with Vite
---

# Initialize React Project with Vite

This workflow creates a minimal yet production-ready React project skeleton with Vite, TypeScript, Zustand, TanStack Query, and Tailwind CSS.

## Architectural Notes

- Page components are the primary unit of composition and contain most UI-related business logic.
- TanStack Query is used exclusively for server state (fetching, caching, invalidation).
- Zustand is used for complex client-side state such as editors, drafts, and UI state.
- API modules (`src/api`) are thin wrappers around HTTP calls and contain no business logic.
- Abstractions are introduced only when reuse is required.

## Prerequisites

- Node.js 18+ and npm
- Basic understanding of React and TypeScript

## Workflow Steps

### 1. Navigate to target directory and create Vite project

```bash
cd <target_directory>
```

// turbo
```bash
npm create vite@latest . -- --template react-ts
```

### 2. Install all dependencies

// turbo
```bash
npm install
```

// turbo
```bash
npm install react-router-dom zustand @tanstack/react-query axios class-variance-authority clsx tailwind-merge lucide-react
```

// turbo
```bash
npm install -D tailwindcss postcss autoprefixer prettier eslint-config-prettier eslint-plugin-prettier globals
```

### 3. Initialize Tailwind CSS

// turbo
```bash
npx tailwindcss init -p
```

### 4. Configure Tailwind CSS

Update `tailwind.config.js` with shadcn/ui color system and content paths.

### 5. Configure Vite for absolute imports and API proxy

Update `vite.config.ts`:
- Add path alias `@` → `./src`
- Configure dev server port (3000)
- Add API proxy to backend (`/api` → `http://localhost:8000`)

### 6. Update tsconfig.json

Add path mapping for absolute imports:
```json
"baseUrl": ".",
"paths": {
  "@/*": ["./src/*"]
}
```

### 7. Create directory structure

// turbo
```bash
mkdir -p src/pages src/components/common src/store src/api src/queries src/types src/hooks src/utils src/styles
```

### 8. Create global styles

Create `src/styles/globals.css` - Tailwind directives and shadcn/ui CSS variables for light/dark themes.

### 9. Create utility functions

Create `src/utils/cn.ts` - Class name merger using clsx and tailwind-merge.

Create `src/utils/formatDate.ts` - Date formatting utility.

### 10. Create API client

Create `src/api/axios.ts` - Axios instance with interceptors for auth tokens and error handling.

Note: Axios interceptors are intentionally minimal and serve as a starting point. Advanced authentication flows (e.g., token refresh) should be implemented as needed.

Create `src/api/resource.api.ts` - Example API service with CRUD operations.

### 11. Create TypeScript types

Create `src/types/resource.type.ts` - Type definitions for API responses.

### 12. Create TanStack Query hooks

Create `src/queries/useResourceList.ts` - Query and mutation hooks for resource operations.

### 13. Create Zustand stores

Create `src/store/ui.store.ts` - UI state (sidebar, theme).

Create `src/store/editor.store.ts` - Editor state example.

### 14. Create custom hooks

Create `src/hooks/useDebounce.ts` - Debounce hook.

### 15. Create common components

Create `src/components/common/Layout.tsx` - Main layout with header and sidebar.

Create `src/components/common/index.ts` - Component exports.

### 16. Create page components

Create `src/pages/Home.tsx` - Home page.

Create `src/pages/PageA.tsx` - Example page with TanStack Query (resource list).

Create `src/pages/PageB.tsx` - Example page with Zustand (editor).

Create `src/pages/NotFound.tsx` - 404 page.

Create `src/pages/index.ts` - Page exports.

### 17. Create page-specific components

Create `src/components/pageA/ComponentA.tsx` - Resource card component.

Create `src/components/pageA/index.ts` - Component exports.

### 18. Create App Router

Create `src/AppRouter.tsx` - React Router configuration with all routes.

### 19. Update App component

Update `src/App.tsx` - Wrap with QueryClientProvider and render AppRouter.

### 20. Update main entry point

Update `src/main.tsx` - Import global styles and render App.

### 21. Create environment file

Create `.env`:
```env
VITE_API_BASE_URL=http://localhost:8000
```

### 22. Create Prettier configuration

Create `.prettierrc` with formatting rules.

### 23. Update ESLint configuration

Update `eslint.config.js` to include Prettier plugin.

### 24. Create README

Create `README.md` with:
- Project overview and features
- Setup instructions
- Development commands
- Project structure explanation
- State management guidelines
- Common commands reference

### 25. Create .gitignore

Create `.gitignore` with Node, build, IDE, and environment file exclusions.

### 26. Format and lint

// turbo
```bash
npx prettier --write "src/**/*.{ts,tsx,css}"
```

// turbo
```bash
npm run lint
```

### 27. Start development server

```bash
npm run dev
```

Server will be available at:
- App: http://localhost:3000
- Home: http://localhost:3000/
- Page A: http://localhost:3000/page-a
- Page B: http://localhost:3000/page-b

## Next Steps

1. Customize design system colors in `src/styles/globals.css`
2. Add more pages in `src/pages/` and routes in `AppRouter.tsx`
3. Create API services in `src/api/` for your backend endpoints
4. Add TanStack Query hooks in `src/queries/` for data fetching
5. Create Zustand stores in `src/store/` for client state
6. Build reusable components in `src/components/common/`

## Key Files to Customize

- `src/styles/globals.css` - Design system colors and themes
- `vite.config.ts` - API proxy and build configuration
- `.env` - API base URL and environment variables
- `src/api/axios.ts` - API client interceptors

## Common Commands

```bash
# Development
npm run dev                    # Start dev server
npm run lint                   # Run ESLint
npm run format                 # Format with Prettier (# optional, if you add a format script)

# Production
npm run build                  # Build for production
npm run preview                # Preview production build
```