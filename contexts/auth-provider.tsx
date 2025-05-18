"use client"

import { type ReactNode, useEffect, useState } from "react"
import { MsalProvider, useMsal } from "@azure/msal-react"
import { PublicClientApplication, EventType, type EventMessage, type AuthenticationResult } from "@azure/msal-browser"
import { msalConfig } from "@/config/auth-config"

// Initialize MSAL instance
const msalInstance = new PublicClientApplication(msalConfig)

// Optional - This will update account state if a user signs in from another tab or window
msalInstance.enableAccountStorageEvents()

// Register Redirect Handler
msalInstance
  .handleRedirectPromise()
  .then((response) => {
    // Handle redirect response if any
  })
  .catch((error) => {
    console.error("Redirect error:", error)
  })

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  return <MsalProvider instance={msalInstance}>{children}</MsalProvider>
}

// Custom hook to handle auth events
export function useAuthEvents() {
  const { instance } = useMsal()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  useEffect(() => {
    const callbackId = instance.addEventCallback((event: EventMessage) => {
      if (event.eventType === EventType.LOGIN_SUCCESS) {
        const result = event.payload as AuthenticationResult
        instance.setActiveAccount(result.account)
        setIsAuthenticated(true)
      }

      if (event.eventType === EventType.LOGOUT_SUCCESS) {
        setIsAuthenticated(false)
      }

      if (event.eventType === EventType.HANDLE_REDIRECT_END) {
        const currentAccounts = instance.getAllAccounts()
        if (currentAccounts.length > 0) {
          instance.setActiveAccount(currentAccounts[0])
          setIsAuthenticated(true)
        }
      }
    })

    // Check if user is already signed in
    const accounts = instance.getAllAccounts()
    if (accounts.length > 0) {
      instance.setActiveAccount(accounts[0])
      setIsAuthenticated(true)
    }

    return () => {
      if (callbackId) {
        instance.removeEventCallback(callbackId)
      }
    }
  }, [instance])

  return { isAuthenticated }
}
