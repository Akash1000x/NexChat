import { Loader2, Plus, Search, Trash2 } from "lucide-react"

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
  SidebarMenuSkeleton,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import type { ConversationType } from "@/types/conversations"
import {
  useDeleteConversationMutation,
  useGetConversations,
  useSearchConversations,
} from "@/hooks/api/conversations"
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
} from "@tanstack/react-router"
import { Button } from "./ui/button"
import { CustomAlertDialog } from "./custom-ui/custom-alert"
import { cn } from "@/lib/utils"
import { authClient } from "@/lib/auth-clients"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { useEffect, useRef, useState } from "react"
import SearchInput from "./search-input"
import { Body } from "./ui/typography"
import UserSettings from "./user-settings"

export default function AppSidebar() {
  const params = useParams({ from: "/chat/$id", shouldThrow: false })
  const navigate = useNavigate({ from: "/chat/$id" })
  const location = useLocation()
  const { data: session } = authClient.useSession()
  const [isOpen, setIsOpen] = useState(false)
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetConversations(session?.session?.userId || "")
  const { state } = useSidebar()
  const deleteConversationMutation = useDeleteConversationMutation()
  const [search, setSearch] = useState("")
  const { data: searchConversations, isLoading: isLoadingSearchConversations } =
    useSearchConversations(search)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  const handleOpen = () => setIsOpen(true)
  const handleClose = () => setIsOpen(false)

  const handleSearch = (search: string) => {
    setSearch(search)
  }

  const conversations = data?.pages.flatMap((page) => page) || []

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0]
        if (first.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 1 },
    )

    const currentRef = loadMoreRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

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
            <h1 className="text-2xl font-bold text-center">
              <Link to="/">NexChat</Link>
            </h1>
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
            {conversations.length > 0 && (
              <SidebarGroupLabel>Chats</SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {conversations.map((item: ConversationType, i: number) => (
                  <SidebarMenuItem key={i}>
                    <SidebarMenuButton
                      className={cn(
                        "relative overflow-hidden group/menu-item",
                        item.conversationId === params?.id &&
                          "bg-sidebar-accent",
                      )}
                      asChild
                    >
                      <Link
                        to="/chat/$id"
                        params={{ id: item.conversationId }}
                        data-shared={item.shared}
                        data-title={item.title}
                        data-conversation-id={item.conversationId}
                        className="flex items-center relative w-full"
                      >
                        <span className="truncate flex-1 min-w-0 pr-8 block relative z-0">
                          {item.title}
                        </span>
                        <span
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                          }}
                          onMouseDown={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                          }}
                          className="absolute right-0 top-0 h-full w-8 flex items-center justify-center z-10 opacity-0 pointer-events-none group-hover/menu-item:opacity-100 group-hover/menu-item:pointer-events-auto transition-opacity duration-200"
                        >
                          <CustomAlertDialog
                            trigger={
                              <Button variant={"ghost"} size={"icon-sm"}>
                                <Trash2 className="size-3" />
                              </Button>
                            }
                            title="Delete Conversation"
                            description={`Are you sure you want to delete "${item.title}"? This action cannot be undone.`}
                            variant="destructive"
                            onConfirm={async () => {
                              await deleteConversationMutation.mutateAsync({
                                conversationId: item.conversationId,
                              })
                              if (item.conversationId === params?.id) {
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
                <div ref={loadMoreRef} className="py-2 text-center">
                  {hasNextPage && (
                    <>
                      <SidebarMenuSkeleton />
                      <SidebarMenuSkeleton />
                      <SidebarMenuSkeleton />
                    </>
                  )}
                </div>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <UserSettings />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="p-3">
          <DialogHeader className="border-b pb-2">
            <SearchInput onSearch={handleSearch} />
            <DialogTitle className="hidden"></DialogTitle>
            <DialogDescription className="hidden"></DialogDescription>
          </DialogHeader>
          <div className="max-h-[calc(100vh-15rem)] overflow-y-auto space-y-1">
            {isLoadingSearchConversations ? (
              <Body className="text-center text-sm text-muted-foreground flex items-center justify-center h-full">
                <Loader2 className="size-4 animate-spin" />
              </Body>
            ) : search ? (
              searchConversations && searchConversations?.length > 0 ? (
                searchConversations?.map((conversation: ConversationType) => (
                  <Link
                    key={conversation.conversationId}
                    to="/chat/$id"
                    onClick={handleClose}
                    params={{ id: conversation.conversationId }}
                    className="block px-2 py-1 hover:bg-sidebar-accent rounded-md"
                  >
                    <Body>{conversation.title}</Body>
                  </Link>
                ))
              ) : (
                <Body className="text-center text-sm text-muted-foreground">
                  No results found
                </Body>
              )
            ) : (
              conversations.map((conversation: ConversationType) => (
                <Link
                  key={conversation.conversationId}
                  to="/chat/$id"
                  onClick={handleClose}
                  params={{ id: conversation.conversationId }}
                  className="block px-2 py-1 hover:bg-sidebar-accent hover:rounded-md border-b last:border-b-0"
                >
                  <Body>{conversation.title}</Body>
                </Link>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
