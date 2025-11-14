// import { CoordsDTO } from '@sea-battle/shared';

import type { ICell } from '../cell/types';
// import { IShip } from '../ship/types';

export interface IBoard {
	size: number;
	getCell(x: number, y: number): ICell | undefined;
	// validatePlacement(ship: IShip, coords: CoordsDTO[]): boolean;
	getGrid(): ICell[][];
}
