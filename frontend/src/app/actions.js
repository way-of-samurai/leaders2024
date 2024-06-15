"use server"

import { apiUrl, s3Url } from "@/lib/config"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function generate(formData) {
  console.log("GENERATE CALLED")
  await new Promise((resolve) => setTimeout(resolve, 5000))
  return {
    url: "/big.png",
  }
  // const resp = await fetch(`${apiUrl}/generate`, {
  //   method: "POST",
  //   body: JSON.stringify({
  //     prompt: formData.get("prompt"),
  //     height: formData.get("height"),
  //     width: formData.get("width"),
  //   }),
  // }).then((res) => res.json())

  // return {
  //   url: resp["url"].replace(s3Url, `https://${domain}/images`),
  // }
}

export async function signIn(formData) {
  const resp = { status: 200, token: "1234567" }
  // const resp = await fetch(`${apiUrl}/sign_in`, {
  //   method: "POST",
  //   body: JSON.stringify({
  //     email: formData.get("email"),
  //     password: formData.get("password"),
  //   }),
  // }).then((res) => res.json())

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

export async function currentUser() {
  // const resp = await fetch(`${apiUrl}/current_user`, {
  //   method: "GET",
  // }).then((res) => res.json())

  // if (resp.status != 200) {
  //   return null

  // return resp

  if (!cookies().get("token")) return null

  return {
    username: "nitwof",
    role: "admin",
  }
}
