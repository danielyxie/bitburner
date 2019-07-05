/**
 * React Subcomponent for displaying a location's UI, when that location is a university
 *
 * This subcomponent renders all of the buttons for studying/taking courses
 */
import * as React from "react";

import { Location }         from "../Location";

import { CONSTANTS }        from "../../Constants";
import { IPlayer }          from "../../PersonObjects/IPlayer";

import { numeralWrapper }   from "../../ui/numeralFormat";
import { StdButton }        from "../../ui/React/StdButton";

type IProps = {
    loc: Location;
    p: IPlayer;
}

export class UniversityLocation extends React.Component<IProps, any> {
    /**
     * Stores button styling that sets them all to block display
     */
    btnStyle: object;

    constructor(props: IProps) {
        super(props);

        this.btnStyle = { display: "block" };

        this.take = this.take.bind(this);
        this.study = this.study.bind(this);
        this.dataStructures = this.dataStructures.bind(this);
        this.networks = this.networks.bind(this);
        this.algorithms = this.algorithms.bind(this);
        this.management = this.management.bind(this);
        this.leadership = this.leadership.bind(this);
    }

    take(stat: string) {
        const loc = this.props.loc;
        this.props.p.startClass(loc.costMult, loc.expMult, stat);
    }

    study() {
        return this.take(CONSTANTS.ClassStudyComputerScience);
    }

    dataStructures() {
        return this.take(CONSTANTS.ClassDataStructures);
    }

    networks() {
        return this.take(CONSTANTS.ClassNetworks);
    }

    algorithms() {
        return this.take(CONSTANTS.ClassAlgorithms);
    }

    management() {
        return this.take(CONSTANTS.ClassManagement);
    }

    leadership() {
        return this.take(CONSTANTS.ClassLeadership);
    }

    render() {
        const costMult: number = this.props.loc.costMult;

        const dataStructuresCost = CONSTANTS.ClassDataStructuresBaseCost * costMult;
        const networksCost = CONSTANTS.ClassNetworksBaseCost * costMult;
        const algorithmsCost = CONSTANTS.ClassAlgorithmsBaseCost * costMult;
        const managementCost = CONSTANTS.ClassManagementBaseCost * costMult;
        const leadershipCost = CONSTANTS.ClassLeadershipBaseCost * costMult;

        const earnHackingExpTooltip = `Gain hacking experience!`
        const earnCharismaExpTooltip = `Gain charisma experience!`;

        return (
            <div>
                <StdButton
                    onClick={this.study}
                    style={this.btnStyle}
                    text={`Study Computer Science (free)`}
                    tooltip={earnHackingExpTooltip}
                />
                <StdButton
                    onClick={this.dataStructures}
                    style={this.btnStyle}
                    text={`Take Data Structures course (${numeralWrapper.formatMoney(dataStructuresCost)} / sec)`}
                    tooltip={earnHackingExpTooltip}
                />
                <StdButton
                    onClick={this.networks}
                    style={this.btnStyle}
                    text={`Take Networks course (${numeralWrapper.formatMoney(networksCost)} / sec)`}
                    tooltip={earnHackingExpTooltip}
                />
                <StdButton
                    onClick={this.algorithms}
                    style={this.btnStyle}
                    text={`Take Algorithms course (${numeralWrapper.formatMoney(algorithmsCost)} / sec)`}
                    tooltip={earnHackingExpTooltip}
                />
                <StdButton
                    onClick={this.management}
                    style={this.btnStyle}
                    text={`Take Management course (${numeralWrapper.formatMoney(managementCost)} / sec)`}
                    tooltip={earnCharismaExpTooltip}
                />
                <StdButton
                    onClick={this.leadership}
                    style={this.btnStyle}
                    text={`Take Leadership course (${numeralWrapper.formatMoney(leadershipCost)} / sec)`}
                    tooltip={earnCharismaExpTooltip}
                />
            </div>
        )
    }
}
