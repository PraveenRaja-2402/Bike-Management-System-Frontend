# Bike Service Pro – Detailed Implementation & Architecture Guide

**Document Scope:** Comprehensive technical inspection and implementation specification covering:
1. Website-wide Cancel Button Redesign
2. Current Kilometer (KM) in Log Bike Maintenance & Service
3. Interactive Marked Area and Unmarked Area Map

> **Inspection Note:** This document was authored by inspecting the actual source tree of `Bike-Management-System-Frontend`. It distinguishes **verified existing implementations** from **recommended enhancements and future backend/GPS integrations**.

---

## 1. Project Overview

**Bike Service Pro** (`bike-service-management`, v0.0.0) is a React + Vite frontend application providing two separate user experiences:

1. **Desktop Admin Portal (`/login`, `/admin/*`)**
   - Shared authentication entry point (`/login`) with role-based redirection for **Super Admin** (`/admin/admins`) and **Operations Admin** (`/admin/dashboard`).
   - Covers fleet registry (`BikesPage`), service logging (`ServiceTrackingPage`), repair history (`RepairHistoryPage`), job completion workflow (`JobCardsPage`), upcoming/overdue reminders (`NextServicePage`, `PendingServicePage`), maintenance predictions (`ServicePredictionPage`), live sales analytics (`SalesAnalyticsPage`), customer ratings (`CustomerRatingsPage`), reports (`ReportsPage`), live map & area management (`LiveTrackingPage`), customer/user management (`UsersPage`), brands (`ManageBrandsPage`), settings (`SettingsPage`), profile (`ProfilePage`), and Super Admin controls (`AdminManagementPage`, `StoreLocationsPage`, `BrandingPage`).
2. **Customer Mobile Web App (`/customer`, `/mobile`, `/rider`)**
   - Standalone mobile-first rider portal (`CustomerApp.jsx`) with separate phone + 4-digit PIN authentication (`loginCustomer`), vehicle telemetry cards, service management, traffic challans, distance analytics, route playback, loyalty points, and alerts.

---

## 2. Existing Application Architecture

### 2.1 Installed Dependencies (`package.json`)

| Package | Version | Purpose |
| :--- | :--- | :--- |
| `react` | `^19.2.8` | UI component library |
| `react-dom` | `^19.2.8` | DOM rendering |
| `react-router-dom` | `^7.18.4` | Client-side routing and route guards |
| `leaflet` | `^1.9.4` | Interactive maps, markers, polylines, circles, polygons |
| `lucide-react` | `^1.55.0` | Vector icon system |
| `vite` | `^8.3.0` | Dev server & bundler (`@vitejs/plugin-react ^6.1.1`) |
| `oxlint` | `^1.81.0` | Fast static linter (`npm run lint`) |

### 2.2 Verified Directory & File Inventory

| Area | Verified Files |
| :--- | :--- |
| **Entry & Routing** | `src/main.jsx`, `src/App.jsx` |
| **Auth Guards** | `src/components/auth/ProtectedRoute.jsx`, `src/components/auth/RequireSuperAdmin.jsx` |
| **Layout Shell** | `src/components/layout/AdminLayout.jsx`, `src/components/layout/Header.jsx`, `src/components/layout/Sidebar.jsx` |
| **Shared Components** | `src/components/common/Modal.jsx`, `src/components/common/MetricCard.jsx`, `src/components/common/StatusBadge.jsx`, `src/components/common/LeafletMap.jsx`, `src/components/common/BrandLogo.jsx`, `src/components/common/DynamicBrandLogo.jsx`, `src/components/common/WelcomePopup.jsx` |
| **State & Persistence** | `src/context/AppContext.jsx` |
| **Seed Data & Utilities** | `src/data/mockData.js`, `src/data/serviceData.js`, `src/utils/salesAnalytics.js`, `src/utils/geoUtils.js` |
| **Admin Pages** | `DashboardPage.jsx`, `BikesPage.jsx`, `ServiceTrackingPage.jsx`, `RepairHistoryPage.jsx`, `JobCardsPage.jsx`, `NextServicePage.jsx`, `PendingServicePage.jsx`, `ServicePredictionPage.jsx`, `SalesAnalyticsPage.jsx`, `CustomerRatingsPage.jsx`, `LiveTrackingPage.jsx`, `ReportsPage.jsx`, `UsersPage.jsx`, `ManageBrandsPage.jsx`, `AdminManagementPage.jsx`, `StoreLocationsPage.jsx`, `BrandingPage.jsx`, `SettingsPage.jsx`, `ProfilePage.jsx`, `AllPagesOverview.jsx` |
| **Auth & Customer** | `src/pages/auth/LoginPage.jsx`, `src/pages/customer/CustomerApp.jsx` |
| **Stylesheets** | `src/styles/index.css`, `src/styles/admin.css`, `src/styles/customer.css`, `src/styles/all-pages-slider.css` |

