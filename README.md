# Hari Naman Greens

A full stack grocery and dairy ordering website developed for **Hari Naman Greens** as a **real world client project**.

This was my **first real world client project**, where I built a complete web application for an actual business instead of building only a personal or practice project.

The project provides a customer facing storefront where customers can browse fresh vegetables and dairy products, manage their shopping basket, and place orders directly through WhatsApp.

It also includes a protected admin portal that allows the business owner to manage products, pricing, availability, promotional carousel banners, and admin account settings.

## 🌐 [Live Website](https://harinamangreen.in/)

---

## 💼 About The Project

**Hari Naman Greens** is a local grocery and dairy business for which I developed this website as a client project.

The main goal was to create a simple and practical online ordering experience where customers can:

- Browse available products
- Select different product weights and variants
- Add products to their basket
- Review their order
- Enter their delivery details
- Place the order directly through WhatsApp

The project also includes an admin dashboard so the business owner can manage the product catalog and promotional content without changing the source code.

This project was especially important to me because it was my **first real client project** and gave me practical experience working on an application based on an actual business requirement.

---

# ✨ Features

## 🛍️ Customer Storefront

- Responsive grocery and dairy storefront
- Fresh vegetable and dairy product catalog
- Vegetable and dairy categories
- Product variants with different weights and prices
- Add products to shopping basket
- Increase or decrease item quantities
- Remove products from basket
- Cart persistence using `localStorage`
- Dynamic promotional hero carousel
- Light and dark theme support
- Responsive mobile and desktop interface
- Direct call-to-shop functionality
- WhatsApp based checkout
- Customer name, phone number, address, and notes collection
- Automatically generated WhatsApp order message
- Order total calculation
- Product availability information
- Special deal support

---

# 🛒 WhatsApp Ordering

Instead of implementing a separate payment gateway or customer account system, the project uses a **WhatsApp based ordering workflow**.

Customers can:

1. Browse available products.
2. Select a product variant and quantity.
3. Add products to their basket.
4. Review their complete order.
5. Enter their name, phone number, and delivery address.
6. Add optional order notes.
7. Submit the order.
8. Automatically open WhatsApp with the complete order details.

The generated WhatsApp message contains:

- Customer information
- Delivery address
- Ordered products
- Selected product variants
- Quantities
- Individual item prices
- Total order amount

### Checkout Flow

```text
Browse Products
      ↓
Select Product
      ↓
Select Variant
      ↓
Add To Basket
      ↓
Review Basket
      ↓
Enter Customer Details
      ↓
Generate Order Message
      ↓
Open WhatsApp
      ↓
Send Order To Seller
---

# 🛠️ Admin Portal

The project includes a protected admin dashboard for managing the store.

## 🔐 Authentication

- Admin login
- Admin logout
- JWT based authentication
- HTTP-only authentication cookies
- Persistent login session
- Protected admin routes
- Password verification using bcryptjs

## 📦 Product Management

The admin can:

- Create products
- Update products
- Delete products
- Toggle product availability
- Manage product categories
- Manage product variants
- Manage product pricing
- Upload product images
- Mark products as special deals

## 🖼️ Carousel Management

The admin can:

- Create promotional carousel slides
- Update carousel slides
- Delete carousel slides
- Upload banner images
- Manage promotional content
- Control carousel display order

## ⚙️ Admin Settings

The admin can:

- Update admin name
- Update admin email
- Change admin password

---

# 🏗️ Tech Stack

## Frontend

- **React** — Building the user interface
- **Vite** — Frontend development and build tooling
- **Tailwind CSS** — Styling and responsive design
- **React Router DOM** — Client-side routing
- **Lucide React** — Icons
- **React Loading Indicators** — Loading states

## Backend

- **Node.js** — JavaScript runtime
- **Express.js** — Backend framework
- **MongoDB** — Database
- **Mongoose** — MongoDB object modeling
- **JWT** — Admin authentication
- **bcryptjs** — Password hashing
- **cookie-parser** — Cookie handling
- **CORS** — Cross-origin request handling
- **Multer** — File upload handling
- **ImageKit** — Cloud image storage

---

# 🔐 Authentication Architecture

The admin authentication system uses **JSON Web Tokens stored inside HTTP-only cookies**.

### Authentication Flow

```text
Admin Login
     ↓
