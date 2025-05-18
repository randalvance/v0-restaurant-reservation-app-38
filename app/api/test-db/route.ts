import { NextResponse } from "next/server"
import { testConnection } from "@/db/drizzle"

export async function GET() {
  try {
    const connected = await testConnection()

    if (connected) {
      return NextResponse.json({ status: "success", message: "Database connection successful" })
    } else {
      return NextResponse.json({ status: "error", message: "Database connection failed" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error testing database connection:", error)
    return NextResponse.json({ status: "error", message: "Error testing database connection" }, { status: 500 })
  }
}
