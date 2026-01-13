import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@/lib/supabase/route-handler"

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const { supabase, response } = createRouteHandlerClient(request)
  await supabase.auth.signOut()

  const redirectResponse = NextResponse.redirect(new URL("/", url.origin))
  response.cookies.getAll().forEach((cookie) => {
    redirectResponse.cookies.set(cookie)
  })

  return redirectResponse
}
