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

