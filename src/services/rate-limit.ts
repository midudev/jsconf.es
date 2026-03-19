import { Ratelimit } from '@upstash/ratelimit'
import { redis } from './redis'

export const certificateRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '60 s'),
  prefix: 'ratelimit:certificate',
})
