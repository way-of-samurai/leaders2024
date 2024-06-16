import "./globals.css"
import Header from "@/components/header"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { Inter as FontSans } from "next/font/google"

const fontSans = FontSans({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
})

export const metadata = {
  title: "ЛЦТ 2024",
  description: "ЛЦТ 2024 Путь Самурая",
}

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col flex-nowrap">
            <Header />
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
