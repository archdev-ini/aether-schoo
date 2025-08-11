
import {NextRequest, NextResponse} from 'next/server';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

// This function will handle incoming webhooks from Telegram
export async function POST(req: NextRequest) {
  if (!TELEGRAM_BOT_TOKEN) {
    console.error('TELEGRAM_BOT_TOKEN is not set.');
    return NextResponse.json({ error: 'Bot not configured.' }, { status: 500 });
  }

  try {
    const body = await req.json();

    // Check if the update contains a message
    if (body.message) {
      const message = body.message;
      const chatId = message.chat.id;
      const text = message.text;

      // For this example, we'll just echo the message back
      // You can replace this with more complex logic (e.g., using Genkit AI)
      const responseText = `You said: "${text}"`;

      // Send the response back to the user via the Telegram API
      await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: responseText,
        }),
      });
    }

    // Acknowledge receipt of the webhook to Telegram
    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Error processing request' }, { status: 500 });
  }
}
