# Overview

This is a professional IBM Quantum job monitoring dashboard built with React, Express, and PostgreSQL. The application provides real-time monitoring of quantum computing jobs, sessions, and backend systems with animated visualizations and comprehensive analytics. It features a modern UI with smooth animations, responsive design, and dark/light theme support.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The frontend uses a modern React stack with TypeScript and Vite for fast development and builds. The architecture follows a component-based design with:

- **Component Library**: shadcn/ui components built on Radix UI primitives for consistent, accessible UI elements
- **Styling**: TailwindCSS with CSS variables for theming and responsive design
- **Animations**: Framer Motion for smooth page transitions, component animations, and interactive feedback
- **Charts**: Recharts for data visualization with animated transitions
- **State Management**: React Query (@tanstack/react-query) for server state management, caching, and automatic refetching
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation for type-safe form handling

## Backend Architecture

The backend implements a REST API using Express.js with TypeScript:

- **API Layer**: Express routes with middleware for logging, error handling, and request processing
- **Data Layer**: In-memory storage implementation with interfaces for easy database migration
- **Schema Validation**: Zod schemas for runtime type validation and API contract enforcement
- **Development Tools**: Hot reload with Vite integration and comprehensive error handling

## Data Storage Solutions

Currently uses in-memory storage with well-defined interfaces to support future database migration:

- **Storage Interface**: Abstract storage layer supporting jobs, sessions, backends, and analytics
- **Mock Data**: Realistic test data for development and demonstration
- **Database Ready**: Drizzle ORM configuration prepared for PostgreSQL with schema definitions
- **Migration Support**: Database schema files and migration tooling configured

## Authentication and Authorization

The application is currently set up for development without authentication, but includes:

- **Session Infrastructure**: Express session configuration ready for implementation
- **Security Headers**: Basic security middleware for production deployment
- **Cookie Management**: Session cookie configuration for future auth implementation

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL configured via @neondatabase/serverless
- **Drizzle ORM**: Type-safe database operations with PostgreSQL dialect
- **Connection Pooling**: Connect-pg-simple for session storage when auth is implemented

### UI and Design Libraries
- **Radix UI**: Comprehensive set of unstyled, accessible UI primitives
- **TailwindCSS**: Utility-first CSS framework with custom design system
- **Framer Motion**: Production-ready motion library for animations
- **Lucide React**: Icon library with consistent design language

### Data Visualization
- **Recharts**: Composable charting library built on D3 with React integration
- **Chart Animations**: Smooth transitions and interactive data visualization

### Development Tools
- **Vite**: Fast build tool with HMR and optimized production builds
- **TypeScript**: Type safety across frontend and backend
- **ESBuild**: Fast JavaScript bundler for server-side builds
- **Replit Integration**: Development environment optimizations and error overlays

### Form and Validation
- **React Hook Form**: Performance-focused form library with minimal re-renders
- **Zod**: TypeScript-first schema validation for forms and API contracts
- **Date-fns**: Modern date utility library for time formatting and manipulation

The architecture prioritizes type safety, performance, and developer experience while maintaining flexibility for future enhancements like real IBM Quantum API integration and user authentication.