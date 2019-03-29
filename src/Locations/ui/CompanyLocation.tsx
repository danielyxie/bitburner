/**
 * React Component for displaying a location's UI, when that location is a company
 */
import * as React from "react";

import { LocationName }     from "../data/LocationNames";

import { Companies }        from "../../Company/Companies";
import { Company }          from "../../Company/Company";
import { IPlayer }          from "../../PersonObjects/IPlayer";

import { StdButton }        from "../../ui/React/StdButton";

type IProps = {
    locName: LocationName;
    p: IPlayer;
}

export class CompanyLocation extends React.Component<IProps, any> {
    /**
     * We'll keep a reference to the Company that this component is being rendered for,
     * so we don't have to look it up every time
     */
    company: Company;

    constructor(props: IProps) {
        super(props);

        this.applyForAgentJob = this.applyForAgentJob.bind(this);
        this.applyForBusinessConsultantJob = this.applyForBusinessConsultantJob.bind(this);
        this.applyForBusinessJob = this.applyForBusinessJob.bind(this);
        this.applyForEmployeeJob = this.applyForEmployeeJob.bind(this);
        this.applyForItJob = this.applyForItJob.bind(this);
        this.applyForPartTimeEmployeeJob = this.applyForPartTimeEmployeeJob.bind(this);
        this.applyForPartTimeWaiterJob = this.applyForPartTimeWaiterJob.bind(this);
        this.applyForSecurityJob = this.applyForSecurityJob.bind(this);
        this.applyForSoftwareConsultantJob = this.applyForSoftwareConsultantJob.bind(this);
        this.applyForSoftwareJob = this.applyForSoftwareJob.bind(this);
        this.applyForWaiterJob = this.applyForWaiterJob.bind(this);

        this.company = Companies[props.locName];
        if (this.company == null) {
            throw new Error(`CompanyLocation component constructed with invalid company: ${props.locName}`);
        }
    }

    applyForAgentJob(e: React.MouseEvent<HTMLElement>) {
        if (!e.isTrusted) { return false; }
        this.props.p.applyForAgentJob();
    }

    applyForBusinessConsultantJob(e: React.MouseEvent<HTMLElement>) {
        if (!e.isTrusted) { return false; }
        this.props.p.applyForBusinessConsultantJob();
    }

    applyForBusinessJob(e: React.MouseEvent<HTMLElement>) {
        if (!e.isTrusted) { return false; }
        this.props.p.applyForBusinessJob();
    }

    applyForEmployeeJob(e: React.MouseEvent<HTMLElement>) {
        if (!e.isTrusted) { return false; }
        this.props.p.applyForEmployeeJob();
    }

    applyForItJob(e: React.MouseEvent<HTMLElement>) {
        if (!e.isTrusted) { return false; }
        this.props.p.applyForItJob();
    }

    applyForPartTimeEmployeeJob(e: React.MouseEvent<HTMLElement>) {
        if (!e.isTrusted) { return false; }
        this.props.p.applyForPartTimeEmployeeJob();
    }

    applyForPartTimeWaiterJob(e: React.MouseEvent<HTMLElement>) {
        if (!e.isTrusted) { return false; }
        this.props.p.applyForPartTimeWaiterJob();
    }

    applyForSecurityJob(e: React.MouseEvent<HTMLElement>) {
        if (!e.isTrusted) { return false; }
        this.props.p.applyForSecurityJob();
    }

    applyForSoftwareConsultantJob(e: React.MouseEvent<HTMLElement>) {
        if (!e.isTrusted) { return false; }
        this.props.p.applyForSoftwareConsultantJob();
    }

    applyForSoftwareJob(e: React.MouseEvent<HTMLElement>) {
        if (!e.isTrusted) { return false; }
        this.props.p.applyForSoftwareJob();
    }

    applyForWaiterJob(e: React.MouseEvent<HTMLElement>) {
        if (!e.isTrusted) { return false; }
        this.props.p.applyForWaiterJob();
    }

    render() {
        return (
            <div>
                {
                    this.company.hasAgentPositions() &&
                    <StdButton onClick={this.applyForAgentJob} text={""}
                }
            </div>
        )
    }
}
