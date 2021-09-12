/**
 * Implementation for what happens when you destroy a BitNode
 */
import { Engine } from "./engine";
import { Player } from "./Player";
import { prestigeSourceFile } from "./Prestige";
import { PlayerOwnedSourceFile } from "./SourceFile/PlayerOwnedSourceFile";
import { SourceFileFlags } from "./SourceFile/SourceFileFlags";
import { SourceFiles } from "./SourceFile/SourceFiles";

import { dialogBoxCreate } from "../utils/DialogBox";
import { BitverseRoot } from "./BitNode/ui/BitverseRoot";
import React from "react";
import ReactDOM from "react-dom";

let redPillFlag = false;
function hackWorldDaemon(currentNodeNumber, flume = false, quick = false) {
  // Clear the screen
  const container = document.getElementById("red-pill-content");
  ReactDOM.unmountComponentAtNode(container);
  Engine.loadRedPillContent();
  ReactDOM.render(
    <BitverseRoot destroyedBitNodeNum={currentNodeNumber} flume={flume} enter={enterBitNode} quick={quick} />,
    container,
  );
}

function giveSourceFile(bitNodeNumber) {
  var sourceFileKey = "SourceFile" + bitNodeNumber.toString();
  var sourceFile = SourceFiles[sourceFileKey];
  if (sourceFile == null) {
    console.error(`Could not find source file for Bit node: ${bitNodeNumber}`);
    return;
  }

  // Check if player already has this source file
  var alreadyOwned = false;
  var ownedSourceFile = null;
  for (var i = 0; i < Player.sourceFiles.length; ++i) {
    if (Player.sourceFiles[i].n === bitNodeNumber) {
      alreadyOwned = true;
      ownedSourceFile = Player.sourceFiles[i];
      break;
    }
  }

  if (alreadyOwned && ownedSourceFile) {
    if (ownedSourceFile.lvl >= 3 && ownedSourceFile.n !== 12) {
      dialogBoxCreate(
        "The Source-File for the BitNode you just destroyed, " + sourceFile.name + ", " + "is already at max level!",
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
    var playerSrcFile = new PlayerOwnedSourceFile(bitNodeNumber, 1);
    Player.sourceFiles.push(playerSrcFile);
    if (bitNodeNumber === 5 && Player.intelligence === 0) {
      // Artificial Intelligence
      Player.intelligence = 1;
    }
    dialogBoxCreate(
      "You received a Source-File for destroying a Bit Node!<br><br>" + sourceFile.name + "<br><br>" + sourceFile.info,
    );
  }
}

function enterBitNode(flume, destroyedBitNode, newBitNode) {
  if (!flume) {
    giveSourceFile(destroyedBitNode);
  } else {
    if (SourceFileFlags[5] === 0 && newBitNode !== 5) {
      Player.intelligence = 0;
      Player.intelligence_exp = 0;
    }
  }
  if (newBitNode === 5 && Player.intelligence === 0) {
    Player.intelligence = 1;
  }
  redPillFlag = false;
  const container = document.getElementById("red-pill-content");
  ReactDOM.unmountComponentAtNode(container);

  // Set new Bit Node
  Player.bitNodeN = newBitNode;

  // Reenable terminal
  $("#hack-progress-bar").attr("id", "old-hack-progress-bar");
  $("#hack-progress").attr("id", "old-hack-progress");
  document.getElementById("terminal-input-td").innerHTML =
    '$ <input type="text" id="terminal-input-text-box" class="terminal-input" tabindex="1"/>';
  $("input[class=terminal-input]").prop("disabled", false);

  prestigeSourceFile(flume);
}

export { redPillFlag, hackWorldDaemon };
