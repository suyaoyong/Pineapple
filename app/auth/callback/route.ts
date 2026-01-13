import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@/lib/supabase/route-handler"

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const code = url.searchParams.get("code")
  const next = url.searchParams.get("next") ?? "/"

  if (!code) {
    return NextResponse.redirect(new URL("/", url.origin))
  }

  const { supabase, response } = createRouteHandlerClient(request)
  await supabase.auth.exchangeCodeForSession(code)

  const safeNext = next.startsWith("/") ? next : "/"
  const redirectResponse = NextResponse.redirect(new URL(safeNext, url.origin))

  response.cookies.getAll().forEach((cookie) => {
    redirectResponse.cookies.set(cookie)
  })

  return redirectResponse
}
