/**
 * The Veda Luxury - Cart & WhatsApp Checkout System
 */

const Cart = {
  items: [],

  init() {
    this.loadCart();
    this.renderCartUI();
    this.bindEvents();
  },

  loadCart() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CART);
      this.items = stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.warn("Could not read cart from localStorage:", e);
      this.items = [];
    }
  },

  saveCart() {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(this.items));
    } catch (e) {
      console.error("Could not save cart:", e);
    }
    this.updateBadges();
  },

  addItem(productId, qty = 1) {
    const product = StoreManager.getProductById(productId);
    if (!product) {
      this.showToast("Product not found!", "error");
      return;
    }

    const requestedQty = Math.max(1, parseInt(qty, 10) || 1);
    const existingIndex = this.items.findIndex(item => item.id === productId);

    if (existingIndex > -1) {
      this.items[existingIndex].quantity += requestedQty;
    } else {
      this.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        categoryLabel: product.categoryLabel,
        quantity: requestedQty
      });
    }

    this.saveCart();
    this.renderCartUI();
    this.showToast(`✨ Added "${product.name}" to cart!`, "success");
    this.openDrawer();
  },

  updateQuantity(productId, delta) {
    const itemIndex = this.items.findIndex(item => item.id === productId);
    if (itemIndex === -1) return;

    this.items[itemIndex].quantity += delta;
    if (this.items[itemIndex].quantity <= 0) {
      this.items.splice(itemIndex, 1);
      this.showToast("Item removed from cart", "info");
    }

    this.saveCart();
    this.renderCartUI();
  },

  removeItem(productId) {
    const item = this.items.find(i => i.id === productId);
    this.items = this.items.filter(item => item.id !== productId);
    this.saveCart();
    this.renderCartUI();
    if (item) {
      this.showToast(`Removed "${item.name}" from cart`, "info");
    }
  },

  clearCart() {
    this.items = [];
    this.saveCart();
    this.renderCartUI();
  },

  getTotals() {
    const totalCount = this.items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return {
      count: totalCount,
      subtotal: subtotal,
      formattedSubtotal: "₹" + subtotal.toLocaleString('en-IN')
    };
  },

  updateBadges() {
    const totals = this.getTotals();
    const badgeElements = document.querySelectorAll('.cart-count-badge');
    badgeElements.forEach(badge => {
      badge.textContent = totals.count;
      badge.style.display = totals.count > 0 ? 'inline-flex' : 'none';
    });
  },

  renderCartUI() {
    this.updateBadges();
    const cartContainer = document.getElementById('cartItemsContainer');
    const emptyState = document.getElementById('cartEmptyState');
    const footerElement = document.getElementById('cartDrawerFooter');
    const subtotalDisplay = document.getElementById('cartSubtotalDisplay');
    const totalCountDisplay = document.getElementById('cartTotalCountDisplay');

    if (!cartContainer) return;

    if (this.items.length === 0) {
      if (emptyState) emptyState.style.display = 'block';
      if (footerElement) footerElement.style.display = 'none';
      cartContainer.innerHTML = '';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    if (footerElement) footerElement.style.display = 'block';

    const totals = this.getTotals();
    if (subtotalDisplay) subtotalDisplay.textContent = totals.formattedSubtotal;
    if (totalCountDisplay) totalCountDisplay.textContent = `${totals.count} item${totals.count > 1 ? 's' : ''}`;

    let html = '';
    this.items.forEach(item => {
      const itemTotal = item.price * item.quantity;
      html += `
        <div class="cart-item" data-id="${item.id}">
          <img src="${item.image}" alt="${item.name}" class="cart-item-img" onerror="this.src='assets/logo.png'">
          <div class="cart-item-details">
            <h4 class="cart-item-title">${item.name}</h4>
            <span class="cart-item-category">${item.categoryLabel || 'Handmade Gift'}</span>
            <div class="cart-item-price-row">
              <span class="cart-item-unit-price">₹${item.price} each</span>
              <span class="cart-item-total-price">₹${itemTotal.toLocaleString('en-IN')}</span>
            </div>
            <div class="cart-item-actions">
              <div class="cart-qty-picker">
                <button type="button" class="qty-btn dec-btn" onclick="Cart.updateQuantity('${item.id}', -1)" aria-label="Decrease quantity">−</button>
                <span class="qty-val">${item.quantity}</span>
                <button type="button" class="qty-btn inc-btn" onclick="Cart.updateQuantity('${item.id}', 1)" aria-label="Increase quantity">+</button>
              </div>
              <button type="button" class="cart-remove-btn" onclick="Cart.removeItem('${item.id}')" title="Remove item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
                <span>Remove</span>
              </button>
            </div>
          </div>
        </div>
      `;
    });

    cartContainer.innerHTML = html;
  },

  openDrawer() {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartDrawerOverlay');
    if (drawer && overlay) {
      drawer.classList.add('active');
      overlay.classList.add('active');
      document.body.classList.add('cart-open');
    }
  },

  closeDrawer() {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartDrawerOverlay');
    if (drawer && overlay) {
      drawer.classList.remove('active');
      overlay.classList.remove('active');
      document.body.classList.remove('cart-open');
    }
  },

  checkoutViaWhatsApp() {
    if (this.items.length === 0) {
      this.showToast("Your cart is empty! Add products first.", "warning");
      return;
    }

    const config = StoreManager.getConfig();
    const nameInput = document.getElementById('checkoutName');
    const phoneInput = document.getElementById('checkoutPhone');
    const addressInput = document.getElementById('checkoutAddress');
    const noteInput = document.getElementById('checkoutNote');

    const customerName = nameInput ? nameInput.value.trim() : "";
    const customerPhone = phoneInput ? phoneInput.value.trim() : "";
    const customerAddress = addressInput ? addressInput.value.trim() : "";
    const customerNote = noteInput ? noteInput.value.trim() : "";

    if (!customerName) {
      this.showToast("Please enter your name for the order!", "warning");
      if (nameInput) nameInput.focus();
      return;
    }

    if (!customerPhone) {
      this.showToast("Please enter your contact phone number!", "warning");
      if (phoneInput) phoneInput.focus();
      return;
    }

    const totals = this.getTotals();

    // Construct formatted WhatsApp message
    let message = `🌸 *NEW ORDER - THE VEDA LUXURY* 🌸\n`;
    message += `_Thoughtful Gifts, Beautiful Memories_\n`;
    message += `────────────────────────────\n`;
    message += `👤 *Customer Information:*\n`;
    message += `• *Name:* ${customerName}\n`;
    message += `• *Phone:* ${customerPhone}\n`;
    if (customerAddress) {
      message += `• *Address/City:* ${customerAddress}\n`;
    }
    if (customerNote) {
      message += `• *Special Note/Customization:* ${customerNote}\n`;
    }
    message += `────────────────────────────\n`;
    message += `🛍️ *Order Breakdown:*\n`;

    this.items.forEach((item, index) => {
      const lineTotal = item.price * item.quantity;
      message += `${index + 1}. *${item.name}*\n   Qty: ${item.quantity} × ₹${item.price} = *₹${lineTotal.toLocaleString('en-IN')}*\n`;
    });

    message += `────────────────────────────\n`;
    message += `📦 *Total Items:* ${totals.count}\n`;
    message += `💰 *Total Amount Payable:* ₹${totals.subtotal.toLocaleString('en-IN')}\n`;
    message += `🚚 *Delivery:* Local Delivery / Pan-India Shipping\n`;
    message += `────────────────────────────\n`;
    message += `✨ Hello ${config.contactPerson}! I would like to confirm this order. Please share available payment modes (UPI/GPay/PhonePe/Bank) and shipping details. Thank you!`;

    // Target WhatsApp Number
    const rawNumber = config.whatsappNumber.replace(/[^0-9]/g, '');
    const cleanNumber = rawNumber.length === 10 ? '91' + rawNumber : rawNumber;
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;

    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');

    this.showToast("🌸 Redirecting to WhatsApp to complete your order!", "success");

    // Optional: save order details locally or keep cart
    setTimeout(() => {
      // Prompt customer if they want to clear cart
      const confirmed = confirm("Did you place your order on WhatsApp with Viraj Patidar? Would you like to clear your cart now?");
      if (confirmed) {
        this.clearCart();
        this.closeDrawer();
        if (nameInput) nameInput.value = '';
        if (phoneInput) phoneInput.value = '';
        if (addressInput) addressInput.value = '';
        if (noteInput) noteInput.value = '';
      }
    }, 2500);
  },

  buyNowSingleProduct(productId, customQty = 1) {
    const product = StoreManager.getProductById(productId);
    if (!product) return;

    const config = StoreManager.getConfig();
    const qty = Math.max(1, parseInt(customQty, 10) || 1);
    const total = product.price * qty;

    let message = `🌸 *DIRECT ORDER - THE VEDA LUXURY* 🌸\n`;
    message += `Hello ${config.contactPerson}!\n`;
    message += `I want to immediately buy this product:\n\n`;
    message += `• *Product:* ${product.name}\n`;
    message += `• *Category:* ${product.categoryLabel}\n`;
    message += `• *Quantity:* ${qty}\n`;
    message += `• *Price:* ₹${product.price} each\n`;
    message += `• *Total Amount:* ₹${total.toLocaleString('en-IN')}\n\n`;
    message += `Please confirm availability, payment details, and dispatch timeframe. Thank you!`;

    const rawNumber = config.whatsappNumber.replace(/[^0-9]/g, '');
    const cleanNumber = rawNumber.length === 10 ? '91' + rawNumber : rawNumber;
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank');
    this.showToast(`Redirecting to WhatsApp for "${product.name}"!`, "success");
  },

  showToast(message, type = "info") {
    let toastContainer = document.getElementById('toastNotificationContainer');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toastNotificationContainer';
      toastContainer.className = 'toast-container';
      document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = `toast-pill toast-${type}`;
    toast.innerHTML = `
      <div class="toast-content">${message}</div>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('visible');
    }, 20);

    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  },

  bindEvents() {
    // Open drawer triggers
    document.querySelectorAll('.open-cart-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openDrawer();
      });
    });

    // Close drawer buttons
    const closeBtn = document.getElementById('closeCartDrawerBtn');
    const overlay = document.getElementById('cartDrawerOverlay');
    const continueShoppingBtn = document.getElementById('continueShoppingBtn');

    if (closeBtn) closeBtn.addEventListener('click', () => this.closeDrawer());
    if (overlay) overlay.addEventListener('click', () => this.closeDrawer());
    if (continueShoppingBtn) continueShoppingBtn.addEventListener('click', () => this.closeDrawer());

    // WhatsApp checkout button
    const checkoutBtn = document.getElementById('whatsappCheckoutBtn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => this.checkoutViaWhatsApp());
    }

    // ESC key closes drawer
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeDrawer();
    });
  }
};

window.Cart = Cart;
