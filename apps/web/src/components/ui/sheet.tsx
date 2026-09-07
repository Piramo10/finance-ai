"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";
type SheetContextValue = { open: boolean; setOpen: (open: boolean) => void };
const SheetContext = React.createContext<SheetContextValue | null>(null);
function useSheet() { const context = React.useContext(SheetContext); if (!context) throw new Error("Sheet components must be used inside Sheet."); return context; }
function Sheet({ open: controlledOpen, defaultOpen = false, onOpenChange, children }: { open?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void; children: React.ReactNode }) { const [internalOpen, setInternalOpen] = React.useState(defaultOpen); const open = controlledOpen ?? internalOpen; const setOpen = (value: boolean) => { if (controlledOpen === undefined) setInternalOpen(value); onOpenChange?.(value); }; return <SheetContext.Provider value={{ open, setOpen }}>{children}</SheetContext.Provider>; }
function SheetTrigger({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) { const { setOpen } = useSheet(); return <button type="button" onClick={(event) => { props.onClick?.(event); if (!event.defaultPrevented) setOpen(true); }} {...props}>{children}</button>; }
function SheetContent({ side = "right", className, children, ...props }: React.ComponentProps<"div"> & { side?: "top" | "right" | "bottom" | "left" }) { const { open, setOpen } = useSheet(); if (!open) return null; const positions = { top: "inset-x-0 top-0 border-b", right: "inset-y-0 right-0 h-full w-3/4 max-w-sm border-l", bottom: "inset-x-0 bottom-0 border-t", left: "inset-y-0 left-0 h-full w-3/4 max-w-sm border-r" }; return <div className="fixed inset-0 z-50"><button type="button" className="absolute inset-0 bg-black/50" aria-label="Fechar painel" onClick={() => setOpen(false)} /><div role="dialog" aria-modal="true" className={cn("absolute z-10 bg-white p-6 shadow-lg", positions[side], className)} {...props}>{children}<button type="button" aria-label="Fechar" onClick={() => setOpen(false)} className="absolute right-4 top-4"><X className="size-4" /></button></div></div>; }
const SheetHeader = ({ className, ...props }: React.ComponentProps<"div">) => <div className={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...props} />;
const SheetTitle = ({ className, ...props }: React.ComponentProps<"h2">) => <h2 className={cn("text-lg font-semibold", className)} {...props} />;
const SheetDescription = ({ className, ...props }: React.ComponentProps<"p">) => <p className={cn("text-sm text-slate-500", className)} {...props} />;
export { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription };
