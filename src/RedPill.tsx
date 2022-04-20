/**
 * Implementation for what happens when you destroy a BitNode
 */
import React from "react";
import { Player } from "./Player";
import { prestigeSourceFile } from "./Prestige";
import { PlayerOwnedSourceFile } from "./SourceFile/PlayerOwnedSourceFile";
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
      dialogBoxCreate(
        `The Source-File for the BitNode you just destroyed, ${sourceFile.name}, is already at max level!`,
      );
    } else {
      ++ownedSourceFile.lvl;
      dialogBoxCreate(
        sourceFile.name +
          " was upgraded to level " +
          ownedSourceFile.lvl +
          " for " +
          "destroying its corresponding BitNode!",
      );
    }
  } else {
    const playerSrcFile = new PlayerOwnedSourceFile(bitNodeNumber, 1);
    Player.sourceFiles.push(playerSrcFile);
    if (bitNodeNumber === 5 && Player.intelligence === 0) {
      // Artificial Intelligence
      Player.intelligence = 1;
    }
    dialogBoxCreate(
      <>
        You received a Source-File for destroying a BitNode!
        <br />
        <br />
        {sourceFile.name}
        <br />
        <br />
        {sourceFile.info}
      </>,
    );
  }
}

export function enterBitNode(router: IRouter, flume: boolean, destroyedBitNode: number, newBitNode: number): void {
  if (!flume) {
    giveSourceFile(destroyedBitNode);
  } else if (Player.sourceFileLvl(5) === 0 && newBitNode !== 5) {
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
