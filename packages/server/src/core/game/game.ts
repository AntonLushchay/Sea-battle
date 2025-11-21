import type { GameStatus, UpdateSettingsDTO } from '@sea-battle/shared';

import { Player } from '../player/player';
import type { IPlayer } from '../player/types';

import type { IGame } from './types';

const MAX_PLAYERS = 2;

export class Game implements IGame {
	private readonly _gameId: string;
	private _status: GameStatus = 'SETUP';
	private _currentPlayerId: string | null = null;
	private _hostPlayerId: string | null = null;
	private players: IPlayer[] = [];

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

		const players = this.getPlayers();
		if (settings.firstPlayer === 'RANDOM') {
			// eslint-disable-next-line sonarjs/pseudo-random
			const randomIndex = Math.floor(Math.random() * MAX_PLAYERS);
			this.currentPlayerId = players[randomIndex]?.playerId ?? null;
		} else if (settings.firstPlayer === 'PLAYER_1') {
			this.currentPlayerId = players[0]?.playerId ?? null;
		} else if (settings.firstPlayer === 'PLAYER_2') {
			this.currentPlayerId = players[1]?.playerId ?? null;
		}
	}

	public placeFleet(): void {}

	// public playerReady(playerId: string): void {
	// 	const player = this.getPlayer(playerId);
	// 	if (!player) throw new Error('Player not found.');

	// 	player.setReady(true);

	// 	const allReady =
	// 		this.players.length === MAX_PLAYERS && this.players.every((p) => p.isReady());
	// 	if (allReady) {
	// 		this.status = 'IN_PROGRESS';
	// 		this.currentPlayerId = this.players[0].getId(); // Host starts
	// 	}
	// }

	// public processTurn(playerId: ID, coords: CoordsDTO): ShotResult {
	// 	if (this.status !== 'IN_PROGRESS') throw new Error('Game is not in progress.');
	// 	if (playerId !== this.currentPlayerId) throw new Error("It's not your turn.");

	// 	const opponent = this.players.find((p) => p.getId() !== playerId);
	// 	if (!opponent) throw new Error('Opponent not found.');

	// 	const result = opponent.receiveShot(coords);

	// 	if (opponent.getFleet().areAllShipsSunk()) {
	// 		this.status = 'FINISHED';
	// 	} else {
	// 		// TODO: Implement turn switching
	// 	}

	// 	return result;
	// }
}
