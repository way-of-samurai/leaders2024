import GeneratePanel from "@/components/generate-panel"
import { isAuthenticated } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function Home() {
  if (!(await isAuthenticated())) {
    redirect("/sign_in")
  }

  return (
    <main className="flex-grow py-2">
      <GeneratePanel />
    </main>
  )
}
