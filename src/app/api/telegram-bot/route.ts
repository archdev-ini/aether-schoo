
import { NextRequest, NextResponse } from 'next/server';
import Airtable from 'airtable';

// --- CONFIGURATION ---
const { 
    TELEGRAM_BOT_TOKEN, 
    AIRTABLE_API_KEY, 
    AIRTABLE_BASE_ID, 
    TELEGRAM_ADMIN_ID,
    AIRTABLE_MEMBERS_TABLE_ID,
    AIRTABLE_EVENTS_TABLE_ID,
    AIRTABLE_QUESTIONS_TABLE_ID
} = process.env;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

// --- HELPER FUNCTIONS ---

function getAirtableBase() {
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
            eventCode: record.get('EventCode'),
        }));
    } catch (error) {
        console.error('Airtable event fetching error:', error);
        return [];
    }
}

// Fetch all submissions for admin
async function getAllSubmissions(): Promise<any[]> {
    if (!AIRTABLE_QUESTIONS_TABLE_ID) {
        console.error('Airtable Questions Table ID is not set.');
        return [];
    }
    try {
        const base = getAirtableBase();
        const records = await base(AIRTABLE_QUESTIONS_TABLE_ID).select({
            sort: [{field: "Submitted At", direction: "desc"}],
        }).all();
        
        return records.map(record => ({
            submission: record.get('Submission'), // fldzGkktA5C06rZzq
            type: record.get('Type'),             // fldnHAjQMoMSu7qtd
            submittedAt: record.get('Submitted At'), // fldBBXne24R0iqZFL
            context: record.get('Context') || 'General', // fldR3R8fZ6ZrHWI9e
        }));
    } catch (error) {
        console.error('Airtable submission fetching error:', error);
        return [];
    }
}

// Log a question or suggestion
async function logSubmission(telegramUserId: number, submissionText: string, type: 'Questions' | 'Suggestions', context: string = 'General') {
     if (!AIRTABLE_QUESTIONS_TABLE_ID) {
        console.error('Airtable Questions Table ID is not set.');
        return false;
    }
    try {
        const base = getAirtableBase();
        await base(AIRTABLE_QUESTIONS_TABLE_ID).create([
            {
                fields: {
                    'fldzGkktA5C06rZzq': submissionText,      // Submission
                    'fldnHAjQMoMSu7qtd': type,                // Type
                    'fld75Mt7o7JJj57Oi': String(telegramUserId), // Telegram User ID
                    'fldR3R8fZ6ZrHWI9e': context,            // Context
                }
            }
        ], { typecast: true });
        return true;
    } catch(error) {
        console.error('Airtable submission error:', error);
        return false;
    }
}

async function handleVerification(chatId: number, aetherId: string) {
    if (!aetherId || !/AETH-[A-Z]{2}\d{2}/i.test(aetherId)) {
        await sendMessage(chatId, 'Please provide your Aether ID in the format `AETH-XX12`.');
        return;
    }
    const isVerified = await verifyMember(aetherId);
    if (isVerified) {
         await sendMessage(chatId, `✅ Verification successful! Welcome to the Aether community.\n\nHere's what you can do:\n\n\`/events\` - View upcoming events.\n\`/ask [your question]\` - Ask a general question to the community.\n\`/asklive [event_code] [your question]\` - Ask a question during a live event.\n\`/suggest [your idea]\` - Submit a suggestion.`);
    } else {
        await sendMessage(chatId, '❌ Verification failed. Please check your Aether ID and try again. You can get your ID by joining at aether.build/join.');
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
            const text = (message.text || '').trim();

            if (text.startsWith('/')) {
                const [command, ...args] = text.split(' ');

                switch (command) {
                    case '/start':
                        await sendMessage(chatId, 'Welcome to the Aether Bot! Please verify your identity by sending your Aether ID (e.g., `AETH-XX12`).');
                        break;
                    
                    case '/verify':
                        const aetherId = args[0];
                        await handleVerification(chatId, aetherId);
                        break;

                    case '/events':
                        const events = await getUpcomingEvents();
                        if (events.length > 0) {
                            let eventList = '📅 *Upcoming Events:*\n\n';
                            events.forEach(event => {
                                eventList += `*${event.title}* (Code: \`${event.eventCode}\`)\n`;
                                if (event.registrationUrl) {
                                    eventList += `[Register Here](${event.registrationUrl})\n\n`;
                                } else {
                                    eventList += `Registration opening soon.\n\n`;
                                }
                            });
                            eventList += 'To ask a question during an event, use `/asklive [Event Code] [Your Question]`.';
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
                        await logSubmission(userId, question, 'Questions', 'General');
                        await sendMessage(chatId, 'Thanks! Your question has been submitted to the community admins.');
                        break;
                    
                    case '/asklive':
                        const eventCode = args[0];
                        const liveQuestion = args.slice(1).join(' ');
                        if (!eventCode || !liveQuestion) {
                            await sendMessage(chatId, 'Please provide an event code and your question. Usage: `/asklive WAD25 How do you see AI impacting architecture?`');
                            break;
                        }
                        await logSubmission(userId, liveQuestion, 'Questions', eventCode.toUpperCase());
                        await sendMessage(chatId, `Thanks! Your question for event *${eventCode.toUpperCase()}* has been submitted to the panel.`);
                        break;

                    case '/suggest':
                        const suggestion = args.join(' ');
                        if (!suggestion) {
                            await sendMessage(chatId, 'Please type your suggestion after the command. Usage: `/suggest We should have a portfolio review session.`');
                            break;
                        }
                        await logSubmission(userId, suggestion, 'Suggestions');
                        await sendMessage(chatId, 'Great idea! Your suggestion has been recorded for the team to review.');
                        break;

                    default:
                        await sendMessage(chatId, 'Sorry, I don\'t recognize that command. Type `/start` to see what I can do.');
                }
            } else if (TELEGRAM_ADMIN_ID && text.toUpperCase() === TELEGRAM_ADMIN_ID.toUpperCase()) {
                await sendMessage(chatId, '🔑 Admin authentication successful. Fetching all submissions...');
                const submissions = await getAllSubmissions();
                if (submissions.length > 0) {
                    let report = '📝 *All Community Submissions:*\n\n';
                    submissions.forEach(sub => {
                        const date = new Date(sub.submittedAt).toLocaleDateString('en-US');
                        const type = sub.type || 'N/A';
                        report += `Type: *${type}* | Context: *${sub.context}* (${date})\n`;
                        report += `> ${sub.submission}\n\n`;
                    });
                    // Telegram has a message character limit of 4096
                    if (report.length > 4000) {
                        await sendMessage(chatId, 'You have a large number of submissions. Here are the most recent ones:');
                        await sendMessage(chatId, report.substring(0, 4000));
                    } else {
                        await sendMessage(chatId, report);
                    }
                } else {
                    await sendMessage(chatId, 'No submissions found.');
                }
            } else if (/AETH-[A-Z]{2}\d{2}/i.test(text)) {
                 await handleVerification(chatId, text);
            } else {
                await sendMessage(chatId, 'Hi there! I can only respond to commands right now. Try `/start` to see your options.');
            }
        }

        return NextResponse.json({ status: 'ok' });

    } catch (error) {
        console.error('Error processing webhook:', error);
        // It's good practice to let Telegram know the webhook failed.
        if (error instanceof Error) {
            console.error(error.message);
        }
        return NextResponse.json({ error: 'Error processing request' }, { status: 500 });
    }
}
