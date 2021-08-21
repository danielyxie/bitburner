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

import { Companies }                from "../../Company/Companies";
import { Company }                  from "../../Company/Company";
import { CompanyPosition }          from "../../Company/CompanyPosition";
import { CompanyPositions }         from "../../Company/CompanyPositions";
import * as posNames                from "../../Company/data/companypositionnames";
import { IPlayer }                  from "../../PersonObjects/IPlayer";

import { StdButton }                from "../../ui/React/StdButton";
import { Reputation }               from "../../ui/React/Reputation";
import { Favor }                    from "../../ui/React/Favor";

import {
    yesNoBoxGetYesButton,
    yesNoBoxGetNoButton,
    yesNoBoxClose,
    yesNoBoxCreate,
} from "../../../utils/YesNoBox";

type IProps = {
    engine: IEngine;
    locName: LocationName;
    p: IPlayer;
}

type IState = {
    employedHere: boolean;
}

const blockStyleMarkup = {
    display: "block",
}

export class CompanyLocation extends React.Component<IProps, IState> {
    /**
     * We'll keep a reference to the Company that this component is being rendered for,
     * so we don't have to look it up every time
     */
    company: Company;

    /**
     * CompanyPosition object for the job that the player holds at this company
     * (if he has one)
     */
    companyPosition: CompanyPosition | null = null;

    /**
     * Stores button styling that sets them all to block display
     */
    btnStyle: any;

    /**
     * Reference to the Location that this component is being rendered for
     */
    location: Location;

    /**
     * Name of company position that player holds, if applicable
     */
    jobTitle: string | null = null;

    constructor(props: IProps) {
        super(props);

        this.btnStyle = { display: "block" };

        this.quit = this.quit.bind(this);
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
        this.work = this.work.bind(this);

        this.location = Locations[props.locName];
        if (this.location == null) {
            throw new Error(`CompanyLocation component constructed with invalid location: ${props.locName}`);
        }

        this.company = Companies[props.locName];
        if (this.company == null) {
            throw new Error(`CompanyLocation component constructed with invalid company: ${props.locName}`);
        }

        this.state = {
            employedHere: false,
        }

        this.props.p.location = props.locName;

        this.checkIfEmployedHere(false);
    }

    applyForAgentJob(e: React.MouseEvent<HTMLElement>): void {
        if (!e.isTrusted) { return; }
        this.props.p.applyForAgentJob();
        this.checkIfEmployedHere(true);
    }

    applyForBusinessConsultantJob(e: React.MouseEvent<HTMLElement>): void {
        if (!e.isTrusted) { return; }
        this.props.p.applyForBusinessConsultantJob();
        this.checkIfEmployedHere(true);
    }

    applyForBusinessJob(e: React.MouseEvent<HTMLElement>): void {
        if (!e.isTrusted) { return; }
        this.props.p.applyForBusinessJob();
        this.checkIfEmployedHere(true);
    }

    applyForEmployeeJob(e: React.MouseEvent<HTMLElement>): void {
        if (!e.isTrusted) { return; }
        this.props.p.applyForEmployeeJob();
        this.checkIfEmployedHere(true);
    }

    applyForItJob(e: React.MouseEvent<HTMLElement>): void {
        if (!e.isTrusted) { return; }
        this.props.p.applyForItJob();
        this.checkIfEmployedHere(true);
    }

    applyForPartTimeEmployeeJob(e: React.MouseEvent<HTMLElement>): void {
        if (!e.isTrusted) { return; }
        this.props.p.applyForPartTimeEmployeeJob();
        this.checkIfEmployedHere(true);
    }

    applyForPartTimeWaiterJob(e: React.MouseEvent<HTMLElement>): void {
        if (!e.isTrusted) { return; }
        this.props.p.applyForPartTimeWaiterJob();
        this.checkIfEmployedHere(true);
    }

    applyForSecurityJob(e: React.MouseEvent<HTMLElement>): void {
        if (!e.isTrusted) { return; }
        this.props.p.applyForSecurityJob();
        this.checkIfEmployedHere(true);
    }

    applyForSoftwareConsultantJob(e: React.MouseEvent<HTMLElement>): void {
        if (!e.isTrusted) { return; }
        this.props.p.applyForSoftwareConsultantJob();
        this.checkIfEmployedHere(true);
    }

    applyForSoftwareJob(e: React.MouseEvent<HTMLElement>): void {
        if (!e.isTrusted) { return; }
        this.props.p.applyForSoftwareJob();
        this.checkIfEmployedHere(true);
    }

