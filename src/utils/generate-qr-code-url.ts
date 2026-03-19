import { toDataURL } from 'qrcode'

export const generateQRCodeUrl = async (certificateURL: string) => {
  try {
    new URL(certificateURL)
  } catch {
    throw new Error('La URL del certificado no es válida.')
  }

  try {
    const qrCode = await toDataURL(certificateURL, {
      color: {
        light: '#0d0d0d',
        dark: '#f7df1e',
      },
    })

    return qrCode
  } catch (err) {
    console.error({ certificateError: err })
    throw new Error('No se pudo generar el QR del certificado.')
  }
}
