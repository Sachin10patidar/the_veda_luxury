/**
 * The Veda Luxury - Admin Management Portal Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  Admin.init();
});

const Admin = {
  editingProductId: null,
  uploadedImageBase64: null,
  uploadedCloudinaryUrl: null,

  init() {
    this.checkAuth();
    this.bindEvents();
  },

  checkAuth() {
    const isAuthed = sessionStorage.getItem('veda_admin_authed') === 'true';
    const loginSection = document.getElementById('adminLoginSection');
    const dashboardSection = document.getElementById('adminDashboardSection');

    if (isAuthed) {
      if (loginSection) loginSection.style.display = 'none';
      if (dashboardSection) dashboardSection.style.display = 'block';
      this.loadDashboardData();
    } else {
      if (loginSection) loginSection.style.display = 'flex';
      if (dashboardSection) dashboardSection.style.display = 'none';
    }
  },

  login(pinInput) {
    const config = StoreManager.getConfig();
    const correctPin = config.adminPin || "veda123";

    if (pinInput === correctPin) {
      sessionStorage.setItem('veda_admin_authed', 'true');
      this.checkAuth();
      this.showToast("Welcome to The Veda Luxury Admin Dashboard!", "success");
    } else {
      alert("Invalid Admin Passcode! Please try again.");
    }
  },

  logout() {
    sessionStorage.removeItem('veda_admin_authed');
    this.checkAuth();
  },

  loadDashboardData() {
    this.loadStats();
    this.loadSettingsForm();
    this.renderProductsTable();
  },

  loadStats() {
    const products = StoreManager.getProducts();
    const config = StoreManager.getConfig();

    const totalCount = products.length;
    const totalInventory = products.reduce((sum, p) => sum + (Number(p.quantity) || 0), 0);
    const catalogValue = products.reduce((sum, p) => sum + (Number(p.price) * (Number(p.quantity) || 0)), 0);

    const elTotalProds = document.getElementById('statTotalProducts');
    const elTotalStock = document.getElementById('statTotalStock');
    const elCatalogVal = document.getElementById('statCatalogValue');
    const elPhone = document.getElementById('statWhatsappPhone');

    if (elTotalProds) elTotalProds.textContent = totalCount;
    if (elTotalStock) elTotalStock.textContent = totalInventory.toLocaleString('en-IN');
    if (elCatalogVal) elCatalogVal.textContent = "₹" + catalogValue.toLocaleString('en-IN');
    if (elPhone) elPhone.textContent = config.whatsappNumber;
  },

  loadSettingsForm() {
    const config = StoreManager.getConfig();

    const inputName = document.getElementById('settingContactPerson');
    const inputPhone = document.getElementById('settingWhatsappNumber');
    const inputInsta = document.getElementById('settingInstagramHandle');
    const inputYoutube = document.getElementById('settingYoutubeVideoId');
    const inputPin = document.getElementById('settingAdminPin');
    const inputCloudName = document.getElementById('settingCloudinaryName');
    const inputCloudPreset = document.getElementById('settingCloudinaryPreset');

    if (inputName) inputName.value = config.contactPerson || "Viraj Patidar";
    if (inputPhone) inputPhone.value = config.whatsappNumber || "+919876543210";
    if (inputInsta) inputInsta.value = config.instagramHandle || "thevedaluxury";
    if (inputYoutube) inputYoutube.value = config.youtubeVideoId || "ScMzIvxBSi4";
    if (inputCloudName) inputCloudName.value = config.cloudinaryCloudName || "";
    if (inputCloudPreset) inputCloudPreset.value = config.cloudinaryUploadPreset || "";
    if (inputPin) inputPin.value = "";
  },

  saveSettings(e) {
    e.preventDefault();
    const config = StoreManager.getConfig();

    config.contactPerson = document.getElementById('settingContactPerson').value.trim() || "Viraj Patidar";
    config.whatsappNumber = document.getElementById('settingWhatsappNumber').value.trim() || "+919876543210";
    config.instagramHandle = document.getElementById('settingInstagramHandle').value.trim() || "thevedaluxury";
    config.instagramUrl = `https://instagram.com/${config.instagramHandle}`;
    config.youtubeVideoId = document.getElementById('settingYoutubeVideoId').value.trim() || "ScMzIvxBSi4";

    const cloudNameInput = document.getElementById('settingCloudinaryName');
    const cloudPresetInput = document.getElementById('settingCloudinaryPreset');
    config.cloudinaryCloudName = cloudNameInput ? cloudNameInput.value.trim() : "";
    config.cloudinaryUploadPreset = cloudPresetInput ? cloudPresetInput.value.trim() : "";
    
    const newPin = document.getElementById('settingAdminPin').value.trim();
    if (newPin) {
      config.adminPin = newPin;
    }

    StoreManager.saveConfig(config);
    this.loadStats();
    this.showToast("Settings updated successfully!", "success");
  },

  renderProductsTable(filterText = '') {
    const tbody = document.getElementById('adminProductsTableBody');
    if (!tbody) return;

    let products = StoreManager.getProducts();

    if (filterText.trim()) {
      const q = filterText.toLowerCase().trim();
      products = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q) ||
        (p.occasion && p.occasion.toLowerCase().includes(q))
      );
    }

    if (products.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 2rem; color: #888;">
            No products found. Add a new product using the form above.
          </td>
        </tr>
      `;
      return;
    }

    let html = '';
    products.forEach((p, index) => {
      html += `
        <tr>
          <td><span class="row-num">${index + 1}</span></td>
          <td>
            <div class="table-prod-cell">
              <img src="${p.image}" alt="${p.name}" class="table-prod-img" onerror="this.src='assets/logo.png'">
              <div>
                <strong>${p.name}</strong>
                <div class="table-subtext">${p.tag || ''} ${p.ecoFriendly ? '• 🌱 Eco' : ''}</div>
              </div>
            </div>
          </td>
          <td><span class="category-pill">${p.categoryLabel}</span></td>
          <td>
            <strong>₹${p.price}</strong>
            ${p.originalPrice > p.price ? `<span class="table-mrp">₹${p.originalPrice}</span>` : ''}
          </td>
          <td>
            <span class="stock-pill ${p.quantity <= 10 ? 'stock-low' : 'stock-ok'}">
              ${p.quantity} units
            </span>
          </td>
          <td>${p.occasion || 'General'}</td>
          <td>
            <div class="table-actions">
              <button type="button" class="btn-action edit-btn" onclick="Admin.openEditModal('${p.id}')" title="Edit product">
                ✏️ Edit
              </button>
              <button type="button" class="btn-action delete-btn" onclick="Admin.deleteProduct('${p.id}', this)" title="Delete product">
                🗑️
              </button>
            </div>
          </td>
        </tr>
      `;
    });

    tbody.innerHTML = html;
  },

  async handleImageUpload(fileInput) {
    const file = fileInput.files[0];
    if (!file) return;

    // Allow images up to 10MB (Cloudinary supported limit)
    if (file.size > 10 * 1024 * 1024) {
      alert("Image is larger than 10MB. Please choose an image under 10MB.");
      return;
    }

    const statusEl = document.getElementById('imageUploadStatus');
    const previewEl = document.getElementById('productImagePreview');
    const urlInput = document.getElementById('prodImageUrl');

    const config = StoreManager.getConfig();
    const cloudName = (config.cloudinaryCloudName || document.getElementById('settingCloudinaryName')?.value || "imeeobej").trim();
    const cloudPreset = (config.cloudinaryUploadPreset || document.getElementById('settingCloudinaryPreset')?.value || "veda_preset").trim();

    if (statusEl) {
      statusEl.style.display = 'block';
      statusEl.innerHTML = `<span style="color: var(--color-primary); font-weight: 600;">☁️ Uploading image to Cloudinary (${cloudName})... Please wait.</span>`;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      let imageToUpload = e.target.result;

      // Auto-optimize image on canvas if larger than 1800px or >1MB
      try {
        const img = new Image();
        img.src = e.target.result;
        await new Promise(resolve => { img.onload = resolve; });

        const maxDimension = 1800;
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension || file.size > 1024 * 1024) {
          if (width > height) {
            if (width > maxDimension) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            }
          } else {
            if (height > maxDimension) {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          imageToUpload = canvas.toDataURL('image/jpeg', 0.88);
        }
      } catch (optErr) {
        console.warn("Canvas optimization skipped:", optErr);
      }

      this.uploadedImageBase64 = imageToUpload;
      if (previewEl) {
        previewEl.src = imageToUpload;
        previewEl.style.display = 'block';
      }

      // Immediately upload to Cloudinary
      try {
        const formData = new FormData();
        formData.append('file', imageToUpload);
        formData.append('upload_preset', cloudPreset);

        const cRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: formData
        });

        if (cRes.ok) {
          const cData = await cRes.json();
          if (cData.secure_url) {
            this.uploadedCloudinaryUrl = cData.secure_url;
            if (urlInput) urlInput.value = cData.secure_url;
            if (previewEl) previewEl.src = cData.secure_url;
            if (statusEl) {
              statusEl.innerHTML = `<span style="color: #27ae60; font-weight: 700;">✅ Uploaded to Cloudinary!</span> <a href="${cData.secure_url}" target="_blank" style="color: var(--color-primary); text-decoration: underline; margin-left: 0.5rem; font-size: 0.78rem;">View Link ↗</a>`;
            }
            this.showToast("Image uploaded to Cloudinary successfully!", "success");
            console.log("✅ Cloudinary direct upload success:", cData.secure_url);
            return;
          }
        } else {
          const errData = await cRes.json().catch(() => ({}));
          console.warn("Cloudinary upload failed:", errData);
          if (statusEl) {
            statusEl.innerHTML = `<span style="color: #e74c3c;">⚠️ Cloudinary upload issue: ${errData.error?.message || 'Check preset'}. Will save via server backup.</span>`;
          }
        }
      } catch (cErr) {
        console.warn("Cloudinary fetch error:", cErr);
        if (statusEl) {
          statusEl.innerHTML = `<span style="color: #e74c3c;">⚠️ Upload error: ${cErr.message}. Will save via server backup.</span>`;
        }
      }
    };
    reader.readAsDataURL(file);
  },

  async saveProductForm(e) {
    e.preventDefault();

    const name = document.getElementById('prodName').value.trim();
    const category = document.getElementById('prodCategory').value;
    const price = parseFloat(document.getElementById('prodPrice').value);
    const originalPrice = parseFloat(document.getElementById('prodOriginalPrice').value) || (price + 40);
    const quantity = parseInt(document.getElementById('prodQuantity').value, 10) || 10;
    const occasion = document.getElementById('prodOccasion').value.trim();
    const tag = document.getElementById('prodTag').value.trim();
    const badge = document.getElementById('prodBadge').value.trim();
    const ecoFriendly = document.getElementById('prodEcoFriendly').checked;
    const description = document.getElementById('prodDescription').value.trim();
    const imageUrlInput = document.getElementById('prodImageUrl').value.trim();

    let finalImage = this.uploadedCloudinaryUrl || imageUrlInput || this.uploadedImageBase64 || "assets/luxury-hamper.jpg";

    if (!name || isNaN(price)) {
      alert("Please provide valid product name and price!");
      return;
    }

    const submitBtn = document.getElementById('prodSubmitBtn');
    const originalBtnText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Saving Product...";

    // If image is still a base64 string, upload it to Cloudinary or Server Disk
    if (finalImage.startsWith('data:image/')) {
      const config = StoreManager.getConfig();
      const cloudName = (config.cloudinaryCloudName || document.getElementById('settingCloudinaryName')?.value || "imeeobej").trim();
      const cloudPreset = (config.cloudinaryUploadPreset || document.getElementById('settingCloudinaryPreset')?.value || "veda_preset").trim();

      // 1. Try Cloudinary
      try {
        const formData = new FormData();
        formData.append('file', finalImage);
        formData.append('upload_preset', cloudPreset);

        const cRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: formData
        });
        if (cRes.ok) {
          const cData = await cRes.json();
          if (cData.secure_url) {
            finalImage = cData.secure_url;
            console.log('✅ Image permanently hosted on Cloudinary:', finalImage);
          }
        }
      } catch (cErr) {
        console.warn('Cloudinary upload error:', cErr);
      }

      // 2. Fallback to Server Disk /api/upload if still base64
      if (finalImage.startsWith('data:image/')) {
        try {
          const uploadRes = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              image: finalImage,
              filename: name
            })
          });
          if (uploadRes.ok) {
            const uploadData = await uploadRes.json();
            if (uploadData.url) {
              finalImage = uploadData.url;
              console.log('✅ Image permanently stored on server disk:', finalImage);
            }
          }
        } catch (uploadErr) {
          console.warn('Server upload fallback error:', uploadErr);
        }
      }
    }

    const categoryLabel = StoreManager.getCategoryLabel(category);

    const productPayload = {
      name,
      category,
      categoryLabel,
      price,
      originalPrice,
      quantity,
      occasion,
      tag,
      badge,
      ecoFriendly,
      description,
      image: finalImage
    };

    if (this.editingProductId) {
      // Update existing
      StoreManager.updateProduct(this.editingProductId, productPayload);
      this.showToast(`Updated "${name}" successfully!`, "success");
      this.cancelEdit();
    } else {
      // Add new
      StoreManager.addProduct(productPayload);
      this.showToast(`Added "${name}" to store catalog!`, "success");
      this.resetProductForm();
    }

    this.loadStats();
    this.renderProductsTable();
  },

  openEditModal(productId) {
    const product = StoreManager.getProductById(productId);
    if (!product) return;

    this.editingProductId = product.id;
    this.uploadedImageBase64 = null;

    document.getElementById('formSectionTitle').textContent = `Edit Product: ${product.name}`;
    document.getElementById('prodSubmitBtn').textContent = "Save Changes";
    document.getElementById('cancelEditBtn').style.display = 'inline-block';

    document.getElementById('prodName').value = product.name;
    document.getElementById('prodCategory').value = product.category;
    document.getElementById('prodPrice').value = product.price;
    document.getElementById('prodOriginalPrice').value = product.originalPrice || '';
    document.getElementById('prodQuantity').value = product.quantity;
    document.getElementById('prodOccasion').value = product.occasion || '';
    document.getElementById('prodTag').value = product.tag || '';
    document.getElementById('prodBadge').value = product.badge || '';
    document.getElementById('prodEcoFriendly').checked = Boolean(product.ecoFriendly);
    document.getElementById('prodDescription').value = product.description || '';

    const previewEl = document.getElementById('productImagePreview');
    if (previewEl) {
      previewEl.src = product.image;
      previewEl.style.display = 'block';
    }

    // Scroll form into view
    document.getElementById('productFormCard').scrollIntoView({ behavior: 'smooth' });
  },

  cancelEdit() {
    this.editingProductId = null;
    this.uploadedImageBase64 = null;
    this.uploadedCloudinaryUrl = null;
    this.resetProductForm();

    document.getElementById('formSectionTitle').textContent = "Upload & Add New Product";
    document.getElementById('prodSubmitBtn').textContent = "Add Product to Store";
    document.getElementById('cancelEditBtn').style.display = 'none';
  },

  deleteProduct(productId, btnElement) {
    const product = StoreManager.getProductById(productId);
    const prodName = product ? product.name : "this product";

    const confirmed = confirm(`Are you sure you want to delete "${prodName}"?`);
    if (!confirmed) return;

    // 1. Immediately delete from data storage
    StoreManager.deleteProduct(productId);

    // 2. Instantly animate and remove the row from the DOM
    const row = btnElement ? btnElement.closest('tr') : document.querySelector(`button[onclick*="${productId}"]`)?.closest('tr');
    if (row) {
      row.style.transition = 'all 0.25s ease';
      row.style.opacity = '0';
      row.style.transform = 'translateX(-20px)';
      setTimeout(() => {
        row.remove();
        // Re-number remaining rows in view
        document.querySelectorAll('#adminProductsTableBody tr').forEach((r, idx) => {
          const numSpan = r.querySelector('.row-num');
          if (numSpan) numSpan.textContent = idx + 1;
        });
        // If all items removed, render empty state
        const remaining = document.querySelectorAll('#adminProductsTableBody tr');
        if (remaining.length === 0) {
          const tbody = document.getElementById('adminProductsTableBody');
          if (tbody) {
            tbody.innerHTML = `
              <tr>
                <td colspan="7" style="text-align: center; padding: 2rem; color: #888;">
                  No products found. Add a new product using the form above.
                </td>
              </tr>
            `;
          }
        }
      }, 250);
    } else {
      this.renderProductsTable();
    }

    // 3. Update dashboard counters & show toast
    this.loadStats();
    this.showToast(`Product "${prodName}" deleted successfully!`, "info");
  },

  resetProductForm() {
    document.getElementById('productForm').reset();
    this.uploadedImageBase64 = null;
    this.uploadedCloudinaryUrl = null;
    const previewEl = document.getElementById('productImagePreview');
    if (previewEl) {
      previewEl.src = '';
      previewEl.style.display = 'none';
    }
    const statusEl = document.getElementById('imageUploadStatus');
    if (statusEl) {
      statusEl.style.display = 'none';
      statusEl.innerHTML = '';
    }
    const submitBtn = document.getElementById('prodSubmitBtn');
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = this.editingProductId ? "Save Changes" : "Add Product to Store";
    }
  },

  restoreDefaults() {
    const confirmed = confirm("Are you sure you want to reset the store catalog and configuration to the default flyer items?");
    if (confirmed) {
      StoreManager.resetToDefaults();
      this.showToast("Catalog restored to default flyer items!", "success");
      this.loadDashboardData();
    }
  },

  showToast(message, type = "info") {
    let container = document.getElementById('adminToastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'adminToastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast-pill toast-${type}`;
    toast.innerHTML = `<div class="toast-content">${message}</div>`;
    container.appendChild(toast);

    setTimeout(() => toast.classList.add('visible'), 20);
    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  },

  bindEvents() {
    // Login form
    const loginForm = document.getElementById('adminLoginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const pin = document.getElementById('adminPinInput').value.trim();
        this.login(pin);
      });
    }

    // Logout
    const logoutBtn = document.getElementById('adminLogoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => this.logout());
    }

    // Product Form Submit
    const prodForm = document.getElementById('productForm');
    if (prodForm) {
      prodForm.addEventListener('submit', (e) => this.saveProductForm(e));
    }

    // Image File Upload Change
    const fileInput = document.getElementById('prodImageFile');
    if (fileInput) {
      fileInput.addEventListener('change', (e) => this.handleImageUpload(e.target));
    }

    // Image URL change preview
    const urlInput = document.getElementById('prodImageUrl');
    if (urlInput) {
      urlInput.addEventListener('input', (e) => {
        if (!this.uploadedImageBase64 && e.target.value.trim()) {
          const previewEl = document.getElementById('productImagePreview');
          if (previewEl) {
            previewEl.src = e.target.value.trim();
            previewEl.style.display = 'block';
          }
        }
      });
    }

    // Cancel edit button
    const cancelBtn = document.getElementById('cancelEditBtn');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => this.cancelEdit());
    }

    // Settings Form
    const settingsForm = document.getElementById('adminSettingsForm');
    if (settingsForm) {
      settingsForm.addEventListener('submit', (e) => this.saveSettings(e));
    }

    // Reset Defaults Button
    const resetBtn = document.getElementById('restoreDefaultsBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.restoreDefaults());
    }

    // Table Filter Search
    const searchTableInput = document.getElementById('adminSearchProducts');
    if (searchTableInput) {
      searchTableInput.addEventListener('input', (e) => {
        this.renderProductsTable(e.target.value);
      });
    }

    // Export Backup
    const exportBtn = document.getElementById('exportBackupBtn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        StoreManager.exportBackup();
        this.showToast("Store backup JSON downloaded!", "success");
      });
    }

    // Import Backup
    const importInput = document.getElementById('importBackupFile');
    if (importInput) {
      importInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
          const success = StoreManager.importBackup(event.target.result);
          if (success) {
            this.showToast("Catalog backup restored successfully!", "success");
            this.loadDashboardData();
          } else {
            alert("Invalid backup file format!");
          }
        };
        reader.readAsText(file);
      });
    }
  }
};

window.Admin = Admin;
