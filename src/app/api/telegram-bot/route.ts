
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
    AIRTABLE_QUESTIONS_TABLE_ID,
    TELEGRAM_GROUP_CHAT_ID,
    TELEGRAM_ANNOUNCEMENT_CHANNEL_ID,
} = process.env;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

// --- TYPE DEFINITIONS ---
interface TelegramUser {
    id: number;
    is_bot: boolean;
    first_name: string;
    last_name?: string;
    username?: string;
}

interface Chat {
    id: number;
    type: 'private' | 'group' | 'supergroup' | 'channel';
    title?: string;
}

interface Message {
    message_id: number;
    from: TelegramUser;
    chat: Chat;
    date: number;
    text?: string;
    reply_to_message?: Message;
}

// --- CORE API HELPERS ---

// Send a message back to the user or group
async function sendMessage(chatId: number, text: string, replyToMessageId?: number, replyMarkup?: any) {
    if (!TELEGRAM_BOT_TOKEN) {
        console.error('Telegram Bot Token is not configured.');
        return;
    }
    const payload: any = {
        chat_id: chatId,
        text,
        parse_mode: 'Markdown',
    };
    if (replyToMessageId) {
        payload.reply_to_message_id = replyToMessageId;
    }
    if (replyMarkup) {
        payload.reply_markup = replyMarkup;
    }
    try {
        await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
    } catch (error) {
        console.error('Error sending Telegram message:', error);
    }
}

// Check if a user is an admin in a specific chat
async function isUserAdmin(chatId: number, userId: number): Promise<boolean> {
    if (chatId > 0) return false; // Not a group chat
    try {
        const response = await fetch(`${TELEGRAM_API_URL}/getChatMember`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, user_id: userId }),
        });
        const data = await response.json();
        return data.ok && ['creator', 'administrator'].includes(data.result.status);
    } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
    }
}

// Create a single-use invite link to a chat
async function createInviteLink(chatId: string | number): Promise<string | null> {
    try {
        const response = await fetch(`${TELEGRAM_API_URL}/createChatInviteLink`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                member_limit: 1, // Only one person can use this link
                expire_date: Math.floor(Date.now() / 1000) + 86400, // Expires in 24 hours
            }),
        });
        const data = await response.json();
        if (data.ok) {
            return data.result.invite_link;
        }
        console.error('Failed to create invite link:', data.description);
        return null;
    } catch (error) {
        console.error('Error creating invite link:', error);
        return null;
    }
}

// --- MODERATION ACTIONS ---

async function banUser(chatId: number, userId: number, reason?: string) {
    await fetch(`${TELEGRAM_API_URL}/banChatMember`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, user_id: userId }),
    });
    await sendMessage(chatId, `User has been banned. ${reason ? `Reason: ${reason}` : ''}`);
}

async function unbanUser(chatId: number, userId: number) {
    await fetch(`${TELEGRAM_API_URL}/unbanChatMember`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, user_id: userId, only_if_banned: true }),
    });
    await sendMessage(chatId, `User has been unbanned.`);
}

async function muteUser(chatId: number, userId: number, durationSeconds: number, reason?: string) {
     const until_date = Math.floor(Date.now() / 1000) + durationSeconds;
     await fetch(`${TELEGRAM_API_URL}/restrictChatMember`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            chat_id: chatId, 
            user_id: userId,
            permissions: { can_send_messages: false },
            until_date
        }),
    });
    const durationText = durationSeconds > 86400 ? `${Math.floor(durationSeconds/86400)} days` : `${Math.floor(durationSeconds/3600)} hours`;
    await sendMessage(chatId, `User has been muted for ${durationText}. ${reason ? `Reason: ${reason}` : ''}`);
}

async function unmuteUser(chatId: number, userId: number) {
     await fetch(`${TELEGRAM_API_URL}/restrictChatMember`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            chat_id: chatId, 
            user_id: userId,
            permissions: { 
                can_send_messages: true,
                can_send_media_messages: true,
                can_send_polls: true,
                can_send_other_messages: true,
                can_add_web_page_previews: true,
                can_change_info: true,
                can_invite_users: true,
                can_pin_messages: true,
            }
        }),
    });
    await sendMessage(chatId, `User has been unmuted.`);
}

