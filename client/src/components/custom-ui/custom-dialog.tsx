import React from "react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface ModalDialogProps {
  title: string
  trigger: React.ReactNode
  children: React.ReactNode
  className?: string
  isOpen?: boolean
  footer?: React.ReactNode
  description?: string
}

export default function ModalDialog({
  title,
  footer,
  trigger,
  children,
  className,
  isOpen,
  description,
}: ModalDialogProps) {
  return (
    <Dialog open={isOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        className={cn("sm:max-w-[450px] [&>button]:hidden", className)}
      >
        <DialogHeader>
          <DialogTitle className="border-b w-full pb-2">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children && children}
        <DialogFooter>{footer && footer}</DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
