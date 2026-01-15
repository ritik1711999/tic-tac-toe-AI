# 🎮 Tic-Tac-Toe AI with Aging Mechanics

> A revolutionary take on the classic game featuring dynamic piece expiration and AI-powered strategic analysis

An advanced Tic-Tac-Toe application that introduces **aging game mechanics** where pieces expire after a set number of moves, creating a constantly evolving strategic landscape. Powered by **Google Gemini 1.5 Flash AI** for comprehensive move analysis and real-time multiplayer support.

---

## ✨ Key Features

### 🧠 **AI-Powered Move Analysis**

- **Google Gemini 1.5 Flash** integration for intelligent game analysis
- Dual-dimensional scoring system: **Tactical Quality (70%) + Longevity Safety (30%)**
- Post-game analysis with move timeline and performance metrics
- Strategic reasoning and alternative move suggestions
- Outcome probability predictions (win/draw/lose percentages)

### ⏳ **Aging Game Mechanic**

- Pieces automatically expire after N moves, adding strategic depth
- Dynamic board state that evolves throughout gameplay
- **Difficulty-based expiration**: Easy (7 moves), Medium (5 moves), Hard (4 moves)
- Visual indicators for piece lifespan and expiration status
- Risk vs. longevity trade-off decision making

### 🎯 **Multiple Game Modes**

- **AI Opponent**: Three difficulty levels with adaptive strategies
- **Human vs Human**: Local and online multiplayer via Socket.IO
- **Real-time Updates**: Live game state synchronization
- **Aging Toggle**: Play with or without the aging mechanic

### 📊 **Comprehensive Analytics**

- Detailed move timeline with quality indicators
- Color-coded lifespan visualization (green/yellow/red)
- Expiration badges showing when pieces expire or have expired
- Performance summary with key moments highlighting
- Game history with statistics and trends

### 🎨 **Modern UI/UX**

- Responsive design optimized for desktop and mobile
- Tailwind CSS for elegant, consistent styling
- Real-time connection status indicators
- Interactive game board with smooth animations
- Context-aware quick actions menu

### 🔐 **User Management**

- Secure authentication with JWT tokens
- User profiles with game statistics
- Game history tracking and filtering
- Achievement system and badges
- Persistent session management

---

## 🚀 Tech Stack

### **Frontend**

- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool and dev server
- **TanStack React Query** - Powerful server state management
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Socket.IO Client** - Real-time bidirectional communication

### **Backend** ([See Backend Repository](https://github.com/your-username/tic-tac-toe-backend))

- Node.js + Express REST API
- MongoDB with Mongoose ODM
- Socket.IO for real-time features
- Google Gemini 1.5 Flash for AI analysis

### **Build & Dev Tools**

- **Vite** - Next-generation frontend tooling
- **PostCSS** - CSS transformation
- **ESLint** - Code quality and consistency
- **TypeScript Compiler** - Static type checking

---

## 🌟 What Makes This Special

Unlike traditional Tic-Tac-Toe, this implementation introduces **temporal strategy** through the aging mechanic:

### **Strategic Depth**

- **Volatility Tracking**: Monitor board complexity as pieces approach expiration
- **Dual-Dimensional Scoring**: Evaluate moves on both immediate tactical value and long-term survival
- **Risk Management**: Balance aggressive plays with piece longevity
- **Dynamic Board State**: The game changes as older pieces expire, creating new opportunities

### **AI Intelligence**

- Gemini analyzes the full game context including aging parameters
- Identifies critical expiration moments that shift game dynamics
- Suggests moves that optimize both tactical position and piece lifespan
- Provides detailed reasoning for each move evaluation

### **Visual Feedback**

- **Color-Coded Timeline**: Green (healthy), Yellow (aging), Red (critical/expired)
- **Expiration Badges**: "Expires M8", "Expiring Soon", "Expired M6"
- **Strikethrough Styling**: Clearly shows expired moves in history
- **Lifespan Indicators**: Track how long each piece survived

---

## 🏗️ Architecture Overview