---

## 3. Current UI/UX Observations

1. **Buttons & Modals (`src/components/common/Modal.jsx`, `src/styles/admin.css`)**
   - `Modal.jsx` provides a consistent dialog shell (`sm: 480px`, `md: 640px`, `lg: 880px`, `xl: 1060px`), Escape-key close, and backdrop click close, but does **not** enforce a standardized footer action slot; individual pages render inline `<div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>` footers.
   - Cancel buttons across 14+ files rely on `.btn-secondary` (standardized in `src/styles/admin.css` with `min-height: 40px`, `border: 1.5px solid #cbd5e1`, `#ffffff` background, `#334155` text) rather than a dedicated reusable React button component.
   - `customer.css` (`.customer-view-wrapper` modals) inherits `.btn-secondary` from `admin.css` because `src/main.jsx` loads `index.css`, `admin.css`, and `customer.css` globally.
2. **Service Kilometer Flow (`ServiceTrackingPage.jsx`, `BikesPage.jsx`, `NextServicePage.jsx`)**
   - `ServiceTrackingPage.jsx` currently includes **Current Kilometer (KM)** (`formData.serviceKm`), **Previous KM** (`previousBikeKm`), and **Distance Travelled** (`distanceTravelled`) with validation (`>= 0` and `>= previousBikeKm`).
   - `BikesPage.jsx` and `NextServicePage.jsx` already display `currentKm`, `lastServiceKm`, and `nextServiceKm` and include odometer update modals (`min={selectedBike.currentKm || 0}`).
3. **Interactive Map (`LeafletMap.jsx`, `LiveTrackingPage.jsx`, `geoUtils.js`)**
   - `LeafletMap.jsx` wraps Leaflet `1.9.4` directly (no `react-leaflet` dependency) with street/satellite tile switching, zoom controls, custom SVG motorcycle markers, store markers, route playback polylines, geofence circles, and polygon Marked Area rendering/drawing.
   - `LiveTrackingPage.jsx` integrates `markedAreas` from `AppContext` (`localStorage` key `bike_service_system_marked_areas`), location/coordinate search, polygon drawing/editing/deletion, and point-in-polygon vehicle status without random coordinate simulation.

---

## 4. Cancel Button Redesign Specification

### 4.1 Current State & Gaps
- **Verified Existing Pattern:** Cancel buttons exist in `Header.jsx`, `Sidebar.jsx`, `AdminManagementPage.jsx`, `BikesPage.jsx`, `JobCardsPage.jsx`, `ManageBrandsPage.jsx`, `NextServicePage.jsx`, `ProfilePage.jsx`, `RepairHistoryPage.jsx`, `ServicePredictionPage.jsx`, `ServiceTrackingPage.jsx`, `StoreLocationsPage.jsx`, `UsersPage.jsx`, `LiveTrackingPage.jsx`, and `CustomerApp.jsx`.
- **Remaining Architectural Gap:** There is no dedicated `<ActionButton>` / `<Button variant="cancel">` component or `<ModalFooter>` slot in `Modal.jsx`, so spacing (`gap: 8px` vs `10px` vs `12px`) and order are still controlled per-page via inline styles.

### 4.2 Design Tokens & Visual Specification

