import { put } from '@vercel/blob'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  console.log('[v0] PDF upload started')
  
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const title = formData.get('title') as string

    console.log('[v0] File received:', file?.name, file?.type, file?.size)

    if (!file) {
      console.log('[v0] No file provided')
      return NextResponse.json({ error: 'Dosya yüklenemedi' }, { status: 400 })
    }

    if (file.type !== 'application/pdf') {
      console.log('[v0] Invalid file type:', file.type)
      return NextResponse.json({ error: 'Sadece PDF dosyaları kabul edilir' }, { status: 400 })
    }

    const filename = `magazines/${Date.now()}-${file.name}`
    console.log('[v0] Uploading to Blob:', filename)

    // Convert File to ArrayBuffer for upload
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    const blob = await put(filename, buffer, {
      access: 'public',
      contentType: 'application/pdf',
    })

    console.log('[v0] Upload successful:', blob.url)

    return NextResponse.json({ 
      url: blob.url,
      pathname: blob.pathname,
      filename: file.name
    })
  } catch (error) {
    console.error('[v0] PDF upload error:', error)
    return NextResponse.json({ 
      error: 'Upload başarısız: ' + (error as Error).message 
    }, { status: 500 })
  }
}
