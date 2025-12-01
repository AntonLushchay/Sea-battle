import { CoordsDTO } from '@sea-battle/shared';

import { IShip } from '../ship/types';

export interface IFleet {
	isShipSunk(shipId: string): boolean;
	getShipById(shipId: string): IShip;
	areAllShipsSunk(): boolean;
	areAllShipsPlaced(): boolean;
	getFleet(): IShip[];
	assignCellsToShip(ship: IShip, shipCoords: CoordsDTO[]): void;
	processShot(shipId: string): void;
}
