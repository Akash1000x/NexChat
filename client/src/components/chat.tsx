import Markdown from "@/components/markdown"
import PromptInput from "@/components/prompt-input"
import { Body } from "@/components/ui/typography"
import { useGetMessage } from "@/hooks/api/messages"
import useClipboard from "@/hooks/use-clipboard"
import type { MessageType } from "@/types/messages"
import type { Model } from "@/types/models"
import React, { useEffect } from "react"
import CopyToClipboard from "./copy-to-clipboard"
import { authClient } from "@/lib/auth-clients"
import { useLocation, useNavigate } from "@tanstack/react-router"
import { useQueryClient } from "@tanstack/react-query"
import { Skeleton } from "./ui/skeleton"
import SuggestionQueue from "./ui/suggestion-que"
import { toast } from "sonner"
import { useGetModels } from "@/hooks/api/models"
import { startNewConversation } from "@/hooks/api/conversations"
import { ArrowDown } from "lucide-react"
import { cn } from "@/lib/utils"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

type EventData = {
  type: string
  message?: string
  time?: string
}

export default function Chat({ conversationId }: { conversationId?: string }) {
  const { data: queryData, error } = useGetMessage(conversationId)
  const { data: models } = useGetModels()
  const { copied, handleCopy } = useClipboard()
  const [aiResponse, setAiResponse] = React.useState<string>("")
  const [messages, setMessages] = React.useState<MessageType[]>([])
  const chatRef = React.useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()
  const [waitingForAiResponse, setWaitingForAiResponse] =
    React.useState<boolean>(false)
  const { data: session } = authClient.useSession()
  const location = useLocation()
  const [message, setMessage] = React.useState<string>("")
  const [isAtBottom, setIsAtBottom] = React.useState<boolean>(true)

  const navigate = useNavigate({ from: "/" })

  React.useEffect(() => {
    queryData && setMessages(queryData)
  }, [queryData])

  const scrollToBottom = (behavior: ScrollBehavior) => {
    chatRef.current?.scrollTo({
      top: chatRef.current?.scrollHeight,
      behavior,
    })
  }

  useEffect(() => {
    scrollToBottom("instant")
  }, [messages, aiResponse])

  useEffect(() => {
    const chatElement = chatRef.current
    if (!chatElement) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = chatElement
      // Check if user is within 50px of the bottom
      const isBottom = scrollHeight - scrollTop - clientHeight < 50
      setIsAtBottom(isBottom)
    }

    chatElement.addEventListener("scroll", handleScroll)
    // Check initial state
    handleScroll()

    return () => chatElement.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSelectQuestion = (question: string) => {
    setMessage(question)
  }

  const handleSubmit = async (promptData: {
    message: string
    model: Model
  }) => {
    if (!session?.session) {
      navigate({
        to: "/auth/sign-in",
      })
      return
    }
    setWaitingForAiResponse(true)
    let activeConversationId = conversationId
    let isNewConversation = false

    if (!conversationId) {
      const { id }: { id: string; title: string } = await startNewConversation()
      activeConversationId = id
      isNewConversation = true

      queryClient.invalidateQueries({ queryKey: ["conversations"] })
    }

    setMessages((prev) => [
      ...prev,
      {
        id: "",
        role: "user",
        parts: [{ type: "text", text: promptData.message }],
        model: promptData.model.slug,
      },
    ])

    const body = {
      conversationId: activeConversationId,
      messages: messages,
      prompt: promptData.message,
      preferences: localStorage.getItem("customInstructions") || "",
      model: promptData.model,
      newConversation: isNewConversation,
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        },
        credentials: "include",
        body: JSON.stringify(body),
      })
      setWaitingForAiResponse(false)
      if (!res.body) {
        throw new Error("Stream is not working")
      }
      if (res.status !== 200) {
        setMessages((prev) => prev.filter((message) => message.id !== ""))
        throw new Error(
          (await res.json()).error?.message || "Something went wrong",
        )
      }
      const reader = res.body.pipeThrough(new TextDecoderStream()).getReader()

      let fullResponse = ""
      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          // console.log("DONE")
          break
        }
        const lines = value.split("\n")
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const json = line.replace("data: ", "").trim()
            if (json === "[DONE]") {
              // console.log("DONE")
              break
            }
            try {
              const parsed: EventData = JSON.parse(json)
              if (parsed.type === "finish") {
                // console.log("DONE")
                break
              }
              fullResponse += parsed.message
              setAiResponse((prev) => prev + (parsed.message ?? ""))
            } catch (err) {
              console.error("Invalid JSON:", json)
            }
          }
        }
      }
      setMessages((prev) => [
        ...prev,
        {
          id: "",
          role: "assistant",
          parts: [
            {
              type: "text",
              text: fullResponse,
            },
          ],
          model: promptData.model.slug,
        },
      ])
      setAiResponse("")

      if (isNewConversation && activeConversationId) {
        navigate({
          to: "/chat/$id",
          params: { id: activeConversationId },
          replace: true,
        })
        queryClient.invalidateQueries({ queryKey: ["conversations"] })
      }
    } catch (error: any) {
      console.error(error)
      toast.error(error?.message || "Something went wrong")
    } finally {
      setWaitingForAiResponse(false)
    }
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div className="w-full relative h-screen overflow-hidden pt-10">
      <div className="h-full overflow-auto pb-48" ref={chatRef}>
        {location.pathname === "/" && !aiResponse && !waitingForAiResponse ? (
          !message && (
            <SuggestionQueue onSelectQuestion={handleSelectQuestion} />
          )
        ) : (
          <div className="space-y-10 lg:w-3xl w-xl mx-auto px-3">
            {messages?.map((message, i) => (
              <div key={`${message.id + i}`} className="">
                {message.role === "user" ? (
                  <div className="group">
                    <Body className="p-4 bg-muted rounded-md max-w-xl ml-auto text-justify">
                      {message.parts[0].text}
                    </Body>
                    <div className="flex justify-end items-center p-2 h-12 opacity-0 invisible transition-all duration-300 group-hover:opacity-100 group-hover:visible">
                      <CopyToClipboard
                        copied={copied}
                        onClick={() => handleCopy(message.parts[0].text)}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="group leading-8">
                    <Markdown message={message.parts[0].text} />
                    <div className="flex justify-start items-center p-2 h-12 gap-2 opacity-0 invisible transition-all duration-300 group-hover:opacity-100 group-hover:visible">
                      <CopyToClipboard
                        copied={copied}
                        onClick={() => handleCopy(message.parts[0].text)}
                      />
                      <Body>
                        {
                          models
                            ?.find((category) =>
                              category.models.find(
                                (m) => m.slug === message.model,
                              ),
                            )
                            ?.models.find((m) => m.slug === message.model)?.name
                        }
                      </Body>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {waitingForAiResponse && (
              <div className="flex gap-2">
                <Skeleton className="size-3" />
                <Skeleton className="size-3" />
                <Skeleton className="size-3" />
              </div>
            )}
            {aiResponse && (
              <div className="group leading-8">
                <Markdown message={aiResponse} />
              </div>
            )}
          </div>
        )}
        <div
          className={cn(
            "absolute bottom-36 right-1/2 -translate-x-1/2 bg-accent border shadow-sm rounded-full p-2 hover:bg-accent/80 hover:text-accent-foreground transition-all duration-300 cursor-pointer",
            isAtBottom ? "opacity-0 invisible" : "opacity-100 visible",
          )}
          onClick={() => scrollToBottom("smooth")}
        >
          <ArrowDown className="size-4" />
        </div>
      </div>
      <PromptInput
        onSubmit={handleSubmit}
        message={message}
        setMessage={setMessage}
        models={models || []}
        disabled={!!aiResponse || waitingForAiResponse}
      />
    </div>
  )
}
