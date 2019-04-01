/**
 * React Subcomponent for displaying a location's UI, when that location is a company
 *
 * This subcomponent renders all of the buttons for applying to jobs at a company
 */
import * as React from "react";

import { ApplyToJobButton }         from "./ApplyToJobButton";

import { Location }                 from "../Location";
import { Locations }                from "../Locations";
import { LocationName }             from "../data/LocationNames";

import { IEngine }                  from "../../IEngine";
import { beginInfiltration }        from "../../Infiltration";

import { Companies }                from "../../Company/Companies";
import { Company }                  from "../../Company/Company";
import { CompanyPositions }         from "../../Company/CompanyPositions";
import * as posNames                from "../../Company/data/companypositionnames";
import { IPlayer }                  from "../../PersonObjects/IPlayer";

import { StdButton }                from "../../ui/React/StdButton";

type IProps = {
    engine: IEngine;
    locName: LocationName;
    p: IPlayer;
}

export class CompanyLocation extends React.Component<IProps, any> {
    /**
     * We'll keep a reference to the Company that this component is being rendered for,
     * so we don't have to look it up every time
     */
    company: Company;

    /**
     * Reference to the Location that this component is being rendered for
     */
    location: Location;

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
        this.startInfiltration = this.startInfiltration.bind(this);

        this.location = Locations[props.locName];
        if (this.location == null) {
            throw new Error(`CompanyLocation component constructed with invalid location: ${props.locName}`);
        }

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

    startInfiltration(e: React.MouseEvent<HTMLElement>) {
        if (!e.isTrusted) { return false; }
        const loc = this.location;

        this.props.engine.loadInfiltrationContent();

        const data = loc.infiltrationData;
        if (data == null) { return false; }
        beginInfiltration(this.props.locName, data.startingSecurityLevel, data.baseRewardValue, data.maxClearanceLevel, data.difficulty);
    }

    render() {
        return (
            <div>
                {
                    this.company.hasAgentPositions() &&
                    <ApplyToJobButton
                        company={this.company}
                        entryPosType={CompanyPositions[posNames.AgentCompanyPositions[0]]}
                        onClick={this.applyForAgentJob}
                        p={this.props.p}
                        text={"Apply for Agent Job"}
                    />
                }
                {
                    this.company.hasBusinessConsultantPositions() &&
                    <ApplyToJobButton
                        company={this.company}
                        entryPosType={CompanyPositions[posNames.BusinessConsultantCompanyPositions[0]]}
                        onClick={this.applyForBusinessConsultantJob}
                        p={this.props.p}
                        text={"Apply for Business Consultant Job"}
                    />
                }
                {
                    this.company.hasBusinessPositions() &&
                    <ApplyToJobButton
                        company={this.company}
                        entryPosType={CompanyPositions[posNames.BusinessCompanyPositions[0]]}
                        onClick={this.applyForBusinessJob}
                        p={this.props.p}
                        text={"Apply for Business Job"}
                    />
                }
                {
                    this.company.hasEmployeePositions() &&
                    <ApplyToJobButton
                        company={this.company}
                        entryPosType={CompanyPositions[posNames.MiscCompanyPositions[1]]}
                        onClick={this.applyForEmployeeJob}
                        p={this.props.p}
                        text={"Apply to be an Employee"}
                    />
                }
                {
                    this.company.hasEmployeePositions() &&
                    <ApplyToJobButton
                        company={this.company}
                        entryPosType={CompanyPositions[posNames.PartTimeCompanyPositions[1]]}
                        onClick={this.applyForPartTimeEmployeeJob}
                        p={this.props.p}
                        text={"Apply to be a part-time Employee"}
                    />
                }
                {
                    this.company.hasITPositions() &&
                    <ApplyToJobButton
                        company={this.company}
                        entryPosType={CompanyPositions[posNames.ITCompanyPositions[0]]}
                        onClick={this.applyForItJob}
                        p={this.props.p}
                        text={"Apply for IT Job"}
                    />
                }
                {
                    this.company.hasSecurityPositions() &&
                    <ApplyToJobButton
                        company={this.company}
                        entryPosType={CompanyPositions[posNames.SecurityCompanyPositions[2]]}
                        onClick={this.applyForSecurityJob}
                        p={this.props.p}
                        text={"Apply for Security Job"}
                    />
                }
                {
                    this.company.hasSoftwareConsultantPositions() &&
                    <ApplyToJobButton
                        company={this.company}
                        entryPosType={CompanyPositions[posNames.SoftwareConsultantCompanyPositions[0]]}
                        onClick={this.applyForSoftwareConsultantJob}
                        p={this.props.p}
                        text={"Apply for Software Consultant Job"}
                    />
                }
                {
                    this.company.hasSoftwarePositions() &&
                    <ApplyToJobButton
                        company={this.company}
                        entryPosType={CompanyPositions[posNames.SoftwareCompanyPositions[0]]}
                        onClick={this.applyForSoftwareJob}
                        p={this.props.p}
                        text={"Apply for Software Job"}
                    />
                }
                {
                    this.company.hasWaiterPositions() &&
                    <ApplyToJobButton
                        company={this.company}
                        entryPosType={CompanyPositions[posNames.MiscCompanyPositions[0]]}
                        onClick={this.applyForWaiterJob}
                        p={this.props.p}
                        text={"Apply to be a Waiter"}
                    />
                }
                {
                    this.company.hasWaiterPositions() &&
                    <ApplyToJobButton
                        company={this.company}
                        entryPosType={CompanyPositions[posNames.PartTimeCompanyPositions[0]]}
                        onClick={this.applyForPartTimeWaiterJob}
                        p={this.props.p}
                        text={"Apply to be a part-time Waiter"}
                    />
                }
                {
                    (this.location.infiltrationData != null) &&
                    <StdButton
                        onClick={this.startInfiltration}
                        text={"Infiltration Company"}
                    />
                }
            </div>
        )
    }
}
