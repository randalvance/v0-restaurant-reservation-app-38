"use client"

import { useAuthEvents } from "@/contexts/auth-provider"
import { LoginButton } from "./login-button"
import { LogoutButton } from "./logout-button"
import { UserProfile } from "./user-profile"

export function AuthStatus() {
  const { isAuthenticated } = useAuthEvents()

  return (
    <div className="flex items-center space-x-4">
      {isAuthenticated ? (
        <>
          <UserProfile />
          <LogoutButton />
        </>
      ) : (
        <LoginButton />
      )}
    </div>
  )
}
