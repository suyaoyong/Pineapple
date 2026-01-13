"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, ImageIcon, Copy, Sparkles, Lock, ArrowRight, X } from "lucide-react"
import { BananaIcon } from "@/components/banana-icon"
import Link from "next/link"

export function EditorSection() {
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [prompt, setPrompt] = useState("")
  const [model, setModel] = useState("nano-banana")
  const [mode, setMode] = useState<"image-to-image" | "text-to-image">("image-to-image")
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const fileToPngDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onerror = () => reject(new Error("Failed to read image."))
      reader.onload = () => {
        if (!reader.result || typeof reader.result !== "string") {
          reject(new Error("Failed to read image data."))
          return
        }
        if (file.type === "image/png") {
          resolve(reader.result)
          return
        }
        const img = new Image()
        img.onerror = () => reject(new Error("Failed to decode image."))
        img.onload = () => {
          const canvas = document.createElement("canvas")
          canvas.width = img.naturalWidth || img.width
          canvas.height = img.naturalHeight || img.height
          const ctx = canvas.getContext("2d")
          if (!ctx) {
            reject(new Error("Failed to process image."))
            return
          }
          ctx.drawImage(img, 0, 0)
          resolve(canvas.toDataURL("image/png"))
        }
        img.src = reader.result
      }
      reader.readAsDataURL(file)
    })

  const addImageFile = async (file: File) => {
    if (uploadedImages.length >= 9) return
    if (!file.type.startsWith("image/")) return
    try {
      const dataUrl = await fileToPngDataUrl(file)
      setUploadedImages((prev) => {
        if (prev.length < 9) {
          return [...prev, dataUrl]
        }
        return prev
      })
    } catch {
      setErrorMessage("Only image files are supported. Please try another file.")
    }
  }

  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files && files.length > 0) {
        Array.from(files).forEach((file) => {
          void addImageFile(file)
        })
      }
    },
    [uploadedImages.length],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const files = e.dataTransfer.files
      if (files && files.length > 0) {
        Array.from(files).forEach((file) => {
          void addImageFile(file)
        })
      }
    },
    [uploadedImages.length],
  )

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleGenerate = async () => {
    const trimmedPrompt = prompt.trim()
    if (!trimmedPrompt) {
      setErrorMessage("Please enter a prompt before generating.")
      return
    }

    if (mode === "image-to-image" && uploadedImages.length === 0) {
      setErrorMessage("Please upload at least one image for image-to-image mode.")
      return
    }

    setIsGenerating(true)
    setErrorMessage(null)

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          prompt: trimmedPrompt,
          model,
          images: uploadedImages,
        }),
      })

      const data = (await response.json()) as { image?: string; error?: string }
      if (!response.ok) {
        setErrorMessage(data.error || "Generation failed. Please try again.")
        return
      }

      if (data.image) {
        setGeneratedImage(data.image)
      } else {
        setErrorMessage("No image returned. Please try again.")
      }
    } catch (error) {
      setErrorMessage("Network error. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <section id="generator" className="py-20 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-yellow-600 font-medium mb-2">Get Started</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Try The AI Editor</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience the power of Pineapple&apos;s natural language image editing. Transform any photo with simple
            text commands
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Editor Panel */}
          <Card className="border-2">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                <h3 className="font-semibold text-lg">Prompt Engine</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-6">Transform your image with AI-powered editing</p>

              {/* Mode Tabs */}
              <Tabs value={mode} onValueChange={(value) => setMode(value as typeof mode)} className="mb-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="image-to-image">Image to Image</TabsTrigger>
                  <TabsTrigger value="text-to-image">Text to Image</TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Model Selection */}
              <div className="mb-6">
                <Label className="text-sm font-medium mb-2 block">AI Model Selection</Label>
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nano-banana">
                      <div className="flex items-center gap-2">
                        <BananaIcon className="w-4 h-4" />
                        Pineapple
                      </div>
                    </SelectItem>
                    <SelectItem value="nano-banana-pro">
                      <div className="flex items-center gap-2">
                        <BananaIcon className="w-4 h-4" />
                        Pineapple Pro
                      </div>
                    </SelectItem>
                    <SelectItem value="seedream">SeeDream 4</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  Different models offer unique characteristics and styles
                </p>
              </div>

              {/* Batch Processing Toggle */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Batch Processing</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-yellow-400 text-yellow-950 font-medium">Pro</span>
                </div>
                <div className="flex items-center gap-2">
                  <Switch disabled />
                  <Lock className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>

              {/* Image Upload */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Reference Image</Label>
                  <span className="text-xs text-muted-foreground">{uploadedImages.length}/9</span>
                </div>

                {/* Uploaded images grid */}
                {uploadedImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {uploadedImages.map((img, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden border">
                        <img
                          src={img || "/placeholder.svg"}
                          alt={`Uploaded ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 p-1 rounded-full bg-background/80 hover:bg-background"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  className="border-2 border-dashed rounded-lg p-6 text-center hover:border-yellow-400 transition-colors cursor-pointer"
                >
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm font-medium">Add Image</p>
                    <p className="text-xs text-muted-foreground">JPG/PNG supported (auto-convert to PNG)</p>
                  </label>
                </div>
              </div>

              {/* Prompt Input */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Main Prompt</Label>
                  <button className="text-muted-foreground hover:text-foreground">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <Textarea
                  placeholder="Describe what you want to create or edit..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[100px] resize-none"
                />
              </div>

              {/* CTA Link */}
              <div className="text-center mb-6">
                <Link href="#" className="text-sm text-yellow-600 hover:text-yellow-700 inline-flex items-center gap-1">
                  Want more powerful image generation features?
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Generate Button */}
              <Button
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-semibold"
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <span className="animate-spin mr-2">🍍</span>
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Now
                  </>
                )}
              </Button>
              {errorMessage ? <p className="mt-3 text-sm text-red-600">{errorMessage}</p> : null}
            </CardContent>
          </Card>

          {/* Output Gallery */}
          <Card className="border-2">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <ImageIcon className="w-5 h-5 text-yellow-500" />
                <h3 className="font-semibold text-lg">Output Gallery</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-6">Your ultra-fast AI creations appear here instantly</p>

              <div className="aspect-square rounded-lg bg-secondary/50 border-2 border-dashed flex items-center justify-center">
                {generatedImage ? (
                  <img
                    src={generatedImage || "/placeholder.svg"}
                    alt="Generated"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="text-center p-8">
                    <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4">
                      <BananaIcon className="w-8 h-8" />
                    </div>
                    <p className="font-medium text-foreground mb-2">Ready for instant generation</p>
                    <p className="text-sm text-muted-foreground">Enter your prompt and unleash the power</p>
                  </div>
                )}
              </div>

              <div className="text-center mt-6">
                <Link href="#" className="text-sm text-yellow-600 hover:text-yellow-700 inline-flex items-center gap-1">
                  Visit Full Generator
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
