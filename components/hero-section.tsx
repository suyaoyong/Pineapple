"use client"

import { Button } from "@/components/ui/button"
import { BananaIcon } from "@/components/banana-icon"
import { BananaDecoration } from "@/components/banana-decoration"
import { ArrowRight, Sparkles, Images, MessageSquare } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Pineapple decorations */}
      <BananaDecoration className="w-32 h-32 -top-4 -left-8" rotate={-30} />
      <BananaDecoration className="w-24 h-24 top-20 right-10" rotate={45} />
      <BananaDecoration className="w-40 h-40 bottom-10 -right-10" rotate={15} />

      {/* Pro banner */}
      <div className="flex justify-center mb-8">
        <Link
          href="#generator"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-100 border border-yellow-300 text-yellow-800 text-sm font-medium hover:bg-yellow-200 transition-colors"
        >
          <span className="text-lg">Pineapple</span>
          <BananaIcon className="w-5 h-5" />
          <span>Pineapple Pro is now live</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Badge */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-400/20 border border-yellow-400/40 text-yellow-700">
          <span className="text-sm font-semibold">Pineapple</span>
          <span className="text-sm font-medium">The AI model that outperforms Flux Kontext</span>
          <Link href="#generator" className="text-sm font-semibold hover:underline">
            Try Now
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto text-center px-4">
        <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 text-balance">Pineapple</h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
          Transform any image with simple text prompts. Pineapple&apos;s advanced model delivers consistent character
          editing and scene preservation that surpasses Flux Kontext. Experience the future of AI image editing.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Button size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-semibold px-8" asChild>
            <Link href="#generator">
              Start Editing
              <BananaIcon className="w-5 h-5 ml-2" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="#showcase">View Examples</Link>
          </Button>
        </div>

        {/* Feature badges */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span className="text-sm">One-shot editing</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground">
            <Images className="w-4 h-4 text-yellow-500" />
            <span className="text-sm">Multi-image support</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground">
            <MessageSquare className="w-4 h-4 text-yellow-500" />
            <span className="text-sm">Natural language</span>
          </div>
        </div>
      </div>
    </section>
  )
}
