import { Moon, Sun } from "lucide-react"
import { useTheme } from "../theme-provider"
import { cn } from "@/lib/utils"

export default function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <div
      className="flex items-center gap-2"
    >
      <span>Theme: </span>
      <div className="relative flex items-center rounded-full border gap-1">
        {/* Animated background slider */}
        <div
          className={cn(
            "absolute h-full w-1/2 rounded-full bg-accent transition-all duration-300 ease-in-out border",
            theme === "light" ? "left-0" : "left-1/2"
          )}
        />

        {/* Sun icon button */}
        <div
          className={cn(
            "relative z-10 p-1 px-2 rounded-full text-foreground cursor-pointer transition-all duration-300",
            theme === "light" ? "text-foreground" : "hover:bg-accent/30"
          )}
          onClick={() => setTheme("light")}
        >
          <Sun className={cn(
            "size-4 transition-transform duration-300",
            theme === "light" && "rotate-180"
          )} />
        </div>

        {/* Moon icon button */}
        <div
          className={cn(
            "relative z-10 p-1 px-2 rounded-full text-foreground cursor-pointer transition-all duration-300",
            theme === "dark" ? "text-foreground" : "hover:bg-accent/30"
          )}
          onClick={() => setTheme("dark")}
        >
          <Moon className={cn(
            "size-4 transition-transform duration-300",
            theme === "dark" && "rotate-270"
          )} />
        </div>
      </div>
    </div>
  )
}
