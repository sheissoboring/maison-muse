"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { products, categories } from "./data/products";

type Product = (typeof products)[number];

type CartItem = {
  product: Product;
  size: string;
  quantity: number;
};

const sizes = ["XS", "S", "M", "L", "XL"];

const moods = [
  { name: "All moods", icon: "✧", category: "All" },
  { name: "Coquette", icon: "🎀", category: "Coquette & Soft Girl" },
  { name: "Korean", icon: "🩰", category: "Korean Minimal" },
  { name: "Y2K", icon: "🪩", category: "Y2K & Indie Sleaze" },
  { name: "Street", icon: "⚡", category: "Streetwear" },
  { name: "Old money", icon: "🥂", category: "Old Money" },
  { name: "Vintage", icon: "🌷", category: "Boho & Vintage" },
];

const formatPrice = (price: number) =>
  `₹${price.toLocaleString("en-IN")}`;

export default function Home() {
  const [category, setCategory] = useState("All");
  const [activeView, setActiveView] = useState<"collections" | "products">("collections");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [showWishlist, setShowWishlist] = useState(false);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [quickView, setQuickView] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState("M");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
const [customerName, setCustomerName] = useState("");
const [customerPhone, setCustomerPhone] = useState("");
const [customerEmail, setCustomerEmail] = useState("");
const [customerAddress, setCustomerAddress] = useState("");
const [customerCity, setCustomerCity] = useState("");
const [customerState, setCustomerState] = useState("West Bengal");
const [customerPincode, setCustomerPincode] = useState("");
const [paymentMethod, setPaymentMethod] = useState<"UPI" | "COD">("UPI");
  const [toast, setToast] = useState("");
  const [toastAction, setToastAction] = useState<"bag" | "wishlist" | null>(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  

  const notify = (
  message: string,
  action: "bag" | "wishlist" | null = null
) => {
  setToast(message);
  setToastAction(action);

  window.setTimeout(() => {
    setToast("");
    setToastAction(null);
  }, 3000);
};

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (category !== "All") {
      result = result.filter((p) => p.category === category);
    }

    if (showWishlist) {
      result = result.filter((p) => wishlist.includes(p.id));
    }

    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter((p) =>
        `${p.name} ${p.category} ${p.color} ${p.fabric}`
          .toLowerCase()
          .includes(term)
      );
    }

    if (sort === "low") result.sort((a, b) => a.price - b.price);
    if (sort === "high") result.sort((a, b) => b.price - a.price);
    if (sort === "az") result.sort((a, b) => a.name.localeCompare(b.name));

    return result;
  }, [category, search, sort, showWishlist, wishlist]);

  const nextFeatured = () => {
  setFeaturedIndex((current) =>
    (current + 1) % filteredProducts.length
  );
};

const prevFeatured = () => {
  setFeaturedIndex((current) =>
    (current - 1 + filteredProducts.length) % filteredProducts.length
  );
};
const safeFeaturedIndex = filteredProducts.length
  ? featuredIndex % filteredProducts.length
  : 0;

const featuredProduct = filteredProducts[safeFeaturedIndex];
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const delivery = subtotal === 0 || subtotal >= 700 ? 0 : 49;
  const total = subtotal + delivery;

  const toggleWishlist = (id: number) => {
    setWishlist((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
    notify(
  wishlist.includes(id)
    ? "Removed from your wishlist"
    : "Added to your wishlist ♡",
  wishlist.includes(id) ? null : "wishlist"
);
  };

  const addToBag = (product: Product, size: string) => {
    setCart((current) => {
      const existing = current.find(
        (item) => item.product.id === product.id && item.size === size
      );

      if (existing) {
        return current.map((item) =>
          item.product.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...current, { product, size, quantity: 1 }];
    });

    setQuickView(null);
    notify("Added to your bag ✨", "bag");
  };

  const changeQuantity = (id: number, size: string, amount: number) => {
    setCart((current) =>
      current
        .map((item) =>
          item.product.id === id && item.size === size
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const chooseCategory = (value: string) => {
    setCategory(value);
    setShowWishlist(false);
    setMobileMenu(false);
  };

  const scrollToShop = () => {
    document.getElementById("catalogue")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <main className="mm-page">
      <AnimatePresence>
  {showIntro && (
    <motion.div
      className="mm-opening-screen"
      initial={{ opacity: 1 }}
      animate={{ opacity: [1, 1, 0] }}
      transition={{ duration: 2.8, times: [0, 0.72, 1] }}
      onAnimationComplete={() => setShowIntro(false)}
    >
      <motion.span
        className="mm-intro-line"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8 }}
      />

      <motion.h1
        initial={{ opacity: 0, y: 25, letterSpacing: "12px" }}
        animate={{ opacity: 1, y: 0, letterSpacing: "5px" }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        MAISON MUSE
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        THE ART OF GETTING DRESSED
      </motion.p>

      <motion.span
        className="mm-intro-line"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      />
    </motion.div>
  )}
</AnimatePresence>
      {/* Announcement */}
      <motion.div
  className="mm-announcement"
  initial={{ backgroundPosition: "200% center" }}
  animate={{ backgroundPosition: ["200% center", "-200% center"] }}
  transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
>
  A LITTLE SOMETHING FOR YOUR WARDROBE ✳ FREE DELIVERY ON ORDERS ABOVE ₹699
</motion.div>

      {/* Navigation */}
      <header className="mm-header">
        <motion.button
  className="mm-mobile-menu"
  onClick={() => setMobileMenu(true)}
  aria-label="Open menu"
  whileTap={{ scale: 0.85 }}
>
  ☰
</motion.button>

        <nav className={`mm-nav-left ${mobileMenu ? "mm-nav-open" : ""}`}>
          <a href="#catalogue" onClick={() => chooseCategory("All")}>SHOP ALL</a>
          <a href="#catalogue" onClick={() => chooseCategory("Coquette & Soft Girl")}>COQUETTE</a>
          <a href="#catalogue" onClick={() => chooseCategory("Old Money")}>OLD MONEY</a>
          <a href="#story">OUR STORY</a>
        </nav>

        <a className="mm-logo" href="#">
          MAISON MUSE
          <span>THE ART OF GETTING DRESSED</span>
        </a>

        <div className="mm-header-actions">
          <button
            aria-label="Search"
            onClick={scrollToShop}
            className="mm-icon-button"
          >
            ⌕
          </button>
          <motion.button
  aria-label="Wishlist"
  className="mm-icon-button"
  onClick={() => {
    setShowWishlist(!showWishlist);
    setCategory("All");
    scrollToShop();
  }}
  whileTap={{ scale: 0.85 }}
  animate={{ scale: [1, 1.08, 1] }}
  key={`wishlist-${wishlist.length}`}
  transition={{ duration: 0.35 }}
>
  ♡ <small>{wishlist.length || ""}</small>
</motion.button>
          <motion.button
  aria-label="Shopping bag"
  className="mm-icon-button mm-bag-button"
  onClick={() => setIsBagOpen(true)}
  animate={{ scale: [1, 1.08, 1] }}
  key={`bag-${cartCount}`}
  transition={{ duration: 0.35 }}
>
  BAG ({cartCount})
</motion.button>
        </div>
      </header>
      <AnimatePresence>
  {mobileMenu && (
    <motion.div
      className="mm-menu-overlay"
      initial={{ clipPath: "inset(0 0 0 100%)" }}
      animate={{ clipPath: "inset(0 0 0 0%)" }}
      exit={{ clipPath: "inset(0 0 0 100%)" }}
      transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="mm-menu-top">
        <span>MAISON MUSE</span>
        <button onClick={() => setMobileMenu(false)}>
          ✕
        </button>
      </div>

      <nav className="mm-menu-links">
        {[
          ["01", "SHOP ALL", "#catalogue"],
          ["02", "COQUETTE", "#catalogue"],
          ["03", "OLD MONEY", "#catalogue"],
          ["04", "OUR STORY", "#story"],
        ].map(([number, label, link], index) => (
          <motion.a
            key={number}
            href={link}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 + index * 0.12 }}
            onClick={() => {
              if (label === "SHOP ALL") chooseCategory("All");
              if (label === "COQUETTE") chooseCategory("Coquette & Soft Girl");
              if (label === "OLD MONEY") chooseCategory("Old Money");
              setMobileMenu(false);
            }}
          >
            <small>{number}</small>
            {label}
            <span>↗</span>
          </motion.a>
        ))}
      </nav>

      <p className="mm-menu-footer">
        THE ART OF GETTING DRESSED · EST. MAISON MUSE
      </p>
    </motion.div>
  )}
</AnimatePresence>

      {/* Hero — MAISON MUSE editorial campaign */}
      <section className="mm-hero">
        <motion.div
  className="mm-hero-image"
  initial={{ backgroundSize: "115% auto" }}
  animate={{ backgroundSize: "100% auto" }}
  transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
>
          <div className="mm-hero-overlay" />

         <motion.div
  className="mm-hero-content"
  initial={{ opacity: 0, y: 70, scale: 0.96 }}
  animate={showIntro ? { opacity: 0, y: 70, scale: 0.96 } : { opacity: 1, y: 0, scale: 1 }}
  transition={{
    duration: 1.4,
    ease: [0.22, 1, 0.36, 1],
    delay: 0.5,
  }}
>
            <span className="mm-eyebrow">
              MAISON MUSE PRESENTS · THE MUSE EDIT No.01
            </span>

            <motion.h1
  initial="hidden"
  animate={showIntro ? "hidden" : "visible"}
  variants={{
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.35,
        delayChildren: 0.9,
      },
    },
  }}
>
  <motion.span
    variants={{
      hidden: { opacity: 0, y: 45, filter: "blur(10px)" },
      visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 1.1 },
      },
    }}
  >
    Dress like
  </motion.span>

  <br />

  <motion.span
    variants={{
      hidden: { opacity: 0, y: 45, filter: "blur(10px)" },
      visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 1.1 },
      },
    }}
  >
    <i>you mean it.</i>
  </motion.span>
</motion.h1>
            <p>
              An expression of everything you are.
              <br />
              And everything you're becoming.
            </p>

            <button className="mm-dark-button" onClick={scrollToShop}>
              SHOP THE EDIT <span>↗️</span>
            </button>
          </motion.div>

          <div className="mm-hero-side-note">
            AN INDIVIDUAL KIND OF BEAUTIFUL
          </div>

          <div className="mm-hero-bottom">
            WEAR WHAT FEELS LIKE YOU. — MMXXVI
          </div>
        </motion.div>
      </section>

      {/* Intro */}
      <section className="mm-intro">
        <span className="mm-eyebrow">NOT JUST CLOTHES. A WHOLE PERSONALITY.</span>
        <h2>
          Your style. Your rules.
          <br />
          <i>Your little world.</i>
        </h2>
        <p>
          Curated pieces for every version of you — the soft girl,
          the city girl, the vintage soul and the main character.
        </p>
        <div className="mm-star">✳</div>
      </section>

