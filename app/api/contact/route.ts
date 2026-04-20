import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { site } from "@/data/site";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_CV_TYPES: string[] = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const bodySchema = z.object({
  fullName: z.string().min(2).max(120),
  email: z.string().email().max(200),
  phone: z.string().max(40).optional(),
  message: z.string().min(10).max(5000),
});

interface ContactAttachment {
  filename: string;
  content: Buffer;
}

export async function POST(request: Request): Promise<Response> {
  try {
    const formData = await request.formData();

    const honeypot = formData.get("website");
    if (typeof honeypot === "string" && honeypot.trim().length > 0) {
      return NextResponse.json({ ok: true });
    }

    const parsed = bodySchema.safeParse({
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      phone: formData.get("phone") || undefined,
      message: formData.get("message"),
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please check your input and try again." },
        { status: 400 },
      );
    }

    const { fullName, email, phone, message } = parsed.data;

    const attachments: ContactAttachment[] = [];
    const cv = formData.get("cv");
    if (cv instanceof File && cv.size > 0) {
      if (cv.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: "CV must be 5MB or smaller." },
          { status: 400 },
        );
      }
      if (!ACCEPTED_CV_TYPES.includes(cv.type)) {
        return NextResponse.json(
          { error: "CV must be a PDF or DOC file." },
          { status: 400 },
        );
      }
      const buf = Buffer.from(await cv.arrayBuffer());
      attachments.push({ filename: cv.name, content: buf });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const toAddr = process.env.CONTACT_EMAIL_TO ?? site.email.andrew;
    const fromAddr =
      process.env.CONTACT_EMAIL_FROM ??
      `${site.name} Recruitment <onboarding@resend.dev>`;

    if (!apiKey) {
      console.error("RESEND_API_KEY is not set — dropping contact submission", {
        fullName,
        email,
      });
      return NextResponse.json(
        { error: "Email service not configured yet. Please WhatsApp us instead." },
        { status: 503 },
      );
    }

    const resend = new Resend(apiKey);

    const html = `
      <div style="font-family:Inter,Arial,sans-serif;font-size:14px;color:#0f172a;line-height:1.6">
        <h2 style="margin:0 0 12px">New contact from keesamax.com</h2>
        <table style="border-collapse:collapse;width:100%;max-width:600px">
          <tr><td style="padding:6px 0;color:#64748b">Name</td><td style="padding:6px 0"><strong>${escapeHtml(fullName)}</strong></td></tr>
          <tr><td style="padding:6px 0;color:#64748b">Email</td><td style="padding:6px 0"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
          <tr><td style="padding:6px 0;color:#64748b">Phone</td><td style="padding:6px 0">${escapeHtml(phone ?? "—")}</td></tr>
        </table>
        <div style="margin-top:16px;padding:16px;background:#f8fafc;border-left:3px solid #0f2341;border-radius:6px">
          <div style="color:#64748b;font-size:12px;margin-bottom:6px">MESSAGE</div>
          <div style="white-space:pre-wrap">${escapeHtml(message)}</div>
        </div>
        ${attachments.length > 0 ? `<p style="margin-top:16px;color:#64748b">📎 CV attached: ${escapeHtml(attachments[0].filename)}</p>` : ""}
      </div>
    `;

    const { error } = await resend.emails.send({
      from: fromAddr,
      to: [toAddr],
      replyTo: email,
      subject: `New inquiry from ${fullName}`,
      html,
      attachments: attachments.map((a) => ({
        filename: a.filename,
        content: a.content,
      })),
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Could not send email. Please try WhatsApp." },
        { status: 502 },
      );
    }

    const autoReplyHtml = buildAutoReplyHtml({ fullName, message });

    const { error: autoReplyError } = await resend.emails.send({
      from: fromAddr,
      to: [email],
      replyTo: toAddr,
      subject: `We received your message — ${site.name}`,
      html: autoReplyHtml,
    });

    if (autoReplyError) {
      console.error("Resend auto-reply error:", autoReplyError);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact route error:", err);
    return NextResponse.json(
      { error: "Unexpected error. Please try again." },
      { status: 500 },
    );
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

interface AutoReplyInput {
  fullName: string;
  message: string;
}

function buildAutoReplyHtml({ fullName, message }: AutoReplyInput): string {
  const name = escapeHtml(fullName);
  const msg = escapeHtml(message);
  const brand = escapeHtml(site.name);
  const legal = escapeHtml(site.legalName);
  const registration = escapeHtml(site.registration);
  const tagline = escapeHtml(site.tagline);
  const waDisplay = escapeHtml(site.whatsapp.display);
  const waUrl = site.whatsapp.url;
  const siteUrl = site.url;
  const siteHost = siteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const contactEmail = escapeHtml(site.email.contact);

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>${brand}</title>
  </head>
  <body style="margin:0;padding:0;background:#f5f1e8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
    <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;color:transparent;">
      Thanks for reaching out to ${brand}. We'll reply within 1–2 business days.
    </div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f5f1e8;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 4px 16px rgba(15,35,65,0.08);">
            <tr>
              <td style="background:#0f2341;padding:36px 40px;text-align:center;">
                <div style="color:#ffffff;font-size:26px;font-weight:700;letter-spacing:-0.5px;line-height:1.2;">${brand}</div>
                <div style="color:#a9b7cf;font-size:13px;margin-top:8px;letter-spacing:0.3px;">${tagline}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:40px 40px 24px;color:#0f172a;font-size:15px;line-height:1.7;">
                <p style="margin:0 0 18px;font-size:19px;font-weight:600;color:#0f2341;">Hi ${name},</p>
                <p style="margin:0 0 14px;">Thanks for reaching out to <strong>${legal}</strong>. We've received your message and one of our team will get back to you within <strong>1–2 business days</strong>.</p>
                <p style="margin:0 0 8px;color:#475569;">Here's a copy of what you sent us:</p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:12px 0 28px;">
                  <tr>
                    <td style="padding:20px 24px;background:#f8fafc;border-left:4px solid #0f2341;border-radius:8px;">
                      <div style="color:#64748b;font-size:11px;font-weight:700;letter-spacing:1.2px;margin-bottom:10px;">YOUR MESSAGE</div>
                      <div style="white-space:pre-wrap;color:#1e293b;font-size:14px;line-height:1.65;">${msg}</div>
                    </td>
                  </tr>
                </table>
                <p style="margin:0 0 16px;color:#475569;">Need an answer sooner? Reach us directly on WhatsApp.</p>
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 8px;">
                  <tr>
                    <td style="border-radius:8px;background:#25D366;">
                      <a href="${waUrl}" style="display:inline-block;padding:13px 26px;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;letter-spacing:0.2px;">Chat on WhatsApp →</a>
                    </td>
                  </tr>
                </table>
                <p style="margin:8px 0 0;color:#94a3b8;font-size:13px;">${waDisplay}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 40px 32px;border-top:1px solid #e2e8f0;background:#fafafa;color:#64748b;font-size:12px;line-height:1.7;text-align:center;">
                <div style="color:#0f172a;font-weight:600;margin-bottom:4px;">${legal}</div>
                <div style="color:#94a3b8;font-size:11px;margin-bottom:10px;">${registration}</div>
                <div>
                  <a href="${siteUrl}" style="color:#475569;text-decoration:none;">${escapeHtml(siteHost)}</a>
                  <span style="color:#cbd5e1;margin:0 8px;">·</span>
                  <a href="mailto:${contactEmail}" style="color:#475569;text-decoration:none;">${contactEmail}</a>
                </div>
                <div style="margin-top:14px;color:#94a3b8;font-size:11px;">This is an automated confirmation — replies go straight to our team.</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
