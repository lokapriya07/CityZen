import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "../lib/utils";// Assuming you have this utility function

/**
 * A visual indicator of a task's progress.
 * @param {object} props - The component props, extending Radix UI Progress props.
 * @param {string} [props.className] - Additional CSS classes.
 * @param {number} [props.value] - The current progress value (from 0 to 100).
 * @param {React.Ref<HTMLDivElement>} ref - The ref forwarded to the progress element.
 */
const Progress = React.forwardRef(({ className, value, ...props }, ref) => (
    <ProgressPrimitive.Root
        ref={ref}
        className={cn("relative h-4 w-full overflow-hidden rounded-full bg-secondary", className)}
        {...props}
    >
        <ProgressPrimitive.Indicator
            className="h-full w-full flex-1 bg-primary transition-all"
            style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
    </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };