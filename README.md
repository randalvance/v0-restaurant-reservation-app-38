# Restaurant Reservation System

A modern web application for managing restaurant reservations.

## Features

- Create, view, edit, and cancel reservations
- Track customer information, party size, and special requests
- Responsive design that works on desktop and mobile devices
- Dark mode support
- Microsoft Authentication (Azure AD)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Microsoft Azure AD tenant (for authentication)

### Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Set up your environment variables by copying `.env.example` to `.env` and updating the values:
   \`\`\`bash
   cp .env.example .env
   \`\`\`
4. Update the `DATABASE_URL` in your `.env` file with your PostgreSQL connection string.
5. Set up authentication by copying `.env.local.example` to `.env.local` and updating the values:
   \`\`\`bash
   cp .env.local.example .env.local
   \`\`\`

### Authentication Setup

1. Register a new application in the [Azure Portal](https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade)
2. Set the redirect URI to `http://localhost:3000` (or your deployment URL)
3. Note the Application (client) ID and Directory (tenant) ID
4. Update your `.env.local` file with these values

### Database Setup

1. Run database migrations:
   \`\`\`bash
   npm run db:push
   \`\`\`
2. Seed the database with sample data:
   \`\`\`bash
   npm run db:seed
   \`\`\`

### Development

Start the development server:
\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Database Schema

The application uses a PostgreSQL database with the following schema:

### Reservations Table

| Column           | Type      | Description                       |
|------------------|-----------|-----------------------------------|
| id               | serial    | Primary key                       |
| customer_name    | text      | Customer's full name              |
| phone            | varchar   | Contact phone number              |
| reservation_date | date      | Date of the reservation           |
| reservation_time | time      | Time of the reservation           |
| party_size       | integer   | Number of people                  |
| special_requests | text      | Optional special requests         |
| created_at       | date      | When the reservation was created  |

## Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint
- `npm run db:generate`: Generate Drizzle migrations
- `npm run db:push`: Apply migrations to database
- `npm run db:studio`: Open Drizzle Studio to manage database
- `npm run db:test`: Test database connection
- `npm run db:seed`: Seed database with sample data
