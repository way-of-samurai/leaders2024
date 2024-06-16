import { getClients } from "@/app/actions"
import { isAuthenticatedAdmin } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function History() {
  if (!(await isAuthenticatedAdmin())) {
    redirect("/")
  }

  const clients = await getClients()
  console.log(clients)

  return (
    <main className="flex min-h-full flex-col justify-center items-center gap-4 p-24"></main>
  )
}
