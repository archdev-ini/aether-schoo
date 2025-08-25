
'use server';

import nodemailer from 'nodemailer';

interface WelcomeEmailProps {
    to: string;
    name: string;
    aetherId: string;
    token: string;
}

export async function sendWelcomeEmail({ to, name, aetherId, token }: WelcomeEmailProps) {
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

    const emailBody = `
        <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
            <h2>Hello ${name},</h2>
            <p>Welcome to Aether 🌍 — you’re now part of a growing community of designers and builders shaping the future.</p>
            <p>Your Aether ID: <strong>${aetherId}</strong><br>(Keep this safe — it’s your unique identity in the ecosystem.)</p>
            <p>👉 To access your dashboard and set up your profile, click below:</p>
            <p style="text-align: center; margin: 30px 0;">
                <a href="${activationLink}" style="background-color: #7c3aed; color: white; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Activate My Account</a>
            </p>
            <p style="font-size: 0.9em; color: #666;">This link will log you in securely (no password needed). It will expire in 15 minutes for your security.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <h3>Inside your dashboard, you’ll find:</h3>
            <ul>
                <li>🌱 A quick Profile Setup</li>
                <li>📚 Starter learning primers (Sustainability, African Design Traditions, BIM Intro)</li>
                <li>📅 Countdown to World Architecture Day Launch</li>
                <li>🎖️ Your Progress Tracker (Lite)</li>
            </ul>
            <p>We’re excited to have you on this journey. 🚀</p>
            <p>See you inside,<br>The Aether Team</p>
        </div>
    `;

    const mailOptions = {
        from: `Aether <${SMTP_FROM_EMAIL}>`,
        to,
        subject: '🎉 Welcome to Aether! Here’s your Aether ID',
        html: emailBody,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Welcome email sent successfully to:', to);
    } catch (error) {
        console.error('Error sending welcome email:', error);
        // We throw the error so the calling function knows something went wrong.
        throw new Error('Failed to send welcome email.');
    }
}
