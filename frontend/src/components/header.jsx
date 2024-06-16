import Navbar from "@/components/navbar"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { Button } from "@/components/ui/button"
import UserMenu from "@/components/user-menu"
import { currentUser } from "@/lib/auth"
import { LogIn } from "lucide-react"
import Link from "next/link"

export default async function Header() {
  const user = await currentUser()

  return (
    <div className="w-full h-14 min-w-screen flex flex-row flex-wrap items-center justify-between px-2">
      <Navbar user={user} />
      <div className="h-full flex flex-row flex-nowrap items-center gap-2">
        {user ? (
          <UserMenu user={user} />
        ) : (
          <Button asChild>
            <Link href="/sign_in">
              <LogIn className="mr-2 h-4 w-4" />
              Войти
            </Link>
          </Button>
        )}
        <ThemeSwitcher />
      </div>
    </div>
  )
}
