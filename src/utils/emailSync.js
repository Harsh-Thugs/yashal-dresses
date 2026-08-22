export const EMAIL_AUTOMATION_CONFIG = {
  sender: "dressesyashal@gmail.com",
  recipient: "yashaldressespune@gmail.com",
  subject: "Order Confirmed!"
};

export function generateOrderMailtoUrl(order) {
  if (!order) return "#";
  const subject = encodeURIComponent("Order Confirmed!");
  const itemsList = (order.items || [])
    .map(
      (item, idx) =>
        `${idx + 1}. ${item.name} (Size: ${item.size}) x ${item.qty} — ₹${(
          item.price * item.qty
        ).toLocaleString("en-IN")}`
    )
    .join("\n");

  const body = encodeURIComponent(`Order Confirmed!

A new order has been confirmed at Yashal Dresses.

━━━━━━━━━━━━━━━━━━━━
Order Particulars:
• Order ID: ${order.id}
• Date: ${order.date}
• Customer Name: ${order.address?.name || "Customer"}
• Customer Phone: ${order.address?.phone || "N/A"}
• Delivery Address: ${order.address?.line1 || ""}, ${
    order.address?.city || ""
  }, PIN: ${order.address?.pincode || ""}

Garments Ordered:
${itemsList}

Payment Summary:
• Grand Total Paid: ₹${(order.total || 0).toLocaleString("en-IN")}
• Payment Method: ${order.paymentMethod || "Razorpay / Online"}
• Transaction Ref: ${order.transactionId || "N/A"}
━━━━━━━━━━━━━━━━━━━━
Store Address: Yashal Dresses, Sector 25, Plot 601, Nigdi, Pradhikaran, Opposite MSEB OFFICE, PUNE: 411044
Shop Helpline: 9673533839 | yashaldressespune@gmail.com
Sender: dressesyashal@gmail.com
Recipient: yashaldressespune@gmail.com`);

  return `mailto:yashaldressespune@gmail.com?subject=${subject}&body=${body}`;
}

