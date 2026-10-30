import axios from 'axios';

async function sendTest() {
  try {
    const response = await axios.post('http://localhost:3000/webhook', {
      object: 'whatsapp_business_account',
      entry: [{
        changes: [{
          value: {
            messages: [{
              from: '817089415237',
              text: { body: 'Can I get my invoice?' }
            }]
          }
        }]
      }]
    });
    console.log('Test webhook sent successfully:', response.status);
  } catch (err) {
    console.error('Error sending test webhook:', err.message);
  }
}

sendTest();
