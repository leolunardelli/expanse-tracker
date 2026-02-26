// Email service using Resend
// Set RESEND_API_KEY in .env for production
// Currently uses placeholder - emails will be logged to console if no key

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const APP_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@expenseflow.app';

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  if (!RESEND_API_KEY || RESEND_API_KEY === 'placeholder') {
    console.log('=== EMAIL (dev mode) ===');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${html}`);
    console.log('========================');
    return { success: true, dev: true };
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to send email: ${error}`);
  }

  return { success: true };
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${APP_URL}/auth/reset-password?token=${token}`;

  await sendEmail({
    to: email,
    subject: 'Reset your ExpenseFlow password',
    html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="width: 56px; height: 56px; background: #7F3DFF; border-radius: 16px; display: inline-flex; align-items: center; justify-content: center;">
            <span style="color: white; font-weight: bold; font-size: 24px;">E</span>
          </div>
        </div>
        
        <h1 style="font-size: 24px; font-weight: 700; text-align: center; margin-bottom: 16px; color: #212325;">
          Reset Your Password
        </h1>
        
        <p style="color: #91919F; text-align: center; margin-bottom: 32px;">
          Click the button below to reset your password. This link expires in 1 hour.
        </p>
        
        <div style="text-align: center; margin-bottom: 32px;">
          <a href="${resetUrl}" style="display: inline-block; background: #7F3DFF; color: white; padding: 14px 32px; border-radius: 16px; text-decoration: none; font-weight: 600; font-size: 16px;">
            Reset Password
          </a>
        </div>
        
        <p style="color: #91919F; font-size: 14px; text-align: center;">
          If you didn't request this, you can safely ignore this email.
        </p>
        
        <hr style="border: none; border-top: 1px solid #E0E0E0; margin: 32px 0;" />
        
        <p style="color: #C6C6C6; font-size: 12px; text-align: center;">
          ExpenseFlow - Smart Expense Tracking
        </p>
      </div>
    `,
  });
}
