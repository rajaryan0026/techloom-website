export async function sendWhatsAppNotification(message: string, phone?: string) {
  const token = process.env.WHATSAPP_API_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_ID;
  const targetPhone = phone || process.env.WHATSAPP_FALLBACK_NUMBER;

  if (!token || !phoneId || !targetPhone) {
    console.log(`[WhatsApp Mock] ${message}`);
    return { success: false, mock: true };
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${phoneId}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: targetPhone.replace(/\D/g, ''),
          type: 'text',
          text: { body: message },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error('WhatsApp API error:', err);
      return { success: false, error: err };
    }

    return { success: true };
  } catch (error) {
    console.error('WhatsApp send failed:', error);
    return { success: false, error: String(error) };
  }
}