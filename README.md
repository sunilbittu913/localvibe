# LocalVibe - Location-Based Marketing Platform

A comprehensive location-based marketing platform for India, built as an Nx monorepo with micro frontends, mobile app, and microservices architecture.

## Architecture Overview

LocalVibe follows a modern microservices architecture with the following components:

- **Micro Frontends**: React web applications with TypeScript and TailwindCSS
- **Mobile App**: React Native with Expo for iOS and Android
- **Microservices**: Node.js + Express + TypeScript backend services
- **Shared Libraries**: Common types, utilities, and UI components

## Monorepo Structure

```
localvibe/
├── apps/
│   ├── web/                    # Main React web app (micro frontend shell)
│   ├── admin/                  # Admin panel React web app (micro frontend)
│   ├── mobile/                 # React Native Expo mobile app
│   ├── user-service/           # Backend microservice for users/auth
│   ├── business-service/       # Backend microservice for businesses
│   └── gateway/                # API Gateway service
├── libs/
│   ├── shared-types/           # Shared TypeScript types/interfaces
│   ├── shared-utils/           # Shared utility functions
│   └── ui-components/          # Shared UI component library
├── nx.json                     # Nx workspace configuration
├── package.json                # Root package.json with workspaces
└── tsconfig.base.json          # Base TypeScript configuration
```

## Applications

### Frontend Applications

| App | Description | Port | Tech Stack |
|-----|-------------|------|------------|
| `web` | Main consumer-facing web app | 4200 | React + TypeScript + Vite + TailwindCSS |
| `admin` | Admin management panel | 4201 | React + TypeScript + Vite + TailwindCSS |
| `mobile` | iOS & Android mobile app | Expo | React Native + Expo + TypeScript |

### Backend Services

| Service | Description | Port | Tech Stack |
|---------|-------------|------|------------|
| `gateway` | API Gateway (routing, rate limiting) | 3000 | Express + TypeScript |
| `user-service` | User auth, registration, profiles | 3001 | Express + TypeScript + Drizzle ORM + MySQL |
| `business-service` | Business profiles, stores, listings | 3002 | Express + TypeScript + Drizzle ORM + MySQL |

### Shared Libraries

| Library | Description | Scope |
|---------|-------------|-------|
| `@localvibe/shared-types` | TypeScript interfaces and types | All apps & services |
| `@localvibe/shared-utils` | Utility functions (validation, formatting) | All apps & services |
| `@localvibe/ui-components` | React UI component library | Frontend apps |

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- MySQL 8.0+

### Installation

```bash
# Clone the repository
git clone https://github.com/sunilbittu913/localvibe.git
cd localvibe

# Install dependencies
npm install
```

### Development

```bash
# Start the main web app
npm run dev:web

# Start the admin panel
npm run dev:admin

# Start the mobile app
npm run dev:mobile

# Start backend services
npm run dev:user-service
npm run dev:business-service
npm run dev:gateway

# Start all backend services at once
npm run dev:all-services

# View the project dependency graph
npm run graph
```

### Building

```bash
# Build all projects
npm run build

# Build only affected projects
npm run affected:build
```

### Linting

```bash
# Lint all projects
npm run lint

# Lint only affected projects
npm run affected:lint
```

## Environment Configuration

Each backend service has its own `.env.example` file. Copy it to `.env` and configure:

```bash
# For user-service
cp apps/user-service/.env.example apps/user-service/.env

# For business-service
cp apps/business-service/.env.example apps/business-service/.env

# For gateway
cp apps/gateway/.env.example apps/gateway/.env
```

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast builds
- **TailwindCSS** for styling
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Axios** for HTTP client

### Mobile
- **React Native** with Expo
- **React Navigation** for routing
- **Redux Toolkit** for state management
- **React Native Maps** for location features

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **Drizzle ORM** for database queries
- **MySQL** for data storage
- **JWT** for authentication
- **Zod** for validation

### DevOps
- **Nx** for monorepo management
- **ESLint** for code quality
- **Prettier** for code formatting

## Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Primary Orange | `#FF7A00` | Primary brand color |
| Dark Gray | `#333333` | Text |
| Light Gray | `#F2F2F2` | Backgrounds |
| Accent Blue | `#007BFF` | CTAs and highlights |

## License

MIT
