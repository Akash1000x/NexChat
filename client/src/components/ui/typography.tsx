import { cn } from '@/lib/utils'
import type React from 'react'

type SharedProps = {
  as?: React.ElementType
  className?: string
  children: React.ReactNode
}

const HeadLine = ({ as: Comp = 'h2', className, ...props }: SharedProps) => {
  return <Comp className={cn('text-xl font-bold', className)} {...props} />
}

const Title = ({ as: Comp = 'p', className, ...props }: SharedProps) => {
  return <Comp className={cn('text-lg font-medium', className)} {...props} />
}

const Body = ({ as: Comp = 'p', className, ...props }: SharedProps) => {
  return <Comp className={cn('text-base', className)} {...props} />
}

export { Title, Body, HeadLine }
