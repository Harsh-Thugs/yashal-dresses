export const INITIAL_CATEGORIES = [
  { name: "Formal Shirts", icon: "Shirt" },
  { name: "Casual Shirts", icon: "Shirt" },
  { name: "Formal Trousers", icon: "Layers" },
  { name: "Party Wear Trousers", icon: "Sparkles" },
  { name: "Cotton Pants", icon: "Layers" },
  { name: "Cargos", icon: "Layers" },
  { name: "Formal T-Shirts", icon: "Shirt" },
  { name: "Party Wear T-Shirts", icon: "Sparkles" },
  { name: "Sweatshirts", icon: "Wind" },
  { name: "Kurta Pyjamas", icon: "Crown" },
  { name: "Short Kurtas", icon: "Crown" },
];

export const HUES = [
  ["#D4AF37", "#8B6914"], ["#6B1E42", "#3A0F26"], ["#1B4332", "#0F2A1E"],
  ["#1B2A4A", "#0D1830"], ["#7A3B12", "#4A230A"], ["#3B2063", "#241040"],
  ["#8A5A3B", "#5C3A24"], ["#2E2A22", "#1A1712"],
];
export const hueFor = (i) => HUES[i % HUES.length];

export const sizesFor = (cat) => {
  if (["Formal Trousers", "Party Wear Trousers", "Cotton Pants", "Cargos"].includes(cat)) {
    return ["30", "32", "34", "36", "38", "40"];
  }
  return ["S", "M", "L", "XL", "XXL"];
};

export const INITIAL_BRANDS = [
  { name: "Zodiac" },
  { name: "Blackberry" },
  { name: "J. Hampstead" },
  { name: "Ramraj" },
  { name: "Double Bull" },
  { name: "Santorini" },
  { name: "Enrage" },
  { name: "Fenjina" },
  { name: "Live in" },
  { name: "Turtle" },
  { name: "Classic Song" },
  { name: "Regan Club" },
  { name: "Z3 (Premium)" },
  { name: "Structuren n Cargo" },
  { name: "Senate" },
  { name: "Pecanz" },
  { name: "D code" },
  { name: "Amnesia" },
  { name: "QYZ" },
  { name: "Evals" },
  { name: "Apollo" },
  { name: "Tiber" },
  { name: "Kanchiro" },
  { name: "Beeves" },
  { name: "T-Bas" },
  { name: "Monte Carlo" },
  { name: "Cool Colors" },
  { name: "Dukes" },
  { name: "Confidence" },
  { name: "Classic Polo" },
  { name: "Octave" },
  { name: "Pzoulz" },
  { name: "Red Fox" },
  { name: "Homme" },
  { name: "Velmore" },
  { name: "Sanwara" },
  { name: "Sastrang" },
  { name: "Eastern Looms" },
  { name: "Exploser" },
];

