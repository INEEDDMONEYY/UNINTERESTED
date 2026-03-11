import { Resend } from "resend";
import env from "../config/env.js";

const resend = new Resend(env.RESEND_API_KEY);

async function sendWelcomeEmail({ to, username }) {
  if (!to) {
    throw new Error("Missing required email parameter: 'to'");
  }

  await resend.emails.send({
    from: "Mystery Mansion <no-reply@mysterymansion.xyz>",
    to,
    subject: "Welcome to Mystery Mansion",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
        <h2>Welcome to Mystery Mansion</h2>
        <p>Hi ${username || "there"},</p>
        <p>Congratulations and welcome to the platform.</p>
        <p>Your account is now active and you can start exploring posts, profiles, and updates.</p>
        <p style="margin: 20px 0;">
          <a
            href="${env.CLIENT_URL}/home"
            style="background: #111; color: #fff; padding: 12px 18px; text-decoration: none; border-radius: 6px; display: inline-block;"
          >
            Go to Mystery Mansion
          </a>
        </p>
        <hr />
        <p style="font-size: 12px; color: #777;">© ${new Date().getFullYear()} Mystery Mansion. All rights reserved.</p>
      </div>
    `,
  });
}

export default sendWelcomeEmail;
