import { defineConfig } from "drizzle-kit"
import { config } from "dotenv"

// Load environment variables from .env file
config()

// Get the database connection string from environment variables
const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  console.error("DATABASE_URL environment variable is not set")
  process.exit(1)
}

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString,
  },
  verbose: true,
  strict: true,
})
