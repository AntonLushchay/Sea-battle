import { randomUUID } from 'crypto';

import { CoordsDTO, ShipPlacementDTO, UpdateSettingsDTO } from '@sea-battle/shared';

import { Game } from '../core/game/game';
import type { IGame } from '../core/game/types';
import { gameRepository } from '../data/game.repository';
import type { IGameRepository } from '../data/types';

import type { IGameService } from './types';

const DISCONNECT_TIMEOUT_MS = 30000; // 30 seconds

class GameService implements IGameService {
	private readonly repository: IGameRepository;
	private disconnectTimers: Map<string, ReturnType<typeof setTimeout>> = new Map();

	constructor(repository: IGameRepository) {
		this.repository = repository;
	}

	public createNewGame(): IGame {
		const gameId = randomUUID();
		const playerId = randomUUID();

		const newGame: IGame = new Game(gameId);
		newGame.addPlayer(playerId);
		newGame.hostPlayerId = playerId;

		this.repository.save(newGame);
		return newGame;
	}

	public joinGame(gameId: string): IGame {
		const joiningPlayerId = randomUUID();
		const foundGame = this.repository.findByGameId(gameId);
		if (!foundGame) {
			throw new Error(`Game with ID ${gameId} not found.`);
		}

		foundGame.addPlayer(joiningPlayerId);

		return foundGame;
	}

	public reconnectPlayer(playerId: string, gameId: string): [boolean, IGame | null] {
		const foundGame = this.repository.findByGameId(gameId);
		if (!foundGame) {
			return [false, null];
		}

		const player = foundGame.getPlayer(playerId);
		if (!player) {
			return [false, null];
		}

		foundGame.markPlayerConnect(playerId);

		// Cancel pending disconnect cleanup if any
		const timer = this.disconnectTimers.get(playerId);
		if (timer) {
			clearTimeout(timer);
			this.disconnectTimers.delete(playerId);
		}

		return [true, foundGame];
	}

	public clientDisconnect(playerId: string, callback: (game: IGame) => void): IGame {
		const foundGame = this.repository.findByPlayerId(playerId);
		if (!foundGame) throw new Error(`Game for player ID ${playerId} not found.`);

		foundGame.markPlayerDisconnect(playerId);

		// Clear existing timer if present
		const existing = this.disconnectTimers.get(playerId);
		if (existing) clearTimeout(existing);

		// Start new grace-period timer
		const timer = setTimeout(() => {
			this.cleanupDisconnectedPlayer(playerId, callback);
			this.disconnectTimers.delete(playerId);
		}, DISCONNECT_TIMEOUT_MS); // 30 seconds
		this.disconnectTimers.set(playerId, timer);

		return foundGame;
	}

	private cleanupDisconnectedPlayer(playerId: string, callback: (game: IGame) => void): void {
		const game = this.repository.findByPlayerId(playerId);
		if (!game) return;

		const player = game.getPlayer(playerId);
		// If reconnected before timer fired — do nothing
		if (!player || player.isConnected) return;

		// Scenario 1: both players disconnected → delete game
		if (!game.isGameAlive()) {
			this.repository.delete(game.gameId);
			return;
		}

		// Scenario 2: IN_PROGRESS and player still disconnected while opponent alive → surrender
		if (game.status === 'IN_PROGRESS') {
			game.surrender(playerId);
			// Remove surrendered (disconnected) player from game roster if still present
			if (game.getPlayer(playerId)) {
				game.removePlayer(playerId);
			}

			if (game.getPlayers().length === 0) {
				this.repository.delete(game.gameId);
				return;
			}

			callback(game);
			return;
		}

		// Scenario 3: Not IN_PROGRESS → simply remove disconnected player
		if (game.getPlayer(playerId)) {
			game.removePlayer(playerId);
		}

		const remaining = game.getPlayers();
		if (remaining.length === 0) {
			this.repository.delete(game.gameId);
			return;
		}

		// If everyone left is disconnected, delete the game
		if (!game.isGameAlive()) {
			this.repository.delete(game.gameId);
			return;
		}

		callback(game);
	}

	// there is playerId - the one who wants to update settings
	public updateSettings(playerId: string, gameId: string, settings: UpdateSettingsDTO): IGame {
		const foundGame = this.repository.findByGameId(gameId);
		if (!foundGame) throw new Error(`Game with ID ${gameId} not found.`);

		foundGame.updateSettings(playerId, settings);

		return foundGame;
	}

	public placeFleet(gameId: string, playerId: string, fleet: ShipPlacementDTO[]): IGame {
		const foundGame = this.repository.findByGameId(gameId);
		if (!foundGame) throw new Error(`Game with ID ${gameId} not found.`);

		foundGame.placeFleet(playerId, fleet);

		return foundGame;
	}

	public playerReadyChange(playerId: string, gameId: string): IGame {
		const foundGame = this.repository.findByGameId(gameId);
		if (!foundGame) throw new Error(`Game with ID ${gameId} not found.`);

		foundGame.playerReadyChange(playerId);

		return foundGame;
	}

	public startGame(playerId: string, gameId: string): IGame {
		const foundGame = this.repository.findByGameId(gameId);
		if (!foundGame) throw new Error(`Game with ID ${gameId} not found.`);

		foundGame.startGame(playerId);

		return foundGame;
	}

	public makeTurn(playerId: string, gameId: string, coord: CoordsDTO): IGame {
		const foundGame = this.repository.findByGameId(gameId);
		if (!foundGame) throw new Error(`Game with ID ${gameId} not found.`);

		foundGame.processTurn(playerId, coord);

		return foundGame;
	}

	public surrender(playerId: string, gameId: string): IGame {
		const foundGame = this.repository.findByGameId(gameId);
		if (!foundGame) throw new Error(`Game with ID ${gameId} not found.`);

		foundGame.surrender(playerId);

		return foundGame;
	}

	public resetGame(playerId: string, gameId: string): IGame {
		const foundGame = this.repository.findByGameId(gameId);
		if (!foundGame) throw new Error(`Game with ID ${gameId} not found.`);

		const player = foundGame.getPlayer(playerId);
		if (!player) throw new Error('Player not found in the game.');

		if (!foundGame.isHost(playerId)) {
			throw new Error('Only the host can reset the game.');
		}

		foundGame.resetGame(playerId);

		return foundGame;
	}

	public exitGame(playerId: string, gameId: string): IGame {
		const foundGame = this.repository.findByGameId(gameId);
		if (!foundGame) throw new Error(`Game with ID ${gameId} not found.`);

		const player = foundGame.getPlayer(playerId);
		if (!player) throw new Error('Player not found in the game.');

		foundGame.removePlayer(playerId);

		if (foundGame.getPlayers().length === 0) {
			this.repository.delete(gameId);
		}

		return foundGame;
	}
}

// Export a singleton instance of the service
export const gameService = new GameService(gameRepository);
