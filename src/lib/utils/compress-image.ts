/**
 * Compress and convert image to WebP using browser Canvas API.
 * Falls back to original file on unsupported browsers (e.g. in-app browsers).
 */
export async function compressImage(
  file: File,
  { maxWidth = 1200, maxHeight = 1200, quality = 0.8 } = {}
): Promise<File> {
  if (!file.type.startsWith('image/')) return file

  try {
    const bitmap = await createImageBitmap(file)
    let { width, height } = bitmap

    if (width > maxWidth || height > maxHeight) {
      const ratio = Math.min(maxWidth / width, maxHeight / height)
      width = Math.round(width * ratio)
      height = Math.round(height * ratio)
    }

    const canvas = new OffscreenCanvas(width, height)
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(bitmap, 0, 0, width, height)
    bitmap.close()

    const blob = await canvas.convertToBlob({ type: 'image/webp', quality })
    const name = file.name.replace(/\.[^.]+$/, '.webp')
    return new File([blob], name, { type: 'image/webp' })
  } catch {
    // OffscreenCanvas or convertToBlob not supported — return original
    return file
  }
}