const RAW = [
  // Formal Shirts (Full Sleeves & Half Sleeves)
  ["Formal Shirts", "Zodiac Milano Classic Full Sleeve Shirt", 2299, 2799, "Zodiac"],
  ["Formal Shirts", "Blackberry Executive Crisp White Full Sleeve Shirt", 1899, 2399, "Blackberry"],
  ["Formal Shirts", "J. Hampstead Premium Egyptian Cotton Shirt", 2499, 2999, "J. Hampstead"],
  ["Formal Shirts", "Ramraj Pristine White Half Sleeve Pure Cotton Shirt", 1199, 1499, "Ramraj"],
  ["Formal Shirts", "Double Bull Fine Micro Check Formal Shirt", 1399, 1799, "Double Bull"],
  ["Formal Shirts", "Santorini Tailored Royal Blue Full Sleeve Shirt", 1999, 2499, "Santorini"],
  ["Formal Shirts", "Enrage Oxford Poplin Half Sleeve Formal Shirt", 1299, 1699, "Enrage"],
  ["Formal Shirts", "Fenjina Italian Twill Full Sleeve Formal Shirt", 1799, 2299, "Fenjina"],
  ["Formal Shirts", "Live in Comfort Stretch Half Sleeve Shirt", 1399, 1799, "Live in"],
  ["Formal Shirts", "Turtle Modern Slim Fit Full Sleeve Formal Shirt", 1699, 2199, "Turtle"],

  // Casual Shirts
  ["Casual Shirts", "Classic Song Washed Indigo Denim Casual Shirt", 1599, 1999, "Classic Song"],
  ["Casual Shirts", "Regan Club Tartan Plaid Casual Shirt", 1499, 1899, "Regan Club"],
  ["Casual Shirts", "Z3 (Premium) Lustre Linen Blend Casual Shirt", 2799, 3499, "Z3 (Premium)"],
  ["Casual Shirts", "Structuren n Cargo Heavy Utility Overshirt", 1999, 2499, "Structuren n Cargo"],
  ["Casual Shirts", "Senate Soft Touch Chambray Casual Shirt", 1399, 1799, "Senate"],
  ["Casual Shirts", "Pecanz Retro Printed Cuban Collar Casual Shirt", 1299, 1699, "Pecanz"],

  // Formal Trousers
  ["Formal Trousers", "Blackberry Tailored Fit Charcoal Formal Trouser", 1999, 2499, "Blackberry"],
  ["Formal Trousers", "D code Executive Poly-Viscose Slim Trouser", 1499, 1899, "D code"],
  ["Formal Trousers", "Pecanz Flat Front Deep Navy Formal Trouser", 1399, 1799, "Pecanz"],
  ["Formal Trousers", "Live in Wrinkle-Resistant Slate Formal Trouser", 1599, 1999, "Live in"],
  ["Formal Trousers", "Amnesia Dark Grey Structured Formal Trouser", 1699, 2199, "Amnesia"],

  // Party Wear Trousers
  ["Party Wear Trousers", "QYZ Satin Finish Jet Black Party Trouser", 2199, 2799, "QYZ"],
  ["Party Wear Trousers", "Evals Metallic Sheen Slim Party Wear Trouser", 2399, 2999, "Evals"],

  // Cotton Pants
  ["Cotton Pants", "Live in Ultra-Soft Chino Cotton Pants", 1499, 1899, "Live in"],
  ["Cotton Pants", "Apollo Khaki Everyday Stretch Cotton Pant", 1299, 1699, "Apollo"],
  ["Cotton Pants", "Tiber Olive Garment-Dyed Cotton Pant", 1399, 1799, "Tiber"],
  ["Cotton Pants", "Blackberry Beige Structured Cotton Twill Pant", 1899, 2399, "Blackberry"],

  // Cargos
  ["Cargos", "Kanchiro 6-Pocket Tactical Utility Cargo", 1899, 2399, "Kanchiro"],
  ["Cargos", "Beeves Military Olive Relaxed Fit Cargo", 1799, 2299, "Beeves"],
  ["Cargos", "T-Bas Heavy Duty Ripstop Khaki Cargo", 1999, 2499, "T-Bas"],

  // Formal T-Shirts
  ["Formal T-Shirts", "Monte Carlo Mercerised Cotton Solid Polo", 1699, 2199, "Monte Carlo"],
  ["Formal T-Shirts", "Cool Colors Solid Pastel Collar Tee", 999, 1299, "Cool Colors"],
  ["Formal T-Shirts", "Dukes Classic Knit Solid Formal Collar Tee", 1199, 1499, "Dukes"],
  ["Formal T-Shirts", "Confidence Structured Ribbed Collar Polo", 1099, 1399, "Confidence"],
  ["Formal T-Shirts", "Classic Polo Signature Pique Solid Tee", 1299, 1699, "Classic Polo"],
  ["Formal T-Shirts", "Octave Compact Cotton Formal Polo Tee", 1399, 1799, "Octave"],
  ["Formal T-Shirts", "Pzoulz Tipped Collar Smart Formal Polo", 1199, 1599, "Pzoulz"],
  ["Formal T-Shirts", "Blackberry Luxe Stretch Formal Polo Tee", 1799, 2299, "Blackberry"],

  // Party Wear T-Shirts
  ["Party Wear T-Shirts", "Red Fox Velour Textured Graphic Party Tee", 1499, 1899, "Red Fox"],
  ["Party Wear T-Shirts", "Homme Metallic Accent Slim Party T-Shirt", 1699, 2199, "Homme"],
  ["Party Wear T-Shirts", "Octave Jacquard Knit Evening Party Tee", 1599, 1999, "Octave"],

  // Sweatshirts
  ["Sweatshirts", "Monte Carlo Premium Fleece Crewneck Sweatshirt", 2299, 2899, "Monte Carlo"],
  ["Sweatshirts", "Octave Heavyweight Pullover Winter Sweatshirt", 1999, 2499, "Octave"],

  // Kurta Pyjamas
  ["Kurta Pyjamas", "Velmore Royal Jacquard Kurta Pyjama Set", 2999, 3799, "Velmore"],
  ["Kurta Pyjamas", "Sanwara Embroidered Silk Blend Kurta Pyjama", 3499, 4299, "Sanwara"],
  ["Kurta Pyjamas", "Sastrang Handloom Cotton Kurta Pyjama Set", 2199, 2699, "Sastrang"],
  ["Kurta Pyjamas", "Eastern Looms Traditional Linen Kurta Pyjama", 2799, 3499, "Eastern Looms"],
  ["Kurta Pyjamas", "Exploser Festive Designer Kurta Pyjama Set", 3199, 3999, "Exploser"],
  ["Kurta Pyjamas", "Ramraj Traditional Pure Cotton Kurta Pyjama", 1899, 2399, "Ramraj"],

  // Short Kurtas
  ["Short Kurtas", "Cool Colors Solid Mandarin Collar Short Kurta", 1199, 1499, "Cool Colors"],
  ["Short Kurtas", "Ramraj Handloom Pure Cotton Short Kurta", 1399, 1799, "Ramraj"],
  ["Short Kurtas", "Velmore Printed Casual Short Kurta", 1599, 1999, "Velmore"],
];

