"use client"

import { useMsal } from "@azure/msal-react"
import { LogOut } from "lucide-react"

export function LogoutButton() {
  const { instance } = useMsal()

  const handleLogout = () => {
    instance.logoutPopup({
      postLogoutRedirectUri: "/",
    })
  }

  return (
    <button
      onClick={handleLogout}
      className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 transition-colors duration-200"
    >
      <LogOut className="mr-2 h-4 w-4" />
      Sign Out
    </button>
  )
}
