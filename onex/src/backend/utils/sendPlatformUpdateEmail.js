import { Resend } from "resend";
import env from "../config/env.js";

const resend = new Resend(env.RESEND_API_KEY);

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendPlatformUpdateEmail({ to, username, title, description, type }) {
  if (!to || !title || !description) {
    throw new Error("Missing required email parameters for platform update notification");
  }

  const updateUrl = `${env.CLIENT_URL}/platform-updates`;
  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description).replace(/\n/g, "<br />");
  const safeType = type === "feature" ? "Feature Update" : "Platform Update";

  await resend.emails.send({
    from: "Mystery Mansion <no-reply@mysterymansion.xyz>",
    to,
    subject: `New ${safeType}: ${title}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
        <h2 style="margin-bottom: 8px;">A new ${safeType.toLowerCase()} has shipped</h2>
        <p>Hi ${escapeHtml(username || "there")},</p>
        <p>We just published a new update on <strong>Mystery Mansion</strong>.</p>
        <div style="margin: 20px 0; padding: 16px; border: 1px solid #eee; border-radius: 10px; background: #fafafa;">
          <p style="margin: 0 0 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: #666;">${safeType}</p>
          <h3 style="margin: 0 0 10px;">${safeTitle}</h3>
          <p style="margin: 0;">${safeDescription}</p>
        </div>
        <p style="margin: 20px 0;">
          <a
            href="${updateUrl}"
            style="background: #000; color: #fff; padding: 12px 18px; text-decoration: none; border-radius: 6px; display: inline-block;"
          >
            View Platform Updates
          </a>
        </p>
        <hr />
        <p style="font-size: 12px; color: #777;">© ${new Date().getFullYear()} Mystery Mansion. All rights reserved.</p>
      </div>
    `,
  });
}

export async function notifyUsersAboutPlatformUpdate({ users, update }) {
  const recipients = Array.isArray(users)
    ? users.filter((user) => user?.email && user?.status !== "suspended")
    : [];

  const results = await Promise.allSettled(
    recipients.map((user) =>
      sendPlatformUpdateEmail({
        to: user.email,
        username: user.username,
        title: update.title,
        description: update.description,
        type: update.type,
      })
    )
  );

  const sent = results.filter((result) => result.status === "fulfilled").length;
  const failed = results.length - sent;

  return { sent, failed, attempted: results.length };
}