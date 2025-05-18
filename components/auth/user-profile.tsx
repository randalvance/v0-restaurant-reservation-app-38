"use client"

import { useState, useEffect } from "react"
import { useMsal } from "@azure/msal-react"
import { graphConfig } from "@/config/auth-config"
import { User } from "lucide-react"

interface UserProfileProps {
  className?: string
}

interface GraphResponse {
  displayName?: string
  mail?: string
  userPrincipalName?: string
  id?: string
}

export function UserProfile({ className = "" }: UserProfileProps) {
  const { instance, accounts } = useMsal()
  const [userData, setUserData] = useState<GraphResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (accounts.length > 0) {
      const account = accounts[0]
      instance
        .acquireTokenSilent({
          scopes: ["User.Read"],
          account: account,
        })
        .then((response) => {
          fetchUserProfile(response.accessToken)
        })
        .catch((error) => {
          console.error("Token acquisition failed", error)
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
    }
  }, [instance, accounts])

  const fetchUserProfile = async (accessToken: string) => {
    try {
      const response = await fetch(graphConfig.graphMeEndpoint, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (response.ok) {
        const data: GraphResponse = await response.json()
        setUserData(data)
      } else {
        console.error("Graph API returned an error", await response.text())
      }
    } catch (error) {
      console.error("Error fetching user profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className={`flex items-center ${className}`}>
        <div className="animate-pulse flex space-x-2 items-center">
          <div className="rounded-full bg-gray-300 dark:bg-gray-600 h-8 w-8"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
        </div>
      </div>
    )
  }

  if (!userData) {
    return null
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
        <User className="h-4 w-4" />
      </div>
      <div className="text-sm">
        <p className="font-medium text-gray-900 dark:text-white">{userData.displayName}</p>
        <p className="text-gray-500 dark:text-gray-400 text-xs">{userData.mail || userData.userPrincipalName}</p>
      </div>
    </div>
  )
}