async function deleteMessage(chatId: number, messageId: number) {
    await fetch(`${TELEGRAM_API_URL}/deleteMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, message_id: messageId }),
    });
}

function parseMuteDuration(durationStr: string): number {
    const match = durationStr.match(/^(\d+)([hdm])$/); // e.g., 1h, 7d, 1m
    if (!match) return 0;

    const value = parseInt(match[1]);
    const unit = match[2];

    switch (unit) {
        case 'h': return value * 3600;
        case 'd': return value * 86400;
        case 'm': return value * 60; // Though Telegram uses minutes for longer durations usually.
        default: return 0;
    }
}

// --- AIRTABLE HELPERS ---

async function verifyMember(aetherId: string): Promise<{ verified: boolean; fullName?: string }> {
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_MEMBERS_TABLE_ID) {
        console.error('Airtable credentials are not set in environment variables.');
        return { verified: false };
    }
    const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);
    try {
        const records = await base(AIRTABLE_MEMBERS_TABLE_ID).select({
            filterByFormula: `{aetherId} = "${aetherId.toUpperCase()}"`,
            maxRecords: 1,
        }).firstPage();

        if (records.length > 0) {
            return { verified: true, fullName: records[0].get('fullName') as string };
        }
        return { verified: false };
    } catch (error) {
        console.error('Airtable verification error:', error);
        return { verified: false };
    }
}

async function getUpcomingEvents(): Promise<any[]> {
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_EVENTS_TABLE_ID) {
        console.error('Airtable credentials for events are not set in environment variables.');
        return [];
    }
    const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);
    try {
        const records = await base(AIRTABLE_EVENTS_TABLE_ID).select({
            filterByFormula: "IS_AFTER({Date}, TODAY())",
            sort: [{field: "Date", direction: "asc"}],
        }).all();
        
        return records.map(record => ({
            title: record.get('Title'),
            registrationUrl: record.get('Registration URL'),
            eventCode: record.get('EventCode'),
        }));
    } catch (error) {
        console.error('Airtable event fetching error:', error);
        return [];
    }
}

async function getAllSubmissions(): Promise<any[]> {
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_QUESTIONS_TABLE_ID) {
        console.error('Airtable credentials for questions are not set in environment variables.');
        return [];
    }
    const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);
    try {
        const records = await base(AIRTABLE_QUESTIONS_TABLE_ID).select({
            sort: [{field: "fldBBXne24R0iqZFL", direction: "desc"}],
        }).all();
        
        return records.map(record => ({
            submission: record.get('fldzGkktA5C06rZzq'),
            type: record.get('fldnHAjQMoMSu7qtd'),
            submittedAt: record.get('fldBBXne24R0iqZFL'),
            context: record.get('fldR3R8fZ6ZrHWI9e') || 'General',
        }));
    } catch (error) {
        console.error('Airtable submission fetching error:', error);
        return [];
    }
}

async function logSubmission(telegramUserId: number, submissionText: string, type: 'Questions' | 'Suggestions', context: string = 'General') {
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_QUESTIONS_TABLE_ID) {
        console.error('Airtable credentials for questions are not set in environment variables.');
        return false;
    }
    const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);
    try {
        await base(AIRTABLE_QUESTIONS_TABLE_ID).create([
            {
                fields: {
                    'fldzGkktA5C06rZzq': submissionText,
                    'fldnHAjQMoMSu7qtd': type,
                    'fld75Mt7o7JJj57Oi': String(telegramUserId),
                    'fldR3R8fZ6ZrHWI9e': context,
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
    if (!aetherId || !/AETH/i.test(aetherId)) {
        await sendMessage(chatId, 'Please provide your Aether ID in the format `AETH-XX12`.');
        return;
    }
    const result = await verifyMember(aetherId);
    if (result.verified && result.fullName) {
        let successMessage = `✅ Verification successful! Welcome, ${result.fullName}.\n\nHere's what you can do:\n\n\`/events\` - View upcoming events.\n\`/ask [your question]\` - Ask a general question.\n\`/asklive [event_code] [your question]\` - Ask a question during an event.\n\`/suggest [your idea]\` - Submit a suggestion.`;
        let replyMarkup = undefined;

        if (TELEGRAM_GROUP_CHAT_ID) {
            const inviteLink = await createInviteLink(TELEGRAM_GROUP_CHAT_ID);
            if (inviteLink) {
                 successMessage = `✅ Verification successful! Welcome, ${result.fullName}.`;
                 replyMarkup = {
                    inline_keyboard: [
                        [{ text: 'Join the Community Group', url: inviteLink }]
                    ]
                };
            }
        }
         await sendMessage(chatId, successMessage, undefined, replyMarkup);
    } else {
        await sendMessage(chatId, '❌ Verification failed. Please check your Aether ID and try again. You can get your ID by joining at aether.build/join.');
    }
}

