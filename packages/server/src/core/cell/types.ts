import { CellStatus, CoordsDTO, ShotResult } from '@sea-battle/shared';

import { IShip } from '../ship/types';

export interface ICell {
	readonly coords: CoordsDTO;
	status: CellStatus;
	getShipReference(): IShip | null;
	// isOccupied(): boolean;
	// Скорее всего я хочу хранить тут только ShipID, а не весь объект
	setShip(ship: IShip): void;
	clearShip(): void;
	receiveShot(): ShotResult;
}
