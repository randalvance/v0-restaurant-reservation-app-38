import type { FullConfig } from "@playwright/test"
import { db } from "../../db/drizzle"
import { reservations } from "../../db/schema"

async function globalTeardown(config: FullConfig) {
  // Clean up the database after tests
  try {
    // Delete all test reservations
    await db.delete(reservations)
    console.log("Test data cleaned up successfully")
  } catch (error) {
    console.error("Error cleaning up test data:", error)
  }
}

export default globalTeardown
