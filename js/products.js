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
  whatsappNumber: "+918319092202", // Users can update this anytime in Admin panel
  instagramHandle: "thevedaluxury",
  instagramUrl: "https://instagram.com/thevedaluxury",
  youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Embeddable video URL
  youtubeVideoId: "ScMzIvxBSi4",
  address: "Handcrafted Studio, Indore, Madhya Pradesh, India",
  shippingNotice: "Free local delivery available • Pan India secure shipping",
  adminPin: "veda123",
  cloudinaryCloudName: "imeeobej",
  cloudinaryUploadPreset: "veda_preset"
};

// One-time catalog cache versioning to clear legacy default seed items from browser localStorage
const CURRENT_CATALOG_VERSION = '2.3_nodefaults';
try {
  const version = localStorage.getItem('veda_catalog_version');
  if (version !== CURRENT_CATALOG_VERSION) {
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.setItem('veda_catalog_version', CURRENT_CATALOG_VERSION);
  }
} catch (e) {}

// Default Products Seed Data (Clean empty catalog so user manages their own products)
const DEFAULT_PRODUCTS = [];

// Product Store API with Server Sync & LocalStorage Fallback
const StoreManager = {
  // Sync with Backend API
  async syncWithServer() {
    try {
      let serverProducts = null;
      try {
        const prodRes = await fetch('/api/products');
        if (prodRes.ok) serverProducts = await prodRes.json();
      } catch (e) {}

      // Fallback to static data/products.json if /api/products returns error or 404
      if (!Array.isArray(serverProducts)) {
        try {
          const fileRes = await fetch('data/products.json?v=' + Date.now());
          if (fileRes.ok) serverProducts = await fileRes.json();
        } catch (e) {}
      }

      if (Array.isArray(serverProducts)) {
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(serverProducts));
        window.dispatchEvent(new CustomEvent('veda_products_synced', { detail: serverProducts }));
      }
    } catch (e) {
      // Backend not running, use local storage
    }

    try {
      let serverConfig = null;
      try {
        const confRes = await fetch('/api/config');
        if (confRes.ok) serverConfig = await confRes.json();
      } catch (e) {}

      // Fallback to static data/config.json if /api/config is not reachable (e.g. static / Live Server)
      if (!serverConfig || !serverConfig.whatsappNumber) {
        try {
          const fileRes = await fetch('data/config.json?v=' + Date.now());
          if (fileRes.ok) serverConfig = await fileRes.json();
        } catch (e) {}
      }

      if (serverConfig && (serverConfig.whatsappNumber || serverConfig.storeName)) {
        localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(serverConfig));
        window.dispatchEvent(new CustomEvent('veda_config_synced', { detail: serverConfig }));
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
        const parsed = JSON.parse(stored);
        return {
          ...DEFAULT_CONFIG,
          ...parsed,
          cloudinaryCloudName: parsed.cloudinaryCloudName || DEFAULT_CONFIG.cloudinaryCloudName,
          cloudinaryUploadPreset: parsed.cloudinaryUploadPreset || DEFAULT_CONFIG.cloudinaryUploadPreset
        };
      }
    } catch (e) {
      console.warn("Error reading config from storage:", e);
    }
    return { ...DEFAULT_CONFIG };
  },

  saveConfig(newConfig) {
    try {
      const mergedConfig = { ...this.getConfig(), ...newConfig };
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(mergedConfig));
      // Sync to backend server
      fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mergedConfig)
      }).then(res => {
        if (res.ok) console.log('✅ Store configuration saved to data/config.json');
      }).catch((err) => {
        console.warn('Backend server not running; config saved to browser localStorage only:', err);
      });
      window.dispatchEvent(new CustomEvent('veda_config_synced', { detail: mergedConfig }));
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
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Error reading products:", e);
    }
    return [];
  },

  saveProducts(products) {
    try {
      const safeProducts = Array.isArray(products) ? products : [];
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(safeProducts));
      // Sync to backend server
      fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(safeProducts)
      }).catch((err) => {
        console.error("Error syncing products to server:", err);
      });
      return true;
    } catch (e) {
      console.error("Error saving products:", e);
      return false;
    }
  },

  getProductById(id) {
    const products = this.getProducts();
    return products.find(p => String(p.id) === String(id)) || null;
  },

  addProduct(productData) {
    const products = this.getProducts();
    const newProduct = {
      id: "prod-" + Date.now(),
      name: productData.name || "Handcrafted Product",
      category: productData.category || "custom",
      categoryLabel: productData.categoryLabel || this.getCategoryLabel(productData.category),
      price: Number(productData.price) || 0,
      originalPrice: Number(productData.originalPrice) || Number(productData.price),
      quantity: Number(productData.quantity) || 1,
      image: productData.image || "assets/logo.png",
      tag: productData.tag || "",
      badge: productData.badge || "",
      description: productData.description || "",
      occasion: productData.occasion || "Celebration",
      ecoFriendly: productData.ecoFriendly !== false,
      featured: Boolean(productData.featured)
    };
    products.unshift(newProduct);
    this.saveProducts(products);
    return newProduct;
  },

  updateProduct(id, updatedFields) {
    const products = this.getProducts();
    const index = products.findIndex(p => String(p.id) === String(id));
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
    products = products.filter(p => String(p.id) !== String(id));
    this.saveProducts(products);
    return true;
  },

  clearAllProducts() {
    this.saveProducts([]);
    return true;
  },

  resetToDefaults() {
    this.saveProducts([]);
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
      version: "2.3",
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
