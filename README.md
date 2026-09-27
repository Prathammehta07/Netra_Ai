# Netra AI — AI Healthcare Assistant

> **Complete AI-Powered Diabetic Retinopathy Analysis Web Application**

Netra AI is a production-style healthcare decision-support application built for automated screening of Diabetic Retinopathy (DR) using microvascular retinal fundus image processing, deep learning feature extraction, multi-language support (9 Indian languages), and automated clinical report generation.

---

## 🌟 Key Features

1. **AI Retinal Image Analysis**: Upload fundus images (JPG, JPEG, PNG <= 10MB) for instant microvascular feature detection and DR severity classification (No DR, Mild, Moderate, Severe, Proliferative).
2. **Interactive HTML5 Canvas Viewer**: Original vs. AI Highlights overlay toggle, zoom, pan, reset, and visual lesion bounding markers (Microaneurysms, Hemorrhages, Hard Exudates, Abnormal Vessels).
3. **Multi-Language Support (9 Indian Languages)**: Instant global i18n switching for English, Hindi, Gujarati, Marathi, Tamil, Telugu, Kannada, Malayalam, and Bengali.
4. **Professional Ophthalmic Review System**: Clinical decision support workflow allowing eye-care professionals to approve, request further review, override severity, and append clinical notes.
5. **PDF Report Generation**: Real-time downloadable clinical PDF report featuring Netra AI branding, patient metadata, image findings, AI risk rating, and professional review status.
6. **AI Healthcare Assistant Chatbot**: Multilingual general health chatbot with text-to-speech voice read-aloud functionality and emergency symptom recommendations.
7. **Government Healthcare Schemes Directory**: Official Indian government schemes (PM-JAY, NPCBVI, RVY, PMSSY) with direct links.
8. **Emergency Directory**: Regional emergency helplines (112, 108, 14416, 14567, 181) with direct `tel:` mobile dialing capabilities.

---

## 🏗️ Tech Stack & Architecture

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, HTML5 Canvas, React Router DOM, Axios, i18n Dictionary System.
- **Backend API**: Node.js, Express, TypeScript, Prisma ORM, JWT Authentication, bcryptjs, Multer File Processing, PDFKit Document Engine.
- **Database**: Prisma ORM with SQLite (Standalone zero-config) / PostgreSQL compatibility.
- **AI Microservice**: Python 3.13, FastAPI, Uvicorn, Pillow, NumPy, Pydantic (Supporting `AI_MODE=demo` and `AI_MODE=production`).

```
frontend (React 19 + Vite)
       ↓ (HTTP REST API)
backend (Node.js + Express + Prisma)
       ↓ (HTTP /analyze)
ai-service (Python FastAPI + RetinaNet Engine)
       ↓
Prisma SQLite / Postgres Database
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js (v18+)
- Python (3.10+)

### 2. Backend & Database Setup
```bash
cd backend
npm install
npx prisma db push
npx ts-node prisma/seed.ts
npm run dev
```
*Backend API will run on `http://localhost:5000`*

### 3. AI Service Setup
```bash
cd ai-service
pip install -r requirements.txt
python app/main.py
```
*AI Microservice will run on `http://localhost:8000`*

### 4. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Frontend application will launch at `http://localhost:3000`*

---

## 🔑 Demo Account Credentials

- **Email**: `demo@swasthmitra.org`
- **Password**: `password123`

---

## 📑 Implemented Pages & Routes

| Route | Page / Feature | Access Level |
|---|---|---|
| `/login` | Healthcare Login & Demo Access | Public |
| `/register` | Multi-field Registration | Public |
| `/forgot-password` | Password Reset Request | Public |
| `/onboarding` | 4-Step Patient Onboarding Wizard | Protected |
| `/dashboard` | Patient Dashboard & Stat Analytics | Protected |
| `/retinal-analysis` | Main AI Retinal Analysis & Canvas Viewer | Protected |
| `/retinal-analysis/:id` | Scan Detail & Clinical Report View | Protected |
| `/reports` | Filterable Report History & PDF Export | Protected |
| `/ai-assistant` | Multilingual Chatbot & Voice Read-Aloud | Protected |
| `/government-schemes` | Official Govt Schemes Directory | Protected |
| `/emergency-numbers` | Emergency Helplines & Mobile Dialing | Protected |
| `/profile` | Profile Management & Password Change | Protected |

---

## 📡 REST API Specifications

### Authentication
- `POST /api/auth/register` — Register new user & profile
- `POST /api/auth/login` — Authenticate & generate JWT
- `POST /api/auth/logout` — Invalidate user session
- `POST /api/auth/forgot-password` — Password reset trigger

### User Profile
- `GET /api/users/me` — Fetch current user profile
- `PUT /api/users/me` — Update personal & health preferences
- `PUT /api/users/me/password` — Change password securely

### Retinal Analysis
- `POST /api/retinal/upload` — Validate & store fundus scan image
- `POST /api/retinal/analyze` — Trigger AI feature detection & save scan
- `GET /api/retinal/scans` — Fetch user scan history
- `GET /api/retinal/scans/:id` — Fetch specific scan details
- `DELETE /api/retinal/scans/:id` — Delete scan record

### Clinical Review & Reports
- `POST /api/retinal/scans/:id/review` — Save professional review
- `GET /api/reports` — List generated reports
- `GET /api/reports/:id/pdf` — Download official clinical PDF report

---

## 🐳 Docker Deployment

To launch all services (PostgreSQL, Backend, AI Microservice, Frontend Nginx) with Docker Compose:

```bash
docker compose up --build
```

---

## ⚠️ Medical Safety Disclaimer

> **IMPORTANT MEDICAL NOTICE**: Netra AI provides health information and AI-assisted screening decision support only. It does not replace professional medical diagnosis, clinical judgment, or treatment. Retinal analysis results must be reviewed by a qualified eye-care professional (Ophthalmologist / Optometrist).
