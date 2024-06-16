import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu-ssr"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { forwardRef } from "react"

const NavLink = forwardRef(({ className, children, href, ...props }, ref) => {
  return (
    <Link
      href={href}
      legacyBehavior
      passHref
    >
      <NavigationMenuLink
        ref={ref}
        className={cn(navigationMenuTriggerStyle(), className)}
        {...props}
      >
        {children}
      </NavigationMenuLink>
    </Link>
  )
})
NavLink.displayName = "NavLink"

export default function Navbar({ user }) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavLink href="/">Генерация</NavLink>
        </NavigationMenuItem>
        {user?.role === "admin" && (
          <>
            <NavigationMenuItem>
              <NavLink href="/admin/history">История</NavLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavLink href="/admin/settings">Настройки</NavLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavLink href="/admin/users">Пользователи</NavLink>
            </NavigationMenuItem>
          </>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
