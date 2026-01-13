import { getAvailableTickets } from '@/services/tickettailor'

export async function GET() {
  const availableTickets = await getAvailableTickets()

  return new Response(JSON.stringify({ availableTickets }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
