"use client";

import { User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  currentUser: string | null;
}

export function Navbar({ currentUser }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Sparkles className="h-6 w-6 text-primary animate-pulse" />
          </div>
          <span className="text-xl font-bold tracking-tight">RentHub</span>
        </div>

        <div className="flex items-center gap-4">
          {currentUser && (
            <span className="text-sm text-muted-foreground hidden sm:block">
              User ID: {currentUser}
            </span>
          )}
          <Button variant="outline" size="sm" className="gap-2 group">
            <User className="h-4 w-4 transition-transform group-hover:scale-110" />
            <span className="hidden sm:inline">Account</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
