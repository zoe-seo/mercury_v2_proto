# Mercury V2 Frontend

Production-ready React + Vite application with TypeScript, Zustand, TanStack Query, and Tailwind CSS.

## Features

- ⚡ **Vite** - Fast build tool and dev server
- ⚛️ **React 19** - Latest React with TypeScript
- 🎨 **Tailwind CSS v4** - Utility-first CSS framework
- 🔄 **TanStack Query** - Server state management
- 🐻 **Zustand** - Client state management
- 🛣️ **React Router** - Client-side routing
- 📝 **TypeScript** - Type safety
- 🎯 **Absolute Imports** - Clean import paths with `@/` alias
- 🔧 **ESLint + Prettier** - Code quality and formatting

## Project Structure

```
src/
├── api/              # API client and service modules
├── components/       # React components
│   ├── common/      # Shared components (Layout, etc.)
│   └── pageA/       # Page-specific components
├── hooks/           # Custom React hooks
├── pages/           # Page components (Home, PageA, PageB, NotFound)
├── queries/         # TanStack Query hooks
├── store/           # Zustand stores
├── styles/          # Global styles and Tailwind config
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
├── App.tsx          # App component with providers
├── AppRouter.tsx    # React Router configuration
└── main.tsx         # Application entry point
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
# .env file is already created with:
VITE_API_BASE_URL=http://localhost:8000
```

3. Start development server:
```bash
npm run dev
```

The app will be available at http://localhost:3000

## Available Routes

- `/` - Home page
- `/page-a` - TanStack Query example (resource CRUD)
- `/page-b` - Zustand example (editor state)

## State Management Guidelines

### TanStack Query (Server State)
Use for data fetching, caching, and server state synchronization:
- API calls and data fetching
- Cache invalidation
- Optimistic updates
- Background refetching

Example: `src/queries/useResourceList.ts`

### Zustand (Client State)
Use for complex client-side state:
- UI state (sidebar, modals, theme)
- Form state and drafts
- Editor state
- User preferences

Example: `src/store/ui.store.ts`, `src/store/editor.store.ts`

## Development Commands

```bash
npm run dev      # Start dev server (port 3000)
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## API Integration

The app is configured to proxy `/api` requests to `http://localhost:8000` (backend).

Update `vite.config.ts` to change the proxy target:
```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://your-backend-url',
      changeOrigin: true,
    },
  },
}
```

## Customization

### Design System
Edit `src/styles/globals.css` to customize colors and themes.

### Add New Pages
1. Create page component in `src/pages/`
2. Add route in `src/AppRouter.tsx`
3. Create page-specific components in `src/components/[pageName]/`

### Add API Services
1. Define types in `src/types/`
2. Create API service in `src/api/`
3. Create TanStack Query hooks in `src/queries/`

## Tech Stack

- React 19.2.0
- TypeScript 5.9.3
- Vite 7.2.4
- Tailwind CSS 4.1.18
- TanStack Query 5.90.19
- Zustand 5.0.10
- React Router 7.12.0
- Axios 1.13.2
