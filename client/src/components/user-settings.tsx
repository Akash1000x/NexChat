import { Link, useNavigate } from "@tanstack/react-router"
import { CustomAlertDialog } from "./custom-ui/custom-alert"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { SidebarMenuButton } from "./ui/sidebar"
import { authClient } from "@/lib/auth-clients"
import { LogIn, LogOut, Github } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import ThemeToggle from "./ui/theme-toggle"

export default function UserSettings() {
  const navigate = useNavigate()
  const { data: session } = authClient.useSession()
  return (
    <div>
      {session?.session ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              variant={"outline"}
              className="justify-start py-6"
            >
              <div className="flex items-center space-x-4 capitalize">
                <Avatar>
                  <AvatarFallback>
                    {session?.user?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="truncate text-lg">
                  {session?.user?.name}
                </span>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="start">
            <DropdownMenuLabel>
              <span className="truncate text-lg">
                {session?.user?.name}
              </span></DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="px-2 py-2">
              <ThemeToggle />
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a
                href="https://github.com/Akash1000x/NexChat"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center cursor-pointer"
              >
                <Github className="mr-2 h-4 w-4" />
                <span>Code</span>
              </a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <CustomAlertDialog
              trigger={
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              }
              title="Sign Out"
              description="Are you sure you want to sign out?"
              variant={"destructive"}
              onConfirm={async () => {
                await authClient.signOut()
                navigate({
                  to: "/",
                  replace: true,
                  reloadDocument: true,
                })
              }}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <SidebarMenuButton
          variant={"outline"}
          className="justify-center py-6"
          asChild
        >
          <Link to="/auth/sign-in" className="space-x-4">
            <LogIn />
            <span>Login</span>
          </Link>
        </SidebarMenuButton>
      )}
    </div>
  )
}