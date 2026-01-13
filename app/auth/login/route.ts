import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@/lib/supabase/route-handler"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const provider = searchParams.get("provider") ?? "google"
  const next = searchParams.get("next") ?? "/"

  const { supabase, response } = createRouteHandlerClient(request)
  const redirectTo = new URL("/auth/callback", origin)
  redirectTo.searchParams.set("next", next)

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: redirectTo.toString() },
  })

  if (error || !data?.url) {
    return NextResponse.json({ error: error?.message ?? "OAuth start failed" }, { status: 400 })
  }

  const redirectResponse = NextResponse.redirect(data.url)
  response.cookies.getAll().forEach((cookie) => {
    redirectResponse.cookies.set(cookie)
  })

  return redirectResponse
}
