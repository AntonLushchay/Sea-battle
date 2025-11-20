// =====================================================================================
// |                                      Type Guards                                  |
// =====================================================================================

import {
	CreateGameMessage,
	FleetRuleDTO,
	JoinGameMessage,
	ReconnectMessage,
	UpdateSettingsDTO,
	UpdateSettingsMessage,
	UpdateSettingsPayloadDTO,
} from '@sea-battle/shared';

// Базовый тип после первичной проверки
type BaseMessage = { event: string; payload?: unknown };

// Проверка, что data — объект с строковым event
export const isObjectWithEvent = (data: unknown): data is BaseMessage => {
	return (
		typeof data === 'object' &&
		data !== null &&
		'event' in data &&
		typeof (data as { event?: unknown }).event === 'string'
	);
};

// Проверка, что это createGame message (без payload).
export const isCreateGameMessage = (obj: BaseMessage): obj is CreateGameMessage => {
	return obj.event === 'createGame' && !('payload' in obj);
};

// Проверка, что это joinToGame message (payload: SomeIdDTO с полем id).
export const isJoinToGameMessage = (obj: BaseMessage): obj is JoinGameMessage => {
	return (
		obj.event === 'joinToGame' &&
		typeof obj.payload === 'object' &&
		obj.payload !== null &&
		typeof (obj.payload as { id?: unknown }).id === 'string'
	);
};

// Проверка, что это reconnect message (payload: ReconnectPayloadDTO с playerId и gameId).
export const isReconnectMessage = (obj: BaseMessage): obj is ReconnectMessage => {
	return (
		obj.event === 'reconnect' &&
		typeof obj.payload === 'object' &&
		obj.payload !== null &&
		typeof (obj.payload as { playerId?: unknown }).playerId === 'string' &&
		typeof (obj.payload as { gameId?: unknown }).gameId === 'string'
	);
};

export const isUpdateSettingsMessage = (obj: BaseMessage): obj is UpdateSettingsMessage => {
	return obj.event === 'updateSettings' && isUpdateSettingsPayloadDTO(obj.payload);
};

// =====================================================================================
// |                                   Helpers                                         |
// =====================================================================================

const isUpdateSettingsPayloadDTO = (obj: unknown): obj is UpdateSettingsPayloadDTO => {
	return (
		typeof obj === 'object' &&
		obj !== null &&
		typeof (obj as { playerId?: unknown }).playerId === 'string' &&
		typeof (obj as { gameId?: unknown }).gameId === 'string' &&
		isUpdateSettingsDTO((obj as { settings?: unknown }).settings)
	);
};

const isUpdateSettingsDTO = (obj: unknown): obj is UpdateSettingsDTO => {
	return (
		typeof obj === 'object' &&
		obj !== null &&
		typeof (obj as { boardSize?: unknown }).boardSize === 'number' &&
		isFirstPlayer((obj as { firstPlayer?: unknown }).firstPlayer) &&
		isFleetRuleDTO((obj as { fleetConfig?: unknown }).fleetConfig)
	);
};

const isFirstPlayer = (firstPlayer: unknown): firstPlayer is 'PLAYER_1' | 'PLAYER_2' | 'RANDOM' => {
	return (
		typeof firstPlayer === 'string' &&
		(firstPlayer === 'PLAYER_1' || firstPlayer === 'PLAYER_2' || firstPlayer === 'RANDOM')
	);
};

const isFleetRuleDTO = (arr: unknown): arr is FleetRuleDTO[] => {
	return (
		Array.isArray(arr) &&
		arr.every(
			(item) =>
				typeof item === 'object' &&
				item !== null &&
				typeof (item as { type?: unknown }).type === 'string' &&
				typeof (item as { size?: unknown }).size === 'number' &&
				typeof (item as { count?: unknown }).count === 'number'
		)
	);
};
