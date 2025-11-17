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

export interface UpdateSettingsDTO {
	boardSize?: number;
	fleetConfig?: FleetRuleDTO[];
	firstPlayer?: TurnOrder;
}

export interface UpdateSettingsPayloadDTO {
	playerId: SomeIdDTO;
	gameId: SomeIdDTO;
	settings: UpdateSettingsDTO;
}

export interface SomeIdDTO {
	id: string;
}

export interface TurnResultDTO {
	coord: CoordsDTO;
	result: ShotResult;
	gameState: GameStateDTO;
}

export interface ReconnectPayloadDTO {
	playerId: string;
	gameId: string;
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
	payload: SomeIdDTO;
}

export interface ReconnectMessage {
	event: 'reconnect';
	payload: ReconnectPayloadDTO;
}

export interface UpdateSettingsMessage {
	event: 'updateSettings';
	payload: UpdateSettingsPayloadDTO;
}

export interface PlaceShipMessage {
	event: 'placeShip';
	payload: ShipPlacementDTO;
}

export interface UnplaceShipMessage {
	event: 'unplaceShip';
	payload: SomeIdDTO;
}

export interface PlayerReadyMessage {
	event: 'playerReady';
}

export interface MakeTurnMessage {
	event: 'makeTurn';
	payload: CoordsDTO;
}

export interface SurrenderMessage {
	event: 'surrender';
}

export interface DestroyLobbyMessage {
	event: 'destroyLobby';
}

// =====================================================================================
// |                           Server to Client (S2C) Messages                           |
// =====================================================================================

export interface GameCreatedMessage {
	event: 'gameCreated';
	payload: GameStateDTO;
}

export interface GameJoinedMessage {
	event: 'gameJoined';
	payload: GameStateDTO;
}

export interface ReconnectedMessage {
	event: 'reconnected';
	payload: GameStateDTO;
}

export interface GameStateUpdateMessage {
	event: 'gameStateUpdate';
	payload: GameStateDTO;
}

export interface TurnResultMessage {
	event: 'turnResult';
	payload: TurnResultDTO;
}

export interface GameOverMessage {
	event: 'gameOver';
	payload: SomeIdDTO;
}

export interface ErrorMessage {
	event: 'error';
	payload: string;
}
