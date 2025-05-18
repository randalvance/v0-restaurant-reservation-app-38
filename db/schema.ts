import { pgTable, serial, text, date, integer, varchar, time } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

export const reservations = pgTable("reservations", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  reservationDate: date("reservation_date").notNull(),
  reservationTime: time("reservation_time").notNull(),
  partySize: integer("party_size").notNull(),
  specialRequests: text("special_requests"),
  createdAt: date("created_at").defaultNow().notNull(),
})

// Define relations (for future use if needed)
export const reservationsRelations = relations(reservations, ({ one, many }) => ({
  // Example relation if you add tables like tables or customers in the future
  // customer: one(customers, {
  //   fields: [reservations.customerId],
  //   references: [customers.id],
  // }),
}))
