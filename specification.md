# ARTIFACT SHOWCASE E-COMMERCE PLATFORM
## Complete Project Specification Document

**Project Name:** ArtisanAbode - Curated Home Artifacts Marketplace  
**Version:** 1.0  
**Date:** April 2026  
**Tech Stack:** MERN (MongoDB, Express, React, Node.js)

---

## TABLE OF CONTENTS

1. Executive Summary
2. Project Objectives
3. Technical Architecture
4. Database Schema Design
5. Backend API Specification
6. Frontend Architecture
7. Feature Requirements
8. User Stories
9. Security Requirements
10. Deployment Strategy
11. Development Roadmap
12. Testing Strategy
13. Success Metrics

---

## 1. EXECUTIVE SUMMARY

### 1.1 Project Vision
Build a premium e-commerce platform specializing in curated home showcase artifacts including sculptures, wall art, ceramics, textiles, and decorative pieces. The platform connects artisan creators with interior designers, homeowners, and collectors.

### 1.2 Core Value Proposition
- **Authenticity:** Verified artisan profiles with storytelling
- **Quality:** High-resolution imagery and detailed specifications
- **Discovery:** Advanced filtering and search capabilities
- **Trust:** Secure payments and transparent order tracking
- **Community:** Review system and artisan engagement

---

## 2. PROJECT OBJECTIVES

### 2.1 Functional Objectives
- [ ] User registration and authentication (JWT-based)
- [ ] Product catalog with advanced search/filter
- [ ] Shopping cart and checkout flow
- [ ] Stripe payment integration
- [ ] Order management and tracking
- [ ] Admin dashboard for inventory management
- [ ] Review and rating system
- [ ] Wishlist functionality
- [ ] Responsive design (mobile-first)

### 2.2 Non-Functional Objectives
- [ ] Page load time < 3 seconds
- [ ] 99.9% uptime SLA
- [ ] PCI DSS compliance for payments
- [ ] GDPR-compliant data handling
- [ ] SEO optimization
- [ ] Accessibility (WCAG 2.1 AA)

---

## 3. TECHNICAL ARCHITECTURE

### 3.1 Technology Stack

**Frontend:**
- React 18+ with Vite
- React Router v6
- TailwindCSS for styling
- Zustand for state management
- React Query (TanStack Query) for data fetching
- Axios for HTTP requests
- React Hook Form + Zod for validation
- React Hot Toast for notifications

**Backend:**
- Node.js 20+ LTS
- Express.js 4.x
- MongoDB 7.x with Mongoose ODM
- JWT for authentication
- bcryptjs for password hashing
- Zod/Joi for validation
- Winston + Morgan for logging
- CORS configuration
- Helmet for security headers
- Express Rate Limit

**Third-Party Services:**
- MongoDB Atlas (Database)
- Cloudinary (Image Storage & CDN)
- Stripe (Payment Processing)
- Vercel/Netlify (Frontend Hosting)
- Render/Railway (Backend Hosting)

### 3.2 System Architecture Diagram

```
┌─────────────────┐
│   Client Side   │
│  (React + Vite) │
└────────┬────────┘
         │ HTTPS
         ▼
┌─────────────────┐
│   CDN (Vercel)  │
└────────────────┘
         │
         ▼
┌─────────────────┐     ┌──────────────────┐
│  Backend API    │────▶│  MongoDB Atlas   │
│ (Express/Node)  │     │   (Database)     │
└────────┬────────┘     └──────────────────┘
         │
         ├─────▶ ┌──────────────────┐
         │       │  Cloudinary API  │
         │       │  (Image Storage) │
         │       └──────────────────┘
         │
         └─────▶ ┌──────────────────┐
                 │  Stripe API      │
                 │  (Payments)      │
                 └──────────────────┘
```

---

## 4. DATABASE SCHEMA DESIGN

### 4.1 User Schema
```javascript
{
  _id: ObjectId,
  name: {
    firstName: String (required, trim, maxlength: 50),
    lastName: String (required, trim, maxlength: 50)
  },
  email: String (required, unique, lowercase, index),
  password: String (required, minlength: 8),
  phone: String,
  role: String (enum: ['customer', 'admin'], default: 'customer'),
  avatar: {
    url: String,
    publicId: String
  },
  addresses: [{
    label: String (enum: ['home', 'work', 'other']),
    street: String (required),
    city: String (required),
    state: String (required),
    zipCode: String (required),
    country: String (required),
    phone: String,
    isDefault: Boolean (default: false)
  }],
  wishlist: [ObjectId (ref: 'Product')],
  preferences: {
    newsletter: Boolean (default: true),
    notifications: Boolean (default: true)
  },
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### 4.2 Product Schema
```javascript
{
  _id: ObjectId,
  name: String (required, trim, index, maxlength: 200),
  slug: String (unique, required),
  description: String (required),
  shortDescription: String (maxlength: 300),
  price: Number (required, min: 0),
  compareAtPrice: Number,
  category: String (
    enum: [
      'Wall Art',
      'Sculptures',
      'Ceramics',
      'Textiles',
      'Lighting',
      'Mirrors',
      'Vases',
      'Furniture'
    ],
    required,
    index
  ),
  subcategory: String,
  images: [{
    url: String (required),
    publicId: String,
    alt: String,
    isPrimary: Boolean (default: false)
  }],
  specifications: {
    material: String,
    dimensions: {
      height: Number,
      width: Number,
      depth: Number,
      unit: String (enum: ['cm', 'inches'], default: 'cm')
    },
    weight: Number,
    color: String,
    style: String (enum: ['Modern', 'Traditional', 'Bohemian', 'Minimalist', 'Industrial']),
    careInstructions: String
  },
  artisan: {
    name: String (required),
    bio: String,
    location: String,
    yearsOfExperience: Number,
    socialLinks: {
      instagram: String,
      website: String
    }
  },
  inventory: {
    stock: Number (required, default: 0, min: 0),
    sku: String (unique),
    trackInventory: Boolean (default: true),
    allowBackorder: Boolean (default: false)
  },
  shipping: {
    freeShipping: Boolean (default: false),
    shippingWeight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    handlingTime: Number (days)
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  rating: {
    average: Number (default: 0, min: 0, max: 5),
    count: Number (default: 0)
  },
  reviewCount: Number (default: 0),
  isFeatured: Boolean (default: false),
  isActive: Boolean (default: true),
  tags: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### 4.3 Order Schema
```javascript
{
  _id: ObjectId,
  orderNumber: String (unique, required),
  user: ObjectId (ref: 'User', required),
  items: [{
    product: ObjectId (ref: 'Product', required),
    name: String (required),
    sku: String,
    quantity: Number (required, min: 1),
    price: Number (required),
    image: String,
    artisan: String
  }],
  pricing: {
    subtotal: Number (required),
    shipping: Number (default: 0),
    tax: Number (default: 0),
    discount: Number (default: 0),
    total: Number (required)
  },
  shippingAddress: {
    firstName: String (required),
    lastName: String (required),
    street: String (required),
    city: String (required),
    state: String (required),
    zipCode: String (required),
    country: String (required),
    phone: String (required)
  },
  billingAddress: {
    // Same structure as shippingAddress
  },
  payment: {
    method: String (enum: ['card', 'paypal'], default: 'card'),
    stripePaymentIntentId: String,
    status: String (enum: ['pending', 'succeeded', 'failed'], default: 'pending'),
    paidAt: Date
  },
  status: String (
    enum: [
      'pending',
      'confirmed',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
      'refunded'
    ],
    default: 'pending'
  ),
  statusHistory: [{
    status: String,
    timestamp: Date,
    note: String
  }],
  tracking: {
    carrier: String,
    trackingNumber: String,
    trackingUrl: String
  },
  notes: String,
  estimatedDelivery: Date,
  deliveredAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### 4.4 Review Schema
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User', required),
  product: ObjectId (ref: 'Product', required),
  order: ObjectId (ref: 'Order'),
  rating: Number (required, min: 1, max: 5),
  title: String (maxlength: 100),
  comment: String (required, maxlength: 1000),
  images: [{
    url: String,
    publicId: String
  }],
  isVerifiedPurchase: Boolean (default: false),
  helpful: {
    count: Number (default: 0),
    users: [ObjectId (ref: 'User')]
  },
  status: String (enum: ['pending', 'approved', 'rejected'], default: 'pending'),
  createdAt: Date,
  updatedAt: Date
}
```

### 4.5 Cart Schema (Optional - can use localStorage)
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User', required, unique),
  items: [{
    product: ObjectId (ref: 'Product', required),
    quantity: Number (required, min: 1),
    addedAt: Date
  }],
  expiresAt: Date
}
```

---

## 5. BACKEND API SPECIFICATION

### 5.1 Authentication Routes
```
POST   /api/auth/register
  Body: { firstName, lastName, email, password, phone }
  Response: { user, token, message }

POST   /api/auth/login
  Body: { email, password }
  Response: { user, token, message }

GET    /api/auth/me
  Headers: Authorization: Bearer <token>
  Response: { user }

POST   /api/auth/logout
  Headers: Authorization: Bearer <token>
  Response: { message }

POST   /api/auth/forgot-password
  Body: { email }
  Response: { message }

POST   /api/auth/reset-password/:token
  Body: { password }
  Response: { message }

PUT    /api/auth/change-password
  Headers: Authorization: Bearer <token>
  Body: { currentPassword, newPassword }
  Response: { message }
```

### 5.2 Product Routes
```
GET    /api/products
  Query: { search, category, subcategory, minPrice, maxPrice, 
           material, style, sort, page, limit }
  Response: { products, total, page, pages }

GET    /api/products/:id
  Params: id
  Response: { product }

GET    /api/products/slug/:slug
  Params: slug
  Response: { product }

GET    /api/products/featured
  Query: { limit }
  Response: { products }

GET    /api/products/categories
  Response: { categories }

GET    /api/products/related/:id
  Params: id
  Query: { limit }
  Response: { products }

POST   /api/products
  Headers: Authorization: Bearer <token>, Role: admin
  Body: { name, description, price, category, images, ... }
  Response: { product }

PUT    /api/products/:id
  Headers: Authorization: Bearer <token>, Role: admin
  Params: id
  Body: { ...product fields }
  Response: { product }

DELETE /api/products/:id
  Headers: Authorization: Bearer <token>, Role: admin
  Params: id
  Response: { message }

POST   /api/products/:id/upload-image
  Headers: Authorization: Bearer <token>, Role: admin
  Params: id
  FormData: { image }
  Response: { imageUrl, publicId }
```

### 5.3 Cart Routes
```
GET    /api/cart
  Headers: Authorization: Bearer <token>
  Response: { cart, itemCount, subtotal }

POST   /api/cart/add
  Headers: Authorization: Bearer <token>
  Body: { productId, quantity }
  Response: { cart, itemCount, subtotal }

PUT    /api/cart/update/:itemId
  Headers: Authorization: Bearer <token>
  Params: itemId
  Body: { quantity }
  Response: { cart, itemCount, subtotal }

DELETE /api/cart/remove/:itemId
  Headers: Authorization: Bearer <token>
  Params: itemId
  Response: { message }

DELETE /api/cart/clear
  Headers: Authorization: Bearer <token>
  Response: { message }
```

### 5.4 Order Routes
```
POST   /api/orders
  Headers: Authorization: Bearer <token>
  Body: { items, shippingAddress, billingAddress, paymentMethod }
  Response: { order, clientSecret }

GET    /api/orders
  Headers: Authorization: Bearer <token>
  Query: { page, limit, status }
  Response: { orders, total, page, pages }

GET    /api/orders/:id
  Headers: Authorization: Bearer <token>
  Params: id
  Response: { order }

GET    /api/orders/my-orders
  Headers: Authorization: Bearer <token>
  Query: { page, limit }
  Response: { orders, total }

POST   /api/orders/:id/cancel
  Headers: Authorization: Bearer <token>
  Params: id
  Response: { order }

GET    /api/orders/admin/all
  Headers: Authorization: Bearer <token>, Role: admin
  Query: { page, limit, status, dateFrom, dateTo }
  Response: { orders, total, stats }

PUT    /api/orders/admin/:id/status
  Headers: Authorization: Bearer <token>, Role: admin
  Params: id
  Body: { status, trackingNumber, carrier }
  Response: { order }
```

### 5.5 Payment Routes
```
POST   /api/payment/create-intent
  Headers: Authorization: Bearer <token>
  Body: { orderId }
  Response: { clientSecret, orderId }

POST   /api/payment/webhook
  Body: Stripe webhook event
  Response: { received: true }

POST   /api/payment/validate
  Headers: Authorization: Bearer <token>
  Body: { paymentMethodId, orderId }
  Response: { success, message }
```

### 5.6 Review Routes
```
GET    /api/reviews/product/:productId
  Params: productId
  Query: { page, limit, rating }
  Response: { reviews, total, averageRating }

POST   /api/reviews
  Headers: Authorization: Bearer <token>
  Body: { productId, rating, title, comment, images }
  Response: { review }

PUT    /api/reviews/:id
  Headers: Authorization: Bearer <token>
  Params: id
  Body: { rating, title, comment }
  Response: { review }

DELETE /api/reviews/:id
  Headers: Authorization: Bearer <token>
  Params: id
  Response: { message }

POST   /api/reviews/:id/helpful
  Headers: Authorization: Bearer <token>
  Params: id
  Response: { helpfulCount }

GET    /api/reviews/admin/pending
  Headers: Authorization: Bearer <token>, Role: admin
  Response: { reviews }

PUT    /api/reviews/admin/:id/approve
  Headers: Authorization: Bearer <token>, Role: admin
  Params: id
  Response: { review }
```

### 5.7 User Routes
```
GET    /api/users/profile
  Headers: Authorization: Bearer <token>
  Response: { user }

PUT    /api/users/profile
  Headers: Authorization: Bearer <token>
  Body: { firstName, lastName, phone, avatar }
  Response: { user }

GET    /api/users/addresses
  Headers: Authorization: Bearer <token>
  Response: { addresses }

POST   /api/users/addresses
  Headers: Authorization: Bearer <token>
  Body: { label, street, city, state, zipCode, country, phone }
  Response: { address }

PUT    /api/users/addresses/:id
  Headers: Authorization: Bearer <token>
  Params: id
  Body: { ...address fields }
  Response: { address }

DELETE /api/users/addresses/:id
  Headers: Authorization: Bearer <token>
  Params: id
  Response: { message }

PUT    /api/users/addresses/:id/set-default
  Headers: Authorization: Bearer <token>
  Params: id
  Response: { addresses }

GET    /api/users/wishlist
  Headers: Authorization: Bearer <token>
  Response: { products }

POST   /api/users/wishlist/:productId
  Headers: Authorization: Bearer <token>
  Params: productId
  Response: { wishlist }

DELETE /api/users/wishlist/:productId
  Headers: Authorization: Bearer <token>
  Params: productId
  Response: { message }
```

### 5.8 Admin Routes
```
GET    /api/admin/dashboard/stats
  Headers: Authorization: Bearer <token>, Role: admin
  Response: { 
    totalRevenue, 
    totalOrders, 
    totalProducts, 
    totalUsers,
    recentOrders,
    topProducts,
    lowStockProducts
  }

GET    /api/admin/users
  Headers: Authorization: Bearer <token>, Role: admin
  Query: { page, limit, role }
  Response: { users, total }

PUT    /api/admin/users/:id/role
  Headers: Authorization: Bearer <token>, Role: admin
  Params: id
  Body: { role }
  Response: { user }

DELETE /api/admin/users/:id
  Headers: Authorization: Bearer <token>, Role: admin
  Params: id
  Response: { message }

GET    /api/admin/analytics/sales
  Headers: Authorization: Bearer <token>, Role: admin
  Query: { period, startDate, endDate }
  Response: { salesData }
```

---

## 6. FRONTEND ARCHITECTURE

### 6.1 Folder Structure
```
src/
├── assets/
│   ├── images/
│   ├── icons/
│   └── fonts/
├── components/
│   ├── common/
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Modal.jsx
│   │   ├── Loader.jsx
│   │   ├── ErrorBoundary.jsx
│   │   └── SEO.jsx
│   ├── layout/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── Navigation.jsx
│   │   └── Sidebar.jsx
│   ├── product/
│   │   ├── ProductCard.jsx
│   │   ├── ProductGrid.jsx
│   │   ├── ProductList.jsx
│   │   ├── ProductImages.jsx
│   │   ├── ProductDetails.jsx
│   │   ├── ProductReviews.jsx
│   │   └── RelatedProducts.jsx
│   ├── cart/
│   │   ├── CartItem.jsx
│   │   ├── CartSummary.jsx
│   │   └── CartSidebar.jsx
│   ├── checkout/
│   │   ├── CheckoutForm.jsx
│   │   ├── ShippingForm.jsx
│   │   ├── PaymentForm.jsx
│   │   └── OrderSummary.jsx
│   ├── user/
│   │   ├── LoginForm.jsx
│   │   ├── RegisterForm.jsx
│   │   ├── ProfileForm.jsx
│   │   ├── AddressForm.jsx
│   │   └── OrderHistory.jsx
│   └── admin/
│       ├── Dashboard.jsx
│       ├── ProductTable.jsx
│       ├── OrderTable.jsx
│       └── Analytics.jsx
├── pages/
│   ├── Home.jsx
│   ├── Shop.jsx
│   ├── ProductDetail.jsx
│   ├── Cart.jsx
│   ├── Checkout.jsx
│   ├── OrderConfirmation.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Profile.jsx
│   ├── Orders.jsx
│   ├── Wishlist.jsx
│   ├── About.jsx
│   ├── Contact.jsx
│   ├── AdminDashboard.jsx
│   ├── AdminProducts.jsx
│   ├── AdminOrders.jsx
│   └── NotFound.jsx
├── hooks/
│   ├── useAuth.js
│   ├── useCart.js
│   ├── useWishlist.js
│   ├── useProducts.js
│   ├── useOrders.js
│   └── useDebounce.js
├── services/
│   ├── api.js
│   ├── authService.js
│   ├── productService.js
│   ├── orderService.js
│   ├── paymentService.js
│   └── uploadService.js
├── store/
│   ├── authStore.js
│   ├── cartStore.js
│   ├── productStore.js
│   └── uiStore.js
├── utils/
│   ├── validators.js
│   ├── formatters.js
│   ├── constants.js
│   ├── helpers.js
│   └── toast.js
├── context/
│   └── ThemeContext.jsx (optional)
├── App.jsx
├── main.jsx
└── index.css
```

### 6.2 State Management (Zustand)

**Cart Store:**
```javascript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1) => {
        const items = get().items;
        const existingItem = items.find(item => item._id === product._id);
        
        if (existingItem) {
          set({
            items: items.map(item =>
              item._id === product._id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          });
        } else {
          set({ items: [...items, { ...product, quantity }] });
        }
      },
      removeItem: (productId) => {
        set({ items: get().items.filter(item => item._id !== productId) });
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map(item =>
            item._id === productId ? { ...item, quantity } : item
          )
        });
      },
      clearCart: () => set({ items: [] }),
      getCartTotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      }
    }),
    { name: 'cart-storage' }
  )
);
```

**Auth Store:**
```javascript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => set({ 
        user, 
        token, 
        isAuthenticated: true 
      }),
      logout: () => set({ 
        user: null, 
        token: null, 
        isAuthenticated: false 
      }),
      updateUser: (userData) => set({ user: userData })
    }),
    { name: 'auth-storage' }
  )
);
```

### 6.3 API Service Configuration
```javascript
// services/api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```
