import type { CoordsDTO, ShipBaseDTO } from '@sea-battle/shared';

import { IShip } from './types';

export class Ship implements IShip {
	private readonly _id: string;
	private readonly _type: string;
	private readonly _size: number;
	private _hits: number = 0;
	private occupiedCells: CoordsDTO[] = [];

	constructor(baseInfo: ShipBaseDTO) {
		this._id = baseInfo.id;
		this._type = baseInfo.type;
		this._size = baseInfo.size;
	}

	public get id(): string {
		return this._id;
	}

	public get type(): string {
		return this._type;
	}

	public get size(): number {
		return this._size;
	}

	public set hits(value: number) {
		this._hits = value;
	}

	public get hits(): number {
		return this._hits;
	}

	public setOccupiedCells(value: CoordsDTO[]) {
		this.occupiedCells = value;
	}

	public getOccupiedCells(): CoordsDTO[] {
		return this.occupiedCells;
	}

	public isSunk(): boolean {
		return this.hits >= this.size;
	}

	public isPlaced(): boolean {
		return this._occupiedCells.length === this.size;
	}

	public recordHit(): void {
		if (this.hits < this.size) {
			this.hits++;
		}
	}
}
