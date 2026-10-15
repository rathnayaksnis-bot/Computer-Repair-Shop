# 🔧 Computer Repair Shop Management System

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![jQuery](https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white)

> **Project 21** — Full-stack computer repair shop management system built with Node.js, Express, MySQL, and jQuery.

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Configuration](#configuration)
- [Running the App](#running-the-app)
- [API Endpoints](#api-endpoints)
- [Security](#security)
- [Author](#author)

## 🎯 Overview

The **Computer Repair Shop Management System** is a complete web application for managing:
- Customer information
- Their devices (laptops, desktops, phones, tablets, printers)
- Repair services catalog
- Repair jobs with full status tracking
- Payments and invoices
- Service history reports

## ✨ Features

### Practical 01 (Core System)
- ✅ **Customers CRUD** — Add, edit, delete, search customers
- ✅ **Devices CRUD** — Track customer devices
- ✅ **Services CRUD** — Manage repair services catalog
- ✅ **Repair Jobs** — Create and manage repair jobs
- ✅ **Admin Dashboard** — Business metrics
- ✅ **Search & Filter** — Search customers by name/email/phone

### Practical 02 (Enhancements)
- ✅ **Authentication** — JWT login/logout
- ✅ **Security** — bcrypt password hashing
- ✅ **Protected Routes** — Admin-only operations
- ✅ **Repair Tracking** — Status workflow (received → diagnosing → in_progress → completed → delivered)
- ✅ **Service History** — Complete history per customer
- ✅ **Reports** — Date range reports with CSV export
- ✅ **Payment Workflow** — Mock payments (cash/card/UPI/net banking)
- ✅ **Modern UI** — Responsive dark cinema theme
- ✅ **Input Validation** — Client and server side

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, JavaScript, jQuery, AJAX |
| Backend | Node.js, Express.js (MVC) |
| Database | MySQL |
| Auth | JWT + bcrypt |
| Session | express-session + cookie-parser |

## 📁 Project Structure