import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export function getPublicIdFromUrl(url: string): string | null {
  if (!url || typeof url !== 'string' || !url.includes('res.cloudinary.com')) {
    return null;
  }
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname; // e.g. /qnwklkqx/image/upload/v1787792151/rts/services/abc.jpg
    const uploadIndex = pathname.indexOf('/upload/');
    if (uploadIndex === -1) return null;

    const pathAfterUpload = pathname.substring(uploadIndex + '/upload/'.length);
    // filter out version tags (v123456) and transformations (w_500, etc)
    const segments = pathAfterUpload.split('/');
    const cleanSegments = segments.filter(
      (seg) => !/^v\d+$/.test(seg) && !seg.includes(',') && !/^[a-z]_[a-z0-9]+$/.test(seg)
    );
    const fullPathWithExt = cleanSegments.join('/');
    const lastDot = fullPathWithExt.lastIndexOf('.');
    return lastDot !== -1 ? fullPathWithExt.substring(0, lastDot) : fullPathWithExt;
  } catch (e) {
    return null;
  }
}

export async function deleteFromCloudinary(urlOrPublicId: string) {
  if (!urlOrPublicId) return;
  const publicId = urlOrPublicId.includes('res.cloudinary.com')
    ? getPublicIdFromUrl(urlOrPublicId)
    : urlOrPublicId;

  if (!publicId) return;

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (err) {
    console.error(`Error deleting from Cloudinary [${publicId}]:`, err);
  }
}

export default cloudinary;
