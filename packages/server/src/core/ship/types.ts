import { CoordsDTO } from '@sea-battle/shared';

export interface IShip {
	id: string;
	type: string;
	size: number;
	hits: number;
	setOccupiedCells(cells: CoordsDTO[]): void;
	getOccupiedCells(): CoordsDTO[];
	isSunk(): boolean;
	isPlaced(): boolean;
	recordHit(): void;
}
