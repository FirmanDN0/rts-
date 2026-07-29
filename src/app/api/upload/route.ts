import { NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import { getSupabaseClient } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const isAuthorized = await checkAuth(request);
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized: Harap login terlebih dahulu' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'general';

    if (!file) {
      return NextResponse.json({ error: 'File gambar tidak ditemukan' }, { status: 400 });
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Format file tidak didukung. Harap upload file gambar (JPG, PNG, WEBP, GIF, SVG).' },
        { status: 400 }
      );
    }

    // Check file size limit (5MB)
    const MAX_SIZE_BYTES = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'Ukuran file gambar terlalu besar. Maksimal ukuran file adalah 5 MB.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const safeFilename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = `${folder}/${safeFilename}`;

    // 1. Attempt upload to Supabase Storage
    const supabase = getSupabaseClient();
    if (supabase) {
      const bucketName = 'rts-uploads';
      
      // Try uploading to Supabase Storage
      let { data, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, buffer, {
          contentType: file.type,
          upsert: true,
        });

      // If bucket doesn't exist, attempt to create bucket then re-upload
      if (uploadError && (uploadError.message?.includes('not found') || uploadError.message?.includes('Bucket'))) {
        try {
          await supabase.storage.createBucket(bucketName, { public: true });
          const retry = await supabase.storage.from(bucketName).upload(filePath, buffer, {
            contentType: file.type,
            upsert: true,
          });
          data = retry.data;
          uploadError = retry.error;
        } catch (bucketErr) {
          console.warn('Bucket creation attempt error:', bucketErr);
        }
      }

      if (!uploadError && data) {
        const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(filePath);
        if (publicUrlData?.publicUrl) {
          return NextResponse.json({
            url: publicUrlData.publicUrl,
            success: true,
            storage: 'supabase',
          });
        }
      } else {
        console.warn('Supabase storage upload notice:', uploadError?.message || uploadError);
      }
    }

    // 2. Resilient Fallback: Local upload for dev or Base64 Data URL
    if (process.env.NODE_ENV === 'development') {
      try {
        const publicUploadDir = path.join(process.cwd(), 'public', 'uploads', folder);
        if (!fs.existsSync(publicUploadDir)) {
          fs.mkdirSync(publicUploadDir, { recursive: true });
        }
        const fullLocalPath = path.join(publicUploadDir, safeFilename);
        fs.writeFileSync(fullLocalPath, buffer);
        const localUrl = `/uploads/${folder}/${safeFilename}`;
        return NextResponse.json({
          url: localUrl,
          success: true,
          storage: 'local',
        });
      } catch (localErr) {
        console.warn('Local file write error:', localErr);
      }
    }

    // Base64 fallback for small image preview/deployment fallback
    const base64Data = buffer.toString('base64');
    const dataUrl = `data:${file.type};base64,${base64Data}`;
    return NextResponse.json({
      url: dataUrl,
      success: true,
      storage: 'inline',
    });

  } catch (error) {
    console.error('Image Upload API Error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server saat memproses gambar.' },
      { status: 500 }
    );
  }
}
