# NUML Sports Hub

A comprehensive sports management platform for National University of Modern Languages (NUML) that facilitates team management, event organization, and community engagement for students and administrators.

## 🏆 Features

### For Students
- **Dashboard**: Personalized dashboard with team status, upcoming events, and recent achievements
- **Team Management**: View team details, members, and statistics
- **Event Management**: Browse upcoming events and view recent activities
- **Community Feed**: Stay updated with official announcements and sports news
- **Profile Management**: Update personal information and settings

### For Administrators
- **Team Management**: Create, edit, and manage sports teams
- **Event Organization**: Schedule tournaments, matches, and training sessions
- **Student Management**: Manage student registrations and team assignments
- **Announcement System**: Post official announcements and updates
- **Analytics Dashboard**: Track participation and engagement metrics

## 🚀 Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5
- **Database**: Prisma ORM with SQLite
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui (New York style)
- **Authentication**: NextAuth.js v4
- **State Management**: Zustand (client), TanStack Query (server)
- **Icons**: Lucide React

## 📁 Project Structure
├── src/
│ ├── app/
│ │ ├── (auth)/ # Authentication pages
│ │ ├── admin/ # Admin dashboard and management
│ │ └── student/ # Student dashboard and features
│ ├── components/
│ │ ├── ui/ # Reusable UI components
│ │ └── layout/ # Layout components
│ ├── lib/
│ │ ├── db.ts # Database connection
│ │ └── auth.ts # Authentication utilities
│ └── hooks/ # Custom React hooks
├── prisma/
│ ├── schema.prisma # Database schema
│ └── seed.ts # Database seeding
├── public/ # Static assets and images
└── docs/ # Documentation


## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager