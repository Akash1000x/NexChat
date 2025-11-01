import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import z from "zod"
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import ModalDialog from "../custom-ui/custom-dialog"
import { PlusIcon } from "lucide-react"
import { useState } from "react"
import type { ModelsCategory } from "@/types/models"
import { useAddModelMutation } from "@/hooks/api/admin/add-model"
import { toast } from "sonner"

const addModelSchema = z.object({
  modelName: z.string().min(1, { message: "Model name is required" }),
  modelSlug: z.string().min(1, { message: "Model slug is required" }),
  categoryId: z.string().min(1, { message: "Category is required" }),
})

export default function AddModels({
  categories,
}: {
  categories: ModelsCategory[]
}) {
  const addModelMutation = useAddModelMutation()
  const [isOpen, setIsOpen] = useState(false)
  const form = useForm<z.infer<typeof addModelSchema>>({
    resolver: zodResolver(addModelSchema),
    defaultValues: {
      modelName: "",
      modelSlug: "",
      categoryId: "",
    },
  })

  async function onSubmit(data: z.infer<typeof addModelSchema>) {
    try {
      await addModelMutation.mutateAsync({
        modelName: data.modelName,
        modelSlug: data.modelSlug,
        categoryId: data.categoryId,
      })
      onClose()
    } catch (error: any) {
      toast.error(error)
    }
  }

  function onClose() {
    setIsOpen(false)
    form.reset()
  }

  return (
    <ModalDialog
      isOpen={isOpen}
      title="Add Model"
      trigger={
        <Button onClick={() => setIsOpen(true)}>
          <PlusIcon className="w-4 h-4" /> Add Model
        </Button>
      }
      footer={
        <>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="add-model-form"
            disabled={addModelMutation.isPending}
          >
            {addModelMutation.isPending ? "Adding..." : "Add Model"}
          </Button>
        </>
      }
    >
      <form id="add-model-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <Controller
            name="categoryId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Category</FieldLabel>
                <Select
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    className="w-52"
                  >
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="modelName"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Model name</FieldLabel>
                <Input
                  id={field.name}
                  {...field}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="modelSlug"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Model slug</FieldLabel>
                <Input
                  id={field.name}
                  {...field}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>
      </form>
    </ModalDialog>
  )
}
