# 🏍️ Bike Service Management System (React.js + Vite)

A modern, responsive, and feature-rich **Bike Service Management System** frontend built with **React.js**, **Vite**, **Vanilla CSS**, and **React Router**.

This application replicates the reference dashboard and mobile designs with high fidelity, providing both an **Admin Operations Portal** and a **Customer Mobile Interface**.

---

## 📸 Reference Designs & Visual Alignment

The interface accurately replicates the visual style, typography, color palette, and layout of the three reference designs:

1. **Reference Design 1 — Customer Mobile Interface**:
   - **Home**: Header banner (`Hi Bharath, Your Bike is Safe ●`), bike selector (`TN 30 AB 1234, Yamaha FZ-S`), 4 quick action tiles, Salem live map with geofence, and bottom navigation.
   - **Bike Details**: Vehicle hero card, 7-day and 1-month distance trend cards, and trip action list.
   - **Service**: Next service due card (`12 Oct 2026 (In 27 Days)`), `Book Service` CTA, service intervals, and receipt history.
2. **Reference Design 2 — Admin All Pages Overview**:
   - Dark navy sidebar (`#091224`) with bright blue active pills (`#2563eb`).
   - Top header with notification bubble (`3`), admin profile badge, and customer preview switcher.
   - 8 module cards with numbered badges (`1`–`8`), icons, descriptions, `Open →` links, and live interactive mini-previews.
3. **Reference Design 3 — Admin Profile**:
   - Distinct 2×2 grid: **Profile Overview**, **Edit Profile**, **Change Password**, and **Activity Log**.

---

## 🚀 Key Features

### 🏢 1. Admin Management Portal

- **All Pages Overview (`/admin/all-pages`)**:
  - Central command dashboard displaying interactive preview cards for all 8 administrative sub-modules.
  - Direct one-click navigation to any system area.

- **Dashboard (`/admin/dashboard`)**:
  - **KPI Metrics Row**: Total Bikes (`52`), Online Now (`38`), Service Due Soon (`12`), Offline Bikes (`14`).
  - **Live Bike Location**: Interactive Leaflet map with active bike markers, live telemetry chips, and zoom/center controls.
  - **Recent Activities**: Chronological feed of vehicle movements, completed services, and offline alerts.
  - **Workshop Snapshots**: Upcoming service due list and active workshop job cards with quick actions.

- **Live Bike Tracking (`/admin/live-tracking`)**:
  - Real-time vehicle list with status filtering (`ALL`, `MOVING`, `PARKED`, `STOPPED`, `OFFLINE`) and text search.
  - Interactive map with bike markers, street/satellite toggle, and geofencing.
  - Floating live telemetry card displaying real-time speed, battery level, fuel, location, and timestamps.

- **Next Service Notifications (`/admin/next-service`)**:
  - Preventive maintenance scheduler with brand filter (`Yamaha`, `Honda`, `TVS`, etc.) and urgency window filter (`Due in 7/15/30/60 Days`).
  - Direct **Notify** action with a dispatch modal supporting SMS, WhatsApp, and Email channels with prefilled message templates.

- **Job Cards (`/admin/job-cards`)**:
  - Workshop job card tracker with status tabs (`All (8)`, `Open (3)`, `In Service (3)`, `Ready (1)`, `Completed (1)`).
  - Search by Job No, Reg No, Customer, or Model.
  - **Create Job Card Modal**: Form to assign technicians, log complaints, set estimated costs, and generate new cards.
  - **Job Card Details Modal**: Full printable work order view with live status switcher (`Open` ➔ `In Service` ➔ `Ready` ➔ `Completed`).

- **Users Management (`/admin/users`)**:
  - System user directory with initial avatar circles and color-coded role badges (`Customer`, `Technician`, `Service Manager`, `Administrator`).
  - Filter by Role, Account Status (`Active`/`Inactive`), and search.
  - **Add User Modal** and **Edit User Modal** with validation.

- **Manage Bike Brands (`/admin/manage-brands`)**:
  - Supported brand catalog with vector logos (**Honda**, **Yamaha**, **TVS**, **Bajaj**, **Hero**, **Royal Enfield**).
  - Manage total models, default periodic service intervals (e.g., `6000 km / 6 months`), and active statuses.
  - **Add Brand Modal** and **Edit Brand Modal**.

- **Settings (`/admin/settings`)**:
  - Tabbed system configuration:
    - **General Settings**: Company name, address, contact information.
    - **Service Settings**: Service due notice window, currency symbol, standard intervals, and diagnostic inspection checklist.
    - **Notification Settings**: Automated SMS reminders and email invoice triggers.
    - **User Roles**: Permission matrix across administrative and technician tiers.
    - **Backup & Security**: Automated database backups and session inactivity timeout settings.

