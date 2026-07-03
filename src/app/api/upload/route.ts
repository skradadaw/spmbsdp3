import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string

    if (!file) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 })
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Ukuran file maksimal 5MB' }, { status: 400 })
    }

    const supabase = await createClient()

    // Generate unique file name: type_timestamp_random.ext
    const ext = file.name.split('.').pop()
    const fileName = `${type}_${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`

    // Upload to 'dokumen-spmb' bucket
    const { data, error } = await supabase.storage
      .from('dokumen-spmb')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      console.error('Supabase upload error:', error)
      return NextResponse.json({ error: 'Gagal mengunggah file ke Storage' }, { status: 500 })
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('dokumen-spmb')
      .getPublicUrl(fileName)

    return NextResponse.json({ url: publicUrlData.publicUrl, fileName }, { status: 200 })

  } catch (error) {
    console.error('Upload handler error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
