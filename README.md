# 🏍️ Bike Service Pro (React + Vite)

A modern, motorcycle-focused **Bike Service Pro** web application built with **React 19**, **Vite 8**, **React Router v7**, **Lucide React**, and **Leaflet**.

The platform provides **two separate experiences** in one codebase:
1. **Desktop Admin Portal (`/login`, `/admin/*`)** — Role-based workshop and business management for **Super Admin** and **Operations Admin**.
2. **Customer Mobile Web App (`/customer`, `/mobile`, `/rider`)** — Mobile-first rider portal for bike owners to track services, upcoming maintenance, ride analytics, and traffic challans.

---

## 🚀 Key Features

### 1. Authentication & Role-Based Access
- **Common Admin Login (`/login`)**: Centered authentication card over a **TVS Ronin (Charcoal Ember)** workshop backdrop. Supports both **Super Admin** and **Operations Admin** with role-based redirection (`/admin/admins` vs `/admin/dashboard`) and a post-login welcome popup.
- **Protected Routes**: `ProtectedRoute` enforces active session authentication; `RequireSuperAdmin` restricts Super Admin modules (`Admin Management`, `Store Locations`, `Branding`) from Operations Admin access.
- **Customer Portal Login (`/customer`)**: Separate mobile-first rider login using registered mobile number and 4-digit security PIN (configured in **Customers & Users**, default `1234`).

### 2. Desktop Admin Portal
- **Dashboard (`/admin/dashboard`)**: Role-aware **TVS Ronin** overview strip, 8 business & operations KPIs, live reconciled monthly sales chart, customer rating distribution, and overdue maintenance alerts.
- **Bikes (`/admin/bikes`)**: Fleet registry with odometer tracking, service intervals, and automatic customer account creation.
- **Service Tracking (`/admin/services`)**:
  - Log bike maintenance with **Current Kilometer (KM)**, automatic **Previous KM** lookup, live **Distance Travelled**, and validation preventing readings lower than the previous recorded KM.
  - Preserves historical service records while updating the bike's latest odometer and next service targets.
- **Repair History (`/admin/repairs`)**: Parts replaced, labour charges, and repair cost tracking.
- **Job Completion (`/admin/job-cards`)**: Multi-stage workflow (`Service Booking` → `Job In Progress` → `Job Completed` → `Next Service Reminder`) persisted in `localStorage` and synchronized with `serviceRecords` and `bikesList` without duplicates.
- **Next Service & Pending Services (`/admin/next-service`, `/admin/pending-services`)**: Upcoming/overdue maintenance queue and reminder dispatch.
- **Vehicle Service Prediction (`/admin/service-prediction`)**: Estimates Engine Oil, Brake Inspection, Air Filter, Chain Maintenance, Battery Inspection, Tyre, and Clutch readiness from service history and configurable intervals.
- **Sales Analytics (`/admin/sales`)**: Live calculations from deduplicated `serviceRecords`, `repairRecords`, and completed `jobCardsList` reconciled with the Dashboard.
- **Customer Ratings (`/admin/ratings`)**: Overall rating, 5-star distribution, service-wise scores, monthly trends, and empty-state filter handling.
- **Interactive Marked & Unmarked Area Map (`/admin/live-tracking`)**:
  - Draw, name, color (Blue / Green), edit, and delete polygon **Marked Areas** on Leaflet, persisted in `localStorage`.
  - Clear Map Legend distinguishing **Marked Areas** and **Unmarked Areas (Outside Boundaries)**.
  - Location/hub/coordinate search and point-in-polygon vehicle status (`Inside Marked Area` vs `Outside All Marked Areas`).
- **Reports (`/admin/reports`)**, **Customers & Users (`/admin/users`)** (with KYC document UI & mobile PIN management), **Manage Brands (`/admin/manage-brands`)**, **Settings (`/admin/settings`)**, and **Profile (`/admin/profile`)**.
- **Super Admin Modules**: **Admin Management (`/admin/admins`)**, **Store Locations (`/admin/stores`)**, and **Branding (`/admin/branding`)**.

### 3. Customer Mobile Web App (`/customer`)
- **Home Screen**: **TVS Ronin (Charcoal Ember)** hero banner (*"Every Ride Deserves Better Care."*), **My Bikes / Upcoming / Completed** summary cards, live vehicle telemetry pills, quick actions (**Fines**, **Distance**, **Playback**, **Geo Zone**), and bottom navigation.
- **Service Management**: Next service progress bar, component health checklist, live service history, and service slot booking modal.
- **Traffic Challans, Distance Analytics, Route Playback, Loyalty Points, Alerts & Profile**: Dedicated mobile screens scoped to the logged-in rider.

---

## 🛠️ Technology Stack

| Technology | Purpose |
| :--- | :--- |
| **React 19** | Component-based UI |
| **Vite 8** | Fast dev server & production bundler |
| **React Router v7** | Client-side routing & role guards |
| **Leaflet** | Interactive maps, custom bike markers & polygon area drawing |
| **Lucide React** | Vector iconography |
| **CSS3 (Modular Stylesheets)** | Custom design system (`index.css`, `admin.css`, `customer.css`) |

---

## 📁 Project Structure

```text
Bike-Management-System-Frontend/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── assets/                     # Signature TVS Ronin login & mobile hero visuals
    ├── context/
    │   └── AppContext.jsx          # App state & LocalStorage persistence
    ├── data/
    │   ├── mockData.js             # Seed data for bikes, jobs, ratings & trips
    │   └── serviceData.js          # Service intervals, bikes & repair seed records
    ├── utils/
    │   ├── geoUtils.js             # Polygon containment & marked area helpers
    │   └── salesAnalytics.js       # Deduplicated live sales & revenue calculations
    ├── styles/
    │   ├── index.css
    │   ├── admin.css
    │   └── customer.css
    ├── components/
    │   ├── auth/                   # ProtectedRoute, RequireSuperAdmin
    │   ├── common/                 # BrandLogo, DynamicBrandLogo, LeafletMap, MetricCard, Modal, StatusBadge, WelcomePopup
    │   └── layout/                 # AdminLayout, Header, Sidebar
    └── pages/
        ├── auth/LoginPage.jsx
        ├── admin/                  # Dashboard, Bikes, ServiceTracking, RepairHistory, JobCards, NextService, PendingService, ServicePrediction, SalesAnalytics, CustomerRatings, LiveTracking, Reports, Users, ManageBrands, AdminManagement, StoreLocations, Branding, Settings, Profile
        └── customer/CustomerApp.jsx
```

---

## 🚦 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) 18+

### Installation & Commands

```bash
npm install
npm run dev
```

- **Admin Portal**: `http://localhost:5173/login`
- **Customer Mobile App**: `http://localhost:5173/customer` (aliases: `/mobile`, `/rider`)

### Lint & Production Build

```bash
npm run lint
npm run build
```

---

## 🔌 Backend & Persistence Notes
- Currently runs offline-first using browser `localStorage` and `sessionStorage` (`AppContext.jsx`), with JSON backup/restore available in **Settings (`/admin/settings`)**.
- **Customer Ratings** and **Customer KYC** verification statuses are frontend UI previews until connected to backend APIs.
- **Live Tracking** polygon area status evaluates actual stored vehicle coordinates; real-time hardware telemetry requires connecting an MQTT/WebSocket GPS backend feed.
