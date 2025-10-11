import { apiClient } from "@/lib/api-client"
import type { MessageType } from "@/types/messages";
import { useQuery } from "@tanstack/react-query";

const fetchMessages = async (threadId: string): Promise<MessageType[]> => {
  const { data } = await apiClient.get(`/v1/chat/get-messages?threadId=${threadId}`)
  return data.data;
}

export const useGetMessage = (threadId: string | undefined) => {
  return useQuery<MessageType[], Error>({
    queryKey: [`messages${threadId}`],
    queryFn: () => fetchMessages(threadId!),
    enabled: !!threadId
  })
}