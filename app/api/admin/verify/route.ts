import { NextRequest, NextResponse } from 'next/server'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json(
        { error: 'Şifre gerekli' },
        { status: 400 }
      )
    }

    console.log('[v0] Admin login attempt')
    
    if (password === ADMIN_PASSWORD) {
      console.log('[v0] Admin login successful')
      return NextResponse.json({ success: true })
    } else {
      console.log('[v0] Admin login failed - wrong password')
      return NextResponse.json(
        { error: 'Hatalı şifre' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('[v0] Admin verify error:', error)
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}
