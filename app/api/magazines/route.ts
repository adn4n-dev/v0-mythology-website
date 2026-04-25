import { createClient } from '@/lib/supabase/server'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('magazines')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[v0] Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('[v0] Error fetching magazines:', error)
    return NextResponse.json({ error: 'Dergiler yüklenemedi' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, description, pdf_url, issue_number, is_published } = await request.json()
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('magazines')
      .insert({
        title,
        description,
        pdf_url,
        issue_number,
        is_published,
      })
      .select()

    if (error) {
      console.error('[v0] Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data[0])
  } catch (error) {
    console.error('[v0] Error creating magazine:', error)
    return NextResponse.json({ error: 'Dergi oluşturulamadı' }, { status: 500 })
  }
}
