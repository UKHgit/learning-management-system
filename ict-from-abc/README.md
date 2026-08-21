# ICT From ABC - Learning Management System

A modern, production-ready Learning Management System (LMS) built with React, TypeScript, Tailwind CSS, and Firebase.

## Features

### Student Portal
- **Secure Video Player**: YouTube privacy-enhanced embed with link shielding
- **Structured Learning**: Subjects → Modules → Lessons hierarchy
- **Resource Cards**: PDF downloads, Zoom links, assignments
- **Progress Tracking**: View counts and analytics

### Admin Dashboard
- **Content Management**: Add/edit/delete subjects, modules, lessons
- **Real-time Analytics**: Live online user count via Firebase Realtime Database
- **Video Analytics**: Track video views per lesson
- **Protected Access**: UID-based admin authorization

### Authentication
- Google Sign-In integration
- Automatic user profile creation in Firestore
- Role-based access control (admin/student)

## Branding

- **Primary Color**: Bold Energetic Red-Orange (#E63A12)
- **Secondary**: Deep Black (#0B0C10)
- **Background**: Crisp White/Off-White (#F8FAFC)
- **Accent**: Slate Gray for subtle details

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Routing**: React Router v6
- **Backend**: Firebase (Auth, Firestore, Realtime DB, Storage)

## Admin Configuration

The admin account is pre-configured for:
- **Email**: bimsarac44@gmail.com
- **UID**: xWReEjFS2qWzZ81JKF1a20grIr52

When this user logs in, they automatically get admin dashboard access.

## Getting Started

### Installation

```bash
cd ict-from-abc
npm install
npm run dev
```

### Environment Setup

Firebase configuration is already set up in src/lib/firebase.ts. No additional environment variables needed.

## Deployment

### Deploy to Netlify

1. Push code to GitHub
2. Connect repository to Netlify
3. Build settings:
   - Build Command: npm run build
   - Publish Directory: dist

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Framework preset: Vite
4. Build Command: npm run build
5. Output Directory: dist

## Adding Content

### Via Admin Dashboard

1. Log in as admin (bimsarac44@gmail.com)
2. Navigate to Admin Dashboard
3. Use Quick Actions to add Subjects, Modules, and Lessons

### Lesson Types

- **Video**: Enter YouTube Video ID (e.g., dQw4w9WgXcQ)
- **PDF**: Provide direct PDF URL
- **Zoom**: Paste Zoom meeting link
- **Assignment**: Link to external assignment

## Security Features

### Video Player Protection
- YouTube nocookie.com domain (privacy-enhanced)
- Disabled right-click context menu
- Transparent overlay blocking title/link clicks
- No raw YouTube URLs exposed in DOM
- Watch history not saved to user's YouTube account

### Admin Protection
- UID-based authorization check
- Route-level protection with redirects

## Firebase Collections

### Firestore
- users: User profiles with role field
- subjects: Course subjects
- modules: Learning modules
- lessons: Individual lessons
- videoAnalytics: View tracking data

### Realtime Database
- presence: Online user tracking
- .info/connected: Connection status

---

Built with React, TypeScript, Tailwind CSS, and Firebase
