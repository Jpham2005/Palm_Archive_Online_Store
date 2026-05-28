import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import OpenAI from "openai";

const app = express();
const port = process.env.PORT || 4000;
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// Set USE_DEMO_PRODUCTS=true in .env when you want to test/edit the sample products below.
// If this is false and MONGODB_URI works, products will come from MongoDB instead.
const useDemoProducts = process.env.USE_DEMO_PRODUCTS === "true";

// Backup For MongoDB
const demoProducts = [

    //BALENCIAGA Products
  {
    "name": "Cow Print BB Logo Sunglasses",
    "designer": "Balenciaga",
    "category": "Glasses",
    "price": 259,
    "image": "/images/balen1.jpg",
    "tags": [
      "balenciaga",
      "men",
      "women",
      "unisex",
      "sunglasses",
      "glasses",
      "eyewear",
      "cow print",
      "bb logo",
      "black",
      "white",
      "archive"
    ]
  },
  {
    "name": "3D Liquified Men Hoodie",
    "designer": "Balenciaga",
    "category": "Outerwear",
    "price": 1300,
    "image": "/images/balen2.jpg",
    "tags": [
      "balenciaga",
      "hoodie",
      "black",
      "oversized",
      "graphic",
      "streetwear",
      "men",
      "archive"
    ]
  },
  {
    "name": "Sport Icon Ski Puffer",
    "designer": "Balenciaga",
    "category": "Outerwear",
    "price": 4300,
    "image": "/images/balen3.jpg",
    "tags": [
      "balenciaga",
      "puffer",
      "jacket",
      "outerwear",
      "ski",
      "winter",
      "black",
      "sport icon",
      "archive"
    ]
  },

    //Acne-Studio Products
  {
    "name": "Logo Embroidered Hat",
    "designer": "Acne Studios",
    "category": "Accessories",
    "price": 280,
    "image": "/images/acne1.jpg",
    "tags": [
      "acne studios",
      "hat",
      "cap",
      "logo",
      "embroidered",
      "accessories",
      "streetwear"
    ]
  },
  {
    "name": "Black Printed Logo Longsleeve",
    "designer": "Acne Studios",
    "category": "Tops",
    "price": 370,
    "image": "/images/acne2.jpg",
    "tags": [
      "acne studios",
      "longsleeve",
      "t-shirt",
      "black",
      "printed logo",
      "top",
      "streetwear"
    ]
  },
  {
    "name": "Logo Cotton Jersey T-Shirt in Pink",
    "designer": "Acne Studios",
    "category": "Tops",
    "price": 378,
    "image": "/images/acne3.jpg",
    "tags": [
      "acne studios",
      "women",
      "t-shirt",
      "longsleeve",
      "tee",
      "pink",
      "cotton",
      "jersey",
      "logo",
      "top"
    ]
  },

    //LV Products
  {
    "name": "Louis Vuitton Millionaire Sunglasses",
    "designer": "Louis Vuitton",
    "category": "Glasses",
    "price": 450,
    "image": "/images/louis1.png",
    "tags": [
      "louis vuitton",
      "lv",
      "men",
      "women",
      "glasses",
      "sunglasses",
      "black",
      "gold",
      "monogram"
    ]
  },
  {
    "name": "Louis Vuitton Speedy P9 Bandouliere 50 Turquoise",
    "designer": "Louis Vuitton",
    "category": "Bag",
    "price": 22000,
    "image": "/images/louis2.png",
    "tags": [
      "louis vuitton",
      "lv",
      "men",
      "women",
      "bag",
      "blue",
      "monogram"
    ]
  },
  {
    "name": "Louis Vuitton Capucines Mini Leather",
    "designer": "Louis Vuitton",
    "category": "Bag",
    "price": 2860,
    "image": "/images/louis3.png",
    "tags": [
      "louis vuitton",
      "lv",
      "women",
      "bag",
      "browne",
      "monogram"
    ]
  },
  {
    "name": "Louis Vuitton Pharrel X Nigo Christopher BackPack",
    "designer": "Louis Vuitton",
    "category": "Bag",
    "price": 19500,
    "image": "/images/louis4.png",
    "tags": [
      "louis vuitton",
      "lv",
      "men",
      "browne",
      "pharrel",
      "backpack"
    ]
  },
  {
    "name": "Louis Vuitton Soul Trunk ",
    "designer": "Louis Vuitton",
    "category": "Bag",
    "price": 2200,
    "image": "/images/louis5.png",
    "tags": [
      "louis vuitton",
      "lv",
      "men",
      "green",
      "pharrel",
      "bag",
      "monogram"
    ]
  },
  {
    "name": "Louis Vuitton Embroided Demin kimono Jacket ",
    "designer": "Louis Vuitton",
    "category": "Outerwear",
    "price": 9200,
    "image": "/images/louis6.png",
    "tags": [
      "louis vuitton",
      "lv",
      "men",
      "navy",
      "pharrel",
      "jacket",
      "Outerwear",
      "jean",
      "monogram"
    ]
  },
  {
    "name": "Louis Vuitton Trainer Sneaker ",
    "designer": "Louis Vuitton",
    "category": "Sneaker",
    "price": 1800,
    "image": "/images/louis7.png",
    "tags": [
      "louis vuitton",
      "lv",
      "men",
      "women",
      "navy",
      "sneaker",
      "Blue demin",
      "monogram"
    ]
  },

  //BAPE Products
  {
    "name": "BAPE Abc Camo Milo on Big Ape T-Shirt",
    "designer": "Bape",
    "category": "Tops",
    "price": 180,
    "image": "/images/bape1.jpg",
    "tags": [
      "bape",
      "men",
      "woman",
      "t-shirt",
      "tee",
      "shirt",
      "black",
      "navy",
      "blue camo",
      "ape head"
    ]
  },
  {
    "name": "BAPE Check Gift Ape Head Cap",
    "designer": "Bape",
    "category": "Accessories",
    "price": 200,
    "image": "/images/bape2.jpg",
    "tags": [
      "bape",
      "men",
      "woman",
      "Checked red",
      "red",
      "hat",
      "cap",
      "ape head",
      "accessories",
      "streetwear"
    ]
  },
  {
    "name": "BAPE Indigo Shark Button Hoodie ",
    "designer": "Bape",
    "category": "Outerwear",
    "price": 920,
    "image": "/images/bape3.jpg",
    "tags": [
      "bape",
      "men",
      "woman",
      "hoodie",
      "navy",
      "blue camo",
      "Indigo",
      "ape head",
      "Shark"
    ]
  },
  {
    "name": "BAPE Shark Full Zip Double Hoodie ",
    "designer": "Bape",
    "category": "Outerwear",
    "price": 840,
    "image": "/images/bape4.jpg",
    "tags": [
      "bape",
      "men",
      "woman",
      "hoodie",
      "black",
      "green camo",
      "yellow camo",
      "ape head",
      "Shark"
    ]
  },
  {
    "name": "BAPE Abc Camo Shark Silver T-Shirt",
    "designer": "Bape",
    "category": "Tops",
    "price": 185,
    "image": "/images/bape5.jpg",
    "tags": [
      "bape",
      "men",
      "woman",
      "t-shirt",
      "tee",
      "shirt",
      "black",
      "navy",
      "blue camo",
      "ape head",
      "shark"
    ]
  },
  {
    "name": "BAPE Ape Head oversized Jean",
    "designer": "Bape",
    "category": "Bottoms",
    "price": 490,
    "image": "/images/bape6.jpg",
    "tags": [
      "bape",
      "men",
      "black",
      "Jean",
      "ape head",
    ]
  },

  //Maison Margiela Products
  {
    "name": "Maison Margiela Paint Replica Low-top Sneaker ",
    "designer": "Maison Margiela",
    "category": "Sneaker",
    "price": 1500,
    "image": "/images/mm1.png",
    "tags": [
      "maison Margiela",
      "men",
      "women",
      "navy",
      "sneaker",
      "black"
    ]
  },
  {
    "name": "Maison Margiela MM6 Men's Long Sleeve",
    "designer": "Maison Margiela",
    "category": "Tops",
    "price": 185,
    "image": "/images/mm2.png",
    "tags": [
      "maison Margiela",
      "men",
      "women",
      "black",
      "maison margiela logo",
      "streetwear"
    ]
  },
  {
    "name": "Maison Margiela X Gentle Monster Square Sunglasses",
    "designer": "Maison Margiela",
    "category": "Glasses",
    "price": 772,
    "image": "/images/mm3.png",
    "tags": [
      "maison Margiela",
      "men",
      "women",
      "black",
      "glasses",
      "maison margiela logo",
      "streetwear"
    ]
  },
  {
    "name": "Maison Margiela X Gentle Monster Square Sunglasses",
    "designer": "Maison Margiela",
    "category": "Glasses",
    "price": 790,
    "image": "/images/mm4.png",
    "tags": [
      "maison Margiela",
      "men",
      "women",
      "black",
      "clear",
      "glasses",
      "maison margiela logo",
      "streetwear"
    ]
  },

  //Bottega Veneta Products
  {
    "name": "Bottega Veneta Medium Andiamo Intrecciato Shoulder Bag",
    "designer": "Bottega Veneta",
    "category": "Bag",
    "price": 8200,
    "image": "/images/vb1.png",
    "tags": [
      "bottega veneta",
      "women",
      "black",
      "bag",
      "bottega veneta logo"
    ]
  },
  {
    "name": "Bottega Veneta Large Diago Black Bag",
    "designer": "Bottega Veneta",
    "category": "Bag",
    "price": 4650,
    "image": "/images/vb2.png",
    "tags": [
      "bottega veneta",
      "women",
      "man",
      "black",
      "bag",
      "bottega veneta logo"
    ]
  },
  {
    "name": "Bottega Veneta NAVY BLUE Quilted vest with leather inserts",
    "designer": "Bottega Veneta",
    "category": "Outerwear",
    "price": 5870,
    "image": "/images/vb3.png",
    "tags": [
      "bottega veneta",
      "navy",
      "man",
      "black",
      "jacket",
      "bottega veneta logo",
      "outerwear"
    ]
  },

  //Prada Products
  {
    "name": "Bottega Veneta Medium Andiamo Intrecciato Shoulder Bag",
    "designer": "Bottega Veneta",
    "category": "Bag",
    "price": 8200,
    "image": "/images/vb1.png",
    "tags": [
      "bottega veneta",
      "women",
      "black",
      "bag",
      "bottega veneta logo"
    ]
  },
  {
    "name": "Bottega Veneta Large Diago Black Bag",
    "designer": "Bottega Veneta",
    "category": "Bag",
    "price": 4650,
    "image": "/images/vb2.png",
    "tags": [
      "bottega veneta",
      "women",
      "man",
      "black",
      "bag",
      "bottega veneta logo"
    ]
  },
  {
    "name": "Bottega Veneta NAVY BLUE Quilted vest with leather inserts",
    "designer": "Bottega Veneta",
    "category": "Outerwear",
    "price": 5870,
    "image": "/images/vb3.png",
    "tags": [
      "bottega veneta",
      "navy",
      "man",
      "black",
      "jacket",
      "bottega veneta logo",
      "outerwear"
    ]
  },

];

