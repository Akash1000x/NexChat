import Markdown from "@/components/markdown"
import PromptInput from "@/components/prompt-input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Body } from "@/components/ui/typography"
import { useGetMessage } from "@/hooks/api/get-messages"
import { useClipboard } from "@/hooks/useClipboard"
import type { MessageType } from "@/types/messages"
import type { Model } from "@/types/models"
import React, { useEffect } from "react"
import CopyToClipboard from "./copy-to-clipboard"
import { startNewConversation } from "@/hooks/api/new-conversation"
import { useNavigate } from "@tanstack/react-router"
import { useQueryClient } from "@tanstack/react-query"
import { Skeleton } from "./ui/skeleton"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

type EventData = {
  type: string
  message?: string
  time?: string
}

export default function Chat({ conversationId }: { conversationId?: string }) {
  const { data: queryData, error } = useGetMessage(conversationId)
  const { copied, handleCopy } = useClipboard()
  const [aiResponse, setAiResponse] = React.useState<string>("")
  const [messages, setMessages] = React.useState<MessageType[]>([])
  const chatRef = React.useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()
  const [waitingForAiResponse, setWaitingForAiResponse] =
    React.useState<boolean>(false)

  const navigate = useNavigate({ from: "/" })

  React.useEffect(() => {
    queryData && setMessages(queryData)
  }, [queryData])

  useEffect(() => {
    if (chatRef.current) {
      const scrollElement = chatRef.current.querySelector(
        "[data-radix-scroll-area-viewport]",
      )
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight
      }
    }
  }, [messages, aiResponse])

  const handleSubmit = async (promptData: {
    message: string
    model: Model
  }) => {
    setWaitingForAiResponse(true)
    let activeConversationId = conversationId
    let isNewConversation = false

    if (!conversationId) {
      const { id }: { id: string; title: string } = await startNewConversation()
      activeConversationId = id
      isNewConversation = true

      queryClient.invalidateQueries({ queryKey: ["threads"] })
    }

    setMessages((prev) => [
      ...prev,
      {
        id: "",
        role: "user",
        parts: [{ type: "text", text: promptData.message }],
      },
    ])

    const body = {
      threadId: activeConversationId,
      messages: messages,
      prompt: promptData.message,
      preferences: "Alaways give Javascript code in typescript",
      model: promptData.model,
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        },
        body: JSON.stringify(body),
      })
      setWaitingForAiResponse(false)
      if (!res.body) {
        throw new Error("Stream is not working")
      }
      const reader = res.body.pipeThrough(new TextDecoderStream()).getReader()

      let fullResponse = ""
      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          console.log("DONE")
          break
        }
        const lines = value.split("\n")
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const json = line.replace("data: ", "").trim()
            if (json === "[DONE]") {
              console.log("DONE")
              break
            }
            try {
              const parsed: EventData = JSON.parse(json)
              if (parsed.type === "finish") {
                console.log("DONE")
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
        },
      ])
      setAiResponse("")

      if (isNewConversation && activeConversationId) {
        navigate({
          to: "/chat/$id",
          params: { id: activeConversationId },
          replace: true,
        })
      }
    } catch (error) {
      console.error(error)
    } finally {
      setWaitingForAiResponse(false)
    }
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div className="w-full relative h-screen overflow-hidden pt-10">
      <ScrollArea className="h-full overflow-auto" ref={chatRef}>
        <div className="space-y-10 lg:w-3xl w-xl mx-auto pb-36">
          {messages?.map((message, i) => (
            <div key={`${message.id + i}`} className="">
              {message.role === "user" ? (
                <div className="group">
                  <Body className="p-4 bg-muted rounded-md max-w-xl ml-auto text-justify">
                    {message.parts[0].text}
                  </Body>
                  <div className="flex justify-end items-center p-2 h-12">
                    <CopyToClipboard
                      copied={copied}
                      onClick={() => handleCopy(message.parts[0].text)}
                    />
                  </div>
                </div>
              ) : (
                <div className="group leading-8">
                  <Markdown message={message.parts[0].text} />
                  <div className="flex justify-start items-center p-2 h-12">
                    <CopyToClipboard
                      copied={copied}
                      onClick={() => handleCopy(message.parts[0].text)}
                    />
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
      </ScrollArea>
      <PromptInput onSubmit={handleSubmit} />
    </div>
  )
}