Email & Password Validation
     ↓
Check Admin Credentials
     ↓
Generate JWT
     ↓
Store JWT In HTTP-only Cookie
     ↓
Admin Requests Protected API
     ↓
Authentication Middleware
     ↓
Verify JWT
     ↓
Find Admin
     ↓
Allow Request

The authentication middleware:

Reads the JWT from the cookie.

Verifies the token.

Finds the associated admin account.

Attaches the admin to the request.

Allows access to protected routes.

🖼️ Image Upload System

Product and carousel images are uploaded using Multer memory storage.

When ImageKit is configured, uploaded images are stored in ImageKit.

The backend also includes a local storage fallback if ImageKit is unavailable.

Image Upload Flow

Admin Selects Image
        ↓
Multer
        ↓
Image Buffer
        ↓
ImageKit
        ↓
Image URL
        ↓
MongoDB

Image uploads have a maximum file size of 5 MB.

Only image files are accepted by the upload middleware.

🗄️ Database

The application uses MongoDB with Mongoose.

The main data models include:

Admin

Product

CarouselSlide

Product

Product information includes:

Product name

Local language name

Category

Image URL

Image file ID

Product variants

Variant pricing

Availability

Special deal status

Admin

Admin information includes:

Name

Email

Password

Passwords are hashed using bcryptjs.

Carousel Slide

Carousel information includes:

Badge

Local language headline

Description

Highlight

Image

Trust label

Trust sub-label

Display order

🧩 API Overview

The backend follows a REST API structure.

Authentication APIs

POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me

Product APIs

GET    /api/products
POST   /api/products
PUT    /api/products/:id
PATCH  /api/products/:id/toggle
DELETE /api/products/:id

Carousel APIs

GET    /api/carousel
POST   /api/carousel
PUT    /api/carousel/:id
DELETE /api/carousel/:id

Admin APIs

PUT /api/admin/settings

Protected operations require an authenticated admin session.

📁 Project Structure

Hari-Naman-Redesign/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   │
│   │   ├── components/
│   │   │   ├── CartDrawer.jsx
│   │   │   └── ProductCard.jsx
│   │   │
│   │   ├── context/
│   │   │   └── CartContext.jsx
│   │   │
│   │   ├── data/
│   │   │   └── products.js
│   │   │
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminLogin.jsx
│   │   │   └── LandingPage.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   │
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   │
│   │   ├── models/
│   │   │   ├── Admin.js
│   │   │   ├── CarouselSlide.js
│   │   │   └── Product.js
│   │   │
│   │   ├── routes/
│   │   │   ├── admin.js
│   │   │   ├── auth.js
│   │   │   ├── carousel.js
│   │   │   └── products.js
│   │   │
│   │   ├── utils/
│   │   │   ├── imageStorage.js
│   │   │   ├── seedAdmin.js
│   │   │   └── seedProducts.js
│   │   │
│   │   └── index.js
│   │
│   └── package.json
│
├── .env.example
├── package.json
└── package-lock.json

⚙️ Local Development

1. Clone the Repository

git clone https://github.com/Ashish2k04/Hari-Naman-Redesign.git
cd Hari-Naman-Redesign

2. Install Dependencies

The root project includes scripts for installing the required dependencies.

npm run install:all

3. Configure Environment Variables

The project includes an .env.example file.

Create:

server/.env

and configure the required environment variables.

4. Seed Admin Account

npm run seed:admin

5. Seed Products

npm run seed:products

6. Start Development Environment

Run both frontend and backend:

npm run dev

Or run them separately:

npm run dev:server

npm run dev:client

🔒 Environment Variables

Example:

