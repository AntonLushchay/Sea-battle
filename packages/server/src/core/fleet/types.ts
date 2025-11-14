import { IShip } from '../ship/types';

export interface IFleet {
	getShipById(shipId: string): IShip | undefined;
	areAllShipsSunk(): boolean;
	getFleet(): IShip[];
}
