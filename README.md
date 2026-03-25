# GolfCharity - Golf Subscription & Charity Platform

A full-stack subscription-based web application combining golf performance tracking, charity fundraising, and a monthly draw-based reward engine.

## 🚀 Live Demo
https://golf-charity-platform-bay.vercel.app/

## 📋 Test Credentials

### Admin Account
- **Email:** isakshi713@gmail.com
- **Password:** [your password]
- **Access:** Full admin panel with draw management, user management, charity management

### Test User Account
- **Email:** dsakshi1013@gmail.com
- **Password:** [your password]
- **Access:** User dashboard, scores, charity selection, subscription, winnings

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js |
| Styling | Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| Authentication | Supabase Auth |
| Deployment | Vercel |
| Version Control | GitHub |

---

## ✨ Features

### User Features
- Signup and login with secure authentication
- Monthly and yearly subscription plans
- Golf score entry (Stableford format, 1-45 range)
- Automatic rolling 5-score system (oldest replaced automatically)
- Charity selection from available charities
- Configurable charity contribution percentage
- Monthly draw participation
- Winnings overview with proof submission for verification

### Admin Features
- Role-based admin access (is_admin flag)
- User management — view all users, subscription status, plans
- Draw management — run monthly draws, view draw history
- Charity management — add, edit, delete charities
- Winner verification — approve/reject proof submissions
- Payment tracking — mark winners as paid

### Draw System
- 5 random winning numbers generated (1-45 range)
- Score matching logic:
  - 5 matches = 40% of prize pool (Jackpot)
  - 4 matches = 35% of prize pool
  - 3 matches = 25% of prize pool
- Jackpot rolls over if no 5-match winner

---

## 🗄️ Database Schema
```sql
profiles     — user data, subscription status, charity selection
scores       — golf scores linked to users (max 5 per user)
charities    — charity listings with descriptions and images
draws        — monthly draw records with winning numbers
winners      — winner records with verification and payment status
```

---

## 🔐 Security
- Supabase Auth for secure login/signup
- Role-based admin protection (is_admin column)
- Protected routes — unauthenticated users redirected to login
- Environment variables for sensitive keys

---

## 📱 Pages

| Page | Route | Access |
|------|-------|--------|
| Landing | / | Public |
| Login | /login | Public |
| Signup | /signup | Public |
| Dashboard | /dashboard | Authenticated |
| Admin Panel | /admin | Admin only |

---

## 🚀 Local Setup

### Prerequisites
- Node.js v18+
- npm

### Installation
```bash
# Clone the repository
git clone https://github.com/Sakshiingle/golf-charity-platform.git
# Navigate to project
cd golf-charity-platform

# Install dependencies
npm install

# Create .env file
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_anon_key

# Start development server
npm start
```

---

## 📦 Deployment

- Frontend deployed on **Vercel**
- Database hosted on **Supabase**
- Environment variables configured in Vercel dashboard

---

## 📁 Project Structure
```
src/
├── pages/
│   ├── Landing.js      — Public landing page
│   ├── Login.js        — Login page
│   ├── Signup.js       — Signup page
│   ├── Dashboard.js    — User dashboard
│   └── Admin.js        — Admin panel
├── components/
│   └── WinningsTab.js  — Winner verification component
├── supabase.js         — Supabase client configuration
└── App.js              — Routes and protected route wrapper
```

---

## 🧪 PRD Testing Checklist

- ✅ User signup & login
- ✅ Subscription flow (monthly and yearly)
- ✅ Score entry — 5-score rolling logic
- ✅ Draw system logic and simulation
- ✅ Charity selection and contribution calculation
- ✅ Winner verification flow and payout tracking
- ✅ User Dashboard — all modules functional
- ✅ Admin Panel — full control and usability
- ✅ Data accuracy across all modules
- ✅ Responsive design on mobile and desktop
- ✅ Error handling and edge cases