export async function sendOrderConfirmationEmail(order, webhookUrl) {
  if (!order) return false;

  const payload = {
    subject: "Order Confirmed!",
    from: "dressesyashal@gmail.com",
    to: "yashaldressespune@gmail.com",
    orderId: order.id,
    date: order.date,
    customerName: order.address?.name || "Customer",
    phone: order.address?.phone || "N/A",
    address: `${order.address?.line1 || ""}, ${order.address?.city || ""}, PIN: ${
      order.address?.pincode || ""
    }`,
    items: (order.items || [])
      .map(
        (i) =>
          `${i.name} (Size: ${i.size}) x ${i.qty} — ₹${(
            i.price * i.qty
          ).toLocaleString("en-IN")}`
      )
      .join("<br/>"),
    rawItems: (order.items || [])
      .map((i) => `${i.name} [Size ${i.size}] x ${i.qty}`)
      .join("; "),
    totalAmount: order.total || 0,
    paymentMethod: order.paymentMethod || "Razorpay / Online",
    transactionId: order.transactionId || "N/A",
    storeAddress:
      "Yashal Dresses, Sector 25, Plot 601, Nigdi, Pradhikaran, Opposite MSEB OFFICE, PUNE: 411044"
  };

  const storedUrl = typeof localStorage !== "undefined" ? localStorage.getItem("yd_email_webhook_v14") : "";
  const url = (webhookUrl || (storedUrl ? JSON.parse(storedUrl) : "")).trim();

  if (url) {
    try {
      await fetch(url, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      console.log("Automated order email dispatched to Google Apps Script webhook");
      return true;
    } catch (e) {
      console.warn("Automated email dispatch error:", e);
    }
  }
  return false;
}

export const GOOGLE_APPS_SCRIPT_EMAIL_CODE = `// =========================================================================
// GOOGLE APPS SCRIPT: AUTOMATED ORDER CONFIRMATION EMAIL
// DEPLOY UNDER: dressesyashal@gmail.com
// SENDS TO: yashaldressespune@gmail.com
// SUBJECT: Order Confirmed!
// =========================================================================
// INSTRUCTIONS:
// 1. Log in to your Google Account (dressesyashal@gmail.com)
// 2. Open https://script.google.com/home/start and click "+ New project"
// 3. Delete any default text, paste this complete script, and click "Save"
// 4. Click "Deploy" > "New deployment"
//    - Select type: "Web app"
//    - Description: "Yashal Dresses Order Email Dispatcher"
//    - Execute as: "Me (dressesyashal@gmail.com)"
//    - Who has access: "Anyone"
// 5. Click "Deploy", authorize Gmail permissions, and copy the Web app URL.
// 6. Paste the URL in Merchant Portal > Email Automation tab.
// =========================================================================

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var recipient = "yashaldressespune@gmail.com";
    var subject = "Order Confirmed!";

    var htmlBody = '<div style="font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FBF6EC; border: 2px solid #D4AF37; border-radius: 12px; overflow: hidden;">' +
      '<div style="background-color: #1A1224; padding: 24px; text-align: center; border-bottom: 2px solid #D4AF37;">' +
        '<h1 style="color: #D4AF37; margin: 0; font-size: 26px; font-weight: bold; letter-spacing: 1px;">YASHAL DRESSES</h1>' +
        '<p style="color: #F2E8D6; margin: 6px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2px;">Official Order Confirmation & Goods Receipt</p>' +
      '</div>' +
      '<div style="padding: 24px; color: #1A1224;">' +
        '<div style="background-color: #ffffff; border-left: 4px solid #1B9C82; padding: 14px 18px; border-radius: 6px; margin-bottom: 20px;">' +
          '<h2 style="margin: 0; color: #1A1224; font-size: 18px; font-weight: bold;">Order Confirmed! 🎉</h2>' +
          '<p style="margin: 4px 0 0 0; font-size: 13px; color: #555;">A new order has been confirmed on the Yashal Dresses store.</p>' +
        '</div>' +
        '<table style="width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; border: 1px solid #e2d9c8; font-size: 13px;">' +
          '<tr style="background-color: #1A1224; color: #D4AF37;"><th colspan="2" style="padding: 10px 14px; text-align: left; font-size: 12px; letter-spacing: 1px;">ORDER PARTICULARS</th></tr>' +
          '<tr style="border-bottom: 1px solid #eee;"><td style="padding: 10px 14px; font-weight: bold; color: #666; width: 35%;">Order ID</td><td style="padding: 10px 14px; font-family: monospace; font-weight: bold; color: #1A1224; font-size: 14px;">' + (data.orderId || '') + '</td></tr>' +
          '<tr style="border-bottom: 1px solid #eee;"><td style="padding: 10px 14px; font-weight: bold; color: #666;">Date</td><td style="padding: 10px 14px;">' + (data.date || '') + '</td></tr>' +
          '<tr style="border-bottom: 1px solid #eee;"><td style="padding: 10px 14px; font-weight: bold; color: #666;">Customer Name</td><td style="padding: 10px 14px; font-weight: 600;">' + (data.customerName || '') + '</td></tr>' +
          '<tr style="border-bottom: 1px solid #eee;"><td style="padding: 10px 14px; font-weight: bold; color: #666;">Customer Phone</td><td style="padding: 10px 14px;"><a href="tel:' + (data.phone || '') + '" style="color: #1A1224; font-weight: bold; text-decoration: none;">📞 ' + (data.phone || '') + '</a></td></tr>' +
          '<tr style="border-bottom: 1px solid #eee;"><td style="padding: 10px 14px; font-weight: bold; color: #666;">Delivery Address</td><td style="padding: 10px 14px;">' + (data.address || '') + '</td></tr>' +
          '<tr style="border-bottom: 1px solid #eee;"><td style="padding: 10px 14px; font-weight: bold; color: #666;">Garments Ordered</td><td style="padding: 10px 14px; line-height: 1.5;">' + (data.items || '') + '</td></tr>' +
          '<tr style="border-bottom: 1px solid #eee;"><td style="padding: 10px 14px; font-weight: bold; color: #666;">Payment Method</td><td style="padding: 10px 14px;">' + (data.paymentMethod || '') + '</td></tr>' +
          '<tr style="border-bottom: 1px solid #eee;"><td style="padding: 10px 14px; font-family: monospace;">' + (data.transactionId || 'N/A') + '</td></tr>' +
          '<tr style="background-color: #fff9e6;"><td style="padding: 12px 14px; font-weight: bold; color: #1A1224; font-size: 14px;">Grand Total Paid</td><td style="padding: 12px 14px; font-weight: bold; color: #A8841C; font-size: 18px;">₹' + Number(data.totalAmount || 0).toLocaleString('en-IN') + '</td></tr>' +
        '</table>' +
        '<div style="margin-top: 24px; padding: 14px; background-color: #ffffff; border-radius: 8px; border: 1px dashed #D4AF37; font-size: 12px; color: #666; text-align: center;">' +
          '<p style="margin: 0 0 4px 0; font-weight: bold; color: #1A1224;">Yashal Dresses Workroom</p>' +
          '<p style="margin: 0;">Sector 25, Plot 601, Nigdi, Pradhikaran, Opposite MSEB OFFICE, PUNE: 411044</p>' +
          '<p style="margin: 4px 0 0 0;">📞 Helpline: 9673533839 | ✉️ yashaldressespune@gmail.com</p>' +
        '</div>' +
      '</div>' +
    '</div>';

    // Send email from dressesyashal@gmail.com to yashaldressespune@gmail.com
    MailApp.sendEmail({
      to: recipient,
      subject: subject,
      htmlBody: htmlBody
    });

    return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Email sent with subject: Order Confirmed!" })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}
`;
