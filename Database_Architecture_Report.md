# Project Architecture & Database Report: ArtsAdobe E-Commerce Platform

## 1. Project Overview
**ArtsAdobe** is a premium, modern e-commerce platform dedicated to showcasing and selling authentic Indian handcrafted artifacts, including Wall Art, Mirrors, Clocks, Tables, and Pottery. The platform provides a rich 3D-enhanced UI/UX on the frontend and a robust, secure, and highly scalable backend infrastructure.

## 2. Technology Stack
*   **Frontend**: React.js (Vite), Tailwind CSS, Zustand (State Management), React Router.
*   **Backend**: Node.js, Express.js.
*   **Database**: MongoDB (managed via Mongoose ODM).
*   **Security & Utils**: Helmet, CORS, JWT Authentication, Bcrypt.

---

## 3. Database Architecture (MongoDB)
The core focus of the backend architecture is the **MongoDB database layer**. It is designed for production readiness, focusing on data integrity, atomic concurrency, and performance optimization.

### 3.1 Connection & Resilience
The database connection (`backend/config/db.js`) is engineered to be fault-tolerant. 
*   **Retry Logic**: Automatically attempts to reconnect up to 5 times if the initial connection fails.
*   **Timeouts**: Configured with strict server selection and socket timeouts to prevent hanging queries.
*   **Graceful Shutdown**: Intercepts `SIGINT` (server termination) to cleanly close the MongoDB connection, preventing data corruption.

### 3.2 Schema Design & Models
The data layer utilizes strict Mongoose schemas with built-in validation, defaulting, and security constraints.

1.  **User Model**: Manages customer and admin profiles. Includes embedded address schemas, role-based access control, and password hashing indicators.
2.  **Product Model**: The core catalog schema. It includes comprehensive fields for specifications, inventory tracking, artisan details, and shipping metadata. 
3.  **Order Model**: Manages the checkout lifecycle. It embeds historical product data (to prevent price-change anomalies), tracks shipping/billing addresses, and maintains a strict `statusHistory` array.
4.  **Review Model**: Connects Users, Products, and Orders. Enforces limits on ratings (1-5) and tracks verified purchases.
5.  **ContactSubmission Model**: Securely stores inquiries from the frontend "Contact Us" form, tracking the status of customer service tickets.

### 3.3 Security & Data Sanitization
*   **Soft Deletes**: Instead of permanently destroying data, records use an `isDeleted` flag. A global Mongoose query middleware automatically filters out deleted records from all `find()` queries.
*   **JSON Transforms**: All schemas override the `toJSON` method to automatically strip sensitive internal fields (like `__v`, `_id`, `password`, and `stripeId`) before data is sent to the frontend.

---

## 4. Key Database Features & Important Code

### 4.1 Atomic Checkout Transactions (ACID Compliance)
In an e-commerce platform, if two users try to buy the last remaining item at the exact same millisecond, a race condition occurs. We solved this using **MongoDB ACID Transactions** and atomic `$inc` operators.

```javascript
// backend/controllers/orderController.js (Atomic Checkout Snippet)

// Find product and atomically decrement stock ONLY IF stock >= requested qty.
// This is the absolute safest way to handle concurrent inventory deductions in MongoDB.
const updatedProduct = await Product.findOneAndUpdate(
  { 
    _id: item.productId, 
    'inventory.stock': { $gte: item.qty }, // Concurrency lock
    isDeleted: false,
    status: 'active'
  },
  { 
    $inc: { 'inventory.stock': -item.qty } // Deduct inventory atomically
  },
  { 
    new: true, 
    session // MUST pass session to bind this update to the transaction
  }
);

if (!updatedProduct) {
  // Triggers transaction rollback if stock is insufficient
  throw new Error(`Insufficient stock for ID: ${item.productId}`);
}
```

### 4.2 Automated Indexing strategy
Indexes are crucial for database read performance. We defined compound and text indexes directly within the schemas.
*   `Product`: `{ category: 1, price: 1 }` (Compound), and a Text Index on `name + description + tags` for fast searching.
*   `Order`: `{ user: 1, createdAt: -1 }` (Optimized for user order history lookups).

To safely apply these to the database without locking the production server, we created a dedicated synchronization script:
```javascript
// backend/scripts/syncIndexes.js (Snippet)
const syncDatabaseIndexes = async () => {
    // Connects to DB, compares Schema indexes with existing DB indexes, 
    // and drops/builds as necessary.
    await User.syncIndexes();
    await Product.syncIndexes();
    await Order.syncIndexes();
    await Review.syncIndexes();
    await ContactSubmission.syncIndexes();
};
```

### 4.3 Pre-Save Hooks
Mongoose pre-save hooks are used to automate data formatting before it hits the database. For example, automatically generating URL-friendly slugs for products:
```javascript
// backend/models/Product.js (Pre-save hook)
productSchema.pre('validate', function(next) {
  if (this.name && !this.slug) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }
  next();
});
```

## 5. Conclusion
The **ArtsAdobe** MongoDB architecture provides a highly secure, performant, and reliable foundation. By utilizing advanced Mongoose features—like transaction sessions, global query middleware, embedded sub-documents, and strict schema validation—the platform guarantees data integrity during high-traffic e-commerce operations.
