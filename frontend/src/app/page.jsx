import { currentUser } from "@/app/actions"
import GeneratePanel from "@/components/generate-panel"
import { redirect } from "next/navigation"

export default async function Home() {
  const user = await currentUser()
  if (!user) {
    redirect("/sign_in")
  }

  return (
    <main className="flex-grow py-2">
      <GeneratePanel />
    </main>
  )
}
