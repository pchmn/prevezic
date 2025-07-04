# Kipzat

This is a modern full-stack web application template built with TypeScript and organized as a monorepo.

## Features

- 📦 [pnpm](https://pnpm.io/) for fast, disk space efficient package management  
- 🏗️ [Turborepo](https://turbo.build/) for efficient build system and task running
- 🔷 [TypeScript](https://www.typescriptlang.org/) for type safety
- 🔨 [Biome](https://biomejs.dev/) for fast consistent code formatting and linting
- 🎨 [Tailwind CSS](https://tailwindcss.com/) support with Radix UI components
- 🚀 [Release It](https://github.com/release-it/release-it) for automated releases
- 🔄 [Syncpack](https://github.com/syncpack/syncpack) for automated dependency version synchronization
- 📱 [React Router 7](https://reactrouter.com/) for the frontend application
- 🔥 [Hono](https://hono.dev/) for the backend API server
- 🗄️ [Drizzle ORM](https://orm.drizzle.team/) with PostgreSQL for database management
- 🔐 [Better Auth](https://better-auth.com/) for authentication with Google OAuth
- 🤖 [AI SDK](https://sdk.vercel.ai/) with Google Generative AI integration
- 🐳 Docker containers for both web and server applications
- 📦 Workspace structure for apps and packages
- 🛠️ VS Code configuration for optimal developer experience

## Code organization

The monorepo is organized into three main directories:

- `apps/`: Contains all the applications that can be deployed independently
  - `web/`: React Router 7 frontend application with Tailwind CSS and Radix UI
  - `server/`: Hono API server with Drizzle ORM and Better Auth
  - `compose/`: Docker Compose configuration for deployment
- `packages/`: Contains shared packages/libraries used across applications
  - `ui/`: Shared React components built with Radix UI and Tailwind CSS
  - `tsconfig/`: Shared TypeScript configurations

## Prerequisites

- [`Dokploy`](https://docs.dokploy.com/docs/core) server for deployment
- [`PostgreSQL`](https://www.postgresql.org/) database (local via Supabase or remote)
- [`Docker`](https://www.docker.com/) registry for building and storing images
- [`Google Cloud Console`](https://console.cloud.google.com/) account for OAuth configuration and AI API

## Getting Started

Once this template is cloned, follow this task list to set up a fresh project:

- [ ] 1. Reset project (set version to 0.0.0 and rename project): `pnpm reset-project <new_project_name>`
- [ ] 2. Install dependencies: `pnpm i`
- [ ] 3. Set up local database: `pnpm sup:start` (starts local Supabase)
- [ ] 4. Run database migrations: `pnpm db:migrate`
- [ ] 5. Start development servers: `pnpm dev`
- [ ] 6. Create a new project on your `Dokploy` server and replace `project-id` in workflows
- [ ] 7. Update domain configurations in `production.yml` workflow
- [ ] 8. Create these repository secrets on GitHub:
  - [ ] `DOCKER_USERNAME`: Your Docker registry username
  - [ ] `DOCKER_PASSWORD`: Your Docker registry password
  - [ ] `DOKPLOY_BASE_URL`: The base URL of your Dokploy instance
  - [ ] `DOKPLOY_TOKEN`: Authentication token for Dokploy API access
  - [ ] `PREVIEW_DATABASE_URL`: PostgreSQL connection string for preview environment
  - [ ] `PRODUCTION_DATABASE_URL`: PostgreSQL connection string for production environment
  - [ ] `PRODUCTION_BETTER_AUTH_SECRET`: Secret key for production authentication
  - [ ] `GOOGLE_CLIENT_ID`: Google OAuth client ID
  - [ ] `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
  - [ ] `GOOGLE_GENERATIVE_AI_API_KEY`: Google AI API key for AI features
- [ ] 9. Configure Google OAuth 2.0 credentials in Google Cloud Console
- [ ] 10. Set "Read and write permissions" on Workflow permissions in your GitHub repository (Settings → Actions → General → Workflow permissions)

You should be good to go with a fresh new project!

## Development

### Available Scripts

- `pnpm dev`: Start all development servers
- `pnpm dev:web`: Start only the web application
- `pnpm dev:server`: Start only the API server
- `pnpm build`: Build all applications for production
- `pnpm check`: Format and lint all code with Biome
- `pnpm check-types`: Run TypeScript type checking
- `pnpm db:push`: Push database schema changes to the database
- `pnpm db:studio`: Open Drizzle Studio for database management
- `pnpm db:generate`: Generate database migration files
- `pnpm db:migrate`: Run database migrations
- `pnpm sup:start`: Start local Supabase instance
- `pnpm sup:stop`: Stop local Supabase instance
- `pnpm sup:restart`: Restart local Supabase instance

### Database Management

The project uses Drizzle ORM with PostgreSQL. For local development, Supabase provides a local PostgreSQL instance. Database schemas are defined in `apps/server/src/db/schema/` and migrations are stored in `apps/server/src/db/migrations/`.

### Authentication

Authentication is handled by Better Auth with support for:
- Email/password authentication
- Google OAuth integration
- Session management with PostgreSQL storage

## CI/CD

### Preview Deployments

The repository includes automated preview deployment workflows:

#### Preview Creation (`preview-up.yml`)

When a PR is opened, reopened, synchronized, or marked ready for review:

1. Runs database migrations on the preview database
2. Builds Docker images for both web and server applications
3. Deploys to Dokploy with a unique preview URL
4. Comments on the PR with the preview URL

#### Preview Cleanup (`preview-down.yml`)

When a PR is closed, automatically cleans up the preview deployment.

### Production Deployment

#### Production Deployment (`production.yml`)

When a PR is merged to main:

1. Runs database migrations on the production database
2. Creates a new release with automated versioning and changelog
3. Builds and pushes Docker images with the new version
4. Deploys to Dokploy production environment

The deployment uses Docker Compose with Traefik for load balancing and automatic HTTPS certificates.
