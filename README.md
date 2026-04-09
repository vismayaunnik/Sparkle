# Sparkle - The Deep Neural Journaling Experience

Sparkle is an immersive, highly interactive, and zero-distraction web-based journaling application built for deep focus and introspection. Designed with a striking dark-mode aesthetic and a dynamic interactive neural vortex background, it provides a sanctuary for dumping your thoughts, tracking emotional states, and reflecting gracefully.

## Features

- **Deep Focus Lockdown Mode**: When you enter the journaling state, the surrounding UI gracefully fades to zero opacity. The system intercepts accidental tab closures and restricts context menus to prevent any and all distractions. Focus is everything.
- **Hierarchical Prompt Generation**: Select from structured categories (e.g., Deep Thinking, Core Memories, Dreams) which dynamically expand into over 36 distinct subtopic writing prompts to jumpstart a creative spark. You can also let the visual randomizer pick the theme for you.
- **Real Email Verification Flow**: Fully functional verification process integrated right into the onboarding UI, leveraging EmailJS to securely map user accounts and deliver real-time 6-digit access codes to an inbox for password resets and signups.
- **Immersive Visuals**: Powered by a heavily customized WebGL "Neural Vortex" canvas that responds interactively to your interactions and sets a hyper-modern, organic visual tone.
- **Local Profile System**: All entry sessions, history, and user streaks are locally synchronized, ensuring privacy while offering history sidebars and profile tracking stats.

## 🛠️ Tech Stack

### Framework & Build Tools
- **React 18** - Component-based foundation.
- **Vite** - High-performance dev server and frontend tooling.
- **TailwindCSS** - Rapid utility-first styling for glassmorphism and grid logic.

### Animation & Physics
- **Framer Motion** - Delivering fluid transition physics, modal exits, and structural sidebars.
- **Vanilla WebGL** - Rendering the ambient multi-chromatic neural background efficiently.

### Integrations
- **EmailJS** - The sole external API used to securely route verification code emails entirely on the client, without necessitating a heavy backend.

## Live Link
```https://sparkle-vortex.vercel.app/```

## Getting Started

If you have cloned this repository and wish to run the OS environment locally on your own machine:

1. Install Dependencies:
   ```bash
   npm install
   ```
2. Start the Vite Server:
   ```bash
   npm run dev
   ```
   *(If on Windows and script issues occur, use `node node_modules/vite/bin/vite.js` instead).*
3. Open `http://localhost:5173/` in your browser.

## License

This project is licensed under the MIT License.

---
**Ignite your inner narrative.**
