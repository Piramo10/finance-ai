"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
type MenuContextValue = { open: boolean; setOpen: (open: boolean) => void };
const MenuContext = React.createContext<MenuContextValue | null>(null);
function useMenu() { const context = React.useContext(MenuContext); if (!context) throw new Error("Dropdown menu components must be used inside DropdownMenu."); return context; }
function DropdownMenu({ children }: { children: React.ReactNode }) { const [open, setOpen] = React.useState(false); return <MenuContext.Provider value={{ open, setOpen }}><div className="relative inline-block">{children}</div></MenuContext.Provider>; }
function DropdownMenuTrigger({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) { const { open, setOpen } = useMenu(); return <button type="button" aria-haspopup="menu" aria-expanded={open} onClick={(event) => { props.onClick?.(event); if (!event.defaultPrevented) setOpen(!open); }} {...props}>{children}</button>; }
function DropdownMenuContent({ className, ...props }: React.ComponentProps<"div">) { const { open } = useMenu(); if (!open) return null; return <div role="menu" className={cn("absolute right-0 z-50 mt-2 min-w-40 rounded-md border bg-white p-1 shadow-md", className)} {...props} />; }
function DropdownMenuItem({ className, onClick, ...props }: React.ComponentProps<"button">) { const { setOpen } = useMenu(); return <button type="button" role="menuitem" className={cn("flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5 text-left text-sm outline-none hover:bg-slate-100", className)} onClick={(event) => { onClick?.(event); if (!event.defaultPrevented) setOpen(false); }} {...props} />; }
const DropdownMenuLabel = ({ className, ...props }: React.ComponentProps<"div">) => <div className={cn("px-2 py-1.5 text-sm font-semibold", className)} {...props} />;
const DropdownMenuSeparator = ({ className, ...props }: React.ComponentProps<"div">) => <div className={cn("-mx-1 my-1 h-px bg-slate-100", className)} {...props} />;
export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator };
