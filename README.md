# 🌸 The Veda Luxury - Handcrafted Festive E-Commerce

> **"Thoughtful Gifts, Beautiful Memories"** • Curated by **Viraj Patidar**

A boutique e-commerce web platform built with pure HTML, CSS, and modern JavaScript. Inspired by the soft blush pink, rose gold, and royal maroon aesthetics of *The Veda Luxury*, this application features occasion-based handcrafted collections, a zero-login WhatsApp checkout workflow, and an admin management portal.

---

## 🌟 Key Highlights & Features

1. **Brand Aesthetics & Design**:
   - Color palette drawn directly from brand posters: soft blush pink (`#FFF2F2`), ivory cream (`#FAF4F0`), warm rose gold (`#C59358`), and deep royal burgundy (`#521927`).
   - High-end typography (`Cormorant Garamond` serif & `Outfit` modern sans-serif).
   - Bespoke imagery for Raksha Bandhan, Luxury Hampers, Diwali Diyas, and Eco-Friendly Ganesh Murti.

2. **Occasion-Based Handcrafted Collections**:
   - **🧵 Rakhi Collection**: Single Rakhis (Simple ₹20, Designer ₹50, Premium ₹100, Aesthetic ₹150, Resin ₹200), Rakhi Bunch Packs of 12 (₹150), and Rakhi Hampers with Roli & Chawal.
   - **🎁 Luxury Hamper Collection**: 01 Mini Hamper (₹150), 02 Luxury Blue Hamper (₹250), 03 Charm Hamper (₹300), 04 Delight Hamper (₹350), 05 Signature Hamper (₹499), and 06 Premium Luxury Hamper (₹599).
   - **🪔 Diwali Special**: Handmade painted terracotta clay diyas, brass finish floral lamps, and Shubh Labh hampers.
   - **🌱 Ganesh Sthapna**: 100% natural clay eco-friendly Ganesha idols & plantable seed idols for green home visarjan.

3. **🛍️ Zero-Login WhatsApp Checkout**:
   - Customers don't need passwords or signups.
   - Users browse, select quantities, and add items to the cart drawer.
   - Clicking **"Complete Order on WhatsApp"** formats a full itemized order receipt with customer name, contact phone, delivery address, and custom gift note, and opens WhatsApp directly to chat with **Viraj Patidar**.
   - Includes 1-Click **"Buy Now"** directly on each product card.

4. **⚙️ Admin Management Portal (`admin.html`)**:
   - Default Admin Passcode: `veda123` (customizable).
   - **Upload & Add Products**: Name, Category, Price, MRP, Stock Quantity, Occasion, Tag/Badge, Eco-Friendly toggle, and Description.
   - **Image Support**: Upload an image directly from phone/laptop (auto-converted to Base64) or provide an image URL/asset path.
   - **Manage Inventory**: Edit prices, update stock levels, or delete items.
   - **WhatsApp Phone Settings**: Live update the recipient WhatsApp number where all orders and inquiries are sent.
   - **Restore Defaults**: One-click restore to original flyer catalog.

5. **Crafting Showcase & Social Integration**:
   - Responsive YouTube video showcase embedding the artisan crafting process.
   - Direct Instagram integration (`@thevedaluxury`).
   - Floating WhatsApp quick-chat widget.

---

## 🚀 How to Run Locally

### Option 1: Using the Built-in Node Server
```bash
npm start
```
Then visit `http://localhost:3000` in your web browser.

### Option 2: Open Directly in Any Browser
Double-click `index.html` or open it with Live Server.

---

## ☁️ How to Deploy on Render (Step-by-Step)

You can deploy this project on [Render.com](https://render.com) for free in under 2 minutes:

### Method A: Deploy as a **Static Site** (Recommended & Free)
1. Push this repository to your GitHub or GitLab account.
2. Log into [Render Dashboard](https://dashboard.render.com).
3. Click **"New +"** and choose **"Static Site"**.
4. Connect your repository.
5. In the settings:
   - **Name**: `the-veda-luxury`
   - **Branch**: `main`
   - **Build Command**: *(leave empty or put `echo 'Static ready'`)*
   - **Publish Directory**: `.` *(a single dot representing root)*
6. Click **"Create Static Site"**.
7. Render will provide a live URL (e.g. `https://the-veda-luxury.onrender.com`).

### Method B: Deploy as a **Web Service** (Node.js)
1. In Render Dashboard, click **"New +"** and choose **"Web Service"**.
2. Connect your repository.
3. In the settings:
   - **Runtime**: `Node`
   - **Build Command**: `npm install` *(or leave blank since zero dependencies are needed)*
   - **Start Command**: `npm start`
4. Click **"Create Web Service"**.

---

## 📁 File Structure
```
├── index.html            # Main storefront (Home, Shop, Cart, Video, Contact)
├── admin.html            # Admin management portal
├── server.js             # Lightweight zero-dependency HTTP server
├── package.json          # Project metadata and start scripts
├── README.md             # Documentation and deployment guide
├── css/
│   └── style.css         # Bespoke styling and responsive design
├── js/
│   ├── products.js       # Catalog database & localStorage manager
│   ├── cart.js           # Cart state & WhatsApp message generator
│   ├── app.js            # Main storefront interactivity & live search
│   └── admin.js          # Admin dashboard, uploads, and store config
└── assets/
    ├── logo.png                     # The Veda Luxury circular logo
    ├── rakhi-collection-banner.png  # Rakhi Collection menu flyer
    ├── hamper-collection-banner.png # Luxury Hamper menu flyer
    ├── aesthetic-rakhi.jpg          # Product photography
    ├── rakhi-bunch.jpg              # Set of 12 bunch rakhis
    ├── blue-hamper.jpg              # Luxury blue hamper
    ├── luxury-hamper.jpg            # Classic gift hamper
    ├── diwali-diyas.jpg             # Handcrafted clay diyas
    └── ganesh-murti.jpg             # Eco-friendly clay Ganesha idol
```

---

## 📞 Contact Information
- **Brand**: The Veda Luxury
- **Creative Curator**: Viraj Patidar
- **WhatsApp**: Configured in store settings
- **Instagram**: `@thevedaluxury`