{/* INFINITE FASHION MARQUEE */}
<div className="mm-marquee">
  <motion.div
    className="mm-marquee-track"
    animate={{ x: ["0%", "-50%"] }}
    transition={{
      duration: 22,
      ease: "linear",
      repeat: Infinity,
    }}
  >
    {[1, 2].map((item) => (
      <span key={item}>
        DRESS LIKE YOU MEAN IT <i>✳</i>
        FIND YOUR MUSE <i>✳</i>
        BE YOUR OWN ICON <i>✳</i>
        YOUR STYLE, YOUR RULES <i>✳</i>
      </span>
    ))}
  </motion.div>
</div>
      {/* Mood selector */}
      <section className="mm-moods">
        <div className="mm-section-heading">
          <div>
            <span className="mm-eyebrow">FIND YOUR AESTHETIC</span>
            <h2>What’s your <i>mood?</i></h2>
          </div>
          <button
  className="mm-handwritten"
  onClick={scrollToShop}
>
  pick your personality ↘️
</button>
        </div>

        <div className="mm-mood-list">
          {moods.map((mood) => (
            <button
              key={mood.name}
              className={`mm-mood ${category === mood.category && !showWishlist ? "mm-mood-active" : ""}`}
              onClick={() => chooseCategory(mood.category)}
            >
              <span>{mood.icon}</span>
              {mood.name}
            </button>
          ))}
        </div>
      </section>

      {/* Catalogue */}
      <section className="mm-catalogue" id="catalogue">
        <AnimatePresence mode="wait">
        {activeView === "collections" ? (
          <motion.div
          key="collections"
  className="mm-collection-screen"
  initial={{ opacity: 0, y: 25 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.45 }}
>
            <div className="mm-section-heading">
              <div>
                <span className="mm-eyebrow">MAISON MUSE · DISCOVER</span>
                <h2>Find your <i>muse.</i></h2>
                <p className="mm-muted">
                  A little world for every version of you.
                </p>
              </div>
            </div>

            <motion.div className="mm-collection-grid">
              {categories.filter((item) => item !== "All").map((item, index) => {
                const cover = products.find(
                  (product) => product.category === item
                )?.image;

                return (
                  <motion.button
                    key={item}
                    className="mm-collection-card"
                    onClick={() => {
                      setCategory(item);
                      setShowWishlist(false);
                      setSearch("");
                      setActiveView("products");
                    }}
                    initial={{ opacity: 0, y: 35 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -8 }}
                  >
                    {cover && <img src={cover} alt={item} />}
                    <span className="mm-collection-overlay" />
                    <span className="mm-collection-number">
                      0{index + 1} / 06
                    </span>
                    <span className="mm-collection-title">{item}</span>
                    <span className="mm-collection-explore">
                      EXPLORE THE EDIT ↗️
                    </span>
                  </motion.button>
                );
              })}
            </motion.div>
         </motion.div>
        ) : (
  <motion.div
    key="products"
    initial={{ opacity: 0, y: 25 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.45 }}
  >
      
      <button
  className="mm-text-button"
  onClick={() => {
    setActiveView("collections");
    setShowWishlist(false);
    setCategory("All");
    setSearch("");
  }}
>
  ← BACK TO COLLECTIONS
</button>
        <div className="mm-section-heading mm-catalogue-heading">
          <div>
            <span className="mm-eyebrow">THE MAISON MUSE EDIT</span>
            <h2>
             {showWishlist
  ? "Your little "
  : category === "All"
    ? "The complete "
    : "The "}
<i>
  {showWishlist
    ? "love list."
    : category === "All"
      ? "edit."
      : category + "."}
</i>
            </h2>
            <p className="mm-muted">
              {filteredProducts.length} pieces waiting to meet you.
            </p>
          </div>
          <button
            className="mm-back-collections"
            onClick={() => {
  setShowWishlist(false);
  setCategory("All");
  setSearch("");
  setActiveView("products");
}}
          >
            VIEW ALL PIECES ↗️
          </button>
        </div>

        <div className="mm-toolbar">
          <div className="mm-search">
          <span className="mm-search-icon"></span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your next favourite..."
            />
            {search && (
              <button onClick={() => setSearch("")}>×</button>
            )}
          </div>

          <select
            className="mm-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Sort products"
          >
            <option value="featured">Sort: Featured</option>
            <option value="low">Price: Low to high</option>
            <option value="high">Price: High to low</option>
            <option value="az">Name: A to Z</option>
          </select>
        </div>

        <div className="mm-category-pills">
          {categories.map((item) => (
            <button
              key={item}
              className={category === item && !showWishlist ? "mm-pill-active" : ""}
              onClick={() => chooseCategory(item)}
            >
              {item === "All" ? "EVERYTHING" : item.toUpperCase()}
            </button>
          ))}
          <button
            className={showWishlist ? "mm-pill-active" : ""}
            onClick={() => {
              setShowWishlist(true);
              setCategory("All");
            }}
          >
            ♡ WISHLIST ({wishlist.length})
          </button>
        </div>

        
{isSliderOpen && featuredProduct ? (
  <motion.section className="mm-cinematic-slider">
    <div className="mm-slider-layout">
      <div className="mm-slider-visual">
        <AnimatePresence mode="wait">
          <motion.div
            key={featuredProduct.id}
            className="mm-slider-image-wrap"
            initial={{ opacity: 0, scale: 1.04, x: 35 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.97, x: -25 }}
            transition={{ duration: 0.65, ease: "easeInOut" }}
            onClick={() => {
              setQuickView(featuredProduct);
              setSelectedSize("M");
            }}
          >
            <motion.img
              className="mm-slider-image"
              src={featuredProduct.image}
              alt={featuredProduct.name}
              initial={{ scale: 1.12 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.2 }}
            />

            <span className="mm-slider-tag">
              {featuredProduct.tag}
            </span>

            <motion.button
              className={`mm-heart ${
                wishlist.includes(featuredProduct.id)
                  ? "mm-heart-active"
                  : ""
              }`}
              aria-label="Add to wishlist"
              onClick={(e) => {
                e.stopPropagation();
                toggleWishlist(featuredProduct.id);
              }}
              whileTap={{ scale: 0.7, rotate: -15 }}
            >
              {wishlist.includes(featuredProduct.id) ? "♥" : "♡"}
            </motion.button>

            <span className="mm-slider-image-caption">
              THE MAISON MUSE EDIT
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

     <div className="mm-slider-copy">
  <button
    className="mm-slider-back"
    onClick={() => setIsSliderOpen(false)}
  >
    ← BACK TO ALL DRESSES
  </button>

  <span className="mm-eyebrow">
    THE PIECE THAT SPEAKS
  </span>

        <motion.span
          key={featuredProduct.id + "-number"}
          className="mm-slider-number"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          0{safeFeaturedIndex + 1} /{" "}
          {String(filteredProducts.length).padStart(2, "0")}
        </motion.span>

        <AnimatePresence mode="wait">
          <motion.div
            key={featuredProduct.id + "-details"}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.45 }}
          >
            <span className="mm-slider-category">
              {featuredProduct.category}
            </span>

            <h2 className="mm-slider-title">
              {featuredProduct.name}<i>.</i>
            </h2>

            <p className="mm-slider-description">
              A little statement. A little personality.
              Entirely your own.
            </p>

            <div className="mm-slider-details">
              <span>{featuredProduct.color}</span>
              <span>{featuredProduct.fabric}</span>
            </div>

            <div className="mm-slider-price">
              {formatPrice(featuredProduct.price)}
            </div>

            <button
              className="mm-dark-button mm-slider-discover"
              onClick={() => {
                setQuickView(featuredProduct);
                setSelectedSize("M");
              }}
            >
              DISCOVER THIS PIECE ↗
            </button>
          </motion.div>
        </AnimatePresence>

        <div className="mm-slider-navigation">
          <button
            onClick={prevFeatured}
            disabled={filteredProducts.length <= 1}
            aria-label="Previous product"
          >
            ←
          </button>

          <span>SWIPE THROUGH THE EDIT</span>

          <button
            onClick={nextFeatured}
            disabled={filteredProducts.length <= 1}
            aria-label="Next product"
          >
            →
          </button>
        </div>
      </div>
    </div>
  </motion.section>
) : filteredProducts.length > 0 ? (
  <motion.div layout className="mm-product-grid">
    <AnimatePresence mode="popLayout">
      {filteredProducts.map((product, index) => (
        <motion.article
          layout
          key={product.id}
          className="mm-product-card"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94 }}
          transition={{
            duration: 0.35,
            delay: Math.min(index % 8, 5) * 0.035
          }}
        >
          <div
            className="mm-product-image"
            onClick={() => {
              setFeaturedIndex(index);
              setIsSliderOpen(true);
            }}
          >
            <img
              className="mm-product-main-image"
              src={product.image}
              alt={product.name}
              loading="lazy"
            />

            <span className="mm-discover-label">
              DISCOVER ME ↗
            </span>

            <span className="mm-product-tag">
              {product.tag}
            </span>

            <motion.button
              className={`mm-heart ${
                wishlist.includes(product.id)
                  ? "mm-heart-active"
                  : ""
              }`}
              aria-label="Add to wishlist"
              onClick={(e) => {
                e.stopPropagation();
                toggleWishlist(product.id);
              }}
              whileTap={{ scale: 0.7, rotate: -15 }}
              animate={{
                scale: wishlist.includes(product.id)
                  ? [1, 1.35, 1]
                  : 1
              }}
              transition={{ duration: 0.3 }}
            >
              {wishlist.includes(product.id) ? "♥" : "♡"}
            </motion.button>
          </div>

          <div className="mm-product-info">
            <div className="mm-product-category">
              {product.category}
            </div>

            <div className="mm-product-name-row">
              <h3>{product.name}</h3>
              <strong>{formatPrice(product.price)}</strong>
            </div>

            <p>{product.color} · {product.fabric}</p>
          </div>
        </motion.article>
      ))}
    </AnimatePresence>
  </motion.div>
) : (
  <motion.div
    className="mm-empty"
    initial={{ opacity: 0, y: 25 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    <motion.span
      animate={{ scale: [1, 1.15, 1] }}
      transition={{ duration: 1.8, repeat: Infinity }}
    >
      ♡
    </motion.span>

    <h3>
      {showWishlist
        ? "Your love story starts here."
        : "Nothing here just yet."}
    </h3>

    <p>
      {showWishlist
        ? "Save the pieces that make your heart skip a beat."
        : "Try another search or explore the whole collection."}
    </p>

    <button
      className="mm-dark-button"
      onClick={() => {
        setSearch("");
        setShowWishlist(false);
        setCategory("All");
      }}
    >
      EXPLORE EVERYTHING
    </button>
  </motion.div>
)}

      </motion.div>
        )}
        </AnimatePresence>
      </section>

     {/* Founder story */}
      <section className="mm-editorial" id="story">
        <div className="mm-editorial-image">
          <div className="mm-editorial-copy">
            <span className="mm-eyebrow">THE STORY BEHIND THE MUSE</span>

            <h2>
              Not just a store.
              <br />
              <i>A feeling.</i>
            </h2>

            <p>
              Every beautiful brand begins with a little dream.
              MAISON MUSE was born from my love for fashion,
              Pinterest inspirations and the magic of personal style.
            </p>

            <p>
              I'm Karishma Roy, the girl behind the MUSE.
              I imagined a space where every aesthetic has a place —
              from soft-girl romance and Korean minimalism to
              old-money elegance and playful Y2K fashion.
            </p>

            <p>
              I believe fashion isn't about dressing like everyone else.
              It's about discovering what feels like YOU.
            </p>

            <p className="mm-founder-signature">
              With love, 
              <br />
              <img
  src="/images/karishma-signature.png..jpeg"
  alt="Karishma Roy autograph"
  className="mm-founder-autograph"
