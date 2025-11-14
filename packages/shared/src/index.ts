// =====================================================================================
// |                                     Enums & Types                                   |
// =====================================================================================

export type CellStatus = 'EMPTY' | 'SHIP' | 'HIT' | 'MISS';

export type TurnOrder = 'PLAYER_1' | 'PLAYER_2' | 'RANDOM';

export type GameStatus = 'SETUP' | 'IN_PROGRESS' | 'FINISHED';

export type ShotResult = 'HIT' | 'MISS' | 'SUNK';

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
	id: string;
	type: string;
	size: number;
}

export interface ShipDTO {
	baseInfo: ShipBaseDTO;
	hitsCount: number;
	isSunk: boolean;
	isPlaced: boolean;
}

export interface FleetRuleDTO extends Omit<ShipBaseDTO, 'id'> {
	count: number;
}

export interface ShipPlacementDTO {
	baseInfo: ShipBaseDTO;
	coords: CoordsDTO[];
	orientation: Orientation;
}

export interface BoardDTO {
	size: number;
	cells: CellDTO[][];
}

export interface PlayerInfoDTO {
	playerID: string;
	isReady: boolean;
}

export interface GameStateDTO {
	gameId: string;
	myPlayerId: string;
	players: [PlayerInfoDTO, ...PlayerInfoDTO[]];
	myBoard: BoardDTO;
	enemyBoard: BoardDTO | null;
	myFleet: ShipDTO[];
	currentPlayerId: string | null;
	gameStatus: GameStatus;
}

// =====================================================================================
// |                           Client to Server (C2S) Messages                           |
// =====================================================================================

export interface CreateGameMessage {
	event: 'createGame';
}

export interface JoinGameMessage {
	event: 'joinToGame';
	payload: {
		gameId: string;
	};
}

export interface UpdateSettingsMessage {
	event: 'updateSettings';
	payload: {
		boardSize?: number;
		fleetConfig?: FleetRuleDTO[];
		firstPlayer?: TurnOrder;
	};
}

export interface PlaceShipMessage {
	event: 'placeShip';
	payload: {
		placedShip: ShipPlacementDTO;
	};
}

export interface UnplaceShipMessage {
	event: 'unplaceShip';
	payload: {
		id: string;
	};
}

export interface PlayerReadyMessage {
	event: 'playerReady';
}

export interface MakeTurnMessage {
	event: 'makeTurn';
	payload: {
		coords: CoordsDTO;
	};
}

export interface SurrenderMessage {
	event: 'surrender';
}

export interface DestroyLobbyMessage {
	event: 'destroyLobby';
}

export type C2SMessage =
	| CreateGameMessage
	| JoinGameMessage
	| UpdateSettingsMessage
	| PlaceShipMessage
	| UnplaceShipMessage
	| PlayerReadyMessage
	| MakeTurnMessage
	| SurrenderMessage
	| DestroyLobbyMessage;

// =====================================================================================
// |                           Server to Client (S2C) Messages                           |
// =====================================================================================

export interface GameCreatedMessage {
	event: 'gameCreated';
	payload: {
		gameState: GameStateDTO;
	};
}

export interface GameStateUpdateMessage {
	event: 'gameStateUpdate';
	payload: {
		gameState: GameStateDTO;
	};
}

export interface TurnResultMessage {
	event: 'turnResult';
	payload: {
		coord: CoordsDTO;
		result: ShotResult;
		GameState: GameStateDTO;
	};
}

export interface GameOverMessage {
	event: 'gameOver';
	payload: {
		winnerId: string;
	};
}

export interface ErrorMessage {
	event: 'error';
	payload: {
		message: string;
	};
}

export type S2CMessage =
	| GameCreatedMessage
	| GameStateUpdateMessage
	| TurnResultMessage
	| GameOverMessage
	| ErrorMessage;