PORT=5000
NODE_ENV=development

MONGODB_URI=YOUR_MONGODB_URI
JWT_SECRET=YOUR_JWT_SECRET

CLIENT_URL=http://localhost:5173

IMAGEKIT_PUBLIC_KEY=YOUR_IMAGEKIT_PUBLIC_KEY
IMAGEKIT_PRIVATE_KEY=YOUR_IMAGEKIT_PRIVATE_KEY
IMAGEKIT_URL_ENDPOINT=YOUR_IMAGEKIT_URL_ENDPOINT

ADMIN_DEFAULT_NAME=Hari Naman Greens Admin
ADMIN_DEFAULT_EMAIL=admin@hn-greens.com
ADMIN_DEFAULT_PASSWORD=YOUR_ADMIN_PASSWORD

Never commit real:

Database credentials

JWT secrets

Admin passwords

ImageKit private keys

API keys

Other sensitive environment variables

to GitHub.

🚀 Deployment

The application is structured with a separate frontend and backend.

Frontend

The frontend is deployed separately and served through the live website.

Backend

The backend runs as a Node.js and Express application.

Database

MongoDB is used for persistent application data.

Image Storage

ImageKit is used for storing uploaded product and carousel images.

📱 Responsive Design

The customer storefront is designed to work across:

Mobile devices

Tablets

Desktop screens

The admin dashboard also includes responsive layouts for different screen sizes.

🌙 Theme Support

The application supports:

Light mode

Dark mode

The selected theme is stored locally and restored when the application is opened again.

🧠 Full-Stack Architecture

The overall application follows this structure:

                    Customer
                       │
                       ▼
              React Frontend
                       │
                       │ REST API
                       ▼
              Express Backend
                       │
          ┌────────────┼────────────┐
          │            │            │
          ▼            ▼            ▼
      MongoDB       ImageKit     WhatsApp
          │            │            │
          ▼            ▼            ▼
       Products      Images       Orders
       Admin Data
       Carousel

📚 What This Project Demonstrates

This project brings together multiple real-world full-stack development concepts:

React component architecture

Responsive UI development

Tailwind CSS

React Context

Client-side routing

REST API development

Express.js

MongoDB

Mongoose

JWT authentication

HTTP-only cookies

Password hashing

Protected backend routes

CRUD operations

File uploads

Multer memory storage

ImageKit cloud storage

Local image storage fallback

Admin dashboard development

Product management

Dynamic pricing

Carousel management

Environment variable management

WhatsApp ordering workflow

Frontend and backend deployment

🎯 Project Objective

The primary objective of this project was to create a practical digital storefront for a local grocery and dairy business.

Instead of building unnecessary complexity around customer accounts and online payments, the application focuses on the actual business workflow:

Browse Products
      ↓
Build Basket
      ↓
Enter Delivery Details
      ↓
Generate Order
      ↓
WhatsApp
      ↓
Seller Receives Order

At the same time, the admin dashboard gives the business owner control over the product catalog and promotional content.

🧑‍💻 My First Real Client Project

This project holds a special place in my development journey because it was my first real-world client project.

It was the first time I worked on a project where the application was being built for an actual business and had to solve real requirements rather than simply demonstrating a technology.

Through this project, I got practical experience with:

Understanding client requirements

Turning business requirements into application features

Building a complete frontend

Building a backend API

Working with MongoDB

Implementing authentication

Handling image uploads

Managing product data

Building an admin dashboard

Deploying a full-stack application

Handling real-world changes and requirements

Building a project that is actually used by a business

This project helped me understand that building a real product is different from simply building a tutorial project.

🚧 Development Status

The project is currently deployed and used as the website for Hari Naman Greens.

Further improvements and changes can be made based on the client's business requirements.

👨‍💻 Developer

Developed by Ashish Tiwari.

This project was developed as a real client project for Hari Naman Greens and was my first real-world client project.

🌐 Live Project

Hari Naman Greens

https://harinamangreen.in/
