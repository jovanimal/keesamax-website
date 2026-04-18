import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";

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
    const toAddr = process.env.CONTACT_EMAIL_TO ?? "andrew@keesamax.com";
    const fromAddr =
      process.env.CONTACT_EMAIL_FROM ?? "Keesamax Website <onboarding@resend.dev>";

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
