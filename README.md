# FereeLab AI Chatbot

A full-stack Next.js chatbot application using the Vercel AI SDK, PostgreSQL, Redis, and OpenRouter API.

## Features

- **Modern Chat Interface**: Clean, responsive UI with real-time messaging
- **AI Integration**: Powered by OpenRouter API with support for various LLM models
- **Database Storage**: Messages stored in PostgreSQL with Redis caching
- **Modular Architecture**: TypeScript-based with clean separation of concerns
- **Authentication Ready**: Login/signup pages prepared for future implementation

## Tech Stack

- **Frontend**: Next.js 15 with App Router, React 19, TypeScript
- **Styling**: Tailwind CSS with responsive design
- **AI/LLM**: Vercel AI SDK with OpenRouter API
- **Database**: PostgreSQL with pg library
- **Caching**: Redis for performance optimization
- **Icons**: Lucide React for consistent iconography

## Screenshots

### Main Chat Interface
![Main Chat Interface](https://github.com/user-attachments/assets/e9734832-f77c-4766-9658-9de9e5b2bc3d)

### Login Page
![Login Page](https://github.com/user-attachments/assets/5070a842-058f-4fed-8864-126e46c5bfd1)

### Signup Page
![Signup Page](https://github.com/user-attachments/assets/bf623a78-c4bb-43a5-856a-e084515d68a6)

### Chat with Message
![Chat with Message](https://github.com/user-attachments/assets/2567e119-f097-4ea8-8812-64b312bbf375)

## Project Structure

```
src/
├── app/
│   ├── api/chat/route.ts      # Chat API endpoint with OpenRouter integration
│   ├── login/page.tsx         # Login page with form validation
│   ├── signup/page.tsx        # Signup page with form validation
│   ├── layout.tsx             # Root layout with sidebar integration
│   └── page.tsx               # Main chat interface with useChat hook
├── components/
│   └── sidebar.tsx            # Sidebar with chat history and user profile
└── lib/
    └── db.ts                  # Database utilities for PostgreSQL and Redis
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Copy the `.env.local` file and configure your environment variables:

```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fereelab_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# Redis Configuration
REDIS_URL=redis://localhost:6379

# OpenRouter API Configuration
OPENROUTER_API_KEY=your_openrouter_api_key_here

# Next.js Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
```

### 3. Database Setup

1. Create a PostgreSQL database
2. Run the schema setup:

```bash
psql -h localhost -U postgres -d fereelab_db -f schema.sql
```

### 4. Redis Setup

Ensure Redis is running locally:

```bash
redis-server
```

### 5. OpenRouter API Key

1. Sign up at [OpenRouter](https://openrouter.ai/)
2. Generate an API key
3. Add it to your `.env.local` file

### 6. Run the Application

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## API Integration

The chat API (`/api/chat`) supports:

- **OpenRouter Models**: Currently configured for `google/gemini-flash-1.5`
- **Message Persistence**: All messages saved to PostgreSQL
- **Response Caching**: AI responses cached in Redis (1-hour TTL)
- **Error Handling**: Graceful degradation if database/cache fails

## Future Enhancements

- User authentication with NextAuth.js
- Chat session management
- Message history persistence per user
- Real-time collaboration features
- Advanced model selection UI
- Message export functionality

## Development

```bash
# Build the application
npm run build

# Run linting
npm run lint

# Start production server
npm start
```
