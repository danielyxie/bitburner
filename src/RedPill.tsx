/**
 * Implementation for what happens when you destroy a BitNode
 */
import React from "react";
import { EventLog, LogCategories, LogTypes } from "./EventLog/EventLog";
import { Player } from "./Player";
import { prestigeSourceFile } from "./Prestige";
import { PlayerOwnedSourceFile } from "./SourceFile/PlayerOwnedSourceFile";
import { SourceFileFlags } from "./SourceFile/SourceFileFlags";
import { SourceFiles } from "./SourceFile/SourceFiles";

import { dialogBoxCreate } from "./ui/React/DialogBox";
import { IRouter } from "./ui/Router";

function giveSourceFile(bitNodeNumber: number): void {
  const sourceFileKey = "SourceFile" + bitNodeNumber.toString();
  const sourceFile = SourceFiles[sourceFileKey];
  if (sourceFile == null) {
    console.error(`Could not find source file for Bit node: ${bitNodeNumber}`);
    return;
  }

  // Check if player already has this source file
  let alreadyOwned = false;
  let ownedSourceFile = null;
  for (let i = 0; i < Player.sourceFiles.length; ++i) {
    if (Player.sourceFiles[i].n === bitNodeNumber) {
      alreadyOwned = true;
      ownedSourceFile = Player.sourceFiles[i];
      break;
    }
  }

  if (alreadyOwned && ownedSourceFile) {
    if (ownedSourceFile.lvl >= 3 && ownedSourceFile.n !== 12) {
      const message = `The Source-File for the BitNode you just destroyed, ${sourceFile.name}, is already at max level!`;
      dialogBoxCreate(message);
      EventLog.addItem(message, {
        type: LogTypes.Warning,
        category: LogCategories.Prestige,
        linkIdentifier: sourceFileKey,
      });
    } else {
      ++ownedSourceFile.lvl;
      const message =
        sourceFile.name +
        " was upgraded to level " +
        ownedSourceFile.lvl +
        " for " +
        "destroying its corresponding BitNode!";
      dialogBoxCreate(message);
      EventLog.addItem(`${sourceFile.name} was upgraded to level ${ownedSourceFile.lvl}`, {
        type: LogTypes.Success,
        category: LogCategories.Prestige,
        linkIdentifier: sourceFileKey,
      });
    }
  } else {
    const playerSrcFile = new PlayerOwnedSourceFile(bitNodeNumber, 1);
    Player.sourceFiles.push(playerSrcFile);
    if (bitNodeNumber === 5 && Player.intelligence === 0) {
      // Artificial Intelligence
      Player.intelligence = 1;
    }
    const message = (
      <>
        You received a Source-File for destroying a BitNode!
        <br />
        <br />
        {sourceFile.name}
        <br />
        <br />
        {sourceFile.info}
      </>
    );
    dialogBoxCreate(message);
    EventLog.addItem(`You received ${sourceFile.name} for destroying a BitNode!`, {
      type: LogTypes.Success,
      category: LogCategories.Prestige,
      linkIdentifier: sourceFileKey,
    });
  }
}

export function enterBitNode(router: IRouter, flume: boolean, destroyedBitNode: number, newBitNode: number): void {
  if (!flume) {
    giveSourceFile(destroyedBitNode);
  } else if (SourceFileFlags[5] === 0 && newBitNode !== 5) {
    Player.intelligence = 0;
    Player.intelligence_exp = 0;
  }
  if (newBitNode === 5 && Player.intelligence === 0) {
    Player.intelligence = 1;
  }
  // Set new Bit Node
  Player.bitNodeN = newBitNode;

  if (newBitNode === 6) {
    router.toBladeburnerCinematic();
  } else {
    router.toTerminal();
  }
  prestigeSourceFile(flume);
}
