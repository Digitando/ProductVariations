const nodemailer = require('nodemailer')

let transporter = null
let transportChecked = false

function escapeHtml(input = '') {
  return input.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case '&':
        return '&amp;'
      case '<':
        return '&lt;'
      case '>':
        return '&gt;'
      case '"':
        return '&quot;'
      case "'":
        return '&#39;'
      default:
        return char
    }
  })
}

function ensureTransporter() {
  if (transportChecked) {
    return transporter
  }

  transportChecked = true

  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT || 0)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const from = process.env.EMAIL_FROM || user

  if (!host || !port || !from) {
    console.warn(
      'Email transport is disabled. Set SMTP_HOST, SMTP_PORT, and EMAIL_FROM (or SMTP_USER) to enable welcome emails.',
    )
    transporter = null
    return transporter
  }

  const secure = String(process.env.SMTP_SECURE || '').toLowerCase() === 'true' || port === 465

  try {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: user && pass ? { user, pass } : undefined,
    })
  } catch (error) {
    console.error('Failed to configure mail transport', error)
    transporter = null
  }

  return transporter
}

async function sendWelcomeEmail({ to, name }) {
  const transport = ensureTransporter()
  if (!transport || !to) {
    return false
  }

  const from = process.env.EMAIL_FROM || process.env.SMTP_USER
  const displayName = name && name.trim() ? name.trim() : to.split('@')[0]
  const safeName = escapeHtml(displayName)

  const subject = 'Thanks for joining Product Variations'
  const text = `Hi ${displayName},\n\nThank you for registering with Product Variations. You can now save your generated sessions, revisit your library, and manage your profile at any time.\n\nIf you did not create this account, please reply to this email so we can help.\n\n— The Product Variations team`
  const html = `
    <p>Hi ${safeName},</p>
    <p>Thanks for registering with <strong>Product Variations</strong>! Your account is ready to save garment uploads, download assets, and manage your prompts.</p>
    <p>Need a quick start? Jump back into the generator or explore your personal library from the navigation.</p>
    <p>If this wasn’t you, reply to this email and we will help immediately.</p>
    <p>— The Product Variations team</p>
  `

  try {
    await transport.sendMail({
      to,
      from,
      subject,
      text,
      html,
    })
    return true
  } catch (error) {
    console.error('Failed to send welcome email', error)
    return false
  }
}

module.exports = {
  sendWelcomeEmail,
}
