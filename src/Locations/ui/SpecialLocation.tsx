/**
 * React Subcomponent for displaying a location's UI, when that location has special
 * actions/options/properties
 *
 * Examples:
 *      - Bladeburner @ NSA
 *      - Re-sleeving @ VitaLife
 *      - Create Corporation @ City Hall
 *
 * This subcomponent creates all of the buttons for interacting with those special
 * properties
 */
import * as React from "react";

import { Location }                     from "../Location";
import { createStartCorporationPopup }  from "../LocationsHelpers";
import { LocationName }                 from "../data/LocationNames";

import { IEngine }                      from "../../IEngine";
import { IPlayer }                      from "../../PersonObjects/IPlayer";
import {
    joinFaction,
    displayFactionContent,
} from "../../Faction/FactionHelpers";
import { Factions }                     from "../../Faction/Factions";
import { AugmentationNames }            from "../../Augmentation/data/AugmentationNames";

import { AutoupdatingStdButton }        from "../../ui/React/AutoupdatingStdButton";
import { StdButton }                    from "../../ui/React/StdButton";

import { dialogBoxCreate }              from "../../../utils/DialogBox";

type IProps = {
    engine: IEngine;
    loc: Location;
    p: IPlayer;
}

type IState = {
    inBladeburner: boolean;
}

export class SpecialLocation extends React.Component<IProps, IState> {
    /**
     * Stores button styling that sets them all to block display
     */
    btnStyle: any;

    constructor(props: IProps) {
        super(props);

        this.btnStyle = { display: "block" };

        this.createCorporationPopup = this.createCorporationPopup.bind(this);
        this.handleBladeburner = this.handleBladeburner.bind(this);
        this.handleResleeving = this.handleResleeving.bind(this);
        this.renderCotMG = this.renderCotMG.bind(this);
        this.handleCotMG = this.handleCotMG.bind(this);
        

        this.state = {
            inBladeburner: this.props.p.inBladeburner(),
        }
    }

    /**
     * Click handler for "Create Corporation" button at Sector-12 City Hall
     */
    createCorporationPopup(): void {
        createStartCorporationPopup(this.props.p);
    }

    /**
     * Click handler for Bladeburner button at Sector-12 NSA
     */
    handleBladeburner(): void {
        const p = this.props.p;
        if (p.inBladeburner()) {
            // Enter Bladeburner division
            this.props.engine.loadBladeburnerContent();
        } else {
            // Apply for Bladeburner division
            if (p.strength >= 100 && p.defense >= 100 && p.dexterity >= 100 && p.agility >= 100) {
                p.startBladeburner({ new: true });
                dialogBoxCreate("You have been accepted into the Bladeburner division!");
                this.setState({
                    inBladeburner: true,
                });

                const worldHeader = document.getElementById("world-menu-header");
                if (worldHeader instanceof HTMLElement) {
                    worldHeader.click(); worldHeader.click();
                }
            } else {
                dialogBoxCreate("Rejected! Please apply again when you have 100 of each combat stat (str, def, dex, agi)");
            }
        }
    }

    handleCotMG(): void {
        const p = this.props.p;

        if (!p.factions.includes("Church of the Machine God")) {
            joinFaction(Factions["Church of the Machine God"]);
        }
        if (!p.augmentations.some(a => a.name === AugmentationNames.StaneksGift1) &&
            !p.queuedAugmentations.some(a => a.name === AugmentationNames.StaneksGift1)) {
            p.queueAugmentation(AugmentationNames.StaneksGift1);
        }

        this.props.engine.loadFactionContent();
        displayFactionContent("Church of the Machine God");
    }

    /**
     * Click handler for Resleeving button at New Tokyo VitaLife
     */
    handleResleeving(): void {
        this.props.engine.loadResleevingContent();
    }

    renderBladeburner(): React.ReactNode {
        if (!this.props.p.canAccessBladeburner()) { return null; }
        const text = this.state.inBladeburner ? "Enter Bladeburner Headquarters" : "Apply to Bladeburner Division";
        return (
            <StdButton
                onClick={this.handleBladeburner}
                style={this.btnStyle}
                text={text}
            />
        )
    }

