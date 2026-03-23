# 🤖 AI SaaS Platform

A full-stack AI-powered SaaS application offering article generation, image manipulation, resume review, and more — all behind a clean user dashboard with authentication and usage plans.

---

## ✨ Features

| Feature | Description |
|---|---|
| 📝 AI Article Generation | Generate full articles from a prompt using Groq LLMs |
| 💡 Blog Title Generation | Get catchy blog title ideas instantly |
| 🖼️ AI Image Generation | Create images from text descriptions |
| ✂️ Background Removal | Upload an image and strip its background |
| 🧹 Object Removal | Remove specific objects from photos |
| 📄 Resume Review | Upload a resume and get AI-powered feedback |
| 🗂️ User Dashboard | View, manage, and delete all your saved creations |

---

## 🛠️ Tech Stack

### Frontend
- [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Clerk](https://clerk.com/) — authentication & user management

### Backend
- [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)
- Clerk middleware for route protection

### Database
- [Neon](https://neon.tech/) (serverless Postgres)

### AI & Media Providers
- [Groq](https://groq.com/) — LLM inference (article & title generation, resume review)
- [Clipdrop](https://clipdrop.co/) — background removal, object removal
- [Cloudinary](https://cloudinary.com/) — image storage & delivery

---

## 📁 Project Structure

```
.
├── client/          # React + Vite frontend
└── backend/         # Express API server
```

---

## ✅ Prerequisites

- Node.js 18+
- npm
- [Clerk](https://clerk.com/) account and API keys
- [Neon](https://neon.tech/) / PostgreSQL database URL
- [Groq](https://groq.com/) API key
- [Clipdrop](https://clipdrop.co/) API key
- [Cloudinary](https://cloudinary.com/) account credentials

---

## 🔐 Environment Variables

### `backend/.env`

```env
DATABASE_URL=your_neon_or_postgres_url

CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

GROQ_API_KEY=your_groq_api_key
LLM_MODEL=llama-3.1-8b-instant

CLIPDROP_API_KEY=your_clipdrop_api_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

PORT=3000
```

### `client/.env`

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# Optional — only needed if frontend and backend run on different origins
# VITE_API_BASE_URL=http://localhost:3000
```

> ⚠️ **Never commit real secrets to git.** Rotate any keys that were accidentally exposed.

---

## 🚀 Installation

Install dependencies for both apps:

```bash
# Backend
cd backend
npm install

# Frontend
cd ../client
npm install
```

---

## 🧑‍💻 Running in Development

Open **two terminals**:

**Terminal 1 — Backend**
```bash
cd backend
npm run server
```
Runs at `http://localhost:3000`

**Terminal 2 — Frontend**
```bash
cd client
npm run dev
```
Runs at `http://localhost:5173` (Vite default)

---

## 🏗️ Building for Production

```bash
cd client
npm run build
```

---

## 🔌 API Reference

Base path: `/api/ai`

All routes require a valid Clerk session token.

| Method | Endpoint | Description | Multipart Fields |
|---|---|---|---|
| `POST` | `/generate-article` | Generate a full article | — |
| `POST` | `/generate-blog-title` | Suggest blog titles | — |
| `POST` | `/generate-image` | Generate an image from text | — |
| `POST` | `/remove-background` | Remove image background | `image` |
| `POST` | `/remove-object` | Remove an object from an image | `image`, `object` |
| `POST` | `/review-resume` | AI resume feedback | `resume` |
| `GET` | `/creations` | Fetch user's saved creations | — |
| `DELETE` | `/creations/:id` | Delete a specific creation | — |

---

## 👤 Auth & Plans

- All `/api/ai/*` routes are **protected** and require Clerk authentication.
- The following features are **premium-only**:
  - AI image generation
  - Background removal
  - Object removal
- Free plan users have **limited usage** on text-based endpoints (article & title generation, resume review).

---

## 🗂️ Dashboard

- Every successful generation or review is saved to the `creations` table in the database.
- The dashboard fetches saved items via `GET /api/ai/creations`.
- Users can delete any item with the delete button, which calls `DELETE /api/ai/creations/:id`.
- Creations are **user-scoped** — each user only sees their own.

---

## 🐛 Troubleshooting

| Symptom | Likely Cause |
|---|---|
| No creations shown | Backend may not be running, or user is not signed in |
| `401` / `403` errors | Check Clerk keys and ensure the auth token is being forwarded correctly |
| "Feature blocked" message | The endpoint requires a premium plan |
| File upload fails | Confirm correct form field names: `image`, `object`, or `resume` |
| Provider errors (Groq, Clipdrop, Cloudinary) | Verify all API keys are set correctly in `backend/.env` |

---

## 📜 License

This project is for personal/educational use. Replace with your preferred license before distribution.
