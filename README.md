<div align="center">

# 🚗 DriveFleet — Premium Car Rental Platform

### *Drive Your Dream Car Today — Book Instantly, Drive Confidently*

<p>
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Firebase-Auth-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" />
</p>

<p>
  <a href="https://drivefleet-client-nine.vercel.app"><img src="https://img.shields.io/badge/Live_Demo-Vercel-black?style=for-the-badge&logo=vercel" /></a>
  <a href="https://drivefleet-server-orpin.vercel.app"><img src="https://img.shields.io/badge/Live_API-Running-success?style=for-the-badge&logo=node.js" /></a>
  <a href="https://github.com/fahim3101/drivefleet-server"><img src="https://img.shields.io/badge/Backend_Repo-Click-24292e?style=for-the-badge&logo=github" /></a>
</p>

> **🆕 MVP Sep 2026** — Booking conflict prevention • Mock Payment (bKash/Nagad/Card) • Reviews & Ratings • Admin Control Center • Direct Image Upload (imgbb) • Email Notifications • Dark/Light Theme • Skeleton + Retry • SEO + Code-Splitting • Responsive Cards

</div>

---

## ✨ Why DriveFleet?

A **marketplace** — not just your cars. Anyone can list, anyone can book. You as **Admin** control everything: remove spam, manage all records.

```
User A (Owner)  →  Add Car  →  DriveFleet Marketplace  ←  Book  ←  User B (Renter)
                                         ↕
                                   Admin Control
                              (delete any car/booking/review)
```

---

## 🌟 Features

<details open>
<summary><b>🔐 Authentication — Secure & Seamless</b></summary>

- Email/Password + **Google OAuth** via Firebase
- JWT in **HTTPOnly, Secure, SameSite=None** cookies — XSS-proof
- `onAuthStateChanged` persistent session
- `PrivateRoute` + `verifyToken` gate
- **Admin gate:** `fr87817833@gmail.com / admin123` at `/admin/login` → `localStorage.isAdmin` + server `adminToken`

</details>

<details open>
<summary><b>🚗 Discovery — Fast & Smart</b></summary>

- **Debounced search** (500ms) on `carName` — MongoDB `$regex`
- **Filters:** Type (SUV/Sedan/Luxury/Electric...), Sort (newest/price_low/price_high/popular), Pagination (9/page)
- **Image fallback** + **lazy loading** + **Wishlist** (localStorage ❤️)
- `CarCard` hover scale + status badge + booking count

</details>

<details open>
<summary><b>📅 Booking — Real Business Logic</b></summary>

- **Date range** required, `calcDays()` total price
- **Driver toggle** (+$20/day)
- **Payment mock** — Bkash/Nagad/Card/Cash → `paymentStatus: paid` + `transactionId: mock_*`
- **Conflict prevention** — server checks overlapping `startDate/endDate` for same `carId` (409 if booked)
- `bookingCount` atomic `$inc` + decrement on cancel
- **Email** mock → `fr87817833@gmail.com` gets confirmation (Nodemailer / console)

</details>

<details open>
<summary><b>🛠️ Owner Tools</b></summary>

- **Add Car** — file upload via **imgbb** (`VITE_IMGBB_API_KEY`) or URL, preview, validation (`price>0`, `seats 1-50`)
- **My Added Cars** — desktop table + mobile cards (responsive), Edit modal (image upload), Delete confirm
- **My Bookings** — grid with dates, total, driver, notes, cancel

</details>

<details open>
<summary><b>⭐ Reviews & Social Proof</b></summary>

- `POST /reviews` 1-5 ★ + comment, `GET /reviews/:carId` avg rating
- Owner star display uses real `avgRating` (fallback booking count)
- Delete own review

</details>

<details open>
<summary><b>👑 Admin Control Center — Beautiful Tabs</b></summary>

- **Overview:** 6 stat cards (Total Cars, Available, Unavailable, Bookings, Revenue, Types) + Cars by Type + Monthly chart + Recent
- **All Cars:** Search + list with `View` (new tab) / `Toggle` availability / `Delete` any car + cleanup bookings/reviews
- **All Bookings:** Table with user, dates, total, delete any
- **Reviews:** List with delete
- **Users:** Distinct emails with car/booking/review counts (spam >5 = red)
- Access: `/admin/login` → `fr87817833@gmail.com / admin123` → `isAdmin` + server cookies

