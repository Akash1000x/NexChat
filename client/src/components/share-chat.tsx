import {
  useShareConversation,
  useUnshareConversation,
} from "@/hooks/api/share-conversation"
import { useParams } from "@tanstack/react-router"
import { Share, Copy, Trash2, Check } from "lucide-react"
import { Dialog, DialogClose, DialogTrigger } from "./ui/dialog"
import { DialogContent } from "./ui/dialog"
import { DialogHeader } from "./ui/dialog"
import { DialogTitle } from "./ui/dialog"
import { Button } from "./ui/button"
import useClipboard from "@/hooks/use-clipboard"
import { DialogDescription } from "@radix-ui/react-dialog"
import React from "react"

export default function ShareChat() {
  const { id } = useParams({ from: "/chat/$id", shouldThrow: false }) || {}
  const shareConversationMutation = useShareConversation()
  const unshareConversationMutation = useUnshareConversation()
  const { copied, handleCopy } = useClipboard()
  const [shared, setShared] = React.useState(false)
  const [title, setTitle] = React.useState("")

  const shareUrl = `${import.meta.env.VITE_APP_URL}/share/${id}`

  const handleShareConversation = () => {
    const element = document.querySelector(`a[data-conversation-id="${id}"]`)
    if (element) {
      const isShared =
        element.getAttribute("data-shared") === "true" ? true : false
      const title = element.getAttribute("data-title") ?? ""
      console.log(element)
      setShared(isShared)
      setTitle(title)

      if (id && !isShared) {
        shareConversationMutation.mutate({
          conversationId: id,
        })
        element.setAttribute("data-shared", "true")
        setShared(true)
      }
    }
  }

  const handleUnshareConversation = () => {
    if (id && shared) {
      unshareConversationMutation.mutate({
        conversationId: id,
      })
      setShared(false)
      setTitle("")
      document
        .querySelector(`a[data-conversation-id="${id}"]`)
        ?.setAttribute("data-shared", "false")
    }
  }

  const handleCopyLink = () => {
    handleCopy(shareUrl)
  }

  if (!id) return null

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          title="Share Conversation"
          onClick={handleShareConversation}
        >
          <Share />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share "{title || "Untitled"}"</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-2 p-3 bg-muted rounded-md justify-between">
            <p className="flex-1 text-sm truncate max-w-xs md:max-w-sm">
              {shareUrl}
            </p>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCopyLink}
              className="shrink-0"
            >
              {copied ? (
                <Check className="size-4" />
              ) : (
                <Copy className="size-4" />
              )}
            </Button>
          </div>
          <div className="flex gap-2 pt-2">
            <DialogClose asChild>
              <Button
                variant="destructive"
                onClick={handleUnshareConversation}
                className="flex-1"
              >
                <Trash2 className="size-4 mr-2" />
                Delete
              </Button>
            </DialogClose>
            <Button
              variant="default"
              onClick={handleCopyLink}
              className="flex-1"
            >
              {copied ? (
                <Check className="size-4 mr-2" />
              ) : (
                <Copy className="size-4 mr-2" />
              )}
              Copy Link
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
