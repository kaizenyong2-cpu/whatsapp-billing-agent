import express from 'express';
import dotenv from 'dotenv';
import { processIncomingMessage } from './services/aiService.js';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

// Webhook Verification (Meta API Requirement)
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token === VERIFY_TOKEN) {
    console.log('WEBHOOK_VERIFIED');
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Handle Incoming Webhook Events
app.post('/webhook', async (req, res) => {
  const body = req.body;

  if (body.object === 'whatsapp_business_account') {
    for (const entry of body.entry) {
      for (const change of entry.changes) {
        if (change.value && change.value.messages) {
          const message = change.value.messages[0];
          const from = message.from; // Sender phone number
          const messageText = message.text ? message.text.body : '';

          console.log(`[Incoming Message] From: ${from} | Text: "${messageText}"`);

          // Process message with AI engine
          const reply = await processIncomingMessage(messageText, from);
          console.log(`[AI Response]:\n${reply}`);
        }
      }
    }
    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
