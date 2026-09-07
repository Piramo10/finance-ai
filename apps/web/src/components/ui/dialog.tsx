"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

type DialogContextValue = { open: boolean; setOpen: (open: boolean) => void };
const DialogContext = React.createContext<DialogContextValue | null>(null);
function useDialog() { const context = React.useContext(DialogContext); if (!context) throw new Error("Dialog components must be used inside Dialog."); return context; }
function Dialog({ open: controlledOpen, defaultOpen = false, onOpenChange, children }: { open?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void; children: React.ReactNode }) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = (next: boolean) => { if (controlledOpen === undefined) setUncontrolledOpen(next); onOpenChange?.(next); };
  return <DialogContext.Provider value={{ open, setOpen }}>{children}</DialogContext.Provider>;
}
function DialogTrigger({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) { const { setOpen } = useDialog(); return <button type="button" onClick={(event) => { props.onClick?.(event); if (!event.defaultPrevented) setOpen(true); }} {...props}>{children}</button>; }
function DialogClose({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) { const { setOpen } = useDialog(); return <button type="button" onClick={(event) => { props.onClick?.(event); if (!event.defaultPrevented) setOpen(false); }} {...props}>{children}</button>; }
function DialogContent({ className, children, ...props }: React.ComponentProps<"div">) { const { open, setOpen } = useDialog(); if (!open) return null; return <div className="fixed inset-0 z-50 grid place-items-center p-4" role="presentation"><button type="button" aria-label="Fechar diálogo" className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} /><div role="dialog" aria-modal="true" className={cn("relative z-10 w-full max-w-lg rounded-lg border bg-white p-6 shadow-lg", className)} {...props}>{children}<DialogClose aria-label="Fechar" className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100"><X className="size-4" /></DialogClose></div></div>; }
const DialogHeader = ({ className, ...props }: React.ComponentProps<"div">) => <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />;
const DialogFooter = ({ className, ...props }: React.ComponentProps<"div">) => <div className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)} {...props} />;
const DialogTitle = React.forwardRef<HTMLHeadingElement, React.ComponentProps<"h2">>(({ className, ...props }, ref) => <h2 ref={ref} className={cn("text-lg font-semibold", className)} {...props} />);
const DialogDescription = React.forwardRef<HTMLParagraphElement, React.ComponentProps<"p">>(({ className, ...props }, ref) => <p ref={ref} className={cn("text-sm text-slate-500", className)} {...props} />);
export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose };
