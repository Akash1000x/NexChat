# NexChat

A full-stack chat application supporting multiple AI models with conversation management, streaming responses, and user authentication.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, TanStack Router, TanStack Query, Better Auth
- **Backend**: Express.js, TypeScript, Drizzle ORM, PostgreSQL
- **AI Providers**: OpenRouter (OpenAI-compatible), Google Gemini

## Features

- AI chat interface with multiple models
- Real-time streaming responses
- Conversation management and history
- User authentication
- Share conversations
- Custom instructions/preferences
- Admin panel for model management
- Suggestion questions

## Getting Started

### Prerequisites

- Node.js
- pnpm
- PostgreSQL

### Environment Variables

**Server** (`.env` in `server/`):

```bash
# Copy the example environment variables and fill in the values
cp .env.example .env
```

**Client** (`.env` in `client/`):

```bash
# Copy the example environment variables
cp .env.example .env
```

### Installation

```bash
# Install dependencies
cd server && pnpm install
cd ../client && pnpm install
```

### Database Setup

```bash
cd server

# Start PostgreSQL (using Docker)
docker-compose up -d

# Run migrations
pnpm db:push
```

### Development

```bash
# Start server (from server/)
pnpm dev

# Start client (from client/)
pnpm dev
```

### Build

```bash
# Build server
cd server && pnpm build

# Build client
cd client && pnpm build
```
