import { FleetRuleDTO } from '@sea-battle/shared';

import type { IBoard } from '../board/types';
import type { IFleet } from '../fleet/types';

export interface IPlayer {
	playerId: string;
	isReady: boolean;
	getBoard(): IBoard;
	getFleet(): IFleet;
	rebuildBoard(size: number): void;
	rebuildFleet(fleetConfig: FleetRuleDTO[]): void;
	// placeShip(payload: PlaceShipPayload): void;
	// unplaceShip(payload: UnplaceShipPayload): void;
	// receiveShot(coords: CoordsDTO): ShotResult;
}
