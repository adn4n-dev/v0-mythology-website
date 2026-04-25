import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET - List published magazines (public)
export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('magazines')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

// POST - Create magazine record (admin only)
export async function POST(request: NextRequest) {
  const adminToken = request.headers.get('x-admin-token')
  if (adminToken !== 'verified') {
    return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { title, description, issue_number, pdf_url, cover_url, is_published } = body

    if (!title || !pdf_url) {
      return NextResponse.json({ error: 'Başlık ve PDF zorunludur' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('magazines')
      .insert({
        title,
        description: description || '',
        issue_number: issue_number || '',
        pdf_url,
        cover_url: cover_url || '',
        is_published: is_published ?? true,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
