# Mnada Waitlist

A beautiful, interactive waitlist landing page for Mnada — where style meets community. Built with React, Vite, Three.js, and GSAP animations.

## Features

- **Interactive 3D Parallax Scene**: Wireframe geometric shapes (spheres, boxes, octahedrons, tetrahedrons, toruses) with parallax scrolling
- **GSAP Animations**: Smooth scroll-triggered text animations
- **Animated Waitlist Form**: Interactive form with animated eyes that follow your cursor and react to typing
- **Google Sheets Integration**: Automatically saves form submissions to Google Sheets
- **Dark Mode**: Beautiful dark theme with bright wireframe outlines
- **Parallax Effects**: Multiple layers moving at different speeds based on scroll position
- **Mouse Interaction**: 3D scene responds to mouse movement
- **Responsive Design**: Tailwind CSS for responsive layouts

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Three.js** - 3D graphics library
- **GSAP** - Animation library with ScrollTrigger
- **Tailwind CSS** - Utility-first CSS framework
- **Google Apps Script** - Backend for form submissions to Google Sheets

## Google Sheets Integration

The waitlist form submits data to a Google Sheet. To set this up:

1. Follow the instructions in [`GOOGLE_SHEETS_SETUP.md`](./GOOGLE_SHEETS_SETUP.md)
2. Create a `.env` file in the root directory:
   ```
   VITE_GOOGLE_SCRIPT_URL=your_google_apps_script_url_here
   ```
3. Restart the development server

See the setup guide for detailed instructions.

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── ParallaxScene.jsx    # Three.js parallax scene component
│   │   └── WaitlistForm.jsx      # Animated waitlist form with Google Sheets integration
│   ├── App.jsx                   # Main app component
│   ├── main.jsx                  # React entry point
│   └── index.css                 # Global styles with Tailwind
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── GOOGLE_SHEETS_SETUP.md        # Setup guide for Google Sheets integration
└── .env                          # Environment variables (not in git)
```

## Environment Setup

**Important**: The `.env` file is not tracked in git for security. You need to create it locally:

1. Create a `.env` file in the root directory
2. Add your Google Apps Script URL:
   ```
   VITE_GOOGLE_SCRIPT_URL=your_google_apps_script_url_here
   ```
3. Never commit this file to git (it's already in `.gitignore`)

## About Mnada

Mnada is building a space where you can buy and sell clothing you love, discover unique pieces, and connect with people who share your style. Join the waitlist to get early access to the next generation of fashion and social interaction.
