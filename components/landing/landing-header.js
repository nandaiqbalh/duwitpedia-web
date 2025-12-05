"use client";

import Link from "next/link";
import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingHeader() {
  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wallet className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
          <span className="text-xl md:text-2xl font-semibold text-gray-900">Duwitpedia</span>
        </div>
        <Link href="/login">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm md:text-base px-4 md:px-6 py-2 md:py-2.5">
            Sign In
          </Button>
        </Link>
      </div>
    </header>
  );
}
