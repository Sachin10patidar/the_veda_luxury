/**
 * The Veda Luxury - Products & Store Configuration
 * Thoughtful Gifts, Beautiful Memories
 */

const STORAGE_KEYS = {
  PRODUCTS: 'veda_luxury_products',
  CONFIG: 'veda_luxury_config',
  CART: 'veda_luxury_cart'
};

// Default store configuration
const DEFAULT_CONFIG = {
  storeName: "The Veda Luxury",
  tagline: "Thoughtful Gifts, Beautiful Memories",
  contactPerson: "Viraj Patidar",
  whatsappNumber: "+919876543210", // Users can update this anytime in Admin panel
  instagramHandle: "thevedaluxury",
  instagramUrl: "https://instagram.com/thevedaluxury",
  youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Embeddable video URL
  youtubeVideoId: "ScMzIvxBSi4",
  address: "Handcrafted Studio, Indore, Madhya Pradesh, India",
  shippingNotice: "Free local delivery available • Pan India secure shipping",
  adminPin: "veda123"
};

// Default Products Seed Data matching the user flyers & requests
const DEFAULT_PRODUCTS = [
  // --- Rakhi Festival Collection ---
  {
    id: "rakhi-simple",
    name: "Simple Rakhi",
    category: "rakhi",
    categoryLabel: "Rakhi Collection",
    price: 20,
    originalPrice: 30,
    quantity: 100,
    image: "assets/aesthetic-rakhi.jpg",
    tag: "Handmade",
    badge: "Starting ₹20",
    description: "Traditional handmade sacred thread rakhi featuring a golden centerpiece and auspicious red and yellow yarn. Purely handcrafted with love.",
    occasion: "Raksha Bandhan",
    ecoFriendly: true,
    featured: true
  },
  {
    id: "rakhi-designer",
    name: "Designer Rakhi",
    category: "rakhi",
    categoryLabel: "Rakhi Collection",
    price: 50,
    originalPrice: 75,
    quantity: 80,
    image: "assets/aesthetic-rakhi.jpg",
    tag: "Artisan Made",
    badge: "Popular",
    description: "Elegant designer rakhi decorated with pearls, red accent beads, and fine golden work. Specially curated for your beloved brother.",
    occasion: "Raksha Bandhan",
    ecoFriendly: true,
    featured: true
  },
  {
    id: "rakhi-premium",
    name: "Premium Rakhi",
    category: "rakhi",
    categoryLabel: "Rakhi Collection",
    price: 100,
    originalPrice: 140,
    quantity: 50,
    image: "assets/aesthetic-rakhi.jpg",
    tag: "Royal Touch",
    badge: "Premium",
    description: "Royal handcrafted rakhi with antique gold filigree embellishment, high-luster seed pearls, and rich maroon braided silk tassel.",
    occasion: "Raksha Bandhan",
    ecoFriendly: true,
    featured: true
  },
  {
    id: "rakhi-aesthetic",
    name: "Aesthetic Floral Rakhi",
    category: "rakhi",
    categoryLabel: "Rakhi Collection",
    price: 150,
    originalPrice: 199,
    quantity: 45,
    image: "assets/aesthetic-rakhi.jpg",
    tag: "Bestseller",
    badge: "Aesthetic",
    description: "Modern aesthetic rakhi with pastel floral motif and shimmering pearl strands. Perfect blend of contemporary grace and sacred rituals.",
    occasion: "Raksha Bandhan",
    ecoFriendly: true,
    featured: true
  },
  {
    id: "rakhi-resin",
    name: "Premium Resin Rakhi",
    category: "rakhi",
    categoryLabel: "Rakhi Collection",
    price: 200,
    originalPrice: 280,
    quantity: 35,
    image: "assets/aesthetic-rakhi.jpg",
    tag: "Handcrafted Resin",
    badge: "Luxury",
    description: "Exclusive artisan resin rakhi with deep royal blue hue, preserved golden botanicals, and gold leaf flakes. An eternal keepsake.",
    occasion: "Raksha Bandhan",
    ecoFriendly: false,
    featured: true
  },
  {
    id: "rakhi-bunch-pack",
    name: "Rakhi Bunch Pack (Pack of 12)",
    category: "rakhi",
    categoryLabel: "Rakhi Collection",
    price: 150,
    originalPrice: 250,
    quantity: 40,
    image: "assets/rakhi-bunch.jpg",
    tag: "Mega Value Pack",
    badge: "Pack of 12",
    description: "Value bunch pack containing 12 distinct handcrafted beautiful rakhis for cousins and joint families. Includes varied colors and styles.",
    occasion: "Raksha Bandhan",
    ecoFriendly: true,
    featured: true
  },
  {
    id: "rakhi-hamper-classic",
    name: "Rakhi Gift Hamper (Classic)",
    category: "rakhi",
    categoryLabel: "Rakhi Collection",
    price: 150,
    originalPrice: 220,
    quantity: 30,
    image: "assets/luxury-hamper.jpg",
    tag: "Hamper Box",
    badge: "Complete Set",
    description: "Curated Rakhi Hamper in a luxury blush gift box. Includes 1 handcrafted designer rakhi, roli & chawal glass vials, and a handwritten personalized message card.",
    occasion: "Raksha Bandhan",
    ecoFriendly: true,
    featured: true
  },

  // --- Luxury Hamper Collection (From Hamper Flyer) ---
  {
    id: "hamper-mini-01",
    name: "01 Mini Hamper",
    category: "hampers",
    categoryLabel: "Hamper Collection",
    price: 150,
    originalPrice: 200,
    quantity: 50,
    image: "assets/luxury-hamper.jpg",
    tag: "Sweet & Simple",
    badge: "Pocket Friendly",
    description: "A little box of joy for your special one! Includes artisan chocolate bar, soft satin scrunchie, sweet keepsake, and personalized card.",
    occasion: "All Occasions",
    ecoFriendly: true,
    featured: true
  },
  {
    id: "hamper-blue-02",
    name: "02 Luxury Blue Hamper",
    category: "hampers",
    categoryLabel: "Hamper Collection",
    price: 250,
    originalPrice: 350,
    quantity: 35,
    image: "assets/blue-hamper.jpg",
    tag: "Royal Blue",
    badge: "Customer Favorite",
    description: "Elegance in blue, made just for you. Features royal blue velvet presentation, premium sea-salt chocolate bar, brass diya, blue scrunchie, and floral note card.",
    occasion: "Festive & Gifting",
    ecoFriendly: true,
    featured: true
  },
  {
    id: "hamper-charm-03",
    name: "03 Luxury Charm Hamper",
    category: "hampers",
    categoryLabel: "Hamper Collection",
    price: 300,
    originalPrice: 420,
    quantity: 30,
    image: "assets/luxury-hamper.jpg",
    tag: "Charming Gifts",
    badge: "Gifting Delight",
    description: "Charming gifts, beautifully wrapped. Includes curated self-care items, sweets, handmade pendant jewelry card, and luxury ribbon gift wrap.",
    occasion: "Festive & Birthdays",
    ecoFriendly: true,
    featured: false
  },
  {
    id: "hamper-delight-04",
    name: "04 Luxury Delight Hamper",
    category: "hampers",
    categoryLabel: "Hamper Collection",
    price: 350,
    originalPrice: 480,
    quantity: 25,
    image: "assets/luxury-hamper.jpg",
    tag: "Pure Delight",
    badge: "Trending",
    description: "Delightful surprises to make them smile! Loaded with artisanal confectionery, aromatherapy mist, silk accessories, and bespoke note card.",
    occasion: "Festive Special",
    ecoFriendly: true,
    featured: false
  },
  {
    id: "hamper-signature-05",
    name: "05 Signature Luxury Hamper",
    category: "hampers",
    categoryLabel: "Hamper Collection",
    price: 499,
    originalPrice: 699,
    quantity: 20,
    image: "assets/luxury-hamper.jpg",
    tag: "Signature Blend",
    badge: "Top Rated",
    description: "A signature of love and thoughtfulness. Handcrafted soy wax scented candle, 70% dark artisanal cocoa, handmade rakhi/keepsake, and luxury drawer box.",
    occasion: "Celebrations & Weddings",
    ecoFriendly: true,
    featured: true
  },
  {
    id: "hamper-premium-06",
    name: "06 Premium Luxury Hamper",
    category: "hampers",
    categoryLabel: "Hamper Collection",
    price: 599,
    originalPrice: 850,
    quantity: 15,
    image: "assets/luxury-hamper.jpg",
    tag: "Ultra Luxury",
    badge: "Masterpiece",
    description: "Premium gifts for the most special ones. Features luxury golden idol, French floral perfume, hand-poured candle, chocolates, and opulent packaging.",
    occasion: "Grand Celebrations",
    ecoFriendly: true,
    featured: true
  },

  // --- Diwali Festival Collection ---
  {
    id: "diwali-terracotta-diyas",
    name: "Handmade Painted Terracotta Diyas (Set of 4)",
    category: "diwali",
    categoryLabel: "Diwali Special",
    price: 99,
    originalPrice: 150,
    quantity: 60,
    image: "assets/diwali-diyas.jpg",
    tag: "100% Eco-Clay",
    badge: "Set of 4",
    description: "Authentic handmade earthen clay diyas decorated with non-toxic bright festive colors and golden sequins. Clean burning, natural, and biodegradable.",
    occasion: "Diwali",
    ecoFriendly: true,
    featured: true
  },
  {
    id: "diwali-rangoli-diyas",
    name: "Artisanal Royal Rangoli Diyas (Set of 6)",
    category: "diwali",
    categoryLabel: "Diwali Special",
    price: 199,
    originalPrice: 299,
    quantity: 40,
    image: "assets/diwali-diyas.jpg",
    tag: "Artisan Painted",
    badge: "Festive Sparkle",
    description: "Exquisite hand-carved floral diyas designed for festive rangoli centerpieces. Includes natural cotton wicks and pure ghee dip instructions.",
    occasion: "Diwali",
    ecoFriendly: true,
    featured: true
  },
  {
    id: "diwali-shubh-labh-hamper",
    name: "Diwali Shubh Labh Festive Hamper",
    category: "diwali",
    categoryLabel: "Diwali Special",
    price: 499,
    originalPrice: 699,
    quantity: 25,
    image: "assets/blue-hamper.jpg",
    tag: "Festive Gift Box",
    badge: "Diwali Special",
    description: "Complete Diwali pooja & celebration hamper: 2 hand-painted clay diyas, 1 brass finish oil lamp, premium assorted sweets/dry fruits, and shubh labh greetings.",
    occasion: "Diwali",
    ecoFriendly: true,
    featured: true
  },

  // --- Ganesh Chaturthi / Ganesh Sthapna Collection ---
  {
    id: "ganesh-murti-clay",
    name: "Eco-Friendly Handmade Clay Ganesh Murti",
    category: "ganesh",
    categoryLabel: "Ganesh Sthapna",
    price: 399,
    originalPrice: 550,
    quantity: 30,
    image: "assets/ganesh-murti.jpg",
    tag: "100% Natural Shadu Clay",
    badge: "Eco Sthapna",
    description: "Divine, eco-friendly Ganesha idol handcrafted using pure unadulterated river clay (Shadu Mati). 100% water dissolvable for green home visarjan without polluting water bodies.",
    occasion: "Ganesh Chaturthi",
    ecoFriendly: true,
    featured: true
  },
  {
    id: "ganesh-seed-murti",
    name: "Plantable Seed Ganesha Idol (Marigold / Tulsi)",
    category: "ganesh",
    categoryLabel: "Ganesh Sthapna",
    price: 549,
    originalPrice: 750,
    quantity: 25,
    image: "assets/ganesh-murti.jpg",
    tag: "Grows into a Plant",
    badge: "Green Visarjan",
    description: "Handcrafted idol embedded with organic holy Tulsi and Marigold seeds. Do visarjan in a home pot, and watch Lord Ganesha bless your home as a thriving green plant!",
    occasion: "Ganesh Chaturthi",
    ecoFriendly: true,
    featured: true
  },
  {
    id: "ganesh-baby-murti",
    name: "Traditional Handcrafted Baby Ganesha Idol",
    category: "ganesh",
    categoryLabel: "Ganesh Sthapna",
    price: 299,
    originalPrice: 420,
    quantity: 35,
    image: "assets/ganesh-murti.jpg",
    tag: "Natural Turmeric Finish",
    badge: "Compact & Sacred",
    description: "Adorable compact clay Ganesha idol finished with pure turmeric and sandalwood paste. Perfect for home temple sthapna, study tables, or office desks.",
    occasion: "Ganesh Chaturthi",
    ecoFriendly: true,
    featured: false
  }
];

