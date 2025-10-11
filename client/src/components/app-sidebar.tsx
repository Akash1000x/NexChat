import { Loader2, Plus, Trash2 } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import type { ThreadType } from "@/types/threads"
import { useGetThreads } from "@/hooks/api/get-threads"
import { Link } from "@tanstack/react-router"
import { Button } from "./ui/button"
import { CustomAlertDialog } from "./ui/alert-dialog"
import { deleteConversation } from "@/hooks/api/delete-conversation"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"

export default function AppSidebar() {
  const { isLoading, data } = useGetThreads(0)
  const queryClient = useQueryClient()
  if (isLoading) {
    return <Loader2 className="animate-spin text-blue-500" />
  }

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                variant={"outline"}
                className="justify-center"
                asChild
              >
                <Link to="/">
                  New Chat <Plus />
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Chats</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data?.map((item: ThreadType, i: number) => (
                <SidebarMenuItem key={i}>
                  <SidebarMenuButton className="text-nowrap relative" asChild>
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
                          onConfirm={async () => {
                            await deleteConversation(item.threadId)
                            toast.success("Thread deleted successfully")
                            queryClient.invalidateQueries({
                              queryKey: ["threads"],
                            })
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
    </Sidebar>
  )
}
