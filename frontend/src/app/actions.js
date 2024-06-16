"use server"

import { isAuthenticated } from "@/lib/auth"
import { unstable_noStore as noStore } from "next/cache"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function generate(formData) {
  noStore()

  if (!isAuthenticated()) {
    redirect("/sign_in")
  }

  // await new Promise((resolve) => setTimeout(resolve, 2000))
  // return {
  //   url: "/small.png",
  //   background: "#c4abcb",
  //   width: 380,
  //   height: 380,
  // }
  const resp = await fetch(`${process.env.API_URL}/generate`, {
    method: "POST",
    body: JSON.stringify({
      prompt: formData.get("prompt"),
      height: formData.get("height"),
      width: formData.get("width"),
    }),
  }).then((res) => res.json())

  return {
    url: resp["url"].replace("s3:/", ""),
  }
}

export async function signIn(formData) {
  noStore()

  // const resp = { status: 200, token: "1234567" }
  const resp = await fetch(`${process.env.API_URL}/sign_in`, {
    method: "POST",
    body: JSON.stringify({
      email: formData.get("email"),
      password: formData.get("password"),
    }),
  }).then((res) => res.json())

  if (resp.status != 200) {
    return {
      error: "Invalid email or password",
    }
  }

  cookies().set("token", resp.token, { secure: true })
  redirect("/")
}

export async function signOut() {
  cookies().delete("token")
  redirect("/sign_in")
}
