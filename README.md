# 🚀 JanSamadhan – Civic Issue Management Platform

JanSamadhan is a full-stack Civic Issue Management Platform designed to digitally streamline how civic problems are reported, managed, and resolved.

It connects Citizens, Authorities, and Administrators in a structured workflow with secure role-based authentication and real-time notifications.

---

## 🌍 Live Demo

👉 https://jan-samadhan-yxqq.vercel.app

---

## 📌 Problem Statement

Many civic issues like potholes, broken street lights, garbage accumulation, and water leakage go unresolved due to lack of structured communication between citizens and authorities.

JanSamadhan solves this by:

- Allowing citizens to report issues digitally
- Enabling authorities to manage and resolve assigned issues
- Providing admins with full system control and monitoring
- Sending real-time updates to all stakeholders

---

## 🏗️ System Architecture

The platform follows a role-based architecture:

- **Citizen**
- **Authority**
- **Admin**

Authentication is handled using Clerk (JWT-based), and authorization is enforced via backend role middleware.

---

## 🔐 Authentication & Authorization

- Clerk Authentication
- JWT-based role verification
- Backend middleware:
  - `requireAuth`
  - `requireRole(["ADMIN"])`
  - `requireRole(["AUTHORITY"])`
- Default role on signup: `CITIZEN`
- Roles stored in MongoDB

---

## 👤 User Workflows

### 🧍 Citizen

- Sign up / Login via Clerk
- Report civic issues
- Track issue status
- Receive real-time notifications on:
  - Issue assignment
  - Status updates
  - Resolution

---

### 🏛 Authority

- Converted by Admin (no separate signup)
- View assigned issues
- Update issue status
- Upload resolution proof
- Manage notification preferences
- Raise IT support tickets

---

### 🧑‍💼 Admin

- View all issues
- Filter unassigned issues
- Assign issues to authorities
- Convert users to AUTHORITY
- Manage support tickets
- Update ticket status

---

## 🔔 Real-Time Notifications

Implemented using **Socket.io**

Citizens and Authorities receive instant updates when:

- An issue is assigned
- Status changes occur
- Resolution proof is uploaded

---

## 🎫 Support Ticket System

Authorities can raise IT support tickets.

Ticket fields:
- Title
- Description
- Priority
- Status
- RaisedBy

Admins can:
- View all tickets
- Update status (OPEN → IN_PROGRESS → RESOLVED)

---

## 🗂️ Tech Stack

### Frontend
- React
- TailwindCSS
- Axios
- Socket.io Client

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Multer (file uploads)
- Socket.io

### Authentication
- Clerk (JWT-based role management)

### Deployment
- Vercel (Frontend)
- Backend hosted separately (Node/Express)

---

## 📦 Project Structure
JanSamadhan/
│
├── client/ # React Frontend (UI, Pages, Components)
├── server/ # Node.js + Express Backend
│ ├── models/ # MongoDB Schemas
│ ├── routes/ # API Route Handlers
│ ├── middleware/ # Authentication & Role Middlewares
│ └── socket/ # Socket.io Real-time Logic
│
└── README.md

## ⚙️ Environment Variables

### 🔹 Frontend (.env)
VITE_API_BASE_URL=
VITE_CLERK_PUBLISHABLE_KEY=

### 🔹 Backend (.env)
PORT= 5000
MONGO_URI=
CLERK_SECRET_KEY=
FRONTEND_URL=

## 💡 Key Learning Outcomes
- Designing role-based backend architecture  
- Implementing secure JWT verification with Clerk  
- Integrating real-time event handling using Socket.io  
- Handling file uploads with Multer  
- Managing production deployment & environment configuration  
- Building a complete admin-controlled workflow system  

---
## 📬 Feedback
Open to feedback and suggestions as I continue improving this platform.