/>
              <br />
              <span>FOUNDER, MAISON MUSE</span>
            </p>

            <button
              className="mm-light-button"
              onClick={() =>
                document.getElementById("catalogue")?.scrollIntoView({
                  behavior: "smooth"
                })
              }
            >
              EXPLORE THE COLLECTION ↗️
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mm-footer">
        <div className="mm-footer-top">
          <div>
            <a href="#" className="mm-footer-logo">MAISON MUSE</a>
            <p>For the love of getting dressed.</p>
          </div>
          <div className="mm-footer-links">
            <a href="#catalogue">SHOP</a>
            <a href="#story">OUR STORY</a>
            <a href="mailto:kizzelle.studio@gmail.com">CONTACT</a>
          </div>
          <div className="mm-footer-social">
            <span>FOLLOW THE MUSE</span>
           <a href="https://www.instagram.com/kizzelle.studio/" target="_blank" rel="noreferrer">INSTAGRAM ↗</a>
          </div>
        </div>
        <div className="mm-footer-bottom">
          <span>©️ 2026 MAISON MUSE. ALL RIGHTS RESERVED.</span>
          <span>MADE WITH ♡ FOR THE STYLE OBSESSED.</span>
        </div>
      </footer>

      {/* Quick view modal */}
      <AnimatePresence>
        {quickView && (
          <motion.div
            className="mm-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setQuickView(null)}
          >
            <motion.div
              className="mm-quick-modal"
              initial={{ opacity: 0, y: 35, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="mm-close"
                onClick={() => setQuickView(null)}
              >
                ×
              </button>
<motion.div
  className="mm-modal-image"
  initial={{ opacity: 0, scale: 0.94 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.65, ease: "easeOut" }}
>
  <motion.img
    src={quickView.image}
    alt={quickView.name}
    initial={{ scale: 1.12 }}
    animate={{ scale: 1 }}
    transition={{ duration: 1, ease: "easeOut" }}
  />
</motion.div>
              <div className="mm-modal-details">
                <span className="mm-eyebrow">{quickView.tag}</span>
                <h2>{quickView.name}</h2>
                <strong className="mm-modal-price">{formatPrice(quickView.price)}</strong>
                <p>{quickView.description}</p>
                <div className="mm-detail-line">COLOUR <b>{quickView.color}</b></div>
                <div className="mm-detail-line">FABRIC <b>{quickView.fabric}</b></div>
                <div className="mm-size-heading">SELECT YOUR SIZE</div>
                <div className="mm-size-list">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      className={selectedSize === size ? "mm-size-active" : ""}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <motion.button
  className="mm-dark-button mm-add-button"
  onClick={() => addToBag(quickView, selectedSize)}
  whileHover={{ scale: 1.03 }}
  whileTap={{ scale: 0.94 }}
  transition={{ type: "spring", stiffness: 400, damping: 15 }}
>
                  ADD TO BAG — {formatPrice(quickView.price)}
               </motion.button>
                <button
                  className="mm-modal-wishlist"
                  onClick={() => toggleWishlist(quickView.id)}
                >
                  ♡ SAVE TO YOUR WISHLIST
                </button>
                <p className="mm-modal-note">A little reminder: great style is always personal.</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Shopping bag drawer */}
      <AnimatePresence>
        {isBagOpen && (
          <motion.div
            className="mm-drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsBagOpen(false)}
          >
            <motion.aside
              className="mm-drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
  type: "spring",
  stiffness: 260,
  damping: 28,
  mass: 0.8,
}}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mm-drawer-header">
                <div>
                  <span className="mm-eyebrow">YOUR LITTLE COLLECTION</span>
                  <h2>Your bag ({cartCount})</h2>
                </div>
                <button className="mm-close" onClick={() => setIsBagOpen(false)}>×</button>
              </div>

              <div className="mm-cart-items">
                {cart.length === 0 ? (
                  <div className="mm-empty-bag">
                    <span>♡</span>
                    <h3>Your bag is feeling lonely.</h3>
                    <p>Let's find something lovely for you.</p>
                    <button
                      className="mm-dark-button"
                      onClick={() => {
                        setIsBagOpen(false);
                        scrollToShop();
                      }}
                    >
                      EXPLORE THE COLLECTION
                    </button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <motion.div
  className="mm-cart-item"
  key={`${item.product.id}-${item.size}`}
  initial={{ opacity: 0, x: 30 }}
  animate={{ opacity: 1, x: 0 }}
  exit={{ opacity: 0, x: -20 }}
  transition={{ duration: 0.35 }}
>
                      <img src={item.product.image} alt={item.product.name} />
                      <div className="mm-cart-info">
                        <h3>{item.product.name}</h3>
                        <p>{item.product.color} · Size {item.size}</p>
                        <strong>{formatPrice(item.product.price)}</strong>
                        <div className="mm-quantity">
                          <button onClick={() => changeQuantity(item.product.id, item.size, -1)}>−</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => changeQuantity(item.product.id, item.size, 1)}>+</button>
                        </div>
                      </div>
                      <motion.button
  className="mm-remove"
  onClick={() => changeQuantity(item.product.id, item.size, -item.quantity)}
  whileHover={{ scale: 1.2, rotate: 90 }}
  whileTap={{ scale: 0.75 }}
  transition={{ duration: 0.2 }}
>
  ×
</motion.button>  
                   </motion.div>
                    ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="mm-cart-summary">
                  <p>
                    {subtotal >= 700
                      ? "You've unlocked free delivery! ✨"
                      : `Add ${formatPrice(700 - subtotal)} more for free delivery.`}
                  </p>

                  <div>
                    <span>Subtotal</span>
                    <b>{formatPrice(subtotal)}</b>
                  </div>

                  <div>
                    <span>Delivery</span>
                    <b>{delivery === 0 ? "FREE" : formatPrice(delivery)}</b>
                  </div>

                  <div className="mm-total">
                    <span>Total</span>
                    <b>{formatPrice(total)}</b>
                  </div>

                  <button
  className="mm-dark-button mm-checkout"
  onClick={() => {
  setIsBagOpen(false);
  setShowCheckout(true);
}}
>
  PROCEED TO CHECKOUT ↗️
</button>

                  <small>Secure checkout experience coming soon.</small>
                </div>
              )}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

{/* CHECKOUT SCREEN */}
<AnimatePresence>
  {showCheckout && (
    <motion.div
      className="mm-checkout-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="mm-checkout-panel"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
      >
        <button
          className="mm-close"
          onClick={() => setShowCheckout(false)}
        >
          ×
        </button>

        {orderPlaced ? (
          <div className="mm-order-success">
            <span>♡</span>
            <h2>Thank you, beautiful.</h2>
            <p>Your demo order has been placed successfully.</p>
            <button
              className="mm-dark-button"
              onClick={() => {
                setShowCheckout(false);
                setOrderPlaced(false);
              }}
            >
              CONTINUE SHOPPING
            </button>
          </div>
        ) : (
          <>
            <span className="mm-eyebrow">MAISON MUSE · CHECKOUT</span>
            <h2>Almost yours.</h2>
            <p className="mm-checkout-intro">
              A few details before your new favourites find their way to you.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setOrderPlaced(true);
                setCart([]);
              }}
            >
              <h3>YOUR DETAILS</h3>

              <input
                placeholder="Full name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />

              <input
                type="tel"
                placeholder="Phone number"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                pattern="[6-9][0-9]{9}"
                title="Enter a valid 10-digit Indian mobile number"
                required
              />

              <input
                type="email"
                placeholder="Email address"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                required
              />

              <h3>DELIVERY ADDRESS</h3>

              <textarea
                placeholder="House number, street, area"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                required
              />

              <input
                placeholder="City"
                value={customerCity}
                onChange={(e) => setCustomerCity(e.target.value)}
                required
              />

              <input
                placeholder="State"
                value={customerState}
                onChange={(e) => setCustomerState(e.target.value)}
                required
              />

              <input
                type="text"
                placeholder="PIN code"
                value={customerPincode}
                onChange={(e) => setCustomerPincode(e.target.value)}
                pattern="[0-9]{6}"
                title="Enter a valid 6-digit PIN code"
                required
              />

              <h3>PAYMENT METHOD</h3>

              <label>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "UPI"}
                  onChange={() => setPaymentMethod("UPI")}
                />
                UPI
              </label>

              <label>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                />
                Cash on Delivery
              </label>

              <div className="mm-checkout-total">
                <span>ORDER TOTAL</span>
                <strong>{formatPrice(total)}</strong>
              </div>

              <button
                type="submit"
                className="mm-dark-button mm-place-order"
              >
                PLACE DEMO ORDER ↗
              </button>

              <small>
                Demo checkout only. No real payment will be collected.
              </small>
            </form>
          </>
        )}
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
      {/* Toast notification */}
<AnimatePresence>
  {toast && (
    <motion.div
      className="mm-toast"
      initial={{ opacity: 0, y: 45 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true, amount: 0.15 }}
      exit={{ opacity: 0, y: 15 }}
    >
      <span>{toast}</span>

      {toastAction && (
        <button
          className="mm-toast-action"
          onClick={() => {
            if (toastAction === "bag") {
              setIsBagOpen(true);
            }

            if (toastAction === "wishlist") {
              setShowWishlist(true);
              setCategory("All");
              scrollToShop();
            }

            setToast("");
            setToastAction(null);
          }}
        >
          {toastAction === "bag" ? "VIEW BAG ↗" : "VIEW WISHLIST ↗"}
        </button>
      )}
    </motion.div>
  )}
</AnimatePresence>

      {/* Website styling */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:wght@300;400;500;600;700&family=Allura&display=swap');
  --mm-cream: #211316;
  --mm-paper: #100d0e;
  --mm-ink: #f4eae7;
  --mm-brown: #a71932;
  --mm-muted: #aa9697;
  --mm-line: #39272b;
  --mm-cherry: #b51f3b;
  --mm-deep: #321016;
}

        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
       body {
  margin: 0;
  background: var(--mm-paper);
  color: var(--mm-ink);
  font-family: 'DM Sans', sans-serif;
}
        button, input, select { font: inherit; }
        button { cursor: pointer; }
        a { color: inherit; text-decoration: none; }
        .mm-page { overflow: hidden; }

        .mm-announcement {
  padding: 13px 10px;
  text-align: center;
  background: #8e142d;
  color: #fff4f1;
  font-family: var(--font-body), sans-serif;
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 2.8px;
  text-transform: uppercase;
  border-bottom: 1px solid rgba(255,255,255,.12);
  background-image: linear-gradient(
  110deg,
  #8e142d 35%,
  #c44a60 50%,
  #8e142d 65%
);
background-size: 200% 100%;
}

/* MAISON MUSE — LUXURY BRAND HEADER */

.mm-header {
  height: 94px;
  padding: 0 5.5%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #100d0e;
  position: relative;
  z-index: 20;
  border-bottom: 1px solid rgba(181,31,59,.32);
}

.mm-logo {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-family: var(--font-heading), serif;
  font-size: 34px;
  font-weight: 500;
  letter-spacing: 6px;
  text-align: center;
  white-space: nowrap;
  color: #f4eae7;
  transition: color .3s ease;
}

.mm-logo:hover {
  color: #d94b65;
}

.mm-logo span {
  display: block;
  margin-top: 5px;
  font-family: var(--font-body), sans-serif;
  font-size: 8px;
  font-weight: 500;
  letter-spacing: 4px;
  color: #bd7785;
}
        .mm-icon-button {
          border: 0;
          background: transparent;
          color: var(--mm-ink);
          font-size: 20px;
          padding: 5px;
        }

        .mm-icon-button small { font-size: 9px; }
        .mm-bag-button { font-size: 9px; letter-spacing: 1px; }
        .mm-mobile-menu { display: none; border: 0; background: none; font-size: 20px; }

        .mm-hero { padding: 0 3%; }

       .mm-hero-image {
  min-height: 650px;
  height: min(75vw, 780px);
  position: relative;
  display: flex;
  align-items: center;
  overflow: hidden;
  background:
    linear-gradient(
      90deg,
      rgba(12, 5, 8, 0.82) 0%,
      rgba(12, 5, 8, 0.42) 48%,
      rgba(12, 5, 8, 0.05) 100%
    ),
    url('/images/hero.jpg') center 35% / cover no-repeat;
  color: #fff8f5;
}

       .mm-hero-content {
  position: relative;
  z-index: 2;
  margin-left: 5%;
  margin-top: 100px;
  max-width: 48%;
}
        .mm-eyebrow {
          display: block;
          font-size: 9px;
          letter-spacing: 2.2px;
          color: var(--mm-muted);
        }

        .mm-hero .mm-eyebrow { color: #eee1d2; }

        .mm-hero h1 {
          margin: 25px 0 16px;
          font: 400 clamp(55px, 8vw, 105px)/.91 'Cormorant Garamond', serif;
          letter-spacing: -3px;
        }

        .mm-hero h1 i, .mm-intro h2 i, .mm-section-heading h2 i,
        .mm-editorial h2 i { font-weight: 400; }

        .mm-hero-content p {
          font-size: 12px;
          line-height: 2;
          color: #eee7df;
          margin-bottom: 30px;
        }

        /* MAISON MUSE — SIGNATURE BUTTONS */

.mm-dark-button,
.mm-light-button {
  border: 1px solid #a51c37;
  background: #a51c37;
  color: #fff8f5;
  padding: 17px 25px;
  font-family: var(--font-body), sans-serif;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  transition: all .35s ease;
}

.mm-dark-button:hover,
.mm-light-button:hover {
  background: transparent;
  color: #d94b65;
  border-color: #d94b65;
  transform: translateY(-3px);
}

.mm-hero .mm-dark-button {
  background: #f4eae7;
  color: #211316;
  border-color: #f4eae7;
}

.mm-hero .mm-dark-button:hover {
  background: #a51c37;
  border-color: #a51c37;
  color: white;
}

.mm-light-button {
  background: #f4eae7;
  color: #211316;
  border-color: #f4eae7;
}

.mm-light-button:hover {
  background: transparent;
  color: white;
  border-color: white;
}

        .mm-hero-side-note {
          position: absolute;
          right: 25px;
          top: 50%;
          writing-mode: vertical-rl;
          font-size: 8px;
          letter-spacing: 3px;
        }

        .mm-hero-bottom {
          position: absolute;
          bottom: 25px;
          left: 5%;
          font-size: 8px;
          letter-spacing: 2px;
        }

        .mm-intro {
          position: relative;
          text-align: center;
          padding: 10px 20px 100px;
          background: var(--mm-cream);
        }

        .mm-intro h2 {
  font-family: 'Playfair Display', serif;
  font-size: clamp(44px, 5.5vw, 68px);
  font-weight: 400;
  letter-spacing: -2px;
  line-height: 1.08;
  color: #e8dedb;
  margin: 18px 0;
}

.mm-intro h2 i {
  color: #b51f3b;
  font-weight: 400;
}

        .mm-intro p {
          max-width: 420px;
          margin: 0 auto;
          font-size: 11px;
          line-height: 2;
          color: var(--mm-muted);
        }

        .mm-star {
          position: absolute;
          right: 16%;
          bottom: 45px;
          font-size: 40px;
          color: #a58f78;
          animation: mm-spin 18s linear infinite;
        }

        @keyframes mm-spin {
          to { transform: rotate(360deg); }
        }

        .mm-moods, .mm-catalogue { padding: 85px 7%; }

        .mm-section-heading {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 35px;
        }

        .mm-section-heading h2 {
  font-family: 'Playfair Display', serif;
  font-size: clamp(42px, 5vw, 62px);
  font-weight: 400;
  letter-spacing: -2px;
  line-height: 1.05;
  color: #e8dedb;
  margin-bottom: 0;
}

.mm-section-heading h2 i {
  font-style: normal;
  color: #b51f3b;
  font-weight: 500;
  letter-spacing: -2.5px;
} {
  color: #b51f3b;
  font-weight: 400;
}

.mm-handwritten {
  font-family: 'Playfair Display', serif;
  font-style: italic;
  font-size: 17px;
  color: #c68a96;
  letter-spacing: 0
  cursor: pointer;
border: none;
background: transparent;;
}

        .mm-handwritten {
          font: italic 19px 'Cormorant Garamond', serif;
          color: var(--mm-brown);
        }

        .mm-mood-list {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .mm-mood {
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid var(--mm-line);
  background: transparent;
  border-radius: 50px;
  padding: 13px 20px;
  font-size: 10px;
  color: #f4eae7;
  transition: .25s;
}

        .mm-mood span { font-size: 17px; }

        .mm-mood:hover, .mm-mood-active {
  background: var(--mm-cherry);
  color: #ffffff;
  border-color: var(--mm-cherry);
  transform: translateY(-3px);
}
        .mm-catalogue {
          background: #fffdfa;
          padding-top: 85px;
        }

        .mm-muted { font-size: 10px; color: var(--mm-muted); margin-top: 12px; }

        .mm-text-button {
          border: 0;
          border-bottom: 1px solid var(--mm-ink);
          background: none;
          padding: 8px 0;
          font-size: 9px;
          letter-spacing: 1.2px;
        }

        .mm-toolbar {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          border-top: 1px solid var(--mm-line);
          border-bottom: 1px solid var(--mm-line);
          padding: 16px 0;
        }

        .mm-search .mm-search-icon {
  width: 26px;
  height: 26px;
  border: 3px solid currentColor;
  border-radius: 50%;
  position: relative;
  display: inline-block;
  flex-shrink: 0;
  margin: 0 10px 6px 5px;
}

.mm-search .mm-search-icon::after {
  content: "";
  position: absolute;
  width: 12px;
  height: 3px;
  background: currentColor;
  right: -9px;
  bottom: -5px;
  transform: rotate(45deg);
  border-radius: 3px;
}

        .mm-search input {
          width: 100%;
          max-width: 350px;
          border: 0;
          outline: 0;
          background: transparent;
          font-size: 11px;
        }

        .mm-search button { border: 0; background: none; font-size: 20px; }

        .mm-sort {
          border: 0;
          outline: 0;
          background: transparent;
          font-size: 10px;
          color: var(--mm-ink);
        }

        .mm-category-pills {
          display: flex;
          gap: 9px;
          flex-wrap: wrap;
          padding: 20px 0 30px;
        }

        .mm-category-pills button {
          border: 1px solid var(--mm-line);
          background: transparent;
          padding: 9px 12px;
          font-size: 8px;
          letter-spacing: .7px;
          transition: .2s;
        }

        .mm-category-pills button:hover, .mm-category-pills .mm-pill-active {
          background: var(--mm-ink);
          color: white;
          border-color: var(--mm-ink);
        }

        .mm-product-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 42px 18px;
        }

        /* MAISON MUSE — EDITORIAL PRODUCT CARDS */

.mm-product-card {
  min-width: 0;
  cursor: pointer;
}

.mm-product-image {
  position: relative;
  aspect-ratio: 3 / 4.5;
  overflow: hidden;
  background: #211316;
}

.mm-product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  display: block;
  transition: transform 1s cubic-bezier(.2,.7,.2,1);
}

.mm-product-card:hover .mm-product-image img {
  transform: scale(1.045);
}
.mm-product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform .9s cubic-bezier(.2,.7,.2,1);
}

