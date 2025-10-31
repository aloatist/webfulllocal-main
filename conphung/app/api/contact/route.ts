import { NextRequest, NextResponse } from 'next/server'
import { sendN8nEvent } from '@/lib/integrations/n8n-client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, subject, message } = body

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Vui lòng điền đầy đủ thông tin bắt buộc' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email không hợp lệ' },
        { status: 400 }
      )
    }

    // Save to database (create ContactMessage model if needed)
    // For now, we'll just log it
    console.log('Contact form submission:', {
      name,
      email,
      phone,
      subject,
      message,
      createdAt: new Date(),
    })

    // Trigger automation via n8n (fire-and-forget)
    sendN8nEvent(
      'contact-form',
      {
        name,
        email,
        phone: phone ?? null,
        subject: subject ?? null,
        message,
      },
      {
        context: {
          trigger: 'contact-form',
        },
      },
    ).catch((error) => {
      console.warn('n8n contact-form webhook failed:', error)
    })

    return NextResponse.json(
      { 
        success: true,
        message: 'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.' 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Có lỗi xảy ra. Vui lòng thử lại sau.' },
      { status: 500 }
    )
  }
}