    renderCreateCorporation(): React.ReactNode {
        if (!this.props.p.canAccessCorporation()) {
            return <>
                <p><i>A business man is yelling at a clerk. You should come back later.</i></p>
            </>;
        }
        return (
            <AutoupdatingStdButton
                disabled={!this.props.p.canAccessCorporation() || this.props.p.hasCorporation()}
                onClick={this.createCorporationPopup}
                style={this.btnStyle}
                text={"Create a Corporation"}
            />
        )
    }

    renderResleeving(): React.ReactNode {
        if (!this.props.p.canAccessResleeving()) { return null; }
        return (
            <StdButton
                onClick={this.handleResleeving}
                style={this.btnStyle}
                text={"Re-Sleeve"}
            />
        )
    }

    renderCotMG(): React.ReactNode {
        const symbol = <pre>
        {"                 ``          "}<br />
        {"             -odmmNmds:      "}<br />
        {"           `hNmo:..-omNh.    "}<br />
        {"           yMd`      `hNh    "}<br />
        {"           mMd        oNm    "}<br />
        {"           oMNo      .mM/    "}<br />
        {"           `dMN+    -mM+     "}<br />
        {"            -mMNo  -mN+      "}<br />
        {"  .+-        :mMNo/mN/       "}<br />
        {":yNMd.        :NMNNN/        "}<br />
        {"-mMMMh.        /NMMh`        "}<br />
        {" .dMMMd.       /NMMMy`       "}<br />
        {"  `yMMMd.     /NNyNMMh`      "}<br />
        {"   `sMMMd.   +Nm: +NMMh.     "}<br />
        {"     oMMMm- oNm:   /NMMd.    "}<br />
        {"      +NMMmsMm-     :mMMd.   "}<br />
        {"       /NMMMm-       -mMMd.  "}<br />
        {"        /MMMm-        -mMMd. "}<br />
        {"       `sMNMMm-        .mMmo "}<br />
        {"      `sMd:hMMm.        ./.  "}<br />
        {"     `yMy` `yNMd`            "}<br />
        {"    `hMs`    oMMy            "}<br />
        {"   `hMh       sMN-           "}<br />
        {"   /MM-       .NMo           "}<br />
        {"   +MM:       :MM+           "}<br />
        {"    sNNo-.`.-omNy`           "}<br />
        {"     -smNNNNmdo-             "}<br />
        {"        `..`                 "}</pre>
        if(this.props.p.factions.includes("Church of the Machine God")) {
            return (<div style={{width: '60%'}}>
                <p>
                    <i className="text">
                        Allison "Mother" Stanek: Welcome back my child!
                    </i>
                </p>
                {symbol}
            </div>);
        }

        if (!this.props.p.canAccessCotMG()) { 
            return (<>
                <p>
                    <i className="text">
                        A decrepit altar stands in the middle of a dilapidated church.
                        <br />
                        <br />
                        A symbol is carved in the altar.
                    </i>
                </p>
                <br />
                {symbol}
            </>);
        }

        if(this.props.p.augmentations.filter(a => a.name !== AugmentationNames.NeuroFluxGovernor).length > 0 ||
            this.props.p.queuedAugmentations.filter(a => a.name !== AugmentationNames.NeuroFluxGovernor).length > 0) {
            return (<div style={{width: '60%'}}>
                <p>
                    <i className="text">
                        Allison "Mother" Stanek: Begone you filth! My gift must be
                        the first modification that your body should have!
                    </i>
                </p>
            </div>);
        }

        return (<div style={{width: '60%'}}>
            <p>
                <i className="text">
                    Allison "Mother" Stanek: Welcome child, I see your body is pure.
                    Are you ready to ascend beyond our human form?
                    If you are, accept my gift.
                </i>
            </p>
            <StdButton
                onClick={this.handleCotMG}
                style={this.btnStyle}
                text={"Accept Stanek\'s Gift"}
            />
            {symbol}
        </div>);
    }

    render(): React.ReactNode {
        switch (this.props.loc.name) {
            case LocationName.NewTokyoVitaLife: {
                return this.renderResleeving();
            }
            case LocationName.Sector12CityHall: {
                return this.renderCreateCorporation();
            }
            case LocationName.Sector12NSA: {
                return this.renderBladeburner();
            }
            case LocationName.ChongqingChurchOfTheMachineGod: {
                return this.renderCotMG();
            }
            default:
                console.error(`Location ${this.props.loc.name} doesn't have any special properties`);
                break;
        }
    }
}
