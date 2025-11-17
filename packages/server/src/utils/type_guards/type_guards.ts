// =====================================================================================
// |                               Type Guards & Helpers                               |
// =====================================================================================

import { CreateGameMessage, JoinGameMessage, ReconnectMessage } from '@sea-battle/shared';

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
