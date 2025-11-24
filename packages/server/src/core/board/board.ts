import { CoordsDTO } from '@sea-battle/shared';

import { Cell } from '../cell/cell';
import type { ICell } from '../cell/types';
import { IShip } from '../ship/types';

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

	public assignShipToCells(ship: IShip, coords: CoordsDTO[]): void {
		coords.forEach((coord) => {
			const cell = this.getCell(coord.x, coord.y);
			if (!cell) {
				throw new Error(
					`Invalid coordinates (${coord.x}, ${coord.y}) for board size ${this.size}.`
				);
			}
			cell.assignedShipId = ship.id;
			cell.status = 'SHIP';
		});
	}

	public validateCoords(coords: CoordsDTO[]): boolean {
		return coords.every((coord) => {
			console.log('Validating coord:', coord);
			return this.isCoordsOnBoard(coord.x, coord.y) && this.isValidCell(coord.x, coord.y);
		});
	}

	private isCoordsOnBoard(x: number, y: number): boolean {
		return x >= 0 && x < this.size && y >= 0 && y < this.size;
	}

	//checking and ship cells and adjacent cells
	private isValidCell(x: number, y: number): boolean {
		const neighbors = this.getCellAndNeighbors(x, y);
		return neighbors.every((cell) => cell.status !== 'SHIP');
	}

	private getCellAndNeighbors(x: number, y: number): ICell[] {
		const deltas: Array<[number, number]> = [
			[0, 0],
			[1, 0],
			[-1, 0],
			[0, 1],
			[0, -1],
			[1, 1],
			[-1, -1],
			[1, -1],
			[-1, 1],
		];

		return deltas
			.map(([dx, dy]) => this.getCell(x + dx, y + dy))
			.filter((c): c is ICell => Boolean(c));
	}
}
