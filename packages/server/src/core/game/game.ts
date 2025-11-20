import type { GameStatus, UpdateSettingsDTO } from '@sea-battle/shared';

import { Player } from '../player/player';
import type { IPlayer } from '../player/types';

import type { IGame } from './types';

const MAX_PLAYERS = 2;

export class Game implements IGame {
	private readonly _gameId: string;
	private _status: GameStatus = 'SETUP';
	private _currentPlayerId: string | null = null;
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
		return this.players[0]?.playerId === playerId;
	}

	public updateSettings(playerId: string, settings: UpdateSettingsDTO): void {
		if (!this.isHost(playerId)) throw new Error('Only the host can change settings.');
		if (this.status !== 'SETUP') throw new Error('Can only update settings during setup.');
		if (settings.fleetConfig.some((rule) => rule.size > settings.boardSize)) {
			throw new Error('Ships cannot be larger than the board size.');
		}

		this.players.forEach((player) => {
			player.rebuildBoard(settings.boardSize);
			player.rebuildFleet(settings.fleetConfig);
		});
	}

	// public placeShip(playerId: string, placement: PlaceShipPayload): void {
	// 	this.getPlayer(playerId)?.placeShip(placement);
	// }

	// public unplaceShip(playerId: string, payload: UnplaceShipPayload): void {
	// 	this.getPlayer(playerId)?.unplaceShip(payload);
	// }

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
