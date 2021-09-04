/**
 * React Component for displaying a list of the player's Source-Files
 * on the Augmentations UI
 */
import * as React from "react";

import { Player } from "../../Player";
import { Settings } from "../../Settings/Settings";
import { OwnedAugmentationsOrderSetting } from "../../Settings/SettingEnums";
import { SourceFiles } from "../../SourceFile/SourceFiles";

import { SourceFileAccordion } from "../../ui/React/SourceFileAccordion";

export function OwnedSourceFiles(): React.ReactElement {
  const sourceSfs = Player.sourceFiles.slice();

  if (
    Settings.OwnedAugmentationsOrder ===
    OwnedAugmentationsOrderSetting.Alphabetically
  ) {
    sourceSfs.sort((sf1, sf2) => {
      return sf1.n - sf2.n;
    });
  }

  const sfs = sourceSfs.map((e) => {
    const srcFileKey = "SourceFile" + e.n;
    const sfObj = SourceFiles[srcFileKey];
    if (sfObj == null) {
      console.error(`Invalid source file number: ${e.n}`);
      return null;
    }

    return (
      <li key={e.n}>
        <SourceFileAccordion level={e.lvl} sf={sfObj} />
      </li>
    );
  });

  return <>{sfs}</>;
}
