import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '../../../../../lib/jwt'

const DOU_BAO_API_KEY = process.env.DOU_BAO_API_KEY || 'fd2ce0fe-f8f7-4bf4-8f00-e0be98fa4bdf'
const DOU_BAO_ENDPOINT_ID = process.env.DOU_BAO_ENDPOINT_ID || 'ep-20240520091346-f7r6g'
const DOU_BAO_API_URL = process.env.DOU_BAO_API_URL || 'https://ark.cn-beijing.volces.com/api/v3/chat/completions'

async function getUser(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  const decoded = verifyToken(token)

  if (!decoded) {
    return null
  }

  return decoded
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUser(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { message, context } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Prepare messages for AI
    const systemMessage = {
      role: 'system',
      content: `你是一个专业的图书推荐和阅读助手。你的任务是：
1. 根据用户的图书收藏和阅读历史，为用户推荐合适的书籍
2. 回答用户关于书籍内容、作者、主题的问题
3. 提供阅读建议和读书方法
4. 帮助用户整理和管理图书信息

用户的图书信息：${context ? JSON.stringify(context) : '暂无图书信息'}

请用简洁、友好的语言回答用户问题。`
    }

    const userMessage = {
      role: 'user',
      content: message
    }

    const messages = [systemMessage, userMessage]

    // Call Douyin AI API
    const response = await fetch(DOU_BAO_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DOU_BAO_API_KEY}`,
      },
      body: JSON.stringify({
        model: DOU_BAO_ENDPOINT_ID,
        messages,
        max_tokens: 2000,
        temperature: 0.7
      }),
    })

    if (!response.ok) {
      throw new Error(`AI API error: ${response.status}`)
    }

    const aiResponse = await response.json()
    const aiMessage = aiResponse.choices?.[0]?.message?.content

    if (!aiMessage) {
      throw new Error('No response from AI')
    }

    return NextResponse.json({ 
      message: aiMessage,
      success: true 
    })

  } catch (error) {
    console.error('AI chat error:', error)
    return NextResponse.json(
      { error: 'Failed to get AI response' },
      { status: 500 }
    )
  }
}