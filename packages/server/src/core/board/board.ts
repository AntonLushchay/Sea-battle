import { Cell } from '../cell/cell';
import type { ICell } from '../cell/types';

import { IBoard } from './types';

const DEFAULT_BOARD_SIZE = 10;
const MIN_BOARD_SIZE = 5;
const MAX_BOARD_SIZE = 20;

export class Board implements IBoard {
	private readonly _size: number;
	private readonly grid: ICell[][];

	constructor(size: number = DEFAULT_BOARD_SIZE) {
		if (size < MIN_BOARD_SIZE || size > MAX_BOARD_SIZE) {
			throw new Error(`Board size must be between ${MIN_BOARD_SIZE} and ${MAX_BOARD_SIZE}.`);
		}
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
}
