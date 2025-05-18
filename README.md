# Restaurant Reservation System

A modern web application for managing restaurant reservations.

## Features

- Create, view, edit, and cancel reservations
- Track customer information, party size, and special requests
- Responsive design that works on desktop and mobile devices
- Dark mode support

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database

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
