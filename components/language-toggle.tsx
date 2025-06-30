"use client"
import { Globe } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LanguageToggleProps {
  language: "zh" | "en";
  onToggle: () => void;
  className?: string;
}

export function LanguageToggle({  onToggle, className }: LanguageToggleProps) {
  return (
    <Button variant="outline" size="icon" onClick={onToggle} className={`top-4 left-16 z-50 h-9 w-9 ${className}`}>
      <Globe className="h-[1.2rem] w-[1.2rem]" />
      <span className="sr-only">切換語言</span>
    </Button>
  )
}
