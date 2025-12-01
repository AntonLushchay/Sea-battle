import { CoordsDTO, FleetRuleDTO } from '@sea-battle/shared';

import { Ship } from '../ship/ship';
import type { IShip } from '../ship/types';

import { IFleet } from './types';

const DEFAULT_FLEET_CONFIG: FleetRuleDTO[] = [
	{ type: 'carrier', size: 4, count: 1 },
	{ type: 'battleship', size: 3, count: 2 },
	{ type: 'cruiser', size: 2, count: 3 },
	{ type: 'destroyer', size: 1, count: 4 },
];

export class Fleet implements IFleet {
	private readonly fleet: IShip[] = [];

	constructor(fleetConfig: FleetRuleDTO[] = DEFAULT_FLEET_CONFIG) {
		for (const rule of fleetConfig) {
			for (let i = 1; i <= rule.count; i++) {
				const shipId = `${rule.type}-${i}`;
				this.fleet.push(new Ship({ id: shipId, type: rule.type, size: rule.size }));
			}
		}
	}

	public getShipById(shipId: string): IShip {
		const ship = this.fleet.find((ship) => ship.id === shipId);
		if (!ship) {
			throw new Error(`Ship with ID ${shipId} not found in fleet`);
		}
		return ship;
	}

	public isShipSunk(shipId: string): boolean {
		const ship = this.getShipById(shipId);
		return ship ? ship.isSunk() : false;
	}

	public areAllShipsSunk(): boolean {
		return this.fleet.every((ship) => ship.isSunk());
	}

	public areAllShipsPlaced(): boolean {
		return this.fleet.every((ship) => ship.isPlaced());
	}

	public getFleet(): IShip[] {
		return this.fleet;
	}

	public assignCellsToShip(ship: IShip, shipCoords: CoordsDTO[]): void {
		ship.setOccupiedCells(shipCoords);
	}

	public processShot(shipId: string): void {
		const ship = this.getShipById(shipId);
		if (ship) {
			ship.recordHit();
		}
	}
}
