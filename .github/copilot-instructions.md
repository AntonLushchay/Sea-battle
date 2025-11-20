# Sea Battle — AI Coding Agent Instructions

## Architecture Overview

This is a **TypeScript monorepo** for a multiplayer Sea Battle (Battleship) game with **WebSocket-based real-time communication**. Three workspace packages:

- **`packages/shared`** — Type-safe contracts (DTOs, C2S/S2C messages) shared between client & server
- **`packages/server`** — WebSocket server (port 8080) with layered architecture: Gateway → Service → Repository → Domain
- **`packages/client`** — Vite-based browser client with minimal UI for testing

### Server Architecture Layers

1. **Gateway** (`packages/server/src/gateway/`) — WebSocket message routing, client connection management (`Map<playerId, WebSocket>`)
2. **Service** (`packages/server/src/services/`) — Orchestration: find games, delegate to domain, coordinate broadcasts
3. **Repository** (`packages/server/src/data/`) — In-memory `Map<gameId, IGame>` storage (no persistence yet)
4. **Domain** (`packages/server/src/core/`) — Game logic with strict interfaces: `Game`, `Player`, `Board`, `Fleet`, `Ship`, `Cell`

**Critical: Domain methods enforce business rules internally.** Checks like "only host can update settings" or "status must be SETUP" belong in domain methods (e.g., `Game.updateSettings(playerId, settings)`), not just in Service.

### Key Patterns

**Type Guards** (`packages/server/src/utils/type_guards/`)  
Runtime validation for incoming WebSocket messages. Each message requires:
- Base check: `isObjectWithEvent(data)` → ensures `{ event: string }`
- Specific guard: e.g., `isUpdateSettingsMessage` validates payload shape + field types/ranges

**Mapper Pattern** (`packages/server/src/gateway/mapper.ts`)  
Convert domain models → DTOs for client. Example: `mapToGameStateDTO(game, playerId)` hides enemy ships (`SHIP` → `EMPTY` for `enemyBoard`).

**Broadcast After Mutation**  
After domain changes, send `gameStateUpdate` to **all players** in the game via `this.clients.get(player.playerId)?.send(...)`.

**Session Persistence** (`packages/client/src/main.ts`)  
Client stores `{ gameId, playerId }` in `localStorage` under `sea-battle:sessions`. On reconnect, auto-attempts if single session exists.

## Development Workflows

### Start Dev Environment
```bash
npm run dev              # Runs client (Vite) + server (tsx watch) in parallel
npm run dev:client       # Client only (http://localhost:5173)
npm run dev:server       # Server only (ws://localhost:8080)
```

### Build & Lint
```bash
npm run build            # Builds shared → client → server (order matters!)
npm run lint:fix         # ESLint + auto-fix
npm run stylelint:fix    # SCSS linting
```

### Testing Server Messages
Use browser console or external WebSocket client. Example payloads:

**Create Game:**
```json
{ "event": "createGame" }
```

**Update Settings (all fields required):**
```json
{
  "event": "updateSettings",
  "payload": {
    "playerId": "uuid-here",
    "gameId": "uuid-here",
    "settings": {
      "boardSize": 10,
      "firstPlayer": "RANDOM",
      "fleetConfig": [
        { "type": "carrier", "size": 4, "count": 1 }
      ]
    }
  }
}
```

## Project-Specific Conventions

### Shared Types Are Source of Truth
All DTOs, message interfaces, enums live in `packages/shared/src/index.ts`. Changes here trigger rebuilds in client + server.

### UpdateSettingsDTO Fields
**Currently all required** (`boardSize`, `firstPlayer`, `fleetConfig`). This simplifies type guards but requires client to send full config even for partial updates.

### Game Rules (Critical for Validation)
- **Board size:** 5–20 (enforced in type guard)
- **Fleet:** Each ship has `{ type: string, size: number, count: number }`
  - `size` must be ≥1 and ≤ boardSize (integer)
  - `count` ≥ 0 (integer)
  - Total area: `sum(size × count)` ≤ `boardSize²`
  - **Non-touching rule:** Ships must have 1-cell buffer on all sides (including diagonals) — validate in domain when implementing placement

### Interface Naming
Domain interfaces prefixed with `I`: `IGame`, `IPlayer`, `IBoard`, etc. Implementations are plain classes: `Game`, `Player`, `Board`.

### Error Handling
Throw descriptive errors in domain/service. Gateway catches and sends:
```typescript
ws.send(JSON.stringify({ event: 'error', payload: { message: errorMessage } }));
```
Note: `ErrorMessage.payload` in shared is `string`, but server sends `{ message: string }` — this inconsistency exists.

## File Structure Reference

```
packages/
├── shared/src/index.ts          # All DTOs, messages, types
├── server/src/
│   ├── index.ts                 # WebSocket server entry, message switch/case
│   ├── gateway/
│   │   ├── websocket_gateway.ts # handleCreateGame, handleJoinGame, handleReconnect, etc.
│   │   ├── mapper.ts            # Domain → DTO conversion
│   │   └── types.ts             # IWebSocketGateway interface
│   ├── services/
│   │   ├── game_service.ts      # createNewGame, joinGame, updateSettings, reconnectPlayer
│   │   └── types.ts             # IGameService interface
│   ├── data/
│   │   ├── game.repository.ts   # In-memory Map storage
│   │   └── types.ts             # IGameRepository interface
│   ├── core/                    # Domain models (game, player, board, fleet, ship, cell)
│   │   └── game/game.ts         # Game aggregate root
│   └── utils/type_guards/
│       └── type_guards.ts       # Runtime message validation
└── client/src/
    ├── main.ts                  # WebSocket client, localStorage session mgmt
    └── index.html               # Minimal test UI (inputs for gameId, settings, etc.)
```

## Common Tasks

**Add New Message Type:**
1. Define in `packages/shared/src/index.ts` (C2S + S2C interfaces)
2. Add type guard in `packages/server/src/utils/type_guards/type_guards.ts`
3. Add case in `packages/server/src/index.ts` switch
4. Implement handler in `WebSocketGateway`, delegate to `GameService`, update domain
5. Add client-side handling in `packages/client/src/main.ts` (`wss.onmessage`)

**Modify Domain Logic:**
Always update the interface in `core/*/types.ts` first, then implementation. Domain methods should validate their own invariants (don't rely solely on Service checks).

**Change Fleet/Board Rules:**
Update validation in:
- Type guard (`isUpdateSettingsDTO`) for basic checks
- `Game.updateSettings()` for business rules (area, feasibility)
- Consider adding `rebuildBoard(size)` / `regenerateFleet(config)` calls to reset player state

## UML Documentation

`UML/` folder contains Mermaid diagrams (Classes, State Machine, Use Cases). Note: **DTOs diverged** from original UML — code is authoritative.
