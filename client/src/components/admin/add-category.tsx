import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import z from "zod"
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import ModalDialog from "../custom-ui/custom-dialog"
import { PlusIcon } from "lucide-react"
import { useState } from "react"
import { useAddModelCategoryMutation } from "@/hooks/api/admin/add-model-category"
import { toast } from "sonner"

const addCategorySchema = z.object({
  categoryName: z.string().min(1, { message: "Category name is required" }),
  categorySlug: z.string().min(1, { message: "Category slug is required" }),
})

export default function AddCategory() {
  const [isOpen, setIsOpen] = useState(false)
  const addModelCategoryMutation = useAddModelCategoryMutation()
  const form = useForm<z.infer<typeof addCategorySchema>>({
    resolver: zodResolver(addCategorySchema),
    defaultValues: {
      categoryName: "",
      categorySlug: "",
    },
  })

  async function onSubmit(data: z.infer<typeof addCategorySchema>) {
    try {
      await addModelCategoryMutation.mutateAsync({
        categoryName: data.categoryName,
        categorySlug: data.categorySlug,
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
      title="Add Category"
      trigger={
        <Button onClick={() => setIsOpen(true)}>
          <PlusIcon className="w-4 h-4" /> Add Category
        </Button>
      }
      footer={
        <>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="add-category-form"
            disabled={addModelCategoryMutation.isPending}
          >
            {addModelCategoryMutation.isPending ? "Adding..." : "Add Category"}
          </Button>
        </>
      }
    >
      <form id="add-category-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <Controller
            control={form.control}
            name="categoryName"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Category name</FieldLabel>
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
            name="categorySlug"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Category slug</FieldLabel>
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
