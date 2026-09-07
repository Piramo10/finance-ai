import * as React from "react";
import { cn } from "@/lib/cn";
const Avatar = React.forwardRef<HTMLSpanElement, React.ComponentProps<"span">>(({ className, ...props }, ref) => <span ref={ref} className={cn("relative flex size-10 shrink-0 overflow-hidden rounded-full", className)} {...props} />);
const AvatarImage = React.forwardRef<HTMLImageElement, React.ComponentProps<"img">>(({ className, alt = "", ...props }, ref) => <img ref={ref} alt={alt} className={cn("aspect-square size-full object-cover", className)} {...props} />);
const AvatarFallback = React.forwardRef<HTMLSpanElement, React.ComponentProps<"span">>(({ className, ...props }, ref) => <span ref={ref} className={cn("flex size-full items-center justify-center rounded-full bg-slate-100 text-sm", className)} {...props} />);
export { Avatar, AvatarImage, AvatarFallback };
