"use server"

import { unstable_noStore as noStore } from "next/cache"

export async function currentUser() {
  noStore()
  // if (!cookies().get("token")) return null

  // return {
  //   username: "nitwof",
  //   role: "admin",
  // }

  const resp = await fetch(`${process.env.API_URL}/current_user`, {
    method: "GET",
  }).then((res) => res.json())

  if (resp.status != 200) {
    return null
  }

  return resp
}

export async function isAuthenticated() {
  const user = await currentUser()
  return user != null
}

export async function isAuthenticatedAdmin() {
  const user = await currentUser()
  return user != null && user.role === "admin"
}
