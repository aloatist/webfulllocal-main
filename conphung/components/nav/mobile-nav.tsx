"use client";

// React and Next Imports
import * as React from "react";
import Link, { LinkProps } from "next/link";
import { useRouter } from "next/navigation";

// Utility Imports
import { Menu, ArrowRightSquare } from "lucide-react";
import { cn } from "@/lib/utils";

// Component Imports
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import type { NavigationMenuItem } from "@/lib/navigation/types";

interface MobileNavProps {
  items: NavigationMenuItem[];
}

function flattenItems(items: NavigationMenuItem[], depth = 0): Array<{ item: NavigationMenuItem; depth: number }> {
  return items.flatMap((item) => {
    const current = [{ item, depth }];
    if (item.children && item.children.length > 0) {
      return current.concat(flattenItems(item.children, depth + 1));
    }
    return current;
  });
}

export function MobileNav({ items }: MobileNavProps) {
  const [open, setOpen] = React.useState(false);
  const flattened = React.useMemo(() => flattenItems(items), [items]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="px-0 border w-10 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden "
        >
          <Menu />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="pr-0 z-[1000000]">
        <SheetTitle className="px-6 py-4">Truy cập thêm</SheetTitle>
        <MobileLink
          href="/"
          className="flex items-center"
          onOpenChange={setOpen}
        >
          <ArrowRightSquare className="mr-2 h-4 w-4" />
          <span className="text-muted-foreground">Web site du lịch Cồn Phụng Bến Tre</span>
        </MobileLink>
        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
          <div className="flex flex-col space-y-3">
            <h3 className="text-small mt-6">Menu</h3>
            <Separator />
            {flattened.map(({ item, depth }) => (
              <MobileLink
                key={item.id}
                href={item.href}
                onOpenChange={setOpen}
                className="flex items-center"
                target={item.target ?? undefined}
              >
                <span className="text-muted-foreground">{'— '.repeat(depth)}</span>
                <span>{item.label}</span>
              </MobileLink>
            ))}
            <Separator />
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

interface MobileLinkProps extends LinkProps {
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
  target?: React.HTMLAttributeAnchorTarget;
}

function MobileLink({ href, onOpenChange, className, children, ...props }: MobileLinkProps) {
  const router = useRouter();
  return (
    <Link
      href={href}
      onClick={(event) => {
        if (props.target === '_blank') {
          onOpenChange?.(false);
          return;
        }
        event.preventDefault();
        router.push(href.toString());
        onOpenChange?.(false);
      }}
      className={cn("text-lg", className)}
      {...props}
    >
      {children}
    </Link>
  );
}