| Token / Property | Cancel / Secondary (`btn-secondary`, `btn-cancel`) | Primary (`btn-primary`) | Destructive (`btn-danger` / `btn-outline-danger`) |
| :--- | :--- | :--- | :--- |
| **Height** | `min-height: 40px` (`32px` for `.btn-sm`) | `min-height: 40px` (`32px` for `.btn-sm`) | `min-height: 40px` (`32px` for `.btn-sm`) |
| **Padding** | `0 18px` (`0 12px` for `.btn-sm`) | `0 18px` (`0 12px` for `.btn-sm`) | `0 18px` (`0 12px` for `.btn-sm`) |
| **Typography** | `13.5px`, `font-weight: 600` (`Inter`) | `13.5px`, `font-weight: 700` (`Inter`) | `13.5px`, `font-weight: 700` (`Inter`) |
| **Border Radius** | `10px` (`8px` for `.btn-sm`) | `10px` (`8px` for `.btn-sm`) | `10px` (`8px` for `.btn-sm`) |
| **Colors (Default)** | `bg: #ffffff`, `text: #334155`, `border: 1.5px solid #cbd5e1` | `bg: linear-gradient(180deg, #356DF3, #2957CC)`, `text: #ffffff` | `bg: #dc2626` or outlined `#fee2e2` / `#dc2626` |
| **Hover State** | `bg: #f8fafc`, `border: #94a3b8`, `text: #0f172a`, `translateY(-1px)` | Darker blue gradient + elevated shadow | Darker crimson `#b91c1c` |
| **Focus-Visible** | `outline: 2px solid #356DF3; outline-offset: 2px;` | `outline: 2px solid #1d4ed8; outline-offset: 2px;` | `outline: 2px solid #dc2626; outline-offset: 2px;` |
| **Active State** | `bg: #f1f5f9`, `border: #64748b`, `translateY(0)` | `translateY(0)` | `translateY(0)` |

### 4.3 Placement, Spacing & Responsive Rules
- **Placement:** Always render Cancel immediately to the **left** of the primary action (`Save`, `Submit`, `Update`, `Confirm`) inside a right-aligned flex row (`display: flex; justify-content: flex-end; gap: 10px;`).
- **Separation from Destructive Actions:** Never style Cancel in red or place it adjacent to a primary `Delete` button without clear visual separation (e.g., left-aligned `Delete` vs right-aligned `Cancel` + `Save`, or dedicated confirmation modal).
- **Mobile Responsive (`<= 640px`):** Action rows wrap (`flex-wrap: wrap; gap: 10px;`) with `flex: 1 1 120px;` on child buttons so Cancel and Submit stack/share row width evenly without horizontal overflow.

### 4.4 Reusable Component Recommendation
- **Proposed New Component:** `src/components/common/Button.jsx` supporting `variant="primary" | "secondary" | "cancel" | "danger"`, `size="sm" | "md"`, `type="button" | "submit"`, and `disabled`.
- **Optional `Modal.jsx` Enhancement:** Add an optional `footer` prop to `Modal.jsx` rendering `<div className="modal-actions">{footer}</div>` to eliminate inline footer `style={{ display: 'flex', ... }}` duplication across pages.

---

## 5. Current Kilometer (KM) Feature Specification

### 5.1 Functional Requirements
1. **Previous KM Retrieval:** When a bike is selected in **Log Bike Maintenance & Service** (`ServiceTrackingPage.jsx`), calculate `previousBikeKm` as `Math.max(bike.currentKm, bike.lastServiceKm, max(serviceRecords.filter(by regNo).serviceKm))`.
2. **Current Kilometer (KM) Input:** Numeric input (`type="number"`, `required`, `min={previousBikeKm}`) labeled **`Current Kilometer (KM) *`**.
3. **Validation Rules:**
   - Reject empty, non-numeric (`!Number.isFinite(val)`), or negative (`< 0`) values.
   - Reject readings lower than `previousBikeKm` (`enteredKm < previousBikeKm`) with explicit error:
     `"Current Kilometer (KM) cannot be lower than the previous recorded reading (X km)."`
   - Block form submission when invalid.
4. **Distance Travelled Calculation:** Compute `distanceTravelled = enteredKm - previousBikeKm` live in the UI.
5. **Service Record Persistence & History Preservation:**
   - Save `serviceKm`, `previousKm`, and `distanceTravelled` on the newly created record in `serviceRecords` (`AppContext.jsx`).
   - **Immutable History:** Never overwrite `serviceKm` on older `serviceRecords`.
