import { apiClient } from "@/lib/api-client"

export const startNewConversation = async () => {
  const { data } = await apiClient.post(`/v1/chat/new`)
  return data.data
}