export type Position = {
	row: number;
	column: number;
};

export class PositionTracker {
	positions: Map<string, Position>;

	constructor() {
		this.positions = new Map<string, Position>();
	}

	saveCursor(filename: string, pos: Position) {
		this.positions.set(filename, pos);
	}

	getCursor(filename: string): Position {
		const position = this.positions.get(filename);
		if (!position) {
			return {
				row: 0,
				column: 0,
			};
		}
		return position;
	}
}

export const CursorPositions: PositionTracker = new PositionTracker();