const TAGS = ["Bestseller", "New", "Sale", null, null, null];

export const INITIAL_PRODUCTS = RAW.map((r, i) => {
  const [category, name, price, mrp, brand] = r;
  const [c1, c2] = hueFor(i);
  const sizes = sizesFor(category);
  
  // Set initial realistic stock quantities for each size
  const stock = {};
  sizes.forEach((s, idx) => {
    const qty = (i * 7 + idx * 3) % 15;
    stock[s] = qty;
  });
  
  const isOutOfStockDemo = (i === 3 || i === 18);
  if (isOutOfStockDemo) {
    sizes.forEach(s => { stock[s] = 0; });
  }

  const totalStockCount = Object.values(stock).reduce((a, b) => a + b, 0);

  return {
    id: `YD-${100 + i}`,
    category,
    brand: brand || "Zodiac",
    name,
    price,
    mrp,
    c1, c2,
    image: null,
    images: [],
    sizes,
    stock,
    inStock: !isOutOfStockDemo && totalStockCount > 0,
    rating: (3.8 + ((i * 37) % 12) / 10).toFixed(1),
    reviews: 20 + ((i * 53) % 380),
    tag: TAGS[i % TAGS.length],
    gsm: 180 + (i % 5) * 35,
    weave: category.includes("Trouser") || category === "Cotton Pants" ? "Fine Tailored Twill" : category === "Cargos" ? "Heavy Ripstop 100% Cotton" : category.includes("Kurta") ? "Handloom Mercerised Weave" : "Premium Compact Cotton",
    desc: `Cut from premium grade fabric and finished with ${brand}'s signature stitch detailing, the ${name} is crafted for everyday elegance and long-lasting shape wash after wash.`,
  };
});

export const INITIAL_ORDERS = [
  {
    id: "ORD-98421",
    date: "2026-08-25T14:32:00",
    customer: {
      name: "Harshvardhan Shinde",
      phone: "9822019283",
      email: "harsh.shinde@example.com",
      address: "Bungalow No. 4, Model Colony, Pune - 411016",
    },
    items: [
      {
        id: "YD-142",
        name: "Velmore Royal Jacquard Kurta Pyjama Set",
        size: "L",
        quantity: 1,
        price: 2999,
        brand: "Velmore",
      }
    ],
    subtotal: 2999,
    tax: 0,
    shipping: 0,
    total: 2999,
    status: "Confirmed",
    paymentMethod: "Razorpay / UPI",
    paymentStatus: "Paid",
    transactionId: "pay_Q7f1mN8xL9p2Zq",
  }
];

export const STORE_CONTACT = {
  name: "Yashal Dresses",
  tagline: "Exclusive Menswear Studio & Ready-to-Wear Atelier",
  address: "Shop No. 4 & 5, Heritage Plaza, F.C. Road, Shivajinagar, Pune, Maharashtra 411005",
  phone: "+91 96735 33839",
  email: "yashaldressespune@gmail.com",
  senderEmail: "dressesyashal@gmail.com",
  hours: "Monday - Sunday: 10:30 AM to 9:30 PM",
  mapsUrl: "https://maps.google.com/?q=FC+Road+Shivajinagar+Pune+Yashal+Dresses",
};

export const money = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");

export const EMAIL_AUTOMATION_CONFIG = {
  senderEmail: "dressesyashal@gmail.com",
  storeEmail: "yashaldressespune@gmail.com",
  scriptWebhookKey: "yd_email_webhook_url",
  defaultWebhookUrl: "",
};

