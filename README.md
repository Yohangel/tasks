# taskmanager Monorepo

A unified monorepo for the taskmanager task management application, containing both backend (NestJS) and frontend (Next.js) applications.

## Structure

```
├── apps/
│   ├── backend/          # NestJS API application
│   └── frontend/         # Next.js web application
├── packages/             # Shared packages (future)
├── .prettierrc           # Shared Prettier configuration
├── eslint.config.js      # Shared ESLint configuration
├── tsconfig.json         # Shared TypeScript configuration
├── turbo.json           # Turbo build system configuration
└── package.json         # Root workspace configuration
```

## Getting Started

### Prerequisites

- Node.js >= 18.19.0
- npm >= 8.0.0

### Installation

```bash
npm install
```

### Development

Start all applications in development mode:

```bash
npm run dev
```

### Building

Build all applications:

```bash
npm run build
```

### Testing

Run tests across all applications:

```bash
npm run test
```

### Linting

Lint all applications:

```bash
npm run lint
```

Fix linting issues:

```bash
npm run lint:fix
```

### Formatting

Check code formatting:

```bash
npm run format:check
```

Format all code:

```bash
npm run format
```

## Workspace Commands

The monorepo uses npm workspaces and Turbo for efficient task execution:

- `turbo run <task>` - Run a task across all packages
- `turbo run <task> --filter=<package>` - Run a task for a specific package
- `npm run <script> -w <workspace>` - Run a script in a specific workspace

## Applications

### Backend (apps/backend)

NestJS API application with PostgreSQL database.

### Frontend (apps/frontend)

Next.js web application with React and TypeScript.