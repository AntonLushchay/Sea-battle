import type { ID } from '@sea-battle/shared';

import type { IShip } from './ship';

export interface IFleet {
	getShipById(shipId: ID): IShip | undefined;
	areAllShipsSunk(): boolean;
	getShips(): IShip[];
}

export class Fleet implements IFleet {
	private readonly ships: IShip[];

	constructor(ships: IShip[]) {
		this.ships = ships;
	}

	public getShipById(shipId: ID): IShip | undefined {
		return this.ships.find((ship) => ship.getId() === shipId);
	}

	public areAllShipsSunk(): boolean {
		return this.ships.every((ship) => ship.isSunk());
	}

	public getShips(): IShip[] {
		return this.ships;
	}
}
