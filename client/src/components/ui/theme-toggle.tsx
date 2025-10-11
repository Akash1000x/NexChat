import { Moon, Sun } from "lucide-react"
import { useTheme } from "../theme-provider"

export default function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <button
      className="rounded-full absolute top-2 right-2 z-10 border p-3 [&_svg]:size-4"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? <Sun /> : <Moon />}
    </button>
  )
}
