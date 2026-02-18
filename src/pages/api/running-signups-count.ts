import { redis } from '@/services/redis'

const RUNNING_SIGNUPS_KEY = 'running:signups'
const RUNNING_SIGNUPS_CACHE_KEY = 'running:signups:count:cache'
const CACHE_TTL_SECONDS = 60 * 5

export async function GET() {
  let count = await redis.get<number>(RUNNING_SIGNUPS_CACHE_KEY)

  if (typeof count !== 'number') {
    count = await redis.hlen(RUNNING_SIGNUPS_KEY)
    await redis.set(RUNNING_SIGNUPS_CACHE_KEY, count, { ex: CACHE_TTL_SECONDS })
  }

  return new Response(JSON.stringify({ count }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': `public, s-maxage=${CACHE_TTL_SECONDS}, stale-while-revalidate=60`,
    },
  })
}
