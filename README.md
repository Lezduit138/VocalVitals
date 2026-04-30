# VocalVitals - AI-Powered Pediatric Health Portal

A complete, production-grade frontend platform for early acoustic biomarker analysis.

## 🚀 Getting Started

Since `npm` and `node` were not detected in the current environment during generation, you will need to install dependencies and start the app manually once Node.js is available:

1. **Install Node.js** (v18+ recommended) from [nodejs.org](https://nodejs.org/)
2. Open a terminal in the `vocalvitals` directory
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 🛠️ Tech Stack
- **Framework**: React 18 + Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS + Custom variable tokens
- **State Management**: Zustand (with Offline status sync)
- **Animations**: Framer Motion
- **Charts**: Recharts (Radar charts for Biomarkers)
- **Icons**: Lucide React
- **Offline / PWA**: Vite PWA Plugin

## 🌟 Key Features
- **Simulated Voice Analysis**: Step-by-step UX for recording, visualizing waveforms (Canvas API), and processing mock biomarkers.
- **Offline-First UI**: Network status detection with animated warning banners and simulated cached content fallback.
- **Advanced Charts**: Interactive Confidence Gauge (SVG) and Biomarker Radar Chart via Recharts.
- **Beautiful UI**: Deep navy background with teal neon accents, glassmorphic cards, and pulse animations.

## 📁 Project Structure
```text
src/
├── components/
│   ├── ui/        # Buttons, Cards, Badges
│   ├── layout/    # Navbar, Footer, OfflineBanner
│   ├── charts/    # RadarChart, ConfidenceGauge
│   └── audio/     # WaveformVisualizer
├── pages/         # Core views (Landing, Analyze, Results, etc.)
├── store/         # Zustand global state
└── utils/         # Helper functions (cn)
```
