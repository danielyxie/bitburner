/**
 * Root React component for the Augmentations UI page that display all of your
 * owned and purchased Augmentations and Source-Files.
 */
import * as React from "react";

import { InstalledAugmentationsAndSourceFiles } from "./InstalledAugmentationsAndSourceFiles";
import { PlayerMultipliers } from "./PlayerMultipliers";
import { PurchasedAugmentations } from "./PurchasedAugmentations";

import { Player } from "../../Player";
import { StdButton } from "../../ui/React/StdButton";
import { canGetBonus } from "../../ExportBonus";

type IProps = {
  exportGameFn: () => void;
  installAugmentationsFn: () => void;
};

type IState = {
  rerender: boolean;
};

export class AugmentationsRoot extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      rerender: false,
    };
    this.export = this.export.bind(this);
  }

  export(): void {
    this.props.exportGameFn();
    this.setState({
      rerender: !this.state.rerender,
    });
  }

  render(): React.ReactNode {
    function exportBonusStr(): string {
      if (canGetBonus()) return "(+1 favor to all factions)";
      return "";
    }

    return (
      <>
        <div id="augmentations-content">
          <h1>Purchased Augmentations</h1>
          <p>
            Below is a list of all Augmentations you have purchased but not yet installed. Click the button below to
            install them.
          </p>
          <p>WARNING: Installing your Augmentations resets most of your progress, including:</p>
          <br />
          <p>- Stats/Skill levels and Experience</p>
          <p>- Money</p>
          <p>- Scripts on every computer but your home computer</p>
          <p>- Purchased servers</p>
          <p>- Hacknet Nodes</p>
          <p>- Faction/Company reputation</p>
          <p>- Stocks</p>
          <br />
          <p>
            Installing Augmentations lets you start over with the perks and benefits granted by all of the Augmentations
            you have ever installed. Also, you will keep any scripts and RAM/Core upgrades on your home computer (but
            you will lose all programs besides NUKE.exe)
          </p>
          <StdButton
            onClick={this.props.installAugmentationsFn}
            text="Install Augmentations"
            tooltip="'I never asked for this'"
          />
          <StdButton
            addClasses="flashing-button"
            onClick={this.export}
            text={`Backup Save ${exportBonusStr()}`}
            tooltip="It's always a good idea to backup/export your save!"
          />
          <PurchasedAugmentations />
          <h1>Installed Augmentations</h1>
          <p>
            {`List of all Augmentations ${Player.sourceFiles.length > 0 ? "and Source Files " : ""} ` +
              `that have been installed. You have gained the effects of these.`}
          </p>
          <InstalledAugmentationsAndSourceFiles />
          <br /> <br />
          <PlayerMultipliers />
        </div>
      </>
    );
  }
}
