
export const categories = [
  "All",
  "Coquette & Soft Girl",
  "Korean Minimal",
  "Y2K & Indie Sleaze",
  "Streetwear",
  "Old Money",
  "Boho & Vintage"
];

const categoryNames: Record<string, string> = {
  coquette: "Coquette & Soft Girl",
  korean: "Korean Minimal",
  y2k: "Y2K & Indie Sleaze",
  streetwear: "Streetwear",
  oldmoney: "Old Money",
  boho: "Boho & Vintage"
};

const categoryImages: Record<string, string[]> = {
  coquette: Array.from({ length: 7 }, (_, i) => `/images/products/coquette-${String(i + 1).padStart(2, "0")}.jpg`),
  korean: Array.from({ length: 7 }, (_, i) => `/images/products/korean-${String(i + 1).padStart(2, "0")}.jpg`),
  y2k: Array.from({ length: 7 }, (_, i) => `/images/products/y2k-${String(i + 1).padStart(2, "0")}.jpg`),
  streetwear: Array.from({ length: 7 }, (_, i) => `/images/products/streetwear-${String(i + 1).padStart(2, "0")}.jpg`),
  oldmoney: Array.from({ length: 7 }, (_, i) => `/images/products/oldmoney-${String(i + 1).padStart(2, "0")}.jpg`),
  boho: Array.from({ length: 7 }, (_, i) => `/images/products/boho-${String(i + 1).padStart(2, "0")}.jpg`)
};

