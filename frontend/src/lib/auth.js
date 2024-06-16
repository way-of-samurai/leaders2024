"use server"

import { currentUser as apiCurrentUser } from "@/lib/api"
import { cookies } from "next/headers"

export async function authToken() {
  return cookies().get("token")?.value || null
}

export async function currentUser() {
  const token = await authToken()
  if (!token) {
    return null
  }

  return await apiCurrentUser(token)
}

export async function isAuthenticated() {
  const user = await currentUser()
  return user != null
}

export async function isAuthenticatedAdmin() {
  const user = await currentUser()
  return user != null && user.role === "admin"
}
