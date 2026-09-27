# Hari Naman Greens

A full-stack grocery and dairy ordering website developed for **Hari Naman Greens** as a **real-world client project**.

This was my **first real-world client project**, where I built a complete web application for an actual business instead of building only a personal or practice project.

The project provides a customer-facing storefront where customers can browse fresh vegetables and dairy products, manage their shopping basket, and place orders directly through WhatsApp.

It also includes a protected admin portal that allows the business owner to manage products, pricing, availability, promotional carousel banners, and admin account settings.

## 🌐 Live Website

https://harinamangreen.in/

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
