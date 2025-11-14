import { CoordsDTO } from '@sea-battle/shared';

export interface IShip {
	id: string;
	type: string;
	size: number;
	hits: number;
	isSunk(): boolean;
	isPlaced(): boolean;
	getPosition(): CoordsDTO[];
	recordHit(): void;
	setPosition(coords: CoordsDTO[]): void;
}
