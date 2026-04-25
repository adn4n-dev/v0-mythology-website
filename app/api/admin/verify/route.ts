import { NextRequest, NextResponse } from 'next/server';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

export async function POST(request: NextRequest) {
  try {
    if (!ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Admin şifresi yapılandırılmamış' },
        { status: 500 }
      )
    }

    const { password } = await request.json()

    if (!password) {
      return NextResponse.json(
        { error: 'Şifre gerekli' },
        { status: 400 }
      )
    }

    if (password === ADMIN_PASSWORD) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { error: 'Hatalı şifre' },
        { status: 401 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}
