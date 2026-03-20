import { Resend } from "resend";
import env from "../config/env.js";

const resend = new Resend(env.RESEND_API_KEY);

async function sendWelcomeEmail({ to, username }) {
  if (!to) {
    throw new Error("Missing required email parameter: 'to'");
  }

  await resend.emails.send({
    from: "Mystery Mansion <no-reply@mysterymansion.app>",
    to,
    subject: "Welcome to Mystery Mansion",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
        <h2>Welcome to Mystery Mansion 🎉🎊</h2>
        <p>Hi ${username || "there"},</p>
        <p>Glad to have you here.</p>
        <p>You can post your ad for free and start getting exposure right away.</p>
        <p><strong>To activate your promo:</strong></p>
        <ul style="margin: 8px 0 16px 18px; padding: 0;">
          <li>Complete your profile (photo + bio + age + gender).</li>
          <li>Create your first post &amp; redeem code upon post creation (or activate it in dashboard settings).</li>
        </ul>
        <p>Early profiles are getting homepage promotion + a Founding Provider badge (limited).</p>
        <p>If you need anything, just message support — the platform is actively monitored for safety.</p>
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
