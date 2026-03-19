const API_KEY = import.meta.env.TICKET_TAILOR_API_KEY
const auth = () => btoa(`${API_KEY}:`)

interface TicketInfo {
  id: string
  reference: string
  fullName: string
  email: string
  checkedIn: boolean
}

export const getTicketByCode = async (ticketCode: string): Promise<TicketInfo | null> => {
  try {
    const { redis } = await import('./redis')
    const key = `ticket:${ticketCode}`
    const data = await redis.get<{ fullName: string; checkedIn: boolean }>(key)

    if (!data) return null

    return {
      id: ticketCode,
      reference: ticketCode,
      fullName: data.fullName,
      email: '',
      checkedIn: data.checkedIn,
    }
  } catch (error) {
    console.error('Error fetching ticket by code:', error)
    return null
  }
}

let cachedTickets: number | null = null
let lastFetchTime = 0
const CACHE_TTL = 1000 * 60 * 5 // 5 minutos

export const getAvailableTickets = async () => {
  if (!API_KEY) return null

  const now = Date.now()
  if (cachedTickets !== null && now - lastFetchTime < CACHE_TTL) {
    return cachedTickets
  }

  try {
    const response = await fetch('https://api.tickettailor.com/v1/events', {
      headers: {
        Authorization: `Basic ${auth()}`,
        Accept: 'application/json',
      },
    })

    if (!response.ok) return cachedTickets

    const { data: events } = await response.json()
    if (!events || events.length === 0) return cachedTickets

    // Buscamos el evento de la JSConf 2026 o el primero que esté publicado
    const event = events.find((e: any) => e.name.includes('2026')) || events[0]

    // Obtenemos los detalles para tener los ticket_types con su disponibilidad
    const eventDetailRes = await fetch(`https://api.tickettailor.com/v1/events/${event.id}`, {
      headers: {
        Authorization: `Basic ${auth()}`,
        Accept: 'application/json',
      },
    })

    if (!eventDetailRes.ok) return cachedTickets

    const eventDetail = await eventDetailRes.json()
    let available = 0

    const ticketTypes = eventDetail.ticket_types || []

    ticketTypes.forEach((tt: any) => {
      // Calculamos las entradas disponibles: Total - (Emitidas + En espera + En cestas)
      const remaining =
        tt.quantity_total - (tt.quantity_issued + tt.quantity_held + tt.quantity_in_baskets)
      if (remaining > 0) {
        available += remaining
      }
    })

    cachedTickets = available
    lastFetchTime = now

    return available
  } catch (error) {
    console.error('Error fetching Ticket Tailor tickets:', error)
    return cachedTickets
  }
}
