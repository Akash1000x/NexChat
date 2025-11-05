import { apiClient } from "@/lib/api-client"
import type { ThreadType } from "@/types/threads";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { AxiosError } from "axios"
import { toast } from "sonner"


export const useGetThreads = (userId: string) => {
  return useInfiniteQuery<ThreadType[], Error>({
    queryKey: ["threads"],
    queryFn: async ({ pageParam = 0 }) => {
      const { data } = await apiClient.get(`/v1/chat/get-threads?offset=${pageParam}`)
      return data.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage && lastPage.length > 0) {
        return allPages.length;
      }
      return undefined;
    },
    initialPageParam: 0,
    enabled: !!userId,
  })
}

export const useSearchThreads = (search: string) => {
  return useQuery<ThreadType[], Error>({
    queryKey: ["threads", search],
    queryFn: async () => {
      const { data } = await apiClient.get(`/v1/chat/search-threads?search=${search}`)
      return data.data;
    },
    enabled: !!search,
  })
}

export const useDeleteConversationMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ threadId }: { threadId: string }) => {
      const res = await apiClient.delete(`/v1/chat/delete-conversation?threadId=${threadId}`)
      return res.data
    },
    onSuccess: () => {
      toast.success("Conversation deleted successfully")
      queryClient.invalidateQueries({
        queryKey: ["threads"],
      })
    },
    onError: (error: AxiosError<{ error: { message: string } }>) => {
      toast.error(error.response?.data?.error?.message || "Failed to delete conversation")
    },
  })
}

export const startNewConversation = async () => {
  const { data } = await apiClient.post(`/v1/chat/new`)
  return data.data
}

// export const useStartNewConversation = () => {
//   const queryClient = useQueryClient()
//   return useMutation({
//     mutationFn: async () => {
//       const { data } = await apiClient.post(`/v1/chat/new`)
//       return data.data
//     },
//     onSuccess: () => {
//       toast.success("Conversation started successfully")
//     },
//     onError: (error: AxiosError<{ error: { message: string } }>) => {
//       toast.error(error.response?.data?.error?.message || "Failed to start conversation")
//     },
//   })
// }