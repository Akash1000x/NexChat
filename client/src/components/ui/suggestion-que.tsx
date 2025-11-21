import * as React from "react"
import { Button } from "./button"
import { authClient } from "@/lib/auth-clients"
import { Sparkles, Compass, Code, GraduationCap } from "lucide-react"
import { useGetSuggestionQuestions } from "@/hooks/api/suggestioin-questions"

type Category = "create" | "explore" | "code" | "learn"

const categoryIcons = {
  create: Sparkles,
  explore: Compass,
  code: Code,
  learn: GraduationCap,
}

interface SuggestionQueueProps {
  onSelectQuestion?: (question: string) => void
}

export default function SuggestionQueue({
  onSelectQuestion,
}: SuggestionQueueProps) {
  const { data } = useGetSuggestionQuestions()
  const [activeCategory, setActiveCategory] = React.useState<Category>("code")
  const [isVisible, setIsVisible] = React.useState(false)
  const [isAnimating, setIsAnimating] = React.useState(false)
  const { data: session } = authClient.useSession()

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 0)

    return () => clearTimeout(timer)
  }, [])

  const handleCategoryClick = (category: Category) => {
    if (category === activeCategory) return

    setIsAnimating(true)
    setActiveCategory(category)

    setTimeout(() => {
      setIsAnimating(false)
    }, 0)
  }

  const handleQuestionClick = (question: string) => {
    onSelectQuestion?.(question)
  }

  const username = session?.user?.name?.split(" ")[0].trim() || ""

  return (
    <div
      className={`w-full max-w-3xl px-4 m-auto h-full flex flex-col justify-center space-y-2 transition-all duration-500 ease-in-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <h1 className="text-3xl md:text-4xl font-semibold text-foreground">
        How can I help you
        {username && (
          <span className="text-primary capitalize">{`, ${username}`}</span>
        )}
        ?
      </h1>

      <div className="flex flex-wrap gap-2">
        {data?.map((question) => {
          const Icon = categoryIcons[question.category as Category]
          const isActive = activeCategory === question.category

          return (
            <Button
              key={question.id}
              variant={isActive ? "default" : "outline"}
              size="default"
              onClick={() => handleCategoryClick(question.category)}
              className="border"
            >
              <Icon className="size-4" />
              {question.category}
            </Button>
          )
        })}
      </div>

      <div>
        {data
          ?.filter((question) => question.category === activeCategory)
          .flatMap((question) => question.questions)
          .map((question, index) => (
            <div
              key={`${activeCategory}-${index}`}
              className={`w-full border-b py-1 transition-all duration-300 ${
                isAnimating
                  ? "opacity-0 translate-x-4"
                  : "opacity-100 translate-x-0"
              }`}
              style={{
                transitionDelay: isAnimating ? "0ms" : `${index * 50}ms`,
              }}
            >
              <Button
                onClick={() => handleQuestionClick(question)}
                variant="ghost"
                className="w-full justify-start px-3 py-6 hover:bg-accent/50 transition-colors duration-200"
              >
                {question}
              </Button>
            </div>
          ))}
      </div>
    </div>
  )
}
