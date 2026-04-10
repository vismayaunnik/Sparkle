# Sparkle | Immersive Deep-Focus Journaling

Sparkle is a premium, full-stack journaling application engineered to provide a distraction-free environment for reflection and deep work. Designed with a "vortex" aesthetic, it combines immersive WebGL visuals with a robust cloud backend to create a seamless, professional-grade user experience.

**Live Demo:** [sparkle-vortex.vercel.app](https://sparkle-vortex.vercel.app)

## Tech Stack

### Frontend Architecture
- **React 19 & Vite**: High-performance rendering and lightning-fast development cycle.
- **Tailwind CSS v4**: Utilizing the latest in utility-first CSS for a bespoke, premium UI.
- **Framer Motion & GSAP**: Advanced physics-based animations and layout transitions.
- **WebGL**: Custom-coded Neural Vortex background for an immersive "deep space" focus.

### Backend & Security
- **Supabase (PostgreSQL)**: Managed relational database with real-time data sync.
- **Supabase Auth**: Secure JWT-based authentication with protected route management.
- **Row-Level Security (RLS)**: Fine-grained database policies ensuring absolute user data privacy.

## Key Technical Features

### 1. Vortex Soundscape Engine
A custom-engineered audio solution designed to facilitate alpha-wave focus through immersive ambient layers.
- **Gesture-Driven Architecture**: Intelligently engineered to bypass modern browser autoplay restrictions, ensuring a seamless "first-click" audio initialization.
- **Cross-View Persistence**: Utilizes a central React context bridge to ensure audio continuity remains uninterrupted during transitions between Login, Discovery, and Deep Writing phases.
- **High-Clarity Optimization**: Defaulted to an optimized 0.8 volume ratio with ultra-stable, high-performance CDN delivery for zero-latency playback.
- **Real-time Engine Diagnostics**: Features a pulsing "Neural Stream" feedback system to provide visual confirmation of audio playback states on all devices.

### 2. Deep Focus Mode
A distraction-free journaling interface featuring a custom session timer, fullscreen API integration, and AI-inspired story prompts to overcome "blank page" syndrome.

### 3. Persistent Neural History
Full CRUD integration with PostgreSQL. Every entry is securely saved to the cloud, allowing users to sync their journaling history across any device.

### 4. Behavioral Gamification
Implemented a dynamic streak-tracking algorithm that calculates consecutive days of activity, encouraging a consistent writing habit.

## Engineering Highlights 
- **Asynchronous Data Handling**: Orchestrated complex loading states and error boundaries for real-time cloud data fetching.
- **UX-First Security**: Implemented a "Preview as Guest" feature that isolates local state from cloud state, allowing instant user onboarding without friction.
- **Performance Optimization**: Optimized WebGL rendering and Framer Motion orchestrations to maintain a smooth 60fps experience even on mobile devices.
- **Responsive Architecture**: Fully responsive glass-morphism UI that adapts seamlessly to desktop, tablet, and mobile orientations.

## Local Development

```bash
# Clone the repository
git clone https://github.com/vismayaunnik/Sparkle.git

# Install dependencies
npm install

# Start development server
npm run dev
```


**Ignite your inner narrative.**
