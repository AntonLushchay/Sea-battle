import type { CellStatus, CoordsDTO, ShotResult } from '@sea-battle/shared';
import type { IShip } from './ship';

export interface ICell {
	readonly coords: CoordsDTO;
	getStatus(): CellStatus;
	getShipReference(): IShip | null;
	isOccupied(): boolean;
	// Скорее всего я хочу хранить тут только ShipID, а не весь объект
	setShip(ship: IShip): void;
	clearShip(): void;
	receiveShot(): ShotResult;
}

export class Cell implements ICell {
	public readonly coords: CoordsDTO;
	private status: CellStatus = 'EMPTY';
	private shipReference: IShip | null = null;

	constructor(x: number, y: number) {
		this.coords = { x, y };
	}

	public getStatus(): CellStatus {
		return this.status;
	}

	public getShipReference(): IShip | null {
		return this.shipReference;
	}

	public isOccupied(): boolean {
		return !!this.shipReference;
	}

	public setShip(ship: IShip): void {
		this.shipReference = ship;
		this.status = 'SHIP';
	}

	public clearShip(): void {
		this.shipReference = null;
		this.status = 'EMPTY';
	}

	public receiveShot(): ShotResult {
		if (this.status === 'HIT' || this.status === 'MISS') {
			// Already shot here, no change
			return this.status === 'HIT' ? 'HIT' : 'MISS';
		}

		if (this.shipReference) {
			this.status = 'HIT';
			this.shipReference.recordHit();
			return this.shipReference.isSunk() ? 'SUNK' : 'HIT';
		} else {
			this.status = 'MISS';
			return 'MISS';
		}
	}
}