const productSchema = new mongoose.Schema(
  {
    name: String,
    designer: String,
    category: String,
    price: Number,
    image: String,
    tags: [String]
  },
  { timestamps: true }
);
productSchema.index({ name: "text", designer: "text", category: "text", tags: "text" });
const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

let mongoReady = false;
if (process.env.MONGODB_URI && !useDemoProducts) {
  mongoose
    .connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 2500 })
    .then(() => {
      mongoReady = true;
      console.log("MongoDB connected");
    })
    .catch(() => console.log("MongoDB unavailable, using demo products"));
} else {
  console.log("Using demo products from server.js");
}

app.use(express.json());

// During development, stop the browser from keeping old HTML/CSS/JS files.
app.use((request, response, next) => {
  if (process.env.NODE_ENV !== "production") {
    response.set("Cache-Control", "no-store");
  }
  next();
});

app.use(express.static("public", { etag: false, lastModified: false, cacheControl: false }));

function demoSearch(query) {
  const terms = query
    .toLowerCase()
    .split(/\W+/)
    .filter((term) => term.length > 2 && !["under", "over", "for", "with"].includes(term));

  if (terms.length === 0) return demoProducts;

  return demoProducts.filter((item) => {
    const text = [item.name, item.designer, item.category, ...item.tags].join(" ").toLowerCase();
    return terms.some((term) => text.includes(term));
  });
}

