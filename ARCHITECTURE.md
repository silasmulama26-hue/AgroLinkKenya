# AgriLink Technical Architecture

## Data Flow Diagram

1. **User Interaction** -> `page.tsx` (Dashboard)
2. **AI Analysis Request** -> `QualityScanner.tsx` -> Gemini API -> JSON Output
3. **Offline Mode** -> `localStorage` Queue -> `syncOfflineData` -> Server (Simulated)
4. **Chat Interaction** -> `ChatAdvisor.tsx` -> Gemini API (History-aware)

## Component Hierarchy

- **Root Layout**
  - **AgriLinkDashboard** (`page.tsx`)
    - **Header** (Weather & Sync Status)
    - **Sidebar/Bottom Nav** (Navigation)
    - **Tab Content**:
      - `renderHome`: Overview cards
      - `renderInventory`: CRUD for crops + Offline handling
      - `renderMarket`: Market trends and bids
      - `renderLogistics`: Truck booking UI
      - `renderScanner`: Integration of `QualityScanner`
      - `renderAdvisor`: Integration of `ChatAdvisor`

## AI Strategy

### Model Selection
- Uses `gemini-1.5-flash` for image analysis due to low latency.
- Uses `gemini-1.5-flash` for chat for cost-effective performance.

### Prompting Strategy
- **Localization**: Prompts are dynamically adjusted to request Swahili output if `preferredLang === 'sw'`.
- **Formatting**: Strict format instructions (Daraja/Grade, Maelezo/Description, Ushauri/Advice) ensure consistent UI parsing.

## Responsive Strategy
- **Breakpoints**: 
  - `sm`: Mobile phones
  - `md`: Tablets
  - `lg`: Desktops (Bento grid expansion)
- **Fluid Layout**: Uses Tailwind's auto-grid and flex-wrap patterns to ensure content never overflows and remains readable under poor conditions.
