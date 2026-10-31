import axios from 'axios';

/**
 * Sends a WhatsApp text message using Meta Graph API.
 * @param {string} to - Recipient phone number
 * @param {string} text - Message content to send
 */
export async function sendWhatsAppMessage(to, text) {
  const url = `https://graph.facebook.com/v19.0/${process.env.PHONE_NUMBER_ID}/messages`;

  try {
    const response = await axios.post(
      url,
      {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: to,
        type: 'text',
        text: { body: text }
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log(`[WhatsApp API Response] Message sent successfully to ${to}. Message ID: ${response.data.messages[0].id}`);
    return response.data;
  } catch (error) {
    console.error('[WhatsApp API Error]:', error.response ? error.response.data : error.message);
    throw error;
  }
}