const styles = [
  // COQUETTE
  ["coquette", "The Rosalie Corset", "Ivory lace corset top with delicate floral detailing.", "Cotton lace", "Ivory"],
  ["coquette", "The Blush Belle", "Soft pink puff-sleeve blouse with a romantic bow neckline.", "Cotton blend", "Blush pink"],
  ["coquette", "The Pearl Darling", "Cream embroidered top with pearl-inspired details.", "Embroidered cotton", "Cream"],
  ["coquette", "The Cherry Muse", "Deep cherry-red fitted mini dress with a sweetheart neckline.", "Stretch satin", "Cherry red"],
  ["coquette", "The Juliet Skirt Set", "Floral fitted top paired with a delicate pleated mini skirt.", "Cotton blend", "Blush floral"],
  ["coquette", "The Ribbon Affair", "Ivory bow-detail blouse with a softly structured silhouette.", "Soft cotton", "Ivory"],
  ["coquette", "The Sugarplum Mini", "Pastel pink pleated mini dress with a feminine fitted bodice.", "Polyester blend", "Pastel pink"],

  // KOREAN MINIMAL
  ["korean", "The Seoul Edit", "Oversized white button-down shirt with a relaxed fit.", "Cotton poplin", "White"],
  ["korean", "The Sunday Knit", "Soft beige oversized knit sweater.", "Fine knit", "Oatmeal"],
  ["korean", "The Noir Basic", "Minimal black fitted top with a clean neckline.", "Ribbed cotton", "Black"],
  ["korean", "The Cream Muse", "Tailored cream waistcoat with a delicate silhouette.", "Polyester blend", "Cream"],
  ["korean", "The Mocha Midi", "Chocolate-brown fitted midi dress.", "Stretch knit", "Mocha"],
  ["korean", "The Grey Hour", "Soft grey fitted top with a minimalist finish.", "Ribbed knit", "Grey"],
  ["korean", "The Seoul Skirt", "Classic black pleated mini skirt.", "Polyester blend", "Black"],

  // Y2K
  ["y2k", "The Cherry Pop", "Red baby tee with a playful graphic print.", "Cotton jersey", "Cherry red"],
  ["y2k", "The Denim Crush", "Low-rise denim mini skirt with a vintage wash.", "Denim", "Washed blue"],
  ["y2k", "The Star Girl", "Black fitted crop top with a statement star print.", "Cotton jersey", "Black"],
  ["y2k", "The After Hours", "Black fitted corset top with a sleek silhouette.", "Stretch fabric", "Black"],
  ["y2k", "The Cargo Muse", "Relaxed olive cargo trousers with utility pockets.", "Cotton twill", "Olive"],
  ["y2k", "The Baby Tee", "White fitted baby tee with a tiny cherry graphic.", "Cotton jersey", "White"],
  ["y2k", "The Midnight Mini", "Black fitted mini dress for an effortless night-out look.", "Stretch knit", "Black"],

  // STREETWEAR
  ["streetwear", "The Off-Duty Hoodie", "Oversized charcoal hoodie with a relaxed silhouette.", "Fleece cotton", "Charcoal"],
  ["streetwear", "The Downtown Tee", "Oversized white graphic T-shirt.", "Cotton jersey", "White"],
  ["streetwear", "The Utility Cargo", "Black wide-leg cargo trousers with multiple pockets.", "Cotton twill", "Black"],
  ["streetwear", "The Varsity Muse", "Relaxed varsity jacket with contrasting sleeves.", "Fleece blend", "Black and cream"],
  ["streetwear", "The Baggy Edit", "Light-wash baggy denim jeans.", "Denim", "Light blue"],
  ["streetwear", "The Street Layer", "Oversized black zip-up sweatshirt.", "Cotton fleece", "Black"],
  ["streetwear", "The Weekend Fit", "Relaxed grey co-ord sweatshirt and joggers.", "Cotton blend", "Heather grey"],

  // OLD MONEY
  ["oldmoney", "The Riviera Shirt", "Crisp white tailored shirt with a relaxed elegant fit.", "Cotton poplin", "White"],
  ["oldmoney", "The Heritage Vest", "Chocolate tailored waistcoat with a refined cut.", "Suiting fabric", "Chocolate"],
  ["oldmoney", "The Ivory Trousers", "High-waisted cream tailored wide-leg trousers.", "Polyester blend", "Ivory"],
  ["oldmoney", "The Classic Knit", "Beige fine-knit sweater with a clean neckline.", "Fine knit", "Beige"],
  ["oldmoney", "The Paris Midi", "Black elegant midi dress with a fitted waist.", "Crepe", "Black"],
  ["oldmoney", "The Sunday Blazer", "Structured camel blazer with a timeless silhouette.", "Suiting fabric", "Camel"],
  ["oldmoney", "The Quiet Luxury", "Cream pleated tailored mini skirt.", "Suiting fabric", "Cream"],

  // BOHO
  ["boho", "The Wildflower Maxi", "Flowing floral maxi dress with a soft bohemian silhouette.", "Rayon", "Earthy floral"],
  ["boho", "The Desert Muse", "Rust-coloured embroidered blouse with relaxed sleeves.", "Cotton", "Terracotta"],
  ["boho", "The Vintage Lace", "Cream lace blouse with delicate vintage detailing.", "Cotton lace", "Cream"],
  ["boho", "The Earthy Skirt", "Flowy brown printed maxi skirt.", "Rayon", "Chocolate floral"],
  ["boho", "The Sunflower Top", "Mustard yellow puff-sleeve blouse.", "Cotton", "Mustard"],
  ["boho", "The Wanderer Vest", "Crochet-inspired sleeveless vest with a relaxed fit.", "Crochet knit", "Natural beige"],
  ["boho", "The Golden Hour", "Flowing rust midi dress with a flattering waist.", "Rayon blend", "Rust"]
] as const;

const colours = [
  "Ivory",
  "Black",
  "Blush Pink",
  "Chocolate",
  "Sage Green"
];

const tags = [
  "NEW DROP",
  "PINTEREST PICK",
  "BESTSELLER",
  "TRENDING",
  "MUSE FAVOURITE"
];

const sizes = ["XS", "S", "M", "L", "XL"];

export const products = styles.map((style, index) => {
  const [key, name, description, fabric, color] = style;
  const price = 499 + ((index * 73) % 501);
  const discount = index % 3 === 0 ? 20 : index % 3 === 1 ? 15 : 10;
  const originalPrice = Math.round(price / (1 - discount / 100));

  return {
    id: index + 1,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    name,
    category: categoryNames[key],
    categoryKey: key,
    description,
    fabric,
    color,

    image: categoryImages[key][index % 7],
    images: [categoryImages[key][index % 7]],

    price,
    originalPrice,
    discount,

    tag: tags[index % tags.length],
    isNew: index < 12,
    isBestseller: index % 5 === 0,

    colours,
    sizes,

    inStock: true,
    stockCount: 5 + ((index * 7) % 20),

    rating: Number((4.2 + ((index * 7) % 8) / 10).toFixed(1)),
    reviewCount: 12 + ((index * 13) % 180),

    searchText: `${name} ${description} ${categoryNames[key]} ${fabric} ${color}`.toLowerCase()
  };
});

export type Product = (typeof products)[number];
