import imageCompression from 'browser-image-compression'

/**
 * Comprime una foto en el navegador antes de subirla:
 * máximo 1200 px por lado, formato JPG (funciona en todos los celulares),
 * calidad ~80 % y peso final de unos 300 KB como máximo.
 */
export async function compressImage(file: File): Promise<File> {
  return imageCompression(file, {
    maxSizeMB: 0.3,
    maxWidthOrHeight: 1200,
    useWebWorker: true,
    fileType: 'image/jpeg',
    initialQuality: 0.8,
  })
}
