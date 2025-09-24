import type {
	CoordsDTO,
	FleetRuleDTO,
	ID,
	PlaceShipPayload,
	ShotResult,
	UnplaceShipPayload,
} from '@sea-battle/shared';

import { Board, type IBoard } from './board';
import { Fleet, type IFleet } from './fleet';
import { Ship, type IShip } from './ship';

export interface IPlayer {
	getId(): ID;
	getName(): string;
	isReady(): boolean;
	getBoard(): IBoard;
	getFleet(): IFleet;
	setName(name: string): void;
	setReady(isReady: boolean): void;
	rebuildBoard(size: number): void;
	regenerateFleet(rules: FleetRuleDTO[]): void;
	placeShip(payload: PlaceShipPayload): void;
	unplaceShip(payload: UnplaceShipPayload): void;
	receiveShot(coords: CoordsDTO): ShotResult;
}

export class Player implements IPlayer {
	private readonly id: ID;
	private name: string;
	private _isReady: boolean = false;
	private board: IBoard;
	private fleet: IFleet;

	constructor(id: ID, name: string, boardSize: number, fleetRules: FleetRuleDTO[]) {
		this.id = id;
		this.name = name;
		this.board = new Board(boardSize);
		this.fleet = new Fleet([]); // Initial empty fleet
		this.regenerateFleet(fleetRules);
	}

	public getId(): ID {
		return this.id;
	}

	public getName(): string {
		return this.name;
	}

	public isReady(): boolean {
		return this._isReady;
	}

	public getBoard(): IBoard {
		return this.board;
	}

	public getFleet(): IFleet {
		return this.fleet;
	}

	public setName(name: string): void {
		this.name = name;
	}

	public setReady(isReady: boolean): void {
		this._isReady = isReady;
	}

	public rebuildBoard(size: number): void {
		this.board = new Board(size);
	}

	public regenerateFleet(rules: FleetRuleDTO[]): void {
		const ships: IShip[] = [];
		rules.forEach((rule) => {
			for (let i = 0; i < rule.count; i++) {
				// Create a unique ID for each ship instance
				const shipID = `${this.id}-${rule.type}-${i}`;
				ships.push(new Ship({ ...rule, shipID }));
			}
		});
		this.fleet = new Fleet(ships);
	}

	public placeShip({ placedShip }: PlaceShipPayload): void {
		const ship = this.fleet.getShipById(placedShip.baseInfo.shipID);
		if (!ship || ship.isPlaced()) {
			throw new Error('Ship not found or already placed.');
		}

		if (!this.board.validatePlacement(ship, placedShip.coords)) {
			throw new Error('Invalid ship placement.');
		}

		ship.setPosition(placedShip.coords);

		for (const coord of placedShip.coords) {
			this.board.getCell(coord.x, coord.y)?.setShip(ship);
		}
	}

	public unplaceShip({ shipID }: UnplaceShipPayload): void {
		const ship = this.fleet.getShipById(shipID);
		if (!ship || !ship.isPlaced()) {
			throw new Error('Ship not found or not placed.');
		}

		const oldCoords = ship.getPosition(); // Assuming getPosition() exists on IShip
		ship.setPosition([]); // Clear position

		for (const coord of oldCoords) {
			this.board.getCell(coord.x, coord.y)?.clearShip();
		}
	}

	public receiveShot(coords: CoordsDTO): ShotResult {
		const cell = this.board.getCell(coords.x, coords.y);
		if (!cell) {
			throw new Error('Shot out of bounds');
		}
		return cell.receiveShot();
	}
}
