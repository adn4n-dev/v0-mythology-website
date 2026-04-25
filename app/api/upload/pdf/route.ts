import { put } from '@vercel/blob'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const title = formData.get('title') as string

    if (!file) {
      return NextResponse.json({ error: 'Dosya yüklenemedi' }, { status: 400 })
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Sadece PDF dosyaları kabul edilir' }, { status: 400 })
    }

    const filename = `magazines/${Date.now()}-${file.name}`

    const blob = await put(filename, file, {
      access: 'public',
    })

    return NextResponse.json({ 
      url: blob.url,
      pathname: blob.pathname,
      filename: blob.filename
    })
  } catch (error) {
    console.error('[v0] PDF upload error:', error)
    return NextResponse.json({ error: 'Upload başarısız' }, { status: 500 })
  }
}
