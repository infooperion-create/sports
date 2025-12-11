# Sports Management System

A comprehensive sports management platform built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- **Multi-Role System**: Admin, Coach, and Student roles
- **Team Management**: Create and manage sports teams
- **Event Management**: Schedule and track sports events
- **Achievement Tracking**: Record and display achievements
- **User Profiles**: Complete profile management
- **Real-time Updates**: Live dashboard and notifications
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: Prisma ORM with SQLite
- **Authentication**: JWT-based authentication
- **State Management**: Zustand, TanStack Query

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up the database**:
   ```bash
   npm run db:push
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to `http://localhost:3000`

## Environment Variables

Create a `.env` file in the root directory:

```env
JWT_SECRET=your-secret-key-here
DATABASE_URL="file:./dev.db"
```

## Project Structure

```
├── src/
│   ├── app/                 # Next.js app router pages
│   ├── components/          # Reusable components
│   ├── lib/                # Utility functions and auth
│   └── hooks/              # Custom React hooks
├── public/                 # Static assets
├── prisma/                 # Database schema and migrations
└── db/                     # Database files
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push database schema
- `npm run db:generate` - Generate Prisma client

## Default Test Accounts

After setting up the database, you can use these test accounts:

**Admin:**
- Email: admin@example.com
- Password: admin123

**Coach:**
- Email: coach@example.com  
- Password: coach123

**Student:**
- Email: student@example.com
- Password: student123

## Deployment

This project is configured for standalone deployment. The build output includes all necessary files for production deployment.

## License

This project is licensed under the MIT License.