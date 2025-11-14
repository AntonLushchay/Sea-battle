// import type { CoordsDTO } from '@sea-battle/shared';

import { Cell } from '../cell/cell';
import type { ICell } from '../cell/types';
// import type { IShip } from '../ship/types';

import { IBoard } from './types';

const DEFAULT_BOARD_SIZE = 10;

export class Board implements IBoard {
	private readonly _size: number;
	private readonly grid: ICell[][];

	constructor(size: number = DEFAULT_BOARD_SIZE) {
		this._size = size;
		this.grid = Array.from({ length: this._size }, (_, y) =>
			Array.from({ length: this._size }, (_, x) => new Cell(x, y))
		);
	}

	public get size(): number {
		return this._size;
	}

	public getCell(x: number, y: number): ICell | undefined {
		return this.grid[y]?.[x];
	}

	public getGrid(): ICell[][] {
		return this.grid;
	}

	// public validatePlacement(ship: IShip, coords: CoordsDTO[]): boolean {
	// 	// 1. Check if coords match ship size
	// 	if (ship.getSize() !== coords.length) {
	// 		return false;
	// 	}

	// 	for (const coord of coords) {
	// 		// 2. Check for out-of-bounds
	// 		if (coord.x < 0 || coord.x >= this.size || coord.y < 0 || coord.y >= this.size) {
	// 			return false;
	// 		}

	// 		const cell = this.getCell(coord.x, coord.y);
	// 		// 3. Check for cell occupation
	// 		if (!cell || cell.isOccupied()) {
	// 			return false;
	// 		}
	// 	}

	// 	return true;
	// }
}
