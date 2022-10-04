/** Implementation for what happens when you destroy a BitNode */
import React from "react";
import { Player } from "./Player";
import { prestigeSourceFile } from "./Prestige";
import { PlayerOwnedSourceFile } from "./SourceFile/PlayerOwnedSourceFile";
import { SourceFiles } from "./SourceFile/SourceFiles";

import { dialogBoxCreate } from "./ui/React/DialogBox";
import { Router } from "./ui/GameRoot";

function giveSourceFile(bitNodeNumber: number): void {
  const sourceFileKey = "SourceFile" + bitNodeNumber.toString();
  const sourceFile = SourceFiles[sourceFileKey];
  if (sourceFile == null) {
    console.error(`Could not find source file for Bit node: ${bitNodeNumber}`);
    return;
  }

  // Check if player already has this source file
  const ownedSourceFile = Player.sourceFiles.find(sourceFile=>sourceFile.n === bitNodeNumber)

  if (ownedSourceFile) {
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
    const newSrcFile = new PlayerOwnedSourceFile(bitNodeNumber, 1);
    Player.sourceFiles.push(newSrcFile);
    if (bitNodeNumber === 5 && Player.skills.intelligence === 0) {
      Player.skills.intelligence = 1;
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

export function enterBitNode(flume: boolean, destroyedBitNode: number, newBitNode: number): void {
  if (!flume) {
    giveSourceFile(destroyedBitNode);
  } else if (Player.sourceFileLvl(5) === 0 && newBitNode !== 5) {
    Player.skills.intelligence = 0;
    Player.exp.intelligence = 0;
  }
  if (newBitNode === 5 && Player.skills.intelligence === 0) {
    Player.skills.intelligence = 1;
  }
  // Set new Bit Node
  Player.bitNodeN = newBitNode;

  if (newBitNode === 6) {
    Router.toBladeburnerCinematic();
  } else {
    Router.toTerminal();
  }
  prestigeSourceFile(flume);
}