.mm-product-card:hover .mm-product-image img {
  transform: scale(1.07);
}

.mm-product-tag {
  position: absolute;
  top: 14px;
  left: 14px;
  padding: 8px 11px;
  background: #8e142d;
  color: #fff8f5;
  font-size: 8px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
}

.mm-heart {
  position: absolute;
  top: 13px;
  right: 13px;
  width: 37px;
  height: 37px;
  border: 1px solid rgba(255,255,255,.35);
  border-radius: 50%;
  background: rgba(16,13,14,.65);
  color: #fff8f5;
  font-size: 19px;
  display: grid;
  place-items: center;
  backdrop-filter: blur(8px);
  transition: .3s ease;
}

.mm-heart:hover {
  background: #8e142d;
  transform: scale(1.08);
}

.mm-heart-active {
  color: #ff5272;
}

.mm-quick-add {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 16px;
  border: 0;
  background: #8e142d;
  color: #fff8f5;
  font-size: 9px;
  letter-spacing: 2px;
  text-transform: uppercase;
  transform: translateY(100%);
  transition: transform .35s ease;
}

.mm-product-card:hover .mm-quick-add {
  transform: translateY(0);
}

.mm-product-info {
  padding-top: 20px;
}

.mm-product-category {
  color: #c15a70;
  font-family: 'DM Sans', sans-serif;
  font-size: 9px;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  margin-bottom: 11px;
}

.mm-product-name-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
}

.mm-product-name-row h3 {
  margin: 0;
  font-family: 'Playfair Display', serif;
  font-size: 23px;
  font-weight: 400;
  line-height: 1.2;
  color: #eadfdd;
}

