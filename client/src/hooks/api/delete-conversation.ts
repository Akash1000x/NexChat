import { apiClient } from "@/lib/api-client"

export const deleteConversation = async (threadId: string) => {
  const res = await apiClient.delete(`/v1/chat/delete-conversation?threadId=${threadId}`)
  return res.data
}