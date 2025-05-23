import Link from "next/link"
import { notFound } from "next/navigation"
import { db } from "@/db/drizzle"
import { reservations } from "@/db/schema"
import { eq } from "drizzle-orm"
import { formatDate, formatTime } from "@/lib/utils"
import { ArrowLeft, Phone, Users, Calendar, Clock, FileText } from "lucide-react"
import type { PageProps } from "next"

interface ReservationDetailPageProps extends PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ReservationDetail({ params }: ReservationDetailPageProps) {
  // Await the params Promise to get the actual values
  const { id: idString } = await params
  const id = Number.parseInt(idString)

  if (isNaN(id)) {
    return notFound()
  }

  const reservation = await db
    .select()
    .from(reservations)
    .where(eq(reservations.id, id))
    .limit(1)
    .then((res) => res[0])

  if (!reservation) {
    return notFound()
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="flex items-center text-sm mb-6 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to all reservations
      </Link>

      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg border border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-2xl leading-6 font-medium text-gray-900 dark:text-white">Reservation Details</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            Reservation for {reservation.customerName}
          </p>
        </div>
        <div className="px-4 py-5 sm:p-6 space-y-6">
          <div className="flex items-start space-x-4">
            <Users className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Customer</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{reservation.customerName}</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <Phone className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Phone</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{reservation.phone}</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <Calendar className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Date</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(reservation.reservationDate)}</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <Clock className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Time</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{formatTime(reservation.reservationTime)}</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <Users className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Party Size</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{reservation.partySize} people</p>
            </div>
          </div>

          {reservation.specialRequests && (
            <div className="flex items-start space-x-4">
              <FileText className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Special Requests</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 whitespace-pre-line">
                  {reservation.specialRequests}
                </p>
              </div>
            </div>
          )}
        </div>
        <div className="px-4 py-4 sm:px-6 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-700 flex justify-between transition-colors duration-200">
          <Link
            href={`/reservation/${id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 transition-colors duration-200"
          >
            Edit Reservation
          </Link>
          <form
            action={async () => {
              "use server"
              await db.delete(reservations).where(eq(reservations.id, id))
            }}
          >
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-900 transition-colors duration-200"
            >
              Cancel Reservation
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