.mm-product-name-row strong {
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #d7a0aa;
  white-space: nowrap;
}

.mm-product-info p {
  font-family: 'DM Sans', sans-serif;
  font-size: 10px;
  line-height: 1.8;
  color: #aa9697;
  margin-top: 10px;
} {
  font-size: 10px;
  line-height: 1.7;
  color: var(--mm-muted);
  margin-top: 9px;
}

@media (hover: none) {
  .mm-quick-add {
    transform: translateY(0);
    padding: 13px;
  }
}

        .mm-empty { text-align: center; padding: 85px 15px; }

        .mm-empty > span, .mm-empty-bag > span {
          font-size: 45px;
          color: #a38d78;
        }

        .mm-empty h3, .mm-empty-bag h3 {
          font: 30px 'Cormorant Garamond', serif;
        }

        .mm-empty p, .mm-empty-bag p {
          font-size: 11px;
          color: var(--mm-muted);
          margin-bottom: 25px;
        }

        .mm-editorial { padding: 0 3% 85px; }

        .mm-editorial-image {
          min-height: 510px;
          display: flex;
          align-items: center;
          background:
  linear-gradient(90deg, rgba(10,5,8,.78), rgba(10,5,8,.12)),
  url('/images/editorial.jpg') center 40% / cover;
          color: white;
        }

        .mm-editorial-copy { margin-left: 10%; max-width: 420px; }
        .mm-editorial-copy .mm-eyebrow { color: #eee1d2; }

        .mm-editorial h2 {
          font: 400 clamp(48px, 6vw, 76px)/.95 'Cormorant Garamond', serif;
          margin: 23px 0;
        }

        .mm-editorial p { font-size: 11px; line-height: 2; color: #eee7df; }

        .mm-light-button {
          margin-top: 15px;
          background: #f7f1e9;
          color: var(--mm-ink);
          border-color: #f7f1e9;
        }

        .mm-light-button:hover { background: transparent; color: white; }

        .mm-footer {
          background: #29231f;
          color: #f5eee5;
          padding: 65px 7% 25px;
        }

        .mm-footer-top {
          display: flex;
          justify-content: space-between;
          gap: 30px;
          padding-bottom: 60px;
        }

        .mm-footer-logo {
          font: 31px 'Cormorant Garamond', serif;
          letter-spacing: 3px;
        }

        .mm-footer-top p { color: #b6a99b; font-size: 10px; }

        .mm-footer-links, .mm-footer-social {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .mm-footer-social span {
          font-size: 8px;
          letter-spacing: 1.5px;
          color: #b6a99b;
        }

        .mm-footer-bottom {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          border-top: 1px solid #51483f;
          padding-top: 20px;
          font-size: 8px;
          letter-spacing: 1px;
          color: #b6a99b;
        }

        .mm-modal-backdrop, .mm-drawer-backdrop {
          position: fixed;
          inset: 0;
          z-index: 100;
          background: rgba(22,18,15,.58);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

.mm-quick-modal {
  position: relative;
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  width: min(920px, 100%);
  max-height: 90vh;
  overflow: auto;
  background: #16090d;
  border: 1px solid rgba(181, 31, 59, .35);
  box-shadow: 0 25px 90px rgba(0, 0, 0, .65);
}
        .mm-close {
          position: absolute;
          z-index: 3;
          top: 12px;
          right: 15px;
          border: 0;
          background: transparent;
          font-size: 29px;
          color: var(--mm-ink);
        }

        .mm-modal-image { min-height: 500px; background: var(--mm-cream); }

        .mm-modal-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .mm-modal-details {
  padding: 65px 42px 38px;
  color: #e8dedb;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.mm-modal-details h2 {
  font-family: 'Playfair Display', serif;
  font-size: clamp(30px, 3vw, 42px);
  font-weight: 400;
  line-height: 1.15;
  letter-spacing: -1px;
  color: #f0e5e2;
  margin: 17px 0;
}

.mm-modal-price {
  font-family: 'DM Sans', sans-serif;
  font-size: 15px;
  font-weight: 500;
  color: #d58b9b;
  letter-spacing: 1px;
}

.mm-modal-details > p {
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  line-height: 2;
  color: #b8a3a5;
  margin: 24px 0;
}

.mm-detail-line {
  display: flex;
  justify-content: space-between;
  border-top: 1px solid rgba(232, 222, 219, .13);
  padding: 14px 0;
  font-family: 'DM Sans', sans-serif;
  font-size: 9px;
  letter-spacing: 1.8px;
  color: #b98b94;
}

.mm-detail-line b {
  font-weight: 500;
  color: #eee0df;
  letter-spacing: .5px;
}

.mm-size-heading {
  margin: 25px 0 14px;
  font-family: 'DM Sans', sans-serif;
  font-size: 9px;
  letter-spacing: 2px;
  color: #d6a0aa;
}

.mm-size-list {
  display: flex;
  gap: 9px;
}

.mm-size-list button {
  width: 42px;
  height: 42px;
  border: 1px solid rgba(232, 222, 219, .25);
  background: transparent;
  color: #e8dedb;
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  transition: .3s ease;
}

.mm-size-list button:hover,
.mm-size-list .mm-size-active {
  background: #a51c37;
  color: #fff;
  border-color: #a51c37;
}

.mm-add-button {
  width: 100%;
  margin-top: 28px;
  letter-spacing: 2px;
}

.mm-modal-wishlist {
  display: block;
  width: 100%;
  padding: 17px;
  border: 0;
  background: transparent;
  color: #d5b8bd;
  font-family: 'DM Sans', sans-serif;
  font-size: 9px;
  letter-spacing: 2px;
}

.mm-modal-note {
  text-align: center;
  font: italic 15px 'Playfair Display', serif !important;
  color: #bd8793 !important;
}
        .mm-drawer-backdrop { justify-content: flex-end; padding: 0; }

        .mm-drawer {
          width: min(470px, 100%);
          height: 100%;
          display: flex;
          flex-direction: column;
          background: var(--mm-paper);
          padding: 30px;
        }

        .mm-drawer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--mm-line);
        }

        .mm-drawer-header h2 {
          font: 35px 'Cormorant Garamond', serif;
          margin: 8px 0 0;
        }

        .mm-cart-items { flex: 1; overflow-y: auto; }
        .mm-empty-bag { text-align: center; padding: 90px 10px; }

        .mm-cart-item {
          position: relative;
          display: flex;
          gap: 15px;
          padding: 20px 0;
          border-bottom: 1px solid var(--mm-line);
        }

        .mm-cart-item img { width: 95px; height: 120px; object-fit: cover; }
        .mm-cart-info { flex: 1; }

        .mm-cart-info h3 {
          font: 19px 'Cormorant Garamond', serif;
          margin: 3px 0 7px;
        }

        .mm-cart-info p { font-size: 9px; color: var(--mm-muted); }
        .mm-cart-info strong { font-size: 11px; }

        .mm-quantity {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-top: 13px;
        }

        .mm-quantity button {
          border: 1px solid var(--mm-line);
          background: transparent;
          width: 25px;
          height: 25px;
        }

        .mm-quantity span { font-size: 10px; }
        .mm-remove { border: 0; background: transparent; align-self: flex-start; font-size: 20px; }

        .mm-cart-summary {
          border-top: 1px solid var(--mm-line);
          padding-top: 18px;
        }

        .mm-cart-summary > p {
          font-size: 10px;
          color: var(--mm-brown);
          text-align: center;
          margin-bottom: 20px;
        }

        .mm-cart-summary > div {
          display: flex;
          justify-content: space-between;
          margin: 13px 0;
          font-size: 11px;
        }

        .mm-cart-summary .mm-total {
          border-top: 1px
          solid var(--mm-line);
  padding-top: 15px;
  margin-top: 15px;
  font-size: 13px;
}

.mm-checkout { width: 100%; margin-top: 15px; }

.mm-cart-summary small {
  display: block;
  text-align: center;
  font-size: 9px;
  color: var(--mm-muted);
  margin-top: 12px;
}

.mm-toast {
  position: fixed;
  z-index: 200;
  bottom: 25px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--mm-ink);
  color: white;
  padding: 15px 24px;
  font-size: 10px;
  letter-spacing: 1px;
  box-shadow: 0 8px 30px rgba(0,0,0,.15);
}

/* Tablet */
@media (max-width: 900px) {
  .mm-product-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .mm-nav-left { gap: 12px; }
  .mm-nav-left a { font-size: 8px; }
}

/* Mobile */
@media (max-width: 600px) {
  .mm-header {
  height: 76px;
  padding: 0 5%;
  background: #100d0e;
  border-bottom: 1px solid rgba(181,31,59,.32);
}

.mm-logo {
  font-size: 24px;
  letter-spacing: 3.5px;
}

.mm-logo span {
  font-size: 7px;
  letter-spacing: 3px;
  margin-top: 4px;
}
  .mm-header-actions { gap: 10px; }

  .mm-hero { padding: 0; }

  .mm-hero-image {
    min-height: 590px;
    height: 80vh;
    background-position: 58% center;
  }

  .mm-hero-content { margin-left: 7%; }

  .mm-hero h1 {
    font-size: clamp(55px, 15vw, 78px);
  }

  .mm-hero-side-note { right: 12px; }
  .mm-hero-bottom { left: 7%; }

  .mm-intro { padding: 75px 22px; }
  .mm-star { right: 8%; bottom: 20px; }

  .mm-moods, .mm-catalogue {
    padding: 65px 5%;
  }

  .mm-section-heading {
    align-items: flex-start;
    flex-direction: column;
    margin-bottom: 25px;
  }

  .mm-handwritten { font-size: 16px; }

  .mm-toolbar {
    flex-direction: column;
    gap: 15px;
  }

  .mm-search input { max-width: 100%; }

  .mm-category-pills {
    flex-wrap: nowrap;
    overflow-x: auto;
    padding-bottom: 20px;
  }

  .mm-category-pills button { white-space: nowrap; }

  .mm-product-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 30px 12px;
  }

  .mm-product-name-row h3 { font-size: 15px; }
  .mm-product-name-row strong { font-size: 9px; }

  .mm-quick-add {
    transform: translateY(0);
    padding: 11px 5px;
    font-size: 8px;
  }

  .mm-editorial { padding: 0 0 65px; }

  .mm-editorial-image {
    min-height: 450px;
    background-position: 58% center;
  }

  .mm-editorial-copy { margin-left: 7%; margin-right: 7%; }

  .mm-footer { padding: 50px 6% 22px; }

  .mm-footer-top {
    flex-wrap: wrap;
    padding-bottom: 40px;
  }

  .mm-footer-bottom {
    flex-direction: column;
    gap: 10px;
  }

  .mm-quick-modal {
    grid-template-columns: 1fr;
    max-height: 92vh;
  }

  .mm-modal-image { min-height: 280px; max-height: 350px; }
  .mm-modal-details { padding: 25px; }
  .mm-modal-details h2 { font-size: 30px; }

  .mm-drawer { padding: 22px; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    scroll-behavior: auto !important;
    animation-duration: .01ms !important;
    transition-duration: .01ms !important;
  }
}
  /* MAISON MUSE — ANIMATED COLLECTION EDIT */

.mm-collection-screen {
  padding: 55px 7% 100px;
  background: #100d0e;
}

.mm-collection-screen .mm-section-heading {
  margin-bottom: 38px;
}

.mm-collection-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;
}