```
┌─────────────────┐
│   React SPA     │
│  (Vite + TS)    │
│                 │
│  ┌───────────┐  │
│  │Components │  │         REST API
│  └───────────┘  │◄──────────────────┐
│  ┌───────────┐  │                   │
│  │  Hooks    │  │       Socket.IO   ▼
│  └───────────┘  │◄──────────┐  ┌─────────────┐
│  ┌───────────┐  │           │  │   Backend   │
│  │React Query│  │           └──│  (Node.js)  │
│  └───────────┘  │              └─────────────┘
└─────────────────┘
```

### **Frontend Design Patterns**

- **Component Composition**: Modular React components with clear responsibilities
- **Custom Hooks**: Reusable logic for auth, games, and dashboard (`useAuth`, `useGames`, `useDashboard`)
- **React Query**: Server state management with automatic caching and refetching
- **Context API**: Socket connection and authentication state
- **Protected Routes**: Route-level authentication guards
- **Error Boundaries**: Graceful error handling and recovery

---

## 📦 Getting Started

### **Prerequisites**

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **MongoDB** >= 6.0 (local or cloud instance)
- **Google Gemini API Key** (get it from [Google AI Studio](https://makersuite.google.com/app/apikey))

### **Installation**

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd tic-tac-toe-ai
```

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Configure Environment

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:3000/api         # Backend API URL
VITE_SOCKET_URL=http://localhost:3000          # Socket.IO server URL
```

#### 4. Start Development Server

```bash
npm run dev
```

The application will run on `http://localhost:5173`

> **Note**: Make sure the [backend server](https://github.com/your-username/tic-tac-toe-backend) is running before starting the frontend.

### **Building for Production**

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

---

## 📁 Project Structure

```
src/
├── components/                # Reusable UI components
│   ├── ui/                   # Base UI components (Button, Input, Select, etc.)
│   │   ├── Header.tsx
│   │   ├── GameStatusIndicator.tsx
│   │   ├── BreadcrumbContext.tsx
│   │   └── QuickActionsMenu.tsx
│   ├── AppIcon.tsx           # Icon wrapper component
│   ├── ConnectionStatus.tsx  # Real-time connection indicator
│   ├── ErrorBoundary.tsx     # Error handling wrapper
│   └── ProtectedRoute.tsx    # Auth-protected route wrapper
│
├── hooks/                    # Custom React hooks
│   ├── useAuth.ts           # Authentication state & actions
│   ├── useGames.ts          # Game data & analysis fetching
│   └── useDashboard.ts      # Dashboard statistics
│
├── lib/                      # Core utilities
│   ├── api/
│   │   └── client.ts        # Axios instance with interceptors
│   └── socket/
│       ├── SocketContext.tsx # Socket.IO provider
│       └── types.ts         # Socket event types
│
├── pages/                    # Route-level page components
│   ├── game-board/          # Live gameplay
│   │   ├── index.tsx
│   │   ├── components/      # GameGrid, MoveHistory, GameControls, etc.
│   │   └── GameBoard.css
│   ├── game-analysis/       # Post-game AI analysis
│   │   ├── index.tsx
│   │   ├── components/      # MoveTimeline, AnalysisPanel, PerformanceMetrics
│   │   └── gameAnalysis.css
│   ├── game-dashboard/      # User dashboard & stats
│   │   ├── index.tsx
│   │   ├── components/      # StatisticsPanel, RecentGamesList, etc.
│   │   └── gameDashboard.css
│   ├── game-history/        # Game history with filters
│   ├── login/               # Authentication
│   └── register/            # User registration
│
├── store/                    # Client-side state
│   └── authStore.ts         # Zustand auth store
│
├── styles/                   # Global styles
│   ├── index.css            # Global CSS
│   └── tailwind.css         # Tailwind imports
│
├── utils/
│   └── cn.ts                # Class name utility
│
├── App.tsx                   # Root component
├── Routes.tsx               # Route configuration
└── index.tsx                # Application entry point
```

---

## 🎯 Key Features Deep Dive

### **1. Aging Mechanic Implementation**

Each move in an aging game receives an `expiresOnMove` value based on difficulty:

- Easy: `currentMove + 7`
- Medium: `currentMove + 5`
- Hard: `currentMove + 4`

When a move's expiration is reached, it's marked with `expiredOnMove` and removed from the board. The backend tracks this in the Move model:

```typescript
{
  moveNumber: 5,
  position: 4,
  player: "X",
  expiresOnMove: 10,    // Will expire on move 10
  expiredOnMove: null,  // Not yet expired
  expiredAt: null
}
```

### **2. AI Analysis Workflow**

1. **Data Preparation**: Controller gathers game metadata, all moves, and board states
2. **Aging Context**: Computes lifespan, total expirations, avg lifespan, volatility score
3. **Gemini Prompt**: Structured prompt with game context and aging parameters
4. **AI Processing**: Gemini analyzes each move on tactical + longevity dimensions
5. **Response Parsing**: Normalize scores, map positions, format data for frontend
6. **Caching**: React Query caches analysis for 5 minutes

### **3. Real-time Multiplayer**

Socket.IO events for game synchronization:

- `game:join` - Player joins a game room
- `game:move` - Broadcast move to opponent
- `game:update` - Send updated board state
- `game:end` - Notify game completion
- `connection:status` - Monitor online/offline state

### **4. Move Quality Scoring**

Gemini evaluates moves using a custom prompt that considers:

- **Tactical Value**: Winning potential, blocking opponent, strategic positioning
- **Longevity Safety**: Likelihood of surviving until game end, risk of expiration
- **Blended Score**: `0.7 × tactical + 0.3 × longevity`
- **Quality Label**: Excellent (90-100), Good (70-89), Suboptimal (50-69), Mistake (0-49)

---

## 📸 Screenshots & Demo

### Game Board with Aging Indicators

_Live gameplay showing piece expiration countdown and move history_

### AI Analysis Dashboard

_Post-game analysis with move timeline, color-coded lifespan bars, and performance metrics_

### Move Timeline Visualization

_Detailed move-by-move breakdown with expiration badges and quality indicators_

### Statistics Dashboard

_User profile with game history, win rates, achievements, and performance trends_

---

## 🔮 Future Enhancements

### **Planned Features**

- 🏆 **Tournament Mode**: Organize multi-player tournaments with brackets
- 📈 **ELO Rating System**: Competitive ranking based on win/loss history
- 🤖 **Multiple AI Models**: Support for GPT-4, Claude, or custom models
- 🎥 **Game Replay**: Animated replay with analysis overlay
- 📱 **Mobile App**: Native iOS/Android versions with React Native
- 🌐 **Internationalization**: Multi-language support
- 🎨 **Themes**: Dark mode and customizable color schemes
- 📊 **Advanced Analytics**: Heatmaps, opening patterns, endgame statistics
- 👥 **Social Features**: Friend system, spectator mode, chat
- 🏅 **Achievements**: Unlock badges for milestones and special moves

### **Technical Improvements**

- Implement Redis for session management and caching
- Add GraphQL API option for flexible data fetching
- Integrate WebRTC for peer-to-peer multiplayer
- Implement progressive web app (PWA) features
- Add comprehensive unit and E2E testing
- Set up CI/CD pipeline with GitHub Actions
- Optimize bundle size with code splitting and lazy loading

---

## 📚 API Integration

The frontend communicates with the backend via REST API and WebSocket connections.

### **API Client Setup**

The application uses Axios with interceptors for:

- Automatic JWT token attachment
- Request/response logging
- Error handling and retry logic
- Base URL configuration

### **Socket.IO Events**

Real-time game updates via Socket.IO:

- `game:join` - Join game room
- `game:move` - Broadcast moves
- `game:update` - Receive board state
- `game:end` - Game completion
- `connection:status` - Connection monitoring

### **Data Fetching with React Query**

The app uses TanStack React Query for:

- Automatic caching (5-minute default)
- Background refetching
- Optimistic updates
- Loading and error states

For detailed API documentation, see the [Backend Repository](https://github.com/your-username/tic-tac-toe-backend)

---

## 🛠️ Development

### **Code Quality**

```bash
# Run ESLint
npm run lint

# Format code
npm run format

# Type checking
npm run type-check
```

### **Testing**

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

### **Building**

```bash
# Build frontend
npm run build

# Build backend
cd tic-tac-toe-bck && npm run build
```

---

**Built with ❤️ using React, TypeScript, and Google Gemini AI**
