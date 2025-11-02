import { Loader2, LogIn, LogOut, Plus, Search, Trash2 } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import type { ThreadType } from "@/types/threads"
import { useGetThreads, useSearchThreads } from "@/hooks/api/get-threads"
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
} from "@tanstack/react-router"
import { Button } from "./ui/button"
import { CustomAlertDialog } from "./custom-ui/custom-alert"
import { useDeleteConversationMutation } from "@/hooks/api/delete-conversation"
import { cn } from "@/lib/utils"
import { authClient } from "@/lib/auth-clients"
import { Avatar, AvatarFallback } from "./ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { useState } from "react"
import SearchInput from "./search-input"
import { Body } from "./ui/typography"

export default function AppSidebar() {
  const params = useParams({ from: "/chat/$id", shouldThrow: false })
  const navigate = useNavigate({ from: "/chat/$id" })
  const location = useLocation()
  const { data: session } = authClient.useSession()
  const [isOpen, setIsOpen] = useState(false)
  const { data } = useGetThreads(0, session?.session?.userId || "")
  const { state } = useSidebar()
  const deleteConversationMutation = useDeleteConversationMutation()
  const [search, setSearch] = useState("")
  const { data: searchThreads, isLoading: isLoadingSearchThreads } =
    useSearchThreads(search)

  const handleOpen = () => setIsOpen(true)
  const handleClose = () => setIsOpen(false)

  const handleSearch = (search: string) => {
    setSearch(search)
  }

  if (location.pathname.includes("/auth")) {
    return null
  }

  return (
    <>
      <div
        data-state={state}
        className={cn("fixed top-1.5 left-1.5 z-50 group")}
      >
        <div className="flex items-center transition-all group-data-[state=collapsed]:delay-300 group-data-[state=expanded]:delay-0 group-data-[state=collapsed]:border rounded-md p-1">
          <SidebarTrigger />
          <Button
            variant={"ghost"}
            size={"icon-sm"}
            onClick={handleOpen}
            className="invisible transition-[visibility,opacity] group-data-[state=collapsed]:delay-300 group-data-[state=expanded]:delay-0 group-data-[state=collapsed]:visible"
          >
            <Search />
          </Button>
          <Button
            variant={"ghost"}
            size={"icon-sm"}
            disabled={location.pathname === "/"}
            onClick={() => {
              navigate({
                to: "/",
              })
            }}
            className="invisible transition-[visibility,opacity] group-data-[state=collapsed]:delay-300 group-data-[state=expanded]:delay-0 group-data-[state=collapsed]:visible"
          >
            <Plus />
          </Button>
        </div>
      </div>
      <Sidebar>
        <SidebarHeader className="gap-4">
          <div className="flex items-center justify-between">
            <div className="size-8"></div>
            <h1 className="text-2xl font-bold text-center">AI Chat</h1>
            <Button variant={"ghost"} size={"icon-sm"} onClick={handleOpen}>
              <Search />
            </Button>
          </div>
          <Button className="py-5 text-lg font-semibold" asChild>
            <Link to="/">
              New Chat <Plus />
            </Link>
          </Button>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            {data && <SidebarGroupLabel>Chats</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {data?.map((item: ThreadType, i: number) => (
                  <SidebarMenuItem key={i}>
                    <SidebarMenuButton
                      className={cn(
                        "text-nowrap relative",
                        item.threadId === params?.id && "bg-sidebar-accent",
                      )}
                      asChild
                    >
                      <Link to="/chat/$id" params={{ id: item.threadId }}>
                        <span>{item.title}</span>
                        <span
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                          }}
                          className="w-20 z-50 flex justify-end absolute -right-20 bg-gradient-to-r from-black/0 to-accent opacity-0 group-hover/menu-item:opacity-100 group-hover/menu-item:-right-0 transition-all duration-200"
                        >
                          <CustomAlertDialog
                            trigger={
                              <Button variant={"ghost"} size={"icon-sm"}>
                                <Trash2 className="size-3" />
                              </Button>
                            }
                            title="Delete Thread"
                            description={`Are you sure you want to delete "${item.title}"? This action cannot be undone.`}
                            variant="destructive"
                            onConfirm={async () => {
                              await deleteConversationMutation.mutateAsync({
                                threadId: item.threadId,
                              })
                              if (item.threadId === params?.id) {
                                navigate({
                                  to: "/",
                                })
                              }
                            }}
                          />
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              {session?.session ? (
                <SidebarMenuButton
                  asChild
                  variant={"outline"}
                  className="justify-between py-6"
                >
                  <div className="space-x-4 capitalize">
                    <Avatar>
                      <AvatarFallback>
                        {session?.user?.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate text-lg">
                      {session?.user?.name}
                    </span>
                    <CustomAlertDialog
                      trigger={
                        <Button
                          variant={"destructive"}
                          size={"icon-sm"}
                          title="Sign Out"
                        >
                          <LogOut />
                        </Button>
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
                  </div>
                </SidebarMenuButton>
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
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader className="border-b pb-2">
            <SearchInput onSearch={handleSearch} />
            <DialogTitle className="hidden"></DialogTitle>
            <DialogDescription className="hidden"></DialogDescription>
          </DialogHeader>
          <div className="max-h-[calc(100vh-15rem)] overflow-y-auto space-y-1">
            {isLoadingSearchThreads ? (
              <Body className="text-center text-sm text-muted-foreground flex items-center justify-center h-full">
                <Loader2 className="size-4 animate-spin" />
              </Body>
            ) : search ? (
              searchThreads && searchThreads?.length > 0 ? (
                searchThreads?.map((thread: ThreadType) => (
                  <Link
                    key={thread.threadId}
                    to="/chat/$id"
                    onClick={handleClose}
                    params={{ id: thread.threadId }}
                    className="block px-2 py-1 hover:bg-sidebar-accent rounded-md"
                  >
                    <Body>{thread.title}</Body>
                  </Link>
                ))
              ) : (
                <Body className="text-center text-sm text-muted-foreground">
                  No results found
                </Body>
              )
            ) : (
              data?.map((thread: ThreadType) => (
                <Link
                  key={thread.threadId}
                  to="/chat/$id"
                  onClick={handleClose}
                  params={{ id: thread.threadId }}
                  className="block px-2 py-1 hover:bg-sidebar-accent hover:rounded-md border-b last:border-b-0"
                >
                  <Body>{thread.title}</Body>
                </Link>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
