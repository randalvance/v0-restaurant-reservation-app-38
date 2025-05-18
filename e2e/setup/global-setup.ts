import { chromium, type FullConfig } from "@playwright/test"
import { db } from "../../db/drizzle"
import { reservations } from "../../db/schema"

async function globalSetup(config: FullConfig) {
  // Clear the database and seed with test data
  try {
    // Delete all existing reservations
    await db.delete(reservations)

    // Seed with a test reservation
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    await db.insert(reservations).values({
      customerName: "John Doe",
      phone: "(123) 456-7890",
      reservationDate: tomorrow,
      reservationTime: "18:30",
      partySize: 2,
      specialRequests: "No onions please",
    })

    console.log("Database seeded successfully for tests")
  } catch (error) {
    console.error("Error seeding database for tests:", error)
    throw error
  }

  // Set up authentication if needed
  const { baseURL } = config.projects[0].use
  const browser = await chromium.launch()
  const page = await browser.newPage()

  if (baseURL) {
    await page.goto(baseURL)
    // Add authentication steps here if needed
  }

  await browser.close()
}

export default globalSetup
