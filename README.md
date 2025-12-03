# Parallax Light Field Interface

A React + Vite implementation of a parallax light field interface with Three.js and GSAP animations.

## Features

- **Three.js 3D Scene**: Wireframe geometric shapes (spheres, boxes, octahedrons, tetrahedrons, toruses) with parallax scrolling
- **GSAP Animations**: Smooth scroll-triggered text animations
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
│   │   └── ParallaxScene.jsx    # Three.js scene component
│   ├── App.jsx                   # Main app component
│   ├── main.jsx                  # React entry point
│   └── index.css                 # Global styles with Tailwind
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

# mnada-waitlist
