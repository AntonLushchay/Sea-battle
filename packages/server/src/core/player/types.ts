// import type {
// 	CoordsDTO,
// 	PlaceShipPayload,
// 	ShotResult,
// 	UnplaceShipPayload,
// } from '@sea-battle/shared';

import type { IBoard } from '../board/types';
import type { IFleet } from '../fleet/types';

export interface IPlayer {
	playerId: string;
	isReady: boolean;
	getBoard(): IBoard;
	getFleet(): IFleet;
	rebuildBoard(size: number): void;
	// placeShip(payload: PlaceShipPayload): void;
	// unplaceShip(payload: UnplaceShipPayload): void;
	// receiveShot(coords: CoordsDTO): ShotResult;
}
