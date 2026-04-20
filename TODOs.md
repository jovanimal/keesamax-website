Resend Email service
  📋 Remaining operational tasks (you/Andrew do these)

  1. Sign up at resend.com with the business email. Free tier (100/day, 3k/month) is plenty for a contact form.
  2. Verify keesamax.com in Resend. Needs DNS access — you'll add TXT records (SPF + DKIM) and optionally MX for the return-path. If DNS is at the
  registrar, this is where the neighbour may need help.
  3. Create an API key → set RESEND_API_KEY in .env.local for dev, and in Vercel → Project → Environment Variables for production.
  4. Set CONTACT_EMAIL_FROM to something on the verified domain, e.g. Keesamax Website <noreply@keesamax.com>. The current fallback onboarding@resend.dev
   only works for testing.
  5. Set CONTACT_EMAIL_TO to whoever should receive enquiries (can be [andrew@, mayann@] if you tweak the route to accept an array).
  6. Add a DMARC record (v=DMARC1; p=none; rua=mailto:...) — not required, but hugely improves Gmail/Outlook deliverability so enquiries don't land in
  spam.

Notion
Task 15 — share the Notion page with your friend

  1. Open the Keesamax — Job Listings page.
  2. Click Share (top right) → type your friend's email → set permission to Can edit → send.
  3. Send them the page link + a one-liner: "Read the guide at the top of the page to get started. Changes take up to 1 hour to show up on the site."