// Product Store API with Server Sync & LocalStorage Fallback
const StoreManager = {
  // Sync with Backend API
  async syncWithServer() {
    try {
      const prodRes = await fetch('/api/products');
      if (prodRes.ok) {
        const serverProducts = await prodRes.json();
        if (Array.isArray(serverProducts) && serverProducts.length > 0) {
          localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(serverProducts));
        }
      }
    } catch (e) {
      // Backend not running, use local storage
    }

    try {
      const confRes = await fetch('/api/config');
      if (confRes.ok) {
        const serverConfig = await confRes.json();
        if (serverConfig && serverConfig.storeName) {
          localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(serverConfig));
        }
      }
    } catch (e) {
      // Ignore
    }
  },

  // Config
  getConfig() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CONFIG);
      if (stored) {
        return { ...DEFAULT_CONFIG, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn("Error reading config from storage:", e);
    }
    return { ...DEFAULT_CONFIG };
  },

  saveConfig(newConfig) {
    try {
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(newConfig));
      // Sync to backend server
      fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConfig)
      }).catch(() => {});
      return true;
    } catch (e) {
      console.error("Error saving config:", e);
      return false;
    }
  },

  // Products
  getProducts() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Error reading products:", e);
    }
    // Initialize default products if none exist
    this.saveProducts(DEFAULT_PRODUCTS);
    return [...DEFAULT_PRODUCTS];
  },

  saveProducts(products) {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
      // Sync to backend server
      fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(products)
      }).catch(() => {});
      return true;
    } catch (e) {
      console.error("Error saving products:", e);
      return false;
    }
  },

  getProductById(id) {
    const products = this.getProducts();
    return products.find(p => p.id === id) || null;
  },

  addProduct(productData) {
    const products = this.getProducts();
    const newProduct = {
      id: "prod-" + Date.now(),
      name: productData.name || "Handcrafted Product",
      category: productData.category || "rakhi",
      categoryLabel: productData.categoryLabel || this.getCategoryLabel(productData.category),
      price: Number(productData.price) || 99,
      originalPrice: Number(productData.originalPrice) || Number(productData.price) + 50,
      quantity: Number(productData.quantity) || 20,
      image: productData.image || "assets/luxury-hamper.jpg",
      tag: productData.tag || "Handmade",
      badge: productData.badge || "New",
      description: productData.description || "Handcrafted with premium love and eco-friendly materials.",
      occasion: productData.occasion || "Festive Celebration",
      ecoFriendly: productData.ecoFriendly !== false,
      featured: Boolean(productData.featured)
    };
    products.unshift(newProduct);
    this.saveProducts(products);
    return newProduct;
  },

  updateProduct(id, updatedFields) {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;

    products[index] = {
      ...products[index],
      ...updatedFields,
      price: Number(updatedFields.price !== undefined ? updatedFields.price : products[index].price),
      originalPrice: Number(updatedFields.originalPrice !== undefined ? updatedFields.originalPrice : products[index].originalPrice),
      quantity: Number(updatedFields.quantity !== undefined ? updatedFields.quantity : products[index].quantity)
    };

    this.saveProducts(products);
    return products[index];
  },

  deleteProduct(id) {
    let products = this.getProducts();
    products = products.filter(p => p.id !== id);
    this.saveProducts(products);
    return true;
  },

  resetToDefaults() {
    this.saveProducts(DEFAULT_PRODUCTS);
    this.saveConfig(DEFAULT_CONFIG);
    return true;
  },

  getCategoryLabel(catKey) {
    const map = {
      rakhi: "Rakhi Collection",
      hampers: "Hamper Collection",
      diwali: "Diwali Special",
      ganesh: "Ganesh Sthapna",
      custom: "Custom Gifting"
    };
    return map[catKey] || "Handcrafted Gifting";
  },

  // Export full store backup as a JSON file
  exportBackup() {
    const backupData = {
      version: "1.0",
      exportedAt: new Date().toISOString(),
      storeConfig: this.getConfig(),
      products: this.getProducts()
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `veda-luxury-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  // Import store backup from JSON
  importBackup(backupJson) {
    try {
      const data = typeof backupJson === 'string' ? JSON.parse(backupJson) : backupJson;
      if (Array.isArray(data.products)) {
        this.saveProducts(data.products);
      }
      if (data.storeConfig) {
        this.saveConfig(data.storeConfig);
      }
      return true;
    } catch (e) {
      console.error("Backup import error:", e);
      return false;
    }
  }
};

// Initial background sync with backend
StoreManager.syncWithServer();

// Expose globally
window.StoreManager = StoreManager;
window.DEFAULT_CONFIG = DEFAULT_CONFIG;
