import jsonServer from 'json-server'
import { watch, readFileSync } from 'fs'

const AI_MODEL = process.env.AI_MODEL || 'qwen2.5:7b'
const AI_BASE_URL = process.env.AI_BASE_URL || 'http://127.0.0.1:11434/v1/chat/completions'

const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

server.use(middlewares)
server.use(jsonServer.bodyParser)

async function callOllama(prompt) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 30000)

  try {
    const response = await fetch(AI_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000
      }),
      signal: controller.signal
    })
    clearTimeout(timeout)

    if (!response.ok) {
      const errText = await response.text()
      throw new Error(`AI 服务异常: ${response.status}`)
    }

    const data = await response.json()
    return data.choices[0].message.content
  } catch (err) {
    clearTimeout(timeout)
    throw err
  }
}

// ─── AI: 优化需求描述 ───
server.post('/ai/optimize-description', async (req, res) => {
  try {
    const { description } = req.body
    if (!description || description.length < 3) {
      return res.status(400).json({ error: '描述不能少于3个字' })
    }

    const prompt = `你是一位专业的约稿需求优化助手。请帮用户优化以下约稿需求描述，使其更加清晰、详细、专业，方便画师理解。

要求：
1. 保留原始需求的所有关键信息
2. 补充细节让描述更完整
3. 使用自然流畅的中文
4. 不要编造用户没有提到的信息
5. 直接输出优化后的内容，不要加任何前缀

原始描述：
${description}`

    const result = await callOllama(prompt)
    res.json({ result })

  } catch (err) {
    if (err.name === 'AbortError') {
      return res.status(504).json({ error: 'AI 请求超时，请重试' })
    }
    console.error('AI optimize error:', err)
    res.status(500).json({ error: '优化失败，请稍后重试' })
  }
})

// ─── AI: 生成回复建议 ───
server.post('/ai/reply-suggestion', async (req, res) => {
  try {
    const { customerName, commissionType, description, budget } = req.body
    if (!customerName) {
      return res.status(400).json({ error: '缺少客户名称' })
    }

    const prompt = `你是一位专业的画师，正在回复客户的约稿咨询。请根据以下订单信息，生成一段礼貌、专业的回复建议。

订单信息：
- 客户名称：${customerName}
- 约稿类型：${commissionType}
- 需求描述：${description}
- 预算：¥${budget}

要求：
1. 语气亲切礼貌
2. 针对客户的具体需求进行回复
3. 表达愿意合作的意愿，说明下一步计划
4. 如果预算明显偏低，委婉说明但保持专业
5. 直接输出回复内容，不要加任何前缀`

    const result = await callOllama(prompt)
    res.json({ result })

  } catch (err) {
    if (err.name === 'AbortError') {
      return res.status(504).json({ error: 'AI 请求超时，请重试' })
    }
    console.error('AI reply error:', err)
    res.status(500).json({ error: '生成失败，请稍后重试' })
  }
})

// ─── JSON Server 路由 ───
server.use(router)

// 监视 db.json 变化自动重载
watch('db.json', () => {
  try {
    const fresh = JSON.parse(readFileSync('db.json', 'utf-8'))
    router.db.setState(fresh)
    console.log('db.json 已重新加载')
  } catch (e) {
    console.error('重新加载 db.json 失败:', e.message)
  }
})

server.listen(3000, () => {
  console.log(`服务已启动 → http://localhost:3000 (AI 模型: ${AI_MODEL})`)
})
