import * as React from "react";
import { cn } from "@/lib/cn";

const Form = React.forwardRef<HTMLFormElement, React.ComponentProps<"form">>(({ className, ...props }, ref) => <form ref={ref} className={cn("space-y-6", className)} {...props} />);
const FormItem = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(({ className, ...props }, ref) => <div ref={ref} className={cn("space-y-2", className)} {...props} />);
const FormLabel = React.forwardRef<HTMLLabelElement, React.ComponentProps<"label">>(({ className, ...props }, ref) => <label ref={ref} className={cn("text-sm font-medium leading-none", className)} {...props} />);
const FormControl = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(({ className, ...props }, ref) => <div ref={ref} className={cn("w-full", className)} {...props} />);
const FormDescription = React.forwardRef<HTMLParagraphElement, React.ComponentProps<"p">>(({ className, ...props }, ref) => <p ref={ref} className={cn("text-sm text-slate-500", className)} {...props} />);
const FormMessage = React.forwardRef<HTMLParagraphElement, React.ComponentProps<"p">>(({ className, ...props }, ref) => <p ref={ref} className={cn("text-sm font-medium text-red-600", className)} {...props} />);
export { Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage };
