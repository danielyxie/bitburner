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
    constructor(props: IProps) {
        super(props);

        this.take = this.take.bind(this);
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

        return (
            <div>
                <StdButton
                    onClick={this.study}
                    text={`Study Computer Science (free)`}
                />
                <StdButton
                    onClick={this.dataStructures}
                    text={`Take Data Structures course (${numeralWrapper.formatMoney(dataStructuresCost)} / sec)`}
                />
                <StdButton
                    onClick={this.networks}
                    text={`Take Networks course (${numeralWrapper.formatMoney(networksCost)} / sec)`}
                />
                <StdButton
                    onClick={this.algorithms}
                    text={`Take Algorithms course (${numeralWrapper.formatMoney(algorithmsCost)} / sec)`}
                />
                <StdButton
                    onClick={this.management}
                    text={`Take Management course (${numeralWrapper.formatMoney(managementCost)} / sec)`}
                />
                <StdButton
                    onClick={this.leadership}
                    text={`Take Leadership course (${numeralWrapper.formatMoney(leadershipCost)} / sec)`}
                />
            </div>
        )
    }
}
