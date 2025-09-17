import * as React from "react";
import { cn } from "../lib/utils";// Assuming you have this utility function

/**
 * A styled textarea component that extends standard HTML textarea attributes.
 * @param {object} props - The component props.
 * @param {string} [props.className] - Additional CSS classes to apply.
 * @param {React.Ref<HTMLTextAreaElement>} ref - The ref forwarded to the textarea element.
 */
const Textarea = React.forwardRef(({ className, ...props }, ref) => {
    return (
        <textarea
            className={cn(
                "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            ref={ref}
            {...props}
        />
    );
});
Textarea.displayName = "Textarea";

export { Textarea };