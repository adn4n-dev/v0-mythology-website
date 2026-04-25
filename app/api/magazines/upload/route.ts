import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const adminToken = request.headers.get('x-admin-token')
  if (adminToken !== 'verified') {
    return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string // 'pdf' or 'cover'

    if (!file) {
      return NextResponse.json({ error: 'Dosya bulunamadı' }, { status: 400 })
    }

    const supabase = await createClient()
    const ext = file.name.split('.').pop()
    const fileName = `${type}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    const { data, error } = await supabase.storage
      .from('magazines')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const { data: { publicUrl } } = supabase.storage
      .from('magazines')
      .getPublicUrl(data.path)

    return NextResponse.json({ url: publicUrl, path: data.path })
  } catch (error) {
    return NextResponse.json({ error: 'Yükleme hatası' }, { status: 500 })
  }
}
