import { r2GeneratePDFCertificate } from '@/services/r2-generate-pdf-certificate'
import { generateQRCodeUrl } from '@/utils/generate-qr-code-url'
import { certificateRateLimit } from '@/services/rate-limit'
import { getTicketByCode } from '@/services/tickettailor'
import { redis } from '@/services/redis'
import { ActionError, defineAction } from 'astro:actions'
import { z } from 'astro:schema'

const CERTIFICATE_BASE_URL =
  import.meta.env.CERTIFICATE_BASE_URL ?? 'https://certificados.jsconf.es'

export const server = {
  certificate: defineAction({
    input: z.object({
      ticketCode: z.string().min(1).max(20),
    }),
    handler: async ({ ticketCode }, ctx) => {
      const ip =
        ctx.request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
        ctx.request.headers.get('x-real-ip') ??
        'unknown'

      const { success } = await certificateRateLimit.limit(ip)

      if (!success) {
        throw new ActionError({
          code: 'TOO_MANY_REQUESTS',
          message: 'Demasiados intentos. Por favor, espera un minuto antes de intentarlo de nuevo.',
        })
      }

      const existingCertUrl = await redis.get<string>(`certificate:${ticketCode}`)
      if (existingCertUrl) {
        return { certificateURL: existingCertUrl }
      }

      const ticket = await getTicketByCode(ticketCode)

      if (ticket == null) {
        throw new ActionError({
          code: 'NOT_FOUND',
          message: 'No se encontró ningún ticket con ese código. Recuerda que es sensible a mayúsculas y minúsculas.',
        })
      }

      if (!ticket.checkedIn) {
        throw new ActionError({
          code: 'FORBIDDEN',
          message:
            'Este ticket no tiene registro de entrada al evento. Solo los asistentes que hicieron check-in pueden obtener el certificado.',
        })
      }

      const randomUUIDKey = crypto.randomUUID()
      const uniqueCertificateUserPath = `${randomUUIDKey}.pdf`
      const certificateURL = `${CERTIFICATE_BASE_URL}/${uniqueCertificateUserPath}`

      try {
        const qrCodeUrl = await generateQRCodeUrl(certificateURL)

        await r2GeneratePDFCertificate({
          qrCodeUrl,
          certificateKey: uniqueCertificateUserPath,
          fullname: ticket.fullName,
          certificateURL,
        })

        await redis.set(`certificate:${ticketCode}`, certificateURL)

        return { certificateURL }
      } catch (err) {
        console.error('Error generating certificate:', err)
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Error al generar el certificado. Inténtalo de nuevo más tarde.',
        })
      }
    },
  }),
}