.mm-collection-card {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  width: 100%;
  min-height: 390px;
  overflow: hidden;
  padding: 28px;
  border: 1px solid rgba(255,255,255,.12);
  background: #241116;
  color: #fff4f0;
  text-align: left;
  cursor: pointer;
}

.mm-collection-card img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform .8s ease;
}

.mm-collection-card:hover img {
  transform: scale(1.08);
}

.mm-collection-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(10,5,7,.95),
    rgba(10,5,7,.08) 75%
  );
}

.mm-collection-number,
.mm-collection-title,
.mm-collection-explore {
  position: relative;
  z-index: 2;
}

.mm-collection-number {
  margin-bottom: 12px;
  color: #e6a0ad;
  font-size: 10px;
  letter-spacing: 3px;
}

.mm-collection-title {
  font-family: var(--font-editorial), serif;
  font-size: clamp(25px, 3vw, 38px);
  line-height: 1.1;
}

.mm-collection-explore {
  margin-top: 17px;
  color: #f0c1c9;
  font-size: 10px;
  letter-spacing: 2px;
}

@media (max-width: 900px) {
  .mm-collection-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .mm-collection-card {
    min-height: 340px;
  }
}

@media (max-width: 600px) {
  .mm-collection-screen {
    padding: 40px 5% 70px;
  }

  .mm-collection-grid {
    gap: 12px;
  }

  .mm-collection-card {
    min-height: 260px;
    padding: 16px;
  }

  .mm-collection-title {
    font-size: 25px;
  }

  .mm-collection-number,
  .mm-collection-explore {
    font-size: 8px;
  }
}
  .mm-back-collections {
  display: inline-block;
  margin: 0 0 28px 7%;
  padding: 10px 0;
  border: none;
  border-bottom: 1px solid #a71932;
  background: transparent;
  color: #e6a0ad;
  font-size: 10px;
  letter-spacing: 2px;
  cursor: pointer;
  transition: color .3s ease;
}

.mm-back-collections:hover {
  color: #fff4f0;
}
  /* MAISON MUSE — DARK CHERRY REVAMP */

:root {
  --mm-paper: #10090c;
  --mm-cream: #1b1015;
  --mm-ink: #f8eeee;
  --mm-muted: #b49da4;
  --mm-line: #43232e;
  --mm-cherry: #b51f3b;
  --mm-brown: #d65b75;
}

.mm-catalogue {
  background: #10090c;
  color: #f8eeee;
  padding-top: 90px;
}

.mm-moods {
  background: #160c11;
  color: #f8eeee;
}

.mm-intro {
  background: #1b1015;
  color: #f8eeee;
}

.mm-footer {
  background: #090608;
  color: #f8eeee;
}

.mm-toolbar {
  border-color: #43232e;
}

.mm-search input {
  color: #f8eeee;
}

.mm-search input::placeholder {
  color: #a88d96;
}

.mm-sort {
  color: #f8eeee;
}

.mm-sort option {
  background: #160c11;
  color: #f8eeee;
}

.mm-category-pills button {
  color: #e8d9de;
  border-color: #43232e;
}

.mm-category-pills button:hover,
.mm-category-pills .mm-pill-active {
  background: #a71932;
  border-color: #a71932;
  color: white;
}

.mm-product-image {
  background: #241219;
}

.mm-product-name-row h3 {
  color: #f8eeee;
}

.mm-product-info p {
  color: #b49da4;
}

.mm-collection-screen {
  background: #10090c;
  color: #f8eeee;
}

.mm-back-collections {
  color: #e6a0ad;
}

.mm-modal-wishlist {
  color: #e6a0ad;
}

.mm-detail-line {
  color: #e8d9de;
}

.mm-size-list button {
  color: #f8eeee;
}
  /* EDITORIAL PRODUCT CARDS */

.mm-product-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 48px 20px;
}

.mm-product-card {
  position: relative;
  min-width: 0;
}

.mm-product-image {
  position: relative;
  aspect-ratio: 3 / 4.2;
  overflow: hidden;
  background: #241219;
  border: 1px solid rgba(255,255,255,.07);
}

.mm-product-image img {
  transition: transform 1s cubic-bezier(.2,.7,.2,1);
  filter: saturate(.88);
}

.mm-product-card:hover .mm-product-image img {
  transform: scale(1.06);
}

.mm-product-tag {
  top: 14px;
  left: 14px;
  background: #a71932;
  color: #fff;
  padding: 9px 12px;
  font-size: 8px;
  letter-spacing: 2px;
}

.mm-heart {
  width: 38px;
  height: 38px;
  border: 1px solid rgba(255,255,255,.4);
  background: rgba(16,9,12,.65);
  backdrop-filter: blur(8px);
}

.mm-heart-active {
  color: #ff5272;
}

.mm-quick-add {
  background: #a71932;
  color: white;
  letter-spacing: 2.5px;
  padding: 17px;
}

.mm-product-info {
  padding: 18px 2px 0;
}

.mm-product-category {
  color: #d16b82;
  font-size: 8px;
  letter-spacing: 2px;
}

.mm-product-name-row h3 {
  font-size: 22px;
  line-height: 1.15;
}

.mm-product-name-row strong {
  color: #f5dce2;
  font-size: 12px;
}

.mm-product-info p {
  font-size: 10px;
  letter-spacing: .5px;
  color: #aa929a;
}

/* TABLET */
@media (max-width: 900px) {
  .mm-product-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

/* MOBILE */
@media (max-width: 600px) {
  .mm-product-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 32px 12px;
  }

  .mm-product-name-row h3 {
    font-size: 16px;
  }

  .mm-product-name-row strong {
    font-size: 10px;
  }

  .mm-product-info {
    padding-top: 13px;
  }
}
  /* MAISON MUSE — PRODUCT QUICK VIEW */

.mm-modal-backdrop {
  background: rgba(5, 2, 4, .88);
  backdrop-filter: blur(10px);
  padding: 25px;
}

.mm-quick-modal {
  width: min(950px, 100%);
  background: #160c11;
  border: 1px solid #542333;
  box-shadow: 0 30px 100px rgba(0,0,0,.6);
}

.mm-modal-image {
  height: 560px;
  overflow: hidden;
  background: #16090d;
}

.mm-modal-image img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  object-position: center top;
  filter: saturate(.95);
}

.mm-close {
  position: absolute;
  top: 17px;
  right: 19px;
  z-index: 10;
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(232, 222, 219, .25);
  border-radius: 50%;
  background: rgba(15, 5, 9, .75);
  color: #f8eeee;
  font-size: 25px;
  cursor: pointer;
  transition: all .3s ease;
}

.mm-close:hover {
  background: #a51c37;
  border-color: #a51c37;
  transform: rotate(90deg);
}

/* MOBILE QUICK VIEW */
@media (max-width: 600px) {
  .mm-quick-modal {
    display: grid;
    grid-template-columns: 1fr;
    width: 94%;
    max-height: 90vh;
    overflow-y: auto;
    border: 1px solid #542333;
  }

  .mm-modal-image {
    height: 340px;
    min-height: 0;
    max-height: none;
  }

  .mm-modal-image img {
    object-fit: cover;
    object-position: center 25%;
  }

  .mm-modal-details {
    padding: 30px 24px;
  }

  .mm-modal-details h2 {
    font-size: 32px;
  }

  .mm-modal-note {
    margin-bottom: 5px;
  }
}
  /* MAISON MUSE — CHERRY SHOPPING BAG */

.mm-drawer-backdrop {
  background: rgba(5, 2, 4, .82);
  backdrop-filter: blur(8px);
}

.mm-drawer {
  background: #13090e;
  border-left: 1px solid #542333;
  color: #f8eeee;
  box-shadow: -20px 0 80px rgba(0,0,0,.4);
}

.mm-drawer-header {
  border-color: #43232e;
}

.mm-drawer-header h2 {
  font-size: 39px;
  color: #fff0f2;
}

.mm-cart-item {
  border-color: #43232e;
}

.mm-cart-item img {
  border: 1px solid #43232e;
}

.mm-cart-info h3 {
  color: #fff0f2;
  font-size: 21px;
}

.mm-cart-info p {
  color: #b49da4;
}

.mm-cart-info strong {
  color: #e6a0ad;
}

.mm-quantity button {
  color: #f8eeee;
  border-color: #54303c;
}

.mm-quantity button:hover {
  background: #a71932;
  border-color: #a71932;
}

.mm-remove {
  color: #d98b9b;
}

.mm-cart-summary {
  border-color: #542333;
}

.mm-cart-summary > p {
  color: #e6a0ad;
}

.mm-cart-summary > div {
  color: #d7c2c9;
}

.mm-cart-summary .mm-total {
  border-color: #542333;
  color: #fff0f2;
}

.mm-checkout {
  padding: 18px;
  letter-spacing: 2px;
}

.mm-cart-summary small {
  color: #a88d96;
}

.mm-empty-bag h3 {
  color: #fff0f2;
}

.mm-empty-bag p {
  color: #b49da4;
}

.mm-toast {
  background: #a71932;
  color: white;
  border: 1px solid #d16b82;
  box-shadow: 0 10px 40px rgba(0,0,0,.5);
}

@media (max-width: 600px) {
  .mm-drawer {
    padding: 22px 18px;
  }
}
  /* MAISON MUSE — SIGNATURE HEADER */

.mm-announcement {
  background: #8e142d;
  color: #fff0f2;
  padding: 12px 10px;
  font-size: 8px;
  letter-spacing: 3px;
}

.mm-header {
  height: 100px;
  padding: 0 6%;
  background: #0d080b;
  border-bottom: 1px solid rgba(181,31,59,.4);
}

.mm-logo {
  font-size: clamp(25px, 3vw, 37px);
  letter-spacing: 7px;
  color: #fff0f2;
}

.mm-logo span {
  color: #d16b82;
  font-size: 8px;
  letter-spacing: 4px;
}

.mm-nav-left {
  display: flex;
  align-items: center;
  gap: 25px;
}

.mm-nav-left a {
  color: #d8c2c9;
  font-size: 9px;
  letter-spacing: 1.7px;
  transition: color .3s ease;
}

.mm-nav-left a:hover {
  color: #e45b78;
}

.mm-header-actions {
  display: flex;
  align-items: center;
  gap: 17px;
}

.mm-icon-button {
  color: #f8eeee;
  transition: color .3s ease;
}

.mm-icon-button:hover {
  color: #e45b78;
}

.mm-bag-button {
  border: 1px solid #8e142d;
  padding: 12px 16px;
  letter-spacing: 2px;
}

