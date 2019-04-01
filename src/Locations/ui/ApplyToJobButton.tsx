/**
 * React Component for a button that's used to apply for a job
 */
import * as React from "react";

import { Company }                  from "../../Company/Company";
import { CompanyPosition }          from "../../Company/CompanyPosition";
import { getJobRequirementText }    from "../../Company/GetJobRequirementText";
import { IPlayer }                  from "../../PersonObjects/IPlayer";

import { StdButton }                from "../../ui/React/StdButton";

type IProps = {
    company: Company;
    entryPosType: CompanyPosition;
    onClick: (e: React.MouseEvent<HTMLElement>) => void;
    p: IPlayer;
    text: string;
}

export class ApplyToJobButton extends React.Component<IProps, any> {
    constructor(props: IProps) {
        super(props);

        this.getJobRequirementTooltip = this.getJobRequirementTooltip.bind(this);
    }

    getJobRequirementTooltip(): string {
        const pos = this.props.p.getNextCompanyPosition(this.props.company, this.props.entryPosType);
        if (pos == null) { return "" };

        if (!this.props.company.hasPosition(pos)) { return ""; }

        return getJobRequirementText(this.props.company, pos, true);
    }

    render() {
        return (
            <StdButton
                onClick={this.props.onClick}
                text={this.props.text}
                tooltip={this.getJobRequirementTooltip()}
            />
        )
    }
}