export const GOOGLE_APPS_SCRIPT_EMAIL_CODE = `/**
 * Yashal Dresses - Automated Order Confirmation Email Webhook
 * Set up instructions:
 * 1. Open Google Sheets / Apps Script (script.google.com) under your 'dressesyashal@gmail.com' account.
 * 2. Paste this code into Code.gs
 * 3. Click 'Deploy' -> 'New deployment' -> Select type 'Web app'.
 * 4. Set Execute as: "Me (dressesyashal@gmail.com)" and Who has access: "Anyone".
 * 5. Copy the Web App URL and paste it in the Yashal Merchant Workroom under 'Email Automation'.
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    
    var orderId = data.orderId || "ORD-" + Math.floor(10000 + Math.random() * 90000);
    var customerName = data.customerName || "Valued Patron";
    var customerEmail = data.customerEmail;
    var customerPhone = data.customerPhone || "N/A";
    var deliveryAddress = data.deliveryAddress || "Store Pickup / Not Provided";
    var grandTotal = data.grandTotal || "₹0";
    var paymentMethod = data.paymentMethod || "Online (Razorpay / UPI)";
    var items = data.items || [];
    
    var itemsTableRows = "";
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      itemsTableRows += '<tr style="border-bottom: 1px solid #eee;">' +
        '<td style="padding: 10px; font-weight: bold; color: #1a1a1a;">' + item.name + '<br><span style="font-size: 11px; color: #888;">Brand: ' + (item.brand || 'Yashal') + ' | Size: ' + (item.size || 'Standard') + '</span></td>' +
        '<td style="padding: 10px; text-align: center; color: #444;">' + item.quantity + '</td>' +
        '<td style="padding: 10px; text-align: right; color: #b8860b; font-weight: bold;">₹' + Number(item.price * item.quantity).toLocaleString('en-IN') + '</td>' +
      '</tr>';
    }

    var htmlBody = '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0d0b0; border-radius: 8px; overflow: hidden; background-color: #faf9f6;">' +
      '<div style="background-color: #12100e; padding: 24px; text-align: center; border-bottom: 2px solid #b8860b;">' +
        '<h1 style="color: #d4af37; margin: 0; font-size: 24px; letter-spacing: 2px; text-transform: uppercase;">Yashal Dresses</h1>' +
        '<p style="color: #e0d0b0; margin: 4px 0 0 0; font-size: 12px; letter-spacing: 1px;">HAUTE COUTURE & READY-TO-WEAR MENSWEAR</p>' +
      '</div>' +
      '<div style="padding: 24px; color: #2d2d2d;">' +
        '<h2 style="color: #12100e; font-size: 18px; margin-top: 0;">Order Confirmed! Ref #' + orderId + '</h2>' +
        '<p>Dear <strong>' + customerName + '</strong>,</p>' +
        '<p>Thank you for choosing Yashal Dresses. Your bespoke garment order has been received and confirmed by our atelier.</p>' +
        '<table style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #ffffff; border-radius: 6px; overflow: hidden; border: 1px solid #eaeaea;">' +
          '<thead style="background-color: #f5f0e6; color: #12100e; font-size: 12px; text-transform: uppercase;">' +
            '<tr>' +
              '<th style="padding: 10px; text-align: left;">Garment</th>' +
              '<th style="padding: 10px; text-align: center;">Qty</th>' +
              '<th style="padding: 10px; text-align: right;">Amount</th>' +
            '</tr>' +
          '</thead>' +
          '<tbody>' + itemsTableRows + '</tbody>' +
        '</table>' +
        '<div style="text-align: right; margin-bottom: 20px; font-size: 16px;">' +
          '<span>Grand Total: </span><strong style="color: #b8860b; font-size: 18px;">' + grandTotal + '</strong>' +
        '</div>' +
        '<div style="background-color: #f0ebe1; padding: 14px; border-radius: 6px; font-size: 12px; line-height: 1.6; margin-bottom: 20px;">' +
          '<strong>Delivery & Customer Details:</strong><br>' +
          'Patron: ' + customerName + ' (' + customerPhone + ')<br>' +
          'Address: ' + deliveryAddress + '<br>' +
          'Payment Status: ' + paymentMethod + ' (Verified)' +
        '</div>' +
        '<p style="font-size: 13px; color: #666; margin-bottom: 0;">For inquiries or sizing adjustments, reach us at <a href="tel:+919673533839" style="color: #b8860b;">+91 96735 33839</a> or visit our store at FC Road, Shivajinagar, Pune.</p>' +
      '</div>' +
      '<div style="background-color: #12100e; padding: 12px; text-align: center; font-size: 11px; color: #a09070;">' +
        '© ' + new Date().getFullYear() + ' Yashal Dresses. All rights reserved.' +
      '</div>' +
    '</div>';

    if (customerEmail) {
      MailApp.sendEmail({
        to: customerEmail,
        subject: "Yashal Dresses - Order Confirmation & Invoice #" + orderId,
        htmlBody: htmlBody,
        replyTo: "yashaldressespune@gmail.com"
      });
    }

    // Always send an internal notification to the store manager
    MailApp.sendEmail({
      to: "yashaldressespune@gmail.com",
      subject: "🚨 NEW ORDER RECEIVED: #" + orderId + " (" + grandTotal + ") - " + customerName,
      htmlBody: htmlBody,
    });

    return ContentService.createTextOutput(JSON.stringify({ status: "success", orderId: orderId })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}
`;
