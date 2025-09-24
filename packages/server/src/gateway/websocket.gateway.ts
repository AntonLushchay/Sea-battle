import type {
	GameCreatedPayload,
	GameStateUpdatePayload,
	ID,
	JoinGamePayload,
	MakeTurnPayload,
	PlaceShipPayload,
	TurnResultPayload,
	UnplaceShipPayload,
	UpdateSettingsPayload,
} from '@sea-battle/shared';
import { gameService, type IGameService } from '../services/game.service';

// This is a conceptual representation. The actual implementation will depend on the WebSocket library (e.g., Socket.IO, ws).
interface ISocket {
	id: ID;
	emit(event: string, payload: any): void;
	// other socket properties and methods
}

export interface IWebSocketGateway {
	handleCreateGame(socket: ISocket): GameCreatedPayload;
	handleJoinGame(socket: ISocket, payload: JoinGamePayload): GameStateUpdatePayload;
	handleUpdateSettings(socket: ISocket, payload: UpdateSettingsPayload): GameStateUpdatePayload;
	handlePlaceShip(socket: ISocket, payload: PlaceShipPayload): GameStateUpdatePayload;
	handleUnplaceShip(socket: ISocket, payload: UnplaceShipPayload): GameStateUpdatePayload;
	handlePlayerReady(socket: ISocket): GameStateUpdatePayload;
	handleMakeTurn(socket: ISocket, payload: MakeTurnPayload): TurnResultPayload;
	handleSurrender(socket: ISocket): GameStateUpdatePayload;
	handleReturnToLobby(socket: ISocket): void;
	handleDestroyLobby(socket: ISocket): void;
}

export class WebSocketGateway implements IWebSocketGateway {
	constructor(private readonly gameService: IGameService) {}

	public handleCreateGame(socket: ISocket): GameCreatedPayload {
		return this.gameService.createNewGame(socket.id);
	}

	public handleJoinGame(socket: ISocket, payload: JoinGamePayload): GameStateUpdatePayload {
		throw new Error('Method not implemented.');
	}

	public handleUpdateSettings(socket: ISocket, payload: UpdateSettingsPayload): GameStateUpdatePayload {
		throw new Error('Method not implemented.');
	}

	public handlePlaceShip(socket: ISocket, payload: PlaceShipPayload): GameStateUpdatePayload {
		throw new Error('Method not implemented.');
	}

	public handleUnplaceShip(socket: ISocket, payload: UnplaceShipPayload): GameStateUpdatePayload {
		throw new Error('Method not implemented.');
	}

	public handlePlayerReady(socket: ISocket): GameStateUpdatePayload {
		throw new Error('Method not implemented.');
	}

	public handleMakeTurn(socket: ISocket, payload: MakeTurnPayload): TurnResultPayload {
		throw new Error('Method not implemented.');
	}

	public handleSurrender(socket: ISocket): GameStateUpdatePayload {
		throw new Error('Method not implemented.');
	}

	public handleReturnToLobby(socket: ISocket): void {
		throw new Error('Method not implemented.');
	}

	public handleDestroyLobby(socket: ISocket): void {
		throw new Error('Method not implemented.');
	}

	// private broadcastToPlayers(gameState: GameStateDTO): void {
	// 	// Logic to send updates to all players in a game
	// }
}

// Export a singleton instance of the gateway
export const webSocketGateway = new WebSocketGateway(gameService);
