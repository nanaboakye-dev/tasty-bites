# 🍔 Tasty Bites  
**A full-stack food delivery web application built with the MERN stack + Stripe.**  
Customers can browse food items, add to cart, place orders, and pay securely.  
Admins can manage menu items, orders, and workers through a secure dashboard.

---

## 🚀 Live Demo (Coming Soon)  
Deployment will be added after testing and final checks.

---

# 🛠 Tech Stack

### **Frontend**
- React.js  
- Tailwind CSS (fully styled, interactive UI)  
- React Router  
- Context API (auth + global state)  

### **Backend**
- Node.js  
- Express.js  
- MongoDB + Mongoose  
- JWT Authentication  
- Stripe Checkout + Webhooks  

---

# ✨ Features

## 👤 **User Features**
- Create account & login  
- Browse menu (with default & admin-added items)  
- Add to cart (localStorage persistent)  
- Choose **Delivery** or **Pickup**  
- Checkout using **Stripe**  
- View past orders  
- Mobile-friendly and responsive (DoorDash-style UI)

---

## 🔐 **Admin Features**
Accessible only to accounts created with `ADMIN_SECRET`.

- Admin Login / Register  
- View dashboard with overall stats  
- Manage menu (add/remove items)  
- View all orders  
- Change order status (Pending → Preparing → Delivered)  
- Manage workers (add/remove staff)

---

# 📁 Project Structure

```
Tasty-Bites/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   ├── utils/
    │   ├── App.js
    │   ├── index.js
    ├── .env.example
    └── package.json
```

---

# ⚙️ Environment Variables

## **Backend (`backend/.env`)**
```
MONGO_URL=your-mongodb-uri
DB_NAME=tasty_bites
JWT_SECRET=your-jwt-secret
ADMIN_SECRET=your-admin-secret
STRIPE_API_KEY=your-stripe-secret-key
CLIENT_URL=http://localhost:3000
```

## **Frontend (`frontend/.env`)**
```
REACT_APP_API_BASE_URL=http://localhost:5000
```

> **Note:** Real `.env` files are not committed — only `.env.example`.

---

# 🚀 Getting Started

## Clone the Repository  
```bash
git clone https://github.com/nanaboakye-dev/tasty-bites.git
cd tasty-bites
```

---

# ▶️ Backend Setup

```
cd backend
npm install
npm run dev
```

Backend runs at:  
👉 http://localhost:5000

---

# 💻 Frontend Setup

```
cd frontend
npm install
npm start
```

Frontend runs at:  
👉 http://localhost:3000

---

# 💳 Stripe Setup

1. Create a Stripe account  
2. Add your API keys to `backend/.env`  
3. Restart your server  

---

# 🧪 Testing the App

### User Flow
- Register → login → browse menu  
- Add to cart  
- Choose pickup/delivery  
- Complete checkout via Stripe  
- View orders page  

### Admin Flow
- Register via `/admin/register` using `ADMIN_SECRET`  
- Login  
- Open dashboard  
- Add/remove menu items  
- Change order statuses  
- Manage workers  

---

# 📦 Deployment (Coming Soon)

We will deploy:

- **Backend → Render / Railway**
- **Frontend → Vercel / Netlify**
- **MongoDB → MongoDB Atlas**

Once the project is verified.

---

# 👨‍💻 Author  
**Nana Boakye**  
GitHub: [@nanaboakye-dev](https://github.com/nanaboakye-dev)

---

# ⭐ Contribute  
Pull requests are welcome. For major changes, open an issue first to discuss your ideas.

---

# 📄 License  
MIT License © 2025 Tasty Bites
