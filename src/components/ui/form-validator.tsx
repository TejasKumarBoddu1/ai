
import * as React from "react";
import { cn } from "@/lib/utils";

interface FormValidatorProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string | undefined;
  required?: boolean;
  errorMessage?: string;
  showMessage?: boolean;
  highlightOnly?: boolean;
  pattern?: RegExp;
  patternMessage?: string;
  maxLength?: number;
  maxLengthMessage?: string;
}

const FormValidator = React.forwardRef<HTMLDivElement, FormValidatorProps>(
  ({ 
    className, 
    value, 
    required = false, 
    errorMessage = "This field is required", 
    showMessage = false,
    highlightOnly = false,
    pattern,
    patternMessage = "Invalid format",
    maxLength,
    maxLengthMessage = "Text exceeds maximum length",
    ...props 
  }, ref) => {
    const isEmpty = required && (!value || value.trim() === "");
    const isInvalidPattern = pattern && value && !pattern.test(value);
    const isExceedingMaxLength = maxLength && value && value.length > maxLength;
    
    const hasError = isEmpty || isInvalidPattern || isExceedingMaxLength;
    
    let displayMessage = errorMessage;
    if (isInvalidPattern) displayMessage = patternMessage;
    if (isExceedingMaxLength) displayMessage = maxLengthMessage;

    return (
      <div ref={ref} className={cn("text-xs text-destructive min-h-5", className)} {...props}>
        {hasError && showMessage && !highlightOnly && displayMessage}
      </div>
    );
  }
);

FormValidator.displayName = "FormValidator";

export { FormValidator };
