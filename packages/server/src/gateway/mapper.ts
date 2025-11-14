import type { GameStateDTO, PlayerInfoDTO, BoardDTO, CellDTO, ShipDTO } from '@sea-battle/shared';

import { IGame } from '../core/game/types';

const mapToPlayerInfoToDTO = (game: IGame): [PlayerInfoDTO, ...PlayerInfoDTO[]] => {
	const player = game.getPlayers().map((player) => {
		return {
			playerID: player.playerId,
			isReady: player.isReady,
		};
	});

	return player as [PlayerInfoDTO, ...PlayerInfoDTO[]];
};

const mapToCellDTO = (
	game: IGame,
	playerId: string,
	isEnemyBoard: boolean = false
): CellDTO[][] => {
	const grid = game.getPlayer(playerId)!.getBoard().getGrid();

	return grid.map((row) => {
		return row.map((cell) => {
			const cellStatus = isEnemyBoard && cell.status === `SHIP` ? `EMPTY` : cell.status;

			return {
				coords: cell.coords,
				status: cellStatus,
			};
		});
	});
};

const mapToBoardDTO = (game: IGame, playerId: string): BoardDTO => {
	return {
		size: game.getPlayer(playerId)!.getBoard().size,
		cells: mapToCellDTO(game, playerId),
	};
};

const mapToEnemyBoardDTO = (game: IGame, playerId: string): BoardDTO | null => {
	const enemyPlayer = game.getEnemyPlayer(playerId);

	if (!enemyPlayer) {
		return null;
	}

	return {
		size: game.getPlayer(enemyPlayer.playerId)!.getBoard().size,
		cells: mapToCellDTO(game, enemyPlayer.playerId, true),
	};
};

const mapToFleetDTO = (game: IGame, playerId: string): ShipDTO[] => {
	const fleet = game.getPlayer(playerId)!.getFleet().getFleet();

	return fleet.map((ship) => {
		return {
			baseInfo: {
				id: ship.id,
				type: ship.type,
				size: ship.size,
			},
			hitsCount: ship.hits,
			isSunk: ship.isSunk(),
			isPlaced: ship.isPlaced(),
		};
	});
};

export const mapToGameStateDTO = (game: IGame, playerId: string): GameStateDTO => {
	return {
		gameId: game.gameId,
		myPlayerId: playerId,
		players: mapToPlayerInfoToDTO(game),
		myBoard: mapToBoardDTO(game, playerId),
		enemyBoard: mapToEnemyBoardDTO(game, playerId),
		myFleet: mapToFleetDTO(game, playerId),
		currentPlayerId: game.currentPlayerId,
		gameStatus: game.status,
	};
};
