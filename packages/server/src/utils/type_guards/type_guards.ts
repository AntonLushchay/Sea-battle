// =====================================================================================
// |                                      Type Guards                                  |
// =====================================================================================

import {
	CoordsDTO,
	CreateGameMessage,
	FleetPlacementPayloadDTO,
	FleetRuleDTO,
	JoinGameMessage,
	Orientation,
	PlaceFleetMessage,
	ReconnectMessage,
	ReconnectPayloadDTO,
	ShipPlacementDTO,
	SomeIdDTO,
	TurnOrder,
	UpdateSettingsDTO,
	UpdateSettingsMessage,
	UpdateSettingsPayloadDTO,
} from '@sea-battle/shared';

// Базовый тип после первичной проверки
type BaseMessage = { event: string; payload?: unknown };

// Проверка, что data — объект с строковым event
export const isObjectWithEvent = (data: unknown): data is BaseMessage => {
	return (
		isValidObject(data) &&
		'event' in data &&
		typeof (data as { event?: unknown }).event === 'string'
	);
};

// =====================================================================================
// |                        isCreateGameMessage Type Guards                            |
// =====================================================================================
// Проверка, что это createGame message (без payload).
export const isCreateGameMessage = (obj: BaseMessage): obj is CreateGameMessage => {
	return isValidObject(obj) && obj.event === 'createGame' && !('payload' in obj);
};

// =====================================================================================
// |                        isJoinToGameMessage Type Guards                            |
// =====================================================================================
// Проверка, что это joinToGame message (payload: SomeIdDTO с полем id).
export const isJoinToGameMessage = (obj: BaseMessage): obj is JoinGameMessage => {
	return isValidObject(obj) && obj.event === 'joinToGame' && isSomeIdDTO(obj.payload);
};

const isSomeIdDTO = (payload: unknown): payload is SomeIdDTO => {
	return isValidObject(payload) && typeof (payload as { id?: unknown }).id === 'string';
};

// =====================================================================================
// |                        isReconnectMessage Type Guards                             |
// =====================================================================================
// Проверка, что это reconnect message (payload: ReconnectPayloadDTO с playerId и gameId).
export const isReconnectMessage = (obj: BaseMessage): obj is ReconnectMessage => {
	return isValidObject(obj) && obj.event === 'reconnect' && isReconnectPayloadDTO(obj.payload);
};

const isReconnectPayloadDTO = (payload: unknown): payload is ReconnectPayloadDTO => {
	return isValidObject(payload) && isValidGameAndPlayerIds(payload);
};

// =====================================================================================
// |                      isUpdateSettingsMessage Type Guards                          |
// =====================================================================================
export const isUpdateSettingsMessage = (obj: BaseMessage): obj is UpdateSettingsMessage => {
	return (
		isValidObject(obj) &&
		obj.event === 'updateSettings' &&
		isUpdateSettingsPayloadDTO(obj.payload)
	);
};

const isUpdateSettingsPayloadDTO = (payload: unknown): payload is UpdateSettingsPayloadDTO => {
	return (
		isValidObject(payload) &&
		isValidGameAndPlayerIds(payload) &&
		isUpdateSettingsDTO((payload as { settings?: unknown }).settings)
	);
};

const isUpdateSettingsDTO = (settings: unknown): settings is UpdateSettingsDTO => {
	return (
		isValidObject(settings) &&
		typeof (settings as { boardSize?: unknown }).boardSize === 'number' &&
		isFleetRuleDTOArray((settings as { fleetConfig?: unknown }).fleetConfig) &&
		isTurnOrder((settings as { firstPlayer?: unknown }).firstPlayer)
	);
};

const isFleetRuleDTOArray = (fleetConfig: unknown): fleetConfig is Array<FleetRuleDTO> => {
	return (
		Array.isArray(fleetConfig) &&
		fleetConfig.every(
			(item) =>
				isValidObject(item) &&
				typeof (item as { type?: unknown }).type === 'string' &&
				typeof (item as { size?: unknown }).size === 'number' &&
				typeof (item as { count?: unknown }).count === 'number'
		)
	);
};

const isTurnOrder = (firstPlayer: unknown): firstPlayer is TurnOrder => {
	return (
		typeof firstPlayer === 'string' &&
		(firstPlayer === 'PLAYER_1' || firstPlayer === 'PLAYER_2' || firstPlayer === 'RANDOM')
	);
};

// =====================================================================================
// |                        isPlaceFleetMessage Type Guards                            |
// =====================================================================================
export const isPlaceFleetMessage = (obj: BaseMessage): obj is PlaceFleetMessage => {
	return obj.event === 'placeFleet' && isFleetPlacementPayloadDTO(obj.payload);
};

const isFleetPlacementPayloadDTO = (payload: unknown): payload is FleetPlacementPayloadDTO => {
	return (
		isValidObject(payload) &&
		isValidGameAndPlayerIds(payload) &&
		isShipPlacementDTOArray((payload as { fleet?: unknown }).fleet)
	);
};

const isShipPlacementDTOArray = (fleet: unknown): fleet is Array<ShipPlacementDTO> => {
	return (
		Array.isArray(fleet) &&
		fleet.every(
			(item) =>
				isValidObject(item) &&
				typeof (item as { shipId?: unknown }).shipId === 'string' &&
				isCoordsDTO((item as { startCoords?: unknown }).startCoords) &&
				isOrientation((item as { orientation?: unknown }).orientation)
		)
	);
};

const isCoordsDTO = (startCoords: unknown): startCoords is CoordsDTO => {
	return (
		isValidObject(startCoords) &&
		typeof (startCoords as { x?: unknown }).x === 'number' &&
		typeof (startCoords as { y?: unknown }).y === 'number'
	);
};

const isOrientation = (orientation: unknown): orientation is Orientation => {
	return (
		typeof orientation === 'string' &&
		(orientation === 'horizontal' || orientation === 'vertical')
	);
};

// =====================================================================================
// |                                   Helpers                                         |
// =====================================================================================

const isValidObject = (obj: unknown): obj is Record<string, unknown> => {
	return typeof obj === 'object' && obj !== null;
};

const isValidGameAndPlayerIds = (obj: unknown): obj is { playerId: string; gameId: string } => {
	return (
		typeof (obj as { playerId?: unknown }).playerId === 'string' &&
		typeof (obj as { gameId?: unknown }).gameId === 'string'
	);
};
