# AgriLink: AI-Powered Agricultural Intelligence Platform

AgriLink is a high-performance, bilingual (English & Swahili) web application designed to empower smallholder farmers in Kenya (specifically Kakamega County) with real-time AI-driven insights, quality assessments, and market intelligence.

## 🌟 Key Features

### 1. AI Crop Quality Scanner
- **Computer Vision**: Uses Gemini 1.5 Flash to analyze crop photos and assign quality grades (A-D).
- **Automated Advice**: Provides visual analysis and strategic farming advice based on real-time photo assessment.
- **Bilingual Results**: Instant translation of AI findings into Swahili to overcome language barriers.

### 2. Intelligent Agri-Advisor (AI Chat)
- **Context-Aware Assistance**: Chat interface that knows the farmer's location, crop stages, and local weather.
- **Multimodal Support**: Farmers can upload photos of pests or diseases for instant diagnosis.
- **Cultural Localization**: Pre-configured with local context for Kakamega County.

### 3. Smart Dashboard
- **Weather Integration**: Localized weather monitoring with irrigation necessity alerts.
- **Market Intelligence**: Real-time buyer bids and AI-powered price trend predictions.
- **Crop Inventory Management**: Tracks planting dates, estimated yields, and harvest countdowns.

### 4. Logistics & Supply Chain
- **Cooperative Booking**: Simplifies transport booking with local millers and cooperatives.
- **Shipment Tracking**: Monitoring active shipments from farm to market.

### 5. Resilient Architecture
- **Offline Synchronization**: Robust local-first data storage. Changes made while offline are queued and automatically synced when connectivity returns.
- **Mobile-Responsive Design**: Optimized for low-end mobile devices common in rural areas, while providing enhanced bento-grid layouts for tablets and desktops.

## 🛠 Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **AI Engine**: Google Gemini API (`@google/genai`)
- **Styling**: Tailwind CSS v4 (Mobile-First approach)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Type Safety**: TypeScript

## 📁 Project Structure

- `/app`: The core Next.js application logic.
  - `/app/page.tsx`: Main dashboard and routing logic.
  - `/app/components/QualityScanner.tsx`: AI Computer Vision logic.
  - `/app/components/ChatAdvisor.tsx`: Contextual AI advisor interface.
  - `/app/globals.css`: Tailwind V4 configuration.
- `/lib`: Shared utility functions (e.g., UI helpers).
- `/hooks`: Custom React hooks (e.g., `use-mobile` for responsive detection).

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- A Google AI Studio API Key

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env`:
   ```env
   NEXT_PUBLIC_GEMINI_API_KEY=your_key_here
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## 🏗 Key Implementation Details

### Offline Sync Mechanism
The app uses a custom `PendingAction` queue stored in `localStorage`. 
- **Optimistic Updates**: User actions (like registering a crop) are reflected instantly in the UI.
- **Background Sync**: A `useEffect` watcher detects network restoration and triggers the `syncOfflineData` pipeline.

### AI Advice Presentation
AgriLink features a "Prominent Advice" card system:
- **Large Screens**: Side-by-side comparison of Visual Analysis vs. AI Strategic Advice.
- **Interactive**: Staggered animations and distinct visual styling make AI recommendations clear and actionable.

## 🌍 Localization
AgriLink supports English and Swahili. All UI labels, AI prompts, and AI responses are dynamically switched based on user preference to ensure maximum accessibility for rural farming communities.