</details>

<details open>
<summary><b>🎨 UI/UX — Production Grade</b></summary>

- **Dark/Light** toggle (`ThemeProvider`, `localStorage.theme`, `html.light` overrides) — hero stays dark for contrast
- **Skeleton loaders** (`CardGridSkeleton`, `TableSkeleton`) + **Retry** on error
- **Responsive:** Mobile cards for `MyAddedCars`, `Explore` filters stack
- **Toasts** (react-hot-toast), **Icons** (react-icons), **404** `vercel.json` SPA rewrite

</details>

---

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| **Framework** | React 18 + Vite 5 + React Router 6 |
| **Styling** | Tailwind CSS 3 + PostCSS + Poppins |
| **State** | Context API (`AuthProvider`, `ThemeProvider`) |
| **HTTP** | Axios instance `api/axios.js` (`withCredentials`, 401 interceptor) |
| **Auth** | Firebase, JWT (7d) |
| **Upload** | imgbb API (`utils/imageUpload.js`) |
| **Deploy** | Vercel — `vercel.json` rewrites SPA |

---

## 📁 Structure

```
src/
├── api/axios.js              # instance + interceptor
├── components/  CarCard, Navbar, Footer, Spinner, Skeleton
├── firebase/    firebase.config.js
├── layouts/     MainLayout
├── pages/       Home, ExploreCars, CarDetails (+Reviews+Payment), AddCar, MyAddedCars, MyBookings, Wishlist, AdminDashboard, AdminLogin, Login, Register, NotFound
├── providers/   AuthProvider, ThemeProvider
├── routes/      router.jsx (React.lazy + Suspense) + PrivateRoute
├── utils/       imageUpload.js
└── index.css    # dark + html.light overrides
```

---

## 🚀 Quick Start

```bash
git clone https://github.com/fahim3101/drivefleet-client.git
cd drivefleet-client
npm install
cp .env.example .env   # fill below
npm run dev            # http://localhost:5173
```

**Test admin:** `fr87817833@gmail.com / admin123` at `/admin/login` (direct, no Firebase needed)

---

## 🔑 Env Vars

```env
# Firebase (Project Settings)
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_API_URL=http://localhost:5000
VITE_IMGBB_API_KEY= # https://api.imgbb.com/
VITE_ADMIN_EMAIL=fr87817833@gmail.com
```

---

## 🗺️ Routes

| Path | Access | Description |
|------|--------|-------------|
| `/` | Public | Hero + 6 latest + Why Choose + Testimonials |
| `/explore` | Public | Search, filter, sort, pagination |
| `/cars/:id` | Public | Details + date+payment booking + reviews |
| `/wishlist` | Public | localStorage |
| `/add-car` | 🔒 | Image upload + validation |
| `/my-cars` | 🔒 | Manage own |
| `/my-bookings` | 🔒 | Cancel |
| `/admin` | 👑 | Control Center (tabs) |
| `/admin/login` | Public | fr87817833@gmail.com / admin123 |
| `/login` `/register` | Public | Auth |
| `*` | Public | 404 |

---

## 🔐 Auth Flow

```
Firebase Login → POST /jwt {email} → HTTPOnly cookie token (7d) → verifyToken → PrivateRoute
Direct Admin: POST /admin/direct-login {email, password} → token + adminToken → verifyAdmin
```

---

## ☁️ Deploy (Vercel)

1. Import GitHub repo → Vercel
2. Add env vars (Production+Preview+Development)
3. Build: `npm run build` → Output: `dist`
4. Add `https://drivefleet-client-nine.vercel.app` to server `cors.origin` + Firebase Authorized Domains
5. `vercel.json` ensures SPA routing

---

## 📸 Screenshots

> Hero (dark bg white text) • Explore (debounced) • CarDetails (date+payment+reviews) • Admin Tabs (cars/bookings/users)

---

## 🤝 Contributing & License

PR welcome — `npm run lint` before push. **MIT** — Made with ❤️ by [Fahim Rana](https://github.com/fahim3101)

📧 fahimrana3101@gmail.com | 📱 +8801818858015 | [LinkedIn](https://www.linkedin.com/in/fahim-rana/) | [Facebook](https://www.facebook.com/fahim2855) | [Instagram](https://www.instagram.com/_fahiiiim_/)
