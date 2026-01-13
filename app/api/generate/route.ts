import { NextResponse } from "next/server"
import { ProxyAgent, setGlobalDispatcher } from "undici"

const OPENAI_API_URL = process.env.OPENAI_BASE_URL?.replace(/\/$/, "") ?? "https://api.openai.com/v1/images"
const REQUEST_TIMEOUT_MS = Number.parseInt(process.env.OPENAI_TIMEOUT_MS ?? "20000", 10)
const PROXY_URL =
  process.env.HTTPS_PROXY ?? process.env.HTTP_PROXY ?? process.env.ALL_PROXY ?? process.env.https_proxy ?? process.env.http_proxy
const SHOULD_USE_PROXY = Boolean(PROXY_URL && process.env.OPENAI_DISABLE_PROXY !== "1")
if (SHOULD_USE_PROXY && PROXY_URL) {
  setGlobalDispatcher(new ProxyAgent(PROXY_URL))
}
const FALLBACK_MODEL = "dall-e-2"
const MODEL_MAP: Record<string, string> = {
  "nano-banana": "dall-e-2",
  "nano-banana-pro": "dall-e-2",
  seedream: "dall-e-3",
}

type GenerateRequest = {
  mode?: "image-to-image" | "text-to-image"
  prompt?: string
  model?: string
  images?: string[]
}

function resolveModel(model?: string) {
  if (!model) return FALLBACK_MODEL
  return MODEL_MAP[model] ?? FALLBACK_MODEL
}

function parseDataUrl(dataUrl: string) {
  const match = /^data:(.+);base64,(.+)$/.exec(dataUrl)
  if (!match) return null
  const [, mime, base64] = match
  const buffer = Buffer.from(base64, "base64")
  return { mime, buffer }
}

async function parseErrorResponse(response: Response) {
  try {
    const data = await response.json()
    if (data?.error?.message) return data.error.message as string
    return JSON.stringify(data)
  } catch {
    return await response.text()
  }
}

export async function POST(req: Request) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: "Missing OPENAI_API_KEY." }, { status: 500 })
  }

  const body = (await req.json()) as GenerateRequest
  const mode = body.mode ?? "text-to-image"
  const prompt = body.prompt?.trim() ?? ""
  const model = resolveModel(body.model)
  const images = Array.isArray(body.images) ? body.images : []

  if (!prompt) {
    return NextResponse.json({ error: "Prompt is required." }, { status: 400 })
  }

  if (mode === "image-to-image" && images.length === 0) {
    return NextResponse.json({ error: "At least one image is required." }, { status: 400 })
  }

  const isDalle = model.startsWith("dall-e")

  if (mode === "image-to-image") {
    const editModel = isDalle ? "dall-e-2" : model
    const imageInputs = images.slice(0, 1)
    const form = new FormData()
    form.append("model", editModel)
    form.append("prompt", prompt)
    if (editModel.startsWith("dall-e")) {
      form.append("response_format", "b64_json")
    } else {
      form.append("output_format", "png")
    }

    let attached = 0
    for (const dataUrl of imageInputs) {
      const parsed = parseDataUrl(dataUrl)
      if (!parsed) continue
      const blob = new Blob([parsed.buffer], { type: parsed.mime })
      form.append("image", blob, `upload-${attached + 1}.png`)
      attached += 1
    }

    if (attached === 0) {
      return NextResponse.json({ error: "No valid images to upload." }, { status: 400 })
    }

    const response = await fetch(`${OPENAI_API_URL}/edits`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: form,
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    })

    if (!response.ok) {
      const message = await parseErrorResponse(response)
      return NextResponse.json({ error: message }, { status: response.status })
    }

    const data = (await response.json()) as { data?: { b64_json?: string }[] }
    const b64 = data?.data?.[0]?.b64_json
    if (!b64) {
      return NextResponse.json({ error: "No image returned from OpenAI." }, { status: 502 })
    }

    return NextResponse.json({ image: `data:image/png;base64,${b64}` })
  }

  const response = await fetch(`${OPENAI_API_URL}/generations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      prompt,
      n: 1,
      size: "1024x1024",
      ...(isDalle ? { response_format: "b64_json" } : { output_format: "png" }),
    }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  })

  if (!response.ok) {
    const message = await parseErrorResponse(response)
    return NextResponse.json({ error: message }, { status: response.status })
  }

  const data = (await response.json()) as { data?: { b64_json?: string }[] }
  const b64 = data?.data?.[0]?.b64_json
  if (!b64) {
    return NextResponse.json({ error: "No image returned from OpenAI." }, { status: 502 })
  }

  return NextResponse.json({ image: `data:image/png;base64,${b64}` })
}
