// utils/sendzResetEmail.js

const { Resend } = require("resend");
const env = require("../config/env"); // centralized env setup

// Initialize Resend client with API key from environment variables
const resend = new Resend(env.RESEND_API_KEY);

/**
 * Sends a password reset email to a user
 *
 * @param {Object} params
 * @param {string} params.to - Recipient email
 * @param {string} params.username - Username for personalization
 * @param {string} params.resetToken - Token to append to frontend reset password URL
 */
async function sendResetEmail({ to, username, resetToken }) {
  if (!to || !resetToken) {
    throw new Error("Missing required email parameters: 'to' or 'resetToken'");
  }

  try {
    // Construct the full reset URL pointing to your frontend route
    const resetUrl = `${env.CLIENT_URL}/reset-password/${resetToken}`;

    await resend.emails.send({
      from: "Mystery Mansion <no-reply@mysterymansion.xyz>",
      to,
      subject: "Reset Your Mystery Mansion Password",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Password Reset Request</h2>
          <p>Hi ${username || "there"},</p>
          <p>We received a request to reset your password for your <strong>Mystery Mansion</strong> account.</p>
          <p>Click the button below to reset your password:</p>
          <p style="margin: 20px 0;">
            <a
              href="${resetUrl}"
              style="
                background: #000;
                color: #fff;
                padding: 12px 18px;
                text-decoration: none;
                border-radius: 6px;
                display: inline-block;
              "
            >
              Reset Password
            </a>
          </p>
          <p>This link will expire in <strong>1 hour</strong>.</p>
          <p>If you didn’t request this, you can safely ignore this email.</p>
          <hr />
          <p style="font-size: 12px; color: #777;">© ${new Date().getFullYear()} Mystery Mansion. All rights reserved.</p>
        </div>
      `,
    });

    console.log(`✅ Password reset email sent to ${to}`);
  } catch (err) {
    console.error("❌ Failed to send reset email:", err.message);
    throw new Error("Email service failed. Please try again later.");
  }
}

module.exports = sendResetEmail;