app.get("/api/products", async (request, response) => {
  const q = String(request.query.q || "");

  if (!mongoReady) {
    return response.json(demoSearch(q));
  }

  const terms = q
    .toLowerCase()
    .split(/\W+/)
    .filter((term) => term.length > 2)
    .filter((term) => !["under", "over", "for", "with", "all"].includes(term));

  const products = await Product.find({}).sort({ createdAt: -1 }).limit(200);

  if (terms.length === 0) {
    return response.json(products.slice(0, 36));
  }

  const filteredProducts = products.filter((item) => {
    const text = [
      item.name,
      item.designer,
      item.category,
      ...(item.tags || [])
    ]
      .join(" ")
      .toLowerCase();

    return terms.every((term) => text.includes(term));
  });

  response.json(filteredProducts.slice(0, 36));
});

app.get("/api/suggestions", async (request, response) => {
  const q = String(request.query.q || "");
  if (!q.trim()) return response.json([]);

  const products = mongoReady
    ? await Product.find({ $text: { $search: q } }).limit(8)
    : demoSearch(q);

  const suggestions = [...new Set(products.flatMap((item) => [item.name, item.designer, item.category, ...item.tags]))];
  response.json(suggestions.slice(0, 8));
});

app.post("/api/chat", async (request, response) => {
  const message = String(request.body.message || "").trim();
  if (!message) return response.status(400).json({ error: "Message required" });

  const lowerMessage = message.toLowerCase();

  const greetings = ["hi", "hello", "hey", "yo", "sup"];

if (greetings.includes(lowerMessage)) {
  return response.json({
    reply: "Hi! How can Palm Archive help you today? You can ask by brand, item type, color, or budget.",
    products: []
  });
}
  const allProducts = mongoReady
    ? await Product.find({}).sort({ createdAt: -1 }).limit(200)
    : demoProducts;

  const productList = allProducts.map((item) =>
    item.toObject ? item.toObject() : item
  );

  // Get all brands from your products
  const designers = [...new Set(productList.map((item) => item.designer))];

  // Detect requested brand
  const requestedDesigner = designers.find((designer) => {
    const d = designer.toLowerCase();
    return lowerMessage.includes(d) || lowerMessage.includes(d.split(" ")[0]);
  });

  // Detect price range
  let minPrice = 0;
  let maxPrice = Infinity;

  const rangeMatch = lowerMessage.match(/(\d+)\s*[-to]+\s*(\d+)/);
  const betweenMatch = lowerMessage.match(/between\s+(\d+)\s+and\s+(\d+)/);
  const underMatch = lowerMessage.match(/(?:under|below|less than|max)\s*\$?(\d+)/);
  const overMatch = lowerMessage.match(/(?:over|above|more than|min)\s*\$?(\d+)/);
  const anyNumberMatch = lowerMessage.match(/\$?(\d{2,6})/);

  if (betweenMatch) {
    minPrice = Number(betweenMatch[1]);
    maxPrice = Number(betweenMatch[2]);
  } else if (rangeMatch) {
    minPrice = Number(rangeMatch[1]);
    maxPrice = Number(rangeMatch[2]);
  } else if (underMatch) {
    maxPrice = Number(underMatch[1]);
  } else if (overMatch) {
    minPrice = Number(overMatch[1]);
  } else if (anyNumberMatch) {
    // If user only types "louis vuitton 3000", treat 3000 as max budget
    maxPrice = Number(anyNumberMatch[1]);
  }

  // Clean search words
  const ignoredWords = [
    "show",
    "find",
    "need",
    "want",
    "product",
    "products",
    "piece",
    "pieces",
    "under",
    "below",
    "less",
    "than",
    "over",
    "above",
    "more",
    "max",
    "min",
    "between",
    "and",
    "for"
  ];

  const terms = lowerMessage
    .split(/\W+/)
    .filter((term) => term.length > 2)
    .filter((term) => !ignoredWords.includes(term))
    .filter((term) => !/^\d+$/.test(term));

  let matches = productList.filter((item) => {
    const itemText = [
      item.name,
      item.designer,
      item.category,
      ...(item.tags || [])
    ]
      .join(" ")
      .toLowerCase();

    const brandOk =
      !requestedDesigner ||
      item.designer.toLowerCase() === requestedDesigner.toLowerCase();

    const priceOk =
      Number(item.price) >= minPrice && Number(item.price) <= maxPrice;

    const termOk =
      terms.length === 0 ||
      terms.some((term) => itemText.includes(term));

    return brandOk && priceOk && termOk;
  });

  matches = matches.slice(0, 3);

  const context = matches
    .map((item) => `${item.name} by ${item.designer}, $${item.price}`)
    .join("\n");

  if (!openai) {
    if (!matches.length) {
      return response.json({
        reply: requestedDesigner
          ? `I don’t see any ${requestedDesigner} pieces in that price range right now. Try another budget or check other brands.`
          : "I don’t see that exact piece in Palm Archive right now. Try another brand, color, item type, or budget.",
        products: []
      });
    }

    const list = matches
      .map(
        (item, index) =>
          `${index + 1}. ${item.name} by ${item.designer} — $${Number(item.price).toLocaleString()}`
      )
      .join("\n");

    return response.json({
      reply: `I found ${matches.length} piece${matches.length === 1 ? "" : "s"} for you:\n${list}\n\nMessage us on Instagram to confirm availability.`,
      products: matches
    });
  }

  const result = await openai.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
    input: `
You are Palm Archive's shopping assistant.
Only recommend products from this list.
Be short and helpful.

Customer message:
${message}

Matching products:
${context || "No matches"}
`
  });

  response.json({ reply: result.output_text, products: matches });
});

app.listen(port, () => console.log(`Palm Archive running on http://127.0.0.1:${port}`));
