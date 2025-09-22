import type { CoordsDTO } from '@sea-battle/shared';

import { Cell, type ICell } from './cell';
import type { IShip } from './ship';

export interface IBoard {
	getCell(x: number, y: number): ICell | undefined;
	validatePlacement(ship: IShip, coords: CoordsDTO[]): boolean;
	getSize(): number;
	getGrid(): ICell[][];
}

export class Board implements IBoard {
	private readonly grid: ICell[][];
	private readonly size: number;

	constructor(size: number) {
		this.size = size;
		this.grid = Array.from({ length: size }, (_, y) =>
			Array.from({ length: size }, (_, x) => new Cell(x, y))
		);
	}

	public getCell(x: number, y: number): ICell | undefined {
		return this.grid[y]?.[x];
	}

	public getSize(): number {
		return this.size;
	}

	public getGrid(): ICell[][] {
		return this.grid;
	}

	public validatePlacement(ship: IShip, coords: CoordsDTO[]): boolean {
		// 1. Check if coords match ship size
		if (ship.getSize() !== coords.length) {
			return false;
		}

		for (const coord of coords) {
			// 2. Check for out-of-bounds
			if (coord.x < 0 || coord.x >= this.size || coord.y < 0 || coord.y >= this.size) {
				return false;
			}

			const cell = this.getCell(coord.x, coord.y);
			// 3. Check for cell occupation
			if (!cell || cell.isOccupied()) {
				return false;
			}
		}

		return true;
	}
}
