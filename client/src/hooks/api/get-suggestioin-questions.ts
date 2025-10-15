import { apiClient } from "@/lib/api-client"
import { useQuery } from "@tanstack/react-query";

type Category = "create" | "explore" | "code" | "learn"

type SuggestionData = {
  [key in Category]: string[]
}

const fetchSuggestionQuestions = async (): Promise<SuggestionData> => {
  const { data } = await apiClient.get(`/v1/get-suggestions-questions`)
  return data.data;
}

export const useGetSuggestionQuestions = () => {
  return useQuery<SuggestionData, Error>({
    queryKey: ["suggestion-questions"],
    queryFn: () => fetchSuggestionQuestions(),
  })
}