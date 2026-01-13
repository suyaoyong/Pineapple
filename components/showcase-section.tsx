import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Zap } from "lucide-react"
import Link from "next/link"

const showcaseItems = [
  {
    image: "/ai-generated-majestic-mountain-landscape-with-snow.jpg",
    title: "Ultra-Fast Mountain Generation",
    description: "Created in 0.8 seconds with Pineapple's optimized neural engine",
  },
  {
    image: "/ai-generated-beautiful-garden-with-colorful-flower.jpg",
    title: "Instant Garden Creation",
    description: "Complex scene rendered in milliseconds using Pineapple technology",
  },
  {
    image: "/ai-generated-tropical-beach-sunset-with-palm-trees.jpg",
    title: "Real-time Beach Synthesis",
    description: "Pineapple delivers photorealistic results at lightning speed",
  },
  {
    image: "/ai-generated-aurora-borealis-night-sky-over-snowy-.jpg",
    title: "Rapid Aurora Generation",
    description: "Advanced effects processed instantly with Pineapple AI",
  },
]

export function ShowcaseSection() {
  return (
    <section id="showcase" className="py-20 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-yellow-600 font-medium mb-2">Showcase</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Lightning-Fast AI Creations</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">See what Pineapple generates in milliseconds</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {showcaseItems.map((item, index) => (
            <Card key={index} className="overflow-hidden group border-2 hover:border-yellow-400/50 transition-colors">
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-yellow-600 mb-2">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm font-medium">Pineapple Speed</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <p className="text-muted-foreground mb-4">Experience the power of Pineapple yourself</p>
          <Button size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-semibold" asChild>
            <Link href="#generator">Try Pineapple Generator</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
