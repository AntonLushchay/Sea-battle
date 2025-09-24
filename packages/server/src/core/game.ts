import { randomUUID } from 'crypto';

import type {
	CoordsDTO,
	FleetRuleDTO,
	GameStatus,
	ID,
	PlaceShipPayload,
	ShotResult,
	UnplaceShipPayload,
	UpdateSettingsPayload,
} from '@sea-battle/shared';

import { Player, type IPlayer } from './player';

// Default game settings
const DEFAULT_BOARD_SIZE = 10;
const DEFAULT_FLEET_RULES: FleetRuleDTO[] = [
	{ type: 'carrier', size: 4, count: 1 },
	{ type: 'battleship', size: 3, count: 2 },
	{ type: 'cruiser', size: 2, count: 3 },
	{ type: 'destroyer', size: 1, count: 4 },
];
const MAX_PLAYERS = 2;

export interface IGame {
	getId(): ID;
	getStatus(): GameStatus;
	getPlayers(): IPlayer[];
	getCurrentPlayerId(): ID | null;
	addPlayer(name: string): IPlayer;
	getPlayer(playerId: ID): IPlayer | undefined;
	isHost(playerId: ID): boolean;
	updateSettings(playerId: ID, settings: UpdateSettingsPayload): void;
	placeShip(playerId: ID, placement: PlaceShipPayload): void;
	unplaceShip(playerId: ID, payload: UnplaceShipPayload): void;
	playerReady(playerId: ID): void;
	processTurn(playerId: ID, coords: CoordsDTO): ShotResult;
}

export class Game implements IGame {
	private readonly id: ID;
	private players: IPlayer[] = [];
	private status: GameStatus = 'SETUP';
	private currentPlayerId: ID | null = null;
	private boardSize: number = DEFAULT_BOARD_SIZE;
	private fleetRules: FleetRuleDTO[] = DEFAULT_FLEET_RULES;

	constructor() {
		this.id = randomUUID();
	}

	public getId(): ID {
		return this.id;
	}

	public getStatus(): GameStatus {
		return this.status;
	}

	public getPlayers(): IPlayer[] {
		return this.players;
	}

	public getCurrentPlayerId(): ID | null {
		return this.currentPlayerId;
	}

	public addPlayer(name: string): IPlayer {
		if (this.players.length >= MAX_PLAYERS) {
			throw new Error('Game is full.');
		}
		const playerId = randomUUID();
		const player = new Player(playerId, name, this.boardSize, this.fleetRules);
		this.players.push(player);
		return player;
	}

	public getPlayer(playerId: ID): IPlayer | undefined {
		return this.players.find((p) => p.getId() === playerId);
	}

	public isHost(playerId: ID): boolean {
		return this.players[0]?.getId() === playerId;
	}

	public updateSettings(playerId: ID, settings: UpdateSettingsPayload): void {
		if (this.status !== 'SETUP') throw new Error('Can only update settings during setup.');
		if (!this.isHost(playerId)) throw new Error('Only the host can change settings.');

		this.boardSize = settings.boardSize ?? this.boardSize;
		this.fleetRules = settings.fleetConfig ?? this.fleetRules;

		// Re-initialize all players with new settings
		this.players.forEach((p) => {
			p.rebuildBoard(this.boardSize);
			p.regenerateFleet(this.fleetRules);
		});
	}

	public placeShip(playerId: ID, placement: PlaceShipPayload): void {
		this.getPlayer(playerId)?.placeShip(placement);
	}

	public unplaceShip(playerId: ID, payload: UnplaceShipPayload): void {
		this.getPlayer(playerId)?.unplaceShip(payload);
	}

	public playerReady(playerId: ID): void {
		const player = this.getPlayer(playerId);
		if (!player) throw new Error('Player not found.');

		player.setReady(true);

		const allReady =
			this.players.length === MAX_PLAYERS && this.players.every((p) => p.isReady());
		if (allReady) {
			this.status = 'IN_PROGRESS';
			this.currentPlayerId = this.players[0].getId(); // Host starts
		}
	}

	public processTurn(playerId: ID, coords: CoordsDTO): ShotResult {
		if (this.status !== 'IN_PROGRESS') throw new Error('Game is not in progress.');
		if (playerId !== this.currentPlayerId) throw new Error("It's not your turn.");

		const opponent = this.players.find((p) => p.getId() !== playerId);
		if (!opponent) throw new Error('Opponent not found.');

		const result = opponent.receiveShot(coords);

		if (opponent.getFleet().areAllShipsSunk()) {
			this.status = 'FINISHED';
		} else {
			// TODO: Implement turn switching
		}

		return result;
	}
}
