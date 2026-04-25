import { createClient } from '@/lib/supabase/server'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('magazines')
      .select('*')
      .eq('id', id)
      .eq('is_published', true)
      .single()

    if (error) {
      console.error('[v0] Supabase error:', error)
      return NextResponse.json({ error: 'Dergi bulunamadı' }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('[v0] Error fetching magazine:', error)
    return NextResponse.json({ error: 'Dergi yüklenemedi' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { title, description, issue_number, is_published } = await request.json()
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('magazines')
      .update({
        title,
        description,
        issue_number,
        is_published,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()

    if (error) {
      console.error('[v0] Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data[0])
  } catch (error) {
    console.error('[v0] Error updating magazine:', error)
    return NextResponse.json({ error: 'Dergi güncellenemedi' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { error } = await supabase
      .from('magazines')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('[v0] Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] Error deleting magazine:', error)
    return NextResponse.json({ error: 'Dergi silinemedi' }, { status: 500 })
  }
}