- **Profile & Account (`/admin/profile`)**:
  - **Profile Overview**: Avatar photo upload with camera badge, status badge (`● Active`), phone, email, and joined date.
  - **Edit Profile**: Validated form with input icons, role selection, and file upload dropzone.
  - **Change Password**: Current, new, and confirm password inputs with visibility eye toggles, password strength requirements, and matching validation.
  - **Activity Log**: Audit trail showing date & time, action performed, description, IP address, date filter, and pagination (`< [1] [2] >`).

---

### 📱 2. Customer Mobile Interface (`/customer`)

Rendered within an interactive iPhone device frame (or accessible full-screen on mobile viewports):

- **Home Screen**:
  - Native iOS-style status bar (`9:41`, cellular, Wi-Fi, battery).
  - Blue gradient hero banner with personal greeting, safety indicator (`Your Bike is Safe ●`), and notification bell.
  - Vehicle card with brand logo and model (`TN 30 AB 1234, Yamaha FZ-S`).
  - 4 quick action buttons: **Live Tracking**, **Service**, **History**, **Alerts**.
  - Live location mini-map with circular geofence and last parked location details.
  - Persistent bottom navigation bar (**Home**, **Bike**, **Service**, **Profile**).

- **Bike Details Screen**:
  - Motorcycle specifications and purchase date.
  - **7 Days Distance**: `120 km` (`↑ 12% vs previous 7 days`).
  - **1 Month Distance**: `450 km` (`↑ 8% vs previous month`).
  - Action items: **Live Location**, **Ride History**, and **Share Location**.

- **Service Booking & Records Screen**:
  - Next Service Due highlight card (`12 Oct 2026 (In 27 Days)`).
  - **Book Service Modal**: Select service package, appointment date, time slot, doorstep pickup option, and customer notes.
  - Service details breakdown: Last service date, next service mileage, and periodic interval.
  - Service history list with costs and detailed itemizations.

- **Full Live Location Screen**:
  - Full-screen GPS map tracking with speed badge, battery percentage, fuel gauge, and updated coordinates.

- **Alerts & Profile Screens**:
  - Security, parking, geofence, and maintenance push notification logs.
  - Customer account information, emergency helpline (`1800-425-BIKE`), and insurance validity details.

---

## 🛠️ Technology Stack

| Technology             | Purpose                                                       |
| :--------------------- | :------------------------------------------------------------ |
| **React 19**           | Component-based UI library                                    |
| **Vite 8**             | Modern, fast frontend build tool & dev server                 |
| **JavaScript (ES6+)**  | Core language (clean, understandable, beginner-friendly)      |
| **Vanilla CSS**        | Design system with CSS variables, modular stylesheets         |
| **React Router v7**    | Client-side routing and page navigation                       |
| **Lucide React**       | Consistent, modern vector iconography                         |
| **Leaflet**            | Interactive GPS mapping, tile rendering, and custom bike pins |
| **Google Font: Inter** | Modern typography matching enterprise dashboards              |

---

## 📁 Project Directory Structure

```text
bike-service-management/
├── index.html                           # Inter font & Leaflet CSS includes
├── package.json                         # Dependencies & npm scripts
├── vite.config.js                       # Vite configuration
├── src/
│   ├── main.jsx                         # React root mount & stylesheet imports
│   ├── App.jsx                          # Router configuration & page routes
│   │
│   ├── assets/                          # Static assets and icons
│   │
│   ├── data/
│   │   └── mockData.js                  # Realistic sample datasets matching reference designs
│   │
│   ├── styles/
│   │   ├── index.css                    # Design tokens, variables, badges, buttons, modals
│   │   ├── admin.css                    # Admin layout, sidebar, header, tables, grids
│   │   └── customer.css                 # Customer mobile device frame, cards, bottom nav
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AdminLayout.jsx          # Shell with Sidebar, Header & Content Outlet
│   │   │   ├── Sidebar.jsx              # Dark navy sidebar with active navigation pills
│   │   │   └── Header.jsx               # Breadcrumbs, notification popover & profile dropdown
│   │   └── common/
│   │       ├── BrandLogo.jsx            # High-fidelity SVG brand logos (Yamaha, Honda, TVS, etc.)
│   │       ├── StatusBadge.jsx          # Color-coded status & role badges
│   │       ├── MetricCard.jsx           # Dashboard numerical statistic cards
│   │       ├── LeafletMap.jsx           # Leaflet map with bike pins, telemetry & controls
│   │       └── Modal.jsx                # Accessible modal dialog component
│   │
│   └── pages/
│       ├── admin/
│       │   ├── AllPagesOverview.jsx     # Overview grid matching Reference Image 2
│       │   ├── DashboardPage.jsx        # Main dashboard with map and activity feed
│       │   ├── LiveTrackingPage.jsx     # Real-time GPS tracking and vehicle list
│       │   ├── NextServicePage.jsx      # Service due notification table & dispatch modal
│       │   ├── JobCardsPage.jsx         # Workshop job card workflow & status manager
│       │   ├── UsersPage.jsx            # User management table & editor modals
│       │   ├── ManageBrandsPage.jsx     # Motorcycle manufacturer catalog & intervals
│       │   ├── SettingsPage.jsx         # Configuration settings & permissions
│       │   └── ProfilePage.jsx          # 2x2 grid matching Reference Image 3
│       └── customer/
│           └── CustomerApp.jsx          # Complete mobile interface matching Reference Image 1
```

