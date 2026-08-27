import { NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import cloudinary from '@/lib/cloudinary';
import { UploadApiResponse } from 'cloudinary';
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

    // Check file size limit (10MB for Cloudinary)
    const MAX_SIZE_BYTES = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'Ukuran file gambar terlalu besar. Maksimal ukuran file adalah 10 MB.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 1. Attempt Cloudinary Upload if credentials exist
    if (
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    ) {
      try {
        const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: `rts/${folder}`,
              resource_type: 'auto',
              transformation: [{ quality: 'auto', fetch_format: 'auto' }],
            },
            (error, result) => {
              if (error || !result) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );
          uploadStream.end(buffer);
        });

        if (uploadResult?.secure_url) {
          return NextResponse.json({
            url: uploadResult.secure_url,
            success: true,
            storage: 'cloudinary',
            public_id: uploadResult.public_id,
          });
        }
      } catch (cloudErr) {
        console.error('Cloudinary upload error:', cloudErr);
      }
    }

    // 2. Resilient Fallback: Local upload for dev
    if (process.env.NODE_ENV === 'development') {
      try {
        const safeFilename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
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

    // 3. Base64 fallback for preview
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
