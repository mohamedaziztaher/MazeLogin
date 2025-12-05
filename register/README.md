# UISOCIAL - Login & Register App

A modern React TypeScript application with beautiful login and register screens, built with Tailwind CSS.

## Features

- 🎨 Modern, responsive design
- 🔐 Login and Register pages
- 🎭 Beautiful artwork section on login page
- 🦋 NIRD logo with colorful insect design on register page
- 📱 Fully responsive layout
- ⚡ Built with Vite for fast development
- 🎯 TypeScript for type safety
- 💅 Tailwind CSS for styling

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
register/
├── src/
│   ├── components/
│   │   └── NirdLogo.tsx      # NIRD logo component
│   ├── pages/
│   │   ├── Login.tsx          # Login page
│   │   └── Register.tsx       # Register page
│   ├── App.tsx                # Main app component with routing
│   ├── main.tsx               # Entry point
│   └── index.css              # Global styles with Tailwind
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## Routes

- `/login` - Login page (default)
- `/register` - Registration page

## Technologies Used

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM

## Design Features

### Login Page
- Left side: Dramatic mountain landscape artwork with stars and moon
- Right side: Clean login form with email/password fields
- Social login options (Google)
- Social media icons at the bottom

### Register Page
- Left side: NIRD logo with colorful insect/butterfly design
- Right side: Registration form with name, email, and password fields
- Social sign-up options
- Social media icons at the bottom

Enjoy building! 🚀

