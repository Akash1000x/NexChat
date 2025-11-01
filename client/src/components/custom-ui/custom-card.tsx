import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card"

interface CardSnippetProps {
  title: string
  description?: string
  modalComponent?: React.ReactNode
  children: React.ReactNode
  className?: string
  titleClassName?: string
  contentClassName?: string
  footerClassName?: string
  footer?: React.ReactNode
}

export default function CardSnippet({
  title,
  description = "",
  children,
  className,
  titleClassName,
  contentClassName,
  footerClassName,
  footer,
  modalComponent,
}: CardSnippetProps) {
  return (
    <Card className={cn("pt-2", className)}>
      <CardHeader className={cn("", modalComponent && "border-b")}>
        <CardTitle
          className={cn(
            "flex items-center justify-between text-xl",
            titleClassName,
          )}
        >
          <span>{title}</span>

          {modalComponent && modalComponent}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className={contentClassName}>{children}</CardContent>
      {footer && <CardFooter className={footerClassName}>{footer}</CardFooter>}
    </Card>
  )
}
