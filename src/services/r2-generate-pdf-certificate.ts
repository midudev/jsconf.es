import { generatePDFCertificate } from '@/components/certificate-pdf'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { createHash } from 'node:crypto'

interface Props {
  certificateKey: string
  qrCodeUrl: string
  fullname: string
  certificateURL: string
}

export const r2GeneratePDFCertificate = async ({
  certificateKey,
  qrCodeUrl,
  fullname,
  certificateURL,
}: Props) => {
  const secretAccessKey = createHash('sha256')
    .update(import.meta.env.CLOUDFLARE_SECRET_ACCESS_KEY)
    .digest('hex')

  const S3 = new S3Client({
    region: 'auto',
    endpoint: `https://${import.meta.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: import.meta.env.CLOUDFLARE_ACCESS_KEY_ID,
      secretAccessKey,
    },
  })

  try {
    const buffer = await generatePDFCertificate({
      qrCodeUrl,
      fullname,
      certificateURL,
    })

    const command = new PutObjectCommand({
      Bucket: import.meta.env.CERTIFICATE_BUCKET_NAME ?? 'jsconf-certificados',
      Key: certificateKey,
      Body: buffer,
      ContentType: 'application/pdf',
    })

    await S3.send(command)
  } catch (err) {
    console.error('Error uploading certificate to R2:', err)
    throw err
  }
}
