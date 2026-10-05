/**
 * The Veda Luxury - Main Application Logic
 * Thoughtful Gifts, Beautiful Memories
 */

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

const App = {
  activeCategory: 'all',
  searchQuery: '',
  sortBy: 'default',
  currentModalProduct: null,
  isCatalogPage: false,
  currentPage: 1,
  pageSize: 12,

  init() {
    this.isCatalogPage = document.body.classList.contains('catalog-page') || window.location.pathname.includes('products.html');

    // Read URL category filter if present (e.g. products.html?category=rakhi)
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const catParam = urlParams.get('category');
      if (catParam) {
        this.activeCategory = catParam;
        document.querySelectorAll('.category-tab').forEach(tab => {
          tab.classList.toggle('active', tab.getAttribute('data-cat') === catParam);
        });
      }
      const searchParam = urlParams.get('search');
      if (searchParam) {
        this.searchQuery = searchParam;
        const searchInput = document.getElementById('productSearchInput');
        if (searchInput) searchInput.value = searchParam;
      }
    } catch (e) {}

    this.updateBrandDetails();
    this.renderProducts();
    this.bindEvents();
    if (window.Cart) {
      window.Cart.init();
    }
  },

  updateBrandDetails() {
    const config = StoreManager.getConfig();

    // Update dynamic text across DOM
    document.querySelectorAll('.store-name-text').forEach(el => el.textContent = config.storeName);
    document.querySelectorAll('.store-tagline-text').forEach(el => el.textContent = config.tagline);
    document.querySelectorAll('.contact-person-name').forEach(el => el.textContent = config.contactPerson);
    document.querySelectorAll('.contact-whatsapp-display').forEach(el => el.textContent = config.whatsappNumber);

    // Update Instagram links & handles
    let instaHandle = (config.instagramHandle || "thevedaluxury").trim().replace(/^@/, '');
    if (instaHandle.includes('instagram.com/')) {
      instaHandle = instaHandle.split('instagram.com/')[1].split('/')[0].split('?')[0];
    }
    const instaUrl = config.instagramUrl || `https://instagram.com/${instaHandle}`;
    document.querySelectorAll('.instagram-link').forEach(el => {
      el.href = instaUrl;
    });
    document.querySelectorAll('.instagram-handle-text').forEach(el => {
      el.textContent = `@${instaHandle}`;
    });

    // Update YouTube Video Embed & Watch Link
    let rawYt = (config.youtubeVideoId || "ScMzIvxBSi4").trim();
    const ytMatch = rawYt.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
    if (ytMatch && ytMatch[1]) {
      rawYt = ytMatch[1];
    }
    const ytFrame = document.getElementById('youtubeShowcaseFrame');
    if (ytFrame) {
      ytFrame.src = `https://www.youtube.com/embed/${rawYt}?rel=0&modestbranding=1`;
    }
    const ytWatchLink = document.getElementById('youtubeWatchLink');
    if (ytWatchLink) {
      ytWatchLink.href = `https://www.youtube.com/watch?v=${rawYt}`;
    }

    // Update WhatsApp links
    const cleanNumber = config.whatsappNumber.replace(/[^0-9]/g, '');
    const validNumber = cleanNumber.length === 10 ? '91' + cleanNumber : cleanNumber;
    const defaultMsg = encodeURIComponent(`Hello ${config.contactPerson}! I visited The Veda Luxury website and have an inquiry about your handcrafted festive gifts.`);

    document.querySelectorAll('.direct-whatsapp-btn').forEach(el => {
      el.href = `https://wa.me/${validNumber}?text=${defaultMsg}`;
    });
  },

  renderProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    let products = StoreManager.getProducts();

    // 1. Filter by category
    if (this.activeCategory !== 'all') {
      products = products.filter(p => p.category === this.activeCategory);
    }

    // 2. Filter by search query
    if (this.searchQuery.trim() !== '') {
      const q = this.searchQuery.toLowerCase().trim();
      products = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.tag && p.tag.toLowerCase().includes(q)) ||
        (p.occasion && p.occasion.toLowerCase().includes(q)) ||
        (p.categoryLabel && p.categoryLabel.toLowerCase().includes(q))
      );
    }

    // 3. Sort
    if (this.sortBy === 'price-low') {
      products.sort((a, b) => a.price - b.price);
    } else if (this.sortBy === 'price-high') {
      products.sort((a, b) => b.price - a.price);
    } else if (this.sortBy === 'name-asc') {
      products.sort((a, b) => a.name.localeCompare(b.name));
    }

    const totalMatching = products.length;

    // 4. Pagination / Limit Handling
    let productsToDisplay = products;
    const countDisplay = document.getElementById('resultsCountDisplay');

    if (!this.isCatalogPage) {
      // HOME PAGE: Show only top 8 items on 'all' preview so user doesn't have to scroll endlessly
      if (this.activeCategory === 'all' && !this.searchQuery.trim()) {
        productsToDisplay = products.slice(0, 8);
        if (countDisplay) {
          countDisplay.innerHTML = `Showing <strong>8 featured items</strong> of <strong>${totalMatching}</strong> handcrafted gifts • <a href="products.html" style="color: var(--color-primary); font-weight: 600; text-decoration: underline; margin-left: 0.3rem;">View All Collections (${totalMatching}) →</a>`;
        }
      } else {
        if (countDisplay) {
          countDisplay.innerHTML = `Showing <strong>${totalMatching}</strong> handcrafted item${totalMatching !== 1 ? 's' : ''}`;
        }
      }
    } else {
      // CATALOG PAGE (products.html): Show 12 items at a time with 'Load More'
      const maxCount = Math.min(this.currentPage * this.pageSize, totalMatching);
      productsToDisplay = products.slice(0, maxCount);

      if (countDisplay) {
        countDisplay.innerHTML = `Showing <strong>${productsToDisplay.length}</strong> of <strong>${totalMatching}</strong> handcrafted items`;
      }

      const loadMoreContainer = document.getElementById('loadMoreContainer');
      const loadMoreBtn = document.getElementById('loadMoreBtn');
      if (loadMoreContainer && loadMoreBtn) {
        if (productsToDisplay.length < totalMatching) {
          loadMoreContainer.style.display = 'block';
          const spanText = loadMoreBtn.querySelector('span');
          if (spanText) spanText.textContent = `Load More Products (${productsToDisplay.length} of ${totalMatching})`;
          loadMoreBtn.onclick = () => {
            this.currentPage++;
            this.renderProducts();
          };
        } else {
          loadMoreContainer.style.display = 'none';
        }
      }
    }

    if (totalMatching === 0) {
      grid.innerHTML = `
        <div class="empty-products-view">
          <div class="empty-icon">🌸</div>
          <h3>No products match your search</h3>
          <p>Try searching for Rakhis, Luxury Hampers, Diwali Diyas, or Eco Ganesha Murti.</p>
          <button class="btn btn-outline" onclick="App.resetFilters()">View All Collections</button>
        </div>
      `;
      return;
    }

    let html = '';
    productsToDisplay.forEach(p => {
      const discountPct = p.originalPrice > p.price
        ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
        : null;

      html += `
        <div class="product-card" data-category="${p.category}">
          <div class="product-badge-wrap">
            ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
            ${p.ecoFriendly ? `<span class="product-eco-badge" title="100% Eco-Friendly & Natural">🌱 Eco-Friendly</span>` : ''}
          </div>

          <div class="product-image-container" onclick="App.openQuickView('${p.id}')">
            <img src="${p.image}" alt="${p.name}" class="product-image" loading="lazy" onerror="this.src='assets/logo.png'">
            <div class="image-overlay">
              <span class="quick-view-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                Quick Preview
              </span>
            </div>
          </div>

          <div class="product-info">
            <div class="product-meta">
              <span class="product-category-tag">${p.categoryLabel}</span>
              ${p.occasion ? `<span class="product-occasion-tag">${p.occasion}</span>` : ''}
            </div>

            <h3 class="product-title" onclick="App.openQuickView('${p.id}')">${p.name}</h3>

            <p class="product-snippet">${p.description ? p.description.slice(0, 85) + '...' : ''}</p>

            <div class="product-price-row">
              <div class="price-box">
                <span class="current-price">₹${p.price.toLocaleString('en-IN')}</span>
                ${p.originalPrice > p.price ? `<span class="original-price">₹${p.originalPrice.toLocaleString('en-IN')}</span>` : ''}
                ${discountPct ? `<span class="discount-pill">${discountPct}% OFF</span>` : ''}
              </div>
              <div class="product-stock-tag ${p.quantity <= 10 ? 'low-stock' : ''}">
                ${p.quantity > 0 ? (p.quantity <= 10 ? `Only ${p.quantity} left!` : `In Stock`) : `Sold Out`}
              </div>
            </div>

            <!-- Card Actions -->
            <div class="product-card-actions">
              <button class="btn btn-secondary add-to-cart-btn" onclick="Cart.addItem('${p.id}', 1)" title="Add to cart">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                <span>Add to Cart</span>
              </button>

              <button class="btn btn-primary buy-whatsapp-btn" onclick="Cart.buyNowSingleProduct('${p.id}', 1)" title="Order directly on WhatsApp">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 2.062.81 3.201.81 3.181 0 5.768-2.586 5.768-5.766 0-3.18-2.587-5.766-5.773-5.766zm9.969 5.766c0 5.503-4.478 9.98-9.97 9.98-1.745 0-3.385-.45-4.819-1.237L2 22l1.341-4.898A9.92 9.92 0 0 1 2.062 11.938C2.062 6.435 6.54 1.958 12.032 1.958c5.492 0 9.968 4.477 9.968 9.98z"/>
                </svg>
                <span>Buy Now</span>
              </button>
            </div>
          </div>
        </div>
      `;
    });

    grid.innerHTML = html;
  },

  resetFilters() {
    this.activeCategory = 'all';
    this.searchQuery = '';
    this.sortBy = 'default';
    this.currentPage = 1;

    const searchInput = document.getElementById('productSearchInput');
    if (searchInput) searchInput.value = '';

    const sortSelect = document.getElementById('sortBySelect');
    if (sortSelect) sortSelect.value = 'default';

    document.querySelectorAll('.category-tab').forEach(tab => {
      tab.classList.toggle('active', tab.getAttribute('data-cat') === 'all');
    });

    this.renderProducts();
  },

  openQuickView(productId) {
    const product = StoreManager.getProductById(productId);
    if (!product) return;

    this.currentModalProduct = product;
    const modal = document.getElementById('quickViewModal');
    if (!modal) return;

    const discountPct = product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

    document.getElementById('modalProductImage').src = product.image;
    document.getElementById('modalProductImage').alt = product.name;
    document.getElementById('modalProductTitle').textContent = product.name;
    document.getElementById('modalProductCategory').textContent = product.categoryLabel;
    document.getElementById('modalProductPrice').textContent = `₹${product.price.toLocaleString('en-IN')}`;

    const originalEl = document.getElementById('modalProductOriginalPrice');
    const discountEl = document.getElementById('modalProductDiscount');
    if (product.originalPrice > product.price) {
      originalEl.textContent = `₹${product.originalPrice.toLocaleString('en-IN')}`;
      originalEl.style.display = 'inline';
      if (discountPct) {
        discountEl.textContent = `${discountPct}% OFF`;
        discountEl.style.display = 'inline';
      }
    } else {
      originalEl.style.display = 'none';
      discountEl.style.display = 'none';
    }

    document.getElementById('modalProductDescription').textContent = product.description;
    document.getElementById('modalProductStock').textContent = `${product.quantity} units available`;
    document.getElementById('modalProductOccasion').textContent = product.occasion || "Festive Gifting";

    const ecoBadge = document.getElementById('modalProductEco');
    if (ecoBadge) {
      ecoBadge.style.display = product.ecoFriendly ? 'inline-flex' : 'none';
    }

    // Reset qty
    const qtyInput = document.getElementById('modalProductQty');
    if (qtyInput) qtyInput.value = 1;

    modal.classList.add('active');
    document.body.classList.add('modal-open');
  },

  closeQuickView() {
    const modal = document.getElementById('quickViewModal');
    if (modal) {
      modal.classList.remove('active');
      document.body.classList.remove('modal-open');
    }
    this.currentModalProduct = null;
  },

  bindEvents() {
    // 1. Category Filter Tabs
    document.querySelectorAll('.category-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.activeCategory = e.currentTarget.getAttribute('data-cat') || 'all';
        this.currentPage = 1;
        this.renderProducts();

        // Smooth scroll to products section
        const shopSection = document.getElementById('shop-section') || document.querySelector('.shop-section');
        if (shopSection) {
          shopSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // 2. Search Input (with debounce)
    const searchInput = document.getElementById('productSearchInput');
    let searchTimeout = null;
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          this.searchQuery = e.target.value;
          this.currentPage = 1;
          this.renderProducts();
        }, 250);
      });
    }

    // 3. Sort Select
    const sortSelect = document.getElementById('sortBySelect');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.sortBy = e.target.value;
        this.currentPage = 1;
        this.renderProducts();
      });
    }

    // 4. Modal Events
    const closeModalBtn = document.getElementById('closeModalBtn');
    const modalOverlay = document.getElementById('quickViewModalOverlay');
    if (closeModalBtn) closeModalBtn.addEventListener('click', () => this.closeQuickView());
    if (modalOverlay) modalOverlay.addEventListener('click', () => this.closeQuickView());

    // Modal Qty Buttons
    const modalQtyMinus = document.getElementById('modalQtyMinus');
    const modalQtyPlus = document.getElementById('modalQtyPlus');
    const modalQtyInput = document.getElementById('modalProductQty');

    if (modalQtyMinus && modalQtyInput) {
      modalQtyMinus.addEventListener('click', () => {
        let val = parseInt(modalQtyInput.value, 10) || 1;
        if (val > 1) modalQtyInput.value = val - 1;
      });
    }

    if (modalQtyPlus && modalQtyInput) {
      modalQtyPlus.addEventListener('click', () => {
        let val = parseInt(modalQtyInput.value, 10) || 1;
        modalQtyInput.value = val + 1;
      });
    }

    // Modal Add to Cart
    const modalAddToCart = document.getElementById('modalAddToCartBtn');
    if (modalAddToCart) {
      modalAddToCart.addEventListener('click', () => {
        if (!this.currentModalProduct) return;
        const qty = parseInt(modalQtyInput ? modalQtyInput.value : 1, 10) || 1;
        Cart.addItem(this.currentModalProduct.id, qty);
        this.closeQuickView();
      });
    }

    // Modal WhatsApp Buy
    const modalBuyWhatsApp = document.getElementById('modalBuyWhatsAppBtn');
    if (modalBuyWhatsApp) {
      modalBuyWhatsApp.addEventListener('click', () => {
        if (!this.currentModalProduct) return;
        const qty = parseInt(modalQtyInput ? modalQtyInput.value : 1, 10) || 1;
        Cart.buyNowSingleProduct(this.currentModalProduct.id, qty);
        this.closeQuickView();
      });
    }

    // 5. Contact Form redirect to WhatsApp
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const config = StoreManager.getConfig();
        const name = document.getElementById('contactName').value.trim();
        const phone = document.getElementById('contactPhone').value.trim();
        const occasion = document.getElementById('contactOccasion').value;
        const message = document.getElementById('contactMessage').value.trim();

        if (!name || !message) {
          alert('Please fill out your name and message!');
          return;
        }

        let waText = `🌸 *ENQUIRY - THE VEDA LUXURY* 🌸\n`;
        waText += `Hello ${config.contactPerson}!\n\n`;
        waText += `• *Name:* ${name}\n`;
        if (phone) waText += `• *Contact:* ${phone}\n`;
        if (occasion) waText += `• *Occasion/Interest:* ${occasion}\n`;
        waText += `• *Message:* ${message}\n\n`;
        waText += `Looking forward to hearing from you!`;

        const rawNumber = config.whatsappNumber.replace(/[^0-9]/g, '');
        const cleanNumber = rawNumber.length === 10 ? '91' + rawNumber : rawNumber;
        const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(waText)}`;

        window.open(url, '_blank');
        contactForm.reset();
        Cart.showToast("🌸 Opening WhatsApp to send your message to Viraj Patidar!", "success");
      });
    }

    // 6. Mobile Nav Hamburger
    const navToggle = document.getElementById('mobileNavToggle');
    const navMenu = document.getElementById('mainNavMenu');
    if (navToggle && navMenu) {
      navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
      });

      // Close menu when clicking nav link
      navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          navMenu.classList.remove('active');
          navToggle.classList.remove('active');
        });
      });
    }

    // 7. Navbar scroll shadow
    window.addEventListener('scroll', () => {
      const header = document.querySelector('.site-header');
      if (header) {
        if (window.scrollY > 40) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }
    });
  }
};

window.App = App;
