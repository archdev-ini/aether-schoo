
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
        const res = await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!json.ok) {
            console.error('Error sending Telegram message:', json.description);
        }
    } catch (error) {
        console.error('Error sending Telegram message:', error);
    }
}

// Check if a user is an admin in a specific chat
async function isUserAdmin(chatId: number, userId: number): Promise<boolean> {
    if (userId === Number(TELEGRAM_ADMIN_ID)) return true;
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
    const durationText = durationSeconds >= 86400 ? `${Math.floor(durationSeconds/86400)} days` : `${Math.floor(durationSeconds/3600)} hours`;
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

async function getAirtableBase() {
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
        console.error('Airtable API Key or Base ID is not configured.');
        return null;
    }
    return new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);
}

async function verifyMember(aetherId: string): Promise<{ verified: boolean; fullName?: string }> {
    const base = await getAirtableBase();
    if (!base || !AIRTABLE_MEMBERS_TABLE_ID) {
        console.error('Airtable credentials for members are not set in environment variables.');
        return { verified: false };
    }

    try {
        const records = await base(AIRTABLE_MEMBERS_TABLE_ID).select({
            filterByFormula: `UPPER({aetherId}) = "${aetherId.toUpperCase()}"`,
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

async function manualVerifyMember(telegramId: string, aetherId: string): Promise<{ success: boolean; message: string }> {
    const base = await getAirtableBase();
    if (!base || !AIRTABLE_MEMBERS_TABLE_ID) return { success: false, message: 'Airtable credentials for members are not set.'};

    try {
        const records = await base(AIRTABLE_MEMBERS_TABLE_ID).select({
            filterByFormula: `UPPER({aetherId}) = "${aetherId.toUpperCase()}"`,
            maxRecords: 1,
        }).firstPage();

        if (records.length === 0) {
            return { success: false, message: `Aether ID ${aetherId.toUpperCase()} not found.` };
        }

        const recordId = records[0].id;
        await base(AIRTABLE_MEMBERS_TABLE_ID).update([{ id: recordId, fields: { 'fld75Mt7o7JJj57Oi': telegramId } }], { typecast: true });
        
        return { success: true, message: `✅ User with Telegram ID ${telegramId} has been manually verified with Aether ID ${aetherId.toUpperCase()}.`};

    } catch (error) {
        console.error('Airtable manual verification error:', error);
        return { success: false, message: 'Failed to update Airtable record.' };
    }
}

async function getUpcomingEvents(): Promise<any[]> {
    const base = await getAirtableBase();
    if (!base || !AIRTABLE_EVENTS_TABLE_ID) {
        console.error('Airtable credentials for events are not set.');
        return [];
    }
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

async function getAllEventsAdmin(): Promise<any[]> {
    const base = await getAirtableBase();
    if (!base || !AIRTABLE_EVENTS_TABLE_ID) return [];
    try {
        const records = await base(AIRTABLE_EVENTS_TABLE_ID).select({
            sort: [{ field: "Date", direction: "desc" }],
        }).all();
        return records.map(record => ({
            title: record.get('Title'),
            date: record.get('Date'),
            eventCode: record.get('EventCode'),
            status: new Date(record.get('Date') as string) > new Date() ? 'Upcoming' : 'Past',
        }));
    } catch (error) {
        console.error('Airtable event admin fetching error:', error);
        return [];
    }
}


async function getAllSubmissions(limitDays: number = 0): Promise<any[]> {
    const base = await getAirtableBase();
    if (!base || !AIRTABLE_QUESTIONS_TABLE_ID) return [];

    let filterFormula = "";
    if (limitDays > 0) {
        const date = new Date();
        date.setDate(date.getDate() - limitDays);
        filterFormula = `IS_AFTER({Submitted At}, '${date.toISOString()}')`;
    }

    try {
        const records = await base(AIRTABLE_QUESTIONS_TABLE_ID).select({
            filterByFormula: filterFormula,
            sort: [{field: "Submitted At", direction: "desc"}],
        }).all();
        
        return records.map(record => ({
            submission: record.get('fldmnaDBCR8OfV83M'), // Submission Text
            type: record.get('fld9fG8yJqx3V8vA2'), // Type
            submittedAt: record.get('fldp03sHnN8A7p1bT'), // Submitted At
            context: record.get('fldzY2jK7lW1tZ0Xp') || 'General', // Context
        }));
    } catch (error) {
        console.error('Airtable submission fetching error:', error);
        return [];
    }
}

async function logSubmission(telegramUserId: number, submissionText: string, type: 'Questions' | 'Suggestions', context: string = 'General') {
    const base = await getAirtableBase();
    if (!base || !AIRTABLE_QUESTIONS_TABLE_ID) return false;
    
    try {
        await base(AIRTABLE_QUESTIONS_TABLE_ID).create([
            {
                fields: {
                    'Submission Text': submissionText,
                    'Type': type,
                    'Telegram User ID': String(telegramUserId),
                    'Context': context,
                }
            }
        ], { typecast: true });
        return true;
    } catch(error) {
        console.error('Airtable submission error:', error);
        return false;
    }
}

async function getMemberStats(): Promise<{ total: number; verified: number; pending: number } | null> {
    const base = await getAirtableBase();
    if (!base || !AIRTABLE_MEMBERS_TABLE_ID) return null;

    let total = 0;
    let verified = 0;

    try {
        await base(AIRTABLE_MEMBERS_TABLE_ID).select({
            fields: ['Telegram ID'], // Only fetch the Telegram ID field
        }).eachPage((records, fetchNextPage) => {
            records.forEach(record => {
                total++;
                if (record.get('Telegram ID')) {
                    verified++;
                }
            });
            fetchNextPage();
        });

        return { total, verified, pending: total - verified };
    } catch (error) {
        console.error('Airtable member stats error:', error);
        return null;
    }
}

// --- EVENT MANAGEMENT ---

function parseCommandArgs(text: string): Record<string, string> {
    const args: Record<string, string> = {};
    const regex = /(\w+)="([^"]+)"/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
        args[match[1]] = match[2];
    }
    return args;
}

async function createEvent(args: Record<string, string>): Promise<{ success: boolean; message: string }> {
    const base = await getAirtableBase();
    if (!base || !AIRTABLE_EVENTS_TABLE_ID) return { success: false, message: 'Airtable for events not configured.' };

    const { title, date, description, link, code } = args;
    if (!title || !date || !code) {
        return { success: false, message: 'Missing required fields. Please provide at least `title`, `date` (YYYY-MM-DD), and `code`.' };
    }

    try {
        await base(AIRTABLE_EVENTS_TABLE_ID).create([{
            fields: {
                'Title': title,
                'Date': date,
                'Description': description || '',
                'Registration URL': link || '',
                'EventCode': code.toUpperCase(),
                'Published': true, // Auto-publish new events
            }
        }], { typecast: true });
        return { success: true, message: `✅ Event "${title}" created successfully with code \`${code.toUpperCase()}\`.` };
    } catch (error) {
        console.error("Airtable create event error:", error);
        return { success: false, message: 'Failed to create event in Airtable.' };
    }
}

async function updateEvent(eventCode: string, args: Record<string, string>): Promise<{ success: boolean; message: string }> {
    const base = await getAirtableBase();
    if (!base || !AIRTABLE_EVENTS_TABLE_ID) return { success: false, message: 'Airtable for events not configured.' };

    if (Object.keys(args).length === 0) {
        return { success: false, message: 'No fields provided to update.' };
    }

    try {
        const records = await base(AIRTABLE_EVENTS_TABLE_ID).select({
            filterByFormula: `UPPER({EventCode}) = "${eventCode.toUpperCase()}"`,
            maxRecords: 1,
        }).firstPage();

        if (records.length === 0) {
            return { success: false, message: `Event with code \`${eventCode.toUpperCase()}\` not found.` };
        }

        const recordId = records[0].id;
        const fieldsToUpdate: Record<string, any> = {};

        if (args.title) fieldsToUpdate['Title'] = args.title;
        if (args.date) fieldsToUpdate['Date'] = args.date;
        if (args.description) fieldsToUpdate['Description'] = args.description;
        if (args.link) fieldsToUpdate['Registration URL'] = args.link;
        if (args.status && args.status.toLowerCase() === 'closed') {
             fieldsToUpdate['Published'] = false;
        }

        await base(AIRTABLE_EVENTS_TABLE_ID).update([{ id: recordId, fields: fieldsToUpdate }], { typecast: true });
        return { success: true, message: `✅ Event \`${eventCode.toUpperCase()}\` updated successfully.` };

    } catch (error) {
        console.error("Airtable update event error:", error);
        return { success: false, message: 'Failed to update event.' };
    }
}


// --- USER-FACING HANDLERS ---
async function handleVerification(chatId: number, aetherId: string) {
    if (!aetherId) {
        await sendMessage(chatId, 'Please provide your Aether ID.');
        return;
    }
    // Regex to match AETH- followed by any combination of letters and numbers, and hyphens.
    if (!/^AETH(-[A-Z0-9]+)+$/i.test(aetherId)) {
        await sendMessage(chatId, 'Please provide your Aether ID in a valid format, like `AETH-A2DQ0-X7`.');
        return;
    }
    const result = await verifyMember(aetherId);
    if (result.verified && result.fullName) {
        let successMessage = `✅ Verification successful! Welcome, ${result.fullName}.

*Here's what you can do:*

/events - View upcoming events.
/ask [your question] - Ask a general question to the community.
/asklive [event_code] [your question] - Ask a question during a live event.
/suggest [your idea] - Submit a suggestion.`;
        let replyMarkup = undefined;

        if (TELEGRAM_GROUP_CHAT_ID) {
            const inviteLink = await createInviteLink(TELEGRAM_GROUP_CHAT_ID);
            if (inviteLink) {
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

            // --- ADMIN COMMANDS (GROUP-ONLY for moderation) ---
            if (chat.type !== 'private' && text.startsWith('/')) {
                const isAdmin = await isUserAdmin(chat.id, from.id);
                if (isAdmin) {
                    const [command, ...args] = text.split(' ');
                    const repliedToUser = reply_to_message?.from;
                    const repliedToMessageId = reply_to_message?.message_id;
                    const targetUserId = repliedToUser?.id ?? (args[0] ? parseInt(args[0]) : undefined);

                    if (!targetUserId && ['/ban', '/unban', '/mute', '/unmute', '/del'].includes(command)) {
                        await sendMessage(chat.id, 'This command must be used as a reply to a user\'s message or with a User ID.', message.message_id);
                        return NextResponse.json({ status: 'ok' });
                    }
                    
                    if (targetUserId) {
                        const isTargetAdmin = await isUserAdmin(chat.id, targetUserId);
                        if (isTargetAdmin) {
                            await sendMessage(chat.id, 'This command cannot be used on an administrator.', message.message_id);
                            return NextResponse.json({ status: 'ok' });
                        }
                        switch (command) {
                            case '/ban':
                                await banUser(chat.id, targetUserId, args.slice(1).join(' '));
                                break;
                            case '/unban':
                                await unbanUser(chat.id, targetUserId);
                                break;
                            case '/mute':
                                const duration = parseMuteDuration(args[1] ?? args[0]);
                                if (duration > 0) {
                                    const reason = repliedToUser ? args.slice(0).join(' ') : args.slice(1).join(' ');
                                    await muteUser(chat.id, targetUserId, duration, reason);
                                } else {
                                    await sendMessage(chat.id, 'Invalid duration. Use format like `1h`, `2d`.', message.message_id);
                                }
                                break;
                            case '/unmute':
                                await unmuteUser(chat.id, targetUserId);
                                break;
                        }
                    }

                    if (command === '/del' && repliedToMessageId) {
                         await deleteMessage(chat.id, repliedToMessageId);
                         // Also delete the command message itself
                        await deleteMessage(chat.id, message.message_id);
                    }
                }
            }
            
            // --- GENERAL & ADMIN COMMANDS ---
            if (text.startsWith('/')) {
                const [command, ...args] = text.split(' ');
                const commandArgsStr = args.join(' ');

                // Handle commands that should only be used in private chat
                if (chat.type !== 'private' && ['/events', '/ask', '/asklive', '/suggest', '/start'].includes(command)) {
                    const response = await fetch(`${TELEGRAM_API_URL}/getMe`);
                    const botInfo = await response.json();
                    const botUsername = botInfo.result.username;
                    
                    await sendMessage(
                        chat.id, 
                        'To keep our chat clean, please use this command in a private message with me.', 
                        message.message_id,
                        {
                            inline_keyboard: [
                                [{ text: 'Chat with Aether Bot', url: `https://t.me/${botUsername}` }]
                            ]
                        }
                    );
                    return NextResponse.json({ status: 'ok' });
                }

                // --- Admin-only commands ---
                const isSenderAdmin = await isUserAdmin(chat.id, from.id);
                if (isSenderAdmin) {
                    switch (command) {
                        case '/createevent':
                            const createArgs = parseCommandArgs(commandArgsStr);
                            const createResult = await createEvent(createArgs);
                            await sendMessage(chat.id, createResult.message, message.message_id);
                            return NextResponse.json({ status: 'ok' });

                        case '/updateevent':
                            const [eventCodeToUpdate, ...updateParts] = args;
                            if (!eventCodeToUpdate) {
                                await sendMessage(chat.id, 'Usage: `/updateevent <event_code> key="value" ...`');
                                break;
                            }
                            const updateArgs = parseCommandArgs(updateParts.join(' '));
                            const updateResult = await updateEvent(eventCodeToUpdate, updateArgs);
                            await sendMessage(chat.id, updateResult.message, message.message_id);
                            return NextResponse.json({ status: 'ok' });

                        case '/closeevent':
                             const [eventCodeToClose] = args;
                             if (!eventCodeToClose) {
                                await sendMessage(chat.id, 'Usage: `/closeevent <event_code>`');
                                break;
                            }
                            const closeResult = await updateEvent(eventCodeToClose, { status: "closed" });
                            await sendMessage(chat.id, closeResult.message, message.message_id);
                            return NextResponse.json({ status: 'ok' });

                        case '/listevents':
                            const adminEvents = await getAllEventsAdmin();
                            let adminEventList = '📋 *All Events:*\n\n';
                            if (adminEvents.length > 0) {
                                adminEvents.forEach(event => {
                                    adminEventList += `*${event.title}*\nCode: \`${event.eventCode}\` | Status: *${event.status}*\nDate: ${new Date(event.date).toLocaleDateString()}\n\n`;
                                });
                            } else {
                                adminEventList = 'No events found.';
                            }
                            await sendMessage(chat.id, adminEventList, message.message_id);
                            return NextResponse.json({ status: 'ok' });

                        case '/registrations':
                            const [eventCodeForRegs] = args;
                            if (!eventCodeForRegs || !AIRTABLE_BASE_ID || !AIRTABLE_EVENTS_TABLE_ID) {
                                await sendMessage(chat.id, 'Usage: `/registrations <event_code>`');
                                break;
                            }
                            const registrationsLink = `https://airtable.com/${AIRTABLE_BASE_ID}/${AIRTABLE_EVENTS_TABLE_ID}?filter_EventCode=${eventCodeForRegs.toUpperCase()}`;
                            await sendMessage(chat.id, `View registrations for \`${eventCodeForRegs.toUpperCase()}\` in Airtable:\n\n${registrationsLink}`, message.message_id);
                            return NextResponse.json({ status: 'ok' });
                        
                        case '/verify':
                             const [telegramId, aetherId] = args;
                             if (!telegramId || !aetherId) {
                                 await sendMessage(chat.id, 'Usage: `/verify <telegram_user_id> <aether_id>`');
                                 break;
                             }
                             const verifyResult = await manualVerifyMember(telegramId, aetherId);
                             await sendMessage(chat.id, verifyResult.message, message.message_id);
                             return NextResponse.json({ status: 'ok' });

                        case '/members':
                            if (!AIRTABLE_BASE_ID || !AIRTABLE_MEMBERS_TABLE_ID) {
                                await sendMessage(chat.id, 'Airtable Member table is not configured.');
                                break;
                            }
                            const membersLink = `https://airtable.com/${AIRTABLE_BASE_ID}/${AIRTABLE_MEMBERS_TABLE_ID}`;
                            await sendMessage(chat.id, `View all members in Airtable:\n\n${membersLink}`, message.message_id);
                            return NextResponse.json({ status: 'ok' });

                        case '/find':
                            const [query] = args;
                            if (!query || !AIRTABLE_BASE_ID || !AIRTABLE_MEMBERS_TABLE_ID) {
                                await sendMessage(chat.id, 'Usage: `/find <username_or_aetherid>`');
                                break;
                            }
                            const findLink = `https://airtable.com/${AIRTABLE_BASE_ID}/${AIRTABLE_MEMBERS_TABLE_ID}?filter_OR(FIND(%22${query}%22%2C+LOWER(%7BfullName%7D))%2C+FIND(%22${query.toUpperCase()}%22%2C+%7BaetherId%7D))`;
                            await sendMessage(chat.id, `View search results for "${query}" in Airtable:\n\n${findLink}`, message.message_id);
                            return NextResponse.json({ status: 'ok' });

                        case '/submissions':
                             if (!AIRTABLE_BASE_ID || !AIRTABLE_QUESTIONS_TABLE_ID) {
                                await sendMessage(chat.id, 'Airtable Submissions table is not configured.');
                                break;
                            }
                            const submissionsLink = `https://airtable.com/${AIRTABLE_BASE_ID}/${AIRTABLE_QUESTIONS_TABLE_ID}`;
                            await sendMessage(chat.id, `View all community submissions in Airtable:\n\n${submissionsLink}`, message.message_id);
                            return NextResponse.json({ status: 'ok' });

                        case '/stats':
                            const stats = await getMemberStats();
                            if (stats) {
                                let statsMessage = `*📊 Community Stats*\n\n`;
                                statsMessage += `Total Members: *${stats.total}*\n`;
                                statsMessage += `Verified Members: *${stats.verified}*\n`;
                                statsMessage += `Pending Verification: *${stats.pending}*`;
                                await sendMessage(chat.id, statsMessage, message.message_id);
                            } else {
                                await sendMessage(chat.id, 'Could not retrieve community stats.', message.message_id);
                            }
                            return NextResponse.json({ status: 'ok' });

                        case '/eventstats':
                            await sendMessage(chat.id, 'This feature is coming soon!', message.message_id);
                            return NextResponse.json({ status: 'ok' });

                        case '/dailyreport':
                            const [reportDaysStr] = args;
                            const reportDays = reportDaysStr ? parseInt(reportDaysStr, 10) : 1;

                            if (isNaN(reportDays) || reportDays <= 0) {
                                await sendMessage(chat.id, 'Please provide a valid number of days for the report.', message.message_id);
                                return NextResponse.json({ status: 'ok' });
                            }
                            
                            const recentSubmissions = await getAllSubmissions(reportDays);
                            let reportMessage = `*📈 Daily Report (Last ${reportDays} Day${reportDays > 1 ? 's' : ''})*\n\n`;
                            
                            const questions = recentSubmissions.filter(s => s.type === 'Questions');
                            const suggestions = recentSubmissions.filter(s => s.type === 'Suggestions');

                            reportMessage += `*New Submissions: ${recentSubmissions.length}*\n`;
                            reportMessage += `  - Questions: ${questions.length}\n`;
                            reportMessage += `  - Suggestions: ${suggestions.length}\n\n`;
                            
                            if (recentSubmissions.length > 0) {
                                reportMessage += '*Latest Submissions:*\n';
                                recentSubmissions.slice(0, 5).forEach(s => {
                                    reportMessage += `  - *[${s.type}]* ${s.submission.substring(0, 50)}...\n`;
                                });
                            }

                            await sendMessage(chat.id, reportMessage, message.message_id);
                            return NextResponse.json({ status: 'ok' });
                    }
                }

                switch (command) {
                    case '/start':
                        await sendMessage(chat.id, 'Welcome to the Aether Bot! Please verify your identity by sending your Aether ID (e.g., `AETH-A2DQ0-X7`).');
                        break;
                    
                    case '/verify': // This case is now for regular users
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

                    // Fallback for unrecognized commands that are not admin commands
                    default:
                         if (chat.type === 'private' && !isSenderAdmin) {
                            await sendMessage(chat.id, 'Sorry, I don\'t recognize that command.');
                         }
                }
            } else if (text.toUpperCase().startsWith('AETH-')) {
                 await handleVerification(chat.id, text);
            } else if (chat.type === 'private') {
                await sendMessage(chat.id, 'Hi there! I can only respond to commands right now. Try `/start` to see your options.');
            }
        }

        return NextResponse.json({ status: 'ok' });

    } catch (error) {
        console.error('Error processing webhook:', error);
        if (error instanceof Error) {
            console.error(error.stack);
        }
        return NextResponse.json({ error: 'Error processing request' }, { status: 500 });
    }
}
