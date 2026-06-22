# EchoInbox - Production Anonymous Messaging Platform

**Version:** 1.0.0  
**Status:** Live Deployment (MVP)  
**Live Application Endpoint:** [https://echoinboxchat.vercel.app](https://echoinboxchat.vercel.app)  
**Tech Stack:** TypeScript, Next.js, React, PostgreSQL, Prisma, Tailwind CSS, NextAuth, Resend, Vercel AI SDK, Groq

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![NextAuth](https://img.shields.io/badge/NextAuth-000000?style=for-the-badge&logo=nextauth&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-AI-orange?style=for-the-badge)

---

## Project Overview

EchoInbox is a production MVP anonymous feedback and messaging platform built with Next.js App Router. The system features secure NextAuth Credentials authentication, email verification via Resend, a fully normalized PostgreSQL database managed through Prisma ORM, and an AI-powered message suggestion engine utilizing the Vercel AI SDK and Groq Cloud API for generating spicy, engaging anonymous questions.

### AI-Powered Message Suggestion Engine (New in v1.0)

EchoInbox features an intelligent prompt suggestion generator powered by Groq to help users draft engaging, anonymous questions to send to their friends or classmates.

- **Spicy Suggestions:** Uses Vercel AI SDK connected to Groq Cloud (specifically `llama-3.3-70b-versatile`) to generate short, highly engaging anonymous questions.
- **Smart System Prompts:** Instructed to keep questions conversational, safe, clean, and tailored to casual social media dynamics (similar to Instagram's NGL).
- **Zod Schema Validation:** Enforces structured output format (`{ suggestions: [string, string, string] }`) to prevent LLM hallucinations.

**Live Infrastructure:**

- **Deployment:** Vercel (Next.js Application Frontend/Backend Serverless)
- **Database:** Managed PostgreSQL (via `DATABASE_URL`, local PostgreSQL for development)
- **Email Gateway:** Resend API for transactional verification code emails
- **AI Gateway:** Groq API Cloud Client via Vercel AI SDK
- **Security:** CSRF protection, secure HTTP-only session cookies, input validation with Zod

---

## System Architecture

```
Client (Browser) → Vercel CDN/Serverless → Prisma ORM → PostgreSQL (Neon/Supabase)
                       ↓
              Resend / Groq AI / NextAuth JWT
```

**Request Flow:**

1. User interacts with Next.js App Router pages (SSR / Client Components)
2. API requests to `/api` routes handled via Next.js route handlers
3. User authorization checked via NextAuth `getServerSession` (JWT based)
4. Data mutation / query runs via Prisma ORM to PostgreSQL
5. Email notifications / verification codes sent asynchronously via Resend API
6. Anonymous question suggestions generated dynamically via Groq model via Vercel AI SDK

**Key Architecture Decisions:**

- **Next.js App Router:** Unified React application for frontend and serverless API handlers
- **PostgreSQL + Prisma ORM:** Relational integrity with type-safe client generation and automatic migrations
- **NextAuth JWT Strategy:** Stateless, session-based authentication using HTTP-only cookies
- **Vercel AI SDK:** Structured object generation with Zod validation schemas
- **Console Log Fallback:** Verification codes are output directly to the server logs to prevent testing blocks if email limits are hit

---

## Core Technology Stack

![Next.js](https://img.shields.io/badge/Next.js-15+-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-7.x-2D3748?style=flat-square&logo=prisma&logoColor=white)
![NextAuth.js](https://img.shields.io/badge/NextAuth.js-v4-000000?style=flat-square&logo=nextauth&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Resend](https://img.shields.io/badge/Resend-Email-3448C5?style=flat-square)
![Groq](https://img.shields.io/badge/Groq-Llama3-orange?style=flat-square)

| Layer         | Technology               | Version | Purpose                                   |
| ------------- | ------------------------ | ------- | ----------------------------------------- |
| Framework     | Next.js App Router       | v16.2.9 | App execution, serverless routes & SSR    |
| UI Library    | React                    | v19.2.4 | Interactive client-side interfaces        |
| Language      | TypeScript               | v5.x    | Static typing and compile-time checks     |
| Database      | PostgreSQL               | v14+    | Relational data storage for users & messages|
| ORM           | Prisma                   | v7.8.0  | Type-safe database queries and schema     |
| Styling       | Tailwind CSS             | v4.0.0  | Modern utility-first CSS styling          |
| Auth          | NextAuth.js              | v4.24.14| JWT-based authentication system           |
| Email         | Resend                   | v6.12.4 | Transactional verification emails         |
| AI SDK        | Vercel AI SDK            | v6.0.208| Structured generation & SDK utilities     |
| AI Model      | Groq (Llama 3.3)         | Latest  | Real-time prompt suggestion engine        |

---

## AI Features (v1.0)

### 1. Message Suggestions Endpoint (`/api/suggest-messages`)

Generates structured anonymous questions to help users get started.

- **Input:** POST request
- **Logic:** Calls `generateText` using Groq's `llama-3.3-70b-versatile` model. Instructs the model to generate 3 unique, engaging, and clean questions.
- **Output:** Returns JSON object: `{ success: true, messages: [string, string, string] }` matching Zod schema validation.

---

## Database Schema

The database follows **Third Normal Form (3NF)** with strategic indexing and cascading deletes.

### Core Tables

**Users**

```sql
id                 VARCHAR PRIMARY KEY (UUIDv7)
username           VARCHAR UNIQUE (indexed)
email              VARCHAR UNIQUE (indexed)
password           VARCHAR (bcrypt hashed)
verifyCode         VARCHAR
verifyCodeExpiry   TIMESTAMP
isVerified         BOOLEAN DEFAULT FALSE
isAcceptingMessage BOOLEAN DEFAULT TRUE
createdAt          TIMESTAMP DEFAULT NOW()
updatedAt          TIMESTAMP DEFAULT NOW()
```

**Messages**

```sql
id        VARCHAR PRIMARY KEY (UUIDv4)
userId    VARCHAR FK → Users.id (CASCADE DELETE)
content   VARCHAR(400)
createdAt TIMESTAMP DEFAULT NOW()
```

**Relationships:**

- User → Messages (1:N, cascade delete on user deletion)

---

## API Architecture

**Base URL:** `/api`

### Authentication Flow

```
Sign Up → Generate Verification Code → Send via Resend + Log to Console
Verify Code → Set isVerified=True → Database Updated
Login → NextAuth verify credentials → Issue JWT → Session active in HTTP-Only cookies
```

### Endpoint Categories

**1. Authentication & Registration (4 endpoints)**

```
POST   /api/sign-up                  - Register a new account, generates 6-digit verification code
POST   /api/verify-code              - Verify account using username and 6-digit verification code
POST   /api/auth/signin              - Sign in via CredentialsProvider
POST   /api/auth/signout             - Sign out and clear session tokens
```

**2. Account & Profile Management (4 endpoints)**

```
GET    /api/check-username-unique    - Check if username is available (query: ?username=...)
POST   /api/accept-messages          - Update the user's isAcceptingMessage toggle
GET    /api/accept-messages          - Check current user's isAcceptingMessage status
DELETE /api/delete-account           - Delete current user's account and messages (within a transaction)
```

**3. Inbox & Messaging (3 endpoints)**

```
GET    /api/get-status/:username     - Get message acceptance status of a specific user
POST   /api/send-message             - Send an anonymous message to a user (max 400 chars)
DELETE /api/delete-message/:messageid- Delete a specific message by its ID (owner only)
```

**4. AI / Suggestion Engine (1 endpoint)**

```
POST   /api/suggest-messages         - Request 3 AI-generated question suggestions via Groq
```

---

## Security Implementation

### Authentication & Authorization

**Password Security:**

- Bcrypt hashing (10 salt rounds)
- Minimum password characters enforced at application layer

**NextAuth & JWT Configuration:**

- Session State: Stateless JWTs stored in secure HTTP-only cookies
- CSRF Protection: Managed internally by NextAuth.js
- Authorized access verified in route handlers using NextAuth's `getServerSession(authOptions)`

### Network Security & Safety

**Transaction Reliability:**

- Account deletion runs as a database transaction (`prisma.$transaction`) to safely clear user messages and records concurrently.
- User verification constraints prevent unverified users from authenticating.

### Input Validation

**Validation Strategy:**

- Zod schemas enforce structured validation on both forms and API payload requests.
- Anonymous message validation limits content strictly between 1 and 400 characters to prevent spam.

---

## Optimization Strategies

**Database:**

- Primary keys utilize UUIDv7 for User models to optimize sequential database index sorting and generation speed.
- Parallel fetching (`Promise.all`) on server components to load user status and messages simultaneously, reducing TTFB.
- Cascade constraints handle clean foreign key cleanups natively on database level.

**User Experience:**

- Groq API calls include an 8000ms timeout threshold, handling slow downstream response rates gracefully.
- Fallback logging of email verification codes to terminal consoles allows developers and sandbox environments to bypass email API limits.

---

## Deployment Architecture

### Production Environment

**Platform Configuration:**

- **Deployment:** Vercel (or any containerized hosting provider)
- **Database:** Managed PostgreSQL (Neon / Supabase Serverless)
- **Secrets Management:** Environment variables configured securely in Vercel or local `.env`

---

## Getting Started

### Prerequisites

```bash
Node.js v18+
PostgreSQL v14+
Resend Account (for verification emails)
Groq Cloud API Key (for prompt suggestions)
```

### Local Development Setup

```bash
# Clone repository
git clone https://github.com/Nishant-444/echoinbox.git
cd echoinbox

# Install dependencies
pnpm install

# Configure environment
cp .env.sample .env
# Edit .env with your PostgreSQL, Resend, NextAuth, and Groq credentials

# Run database migrations
npx prisma db push

# Generate Prisma Client
npx prisma generate

# Start development server
pnpm dev
```

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://username:password@host/dbname?sslmode=require"

# Resend Email Service
RESEND_API_KEY=re_your_api_key

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Groq Cloud API
GROQ_API_KEY=gsk_your_groq_api_key
```

### Verification

```bash
# Health check (by checking username uniqueness)
curl http://localhost:3000/api/check-username-unique?username=testusername

# Expected response
{
  "success": true,
  "message": "Username is unique"
}
```

---

## Testing

### Manual Testing

1. Register a user by sending a payload to `/api/sign-up`.
2. Retrieve the 6-digit verification code directly from the Node.js terminal logs (if the Resend sandbox environment is restricted).
3. Validate the code by hitting `/api/verify-code`.
4. Log in at `/sign-in` to configure acceptance preferences.
5. Access `/u/[username]` to send anonymous feedback messages.

### Test Coverage (Roadmap)

- [ ] Unit tests for API route handlers
- [ ] NextAuth credentials provider tests
- [ ] AI prompt validation tests
- [ ] Target: 80%+ coverage

---

## Project Structure

```
echoinbox/
├── components/                 # Reusable UI elements (Shadcn)
├── prisma/
│   ├── schema.prisma           # Prisma schema (User and Message models)
│   └── migrations/             # Migration history
├── src/
│   ├── app/
│   │   ├── (app)/              # Authenticated layout & dashboard pages
│   │   ├── (auth)/             # Login, sign-up, verification pages
│   │   ├── api/                # API route handlers
│   │   ├── u/                  # Public message submission routing ([username])
│   │   ├── globals.css         # Styling styles
│   │   └── layout.tsx          # Root layout
│   ├── context/                # NextAuth session context providers
│   ├── helpers/                # Mail sending helper
│   ├── lib/                    # Database (prisma) & service instances (resend)
│   ├── schema/                 # Form validation schemas (Zod)
│   └── types/                  # TypeScript interface definitions
├── components.json             # Shadcn configuration
├── package.json                # Project dependencies and scripts
└── tsconfig.json               # TypeScript configuration
```

---

## Known Limitations & Roadmap

### Current Constraints

1. **Static AI Selection:** Returns 3 message ideas based on Groq model context without custom user customization categories.
2. **Standard Pagination:** All messages are retrieved concurrently from the database without cursor pagination.
3. **No Profile Pictures:** User profiles do not support custom uploaded profile avatars.
4. **Basic Notification UI:** Emails use simple templates with no rich custom styling layouts.

### Planned Enhancements (v2.0)

- Real-time notifications via WebSockets.
- Cursor-based database pagination for message dashboards.
- Profile settings page with custom Cloudinary avatar uploads.
- Rich-text responsive email designs.
- Custom categories selector ("funny", "romantic", "creative") for customized AI question suggestions.

---

## Technical Decisions & Trade-offs

### Why Next.js App Router?

- **Unified Stack:** Direct integration of backend API handlers and SSR client-side React code in one workspace.
- **Fast Interactive Rendering:** Server components fetch user credentials and database logs concurrently on load.

### Why PostgreSQL + Prisma?

- **Relational Constraints:** Direct cascade deletes and user-message relationships require ACID transactions.
- **Type Safety:** Automated TypeScript client models synchronized directly on schema push.

### Why Groq over OpenAI?

- **Ultra-Fast Generation:** Llama 3 models hosted on Groq compile results in under 500ms.
- **Development Pricing:** Groq Cloud provides a cost-effective alternative for rendering real-time user prompts.

### Why Resend?

- **Minimal Setup:** Provides a highly intuitive, developer-friendly client layer out of the box.

---

## Contributing

Contributions welcome. Follow standard Git workflow:

```bash
git checkout -b feature/feature-name
# Make changes
git commit -m "Add: feature description"
git push origin feature/feature-name
# Open pull request
```

---

## License

MIT License

---

## Author

**Nishant Sharma**  
GitHub: [@Nishant-444](https://github.com/Nishant-444)  
Repository: [EchoInbox](https://github.com/Nishant-444/echoinbox)
