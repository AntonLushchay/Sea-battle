import { CoordsDTO, FleetRuleDTO, ShipPlacementDTO, ShotResult } from '@sea-battle/shared';

import { Board } from '../board/board';
import type { IBoard } from '../board/types';
import { Fleet } from '../fleet/fleet';
import type { IFleet } from '../fleet/types';

import type { IPlayer } from './types';

export class Player implements IPlayer {
	private readonly _playerId: string;
	private _isReady: boolean = false;
	private board: IBoard;
	private fleet: IFleet;
	private currentBoardSize: number | null = null;
	private currentFleetConfig: FleetRuleDTO[] | null = null;
	private _isConnected: boolean = true;

	constructor(playerId: string) {
		this._playerId = playerId;
		this.board = new Board();
		this.fleet = new Fleet();
	}

	public get playerId(): string {
		return this._playerId;
	}

	public set isReady(value: boolean) {
		this._isReady = value;
	}

	public get isReady(): boolean {
		return this._isReady;
	}

	public set isConnected(value: boolean) {
		this._isConnected = value;
	}

	public get isConnected(): boolean {
		return this._isConnected;
	}

	public getBoard(): IBoard {
		return this.board;
	}

	public getFleet(): IFleet {
		return this.fleet;
	}

	public rebuildBoard(size?: number): void {
		this.board = new Board(size);
		this.currentBoardSize = size ?? null;
		console.log(`Player ${this.playerId} board rebuilt to size ${size}`);
	}

	public rebuildFleet(fleetConfig?: FleetRuleDTO[]): void {
		this.fleet = new Fleet(fleetConfig);
		this.currentFleetConfig = fleetConfig ?? null;
		console.log(`Player ${this.playerId} fleet rebuilt with new configuration`);
	}

	public placeFleet(fleetPlacement: ShipPlacementDTO[]): void {
		const copiedFleetSet = new Set(this.fleet.getFleet());

		fleetPlacement.forEach((placement) => {
			const ship = this.getFleet().getShipById(placement.shipId);
			if (!ship) {
				this.errorOnPlacingFleet(`Ship with ID ${placement.shipId} not found in fleet.`);
			} else if (ship.isPlaced()) {
				this.errorOnPlacingFleet(
					`Ship with ID ${placement.shipId} has already been placed.`
				);
			}

			const shipCoords: CoordsDTO[] = this.calculateShipCoords(placement, ship.size);

			if (!this.board.validateCoords(shipCoords)) {
				this.errorOnPlacingFleet(
					`Invalid ship placement coordinates for ship ID ${placement.shipId}. Cell out of board or already occupied or too close to another ship.`
				);
			}
			this.fleet.assignCellsToShip(ship, shipCoords);
			this.board.assignShipToCells(ship, shipCoords);

			copiedFleetSet.delete(ship);
		});

		if (copiedFleetSet.size > 0) {
			const unplacedShips = Array.from(copiedFleetSet, (ship) => ship.id);
			this.errorOnPlacingFleet(
				`Not all ships placed. Unplaced ships: ${unplacedShips.join(', ')}`
			);
		}

		console.log(`Player ${this.playerId} has successfully placed their fleet.`);
	}

	public toggleReadyState(): void {
		if (this.isReady) {
			this.isReady = false;
			return;
		}
		if (!this.fleet.areAllShipsPlaced()) {
			throw new Error(`Player ${this.playerId} cannot be ready: not all ships are placed.`);
		}
		this.isReady = true;
	}

	public receiveShot(coords: CoordsDTO): ShotResult {
		const shotResult = this.getBoard().processShot(coords);

		if (shotResult.result === 'HIT' && shotResult.shipId) {
			const fleet = this.getFleet();
			fleet.processShot(shotResult.shipId);
			if (fleet.isShipSunk(shotResult.shipId)) {
				return 'SUNK';
			}
			return 'HIT';
		}
		return 'MISS';
	}

	public isFleetSunk(): boolean {
		return this.getFleet().areAllShipsSunk();
	}

	public resetForNewGame(): void {
		this.isReady = false;
		this.rebuildBoard(...(this.currentBoardSize ? [this.currentBoardSize] : []));
		this.rebuildFleet(...(this.currentFleetConfig ? [this.currentFleetConfig] : []));
	}

	private errorOnPlacingFleet(errorMessage: string): never {
		this.rebuildBoard(...(this.currentBoardSize ? [this.currentBoardSize] : []));
		this.rebuildFleet(...(this.currentFleetConfig ? [this.currentFleetConfig] : []));
		throw new Error(`Error placing fleet for player ${this.playerId}: ${errorMessage}`);
	}

	private calculateShipCoords(placement: ShipPlacementDTO, size: number): CoordsDTO[] {
		const shipCoords: CoordsDTO[] = [];
		for (let i = 0; i < size; i++) {
			if (placement.orientation === 'horizontal') {
				shipCoords.push({ x: placement.startCoords.x + i, y: placement.startCoords.y });
			} else {
				shipCoords.push({ x: placement.startCoords.x, y: placement.startCoords.y + i });
			}
		}
		return shipCoords;
	}
}
