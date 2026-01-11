# Layera

Layera is an AI-powered web application for discovering and creating perfume layering combinations. Users can build their perfume collections, get AI-powered fragrance recommendations, and create custom layering combinations.

## Features

- **Perfume Collection**: Browse, search, and manage your personal perfume collection
- **AI Chat Assistant**: Get personalized fragrance layering recommendations powered by Google Gemini
- **User Submissions**: Submit new perfumes to expand the database (admin approval required)
- **Admin Dashboard**: Review pending submissions, manage perfumes, and view login history
- **Rate Limiting**: Built-in prompt limiting to manage AI usage

## Tech Stack

| Category       | Technology                    |
| -------------- | ----------------------------- |
| Framework      | Next.js 16 (App Router)       |
| Language       | TypeScript                    |
| Database       | PostgreSQL (Neon serverless)  |
| ORM            | Prisma 7                      |
| Authentication | NextAuth v5 (beta)            |
| Styling        | Tailwind CSS 4 + DaisyUI 5    |
| AI             | Google Generative AI (Gemini) |
| Image Storage  | Cloudinary                    |
| Forms          | React Hook Form               |
| Notifications  | Sonner                        |
| Icons          | Lucide React                  |

## Prerequisites

- Node.js 18.x or higher
- npm or yarn
- PostgreSQL database (or [Neon](https://neon.tech) account)
- [Cloudinary](https://cloudinary.com) account
- [Google AI Studio](https://aistudio.google.com) API key

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/algusaem/layera.git
cd layera
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"

# Authentication
AUTH_SECRET="your-auth-secret-here"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Google AI
GEMINI_API_KEY="your-gemini-api-key"
```

#### Getting the credentials:

- **DATABASE_URL**: Create a database on [Neon](https://neon.tech) or use any PostgreSQL provider
- **AUTH_SECRET**: Generate with `openssl rand -base64 32`
- **Cloudinary**: Get credentials from [Cloudinary Console](https://console.cloudinary.com)
- **GEMINI_API_KEY**: Get from [Google AI Studio](https://aistudio.google.com/apikey)

### 4. Set up the database

Push the Prisma schema to your database:

```bash
npx prisma db push
```

Generate the Prisma client:

```bash
npx prisma generate
```

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
layera/
├── app/
│   ├── actions/           # Server actions organized by domain
│   │   ├── admin/         # Admin-only actions
│   │   ├── auth/          # Authentication actions
│   │   ├── brand/         # Brand management
│   │   ├── chat/          # AI chat functionality
│   │   ├── collection/    # User collection management
│   │   ├── image/         # Image upload/delete
│   │   ├── perfume/       # Perfume queries
│   │   └── prompt/        # Rate limiting
│   ├── admin/             # Admin pages
│   ├── ask/               # AI chat page
│   ├── collection/        # Collection pages
│   ├── api/auth/          # NextAuth API route
│   └── generated/prisma/  # Generated Prisma client
├── components/
│   ├── Admin/             # Admin components
│   ├── Ask/               # Chat components
│   ├── Collection/        # Collection components
│   └── Main/              # Shared layout components
├── lib/
│   ├── auth.ts            # NextAuth configuration
│   └── prisma.ts          # Prisma client instance
├── prisma/
│   └── schema/            # Modular Prisma schema files
├── types/                 # TypeScript type definitions
└── public/                # Static assets
```

## Available Scripts

| Command               | Description                                       |
| --------------------- | ------------------------------------------------- |
| `npm run dev`         | Start development server                          |
| `npm run build`       | Build for production (includes `prisma generate`) |
| `npm run start`       | Start production server                           |
| `npm run lint`        | Run ESLint                                        |
| `npx prisma studio`   | Open Prisma database GUI                          |
| `npx prisma db push`  | Push schema changes to database                   |
| `npx prisma generate` | Regenerate Prisma client                          |

## Database Schema

The Prisma schema is split into modular files in `prisma/schema/`:

- `base.prisma` - Generator and datasource configuration
- `user.prisma` - User, Session, Role models
- `perfume.prisma` - Brand, Perfume, UserPerfume models
- `layer.prisma` - Layer, LayerPerfume models
- `prompt.prisma` - PromptUsage for rate limiting

## Authentication

The app uses NextAuth v5 with credentials provider. Users can:

- Register with email/password
- Login with existing credentials
- Admin role for elevated permissions

Protected routes redirect to `/collection/login`.

## Admin Features

Admins have access to `/admin` with:

- **Review**: Approve or reject user-submitted perfumes
- **Perfumes**: View and delete all perfumes
- **Log History**: View user login sessions

## Rate Limiting

The AI chat is rate-limited to 10 prompts per hour per user. Usage is tracked in the `PromptUsage` table.

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Run `npm run lint` to check for errors
4. Submit a pull request
