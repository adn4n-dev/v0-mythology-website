import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')

    let query = supabase
      .from('articles')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })

    if (featured === 'true') {
      query = query.eq('is_featured', true)
    }

    const { data, error } = await query

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

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('x-admin-token')
    if (!token) {
      return NextResponse.json(
        { error: 'Yetkisiz erişim' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, description, content, slug, category, is_featured, is_published } = body

    if (!title || !description || !slug) {
      return NextResponse.json(
        { error: 'Gerekli alanlar eksik' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('articles')
      .insert([
        {
          title,
          description,
          content: content || '',
          slug,
          category: category || 'Genel',
          is_featured: is_featured || false,
          is_published: is_published !== false,
        },
      ])
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data?.[0], { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Makale eklenemedi' },
      { status: 500 }
    )
  }
}
