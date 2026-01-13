import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { PricingView } from '@/components/pricing/pricing-view'
import { createClient } from '@/lib/supabase/server'

export default async function PricingPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const productId = process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID ?? null

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <PricingView
        userId={user?.id ?? null}
        userEmail={user?.email ?? null}
        userName={
          user?.user_metadata?.full_name ??
          user?.user_metadata?.name ??
          user?.user_metadata?.user_name ??
          null
        }
        productId={productId}
      />
      <Footer />
    </main>
  )
}
