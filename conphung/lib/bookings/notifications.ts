import type { SerializedBooking } from './serializers'

/**
 * Send booking notification via n8n webhook
 */
export async function notifyBookingCreated(
  booking: SerializedBooking,
  type: 'tour' | 'homestay' = 'tour'
) {
  const webhookUrl = type === 'tour' 
    ? process.env.N8N_TOUR_BOOKING_WEBHOOK_URL
    : process.env.N8N_HOMESTAY_BOOKING_WEBHOOK_URL

  if (!webhookUrl) {
    console.warn(`[booking] N8N webhook URL not configured for ${type}`)
    return { success: false, reason: 'WEBHOOK_NOT_CONFIGURED' }
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.N8N_WEBHOOK_SECRET
          ? { 'Authorization': `Bearer ${process.env.N8N_WEBHOOK_SECRET}` }
          : {}),
      },
      body: JSON.stringify({
        ...booking,
        bookingUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/admin/bookings/${booking.id}`,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[booking] n8n webhook failed:', response.status, errorText)
      return { success: false, reason: 'WEBHOOK_ERROR', status: response.status }
    }

    const result = await response.json()
    console.info('[booking] notification sent via n8n', {
      reference: booking.reference,
      type,
      result,
    })
    
    return { success: true, result }
  } catch (error) {
    console.error('[booking] n8n webhook error:', error)
    return { success: false, reason: 'NETWORK_ERROR', error }
  }
}

/**
 * Legacy function - kept for backward compatibility
 * @deprecated Use notifyBookingCreated instead
 */
export async function sendBookingConfirmationEmail(
  booking: SerializedBooking | { reference: string; customer: { email: string; fullName: string } }
) {
  console.info('[booking] confirmation email queued', {
    reference: booking.reference,
    customer: booking.customer,
  })
}
