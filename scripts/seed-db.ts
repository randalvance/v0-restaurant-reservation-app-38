import { db } from "../db/drizzle"
import { reservations } from "../db/schema"
import { addDays, subDays, format } from "date-fns"

async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...")

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log("Clearing existing reservations...")
    await db.delete(reservations)
    console.log("Existing reservations cleared.")

    // Generate dates for reservations
    const today = new Date()
    const yesterday = subDays(today, 1)
    const twoDaysAgo = subDays(today, 2)
    const tomorrow = addDays(today, 1)
    const dayAfterTomorrow = addDays(today, 2)
    const nextWeek = addDays(today, 7)

    // Sample customer data
    const sampleReservations = [
      {
        customerName: "John Smith",
        phone: "(555) 123-4567",
        reservationDate: format(yesterday, "yyyy-MM-dd"),
        reservationTime: "18:00",
        partySize: 2,
        specialRequests: "Window seat preferred",
      },
      {
        customerName: "Emily Johnson",
        phone: "(555) 234-5678",
        reservationDate: format(yesterday, "yyyy-MM-dd"),
        reservationTime: "19:30",
        partySize: 4,
        specialRequests: "Celebrating a birthday, possible cake",
      },
      {
        customerName: "Michael Williams",
        phone: "(555) 345-6789",
        reservationDate: format(twoDaysAgo, "yyyy-MM-dd"),
        reservationTime: "20:00",
        partySize: 6,
        specialRequests: "One person has a gluten allergy",
      },
      {
        customerName: "Sarah Davis",
        phone: "(555) 456-7890",
        reservationDate: format(today, "yyyy-MM-dd"),
        reservationTime: "12:30",
        partySize: 3,
        specialRequests: null,
      },
      {
        customerName: "Robert Brown",
        phone: "(555) 567-8901",
        reservationDate: format(today, "yyyy-MM-dd"),
        reservationTime: "13:00",
        partySize: 2,
        specialRequests: "Anniversary celebration",
      },
      {
        customerName: "Jennifer Miller",
        phone: "(555) 678-9012",
        reservationDate: format(today, "yyyy-MM-dd"),
        reservationTime: "19:00",
        partySize: 5,
        specialRequests: "High chair needed for toddler",
      },
      {
        customerName: "David Wilson",
        phone: "(555) 789-0123",
        reservationDate: format(tomorrow, "yyyy-MM-dd"),
        reservationTime: "18:30",
        partySize: 4,
        specialRequests: null,
      },
      {
        customerName: "Lisa Moore",
        phone: "(555) 890-1234",
        reservationDate: format(tomorrow, "yyyy-MM-dd"),
        reservationTime: "20:00",
        partySize: 2,
        specialRequests: "Quiet table for business discussion",
      },
      {
        customerName: "James Taylor",
        phone: "(555) 901-2345",
        reservationDate: format(dayAfterTomorrow, "yyyy-MM-dd"),
        reservationTime: "19:00",
        partySize: 8,
        specialRequests: "Celebrating graduation, will bring own cake",
      },
      {
        customerName: "Patricia Anderson",
        phone: "(555) 012-3456",
        reservationDate: format(dayAfterTomorrow, "yyyy-MM-dd"),
        reservationTime: "17:30",
        partySize: 6,
        specialRequests: "Two vegetarians in the party",
      },
      {
        customerName: "Thomas Jackson",
        phone: "(555) 123-4567",
        reservationDate: format(nextWeek, "yyyy-MM-dd"),
        reservationTime: "18:00",
        partySize: 4,
        specialRequests: null,
      },
      {
        customerName: "Barbara White",
        phone: "(555) 234-5678",
        reservationDate: format(nextWeek, "yyyy-MM-dd"),
        reservationTime: "19:30",
        partySize: 2,
        specialRequests: "Anniversary dinner, would like a romantic table",
      },
      {
        customerName: "Charles Harris",
        phone: "(555) 345-6789",
        reservationDate: format(addDays(nextWeek, 1), "yyyy-MM-dd"),
        reservationTime: "20:00",
        partySize: 7,
        specialRequests: "Family gathering, one person in wheelchair",
      },
      {
        customerName: "Susan Martin",
        phone: "(555) 456-7890",
        reservationDate: format(addDays(nextWeek, 2), "yyyy-MM-dd"),
        reservationTime: "18:30",
        partySize: 5,
        specialRequests: "One child in the party, needs booster seat",
      },
      {
        customerName: "Joseph Thompson",
        phone: "(555) 567-8901",
        reservationDate: format(addDays(nextWeek, 3), "yyyy-MM-dd"),
        reservationTime: "19:00",
        partySize: 2,
        specialRequests: "Prefer table away from kitchen",
      },
    ]

    // Insert seed data
    console.log(`Inserting ${sampleReservations.length} sample reservations...`)

    for (const reservation of sampleReservations) {
      await db.insert(reservations).values({
        customerName: reservation.customerName,
        phone: reservation.phone,
        reservationDate: new Date(reservation.reservationDate),
        reservationTime: reservation.reservationTime,
        partySize: reservation.partySize,
        specialRequests: reservation.specialRequests,
      })
    }

    console.log("✅ Seed data inserted successfully!")
    console.log(`Added ${sampleReservations.length} reservations to the database.`)
  } catch (error) {
    console.error("❌ Error seeding database:", error)
  } finally {
    process.exit(0)
  }
}

// Run the seed function
seedDatabase()
