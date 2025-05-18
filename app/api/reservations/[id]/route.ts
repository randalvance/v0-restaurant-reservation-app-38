import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/db/drizzle"
import { reservations } from "@/db/schema"
import { eq } from "drizzle-orm"
import type { PageProps } from "next"

interface RouteParams extends PageProps {
  params: Promise<{
    id: string
  }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Await the params Promise to get the actual values
    const { id: idString } = await params
    const id = Number.parseInt(idString)

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid reservation ID" }, { status: 400 })
    }

    const reservation = await db
      .select()
      .from(reservations)
      .where(eq(reservations.id, id))
      .limit(1)
      .then((res) => res[0])

    if (!reservation) {
      return NextResponse.json({ error: "Reservation not found" }, { status: 404 })
    }

    return NextResponse.json(reservation)
  } catch (error) {
    console.error("Error fetching reservation:", error)
    return NextResponse.json({ error: "Failed to fetch reservation" }, { status: 500 })
  }
}
