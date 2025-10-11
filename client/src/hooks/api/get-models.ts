import { apiClient } from "@/lib/api-client"
import type { ModelsCategory } from "@/types/models";
import { useQuery } from "@tanstack/react-query";

const fetchModels = async (): Promise<ModelsCategory[]> => {
  const { data } = await apiClient.get(`/v1/chat/get-models`)
  return data.data;
}

export const useGetModels = () => {
  return useQuery<ModelsCategory[], Error>({
    queryKey: ["models"],
    queryFn: () => fetchModels(),
  })
}