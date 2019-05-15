/**
 * Root React component for the Augmentations UI page that display all of your
 * owned and purchased Augmentations and Source-Files.
 */
import * as React from "react";

import { Augmentations } from "../../Augmentation/Augmentations";
import { Player } from "../../Player";

import { StdButton } from "../../ui/React/StdButton";

type IProps = {
    exportGameFn: () => void;
    installAugmentationsFn: () => void;
}

type IState = {

}

export class AugmentationsRoot extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        return (
            <div>
                <h1>Purchased Augmentations</h1>
                <p>
                    Below is a list of all Augmentations you have purchased but not
                    yet installed. Click the button below to install them.
                </p>
                <p>
                    WARNING: Installing your Augmentations resets most of your progress,
                    including:
                </p>
                <p>- Stats/Skill levels and Experience</p>
                <p>- Money</p>
                <p>- Scripts on every computer but your home computer</p>
                <p>- Purchased servers</p>
                <p>- Hacknet Nodes</p>
                <p>- Faction/Company reputation</p>
                <p>- Stocks</p>
                <p>
                    Installing Augmentations lets you start over with the perks and
                    benefits granted by all of the Augmentations you have ever
                    installed. Also, you will keep any scripts and RAM/Core upgrades
                    on your home computer (but you will lose all programs besides
                    NUKE.exe)
                </p>

                <StdButton
                    onClick={this.props.installAugmentationsFn}
                    text="Install Augmentations"
                    tooltip="'I never asked for this'"
                />

                <StdButton
                    addClasses="flashing-button"
                    onClick={this.props.exportGameFn}
                    text="Backup Save (Export)"
                    tooltip="It's always a good idea to backup/export your save!"
                />

                <ul className="augmentations-list">

                </ul>
            </div>
        )
    }
}
