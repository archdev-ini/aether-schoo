
'use server';

import nodemailer from 'nodemailer';

interface WelcomeEmailProps {
    to: string;
    name: string;
    aetherId: string;
    token: string;
    type: 'welcome' | 'login';
}

export async function sendWelcomeEmail({ to, name, aetherId, token, type }: WelcomeEmailProps) {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM_EMAIL } = process.env;

    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !SMTP_FROM_EMAIL) {
        console.error('SMTP configuration is missing. Cannot send email.');
        // In a real app, you might want to handle this more gracefully,
        // but for now, we'll log the error and let the signup succeed.
        return;
    }

    const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: parseInt(SMTP_PORT, 10),
        secure: parseInt(SMTP_PORT, 10) === 465, // true for 465, false for other ports
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASS,
        },
    });

    const activationLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/activate?token=${token}`;
    const firstName = name.split(' ')[0];

    const subject = type === 'welcome' 
        ? '✨ Activate your Aether ID'
        : '🔑 Your secure login link to Aether';

    const welcomeBody = `
        <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
            <h2>Hi ${firstName},</h2>
            <p>You’re one step away from joining Aether.</p>
            <p>Click below to activate your permanent Aether ID:</p>
            <p style="text-align: center; margin: 30px 0;">
                <a href="${activationLink}" style="background-color: #7c3aed; color: white; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">👉 Activate My Aether ID</a>
            </p>
            <p>Your Aether ID: <strong>${aetherId}</strong></p>
            <br>
            <p>Welcome to the future of design.<br>— Team Aether</p>
        </div>
    `;

    const loginBody = `
        <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
            <h2>Hello ${firstName},</h2>
            <p>Here’s your secure link to log back into your Aether dashboard:</p>
            <p style="text-align: center; margin: 30px 0;">
                <a href="${activationLink}" style="background-color: #7c3aed; color: white; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Log Me In</a>
            </p>
            <p style="font-size: 0.9em; color: #666;">This link will expire in 15 minutes for your security.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p>If you didn’t request this login, you can safely ignore this email.</p>
            <p>See you inside,<br>The Aether Team</p>
        </div>
    `;

    const mailOptions = {
        from: `Aether <${SMTP_FROM_EMAIL}>`,
        to,
        subject,
        html: type === 'welcome' ? welcomeBody : loginBody,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`'${type}' email sent successfully to:`, to);
    } catch (error) {
        console.error(`Error sending '${type}' email:`, error);
        // We throw the error so the calling function knows something went wrong.
        throw new Error('Failed to send email.');
    }
}
