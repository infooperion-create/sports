#!/bin/bash

# Production Build Script for Sports Management System

echo "🏗️  Building Sports Management System for production..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf .next out build

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Generate Prisma client
echo "🗄️  Generating Prisma client..."
npm run db:generate

# Build the application
echo "🔨 Building Next.js application..."
npm run build

echo "✅ Build completed successfully!"
echo "📁 Build output: .next/"
echo "🚀 To start production server: npm start"