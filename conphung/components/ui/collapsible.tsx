"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface CollapsibleProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function Collapsible({ 
  children, 
  defaultOpen = false, 
  title, 
  description,
  icon,
  className 
}: CollapsibleProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div className={cn("space-y-2", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full p-4 rounded-lg border border-border bg-card hover:bg-accent transition-colors"
      >
        <div className="flex items-center gap-3">
          {icon && <div className="text-muted-foreground">{icon}</div>}
          <div className="text-left">
            <div className="font-semibold text-base">{title}</div>
            {description && (
              <div className="text-sm text-muted-foreground mt-0.5">{description}</div>
            )}
          </div>
        </div>
        <ChevronDown
          className={cn(
            "h-5 w-5 text-muted-foreground transition-transform duration-200",
            isOpen && "transform rotate-180"
          )}
        />
      </button>
      {isOpen && (
        <div className="pt-2 animate-in slide-in-from-top-2 duration-200">
          {children}
        </div>
      )}
    </div>
  );
}


