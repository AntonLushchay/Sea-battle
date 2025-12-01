import { CoordsDTO } from '@sea-battle/shared';

import type { CellShotResult, ICell } from '../cell/types';
import { IShip } from '../ship/types';

export interface IBoard {
	size: number;
	getCell(x: number, y: number): ICell | undefined;
	getGrid(): ICell[][];
	validateCoords(coords: CoordsDTO[]): boolean;
	assignShipToCells(ship: IShip, coords: CoordsDTO[]): void;
	processShot(coords: CoordsDTO): CellShotResult;
}
