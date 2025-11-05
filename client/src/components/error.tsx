import { TriangleAlert } from "lucide-react"
import { Body } from "./ui/typography"

export default function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="w-full border h-screen gap-2 flex flex-col items-center justify-center text-xl text-red-500">
      <div className="flex items-center justify-center">
        <TriangleAlert className="size-5 text-red-500 mr-2" /> Error
      </div>
      <Body className="md:text-lg text-base">{message}</Body>
    </div>
  )
}
