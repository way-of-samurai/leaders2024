import { ThemeSwitcher } from "./theme-switcher"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { LogIn, LogOut } from "lucide-react"

export default function Header({ user }) {
  return (
    <div className="w-full h-14 min-w-screen flex flex-row flex-wrap items-center justify-between px-2">
      <Navbar />
      <div className="h-full flex flex-row flex-nowrap items-center gap-2">
        {user ? (
          <Button>
            <LogOut className="mr-2 h-4 w-4" />
            Выйти
          </Button>
        ) : (
          <Button>
            <LogIn className="mr-2 h-4 w-4" />
            Войти
          </Button>
        )}
        <ThemeSwitcher />
      </div>
    </div>
  )
}
