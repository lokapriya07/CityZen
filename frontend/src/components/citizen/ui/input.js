import * as React from "react";
import { cn } from "./lib/utils"; // Assuming you have this utility function

/**
 * A styled input component that extends standard HTML input attributes.
 * @param {object} props - The component props.
 * @param {string} [props.className] - Additional CSS classes.
 * @param {string} [props.type] - The type attribute for the input element.
 * @param {React.Ref<HTMLInputElement>} ref - The ref forwarded to the input element.
 */
const Input = React.forwardRef(({ className, type, ...props }, ref) => {
    return (
        <input
            type={type}
            className={cn(
                "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            ref={ref}
            {...props}
        />
    );
});
Input.displayName = "Input";

export { Input };