// --- MAIN HANDLER ---
export async function POST(req: NextRequest) {
    if (!TELEGRAM_BOT_TOKEN) {
        return NextResponse.json({ error: 'Bot not configured.' }, { status: 500 });
    }

    try {
        const body = await req.json();
        const message: Message | undefined = body.message;

        if (message) {
            const { chat, from, text = '', reply_to_message } = message;

            // --- ADMIN COMMANDS (GROUP-ONLY) ---
            if (chat.type !== 'private' && text.startsWith('/')) {
                const isAdmin = await isUserAdmin(chat.id, from.id);
                if (isAdmin) {
                    const [command, ...args] = text.split(' ');
                    const repliedToUser = reply_to_message?.from;
                    const repliedToMessageId = reply_to_message?.message_id;

                    if (!repliedToUser && ['/ban', '/mute', '/unmute', '/del'].includes(command)) {
                        await sendMessage(chat.id, 'This command must be used as a reply to a user\'s message.', message.message_id);
                        return NextResponse.json({ status: 'ok' });
                    }
                    
                    switch (command) {
                        case '/ban':
                            if(repliedToUser) await banUser(chat.id, repliedToUser.id, args.join(' '));
                            break;
                        case '/mute':
                            const duration = parseMuteDuration(args[0]);
                            if (repliedToUser && duration > 0) {
                                await muteUser(chat.id, repliedToUser.id, duration, args.slice(1).join(' '));
                            } else if (repliedToUser) {
                                await sendMessage(chat.id, 'Invalid duration. Use format like `1h`, `2d`.', message.message_id);
                            }
                            break;
                        case '/unmute':
                            if(repliedToUser) await unmuteUser(chat.id, repliedToUser.id);
                            break;
                        case '/del':
                            if(repliedToMessageId) await deleteMessage(chat.id, repliedToMessageId);
                             // Also delete the command message itself
                            await deleteMessage(chat.id, message.message_id);
                            break;
                    }
                }
            }
            
            // --- GENERAL COMMANDS & PRIVATE CHAT ---
            if (text.startsWith('/')) {
                const [command, ...args] = text.split(' ');

                switch (command) {
                    case '/start':
                        await sendMessage(chat.id, 'Welcome to the Aether Bot! Please verify your identity by sending your Aether ID (e.g., `AETH-XX12`).');
                        break;
                    
                    case '/verify':
                        await handleVerification(chat.id, args[0]);
                        break;

                    case '/events':
                        const events = await getUpcomingEvents();
                        let eventList = '📅 *Upcoming Events:*\n\n';
                        if (events.length > 0) {
                            events.forEach(event => {
                                eventList += `*${event.title}* (Code: \`${event.eventCode}\`)\n[Register Here](${event.registrationUrl})\n\n`;
                            });
                        } else {
                            eventList = 'No upcoming events right now. Check back soon!';
                        }
                        await sendMessage(chat.id, eventList);
                        break;
                    
                    case '/ask':
                        const question = args.join(' ');
                        if (!question) {
                            await sendMessage(chat.id, 'Usage: `/ask How do I join Horizon Studio?`');
                            break;
                        }
                        await logSubmission(from.id, question, 'Questions', 'General');
                        await sendMessage(chat.id, 'Thanks! Your question has been submitted.');
                        break;
                    
                    case '/asklive':
                        const [eventCode, ...liveQuestionParts] = args;
                        const liveQuestion = liveQuestionParts.join(' ');
                        if (!eventCode || !liveQuestion) {
                            await sendMessage(chat.id, 'Usage: `/asklive WAD25 How do you see AI impacting architecture?`');
                            break;
                        }
                        await logSubmission(from.id, liveQuestion, 'Questions', eventCode.toUpperCase());
                        await sendMessage(chat.id, `Thanks! Your question for event *${eventCode.toUpperCase()}* has been submitted.`);
                        break;

                    case '/suggest':
                        const suggestion = args.join(' ');
                        if (!suggestion) {
                            await sendMessage(chat.id, 'Usage: `/suggest We should have a portfolio review session.`');
                            break;
                        }
                        await logSubmission(from.id, suggestion, 'Suggestions');
                        await sendMessage(chat.id, 'Great idea! Your suggestion has been recorded.');
                        break;

                    // Fallback for unrecognized commands
                    default:
                         if (chat.type === 'private') {
                            await sendMessage(chat.id, 'Sorry, I don\'t recognize that command.');
                         }
                }
            } else if (TELEGRAM_ADMIN_ID && text.toUpperCase() === TELEGRAM_ADMIN_ID.toUpperCase()) {
                await sendMessage(chat.id, '🔑 Admin authentication successful. Fetching all submissions...');
                const submissions = await getAllSubmissions();
                if (submissions.length > 0) {
                    let report = '📝 *All Community Submissions:*\n\n';
                    submissions.forEach(sub => {
                        report += `*${sub.type}* | Context: *${sub.context}* \n> ${sub.submission}\n\n`;
                    });
                     if (report.length > 4000) {
                        await sendMessage(chat.id, 'Report is too long for one message. Sending recent entries:');
                        await sendMessage(chat.id, report.substring(0, 4000));
                    } else {
                        await sendMessage(chat.id, report);
                    }
                } else {
                    await sendMessage(chat.id, 'No submissions found.');
                }
            } else if (/AETH/i.test(text)) {
                 await handleVerification(chat.id, text);
            } else if (chat.type === 'private') {
                await sendMessage(chat.id, 'Hi there! I can only respond to commands right now. Try `/start` to see your options.');
            }
        }

        return NextResponse.json({ status: 'ok' });

    } catch (error) {
        console.error('Error processing webhook:', error);
        return NextResponse.json({ error: 'Error processing request' }, { status: 500 });
    }
}

    