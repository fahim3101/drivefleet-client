# 🚗 DriveFleet — Premium Car Rental Platform (Client)

A modern, full-featured car rental web application that connects car owners with renters. Built with **React 18**, **Vite**, **Tailwind CSS**, and **Firebase Authentication**, DriveFleet offers a seamless, secure, and responsive experience for browsing, listing, and booking vehicles.

> **Live Site:** [https://drivefleet-client-nine.vercel.app](https://drivefleet-client-nine.vercel.app/)
> **Live API:** [https://drivefleet-server-orpin.vercel.app](https://drivefleet-server-orpin.vercel.app/)
> **Backend Repo:** [github.com/fahim3101/drivefleet-server](https://github.com/fahim3101/drivefleet-server) — REST API powering this client.

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [Routes & Pages](#-routes--pages)
- [Authentication Flow](#-authentication-flow)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Features

### 🔐 Secure Authentication
- **Firebase Email/Password** signup & login
- **Google OAuth** one-click sign-in
- JWT tokens issued by the backend and stored in **HTTPOnly cookies** — immune to XSS
- Persistent sessions across reloads with Firebase `onAuthStateChanged`
- Protected routes via `<PrivateRoute />` wrapper component

### 🚗 Smart Car Discovery
- **Live search** by car name (debounced, backed by MongoDB `$regex`)
- **Filter** by car type — Sedan, SUV, Hatchback, Luxury, Electric, etc.
- **"Available Cars"** toggle to hide booked-out vehicles
- Pagination-ready grid of cards with hover animations

### 📋 Complete Booking System
- Date-picker based booking with instant confirmation
- Optional **driver inclusion** toggle
- Special notes field for custom requests
- "My Bookings" dashboard with one-click cancellation
- Automatic `bookingCount` increment on the car listing

### 🛠️ Car Owner Tools
- **Add Car** form with image URL, description, pricing, location
- **Edit** any of your own listings
- **Delete** with confirmation modal
- Real-time CRUD against the backend (no full page reload)

### 🎨 Polished UI / UX
- **Custom dark theme** — slate/black with vibrant accents
- Fully **responsive** — mobile, tablet, desktop breakpoints
- **React Hot Toast** for non-blocking notifications
- **React Icons** (Feather/Heroicons set) for crisp iconography
- Smooth **page transitions** and skeleton loaders via `<Spinner />`

---

## 🛠️ Tech Stack

| Layer            | Technology                                      |
| ---------------- | ----------------------------------------------- |
| **Framework**    | React 18 (Hooks, Context API)                   |
| **Build Tool**   | Vite 5 (HMR, ESBuild)                           |
| **Styling**      | Tailwind CSS 3 + PostCSS                        |
| **Routing**      | React Router DOM 6                              |
| **HTTP Client**  | Axios (with `withCredentials: true`)            |
| **Auth**         | Firebase Authentication                         |
| **State**        | React Context (`AuthProvider`)                  |
| **Notifications**| React Hot Toast                                 |
| **Icons**        | React Icons                                     |
| **Linting**      | ESLint + React Hooks plugin                     |

---

## 📁 Project Structure

```
drivefleet-client/
├── public/
├── src/
│   ├── components/         # Reusable UI (CarCard, Navbar, Footer, Spinner)
│   ├── firebase/           # firebase.config.js
│   ├── layouts/            # MainLayout (Navbar + Footer wrapper)
│   ├── pages/              # Route-level components
│   │   ├── Home.jsx
│   │   ├── ExploreCars.jsx
│   │   ├── CarDetails.jsx
│   │   ├── AddCar.jsx
│   │   ├── MyAddedCars.jsx
│   │   ├── MyBookings.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── NotFound.jsx
│   ├── providers/          # AuthProvider.jsx — global auth state
│   ├── routes/             # router.jsx + PrivateRoute.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css           # Tailwind directives + global styles
├── .env.example
├── index.html
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9 (or pnpm / yarn)
- A **Firebase** project (free tier is fine)
- The `drivefleet-server` running locally or deployed

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/fahim3101/drivefleet-client.git
cd drivefleet-client

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# then fill in the values (see below)

# 4. Start the dev server
npm run dev
```

The app will start on **http://localhost:5173** by default.

---

## 🔑 Environment Variables

Create a `.env` file in the project root (never commit this file):

```env
# Firebase Web SDK config (from Firebase Console → Project Settings)
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# Backend API base URL
VITE_API_URL=http://localhost:5000
```

> ⚠️ All client-side env vars must be prefixed with `VITE_` to be exposed to the browser by Vite.

---

## 📜 Available Scripts

| Command           | Description                                       |
| ----------------- | ------------------------------------------------- |
| `npm run dev`     | Start the Vite dev server with HMR                |
| `npm run build`   | Build the production bundle into `./dist`         |
| `npm run preview` | Preview the production build locally              |
| `npm run lint`    | Run ESLint over all `.js` / `.jsx` files          |

---

## 🗺️ Routes & Pages

| Path                   | Page             | Access          | Description                              |
| ---------------------- | ---------------- | --------------- | ---------------------------------------- |
| `/`                    | `Home`           | Public          | Landing page with hero + featured cars   |
| `/cars`                | `ExploreCars`    | Public          | Browse, search & filter all listings     |
| `/cars/:id`            | `CarDetails`     | Public          | Single car view + booking form           |
| `/login`               | `Login`          | Public          | Email/password + Google sign-in          |
| `/register`            | `Register`       | Public          | Create a new account                     |
| `/add-car`             | `AddCar`         | 🔒 Private      | List a new car for rent                  |
| `/my-cars`             | `MyAddedCars`    | 🔒 Private      | Manage your own listings                 |
| `/my-bookings`         | `MyBookings`     | 🔒 Private      | View / cancel your bookings              |
| `*`                    | `NotFound`       | Public          | Custom 404 page                          |

---

## 🔐 Authentication Flow

```
┌────────────┐  Firebase sign-in   ┌──────────────┐
│   User     │ ──────────────────▶ │  Firebase    │ → idToken
└────────────┘                     └──────────────┘
       │                                  │
       │ idToken                          │
       ▼                                  ▼
┌──────────────────────────────────────────────────┐
│   POST /jwt  (sends Firebase idToken)            │
│   ← Sets HTTPOnly cookie: token=<JWT>            │
└──────────────────────────────────────────────────┘
       │
       │ Every subsequent request → cookie auto-sent
       ▼
┌──────────────────────────────────────────────────┐
│   Axios with { withCredentials: true }           │
│   → Server reads cookie → verifies JWT → grants  │
│     access to /my-cars, /bookings, etc.          │
└──────────────────────────────────────────────────┘
```

1. User signs in via Firebase (email/password or Google).
2. Client POSTs the Firebase `idToken` (or just the email) to `POST /jwt`.
3. Server mints a **7-day JWT** and sets it as an **HTTPOnly**, **Secure**, **SameSite=None** cookie.
4. Axios is configured globally with `withCredentials: true` so the cookie travels with every API call.
5. Server-side middleware (`verifyToken`) reads the cookie and gates protected routes.

---

## ☁️ Deployment

This project is deployed on **Vercel**.

### One-time setup

1. Push the repo to GitHub.
2. Import the project in [Vercel](https://vercel.com/new).
3. Set the **Root Directory** to `drivefleet-client` (if using a monorepo).
4. Add every env var from `.env` in **Settings → Environment Variables**.
5. Deploy 🚀

### Build settings (auto-detected)

- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### Post-deploy checklist

- Add your Vercel domain (e.g. `https://drivefleet-client-nine.vercel.app`) to the backend's `corsOptions.origin` allow-list.
- Update Firebase **Authentication → Authorized Domains** to include your Vercel URL.

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m "feat: add amazing feature"`
4. Push the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

Please run `npm run lint` before submitting a PR.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- [Vercel](https://vercel.com/) for hosting
- [Firebase](https://firebase.google.com/) for authentication
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for the database
- All the open-source maintainers whose libraries made this possible

---

## 📬 Contact

Have questions, feedback, or partnership ideas? Reach out:

- 📱 **Phone / WhatsApp:** [+8801818858015](tel:+8801818858015)
- 📧 **Email:** [fahimrana3101@gmail.com](mailto:fahimrana3101@gmail.com)

## 🌐 Follow Me

Stay connected and follow my journey:

- 💼 **LinkedIn:** [linkedin.com/in/fahim-rana](https://www.linkedin.com/in/fahim-rana/)
- 📘 **Facebook:** [facebook.com/fahim2855](https://www.facebook.com/fahim2855)
- 📸 **Instagram:** [instagram.com/_fahiiiim_](https://www.instagram.com/_fahiiiim_/)

---

**Made with ❤️ by [Fahim Rana](https://github.com/fahim3101)**