    applyForWaiterJob(e: React.MouseEvent<HTMLElement>): void {
        if (!e.isTrusted) { return; }
        this.props.p.applyForWaiterJob();
        this.checkIfEmployedHere(true);
    }

    checkIfEmployedHere(updateState=false): void {
        this.jobTitle = this.props.p.jobs[this.props.locName];
        if (this.jobTitle != null) {
            this.companyPosition = CompanyPositions[this.jobTitle];
        }

        if (updateState) {
            this.setState({
                employedHere: this.jobTitle != null,
            });
        }
    }

    startInfiltration(e: React.MouseEvent<HTMLElement>): void {
        if (!e.isTrusted) { return; }
        const loc = this.location;
        if (!loc.infiltrationData) {
            console.error(`trying to start infiltration at ${this.props.locName} but the infiltrationData is null`);
            return;
        }

        this.props.engine.loadInfiltrationContent(this.props.locName, loc.infiltrationData.startingSecurityLevel, loc.infiltrationData.maxClearanceLevel);

        const data = loc.infiltrationData;
        if (data == null) { return; }
    }

    work(e: React.MouseEvent<HTMLElement>): void {
        if (!e.isTrusted) { return; }

        const pos = this.companyPosition;
        if (pos instanceof CompanyPosition) {
            if (pos.isPartTimeJob() || pos.isSoftwareConsultantJob() || pos.isBusinessConsultantJob()) {
                this.props.p.startWorkPartTime(this.props.locName);
            } else {
                this.props.p.startWork(this.props.locName);
            }
        }
    }

    quit(e: React.MouseEvent<HTMLElement>): void {
        if (!e.isTrusted) { return; }

        const yesBtn = yesNoBoxGetYesButton();
        const noBtn = yesNoBoxGetNoButton();
        if (yesBtn == null || noBtn == null) { return; }
        yesBtn.innerHTML = "Quit job";
        noBtn.innerHTML = "Cancel";
        yesBtn.addEventListener("click", () => {
            this.props.p.quitJob(this.props.locName);
            this.checkIfEmployedHere(true);
            yesNoBoxClose();
        });
        noBtn.addEventListener("click", () => {
            yesNoBoxClose();
        });

        yesNoBoxCreate(<>Would you like to quit your job at {this.company.name}?</>);
    }

    render(): React.ReactNode {
        const isEmployedHere = this.jobTitle != null;
        const favorGain = this.company.getFavorGain();

        return (
            <div>
                {
                    isEmployedHere &&
                    <div>
                        <p>Job Title: {this.jobTitle}</p>
                        <br /><p style={blockStyleMarkup}>-------------------------</p><br />
                        <p className={"tooltip"}>
                            Company reputation: {Reputation(this.company.playerReputation)}
                            <span className={"tooltiptext"}>
                                You will earn {Favor(favorGain[0])} company
                                favor upon resetting after installing Augmentations
                            </span>
                        </p><br />
                        <br /><p style={blockStyleMarkup}>-------------------------</p><br />
                        <p className={"tooltip"}>
                            Company Favor: {Favor(this.company.favor)}
                            <span className={"tooltiptext"}>
                                Company favor increases the rate at which you earn reputation for this company by
                                1% per favor. Company favor is gained whenever you reset after installing Augmentations. The amount
                                of favor you gain depends on how much reputation you have with the comapny.
                            </span>
                        </p><br />
                        <br /><p style={blockStyleMarkup}>-------------------------</p><br />
                        <StdButton
                            onClick={this.work}
                            text={"Work"}
                        />&nbsp;&nbsp;&nbsp;&nbsp;
                        <StdButton
                            onClick={this.quit}
                            text={"Quit"}
                        />
                    </div>
                }
                {
                    this.company.hasAgentPositions() &&
                    <ApplyToJobButton
                        company={this.company}
                        entryPosType={CompanyPositions[posNames.AgentCompanyPositions[0]]}
                        onClick={this.applyForAgentJob}
                        p={this.props.p}
                        style={this.btnStyle}
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
                        style={this.btnStyle}
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
                        style={this.btnStyle}
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
                        style={this.btnStyle}
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
                        style={this.btnStyle}
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
                        style={this.btnStyle}
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
                        style={this.btnStyle}
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
                        style={this.btnStyle}
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
                        style={this.btnStyle}
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
                        style={this.btnStyle}
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
                        style={this.btnStyle}
                        text={"Apply to be a part-time Waiter"}
                    />
                }
                {
                    (this.location.infiltrationData != null) &&
                    <StdButton
                        onClick={this.startInfiltration}
                        style={this.btnStyle}
                        text={"Infiltrate Company"}
                    />
                }
            </div>
        )
    }
}
