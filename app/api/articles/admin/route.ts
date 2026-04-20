import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('x-admin-token')
    if (!token) {
      return NextResponse.json(
        { error: 'Yetkisiz erişim' },
        { status: 401 }
      )
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Makale yüklenemedi' },
      { status: 500 }
    )
  }
}
