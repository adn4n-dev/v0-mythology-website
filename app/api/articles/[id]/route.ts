import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .eq('is_published', true)
      .single()

    if (error || !data) {
      return NextResponse.json(
        { error: 'Makale bulunamadı' },
        { status: 404 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Makale yüklenemedi' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.headers.get('x-admin-token')
    if (!token) {
      return NextResponse.json(
        { error: 'Yetkisiz erişim' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const { title, description, content, category, is_featured, is_published } = body

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('articles')
      .update({
        title,
        description,
        content,
        category,
        is_featured,
        is_published,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data?.[0])
  } catch (error) {
    return NextResponse.json(
      { error: 'Makale güncellenemedi' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.headers.get('x-admin-token')
    if (!token) {
      return NextResponse.json(
        { error: 'Yetkisiz erişim' },
        { status: 401 }
      )
    }

    const { id } = await params
    const supabase = await createClient()

    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Makale silinemedi' },
      { status: 500 }
    )
  }
}
