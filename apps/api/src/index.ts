import { Hono } from 'hono'
import { cors } from 'hono/cors'
import OpenAI from 'openai'

const app = new Hono()

app.use('/*', cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'X-API-Key'],
}))

app.get('/', (c) => {
  return c.json({ message: 'Z-Image API is running' })
})

app.post('/generate', async (c) => {
  const apiKey = c.req.header('X-API-Key')
  if (!apiKey) {
    return c.json({ error: 'API Key is required' }, 401)
  }

  const body = await c.req.json<{
    prompt: string
    negative_prompt: string
    model: string
    width: number
    height: number
    num_inference_steps: number
  }>()

  const client = new OpenAI({
    baseURL: 'https://ai.gitee.com/v1',
    apiKey: apiKey.trim(),
  })

  const response = await client.images.generate({
    prompt: body.prompt,
    model: body.model,
    size: `${body.width}x${body.height}` as '1024x1024',
    // @ts-expect-error extra_body is supported by OpenAI SDK
    extra_body: {
      negative_prompt: body.negative_prompt,
      num_inference_steps: body.num_inference_steps,
    },
  })

  const imageData = response.data?.[0]
  if (!imageData) {
    return c.json({ error: 'No image returned from API' }, 500)
  }

  return c.json({
    url: imageData.url,
    b64_json: imageData.b64_json,
  })
})

export default app
