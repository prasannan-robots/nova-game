# Soma Recovery - Game Documentation

## Overview

Soma Recovery is a narrative-driven pixelated 2D top-down game about overcoming addiction in a dystopian future (2075). The game follows a protagonist who has lost everything to "soma" - an AI-distributed drug that provides artificial dopamine. Through gameplay, players must rebuild their character by avoiding triggers, learning recovery principles, exercising, and helping others overcome addiction.

The game is built as a single-page web application using React Three Fiber for 3D rendering in a 2D orthographic view with pixel art sprites, featuring a full-stack architecture supporting future multiplayer expansion (Chapter 4).

**Current Status**: Chapter 1 complete with pixel art assets for characters and buildings.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

### October 25, 2025 - Pixel Art Enhancement
- Added AI-generated pixel art sprites for player character (blue)
- Added pixel art sprites for NPCs: drug addicts (red) and clean people (green)
- Added pixel art sprites for buildings: library (purple) and gym (orange)
- Integrated asphalt texture for ground/streets
- Sprites stored in `client/public/sprites/` for direct access
- Enhanced visual presentation with authentic retro 8-bit aesthetic

### October 25, 2025 - Initial Game Implementation (Chapter 1)
- Implemented complete game state management with Zustand
- Created interconnected stats system (dopamine → health → confidence → money)
- Built player movement with keyboard controls (WASD/arrows)
- Added NPC system with drug addicts and clean people
- Created building system (library, gym, home)
- Implemented proximity detection and interaction triggers
- Built library with interactive story discs and quiz system
- Created exercise mechanics at gym
- Implemented conversation system with clean NPCs
- Added temptation system near drug addicts
- Walking gradually increases dopamine levels
- Stats UI shows all progress metrics with visual bars

## System Architecture

### Frontend Architecture

**Core Technology Stack:**
- React 18 with TypeScript for UI components and game logic
- React Three Fiber (@react-three/fiber) for 3D rendering with orthographic camera for 2D gameplay
- Drei (@react-three/drei) for 3D utilities and controls
- Vite as the build tool and development server
- TailwindCSS for UI styling
- Radix UI components for accessible UI elements

**State Management:**
- Zustand with subscribeWithSelector middleware for game state
- Separate stores for different concerns:
  - `useSomaGame.tsx`: Main game state (stats, position, NPCs, interactions)
  - `useGame.tsx`: Generic game phase management
  - `useAudio.tsx`: Audio/sound management

**Game Rendering Approach:**
- 3D scene rendered with orthographic camera for true 2D top-down view
- React Three Fiber's `useFrame` hook for game loop and physics
- Keyboard controls via `@react-three/drei` KeyboardControls
- Component-based entity system (Player, NPCCharacter, Building, GameWorld)

**Design Rationale:**
Using React Three Fiber provides WebGL performance while maintaining React's component model. The orthographic camera gives a classic 2D game feel while allowing 3D effects if needed. This approach was chosen over Canvas 2D because it provides better performance for many entities and easier integration with post-processing effects.

### Backend Architecture

**Server Framework:**
- Express.js with TypeScript
- ESM modules (type: "module" in package.json)
- Vite middleware for development HMR
- Production build uses esbuild for server bundling

**API Structure:**
- RESTful API design with `/api` prefix
- Route registration through `registerRoutes` function
- Structured error handling middleware
- Request logging with duration tracking

**Storage Layer:**
- Abstracted storage interface (`IStorage`) for future database integration
- In-memory storage (`MemStorage`) for development
- Prepared for PostgreSQL via Drizzle ORM (schema defined, not yet connected)

**Design Rationale:**
The storage abstraction allows switching from in-memory to database without changing business logic. Express provides familiar patterns while remaining lightweight. The separation between development (Vite middleware) and production (static serving) ensures optimal performance in each environment.

### Data Model

**Database Schema (Drizzle ORM):**
```typescript
users table:
  - id: serial primary key
  - username: text, unique, not null
  - password: text, not null
```

**Game State Schema:**
- Player stats: dopamine, health, confidence, money, debt (all numeric)
- Position: x, y coordinates
- NPCs: id, type (addict/clean), position, optional message
- Buildings: id, type (library/gym/home), position, dimensions
- Interaction state: type, target entity, active status
- Progress tracking: books read array, walking time

**Schema Rationale:**
Player stats are interconnected (dopamine → health → confidence → money) reflecting the game's core mechanic of gradual improvement. NPCs are typed (addict/clean) to enable proximity-based temptation mechanics. Buildings use explicit dimensions for collision detection.

### Game Mechanics Architecture

**Core Systems:**

1. **Movement System**: Keyboard-controlled WASD/arrow keys with smooth acceleration/deceleration
2. **Stat System**: Interconnected stats that affect each other (dopamine affects health, health affects confidence)
3. **Proximity System**: Distance-based detection for NPC/building interactions
4. **Interaction System**: Context-sensitive interactions (library reading, gym exercise, NPC conversations)
5. **Progression System**: Book reading with quiz validation, exercise sessions, earning money by helping others

**Game Loop:**
- React Three Fiber's `useFrame` provides 60fps game loop
- Delta time used for frame-rate independent movement
- Proximity checks run every frame for responsive interactions
- Stats update based on player actions (walking increases dopamine, exercise increases health)

**Design Rationale:**
The interconnected stat system creates meaningful choices - low dopamine makes you vulnerable to temptation, requiring careful navigation. The proximity-based system encourages spatial awareness and planning (avoiding addicts when weak, seeking clean NPCs for support).

## External Dependencies

### Third-Party Services

**Database:**
- Neon PostgreSQL (serverless)
- Connection via `@neondatabase/serverless`
- DATABASE_URL environment variable required
- Drizzle ORM for schema management and migrations

**Development Tools:**
- Replit-specific: `@replit/vite-plugin-runtime-error-modal` for error overlays
- GLSL shader support via `vite-plugin-glsl` (for future visual effects)

### Key NPM Packages

**Frontend Core:**
- `react`, `react-dom`: UI framework
- `@react-three/fiber`: React renderer for Three.js
- `@react-three/drei`: Helper components for R3F
- `@react-three/postprocessing`: Visual effects (prepared for future use)
- `three`: 3D graphics library

**UI Components:**
- `@radix-ui/*`: Accessible headless components (dialog, button, card, etc.)
- `tailwindcss`: Utility-first CSS
- `class-variance-authority`: Component variant system
- `cmdk`: Command palette component

**State & Data:**
- `zustand`: Lightweight state management
- `@tanstack/react-query`: Server state management (prepared for API integration)
- `drizzle-orm`, `drizzle-kit`: Database ORM and migrations
- `zod`: Runtime type validation

**Build Tools:**
- `vite`: Frontend build tool and dev server
- `tsx`: TypeScript execution for development
- `esbuild`: Production server bundling

### Asset Requirements

The game supports loading:
- 3D models: `.gltf`, `.glb` formats
- Audio: `.mp3`, `.ogg`, `.wav` formats
- Fonts: Inter font family via `@fontsource/inter`

### Environment Configuration

Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string for Neon database
- `NODE_ENV`: Set to "production" for production builds