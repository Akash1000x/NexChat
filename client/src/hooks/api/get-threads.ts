import { apiClient } from "@/lib/api-client"
import type { ThreadType } from "@/types/threads";
import { useQuery } from "@tanstack/react-query";

const fetchThreads = async (offset: number): Promise<ThreadType[]> => {
  const { data } = await apiClient.get(`/v1/chat/get-threads?offset=${offset}`)
  return data.data;
}

export const useGetThreads = (offset: number) => {
  return useQuery<ThreadType[], Error>({
    queryKey: ["threads", offset],
    queryFn: () => fetchThreads(offset),
  })
}