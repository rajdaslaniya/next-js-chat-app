import { cn } from "@/lib/utils";
import React from "react";

const FormikError = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(({ className, ...props }, ref) => {
  return <p ref={ref} className={cn("text-[0.8rem] text-red-300", className)} {...props} />;
});
FormikError.displayName = "FormikError";

export { FormikError };