---

## 🚦 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (version 18 or higher) installed on your system.

### 1. Installation

Open your terminal or PowerShell and navigate to the project directory:

```bash
cd "C:\Users\user\.gemini\antigravity-ide\scratch\bike-service-management"
```

Install the project dependencies:

```bash
npm install
```

### 2. Start the Development Server

Run the development server with Hot Module Reloading (HMR):

```bash
npm run dev
```

The application will start immediately. Open your browser and navigate to:

👉 **`http://localhost:5173/`**

### 3. Build for Production

To create an optimized production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

## 🧭 Navigation & Routes

| URL Path               | Screen Description                                                           |
| :--------------------- | :--------------------------------------------------------------------------- |
| `/`                    | Automatically redirects to `/admin/all-pages`                                |
| `/admin/all-pages`     | **All Pages Showcase** — Interactive 3D slide deck & filmstrip with live playgrounds         |
| `/admin/dashboard`     | **Dashboard** — Fleet telemetry, KPI cards, recent activities                |
| `/admin/live-tracking` | **Live Bike Tracking** — GPS map, bike status filter, live speed             |
| `/admin/next-service`  | **Next Service Notifications** — Expiry countdown & notification dispatcher  |
| `/admin/job-cards`     | **Job Cards** — Workshop jobs, status tabs, creation form                    |
| `/admin/users`         | **Users** — Technicians, managers, and customer directory                    |
| `/admin/manage-brands` | **Manage Bike Brands** — Manufacturers, logos, and service intervals         |
| `/admin/settings`      | **Settings** — Company settings, diagnostic rules, backups                   |
| `/admin/profile`       | **Profile** — Profile overview, edit profile, password, activity logs        |
| `/customer`            | **Customer Mobile App** — Home, Bike Details, Service Booking, Live Location |

> 💡 **Tip**: While anywhere in the Admin Panel, click the **"Customer App Preview 📱"** button in the top-right header to instantly switch to the customer view, or click **"Back to Admin Panel"** inside the mobile view to return.

---

## 🎨 Design System & Colors

```css
/* Core Colors */
--bg-sidebar: #091224; /* Deep dark navy sidebar */
--bg-sidebar-hover: #13203c; /* Sidebar item hover */
--bg-sidebar-active: #2563eb; /* Bright royal blue active pill */
--primary-blue: #2563eb; /* Primary action buttons */
--primary-blue-hover: #1d4ed8; /* Button hover state */
--bg-body: #f4f6fb; /* Pale blue-gray background */
--bg-card: #ffffff; /* Pure white card container */
--border-color: #e2e8f0; /* Card and input border */

/* Status Palette */
--success-bg: #ecfdf5;
--success-text: #059669; /* Active / Normal / Completed */
--warning-bg: #fffbeb;
--warning-text: #d97706; /* Due Soon / In Service */
--danger-bg: #fef2f2;
--danger-text: #dc2626; /* Offline / Stopped */
--info-bg: #f0f9ff;
--info-text: #0284c7; /* Moving / Live */
```

---

## 📄 Mock Data & Transparency Notice

All live tracking coordinates, customer details, job cards, service records, and activity logs are populated from `src/data/mockData.js`. Form submissions (such as updating profiles, passwords, or booking service appointments) update React component state locally with interactive feedback. No backend API or database connection is required to run the application.

---

## 📜 License

This project is created for demonstration and portfolio purposes. Feel free to use and adapt the code for your own motorcycle service management projects!
