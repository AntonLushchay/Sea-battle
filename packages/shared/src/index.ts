// =====================================================================================
// |                                     Enums & Types                                   |
// =====================================================================================

export type CellStatus = 'EMPTY' | 'SHIP' | 'HIT' | 'MISS';

export type TurnOrder = 'PLAYER_1' | 'PLAYER_2' | 'RANDOM';

export type GameStatus = 'SETUP' | 'IN_PROGRESS' | 'FINISHED';

export type ShotResult = 'HIT' | 'MISS' | 'SUNK';

export type ID = string;

export type Orientation = 'horizontal' | 'vertical';

// =====================================================================================
// |                                        DTOs                                         |
// =====================================================================================

export interface CoordsDTO {
	x: number;
	y: number;
}

export interface CellDTO {
	coords: CoordsDTO;
	status: CellStatus;
}

export interface ShipBaseDTO {
	shipID: ID;
	type: string;
	size: number;
}

export interface ShipDTO {
	baseInfo: ShipBaseDTO;
	hitsCount: number;
	isSunk: boolean;
	isPlaced: boolean;
}

export interface FleetRuleDTO extends Omit<ShipBaseDTO, 'shipID'> {
	count: number;
}

export interface ShipPlacementDTO {
	baseInfo: ShipBaseDTO;
	coords: CoordsDTO[];
	orientation: Orientation;
}

export interface FleetDTO {
	ships: ShipDTO[];
}

export interface BoardDTO {
	size: number;
	cells: CellDTO[][];
}

export interface PlayerInfoDTO {
	playerID: ID;
	name: string;
	isReady: boolean;
}

export interface GameStateDTO {
	gameId: ID;
	myPlayerId: ID;
	players: PlayerInfoDTO[];
	myBoard: BoardDTO;
	enemyBoard: BoardDTO;
	myFleet: FleetDTO;
	currentPlayerId: ID;
	gameStatus: GameStatus;
}

// =====================================================================================
// |                           Client to Server (C2S) Payloads                           |
// =====================================================================================

// No payload for creating a game, it's just a signal
export type CreateGamePayload = void;

export interface JoinGamePayload {
	gameId: ID;
}

export interface UpdateSettingsPayload {
	playerName?: string;
	boardSize?: number;
	fleetConfig?: FleetRuleDTO[];
	firstPlayer?: TurnOrder;
}

export interface PlaceShipPayload {
	placedShip: ShipPlacementDTO;
}

export interface UnplaceShipPayload {
	shipID: ID;
}

// No payload, just a signal
export type PlayerReadyPayload = void;

export interface MakeTurnPayload {
	coords: CoordsDTO;
}

// No payload, just a signal
export type SurrenderPayload = void;

// No payload, just a signal
export type DestroyLobbyPayload = void;

// =====================================================================================
// |                           Server to Client (S2C) Payloads                           |
// =====================================================================================

export interface GameCreatedPayload {
	gameState: GameStateDTO;
}

export interface GameStateUpdatePayload {
	gameState: GameStateDTO;
}

export interface TurnResultPayload {
	coord: CoordsDTO;
	result: ShotResult;
	newGameState: GameStateDTO;
}

export interface GameOverPayload {
	winnerId: ID;
}

export interface ErrorPayload {
	message: string;
}
