import { FleetRuleDTO } from '@sea-battle/shared';

import { Board } from '../board/board';
import type { IBoard } from '../board/types';
import { Fleet } from '../fleet/fleet';
import type { IFleet } from '../fleet/types';

import type { IPlayer } from './types';

export class Player implements IPlayer {
	private readonly _playerId: string;
	private _isReady: boolean = false;
	private board: IBoard;
	private fleet: IFleet;

	constructor(playerId: string) {
		this._playerId = playerId;
		this.board = new Board();
		this.fleet = new Fleet();
	}

	public get playerId(): string {
		return this._playerId;
	}

	public set isReady(isReady: boolean) {
		this._isReady = isReady;
	}

	public get isReady(): boolean {
		return this._isReady;
	}

	public getBoard(): IBoard {
		return this.board;
	}

	public getFleet(): IFleet {
		return this.fleet;
	}

	public rebuildBoard(size: number): void {
		if (this.board.size !== size) {
			this.board = new Board(size);
			console.log(`Player ${this.playerId} board rebuilt to size ${size}`);
		}
	}

	public rebuildFleet(fleetConfig: FleetRuleDTO[]): void {
		this.fleet = new Fleet(fleetConfig);
		console.log(`Player ${this.playerId} fleet rebuilt with new configuration`);
	}

	// public placeShip({ placedShip }: PlaceShipPayload): void {
	// 	const ship = this.fleet.getShipById(placedShip.baseInfo.shipId);
	// 	if (!ship || ship.isPlaced()) {
	// 		throw new Error('Ship not found or already placed.');
	// 	}

	// 	if (!this.board.validatePlacement(ship, placedShip.coords)) {
	// 		throw new Error('Invalid ship placement.');
	// 	}

	// 	ship.setPosition(placedShip.coords);

	// 	for (const coord of placedShip.coords) {
	// 		this.board.getCell(coord.x, coord.y)?.setShip(ship);
	// 	}
	// }

	// public unplaceShip({ shipID }: UnplaceShipPayload): void {
	// 	const ship = this.fleet.getShipById(shipID);
	// 	if (!ship || !ship.isPlaced()) {
	// 		throw new Error('Ship not found or not placed.');
	// 	}

	// 	const oldCoords = ship.getPosition(); // Assuming getPosition() exists on IShip
	// 	ship.setPosition([]); // Clear position

	// 	for (const coord of oldCoords) {
	// 		this.board.getCell(coord.x, coord.y)?.clearShip();
	// 	}
	// }

	// public receiveShot(coords: CoordsDTO): ShotResult {
	// 	const cell = this.board.getCell(coords.x, coords.y);
	// 	if (!cell) {
	// 		throw new Error('Shot out of bounds');
	// 	}
	// 	return cell.receiveShot();
	// }
}