.mm-bag-button:hover {
  background: #8e142d;
  color: white;
}

.mm-mobile-menu {
  color: #f8eeee;
}

@media (max-width: 900px) {
  .mm-header {
    height: 85px;
  }

  .mm-logo {
    letter-spacing: 4px;
  }

  .mm-nav-left {
    gap: 12px;
  }
}

@media (max-width: 600px) {
  .mm-header {
    height: 76px;
    padding: 0 4%;
  }

  .mm-logo {
    font-size: 22px;
    letter-spacing: 3px;
  }

  .mm-logo span {
    font-size: 6px;
    letter-spacing: 2px;
  }

  .mm-header-actions {
    gap: 8px;
  }

  .mm-bag-button {
    padding: 9px 8px;
    font-size: 8px;
  }
}
  /* MAISON MUSE — EDITORIAL COLLECTIONS */

.mm-collection-screen {
  padding: 85px 7% 110px;
  background: #10090c;
}

.mm-collection-screen .mm-section-heading {
  margin-bottom: 50px;
}

.mm-collection-screen .mm-section-heading h2 {
  font-size: clamp(48px, 6vw, 76px);
}

.mm-collection-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

.mm-collection-card {
  min-height: 440px;
  padding: 28px;
  background: #241219;
  border: 1px solid rgba(255,255,255,.12);
  transition: border-color .5s ease, box-shadow .5s ease;
}

.mm-collection-card:hover {
  border-color: #d14b68;
  box-shadow: 0 15px 45px rgba(135,15,43,.2);
}

.mm-collection-card img {
  filter: saturate(.82);
  transition: transform 1.2s cubic-bezier(.2,.7,.2,1),
              filter .6s ease;
}

.mm-collection-card:hover img {
  transform: scale(1.09);
  filter: saturate(1.1);
}

.mm-collection-overlay {
  background: linear-gradient(
    to top,
    rgba(8,3,6,.97) 0%,
    rgba(8,3,6,.35) 55%,
    rgba(8,3,6,.02) 100%
  );
}

.mm-collection-number {
  color: #f0a0b1;
  font-size: 9px;
  letter-spacing: 3px;
}

.mm-collection-title {
  color: #fff0f2;
  font-size: clamp(27px, 3vw, 40px);
}

.mm-collection-explore {
  color: #e6a0ad;
  font-size: 9px;
  letter-spacing: 2.5px;
  transition: letter-spacing .3s ease;
}

.mm-collection-card:hover .mm-collection-explore {
  letter-spacing: 4px;
}

@media (max-width: 900px) {
  .mm-collection-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .mm-collection-card {
    min-height: 370px;
  }
}

@media (max-width: 600px) {
  .mm-collection-screen {
    padding: 60px 5% 75px;
  }

  .mm-collection-grid {
    gap: 12px;
  }

  .mm-collection-card {
    min-height: 270px;
    padding: 16px;
  }

  .mm-collection-title {
    font-size: 24px;
  }
}
  /* MAISON MUSE — CINEMATIC HERO */

.mm-hero {
  padding: 0 2%;
  background: #0d080b;
}

.mm-hero-image {
  min-height: 720px;
  height: min(78vw, 850px);
  background:
    linear-gradient(
      90deg,
      rgba(8,3,6,.88) 0%,
      rgba(8,3,6,.55) 43%,
      rgba(8,3,6,.08) 100%
    ),
    url('/images/hero.jpg') center 35% / cover no-repeat;
  border: 1px solid rgba(255,255,255,.08);
}

.mm-hero-content {
  margin-left: 9%;
  max-width: 650px;
}

.mm-hero .mm-eyebrow {
  color: #e6a0ad;
  font-size: 9px;
  letter-spacing: 4px;
}

.mm-hero h1 {
  font-size: clamp(75px, 10vw, 135px);
  line-height: .82;
  letter-spacing: -5px;
  color: #fff5f3;
  margin: 35px 0 25px;
}

.mm-hero h1 i {
  color: #e65b78;
}

.mm-hero-content p {
  color: #e4cbd1;
  font-size: 12px;
  line-height: 2.2;
  letter-spacing: .5px;
}

.mm-hero .mm-dark-button {
  margin-top: 15px;
  padding: 19px 30px;
  background: #a71932;
  color: white;
  border-color: #a71932;
  letter-spacing: 2.5px;
}

.mm-hero .mm-dark-button:hover {
  background: transparent;
  border-color: #e65b78;
  color: #fff;
}

.mm-hero-side-note {
  color: #e6a0ad;
  font-size: 8px;
  letter-spacing: 4px;
}

.mm-hero-bottom {
  color: #f3dce1;
  font-size: 8px;
  letter-spacing: 3px;
}

@media (max-width: 600px) {
  .mm-hero {
    padding: 0;
  }

  .mm-hero-image {
    min-height: 650px;
    height: 83vh;
    background-position: 58% center;
  }

  .mm-hero-content {
    margin-left: 7%;
    margin-right: 5%;
  }

  .mm-hero h1 {
    font-size: clamp(65px, 16vw, 90px);
    letter-spacing: -3px;
  }

  .mm-hero .mm-eyebrow {
    font-size: 8px;
    letter-spacing: 2px;
  }
}
  /* MAISON MUSE — BRAND STORY */

.mm-intro {
  padding: 110px 20px 120px;
  background: #1b1015;
  border-top: 1px solid #43232e;
  border-bottom: 1px solid #43232e;
}

.mm-intro .mm-eyebrow {
  color: #d16b82;
  letter-spacing: 3px;
}

.mm-intro h2 {
  font-size: clamp(48px, 6vw, 76px);
  line-height: .98;
  color: #fff0f2;
  margin: 25px 0;
}

.mm-intro h2 i {
  color: #e65b78;
}

.mm-intro p {
  color: #c3aab2;
  font-size: 12px;
  line-height: 2.2;
}

.mm-star {
  color: #d65b75;
}

/* FOUNDER EDITORIAL */

.mm-editorial {
  padding: 0 3% 100px;
  background: #10090c;
}

.mm-editorial-image {
  min-height: 680px;
  background:
    linear-gradient(
      90deg,
      rgba(8,3,6,.92),
      rgba(8,3,6,.65) 48%,
      rgba(8,3,6,.08)
    ),
    url('/images/editorial.jpg') center 40% / cover no-repeat;
  border: 1px solid #43232e;
}

.mm-editorial-copy {
  margin-left: 9%;
  max-width: 460px;
  padding: 65px 0;
}

.mm-editorial-copy .mm-eyebrow {
  color: #e6a0ad;
  letter-spacing: 3px;
}

.mm-editorial h2 {
  font-size: clamp(55px, 7vw, 85px);
  line-height: .9;
  color: #fff0f2;
}

.mm-editorial h2 i {
  color: #e65b78;
}

.mm-editorial p {
  color: #e1cbd1;
  line-height: 2.1;
  font-size: 11px;
}

.mm-founder-signature i {
  color: #f0a0b1;
  font-size: 25px;
}

.mm-founder-signature span {
  color: #d16b82;
  font-size: 8px;
  letter-spacing: 2px;
}

.mm-light-button {
  background: #a71932;
  border-color: #a71932;
  color: white;
  margin-top: 20px;
}

.mm-light-button:hover {
  background: transparent;
  color: white;
  border-color: #e65b78;
}

@media (max-width: 600px) {
  .mm-intro {
    padding: 80px 22px;
  }

  .mm-editorial {
    padding: 0 0 65px;
  }

  .mm-editorial-image {
    min-height: 650px;
    background-position: 58% center;
  }

  .mm-editorial-copy {
    margin: 0 7%;
    padding: 55px 0;
  }
}
  /* MAISON MUSE — FINAL FINISHING TOUCHES */

.mm-footer {
  background: #090608;
  border-top: 1px solid #542333;
  padding: 75px 7% 25px;
}

.mm-footer-logo {
  font-size: 36px;
  letter-spacing: 4px;
  color: #fff0f2;
}

.mm-footer-top p {
  color: #b49da4;
}

.mm-footer-links a,
.mm-footer-social a {
  color: #e8d9de;
  font-size: 9px;
  letter-spacing: 2px;
  transition: color .3s ease;
}

.mm-footer-links a:hover,
.mm-footer-social a:hover {
  color: #e65b78;
}

.mm-footer-social span {
  color: #d16b82;
  letter-spacing: 2px;
}

.mm-footer-bottom {
  border-color: #43232e;
  color: #a88d96;
}

/* GENERAL BUTTON POLISH */

.mm-dark-button,
.mm-light-button {
  letter-spacing: 2px;
  transition: all .35s ease;
}

.mm-text-button {
  color: #e6a0ad;
  border-color: #a71932;
}

.mm-text-button:hover {
  color: white;
}

/* COLLECTION BACK BUTTON */

.mm-back-collections {
  color: #e6a0ad;
  border-color: #a71932;
}

.mm-back-collections:hover {
  color: white;
}

/* EMPTY STATES */

.mm-empty h3,
.mm-empty-bag h3 {
  color: #fff0f2;
}

.mm-empty p,
.mm-empty-bag p {
  color: #b49da4;
}

/* SELECTION */

.mm-page ::selection {
  background: #a71932;
  color: white;
}

/* MOBILE NAVIGATION */

@media (max-width: 600px) {
  .mm-mobile-menu {
    display: block;
    font-size: 22px;
    color: #fff0f2;
    z-index: 25;
  }

  .mm-nav-left {
    display: none;
    position: absolute;
    top: 76px;
    left: 0;
    right: 0;
    padding: 25px;
    background: #13090e;
    border-bottom: 1px solid #542333;
    flex-direction: column;
    align-items: flex-start;
    gap: 22px;
  }

  .mm-nav-left.mm-nav-open {
    display: flex;
  }

  .mm-nav-left a {
    font-size: 10px;
    letter-spacing: 2px;
  }

  .mm-footer-top {
    gap: 35px;
  }

  .mm-footer-bottom {
    font-size: 7px;
  }
}

/* ACCESSIBILITY */

@media (prefers-reduced-motion: reduce) {
  .mm-product-image img,
  .mm-collection-card img,
  .mm-dark-button,
  .mm-light-button {
    transition: none;
  }
}
  /* MAISON MUSE — PLAYFAIR TYPOGRAPHY */

.mm-hero h1,
.mm-intro h2,
.mm-section-heading h2,
.mm-editorial h2,
.mm-logo,
.mm-footer-logo,
.mm-product-name-row h3,
.mm-modal-details h2 {
  font-family: 'Playfair Display', serif;
  font-weight: 400;
}

.mm-hero h1 {
  letter-spacing: -3px;
  line-height: .95;
}

.mm-logo {
  letter-spacing: 5px;
}

.mm-section-heading h2 {
  letter-spacing: -1.5px;
}
  /* SOFT IVORY + HERO TYPOGRAPHY */

.mm-hero h1 {
  color: #e8dedb;
  line-height: 0.72;
}

