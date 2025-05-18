"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { updateReservation } from "@/actions/reservation-actions"
import { z } from "zod"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, Calendar, Clock } from "lucide-react"
import type { PageProps } from "next"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { format, parse } from "date-fns"

interface EditReservationPageProps extends PageProps {
  params: Promise<{
    id: string
  }>
}

const formSchema = z.object({
  id: z.number(),
  customerName: z.string().min(2, {
    message: "Customer name must be at least 2 characters.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }),
  reservationDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Please enter a valid date.",
  }),
  reservationTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Please enter a valid time in 24-hour format (HH:MM).",
  }),
  partySize: z.coerce.number().min(1, {
    message: "Party size must be at least 1 person.",
  }),
  specialRequests: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export default function EditReservation({ params }: EditReservationPageProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [idValue, setIdValue] = useState<number | null>(null)
  const [toast, setToast] = useState<{ visible: boolean; title: string; message: string; type: "success" | "error" }>({
    visible: false,
    title: "",
    message: "",
    type: "success",
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: 0,
      customerName: "",
      phone: "",
      reservationDate: "",
      reservationTime: "",
      partySize: 1,
      specialRequests: "",
    },
  })

  // Extract the ID from params Promise
  useEffect(() => {
    async function extractId() {
      try {
        const resolvedParams = await params
        const id = Number.parseInt(resolvedParams.id)
        setIdValue(id)
      } catch (err) {
        console.error("Error extracting ID from params:", err)
        setError("Invalid reservation ID")
      }
    }

    extractId()
  }, [params])

  // Fetch reservation data once we have the ID
  useEffect(() => {
    async function fetchReservation() {
      if (!idValue) return

      try {
        setIsLoading(true)
        const response = await fetch(`/api/reservations/${idValue}`)

        if (!response.ok) {
          throw new Error("Failed to fetch reservation")
        }

        const data = await response.json()

        // Format date for input field (YYYY-MM-DD)
        const date = new Date(data.reservationDate)
        const formattedDate = date.toISOString().split("T")[0]

        reset({
          id: data.id,
          customerName: data.customerName,
          phone: data.phone,
          reservationDate: formattedDate,
          reservationTime: data.reservationTime,
          partySize: data.partySize,
          specialRequests: data.specialRequests || "",
        })

        setError(null)
      } catch (err) {
        setError("Failed to load reservation. Please try again.")
        console.error("Error fetching reservation:", err)
      } finally {
        setIsLoading(false)
      }
    }

    if (idValue) {
      fetchReservation()
    }
  }, [idValue, reset])

  async function onSubmit(values: FormValues) {
    try {
      setIsSubmitting(true)
      const result = await updateReservation(values)

      if (result.success) {
        setToast({
          visible: true,
          title: "Reservation updated",
          message: "Your reservation has been successfully updated.",
          type: "success",
        })

        // Hide toast after 3 seconds and redirect
        setTimeout(() => {
          setToast((prev) => ({ ...prev, visible: false }))
          if (idValue) {
            router.push(`/reservation/${idValue}`)
            router.refresh()
          }
        }, 3000)
      } else {
        throw new Error(result.error || "Failed to update reservation")
      }
    } catch (error) {
      setToast({
        visible: true,
        title: "Error",
        message: error instanceof Error ? error.message : "There was a problem updating your reservation.",
        type: "error",
      })

      // Hide toast after 3 seconds
      setTimeout(() => {
        setToast((prev) => ({ ...prev, visible: false }))
      }, 3000)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 dark:border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading reservation...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-md p-4 max-w-2xl mx-auto">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400 dark:text-red-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error</h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                {idValue && (
                  <Link
                    href={`/reservation/${idValue}`}
                    className="text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300"
                  >
                    Go back to reservation details
                  </Link>
                )}
                {!idValue && (
                  <Link
                    href="/"
                    className="text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300"
                  >
                    Go back to reservations
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {idValue && (
        <Link
          href={`/reservation/${idValue}`}
          className="flex items-center text-sm mb-6 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to reservation details
        </Link>
      )}

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Edit Reservation</h1>

      {toast.visible && (
        <div
          className={`fixed top-4 right-4 w-80 p-4 rounded-md shadow-lg ${
            toast.type === "success"
              ? "bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-800"
              : "bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800"
          }`}
        >
          <div className="flex justify-between">
            <h3
              className={`text-sm font-medium ${
                toast.type === "success" ? "text-green-800 dark:text-green-200" : "text-red-800 dark:text-red-200"
              }`}
            >
              {toast.title}
            </h3>
            <button
              onClick={() => setToast((prev) => ({ ...prev, visible: false }))}
              className="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400"
            >
              <span className="sr-only">Close</span>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <p
            className={`mt-1 text-sm ${
              toast.type === "success" ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"
            }`}
          >
            {toast.message}
          </p>
        </div>
      )}

      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg border border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Edit Reservation</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            Update the reservation details below.
          </p>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <input type="hidden" {...register("id")} />

            <div>
              <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Customer Name
              </label>
              <div className="mt-1">
                <input
                  id="customerName"
                  type="text"
                  placeholder="John Doe"
                  {...register("customerName")}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md p-2 border bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              {errors.customerName && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.customerName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Phone Number
              </label>
              <div className="mt-1">
                <input
                  id="phone"
                  type="text"
                  placeholder="(123) 456-7890"
                  {...register("phone")}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md p-2 border bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              {errors.phone && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone.message}</p>}
            </div>

            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label htmlFor="reservationDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Date
                </label>
                <div className="mt-1">
                  <Controller
                    control={control}
                    name="reservationDate"
                    render={({ field }) => (
                      <div className="relative">
                        <DatePicker
                          id="reservationDate"
                          selected={field.value ? new Date(field.value) : null}
                          onChange={(date) => field.onChange(date ? date.toISOString().split("T")[0] : "")}
                          dateFormat="yyyy-MM-dd"
                          minDate={new Date()}
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md p-2 pl-10 border bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                        <div className="absolute left-3 top-2 text-gray-400 dark:text-gray-500">
                          <Calendar size={16} />
                        </div>
                      </div>
                    )}
                  />
                </div>
                {errors.reservationDate && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.reservationDate.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="reservationTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Time
                </label>
                <div className="mt-1">
                  <Controller
                    control={control}
                    name="reservationTime"
                    render={({ field }) => {
                      // Convert HH:MM string to Date for the time picker
                      const timeAsDate = field.value
                        ? parse(field.value, "HH:mm", new Date())
                        : parse("19:00", "HH:mm", new Date())

                      return (
                        <div className="relative">
                          <DatePicker
                            selected={timeAsDate}
                            onChange={(date) => {
                              if (date) {
                                const formattedTime = format(date, "HH:mm")
                                field.onChange(formattedTime)
                              }
                            }}
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={30}
                            timeCaption="Time"
                            dateFormat="h:mm aa"
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md p-2 pl-10 border bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          />
                          <div className="absolute left-3 top-2 text-gray-400 dark:text-gray-500">
                            <Clock size={16} />
                          </div>
                        </div>
                      )
                    }}
                  />
                </div>
                {errors.reservationTime && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.reservationTime.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="partySize" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Party Size
              </label>
              <div className="mt-1">
                <input
                  id="partySize"
                  type="number"
                  min={1}
                  {...register("partySize")}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md p-2 border bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Number of people in the reservation</p>
              {errors.partySize && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.partySize.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Special Requests
              </label>
              <div className="mt-1">
                <textarea
                  id="specialRequests"
                  rows={3}
                  placeholder="Any dietary restrictions, seating preferences, or special occasions?"
                  {...register("specialRequests")}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md p-2 border bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Optional: Add any special requests for your reservation
              </p>
              {errors.specialRequests && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.specialRequests.message}</p>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              {idValue && (
                <Link
                  href={`/reservation/${idValue}`}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 transition-colors duration-200"
                >
                  Cancel
                </Link>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
