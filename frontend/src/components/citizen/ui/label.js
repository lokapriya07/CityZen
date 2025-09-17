import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva } from "class-variance-authority";
import { cn } from "./lib/utils"; // Assuming you have this utility function

const labelVariants = cva("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70");

/**
 * A styled label component based on Radix UI Label.
 * @param {object} props - The component props, which extend Radix UI's Label props.
 * @param {string} [props.className] - Additional CSS classes.
 * @param {React.Ref<HTMLLabelElement>} ref - The ref forwarded to the label element.
 */
const Label = React.forwardRef(({ className, ...props }, ref) => (
    <LabelPrimitive.Root
        ref={ref}
        className={cn(labelVariants(), className)}
        {...props}
    />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };