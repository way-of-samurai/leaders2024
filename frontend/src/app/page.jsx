import { getClients } from "@/app/actions"
import GeneratePanel from "@/components/generate-panel"
import { isAuthenticated } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function Home() {
  if (!(await isAuthenticated())) {
    redirect("/sign_in")
  }

  const clients = await getClients()
  console.log(clients)

  return (
    <main className="flex-grow py-2">
      <GeneratePanel clients={clients} />
    </main>
  )
}
