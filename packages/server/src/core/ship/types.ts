import { CoordsDTO } from '@sea-battle/shared';

export interface IShip {
	id: string;
	type: string;
	size: number;
	hits: number;
	setOccupiedCells(cells: CoordsDTO[]): void;
	isSunk(): boolean;
	isPlaced(): boolean;
	recordHit(): void;
}
