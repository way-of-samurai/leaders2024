"use server"

import {
  generate as apiGenerate,
  getClients as apiGetClients,
  login,
  setClient,
} from "@/lib/api"
import { authToken, isAuthenticated } from "@/lib/auth"
import { unstable_noStore as noStore } from "next/cache"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const backgorundColors = [
  "#345dd4",
  "#4a3d9b",
  "#4e76fc",
  "#5a4bb4",
  "#60b5ff",
  "#61b5fe",
  "#7463e2",
  "#7c45a3",
  "#82b6ff",
  "#8d8d9c",
  "#9b3d93",
  "#a35fd5",
  "#a5304e",
  "#baf77e",
  "#bdd7fe",
  "#c4e1f4",
  "#c53a55",
  "#ca4fc1",
  "#d0d9e4",
  "#d4b9d5",
  "#e4dace",
  "#e8f5ff",
  "#ebe0e4",
  "#f0b7cb",
  "#fe613f",
  "#fec5ad",
  "#ff4c63",
  "#ffcbac",
  "#fff6e0",
  "#ffffff",
]

export async function generate(values) {
  noStore()

  if (!isAuthenticated()) {
    redirect("/sign_in")
  }

  console.log(values)
  const data = await apiGenerate(await authToken(), {
    prompt: values.prompt,
    height: 512,
    width: 512,
    client_id: values.client_id,
    product_features: values.features,
  })

  if (!data) {
    return {
      error: "Something went wrong...",
    }
  }

  return {
    ...data,
    width: 512,
    height: 512,
    background:
      backgorundColors[Math.floor(Math.random() * backgorundColors.length)],
  }
}

export async function signIn(formData) {
  noStore()

  const data = await login({
    username: formData.get("username"),
    password: formData.get("password"),
  })

  if (!data) {
    return {
      error: "Invalid email or password",
    }
  }

  cookies().set("token", data.token, { secure: true })
  redirect("/")
}

export async function signOut() {
  cookies().delete("token")
  redirect("/sign_in")
}

export async function getClients() {
  return await apiGetClients(await authToken())
}

export async function createClient({ features }) {
  return await setClient(await authToken(), {
    features: features,
  })
}

export async function updateClient(id, { features }) {
  return await setClient(await authToken(), {
    id: id,
    features: features,
  })
}
