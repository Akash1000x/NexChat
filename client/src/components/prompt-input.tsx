import { ArrowUp, ChevronDown } from "lucide-react"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"
import { icons } from "./icon"
import type { Model } from "@/types/models"
import { Label } from "./ui/label"
import React, { useEffect } from "react"
import { CustomPopover } from "./ui/popover"
import { useGetModels } from "@/hooks/api/get-models"

export default function PromptInput({
  onSubmit,
}: {
  onSubmit: (data: any) => void
}) {
  const { data: models } = useGetModels()
  const [selectedModel, setSelectedModel] = React.useState<Model | null>(null)
  const [openPopover, setOpenPopover] = React.useState<boolean>(false)
  const [message, setMessage] = React.useState<string>("")

  const handleSubmit = () => {
    if (!message.trim() || !selectedModel) return
    onSubmit({ message, model: selectedModel })
    setMessage("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && message.trim()) {
      e.preventDefault()
      handleSubmit()
    }
  }

  useEffect(() => {
    if (!models) return
    const selectedModel = models
      ?.flatMap((category) => category.models)
      ?.find((model) => model.isDefault)

    if (selectedModel) {
      setSelectedModel(selectedModel)
    }
  }, [models])

  const handleSetSelectedModel = (model: Model) => {
    setSelectedModel(model)
    setOpenPopover(false)
  }

  return (
    <div className="lg:w-3xl w-xl absolute bottom-0 bg-muted left-1/2 -translate-x-1/2 border border-accent-foreground rounded-t-lg">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
      >
        <Textarea
          className="border-none resize-none max-h-64 font-medium"
          placeholder="Type your message here..."
          name="input"
          value={message}
          onChange={(e) =>
            e.target.value !== "\n" && setMessage(e.target.value)
          }
          onKeyDown={handleKeyDown}
        />
        <div className="flex items-center justify-between p-2">
          <CustomPopover
            open={openPopover}
            setOpen={setOpenPopover}
            trigger={
              <Button variant={"outline"} className="capitalize">
                {selectedModel?.name} <ChevronDown />
              </Button>
            }
          >
            <div>
              {models?.map((category) => (
                <div key={category.id} className="">
                  {!!category.models.length && (
                    <Label className="text-bold text-sm capitalize">
                      {category.name}
                    </Label>
                  )}
                  {category.models.map((model) => (
                    <ListItem
                      key={model.id}
                      model={model}
                      categoryName={category.slug}
                      onClick={() => handleSetSelectedModel(model)}
                    />
                  ))}
                </div>
              ))}
            </div>
          </CustomPopover>
          <Button
            variant="outline"
            size={"icon"}
            type="submit"
            aria-label="Send message"
            disabled={!message.trim()}
          >
            <ArrowUp />
          </Button>
        </div>
      </form>
    </div>
  )
}

const ListItem = React.memo(
  ({
    model,
    categoryName,
    onClick,
  }: {
    model: Model
    categoryName: string
    onClick: () => void
  }) => {
    return (
      <div
        key={model.id}
        className="flex gap-4 p-2 hover:bg-accent rounded-md cursor-pointer items-center text-sm [&>svg]:size-5"
        onClick={onClick}
      >
        {icons[categoryName as keyof typeof icons]}
        <p className="capitalize">{model.name}</p>
      </div>
    )
  },
)
