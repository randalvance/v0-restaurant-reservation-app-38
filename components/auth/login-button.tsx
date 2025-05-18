"use client"

import { useMsal } from "@azure/msal-react"
import { loginRequest } from "@/config/auth-config"
import { LogIn } from "lucide-react"

export function LoginButton() {
  const { instance } = useMsal()

  const handleLogin = () => {
    instance
      .loginPopup(loginRequest)
      .then((response) => {
        instance.setActiveAccount(response.account)
      })
      .catch((error) => {
        console.error("Login error:", error)
      })
  }

  return (
    <button
      onClick={handleLogin}
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 transition-colors duration-200"
    >
      <LogIn className="mr-2 h-4 w-4" />
      Sign In
    </button>
  )
}