6. **Bike Latest Odometer & Reminder Sync:**
   - Update matching bike in `bikesList`:
     - `lastServiceDate = newRecord.serviceDate`
     - `lastServiceKm = srvKm`
     - `currentKm = Math.max(existingCurrentKm, srvKm)`
     - `nextServiceDate` & `nextServiceKm = srvKm + intervalKm` (or user-edited forecast)
   - `NextServicePage.jsx`, `BikesPage.jsx`, and `ServicePredictionPage.jsx` automatically consume `bike.currentKm`, `bike.lastServiceKm`, and `bike.nextServiceKm`.

### 5.2 Calculation Examples

| Scenario | Bike Reg No | Previous KM | Entered Current KM | Validation Result | Distance Travelled | Next Service Target (+3,000 km) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Valid Periodic Service** | `TN 30 AB 1234` | `12,500 km` | `15,000 km` | **PASS** | `+2,500 km` | `18,000 km` |
| **Same-Day Re-entry** | `TN 30 AB 1234` | `15,000 km` | `15,000 km` | **PASS** | `0 km` | `18,000 km` |
| **Odometer Rollback** | `TN 30 AB 1234` | `15,000 km` | `14,200 km` | **FAIL** (Blocked) | `—` | Unchanged |
| **Negative Input** | `TN 27 BK 9021` | `12,200 km` | `-500` | **FAIL** (Blocked) | `—` | Unchanged |
| **Decimal Input** | `TN 27 BK 9021` | `12,200 km` | `12,450.7` | Rounded to `12,451 km` | `+251 km` | `15,451 km` |

### 5.3 Display Locations
- **Service Tracking Table (`ServiceTrackingPage.jsx`):** Displays `srv.serviceKm` and `+srv.distanceTravelled km travelled` when `> 0`.
- **Service Receipt Modal (`ServiceTrackingPage.jsx`):** Displays `srv.serviceKm` alongside `srv.nextServiceKm`.
- **Bike Details & Registry (`BikesPage.jsx`):** Displays `currentKm`, `lastServiceKm`, and `nextServiceKm`.
- **Service Reminders (`NextServicePage.jsx` & `ServicePredictionPage.jsx`):** Uses `currentKm` vs `nextServiceKm` to classify `Healthy`, `Due Soon`, and `Overdue`.

---

## 6. Marked and Unmarked Area Map Specification

### 6.1 Existing Leaflet Reuse (`src/components/common/LeafletMap.jsx`)
- Reuses `leaflet` (`^1.9.4`) directly via `mapInstanceRef` without adding `react-leaflet` or `leaflet-draw`.
- Supports street (`OpenStreetMap`) and satellite (`Esri World Imagery`) layers, zoom in/out, reset center, vehicle markers, store markers, route playback polylines, polygon `markedAreas`, and interactive click-to-draw polygon mode.

### 6.2 Marked Areas Functional Specification
- **Creating Boundaries:** Authorized users click **Mark Area**, click 3 or more points on the map (`crosshair` cursor, numbered preview vertices + dashed polygon), enter an **Area Name**, select color (**Blue `#2563eb`** or **Green `#10b981`**), and click **Save Marked Area**.
- **Viewing & Selecting:** Clicking a polygon on the map or a Marked Area pill focuses/centers the map and shows area name, vertex count, and count of vehicles currently inside.
- **Editing & Deleting:** Inline edit allows renaming and changing color; delete removes the area from `AppContext` and `localStorage` (recommended enhancement: add a confirmation prompt before deletion and vertex drag-editing if finer geometry adjustment is needed).

### 6.3 Unmarked Areas & Map Legend
- **Visual Distinction:** Regions outside all saved polygons retain the neutral OpenStreetMap / Esri base map styling. Marked regions render translucent blue (`#2563eb`) or green (`#10b981`) fills with crisp borders.
- **Map Legend:** Explicitly displays:
  - Marked Area (Blue)
  - Marked Area (Green)
  - Unmarked Area (Outside Boundaries)
- **Multiple & Overlapping Areas:** All saved polygons render simultaneously; `findMarkedAreaForCoordinates` returns the first matching polygon in array order (recommended enhancement: return all matching polygons if overlapping zones need multi-zone attribution).

