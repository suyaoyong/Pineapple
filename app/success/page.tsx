import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

type SuccessPageProps = {
  searchParams?: {
    plan?: string
    billing?: string
  }
}

export default function SuccessPage({ searchParams }: SuccessPageProps) {
  const plan = searchParams?.plan ?? 'your plan'
  const billing = searchParams?.billing ?? 'billing'

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 pb-24 pt-28 text-center sm:px-6 lg:px-8">
        <div className="rounded-full border border-amber-200/70 bg-amber-50/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
          Payment successful
        </div>
        <h1 className="text-4xl font-semibold text-foreground sm:text-5xl">
          Welcome to Pineapple.
        </h1>
        <p className="text-base text-muted-foreground sm:text-lg">
          Your {plan} subscription is active. We set you up with {billing} mode
          and are syncing your workspace.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild className="bg-amber-500 text-amber-950 hover:bg-amber-400">
            <Link href="/">Go to the editor</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/pricing">View plan details</Link>
          </Button>
        </div>
      </section>
      <Footer />
    </main>
  )
}
