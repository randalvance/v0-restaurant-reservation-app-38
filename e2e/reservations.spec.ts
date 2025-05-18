import { test, expect } from "@playwright/test"
import { format } from "date-fns"

// Test data
const testReservation = {
  customerName: "Test Customer",
  phone: "(555) 123-4567",
  partySize: "4",
  specialRequests: "Window seat please",
}

// Get tomorrow's date in YYYY-MM-DD format for the date input
const tomorrow = new Date()
tomorrow.setDate(tomorrow.getDate() + 1)
const tomorrowFormatted = format(tomorrow, "yyyy-MM-dd")

test.describe("Restaurant Reservation System", () => {
  test.beforeEach(async ({ page }) => {
    // Go to the homepage before each test
    await page.goto("/")
  })

  test("should display the homepage with reservations table", async ({ page }) => {
    // Check if the page title is correct
    await expect(page).toHaveTitle(/Restaurant Reservation System/)

    // Check if the main heading is present
    await expect(page.locator("h1")).toContainText("Restaurant Reservations")

    // Check if the "Add Reservation" button is present
    await expect(page.getByRole("link", { name: "Add Reservation" })).toBeVisible()

    // Check if the reservations table is present
    await expect(page.locator("table")).toBeVisible()
  })

  test("should navigate to add reservation page", async ({ page }) => {
    // Click the "Add Reservation" button
    await page.getByRole("link", { name: "Add Reservation" }).click()

    // Check if we're on the add reservation page
    await expect(page).toHaveURL(/\/add-reservation/)

    // Check if the form is present
    await expect(page.locator("form")).toBeVisible()

    // Check if the form has the expected fields
    await expect(page.getByLabel("Customer Name")).toBeVisible()
    await expect(page.getByLabel("Phone Number")).toBeVisible()
    await expect(page.getByLabel("Date")).toBeVisible()
    await expect(page.getByLabel("Time")).toBeVisible()
    await expect(page.getByLabel("Party Size")).toBeVisible()
    await expect(page.getByLabel("Special Requests")).toBeVisible()
  })

  test("should create a new reservation", async ({ page }) => {
    // Navigate to add reservation page
    await page.getByRole("link", { name: "Add Reservation" }).click()

    // Fill out the form
    await page.getByLabel("Customer Name").fill(testReservation.customerName)
    await page.getByLabel("Phone Number").fill(testReservation.phone)
    await page.getByLabel("Date").fill(tomorrowFormatted)
    await page.getByLabel("Time").fill("19:00")
    await page.getByLabel("Party Size").fill(testReservation.partySize)
    await page.getByLabel("Special Requests").fill(testReservation.specialRequests)

    // Submit the form
    await page.getByRole("button", { name: "Create Reservation" }).click()

    // Wait for the success toast or redirect
    await expect(page).toHaveURL("/")

    // Check if the new reservation appears in the table
    await expect(page.locator("table")).toContainText(testReservation.customerName)
    await expect(page.locator("table")).toContainText(testReservation.phone)
    await expect(page.locator("table")).toContainText(testReservation.partySize)
  })

  test("should view reservation details", async ({ page }) => {
    // Assuming there's at least one reservation in the table
    // Click on the "View Details" link for the first reservation
    await page.getByRole("link", { name: "View Details" }).first().click()

    // Check if we're on the reservation details page
    await expect(page).toHaveURL(/\/reservation\/\d+/)

    // Check if the details are displayed
    await expect(page.getByText("Reservation Details")).toBeVisible()
    await expect(page.getByText("Customer")).toBeVisible()
    await expect(page.getByText("Phone")).toBeVisible()
    await expect(page.getByText("Date")).toBeVisible()
    await expect(page.getByText("Time")).toBeVisible()
    await expect(page.getByText("Party Size")).toBeVisible()

    // Check if the action buttons are present
    await expect(page.getByRole("link", { name: "Edit Reservation" })).toBeVisible()
    await expect(page.getByRole("button", { name: "Cancel Reservation" })).toBeVisible()
  })

  test("should edit a reservation", async ({ page }) => {
    // Go to the first reservation's details page
    await page.getByRole("link", { name: "View Details" }).first().click()

    // Click the Edit Reservation button
    await page.getByRole("link", { name: "Edit Reservation" }).click()

    // Check if we're on the edit page
    await expect(page).toHaveURL(/\/reservation\/\d+\/edit/)

    // Update the customer name
    const updatedName = "Updated Customer Name"
    await page.getByLabel("Customer Name").fill(updatedName)

    // Save the changes
    await page.getByRole("button", { name: "Save Changes" }).click()

    // Check if we're redirected to the details page
    await expect(page).toHaveURL(/\/reservation\/\d+$/)

    // Verify the name was updated
    await expect(page.locator("body")).toContainText(updatedName)
  })

  test("should delete a reservation", async ({ page }) => {
    // Count the number of reservations initially
    const initialCount = await page.getByRole("link", { name: "View Details" }).count()

    // Go to the first reservation's details page
    await page.getByRole("link", { name: "View Details" }).first().click()

    // Click the Cancel Reservation button
    await page.getByRole("button", { name: "Cancel Reservation" }).click()

    // Check if we're redirected to the homepage
    await expect(page).toHaveURL("/")

    // If there was only one reservation, check for the empty state
    if (initialCount === 1) {
      await expect(page.locator("table")).toContainText("No reservations found")
    } else {
      // Otherwise, check that the count decreased by 1
      const newCount = await page.getByRole("link", { name: "View Details" }).count()
      expect(newCount).toBe(initialCount - 1)
    }
  })

  test("should validate form inputs", async ({ page }) => {
    // Navigate to add reservation page
    await page.getByRole("link", { name: "Add Reservation" }).click()

    // Submit the form without filling it
    await page.getByRole("button", { name: "Create Reservation" }).click()

    // Check for validation errors
    await expect(page.locator("form")).toContainText("Customer name must be at least 2 characters")
    await expect(page.locator("form")).toContainText("Phone number must be at least 10 digits")

    // Fill with invalid data
    await page.getByLabel("Customer Name").fill("A") // Too short
    await page.getByLabel("Phone Number").fill("123") // Too short
    await page.getByLabel("Party Size").fill("0") // Too small

    // Submit again
    await page.getByRole("button", { name: "Create Reservation" }).click()

    // Check for validation errors again
    await expect(page.locator("form")).toContainText("Customer name must be at least 2 characters")
    await expect(page.locator("form")).toContainText("Phone number must be at least 10 digits")
    await expect(page.locator("form")).toContainText("Party size must be at least 1 person")
  })

  test("should handle responsive design", async ({ page }) => {
    // Test on mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    // Check if the page is still usable
    await expect(page.locator("h1")).toBeVisible()
    await expect(page.getByRole("link", { name: "Add Reservation" })).toBeVisible()
    await expect(page.locator("table")).toBeVisible()

    // Navigate to add reservation page
    await page.getByRole("link", { name: "Add Reservation" }).click()

    // Check if the form is still usable on mobile
    await expect(page.locator("form")).toBeVisible()
    await expect(page.getByLabel("Customer Name")).toBeVisible()
  })
})
