import { Moon, Sun } from "lucide-react"
import { useTheme } from "../theme-provider"

export default function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <button
      className="rounded-full border p-2 [&_svg]:size-3.5"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? <Sun /> : <Moon />}
    </button>
  )
}
