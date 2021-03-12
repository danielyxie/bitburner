/**
 * React Component for displaying all of the player's installed Augmentations and
 * Source-Files.
 *
 * It also contains 'configuration' buttons that allow you to change how the
 * Augs/SF's are displayed
 */
import * as React from "react";

import { InstalledAugmentations } from "./InstalledAugmentations";
import { ListConfiguration } from "./ListConfiguration";
import { OwnedSourceFiles } from "./OwnedSourceFiles";
import { SourceFileMinus1 } from "./SourceFileMinus1";

import { Settings } from "../../Settings/Settings";
import { OwnedAugmentationsOrderSetting } from "../../Settings/SettingEnums";

type IProps = {}

type IState = {
    rerenderFlag: boolean;
}

export class InstalledAugmentationsAndSourceFiles extends React.Component<IProps, IState> {
    listRef: React.RefObject<HTMLUListElement>;

    constructor(props: IProps) {
        super(props);

        this.state = {
            rerenderFlag: false,
        }

        this.collapseAllHeaders = this.collapseAllHeaders.bind(this);
        this.expandAllHeaders = this.expandAllHeaders.bind(this);
        this.sortByAcquirementTime = this.sortByAcquirementTime.bind(this);
        this.sortInOrder = this.sortInOrder.bind(this);

        this.listRef = React.createRef();
    }

    collapseAllHeaders() {
        const ul = this.listRef.current;
        if (ul == null) { return; }
        const tickers = ul.getElementsByClassName("accordion-header");
        for (let i = 0; i < tickers.length; ++i) {
            const ticker = tickers[i];
            if (!(ticker instanceof HTMLButtonElement)) {
                continue;
            }

            if (ticker.classList.contains("active")) {
                ticker.click();
            }
        }
    }

    expandAllHeaders() {
        const ul = this.listRef.current;
        if (ul == null) { return; }
        const tickers = ul.getElementsByClassName("accordion-header");
        for (let i = 0; i < tickers.length; ++i) {
            const ticker = tickers[i];
            if (!(ticker instanceof HTMLButtonElement)) {
                continue;
            }

            if (!ticker.classList.contains("active")) {
                ticker.click();
            }
        }
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
            <>
            <ListConfiguration
                collapseAllButtonsFn={this.collapseAllHeaders}
                expandAllButtonsFn={this.expandAllHeaders}
                sortByAcquirementTimeFn={this.sortByAcquirementTime}
                sortInOrderFn={this.sortInOrder}
            />
            <ul className="augmentations-list" ref={this.listRef}>
                <SourceFileMinus1 />
                <OwnedSourceFiles />
                <InstalledAugmentations />
            </ul>
            </>
        )
    }
}
