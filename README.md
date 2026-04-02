# Bite n Burn

Bite n Burn is a high-performance, full-stack habit tracking and wellness web application designed to deliver an engaging user experience through data-driven insights and gamification. Built with a robust modern technology stack, it emphasizes scalable architecture, algorithmic efficiency, and seamless cross-device accessibility.

## Core Architecture and Technologies

- Frontend Framework: React and Next.js (App Router) for optimized server-side rendering (SSR) and client-side interactivity.
- Language: TypeScript for strict type safety and scalable enterprise-grade code maintainability.
- Backend API Integration: Next.js API Routes architected to serve decoupled RESTful endpoints, minimizing latency and maximizing throughput.
- Database: MongoDB with Mongoose ODM for flexible, scalable schema design and efficient data querying.
- State Management: SWR for highly optimized, stale-while-revalidate data fetching and client-side caching.
- Component Design: Responsive, mobile-first component architecture utilizing a centralized design system.

## Technical Highlights

### Algorithmic Gamification Engine
Engineered custom algorithms to handle complex state calculations with minimal operational overhead:
- Streak Evaluation: Evaluates user engagement over time, handling edge cases and temporal shifts with efficient date algorithms.
- Progressive State Rendering: Calculates virtual plant growth stages based on aggregated user metrics, driving dynamic conditional UI rendering.
- Achievement System: Scalable badge evaluation system analyzing criteria across historical user data points.

### Scalable Data Management
- Structured document models ensuring data integrity and rapid read/write operations.
- Well-defined boundaries between data access logic and business rules.

### Component-Driven Development
- Modular, highly reusable React component architecture with strict separation of concerns.
- Decoupled presentational components from custom business logic hooks (`useBadges`, `useStreak`, `useTodayRecord`).
- Optimized rendering cycles prioritizing Core Web Vitals (LCP, FID, CLS).

## Getting Started

### Prerequisites
- Node.js environment
- Running MongoDB instance

### Installation & Execution

1. Install project dependencies:
```bash
npm install
```

2. Establish necessary `.env.local` configurations (e.g., `MONGODB_URI`).

3. Boot the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with a browser to inspect the application.

## Continuous Integration and Delivery
The application targets edge-computing platforms for rapid deployment, leveraging globally distributed CDNs for static assets and edge functions for the API layer. This infrastructure choice guarantees optimized TTFB (Time to First Byte) and adherence to stringent performance benchmarks.
