import { currentUser } from "@/app/actions"
import SignInForm from "@/components/sign-in-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { redirect } from "next/navigation"

export default async function SignIn() {
  const user = await currentUser()
  if (user) {
    redirect("/")
  }

  return (
    <main className="flex min-h-full flex-col justify-center items-center gap-4 p-24">
      <Card className="max-w-full w-[450px]">
        <CardHeader>
          <CardTitle>Вход</CardTitle>
        </CardHeader>
        <CardContent>
          <SignInForm />
        </CardContent>
      </Card>
    </main>
  )
}
