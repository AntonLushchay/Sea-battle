import type { CoordsDTO, ID, ShipBaseDTO } from '@sea-battle/shared';

export interface IShip {
	getId(): ID;
	getType(): string;
	getSize(): number;
	getHits(): number;
	isSunk(): boolean;
	isPlaced(): boolean;
	getPosition(): CoordsDTO[];
	recordHit(): void;
	setPosition(coords: CoordsDTO[]): void;
}

export class Ship implements IShip {
	private readonly id: ID;
	private readonly type: string;
	private readonly size: number;
	private hits: number = 0;
	private position: CoordsDTO[] = [];

	constructor(baseInfo: ShipBaseDTO) {
		this.id = baseInfo.shipID;
		this.type = baseInfo.type;
		this.size = baseInfo.size;
	}

	public getId(): ID {
		return this.id;
	}

	public getType(): string {
		return this.type;
	}

	public getSize(): number {
		return this.size;
	}

	public getHits(): number {
		return this.hits;
	}

	public isSunk(): boolean {
		return this.hits >= this.size;
	}

	public isPlaced(): boolean {
		return this.position.length > 0;
	}

	public getPosition(): CoordsDTO[] {
		return this.position;
	}

	public recordHit(): void {
		if (this.hits < this.size) {
			this.hits++;
		}
	}

	public setPosition(coords: CoordsDTO[]): void {
		this.position = coords;
	}
}
