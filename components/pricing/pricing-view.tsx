'use client'

import { Check, Sparkles } from 'lucide-react'
import { CreemCheckout } from '@creem_io/nextjs'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type PricingViewProps = {
  userId?: string | null
  userEmail?: string | null
  userName?: string | null
  productId: string | null
}

export function PricingView({
  userId,
  userEmail,
  userName,
  productId,
}: PricingViewProps) {
  const plan = {
    name: 'Pineapple Monthly',
    description: 'For creators polishing daily edits.',
    price: 9.9,
    credits: '400 edits',
    bonus: '60 exports in 4K',
    features: [
      'AI edit toolbox + smart masks',
      'Unlimited background cleanup',
      'Batch resize + smart crop',
      'Commercial usage rights',
      'Priority support',
    ],
  }
  const canCheckout = Boolean(productId)

  return (
    <section className="relative overflow-hidden bg-background pb-24 pt-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 right-[-10%] h-[480px] w-[480px] rounded-full bg-gradient-to-br from-yellow-200/60 via-amber-200/30 to-transparent blur-3xl" />
        <div className="absolute -bottom-52 left-[-10%] h-[520px] w-[520px] rounded-full bg-gradient-to-tr from-amber-300/40 via-yellow-200/20 to-transparent blur-3xl" />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-200/70 bg-amber-50/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
            Limited time: yearly plans at 40% off
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
              Pricing that scales with every Pineapple.
            </h1>
            <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
              Subscribe once and unlock every Pineapple editing model, from
              style transfer to high-fidelity finishing. Upgrade anytime, cancel
              whenever, and keep your links.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 rounded-full border border-border/60 bg-card/80 p-2 shadow-sm">
            <span className="flex items-center gap-2 rounded-full bg-amber-100/80 px-3 py-1 text-xs font-semibold text-amber-800">
              <Sparkles className="size-4" />
              Monthly subscription
            </span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <div className="rounded-3xl border border-border/70 bg-card/90 p-8 shadow-sm">
            <h2 className="text-3xl font-semibold text-foreground">
              {plan.name}
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              {plan.description}
            </p>
            <div className="mt-6 flex items-end gap-3">
              <span className="text-5xl font-semibold text-foreground">
                ${plan.price}
              </span>
              <span className="text-sm text-muted-foreground">per month</span>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-medium text-amber-700">
              <span className="rounded-full bg-amber-100/80 px-2 py-1">
                {plan.credits}
              </span>
              <span className="rounded-full bg-amber-100/80 px-2 py-1">
                {plan.bonus}
              </span>
            </div>
            <ul className="mt-6 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <Check className="mt-0.5 size-4 text-amber-600" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex h-full flex-col rounded-3xl border border-amber-200/80 bg-amber-50/60 p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-foreground">
              Start your subscription
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Use your Creem checkout to activate instantly. You can cancel
              anytime from your billing portal.
            </p>
            <div className="mt-6">
              {canCheckout ? (
                <CreemCheckout
                  productId={productId ?? undefined}
                  customer={
                    userEmail
                      ? {
                          email: userEmail,
                          name: userName ?? userEmail,
                        }
                      : undefined
                  }
                  referenceId={userId ?? undefined}
                  successUrl="/success?plan=monthly"
                  metadata={{
                    plan: 'monthly',
                  }}
                >
                  <Button className="w-full bg-amber-500 text-amber-950 hover:bg-amber-400">
                    Subscribe now
                  </Button>
                </CreemCheckout>
              ) : (
                <Button className="w-full" variant="outline" disabled>
                  Add product ID in .env.local
                </Button>
              )}
              <p className="mt-3 text-xs text-muted-foreground">
                Secure checkout by Creem. Cancel anytime.
              </p>
            </div>
            <div className="mt-8 rounded-2xl border border-amber-200/70 bg-white/70 p-4 text-sm text-amber-900">
              Need annual billing or invoices? Contact us for a custom plan.
            </div>
          </div>
        </div>

        <div className="grid gap-6 rounded-3xl border border-border/70 bg-card/80 p-6 lg:grid-cols-[1.2fr_1fr] lg:p-10">
          <div className="flex flex-col gap-4">
            <h3 className="text-2xl font-semibold text-foreground">
              Built for teams that ship visuals at speed.
            </h3>
            <p className="text-sm text-muted-foreground">
              Every plan includes unlimited prompt history, export tracking, and
              shared workspaces. Pineapple credits are shared across your
              organization so every seat stays productive.
            </p>
          </div>
          <div className="flex flex-col gap-4 text-sm text-muted-foreground">
            <div className="flex items-start gap-3">
              <span className="text-lg font-semibold text-foreground">24h</span>
              <span>Support response time for Pro and Max.</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-lg font-semibold text-foreground">99%</span>
              <span>Workflow uptime with parallel render queues.</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-lg font-semibold text-foreground">4x</span>
              <span>Faster revisions with saved style stacks.</span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {[
            {
              title: 'Do I keep my links after canceling?',
              body: 'Yes. Your exports and share links remain online. You can resume anytime.',
            },
            {
              title: 'Can I switch plans mid-cycle?',
              body: 'Absolutely. Upgrades apply immediately, downgrades start next cycle.',
            },
            {
              title: 'Is yearly billing required?',
              body: 'No. Monthly stays flexible, yearly saves 40% for longer commitments.',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-border/70 bg-card/80 p-5 text-sm text-muted-foreground"
            >
              <p className="text-base font-semibold text-foreground">
                {item.title}
              </p>
              <p className="mt-2">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