### 6.4 GPS Integration & Point-in-Polygon Detection (`src/utils/geoUtils.js`)
- **Algorithm:** Ray-casting `isPointInPolygon(lat, lng, polygonPoints)` verifies whether a vehicle's coordinates fall inside any marked boundary.
- **Strict Real-Coordinate Rule:** Random coordinate generation (`Math.random()`) is prohibited. Vehicles without valid finite `lat`/`lng` must display **`GPS Unavailable`** rather than fabricated coordinates.
- **Status Labels:**
  - Inside polygon: `Inside Marked Area: <Area Name>`
  - Outside all polygons: `Outside All Marked Areas (Unmarked Area)`
  - Missing coordinates (future live GPS): `GPS Unavailable`

---

## 7. Admin and Super Admin Permissions

| Capability | Super Admin (`super_admin`) | Operations Admin (`admin`) | Customer (`/customer`) |
| :--- | :---: | :---: | :---: |
| Common Login (`/login`) | Yes | Yes | No (uses `/customer`) |
| View Dashboard & Analytics | Yes | Yes | No |
| Log Service & Current KM | Yes | Yes | No |
| View Live Map & Marked Areas | Yes | Yes | Own bike only |
| Create / Edit / Delete Marked Areas | Yes | Yes | **No** |
| Admin / Store / Branding Pages | Yes | **Blocked (`RequireSuperAdmin`)** | **No** |

---

## 8. UI/UX Design Standards
- **Shell:** Dark navy sidebar (`#090e1a`–`#060a12`), light content workspace (`#f8fafc`), crisp white cards (`#ffffff`) with subtle borders (`#e2e8f0`) and soft shadows.
- **Typography:** `Inter` font family with clear tabular weights (`600`–`800` for KPIs and headings, `13px–14px` body).
- **Semantic Accents:** Electric Blue (`#356DF3`) primary actions, Emerald (`#10b981`) success/healthy, Amber (`#f59e0b`) due-soon warnings, Red (`#dc2626`/`#e11d48`) overdue/errors/destructive actions.
- **Simplicity:** Keep forms focused, avoid crowded badges inside table cells, and wrap action buttons cleanly on mobile (`<= 640px`).

---

## 9. Technical Architecture and Data Flow

```text
[User Action: Log Service]
   └─> ServiceTrackingPage.jsx (validates Current KM >= Previous KM)
         └─> AppContext.addServiceRecord()
               ├─> Prepends immutable record to serviceRecords (localStorage: bike_service_system_services)
               └─> Updates matching bike in bikesList (localStorage: bike_service_system_bikes)
                     └─> Consumed by BikesPage, NextServicePage, ServicePredictionPage, ReportsPage

[User Action: Draw/Edit Marked Area]
   └─> LiveTrackingPage.jsx + LeafletMap.jsx (click vertices, name, color)
         └─> AppContext.addMarkedArea / updateMarkedArea / deleteMarkedArea
               └─> Persisted in localStorage (bike_service_system_marked_areas)
                     └─> geoUtils.findMarkedAreaForCoordinates(bike.lat, bike.lng, markedAreas)
                           └─> Updates vehicle Inside / Unmarked Area status
```

---

## 10. Data Structures and Storage Requirements

### 10.1 Service Record (`bike_service_system_services`)
```json
{
  "id": "srv-123456",
  "jobNo": null,
  "bikeId": "bike-1",
  "regNo": "TN 30 AB 1234",
  "ownerName": "Bharath Kumar",
  "ownerPhone": "9876543210",
  "serviceDate": "2026-11-28",
  "serviceKm": 15000,
  "previousKm": 12500,
  "distanceTravelled": 2500,
  "serviceCost": 1250,
  "serviceType": "General Periodic Service",
  "technician": "Mani",
  "items": { "engineOil": true, "brakeOil": true },
  "notes": "Scheduled periodic inspection.",
  "nextServiceDate": "2027-02-26",
  "nextServiceKm": 18000
}
```

### 10.2 Marked Area (`bike_service_system_marked_areas`)
```json
{
  "id": "area-salem-central",
  "name": "Salem Central Hub Zone",
  "color": "#2563eb",
  "description": "Primary service bay & pickup coverage perimeter",
  "points": [[11.6685, 78.1405], [11.6692, 78.1518], [11.6602, 78.1525], [11.6595, 78.1412]],
  "createdAt": "2026-09-01"
}
```

---

## 11. Implementation Roadmap

1. **Phase 1 – Reusable Button & Modal Footer Standardization:**
   - Optional: Extract `src/components/common/Button.jsx` and `footer` slot in `src/components/common/Modal.jsx`; migrate remaining inline modal footer wrappers to `.modal-actions`.
