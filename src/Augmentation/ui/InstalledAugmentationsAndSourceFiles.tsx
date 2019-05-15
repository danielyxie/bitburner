/**
 * React Component for displaying all of the player's installed Augmentations and
 * Source-Files.
 *
 * It also contains 'configuration' buttons that allow you to change how the
 * Augs/SF's are displayed
 */
import * as React from "react";

import { Settings } from "../../Settings/Settings";
import { OwnedAugmentationsOrderSetting } from "../../Settings/SettingEnums";

type IProps = {

}

type IState = {
    rerenderFlag: boolean;
}

export class InstalledAugmentationsAndSourceFiles extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            rerenderFlag: false,
        }

        this.sortByAcquirementTime = this.sortByAcquirementTime.bind(this);
        this.sortInOrder = this.sortInOrder.bind(this);
    }

    rerender() {
        this.setState((prevState) => {
            return {
                rerenderFlag: !prevState.rerenderFlag,
            }
        });
    }

    sortByAcquirementTime() {
        Settings.OwnedAugmentationsOrder = OwnedAugmentationsOrderSetting.AcquirementTime;
        this.rerender();
    }

    sortInOrder() {
        Settings.OwnedAugmentationsOrder = OwnedAugmentationsOrderSetting.Alphabetically
        this.rerender();
    }

    render() {
        return (

        )
    }
}
