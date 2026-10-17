/* ============================================================
   mailer.js — Nodemailer setup for Gmail SMTP
   Sends order notification emails to the owner.
============================================================ */

const nodemailer = require('nodemailer');

// Create reusable Gmail transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,  // Gmail App Password (16 chars, no spaces)
    },
});

/**
 * Send order notification email to restaurant owner.
 * @param {Object} order - The order details
 */
async function sendOrderEmail(order) {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log('[MAIL] Email not configured — skipping notification.');
        return;
    }

    const itemsList = order.items.map(i =>
        `  • ${i.name} × ${i.qty} = PKR ${(i.price * i.qty).toLocaleString()}`
    ).join('\n');

    const payLabels = { cod: 'Cash on Delivery', jazz: 'JazzCash', easypaisa: 'EasyPaisa' };

    const mailOptions = {
        from: `"Urban Bites Orders" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,   // send to yourself
        subject: `🔥 New Order ${order.orderId} — PKR ${order.total.toLocaleString()}`,
        text: `
══════════════════════════════
  NEW ORDER RECEIVED — Urban Bites
══════════════════════════════

Order ID  : ${order.orderId}
Customer  : ${order.customerName}
Phone     : ${order.phone}
Address   : ${order.address}
Notes     : ${order.notes || 'None'}
Payment   : ${payLabels[order.payment] || order.payment}

──────────────────────────────
  ITEMS ORDERED
──────────────────────────────
${itemsList}

──────────────────────────────
Subtotal  : PKR ${order.subtotal.toLocaleString()}
Delivery  : ${order.deliveryFee === 0 ? 'FREE' : 'PKR 150'}
TOTAL     : PKR ${order.total.toLocaleString()}
──────────────────────────────

Placed at : ${new Date().toLocaleString('en-PK', { timeZone: 'Asia/Karachi' })}
══════════════════════════════
    `.trim(),
        html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#1a1a1a;color:#fff;border-radius:12px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#e85d04,#f48c06);padding:24px 32px;">
          <h1 style="margin:0;font-size:24px;">🔥 New Order — Urban Bites</h1>
          <p style="margin:8px 0 0;opacity:0.9;font-size:14px;">Order ID: <strong>${order.orderId}</strong></p>
        </div>
        <div style="padding:24px 32px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#aaa;width:120px;">Customer</td><td style="padding:8px 0;font-weight:bold;">${order.customerName}</td></tr>
            <tr><td style="padding:8px 0;color:#aaa;">Phone</td><td style="padding:8px 0;">${order.phone}</td></tr>
            <tr><td style="padding:8px 0;color:#aaa;">Address</td><td style="padding:8px 0;">${order.address}</td></tr>
            <tr><td style="padding:8px 0;color:#aaa;">Payment</td><td style="padding:8px 0;">${payLabels[order.payment] || order.payment}</td></tr>
            ${order.notes ? `<tr><td style="padding:8px 0;color:#aaa;">Notes</td><td style="padding:8px 0;">${order.notes}</td></tr>` : ''}
          </table>
          <hr style="border:none;border-top:1px solid #333;margin:16px 0;" />
          <h3 style="color:#f48c06;margin:0 0 12px;">Items Ordered</h3>
          ${order.items.map(i => `
            <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #2a2a2a;">
              <span>${i.name} × ${i.qty}</span>
              <span style="color:#f48c06;font-weight:bold;">PKR ${(i.price * i.qty).toLocaleString()}</span>
            </div>
          `).join('')}
          <hr style="border:none;border-top:1px solid #333;margin:16px 0;" />
          <div style="display:flex;justify-content:space-between;padding:4px 0;color:#aaa;"><span>Subtotal</span><span>PKR ${order.subtotal.toLocaleString()}</span></div>
          <div style="display:flex;justify-content:space-between;padding:4px 0;color:#aaa;"><span>Delivery</span><span>${order.deliveryFee === 0 ? '<span style="color:#2ecc71;">FREE</span>' : 'PKR 150'}</span></div>
          <div style="display:flex;justify-content:space-between;padding:12px 0;font-size:20px;font-weight:bold;color:#f48c06;"><span>TOTAL</span><span>PKR ${order.total.toLocaleString()}</span></div>
          <p style="color:#888;font-size:12px;margin-top:16px;">Placed at ${new Date().toLocaleString('en-PK', { timeZone: 'Asia/Karachi' })}</p>
        </div>
      </div>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`[MAIL] Order notification sent for ${order.orderId}`);
    } catch (err) {
        console.error('[MAIL] Failed to send email:', err.message);
        // Don't throw — email failure should NOT fail the order
    }
}

module.exports = { sendOrderEmail };
