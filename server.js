import jsonServer from 'json-server'
import { watch, readFileSync } from 'fs'

const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

server.use(middlewares)
server.use(jsonServer.bodyParser)

// ─── AI: 优化需求描述 ───
server.post('/ai/optimize-description', async (req, res) => {
  try {
    const { description } = req.body
    if (!description || description.length < 3) {
      return res.status(400).json({ error: '描述不能少于3个字' })
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return res.json({
        result: `【优化后的需求描述】\n\n${description}\n\n---\n（当前为模拟模式，设置 ANTHROPIC_API_KEY 环境变量可获取真实 AI 优化）`
      })
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

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 30000)

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      }),
      signal: controller.signal
    })
    clearTimeout(timeout)

    if (!response.ok) {
      const errText = await response.text()
      return res.status(502).json({ error: `AI 服务异常: ${response.status}` })
    }

    const data = await response.json()
    res.json({ result: data.content[0].text })

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

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return res.json({
        result: `您好 ${customerName}，感谢您的委托咨询！

关于您需求的 ${commissionType} 项目，我仔细阅读了您的描述，感觉非常契合我的创作方向，很愿意承接这个委托。

根据您的需求，我建议按以下流程推进：
1. 草稿阶段：我先出 2-3 版构图草稿供您选择
2. 线稿阶段：确认构图后进入精细线稿
3. 上色阶段：完成上色并根据您的反馈进行修改

您当前预算 ¥${budget}，在我的报价范围内。如果您有更多参考图或细节想法，随时补充！

期待与您的合作！`
      })
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

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 30000)

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      }),
      signal: controller.signal
    })
    clearTimeout(timeout)

    if (!response.ok) {
      const errText = await response.text()
      return res.status(502).json({ error: `AI 服务异常: ${response.status}` })
    }

    const data = await response.json()
    res.json({ result: data.content[0].text })

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
  console.log('服务已启动 → http://localhost:3000 (含 AI 端点)')
})
