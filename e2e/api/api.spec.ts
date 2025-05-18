import { test, expect } from "@playwright/test"
import { format } from "date-fns"

test.describe("API Tests", () => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowFormatted = format(tomorrow, "yyyy-MM-dd")

  test("GET /api/reservations/:id should return a reservation", async ({ request }) => {
    // First, create a reservation via the API
    const createResponse = await request.post("/api/reservations", {
      data: {
        customerName: "API Test Customer",
        phone: "(555) 987-6543",
        reservationDate: tomorrowFormatted,
        reservationTime: "20:00",
        partySize: 3,
        specialRequests: "API test request",
      },
    })

    expect(createResponse.ok()).toBeTruthy()
    const createData = await createResponse.json()
    expect(createData.id).toBeDefined()

    // Now fetch the reservation
    const getResponse = await request.get(`/api/reservations/${createData.id}`)
    expect(getResponse.ok()).toBeTruthy()

    const getData = await getResponse.json()
    expect(getData.customerName).toBe("API Test Customer")
    expect(getData.phone).toBe("(555) 987-6543")
    expect(getData.partySize).toBe(3)
    expect(getData.specialRequests).toBe("API test request")
  })

  test("GET /api/reservations/:id should return 404 for non-existent reservation", async ({ request }) => {
    const response = await request.get("/api/reservations/9999")
    expect(response.status()).toBe(404)

    const data = await response.json()
    expect(data.error).toBe("Reservation not found")
  })
})
