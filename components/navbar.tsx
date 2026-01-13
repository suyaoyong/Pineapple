import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BananaIcon } from "@/components/banana-icon"
import { createClient } from "@/lib/supabase/server"
import { UserMenu } from "@/components/user-menu"

export async function Navbar() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <BananaIcon className="w-8 h-8" />
            <span className="font-bold text-xl text-foreground">Pineapple</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="#generator" className="text-muted-foreground hover:text-foreground transition-colors">
              Editor
            </Link>
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#showcase" className="text-muted-foreground hover:text-foreground transition-colors">
              Showcase
            </Link>
            <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">
              FAQ
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <UserMenu
                name={
                  user.user_metadata?.full_name ??
                  user.user_metadata?.name ??
                  user.user_metadata?.user_name
                }
                email={user.email}
                avatarUrl={
                  user.user_metadata?.avatar_url ??
                  user.user_metadata?.picture ??
                  user.user_metadata?.avatar
                }
              />
            ) : (
              <Button variant="outline" size="sm" asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
            )}
            <Button size="sm" className="bg-yellow-400 hover:bg-yellow-500 text-yellow-950">
              <BananaIcon className="w-4 h-4 mr-2" />
              Try Pro
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
