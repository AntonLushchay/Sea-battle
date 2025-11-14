import type { CellStatus, CoordsDTO, ShotResult } from '@sea-battle/shared';

import type { IShip } from '../ship/types';

import { ICell } from './types';

export class Cell implements ICell {
	public readonly _coords: CoordsDTO;
	private _status: CellStatus = 'EMPTY';
	private shipReference: IShip | null = null;

	constructor(x: number, y: number) {
		this._coords = { x, y };
	}

	public get coords(): CoordsDTO {
		return this._coords;
	}

	public get status(): CellStatus {
		return this._status;
	}

	public getShipReference(): IShip | null {
		return this.shipReference;
	}

	// public isOccupied(): boolean {
	// 	return !!this.shipReference;
	// }

	public setShip(ship: IShip): void {
		this.shipReference = ship;
		this._status = 'SHIP';
	}

	public clearShip(): void {
		this.shipReference = null;
		this._status = 'EMPTY';
	}

	public receiveShot(): ShotResult {
		if (this.status === 'HIT' || this.status === 'MISS') {
			// Already shot here, no change
			return this.status === 'HIT' ? 'HIT' : 'MISS';
		}

		if (this.shipReference) {
			this._status = 'HIT';
			this.shipReference.recordHit();
			return this.shipReference.isSunk() ? 'SUNK' : 'HIT';
		} else {
			this._status = 'MISS';
			return 'MISS';
		}
	}
}
