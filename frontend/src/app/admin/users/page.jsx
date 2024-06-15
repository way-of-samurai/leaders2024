import { currentUser } from "@/app/actions"
import { redirect } from "next/navigation"

export default async function Users() {
  const user = await currentUser()
  if (!user || user.role !== "admin") {
    redirect("/")
  }

  return (
    <main className="flex min-h-full flex-col justify-center items-center gap-4 p-24"></main>
  )
}
