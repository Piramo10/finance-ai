"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
type TabsContextValue = { value: string; setValue: (value: string) => void };
const TabsContext = React.createContext<TabsContextValue | null>(null);
function useTabs() { const context = React.useContext(TabsContext); if (!context) throw new Error("Tabs components must be used inside Tabs."); return context; }
function Tabs({ value: controlledValue, defaultValue, onValueChange, children, className }: { value?: string; defaultValue: string; onValueChange?: (value: string) => void; children: React.ReactNode; className?: string }) { const [internalValue, setInternalValue] = React.useState(defaultValue); const value = controlledValue ?? internalValue; const setValue = (next: string) => { if (controlledValue === undefined) setInternalValue(next); onValueChange?.(next); }; return <TabsContext.Provider value={{ value, setValue }}><div className={className}>{children}</div></TabsContext.Provider>; }
const TabsList = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(({ className, ...props }, ref) => <div ref={ref} role="tablist" className={cn("inline-flex h-10 items-center justify-center rounded-md bg-slate-100 p-1", className)} {...props} />);
function TabsTrigger({ value, className, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }) { const tabs = useTabs(); const active = tabs.value === value; return <button type="button" role="tab" aria-selected={active} className={cn("inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all", active ? "bg-white text-slate-950 shadow-sm" : "text-slate-500 hover:text-slate-900", className)} onClick={(event) => { props.onClick?.(event); if (!event.defaultPrevented) tabs.setValue(value); }} {...props}>{children}</button>; }
function TabsContent({ value, className, ...props }: React.ComponentProps<"div"> & { value: string }) { const tabs = useTabs(); if (tabs.value !== value) return null; return <div role="tabpanel" className={cn("mt-2", className)} {...props} />; }
export { Tabs, TabsList, TabsTrigger, TabsContent };
