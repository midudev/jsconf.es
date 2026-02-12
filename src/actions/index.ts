import { defineAction, ActionError } from 'astro:actions'
import { z } from 'astro:schema'
import { Ratelimit } from '@upstash/ratelimit'
import { redis } from '@/services/redis'

// ----- Constants -----

const MAX_NAME_LENGTH = 100
const MAX_EMAIL_LENGTH = 254 // RFC 5321
const REDIS_KEY_RUNNERS = 'running:signups'

// ----- Email typo detection -----

const COMMON_DOMAIN_TYPOS: Record<string, string> = {
  // Gmail
  'gmal.com': 'gmail.com',
  'gmial.com': 'gmail.com',
  'gmil.com': 'gmail.com',
  'gmaill.com': 'gmail.com',
  'gamil.com': 'gmail.com',
  'gnail.com': 'gmail.com',
  'gmail.co': 'gmail.com',
  'gmail.con': 'gmail.com',
  'gmail.cm': 'gmail.com',
  'gmail.om': 'gmail.com',
  'gmail.cmo': 'gmail.com',
  'gmail.vom': 'gmail.com',
  'gmail.cim': 'gmail.com',
  'gmail.comm': 'gmail.com',
  'gmai.com': 'gmail.com',
  'gmali.com': 'gmail.com',
  'gmaio.com': 'gmail.com',
  'gmaul.com': 'gmail.com',
  'gemail.com': 'gmail.com',
  'gimail.com': 'gmail.com',
  'gmail.es': 'gmail.com',
  'gmail.cpm': 'gmail.com',
  'gmail.xom': 'gmail.com',
  // Hotmail
  'hotmal.com': 'hotmail.com',
  'hotmial.com': 'hotmail.com',
  'hotmil.com': 'hotmail.com',
  'hotmail.co': 'hotmail.com',
  'hotmail.con': 'hotmail.com',
  'hotmaill.com': 'hotmail.com',
  'hotmai.com': 'hotmail.com',
  'hotamil.com': 'hotmail.com',
  'hotmail.cm': 'hotmail.com',
  // Outlook
  'outloook.com': 'outlook.com',
  'outlok.com': 'outlook.com',
  'outllook.com': 'outlook.com',
  'outlook.co': 'outlook.com',
  'outlook.con': 'outlook.com',
  'outlook.cm': 'outlook.com',
  // Yahoo
  'yaho.com': 'yahoo.com',
  'yahooo.com': 'yahoo.com',
  'yahoo.co': 'yahoo.com',
  'yahoo.con': 'yahoo.com',
  'yahoo.cm': 'yahoo.com',
}

function getEmailTypoSuggestion(email: string): string | null {
  const parts = email.split('@')
  if (parts.length !== 2) return null
  const [, domain] = parts
  if (!domain) return null
  const lowerDomain = domain.toLowerCase()
  const correctDomain = COMMON_DOMAIN_TYPOS[lowerDomain]
  if (correctDomain) return `${parts[0]}@${correctDomain}`
  return null
}

// ----- Sanitization -----

/** Remove control characters and normalize whitespace */
function sanitizeName(name: string): string {
  return name
    .replace(/[\x00-\x1F\x7F]/g, '') // strip control chars
    .replace(/\s+/g, ' ')            // normalize whitespace
    .trim()
}

// ----- Rate limiters -----

/** Per-IP: prevents brute-force / spam from a single source */
const ipRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 m'),
  analytics: false,
  prefix: 'running:ratelimit:ip',
})

/** Per-email: prevents email enumeration across different IPs */
const emailRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '10 m'),
  analytics: false,
  prefix: 'running:ratelimit:email',
})

// ----- Zod schema -----

const runningSignupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'Introduce al menos 3 caracteres')
    .max(MAX_NAME_LENGTH, `El nombre no puede superar los ${MAX_NAME_LENGTH} caracteres`)
    .regex(/\s/, 'Introduce tu nombre y al menos un apellido')
    .regex(/^[\p{L}\s\-'.]+$/u, 'El nombre contiene caracteres no válidos'),
  email: z
    .string()
    .trim()
    .max(MAX_EMAIL_LENGTH, 'El correo electrónico es demasiado largo')
    .email('Introduce un correo electrónico válido')
    .transform((val) => val.toLowerCase())
    .refine(
      (email) => getEmailTypoSuggestion(email) === null,
      (email) => ({
        message: `¿Quisiste decir ${getEmailTypoSuggestion(email)}?`,
      })
    ),
})

// ----- Helpers -----

function getClientIp(request: Request): string {
  // On Vercel, x-forwarded-for is set by the platform and cannot be spoofed
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim()
    if (first) return first
  }
  const realIp = request.headers.get('x-real-ip')?.trim()
  if (realIp) return realIp
  // Never fall back to a shared key — deny instead
  return ''
}

// ----- Action -----

export const server = {
  runningSignup: defineAction({
    accept: 'json',
    input: runningSignupSchema,
    handler: async ({ name, email }, context) => {
      // 1. Resolve client IP — reject if unidentifiable
      const clientIp = getClientIp(context.request)

      if (!clientIp) {
        throw new ActionError({
          code: 'FORBIDDEN',
          message: 'No se ha podido verificar tu solicitud. Inténtalo de nuevo.',
        })
      }

      // 2. Rate limit by IP
      const { success: ipOk } = await ipRatelimit.limit(clientIp)

      if (!ipOk) {
        throw new ActionError({
          code: 'TOO_MANY_REQUESTS',
          message: 'Demasiados intentos. Espera un momento antes de volver a intentarlo.',
        })
      }

      // 3. Rate limit by email (prevents enumeration from rotating IPs)
      const { success: emailOk } = await emailRatelimit.limit(email)

      if (!emailOk) {
        throw new ActionError({
          code: 'TOO_MANY_REQUESTS',
          message: 'Demasiados intentos con este correo. Espera unos minutos.',
        })
      }

      // 4. Check if already registered
      const existing = await redis.hget(REDIS_KEY_RUNNERS, email)

      if (existing) {
        throw new ActionError({
          code: 'CONFLICT',
          message: 'Este correo electrónico ya está registrado para la Social Run 5K.',
        })
      }

      // 5. Sanitize and save
      const safeName = sanitizeName(name)

      await redis.hset(REDIS_KEY_RUNNERS, {
        [email]: JSON.stringify({
          name: safeName,
          email,
          registeredAt: new Date().toISOString(),
        }),
      })

      return { success: true }
    },
  }),
}
