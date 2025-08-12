
import { NextRequest, NextResponse } from 'next/server';
import Airtable from 'airtable';

// --- CONFIGURATION ---
const { TELEGRAM_BOT_TOKEN } = process.env;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

// --- HELPER FUNCTIONS ---

function getAirtableBase() {
    const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID } = process.env;
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
        console.error('Airtable API Key or Base ID is not set.');
        throw new Error('Airtable configuration is missing.');
    }
    return new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);
}

// Send a message back to the user
async function sendMessage(chatId: number, text: string, replyMarkup?: any) {
    if (!TELEGRAM_BOT_TOKEN) {
        console.error('Telegram Bot Token is not configured.');
        return;
    }
    const payload: any = {
        chat_id: chatId,
        text,
        parse_mode: 'Markdown',
    };
    if (replyMarkup) {
        payload.reply_markup = replyMarkup;
    }
    try {
        const response = await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            const errorBody = await response.json();
            console.error('Failed to send message:', errorBody);
        }
    } catch (error) {
        console.error('Error sending Telegram message:', error);
    }
}

// Verify a member's Aether ID
async function verifyMember(aetherId: string): Promise<boolean> {
    const { AIRTABLE_MEMBERS_TABLE_ID } = process.env;
    if (!AIRTABLE_MEMBERS_TABLE_ID) {
        console.error('Airtable Members Table ID is not set.');
        return false;
    }
    try {
        const base = getAirtableBase();
        const records = await base(AIRTABLE_MEMBERS_TABLE_ID).select({
            filterByFormula: `{aetherId} = "${aetherId.toUpperCase()}"`,
            maxRecords: 1,
        }).firstPage();
        return records.length > 0;
    } catch (error) {
        console.error('Airtable verification error:', error);
        return false;
    }
}

// Fetch upcoming events
async function getUpcomingEvents(): Promise<any[]> {
    const { AIRTABLE_EVENTS_TABLE_ID } = process.env;
    if (!AIRTABLE_EVENTS_TABLE_ID) {
        console.error('Airtable Events Table ID is not set.');
        return [];
    }
    try {
        const base = getAirtableBase();
        const records = await base(AIRTABLE_EVENTS_TABLE_ID).select({
            filterByFormula: "IS_AFTER({Date}, TODAY())",
            sort: [{field: "Date", direction: "asc"}],
        }).all();
        
        return records.map(record => ({
            id: record.id,
            title: record.get('Title'),
            date: record.get('Date'),
            registrationUrl: record.get('Registration URL'),
        }));
    } catch (error) {
        console.error('Airtable event fetching error:', error);
        return [];
    }
}

// Log a question or suggestion
async function logSubmission(telegramUserId: number, submissionText: string, type: 'Question' | 'Suggestion') {
    const { AIRTABLE_QUESTIONS_TABLE_ID } = process.env;
     if (!AIRTABLE_QUESTIONS_TABLE_ID) {
        console.error('Airtable Questions Table ID is not set.');
        return false;
    }
    try {
        const base = getAirtableBase();
        await base(AIRTABLE_QUESTIONS_TABLE_ID).create([
            {
                fields: {
                    'Submission': submissionText,
                    'Type': type,
                    'Status': 'New',
                    'Telegram User ID': String(telegramUserId),
                }
            }
        ]);
        return true;
    } catch(error) {
        console.error('Airtable submission error:', error);
        return false;
    }
}

// --- MAIN HANDLER ---
export async function POST(req: NextRequest) {
    if (!TELEGRAM_BOT_TOKEN) {
        console.error('Bot not configured: TELEGRAM_BOT_TOKEN is missing.');
        return NextResponse.json({ error: 'Bot not configured.' }, { status: 500 });
    }

    try {
        const body = await req.json();

        if (body.message) {
            const { message } = body;
            const chatId = message.chat.id;
            const userId = message.from.id;
            const text = message.text || '';

            if (text.startsWith('/')) {
                const [command, ...args] = text.split(' ');

                switch (command) {
                    case '/start':
                        await sendMessage(chatId, 'Welcome to the Aether Bot! Please verify your identity by sending your Aether ID in the format: `/verify AETH-XX12`');
                        break;
                    
                    case '/verify':
                        const aetherId = args[0];
                        if (!aetherId) {
                            await sendMessage(chatId, 'Please provide your Aether ID. Usage: `/verify AETH-XX12`');
                            break;
                        }
                        const isVerified = await verifyMember(aetherId);
                        if (isVerified) {
                             await sendMessage(chatId, `✅ Verification successful! Welcome to the Aether community.\n\nHere's what you can do:\n\n\`/events\` - View and register for upcoming events.\n\`/ask [your question]\` - Ask a question during a live event.\n\`/suggest [your idea]\` - Submit a suggestion for the community.`);
                        } else {
                            await sendMessage(chatId, '❌ Verification failed. Please check your Aether ID and try again. You can get your ID by joining at [aether.build/join](https://aether.build/join).');
                        }
                        break;

                    case '/events':
                        const events = await getUpcomingEvents();
                        if (events.length > 0) {
                            let eventList = '📅 *Upcoming Events:*\n\n';
                            events.forEach(event => {
                                eventList += `*${event.title}*\n`;
                                if (event.registrationUrl) {
                                    eventList += `[Register Here](${event.registrationUrl})\n\n`;
                                } else {
                                    eventList += `Registration opening soon.\n\n`;
                                }
                            });
                            await sendMessage(chatId, eventList);
                        } else {
                            await sendMessage(chatId, 'No upcoming events right now. Check back soon!');
                        }
                        break;
                    
                    case '/ask':
                        const question = args.join(' ');
                        if (!question) {
                            await sendMessage(chatId, 'Please type your question after the command. Usage: `/ask How do I join Horizon Studio?`');
                            break;
                        }
                        await logSubmission(userId, question, 'Question');
                        await sendMessage(chatId, 'Thanks! Your question has been submitted to the panel.');
                        break;

                    case '/suggest':
                        const suggestion = args.join(' ');
                        if (!suggestion) {
                            await sendMessage(chatId, 'Please type your suggestion after the command. Usage: `/suggest We should have a portfolio review session.`');
                            break;
                        }
                        await logSubmission(userId, suggestion, 'Suggestion');
                        await sendMessage(chatId, 'Great idea! Your suggestion has been recorded for the team to review.');
                        break;

                    default:
                        await sendMessage(chatId, 'Sorry, I don\'t recognize that command. Type `/start` to see what I can do.');
                }
            } else {
                await sendMessage(chatId, 'Hi there! I can only respond to commands right now. Try `/start` to see your options.');
            }
        }

        return NextResponse.json({ status: 'ok' });

    } catch (error) {
        console.error('Error processing webhook:', error);
        return NextResponse.json({ error: 'Error processing request' }, { status: 500 });
    }
}
