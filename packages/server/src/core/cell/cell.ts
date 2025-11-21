import type { CellStatus, CoordsDTO } from '@sea-battle/shared';

import { ICell } from './types';

export class Cell implements ICell {
	public readonly _coords: CoordsDTO;
	private _status: CellStatus = 'EMPTY';
	private _assignedShipId: string | null = null;

	constructor(x: number, y: number) {
		this._coords = { x, y };
	}

	public get coords(): CoordsDTO {
		return this._coords;
	}

	public set status(value: CellStatus) {
		this._status = value;
	}

	public get status(): CellStatus {
		return this._status;
	}

	public set assignedShipId(value: string | null) {
		this._assignedShipId = value;
	}

	public get assignedShipId(): string | null {
		return this._assignedShipId;
	}

	// public receiveShot(): ShotResult {
	// 	if (this.status === 'HIT' || this.status === 'MISS') {
	// 		// Already shot here, no change
	// 		return this.status === 'HIT' ? 'HIT' : 'MISS';
	// 	}

	// 	if (this.assignedShip) {
	// 		this.status = 'HIT';
	// 		this.assignedShip.recordHit();
	// 		return this.assignedShip.isSunk() ? 'SUNK' : 'HIT';
	// 	} else {
	// 		this.status = 'MISS';
	// 		return 'MISS';
	// 	}
	// }
}