2. **Phase 2 – Service Kilometer & Receipt Enhancements:**
   - Verify `ServiceTrackingPage.jsx` receipt modal displays `previousKm` and `distanceTravelled` alongside `serviceKm`.
   - Ensure `BikesPage.jsx` and `ReportsPage.jsx` surface `distanceTravelled` where helpful.
3. **Phase 3 – Marked Area UX Polish & Backend Readiness:**
   - Add delete confirmation dialog before `deleteMarkedArea(area.id)`.
   - Add `GPS Unavailable` badge handling when `bike.lat` or `bike.lng` is missing/null.
   - Replace `localStorage` persistence hooks with REST/WebSocket API adapters when backend endpoints are ready.

---

## 12. Detailed Testing Plan

| Category | Test Case | Expected Result |
| :--- | :--- | :--- |
| **Cancel Buttons** | Open modals on Dashboard, Bikes, Service Tracking, Repair History, Job Cards, Users, Stores, Profile, and Customer App. | All Cancel buttons share neutral outlined styling (`40px` height, `#cbd5e1` border), sit beside primary CTA, and wrap cleanly on mobile. |
| **Current KM – Valid** | Select bike with `12,500 km`, enter `15,000 km`, submit. | Distance Travelled shows `2,500 km`; record saves with `15,000 km`; bike `currentKm` updates to `15,000 km`; older records remain unchanged. |
| **Current KM – Invalid** | Enter `-10`, empty string, or `11,000 km` (< `12,500 km`). | Inline red validation message appears; form submission is blocked. |
| **Service Reminders** | After logging `15,000 km` (next `18,000 km`), open `/admin/next-service` and `/admin/service-prediction`. | Calculations reflect `15,000 km` current and `18,000 km` next target. |
| **Marked Areas** | Click **Mark Area**, click 4 points on map, name `"North Zone"`, save, refresh browser. | Polygon renders in chosen color; persists after refresh; vehicle coordinates inside show `Inside Marked Area: North Zone`. |
| **Unmarked Areas** | Select vehicle with coordinates outside all polygons. | Status shows `Outside All Marked Areas (Unmarked Area)`. |
| **Edit / Delete Area** | Rename a Marked Area; delete another Marked Area. | Changes update map immediately and persist in `localStorage`. |
| **Role Permissions** | Log in as Operations Admin vs Super Admin; visit `/customer`. | Both Admin roles can manage areas on `/admin/live-tracking`; Operations Admin cannot access `/admin/admins`, `/admin/stores`, `/admin/branding`. |
| **Regression** | Run `npm run lint` and `npm run build`; navigate Dashboard, Reports, Service Tracking, Repair History. | `0` lint errors, clean Vite production build, no runtime console errors. |

---

## 13. Acceptance Criteria
- Every Cancel button across Admin and Customer portals renders with uniform height, border, spacing, hover/active states, and mobile responsiveness.
- Service logging displays `Previous KM`, validates `Current Kilometer (KM) >= Previous KM`, computes `Distance Travelled`, preserves historical records, and updates bike odometer and reminders.
- Authorized Admins/Super Admins can draw, name, edit, delete, search, and persist polygon Marked Areas; Unmarked Areas are clearly distinguished via map styling and legend; vehicle status reflects actual coordinates without random simulation.

---

## 14. Risks and Dependencies
- **LocalStorage Quotas & Multi-Device Sync:** Data stored in `localStorage` is browser-local until migrated to a backend database.
- **Tile Server Reachability:** OpenStreetMap and Esri World Imagery tiles require internet connectivity.
- **Hardware GPS Feed:** Live vehicle coordinates currently come from `mockData.js` seed coordinates until connected to an MQTT/WebSocket/REST telemetry backend.

---

## 15. Final Implementation Instructions
1. Preserve all existing authentication flows (`ProtectedRoute`, `RequireSuperAdmin`, `CustomerApp` PIN login).
2. Do not introduce external UI libraries or `react-leaflet`; build on `leaflet` (`1.9.4`) and existing CSS tokens.
3. Never fabricate random GPS coordinates (`Math.random()`). Handle missing GPS coordinates explicitly as unavailable.
4. Run `npm run lint` and `npm run build` after any future edits and verify all Checklist items in Section 12.
