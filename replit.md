# replit.md

## Overview

This is a full-stack web application built with React and Express that provides a shoe sizing assistant. The application helps users determine their proper shoe size by collecting foot measurements and providing size recommendations based on different shoe lasts (the form used in shoemaking). The app features a modern UI with step-by-step guidance, measurement tools, and detailed size recommendations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with custom design tokens for brand colors
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state management
- **Forms**: React Hook Form with Zod validation
- **Animations**: Framer Motion for smooth UI transitions

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Validation**: Zod schemas for runtime type checking
- **Storage**: Configurable storage interface with in-memory fallback

### Key Components

1. **Sizing Calculator Engine**: Core business logic that calculates shoe size recommendations based on foot measurements and shoe last specifications
2. **Measurement Guide**: Interactive component that teaches users how to properly measure their feet
3. **Progressive Form**: Multi-step form that guides users through the sizing process
4. **Size Results Display**: Comprehensive display of size recommendations with confidence ratings
5. **Database Integration**: Stores sizing calculations for analytics and future improvements

## Data Flow

1. User navigates through measurement guide to learn proper foot measurement techniques
2. User enters foot measurements (length and ball girth) and selects shoe last type
3. Client-side validation ensures measurement data is within acceptable ranges
4. Sizing calculator processes measurements against shoe last database to generate recommendations
5. Results are displayed to user with multiple fit options (snugger, best, roomier)
6. Calculation data is saved to database for analytics purposes

## External Dependencies

### Runtime Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL database connection
- **@radix-ui/***: Comprehensive UI component library
- **@tanstack/react-query**: Server state management and caching
- **drizzle-orm**: Type-safe database ORM
- **framer-motion**: Animation library for smooth transitions
- **react-hook-form**: Form handling and validation
- **zod**: Runtime type validation and schema definition

### Development Dependencies
- **drizzle-kit**: Database schema management and migrations
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production builds
- **@replit/vite-plugin-runtime-error-modal**: Development error handling

## Deployment Strategy

The application is configured for deployment on Replit with the following setup:

### Development Mode
- Frontend served by Vite dev server with HMR
- Backend runs with tsx for TypeScript execution
- Database migrations handled by Drizzle Kit
- Environment variables for database connection

### Production Build
- Frontend built with Vite and output to `dist/public`
- Backend bundled with esbuild as ESM module
- Single Node.js process serves both static files and API
- Database schema pushed using Drizzle Kit

### Database Configuration
- PostgreSQL database with Drizzle ORM
- Schema defined in `shared/schema.ts` with proper types
- Migration files generated in `./migrations` directory
- Connection via `DATABASE_URL` environment variable

The application follows a monorepo structure with shared types and schemas, making it easy to maintain consistency between frontend and backend while providing a smooth development experience.