.mm-hero h1 i {
  display: inline-block;
  position: relative;
  z-index: 2;
  font-size: 0.78em;
  color: #b51f3b;
  transform: translateY(-8px);
}
  .mm-founder-signature i {
  font-family: 'Allura', cursive;
  font-size: 38px;
  font-weight: 400;
  font-style: normal;
  color: #c43b55;
  letter-spacing: 0;
}
  .mm-founder-autograph {
  display: block;
  width: 190px;
  height: auto;
  margin: 5px 0 8px -8px;
  object-fit: contain;
}
  .mm-editorial h2 i {
  display: inline-block;
  font-size: 0.78em;
  color: #b51f3b;
}
  .mm-product-card {
  transition: transform .4s ease;
}

.mm-product-card:hover {
  transform: translateY(-5px);
}

.mm-product-tag {
  backdrop-filter: blur(10px);
  background: rgba(142, 20, 45, .9);
  letter-spacing: 2px;
}

.mm-quick-add {
  background: rgba(142, 20, 45, .96);
  backdrop-filter: blur(12px);
  letter-spacing: 2.5px;
}
  /* TABLET QUICK VIEW */
@media (min-width: 601px) and (max-width: 900px) {
  .mm-quick-modal {
    grid-template-columns: 1fr 1fr;
    width: 94%;
  }

  .mm-modal-image {
    height: 480px;
  }

  .mm-modal-details {
    padding: 35px 25px;
  }

  .mm-modal-details h2 {
    font-size: 34px;
  }
}
  .mm-toast {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  flex-wrap: wrap;
}

.mm-toast-action {
  border: 0;
  border-bottom: 1px solid currentColor;
  background: transparent;
  color: inherit;
  padding: 4px 0;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.5px;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.mm-toast-action:hover {
  opacity: 0.65;
}
  .mm-checkout-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.78);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  overflow-y: auto;
}

.mm-checkout-panel {
  position: relative;
  width: 100%;
  max-width: 620px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 42px;
  background: #211316;
  color: #f4eae7;
  border: 1px solid #573039;
}

.mm-checkout-panel h2 {
  font-family: 'Playfair Display', serif;
  font-size: 38px;
  font-weight: 400;
  margin: 12px 0;
}

.mm-checkout-intro {
  color: #aa9697;
  line-height: 1.7;
  margin-bottom: 30px;
}

.mm-checkout-panel form {
  display: flex;
  flex-direction: column;
  gap: 13px;
}

.mm-checkout-panel form h3 {
  font-size: 10px;
  letter-spacing: 2px;
  margin: 22px 0 5px;
  color: #d7a4ad;
}

.mm-checkout-panel form input:not([type="radio"]),
.mm-checkout-panel form textarea {
  width: 100%;
  padding: 15px;
  background: #100d0e;
  color: #f4eae7;
  border: 1px solid #493137;
  outline: none;
}

.mm-checkout-panel form textarea {
  min-height: 90px;
  resize: vertical;
}

.mm-checkout-panel form input:focus,
.mm-checkout-panel form textarea:focus {
  border-color: #b51f3b;
}

.mm-checkout-panel form label {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #e8dadd;
  font-size: 13px;
}

.mm-checkout-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #493137;
  padding-top: 22px;
  margin-top: 20px;
  letter-spacing: 1px;
}

.mm-checkout-total strong {
  font-size: 22px;
}

.mm-place-order {
  width: 100%;
  margin-top: 12px;
}

.mm-checkout-panel form small {
  text-align: center;
  color: #aa9697;
  font-size: 10px;
}

.mm-order-success {
  text-align: center;
  padding: 55px 15px;
}

.mm-order-success > span {
  font-size: 55px;
  color: #d7a4ad;
}

.mm-order-success p {
  color: #aa9697;
  line-height: 1.7;
  margin: 20px 0 30px;
}

@media (max-width: 600px) {
  .mm-checkout-backdrop {
    padding: 10px;
  }

  .mm-checkout-panel {
    padding: 28px 20px;
  }

  .mm-checkout-panel h2 {
    font-size: 30px;
  }
}
 
/* CINEMATIC MAISON MUSE INTRO */
.mm-opening-screen {
  position: fixed;
  inset: 0;
  z-index: 99999;
  background: #351019;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #f5eee8;
  overflow: hidden;
}

.mm-opening-screen h1 {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(36px, 8vw, 76px);
  font-weight: 400;
  margin: 28px 0 12px;
  white-space: nowrap;
}

.mm-opening-screen p {
  font-family: 'DM Sans', sans-serif;
  font-size: 9px;
  letter-spacing: 4px;
  color: #d9b9b9;
  text-align: center;
}

.mm-intro-line {
  display: block;
  width: 100px;
  height: 1px;
  background: #d9a6ad;
  transform-origin: center;
}
  /* INFINITE FASHION MARQUEE */
.mm-marquee {
  width: 100%;
  overflow: hidden;
  background: #351019;
  color: #f5eee8;
  padding: 20px 0;
  border-top: 1px solid #71404a;
  border-bottom: 1px solid #71404a;
}

.mm-marquee-track {
  display: flex;
  width: max-content;
  white-space: nowrap;
}

.mm-marquee-track span {
  display: flex;
  align-items: center;
  gap: 28px;
  padding-right: 28px;
  font-family: 'Cormorant Garamond', serif;
  font-size: 21px;
  letter-spacing: 3px;
  font-weight: 500;
}

.mm-marquee-track i {
  color: #d9a6ad;
  font-style: normal;
  font-size: 19px;
}

@media (max-width: 600px) {
  .mm-marquee {
    padding: 15px 0;
  }

  .mm-marquee-track span {
    font-size: 16px;
    gap: 18px;
    padding-right: 18px;
  }
}
  /* EDITORIAL PRODUCT IMAGE ANIMATION */

.mm-product-image {
  position: relative;
  overflow: hidden;
}

.mm-product-main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s cubic-bezier(0.2, 0.7, 0.2, 1),
              filter 0.8s ease;
}

.mm-product-image:hover .mm-product-main-image {
  transform: scale(1.08);
  filter: brightness(0.82);
}

.mm-discover-label {
  position: absolute;
  bottom: 20px;
  left: 20px;
  color: white;
  font-size: 10px;
  letter-spacing: 2px;
  opacity: 0;
  transform: translateY(12px);
  transition: all 0.4s ease;
  pointer-events: none;
}

.mm-product-image:hover .mm-discover-label {
  opacity: 1;
  transform: translateY(0);
}

@media (hover: none) {
  .mm-discover-label {
    opacity: 1;
    transform: none;
  }
}

/* ==================================
   MAISON MUSE — CINEMATIC SLIDER
================================== */

.mm-cinematic-slider {
  padding: 35px 0 90px;
  overflow: hidden;
}

.mm-slider-layout {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  align-items: center;
  gap: 7%;
}

.mm-slider-visual {
  position: relative;
  overflow: hidden;
  background: #e9dfd7;
}

.mm-slider-image-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  cursor: pointer;
}

.mm-slider-image {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  object-position: center top;
}

.mm-slider-tag {
  position: absolute;
  top: 22px;
  left: 22px;
  background: #fffaf5;
  color: #35151d;
  padding: 10px 15px;
  font-size: 9px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
}

.mm-slider-image-caption {
  position: absolute;
  bottom: 22px;
  left: 22px;
  color: white;
  font-size: 9px;
  letter-spacing: 3px;
  text-shadow: 0 1px 8px #000;
}

.mm-slider-copy {
  position: relative;
  padding: 35px 5% 35px 0;
}

.mm-slider-number {
  display: block;
  margin: 35px 0 55px;
  font-size: 10px;
  letter-spacing: 3px;
  color: #987d77;
}

.mm-slider-category {
  display: block;
  margin-bottom: 18px;
  font-size: 10px;
  letter-spacing: 3px;
  color: #C5A9A2;
  text-transform: uppercase;
}

.mm-slider-title {
  max-width: 520px;
  font-family: var(--mm-serif, Georgia), Georgia, serif;
  font-size: clamp(45px, 6vw, 86px);
  line-height: 0.98;
  font-weight: 400;
  letter-spacing: -2px;
  color: #F3E7DC;
  overflow-wrap: anywhere;
}

.mm-slider-title i {
  color: #A51D3D;
  font-weight: 400;
}

.mm-slider-description {
  max-width: 320px;
  margin-top: 25px;
  color: #C3B2AC;
  font-size: 12px;
  line-height: 2;
}

.mm-slider-details {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 30px;
}

.mm-slider-details span {
  border: 1px solid #ded1c9;
  padding: 10px 13px;
  font-size: 9px;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.mm-slider-price {
  margin-top: 30px;
  font-family: Georgia, serif;
  font-size: 25px;
  color: #E8C9B9;
}

.mm-slider-discover {
  margin-top: 28px;
  min-height: 48px;
}

.mm-slider-navigation {
  display: flex;
  align-items: center;
  gap: 22px;
  margin-top: 65px;
}

.mm-slider-navigation button {
  width: 43px;
  height: 43px;
  border: 1px solid #d8c8c0;
  border-radius: 50%;
  background: transparent;
  color: #35151d;
  font-size: 19px;
  cursor: pointer;
  transition: .3s ease;
}

.mm-slider-navigation button:hover:not(:disabled) {
  background: #35151d;
  color: white;
}

.mm-slider-navigation button:disabled {
  opacity: .3;
  cursor: not-allowed;
}

.mm-slider-navigation span {
  font-size: 8px;
  letter-spacing: 2px;
  color: #987d77;
}

/* TABLET */
@media (max-width: 900px) {
  .mm-slider-layout {
    grid-template-columns: 1fr 0.9fr;
    gap: 5%;
  }

  .mm-slider-title {
    font-size: clamp(40px, 6vw, 65px);
  }

  .mm-slider-number {
    margin: 25px 0 35px;
  }
}

/* MOBILE */
@media (max-width: 600px) {
  .mm-cinematic-slider {
    padding: 15px 0 55px;
  }

  .mm-slider-layout {
    grid-template-columns: 1fr;
    gap: 28px;
  }

  .mm-slider-image-wrap {
    aspect-ratio: 4 / 5;
  }

  .mm-slider-copy {
    padding: 15px 5px;
  }

  .mm-slider-number {
    margin: 20px 0 28px;
  }

  .mm-slider-title {
    font-size: clamp(43px, 12vw, 65px);
  }

  .mm-slider-description {
    margin-top: 18px;
  }

  .mm-slider-navigation {
    margin-top: 35px;
  }
}

/* BACK TO CATALOGUE */
.mm-slider-back {
  display: inline-block;
  border: 0;
  background: transparent;
  padding: 0;
  margin-bottom: 25px;
  color: #8e6f68;
  font-size: 9px;
  letter-spacing: 1.8px;
  cursor: pointer;
  transition: color .3s ease, transform .3s ease;
}
.mm-slider-back:hover {
  color: #8e142d;
  transform: translateX(-5px);
}
      `}</style>
    </main>
  );
}