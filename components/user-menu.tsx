'use client'

import Link from 'next/link'
import { ChevronDown, LogOut } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type UserMenuProps = {
  name?: string | null
  email?: string | null
  avatarUrl?: string | null
}

const getInitials = (value?: string | null) => {
  if (!value) return 'P'
  const parts = value.trim().split(' ').filter(Boolean)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0] ?? ''}${parts[parts.length - 1][0] ?? ''}`.toUpperCase()
}

export function UserMenu({ name, email, avatarUrl }: UserMenuProps) {
  const displayName = name || email || 'Account'
  const initials = getInitials(displayName)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Open user menu"
          className="group flex items-center gap-2 rounded-full bg-gradient-to-br from-yellow-200/70 via-amber-300/60 to-amber-500/70 p-[1px] shadow-sm transition hover:shadow-md"
        >
          <span className="flex items-center gap-2 rounded-full bg-background/80 px-2 py-1 backdrop-blur">
            <Avatar className="size-8 ring-2 ring-amber-200/80 ring-offset-2 ring-offset-background">
              {avatarUrl ? <AvatarImage src={avatarUrl} alt={displayName} /> : null}
              <AvatarFallback className="bg-yellow-100 text-yellow-950 text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="hidden sm:flex flex-col text-left leading-tight">
              <span className="text-sm font-semibold text-foreground">
                {displayName}
              </span>
              {email ? (
                <span className="text-xs text-muted-foreground">{email}</span>
              ) : null}
            </span>
            <ChevronDown className="hidden size-4 text-muted-foreground transition group-hover:text-foreground sm:block" />
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-64 rounded-xl border border-border/60 bg-background/95 p-2 shadow-xl backdrop-blur-sm"
      >
        <DropdownMenuLabel className="px-2 py-2">
          <div className="flex items-center gap-3">
            <Avatar className="size-10 ring-2 ring-amber-200/80 ring-offset-2 ring-offset-background">
              {avatarUrl ? <AvatarImage src={avatarUrl} alt={displayName} /> : null}
              <AvatarFallback className="bg-yellow-100 text-yellow-950 text-sm font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-foreground">
                {displayName}
              </span>
              {email ? (
                <span className="text-xs text-muted-foreground">{email}</span>
              ) : null}
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/auth/logout" className="flex w-full items-center gap-2">
            <LogOut className="size-4" />
            <span>Sign Out</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
