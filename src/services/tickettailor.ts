const API_KEY = import.meta.env.TICKET_TAILOR_API_KEY

let cachedTickets: number | null = null
let lastFetchTime = 0
const CACHE_TTL = 1000 * 60 * 5 // 5 minutos

export const getAvailableTickets = async () => {
  if (!API_KEY) return null

  const now = Date.now()
  if (cachedTickets !== null && now - lastFetchTime < CACHE_TTL) {
    return cachedTickets
  }

  const auth = btoa(`${API_KEY}:`)

  try {
    const response = await fetch('https://api.tickettailor.com/v1/events', {
      headers: {
        Authorization: `Basic ${auth}`,
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
        Authorization: `Basic ${auth}`,
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
