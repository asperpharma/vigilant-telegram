# Copilot Instructions for Asper Beauty Shop

## Project Overview

Asper Beauty Shop is a luxury e-commerce storefront for premium skincare and
beauty products. The platform features a responsive, bilingual (English/Arabic)
interface with full RTL support, integrated with Shopify for product management
and checkout.

**Live Site**:
[asperbeautyshop.lovable.app](https://asperbeautyshop.lovable.app)

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (built on Radix UI primitives)
- **State Management**: Zustand
- **Routing**: React Router v6
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form with Zod validation
- **E-commerce Integration**: Shopify Storefront API
- **Database**: Supabase (PostgreSQL)
- **Node Version**: 18+
- **Package Managers**: npm, yarn, or bun

## Design System

### Color Tokens

Follow these design tokens consistently:

| Token             | Color     | Usage               |
| ----------------- | --------- | ------------------- |
| `--maroon`        | `#800020` | Primary brand color |
| `--soft-ivory`    | `#F8F8FF` | Background          |
| `--shiny-gold`    | `#C5A028` | Accent color        |
| `--dark-charcoal` | `#333333` | Text color          |

### Typography

- **Display**: Playfair Display (headings)
- **Body**: Montserrat (body text)
- **RTL**: Tajawal (Arabic text)

## Coding Standards

### General Guidelines

- Use TypeScript for all new files
- Prefer functional components with React hooks
- Use named exports over default exports
- Follow existing code formatting (2-space indentation)
- Run `npm run lint` to check code quality
- Format on save is enabled in the workspace

### Component Structure

- Place all React components in `/src/components/`
- UI primitives from shadcn/ui go in `/src/components/ui/`
- Use the `cn()` utility from `/src/lib/utils` for className merging
- Implement responsive design mobile-first

### State Management

- Use Zustand for global state (see `/src/stores/`)
- Use TanStack Query for server state and API calls
- Keep component-level state minimal with `useState` and `useReducer`

### Styling

- Use Tailwind CSS utility classes
- Leverage `class-variance-authority` for component variants
- Use the `clsx` and `tailwind-merge` utilities via the `cn()` helper
- Follow the existing design system tokens

### Forms and Validation

- Use React Hook Form for form handling
- Use Zod for schema validation with `@hookform/resolvers`
- Follow patterns in existing form components

### Internationalization

- Support both English (LTR) and Arabic (RTL)
- Use appropriate fonts for each language
- Ensure UI adapts properly for RTL layout

## Project Structure

```
/home/runner/work/lovable/lovable/
├── src/
│   ├── assets/           # Images and static assets
│   ├── components/       # Reusable UI components
│   │   └── ui/          # shadcn/ui components
│   ├── contexts/        # React context providers
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions
│   ├── pages/           # Route pages
│   └── stores/          # Zustand state stores
├── public/              # Static public assets
├── supabase/            # Supabase configuration
└── scripts/             # Build and utility scripts
```

### Key Directories

- `/src/components/`: All React components (use PascalCase)
- `/src/components/ui/`: shadcn/ui primitives (auto-generated, modify with care)
- `/src/hooks/`: Custom hooks (prefix with `use`)
- `/src/lib/`: Utility functions and helpers
- `/src/pages/`: Page components for routes
- `/src/stores/`: Zustand store definitions

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Build for development
npm run build:dev

# Lint code
npm run lint

# Preview production build
npm run preview
```

## Routes and Pages

| Route                  | Description                   | File Location |
| ---------------------- | ----------------------------- | ------------- |
| `/`                    | Home page                     | `/src/pages/` |
| `/brands`              | Browse all brands             | `/src/pages/` |
| `/brands/:brand`       | Individual brand showcase     | `/src/pages/` |
| `/collections/:handle` | Product collections           | `/src/pages/` |
| `/products/:handle`    | Product detail page           | `/src/pages/` |
| `/skin-concerns`       | Shop by skin concern          | `/src/pages/` |
| `/offers`              | Special offers and promotions | `/src/pages/` |
| `/best-sellers`        | Best selling products         | `/src/pages/` |
| `/contact`             | Contact information           | `/src/pages/` |

## Best Practices

### Component Development

1. Keep components focused and single-responsibility
2. Extract reusable logic into custom hooks
3. Use TypeScript interfaces for props
4. Implement proper error boundaries where needed
5. Optimize re-renders with `useMemo` and `useCallback` when necessary

### Performance

- Lazy load routes with React Router
- Use TanStack Query for caching API responses
- Optimize images (use appropriate formats and sizes)
- Minimize bundle size

### Accessibility

- Use semantic HTML elements
- Provide proper ARIA labels
- Ensure keyboard navigation works
- Test with screen readers
- Maintain proper color contrast ratios

### Security

- Never commit secrets or API keys
- Use environment variables for sensitive data
- Validate all user inputs
- Follow secure coding practices

## Testing

- Follow existing test patterns if tests are added
- Test critical user flows
- Validate form submissions
- Test RTL/LTR layout switching

## Documentation References

- [README.md](../README.md) - Project overview and setup
- [CONTRIBUTING.md](../CONTRIBUTING.md) - Contribution guidelines
- [SECURITY.md](../SECURITY.md) - Security policies
- [Lovable Documentation](https://lovable.dev) - Platform documentation
- [shadcn/ui](https://ui.shadcn.com/) - UI component library
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework

## Common Patterns

### Adding a New Component

1. Create the component file in `/src/components/`
2. Use TypeScript with proper prop types
3. Export as a named export
4. Follow existing naming conventions
5. Use Tailwind classes for styling
6. Ensure responsive design

### Working with shadcn/ui

- Components are in `/src/components/ui/`
- Add new components via `npx shadcn@latest add [component-name]`
- Customize components after installation if needed
- Follow the component API from shadcn/ui docs

### State Updates

- Use Zustand stores for cross-component state
- Use TanStack Query for API data
- Keep local component state minimal
- Avoid prop drilling (use context or Zustand)

## Notes

- This project is built with [Lovable](https://lovable.dev) and syncs
  automatically
- Changes can be made locally, in GitHub, or through Lovable
- The project uses Vite for fast development and optimized builds
- Shopify integration handles product data and checkout
