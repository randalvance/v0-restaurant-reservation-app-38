import type { Page } from "@playwright/test"
import { format } from "date-fns"

/**
 * Helper function to create a reservation through the UI
 */
export async function createReservation(
  page: Page,
  data: {
    customerName: string
    phone: string
    date?: Date
    time?: string
    partySize: string
    specialRequests?: string
  },
) {
  // Navigate to add reservation page
  await page.goto("/add-reservation")

  // Use tomorrow as the default date if not provided
  const reservationDate = data.date || new Date(Date.now() + 24 * 60 * 60 * 1000)
  const formattedDate = format(reservationDate, "yyyy-MM-dd")

  // Fill out the form
  await page.getByLabel("Customer Name").fill(data.customerName)
  await page.getByLabel("Phone Number").fill(data.phone)
  await page.getByLabel("Date").fill(formattedDate)
  await page.getByLabel("Time").fill(data.time || "19:00")
  await page.getByLabel("Party Size").fill(data.partySize)

  if (data.specialRequests) {
    await page.getByLabel("Special Requests").fill(data.specialRequests)
  }

  // Submit the form
  await page.getByRole("button", { name: "Create Reservation" }).click()

  // Wait for navigation to complete
  await page.waitForURL("/")
}
