import type { CellStatus, CoordsDTO } from '@sea-battle/shared';

import { CellShotResult, ICell } from './types';

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

	public receiveShot(): CellShotResult {
		if (this.status === 'HIT' || this.status === 'MISS') {
			throw new Error('Cell has already been shot at');
		}

		if (this.status === 'SHIP') {
			this.status = 'HIT';
			if (!this.assignedShipId) {
				throw new Error('Cell with SHIP status has no assigned ship ID');
			}
			return { result: 'HIT', shipId: this.assignedShipId };
		}
		if (this.status === 'EMPTY') {
			this.status = 'MISS';
			return { result: 'MISS' };
		}

		throw new Error('Invalid cell status');
	}
}
