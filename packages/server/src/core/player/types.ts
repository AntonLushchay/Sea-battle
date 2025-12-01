import { CoordsDTO, FleetRuleDTO, ShipPlacementDTO, ShotResult } from '@sea-battle/shared';

import type { IBoard } from '../board/types';
import type { IFleet } from '../fleet/types';

export interface IPlayer {
	playerId: string;
	isReady: boolean;
	isConnected: boolean;
	getBoard(): IBoard;
	getFleet(): IFleet;
	rebuildBoard(size: number): void;
	rebuildFleet(fleetConfig: FleetRuleDTO[]): void;
	placeFleet(fleetPlacement: ShipPlacementDTO[]): void;
	toggleReadyState(): void;
	receiveShot(coords: CoordsDTO): ShotResult;
	isFleetSunk(): boolean;
	resetForNewGame(): void;
}
