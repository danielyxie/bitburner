interface Position {
  row: number;
  column: number;
}

class PositionTracker {
  positions: Map<string, Position>;

  constructor() {
    this.positions = new Map<string, Position>();
  }

  saveCursor(filename: string, pos: Position): void {
    this.positions.set(filename, pos);
  }

  getCursor(filename: string): Position {
    const position = this.positions.get(filename);
    if (!position) {
      return {
        row: -1,
        column: -1,
      };
    }
    return position;
  }
}

export const CursorPositions: PositionTracker = new PositionTracker();
