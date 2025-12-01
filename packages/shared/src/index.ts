// =====================================================================================
// |                                     Enums & Types                                 |
// =====================================================================================

export type CellStatus = 'EMPTY' | 'SHIP' | 'HIT' | 'MISS';

export type GameStatus = 'SETUP' | 'IN_PROGRESS' | 'FINISHED';

export type TurnOrder = 'PLAYER_1' | 'PLAYER_2' | 'RANDOM';

export type ShotResult = 'HIT' | 'MISS' | 'SUNK';

export type Orientation = 'horizontal' | 'vertical';

// =====================================================================================
// |                                        DTOs                                       |
// =====================================================================================

export interface ReconnectPayloadDTO {
	playerId: string;
	gameId: string;
}

export interface UpdateSettingsPayloadDTO {
	playerId: string;
	gameId: string;
	settings: UpdateSettingsDTO;
}

export interface FleetPlacementPayloadDTO {
	playerId: string;
	gameId: string;
	fleet: ShipPlacementDTO[];
}

export interface PlayerReadyPayloadDTO {
	playerId: string;
	gameId: string;
}

export interface StartGamePayloadDTO {
	playerId: string;
	gameId: string;
}

export interface ShipPlacementDTO {
	shipId: string;
	startCoords: CoordsDTO;
	orientation: Orientation;
}

export interface UpdateSettingsDTO {
	boardSize: number;
	fleetConfig: FleetRuleDTO[];
	firstPlayer: TurnOrder;
}

export interface MakeTurnPayloadDTO {
	playerId: string;
	gameId: string;
	coord: CoordsDTO;
}

export interface LastTurnDTO {
	playerId: string;
	coords: CoordsDTO;
	result: ShotResult;
}

export interface SurrenderPayloadDTO {
	playerId: string;
	gameId: string;
}

export interface ResetGamePayloadDTO {
	playerId: string;
	gameId: string;
}

export interface ExitGamePayloadDTO {
	playerId: string;
	gameId: string;
}

export interface PlayerDisconnectedPayloadDTO {
	playerId: string;
	gameState: GameStateDTO;
}

export interface CoordsDTO {
	x: number;
	y: number;
}

export interface SomeIdDTO {
	id: string;
}

export interface PlayerInfoDTO {
	playerID: string;
	isReady: boolean;
	isHost: boolean;
	isConnected: boolean;
}

export interface BoardDTO {
	size: number;
	cells: CellDTO[][];
}

export interface FleetRuleDTO extends Omit<ShipBaseDTO, 'id'> {
	count: number;
}

export interface ShipDTO {
	baseInfo: ShipBaseDTO;
	hitsCount: number;
	isSunk: boolean;
	isPlaced: boolean;
	coords: CoordsDTO[];
}

export interface ShipBaseDTO {
	id: string;
	type: string;
	size: number;
}

export interface CellDTO {
	coords: CoordsDTO;
	status: CellStatus;
}

export interface GameStateDTO {
	gameId: string;
	myPlayerId: string;
	players: [PlayerInfoDTO, ...PlayerInfoDTO[]];
	myBoard: BoardDTO;
	enemyBoard: BoardDTO | null;
	myFleet: ShipDTO[];
	currentPlayerId: string | null;
	lastTurn: LastTurnDTO | null;
	gameStatus: GameStatus;
	winner: string | null;
}

// =====================================================================================
// |                           Client to Server (C2S) Messages                         |
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

export interface PlaceFleetMessage {
	event: 'placeFleet';
	payload: FleetPlacementPayloadDTO;
}

export interface PlayerReadyMessage {
	event: 'playerReadyChange';
	payload: PlayerReadyPayloadDTO;
}

export interface StartGameMessage {
	event: 'startGame';
	payload: StartGamePayloadDTO;
}

export interface MakeTurnMessage {
	event: 'makeTurn';
	payload: MakeTurnPayloadDTO;
}

export interface SurrenderMessage {
	event: 'surrender';
	payload: SurrenderPayloadDTO;
}

export interface ResetGameMessage {
	event: 'resetGame';
	payload: ResetGamePayloadDTO;
}

export interface ExitGameMessage {
	event: 'exitGame';
	payload: ExitGamePayloadDTO;
}

// =====================================================================================
// |                           Server to Client (S2C) Messages                         |
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

export interface GameStateUpdatedMessage {
	event: 'updatedGameState';
	payload: GameStateDTO;
}

export interface GameOverMessage {
	event: 'gameOver';
	payload: SomeIdDTO;
}

export interface PlayerDisconnectedMessage {
	event: 'playerDisconnected';
	payload: PlayerDisconnectedPayloadDTO;
}

export interface ErrorMessage {
	event: 'error';
	payload: string;
}
