import { cn } from '@/utils/ui'
import * as ProgressPrimitive from '@radix-ui/react-progress'
import * as React from 'react'

const Progress = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>>(
  ({ className, value, ...props }, ref) => (
    <ProgressPrimitive.Root ref={ref} className={cn('bg-primary/20 overmodule-hidden relative h-2 w-full rounded-full', className)} {...props}>
      <ProgressPrimitive.Indicator className="bg-primary h-full w-full flex-1 transition-all" style={{ transform: `translateX(-${100 - (value || 0)}%)` }} />
    </ProgressPrimitive.Root>
  ),
)
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
