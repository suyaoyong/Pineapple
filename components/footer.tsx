import Link from "next/link"
import { BananaIcon } from "@/components/banana-icon"
import { BananaDecoration } from "@/components/banana-decoration"

export function Footer() {
  return (
    <footer className="relative py-12 border-t border-border overflow-hidden">
      <BananaDecoration className="w-24 h-24 -bottom-8 -left-4" rotate={-20} />
      <BananaDecoration className="w-20 h-20 -bottom-4 right-10" rotate={30} />

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <BananaIcon className="w-8 h-8" />
            <span className="font-bold text-xl">Pineapple</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              Terms
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              Privacy
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              Contact
            </Link>
          </div>

          <p className="text-muted-foreground text-sm">© 2026 Pineapple. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
