import { CellStatus, CoordsDTO, ShotResult } from '@sea-battle/shared';

export interface CellShotResult {
	result: ShotResult;
	shipId?: string;
}

export interface ICell {
	readonly coords: CoordsDTO;
	status: CellStatus;
	assignedShipId: string | null;
	receiveShot(): CellShotResult;
}
