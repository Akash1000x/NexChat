import ReactMarkdown, { type ExtraProps } from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import {
  vscDarkPlus,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import { ScrollArea, ScrollBar } from "./ui/scroll-area"
import { useClipboard } from "@/hooks/useClipboard"
import { Label } from "./ui/label"
import { useTheme } from "./theme-provider"
import CopyToClipboard from "./copy-to-clipboard"

export default function Markdown({ message }: { message: string }) {
  return (
    <ReactMarkdown
      children={message}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        code(props) {
          return <CodeBlock props={props} />
        },
        ol(props) {
          return <ol className="list-decimal pl-4" {...props} />
        },
        ul(props) {
          return <ul className="list-disc pl-5 my-3" {...props} />
        },
        li(props) {
          return <li className="pl-1.5 my-2" {...props} />
        },
        p(props) {
          return <p className="my-5 text-justify" {...props} />
        },
      }}
    />
  )
}

export function CodeBlock({
  props,
}: {
  props: React.ClassAttributes<HTMLElement> &
    React.HTMLAttributes<HTMLElement> &
    ExtraProps
}) {
  const { copied, handleCopy } = useClipboard()
  const { theme } = useTheme()

  const { className, ref, ...rest } = props
  const match = /language-(\w+)/.exec(className || "")
  return match ? (
    <div className="relative group rounded-md mt-2">
      <div className="w-full bg-accent p-3 rounded-t-md">
        <Label>{match[1]}</Label>
      </div>
      <div className="sticky top-14 z-10 flex justify-end h-0 overflow-visible">
        <CopyToClipboard
          tooltipText="copy code"
          className="opacity-100 visible h-fit absolute -top-9 right-2"
          copied={copied}
          onClick={() => handleCopy(String(props.children))}
        />
      </div>
      <ScrollArea className="relative rounded-b-md">
        <SyntaxHighlighter
          {...rest}
          PreTag="div"
          language={match[1]}
          style={theme === "dark" ? vscDarkPlus : oneLight}
          customStyle={{
            margin: 0,
            padding: "1rem",
            fontSize: "0.875rem",
            // borderRadius: "0 .25rem",
          }}
        >
          {props.children as string}
        </SyntaxHighlighter>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  ) : (
    <code {...rest} className="bg-accent px-1.5 mx-0.5 py-1 rounded-sm">
      {props.children}
    </code>
  )
}
