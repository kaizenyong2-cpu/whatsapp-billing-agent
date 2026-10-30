import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

// Helper: Send WhatsApp Message via Meta Graph API
async function sendWhatsAppMessage(to, textBody) {
  try {
    await axios({
      method: 'POST',
      url: `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json',
      },
      data: {
        messaging_product: 'whatsapp',
        to: to,
        type: 'text',
        text: { body: textBody },
      },
    });
    console.log(`Automated reply sent to ${to}`);
  } catch (error) {
    console.error('Error sending message:', error.response?.data || error.message);
  }
}

// 1. Webhook Verification (GET)
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

// 2. Incoming Messages Listener (POST)
app.post('/webhook', async (req, res) => {
  const body = req.body;

  if (body.object) {
    // Extract incoming message details
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];

    if (message) {
      const from = message.from; // Sender's WhatsApp number
      const msgBody = message.text?.body; // Message content

      console.log(`Received message from ${from}: "${msgBody}"`);

      // Send automated receipt confirmation
      await sendWhatsAppMessage(
        from,
        `Hello! We received your message: "${msgBody}". Your request is being processed by the Billing AI Agent.`
      );
    }

    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
// WhatsApp Webhook endpoint to receive incoming messages
app.post('/webhook', async (req, res) => {
  const body = req.body;
  
  // Check if this is an event from a WhatsApp Business account
  if (body.object === 'whatsapp_business_account') {
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const message = value?.messages?.[0];

    if (message) {
      const senderPhone = message.from; // e.g., customer phone number
      const messageText = message.text?.body; // message content
      console.log(`Received message from ${senderPhone}: "${messageText}"`);

      // TODO: Add your billing agent response logic here
    }
  }
  
  // Always return a 200 OK status quickly to acknowledge Meta's webhook
  res.sendStatus(200);
});