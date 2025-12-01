import type {
	CoordsDTO,
	GameStatus,
	LastTurnDTO,
	ShipPlacementDTO,
	TurnOrder,
	UpdateSettingsDTO,
} from '@sea-battle/shared';

import { Player } from '../player/player';
import type { IPlayer } from '../player/types';

import type { IGame } from './types';

const MAX_PLAYERS = 2;

export class Game implements IGame {
	private readonly _gameId: string;
	private _status: GameStatus = 'SETUP';
	private _currentPlayerId: string | null = null;
	private _hostPlayerId: string | null = null;
	private lastTurn: LastTurnDTO | null = null;
	private players: IPlayer[] = [];
	private _winnerPlayerId: string | null = null;

	constructor(gameId: string) {
		this._gameId = gameId;
	}

	public get gameId(): string {
		return this._gameId;
	}

	public set status(value: GameStatus) {
		this._status = value;
	}

	public get status(): GameStatus {
		return this._status;
	}

	public set currentPlayerId(value: string | null) {
		this._currentPlayerId = value;
	}

	public get currentPlayerId(): string | null {
		return this._currentPlayerId;
	}

	public set hostPlayerId(value: string | null) {
		this._hostPlayerId = value;
	}

	public get hostPlayerId(): string | null {
		return this._hostPlayerId;
	}

	public set winnerPlayerId(value: string | null) {
		this._winnerPlayerId = value;
	}

	public get winnerPlayerId(): string | null {
		return this._winnerPlayerId;
	}

	public setLastTurn(value: LastTurnDTO | null): void {
		this.lastTurn = value;
	}

	public getLastTurn(): LastTurnDTO | null {
		return this.lastTurn;
	}

	public getPlayers(): IPlayer[] {
		return this.players;
	}

	public getPlayer(playerId: string): IPlayer | undefined {
		return this.players.find((p) => p.playerId === playerId);
	}

	public getEnemyPlayer(myPlayerId: string): IPlayer | undefined {
		return this.players.find((p) => p.playerId !== myPlayerId);
	}

	public addPlayer(playerId: string): void {
		if (this.players.length >= MAX_PLAYERS) {
			throw new Error('Game is full.');
		}
		const player: IPlayer = new Player(playerId);
		this.players.push(player);
	}

	public isHost(playerId: string): boolean {
		return this._hostPlayerId === playerId;
	}

	public markPlayerConnect(playerId: string): void {
		const player = this.getPlayer(playerId);
		if (player) {
			player.isConnected = true;
		}
	}

	public markPlayerDisconnect(playerId: string): void {
		const player = this.getPlayer(playerId);
		if (player) {
			player.isConnected = false;
		}
	}

	isGameAlive(): boolean {
		return this.players.some((p) => p.isConnected);
	}

	// there is playerId - the one who wants to update settings
	public updateSettings(playerId: string, settings: UpdateSettingsDTO): void {
		if (!this.isHost(playerId)) throw new Error('Only the host can change settings.');
		if (this.status !== 'SETUP') throw new Error('Can only update settings during setup.');
		if (settings.fleetConfig.some((rule) => rule.size > settings.boardSize)) {
			throw new Error('Ships cannot be larger than the board size.');
		}

		this.players.forEach((player) => {
			if (settings.boardSize) player.rebuildBoard(settings.boardSize);
			if (settings.fleetConfig) player.rebuildFleet(settings.fleetConfig);
			player.isReady = false;
		});

		this.setFirstPlayer(settings.firstPlayer);
	}

	public placeFleet(playerId: string, fleet: ShipPlacementDTO[]): void {
		const player = this.getPlayer(playerId);
		if (!player) throw new Error('Player not found.');

		player.placeFleet(fleet);
	}

	public playerReadyChange(playerId: string): void {
		if (this.status !== 'SETUP') throw new Error('Can only mark ready during SETUP phase.');

		const player = this.getPlayer(playerId);
		if (!player) throw new Error('Player not found.');

		player.toggleReadyState();
	}

	public startGame(playerId: string): void {
		if (!this.isHost(playerId)) throw new Error('Only the host can start the game.');
		if (this.status !== 'SETUP') throw new Error('Game can only be started from SETUP phase.');
		if (this.getPlayers().length < MAX_PLAYERS)
			throw new Error('Cannot start game: Not enough players.');

		const notReadyPlayer = this.getPlayers().find((player) => !player.isReady);
		if (notReadyPlayer) {
			throw new Error(`Cannot start game: Player ${notReadyPlayer.playerId} is not ready.`);
		}
		if (!this.currentPlayerId) {
			this.setFirstPlayer('RANDOM');
		}

		this.status = 'IN_PROGRESS';
	}

	public processTurn(playerId: string, coords: CoordsDTO): void {
		if (this.status !== 'IN_PROGRESS') throw new Error('Game is not in progress.');
		if (playerId !== this.currentPlayerId) throw new Error("It's not your turn.");

		const enemyPlayer = this.getEnemyPlayer(playerId);
		if (!enemyPlayer) throw new Error('Opponent not found.');

		const shotResult = enemyPlayer.receiveShot(coords);
		this.lastTurn = { playerId, coords, result: shotResult };
		if (shotResult === 'MISS') {
			this.currentPlayerId = enemyPlayer.playerId;
		}
		if (enemyPlayer.isFleetSunk()) {
			this.status = 'FINISHED';
			this.winnerPlayerId = playerId;
		}
	}

	public surrender(playerId: string): void {
		if (this.status !== 'IN_PROGRESS') throw new Error('Game is not in progress.');

		const surrenderingPlayer = this.getPlayer(playerId);
		if (!surrenderingPlayer) throw new Error('Player not found.');

		const enemyPlayer = this.getEnemyPlayer(playerId);
		if (!enemyPlayer) throw new Error('Opponent not found.');

		this.status = 'FINISHED';
		this.winnerPlayerId = enemyPlayer.playerId;
	}

	public removePlayer(playerId: string): void {
		const playerIndex = this.players.findIndex((p) => p.playerId === playerId);
		if (playerIndex === -1) {
			throw new Error('Player not found in the game.');
		}
		this.players.splice(playerIndex, 1);

		const [firstPlayer] = this.getPlayers();
		if (firstPlayer) {
			this.hostPlayerId = firstPlayer.playerId;
		}
	}

	public resetGame(playerId: string): void {
		if (!this.isHost(playerId)) {
			throw new Error('Only the host can reset the game.');
		}
		this.status = 'SETUP';
		this.currentPlayerId = null;
		this.winnerPlayerId = null;
		this.setLastTurn(null);

		this.players.forEach((player) => {
			player.resetForNewGame();
		});
	}

	private setFirstPlayer(firstPlayer: TurnOrder): void {
		const players = this.getPlayers();
		if (firstPlayer === 'RANDOM') {
			// eslint-disable-next-line sonarjs/pseudo-random
			const randomIndex = Math.floor(Math.random() * MAX_PLAYERS);
			this.currentPlayerId = players[randomIndex]?.playerId ?? null;
		} else if (firstPlayer === 'PLAYER_1') {
			this.currentPlayerId = players[0]?.playerId ?? null;
		} else if (firstPlayer === 'PLAYER_2') {
			this.currentPlayerId = players[1]?.playerId ?? null;
		}
	}
}
