# 🚗 DriveFleet — Premium Car Rental Platform

**Live Site:** [https://drivefleet-client.vercel.app](https://drivefleet-client.vercel.app)

## 🌟 Features

- 🔐 **Secure Authentication** — Firebase Email/Password + Google login with JWT stored in HTTPOnly cookies for maximum security
- 🚗 **Smart Car Search & Filter** — Search cars by name using MongoDB `$regex`, filter by car type using `$in` operator
- 📋 **Complete Booking System** — Book any available car with driver option, special notes, and instant confirmation
- 🛠️ **Full Car Management** — Car owners can add, edit, and delete their own listings with real-time updates
- 📱 **Fully Responsive Design** — Beautiful dark-themed UI optimized for mobile, tablet, and desktop

## 🛠️ Tech Stack

**Frontend:** React, Vite, Tailwind CSS, React Router DOM, Axios, Firebase, React Hot Toast, React Icons

**Backend:** Node.js, Express.js, MongoDB, JWT, Cookie-Parser

## ⚙️ Setup

1. Clone this repository
2. Run `npm install`
3. Copy `.env.example` to `.env` and fill in your Firebase credentials
4. Set `VITE_API_URL` to your backend URL
5. Run `npm run dev`

## 📁 Environment Variables

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_API_URL=
```
