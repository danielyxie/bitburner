import { onExport } from './ExportBonus';
import { saveObject } from './SaveObject';
import { IPlayer } from './PersonObjects/IPlayer';

export function exportGame(p: IPlayer): void {
  // Apply the export bonus before saving the game
  onExport(p);
  saveObject.exportGame();
}
