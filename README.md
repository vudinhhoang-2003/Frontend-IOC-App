# QUAWACO IOC - Intelligent Operations Center

QUAWACO IOC is a modern, high-fidelity web platform designed for monitoring and managing water treatment operations, production, and business analytics. Built with a premium aesthetic and real-time data visualization, it serves as the central command hub for the QUAWACO ecosystem.

## 🚀 Key Features

- **Advanced Dashboard**: Real-time production monitoring, KPI tracking with sparklines, and automated operational status feeds.
- **AI Mascot (AIBot)**: A persistent, interactive AI assistant integrated across the platform to provide guidance and insights.
- **Categorized Navigation**: High-density sidebar organized into 6 operational domains (Central Command, Production, Technical, Business, AI Center, and System).
- **Internationalization (i18n)**: Full support for Vietnamese and English locales.
- **Dynamic Data Visualization**: Interactive charts and heatmaps powered by `recharts`.
- **Live Alert Ticker**: High-performance scrolling notification bar for critical system alerts.

## 🛠️ Tech Stack

- **Core**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with a custom industrial theme.
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Charts**: [Recharts](https://recharts.org/)
- **i18n**: [i18next](https://www.i18next.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 📂 Project Structure

```text
src/
├── assets/          # Static assets (logos, mascots)
├── components/      # Reusable UI components
│   ├── common/      # Global components (AIBot, Tooltip)
│   ├── dashboard/   # Specialized dashboard modules
│   └── layout/      # Sidebar and Header components
├── constants/       # Feature constants (menu structure)
├── i18n/            # Localization dictionaries (VI, EN)
├── layouts/         # Page layout containers (Main, Auth)
├── pages/           # Page components (24+ operational modules)
├── routes/          # Navigation and protected routing
└── store/           # Global state management
```

## 📦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone ...
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## 🎨 Branding & Identity

- **Powered by**: QUAWACO Technical System.
- **Logo**: Official QUAWACO IOC branding.
- **Mascot**: Custom AI Mascot designed for industrial interaction.

---
© 2026 QUAWACO. All rights reserved.
