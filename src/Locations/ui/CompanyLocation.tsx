/**
 * React Subcomponent for displaying a location's UI, when that location is a company
 *
 * This subcomponent renders all of the buttons for applying to jobs at a company
 */
import React, { useState } from "react";

import { ApplyToJobButton } from "./ApplyToJobButton";

import { Locations } from "../Locations";
import { LocationName } from "../data/LocationNames";

import { Companies } from "../../Company/Companies";
import { CompanyPosition } from "../../Company/CompanyPosition";
import { CompanyPositions } from "../../Company/CompanyPositions";
import * as posNames from "../../Company/data/companypositionnames";

import { StdButton } from "../../ui/React/StdButton";
import { Reputation } from "../../ui/React/Reputation";
import { Favor } from "../../ui/React/Favor";
import { createPopup } from "../../ui/React/createPopup";
import { use } from "../../ui/Context";
import { QuitJobPopup } from "../../Company/ui/QuitJobPopup";

type IProps = {
  locName: LocationName;
};

export function CompanyLocation(props: IProps): React.ReactElement {
  const p = use.Player();
  const router = use.Router();
  const setRerender = useState(false)[1];
  function rerender(): void {
    setRerender((old) => !old);
  }
  /**
   * We'll keep a reference to the Company that this component is being rendered for,
   * so we don't have to look it up every time
   */
  const company = Companies[props.locName];
  if (company == null) throw new Error(`CompanyLocation component constructed with invalid company: ${props.locName}`);

  /**
   * Reference to the Location that this component is being rendered for
   */
  const location = Locations[props.locName];
  if (location == null) {
    throw new Error(`CompanyLocation component constructed with invalid location: ${props.locName}`);
  }

  /**
   * Name of company position that player holds, if applicable
   */
  const jobTitle = p.jobs[props.locName] ? p.jobs[props.locName] : null;

  /**
   * CompanyPosition object for the job that the player holds at this company
   * (if he has one)
   */
  const companyPosition = jobTitle ? CompanyPositions[jobTitle] : null;

  p.location = props.locName;

  function applyForAgentJob(e: React.MouseEvent<HTMLElement>): void {
    if (!e.isTrusted) {
      return;
    }
    p.applyForAgentJob();
    rerender();
  }

  function applyForBusinessConsultantJob(e: React.MouseEvent<HTMLElement>): void {
    if (!e.isTrusted) {
      return;
    }
    p.applyForBusinessConsultantJob();
    rerender();
  }

  function applyForBusinessJob(e: React.MouseEvent<HTMLElement>): void {
    if (!e.isTrusted) {
      return;
    }
    p.applyForBusinessJob();
    rerender();
  }

  function applyForEmployeeJob(e: React.MouseEvent<HTMLElement>): void {
    if (!e.isTrusted) {
      return;
    }
    p.applyForEmployeeJob();
    rerender();
  }

  function applyForItJob(e: React.MouseEvent<HTMLElement>): void {
    if (!e.isTrusted) {
      return;
    }
    p.applyForItJob();
    rerender();
  }

  function applyForPartTimeEmployeeJob(e: React.MouseEvent<HTMLElement>): void {
    if (!e.isTrusted) {
      return;
    }
    p.applyForPartTimeEmployeeJob();
    rerender();
  }

  function applyForPartTimeWaiterJob(e: React.MouseEvent<HTMLElement>): void {
    if (!e.isTrusted) {
      return;
    }
    p.applyForPartTimeWaiterJob();
    rerender();
  }

  function applyForSecurityJob(e: React.MouseEvent<HTMLElement>): void {
    if (!e.isTrusted) {
      return;
    }
    p.applyForSecurityJob();
    rerender();
  }

  function applyForSoftwareConsultantJob(e: React.MouseEvent<HTMLElement>): void {
    if (!e.isTrusted) {
      return;
    }
    p.applyForSoftwareConsultantJob();
    rerender();
  }

  function applyForSoftwareJob(e: React.MouseEvent<HTMLElement>): void {
    if (!e.isTrusted) {
      return;
    }
    p.applyForSoftwareJob();
    rerender();
  }

  function applyForWaiterJob(e: React.MouseEvent<HTMLElement>): void {
    if (!e.isTrusted) {
      return;
    }
    p.applyForWaiterJob();
    rerender();
  }

  function startInfiltration(e: React.MouseEvent<HTMLElement>): void {
    if (!e.isTrusted) {
      return;
    }
    const loc = location;
    if (!loc.infiltrationData)
      throw new Error(`trying to start infiltration at ${props.locName} but the infiltrationData is null`);

    router.toInfiltration(loc);
  }

  function work(e: React.MouseEvent<HTMLElement>): void {
    if (!e.isTrusted) {
      return;
    }

    const pos = companyPosition;
    if (pos instanceof CompanyPosition) {
      if (pos.isPartTimeJob() || pos.isSoftwareConsultantJob() || pos.isBusinessConsultantJob()) {
        p.startWorkPartTime(props.locName);
      } else {
        p.startWork(props.locName);
      }
      router.toWork();
    }
  }

  function quit(e: React.MouseEvent<HTMLElement>): void {
    if (!e.isTrusted) return;
    const popupId = `quit-job-popup`;
    createPopup(popupId, QuitJobPopup, {
      locName: props.locName,
      company: company,
      player: p,
      onQuit: rerender,
      popupId: popupId,
    });
  }

  const isEmployedHere = jobTitle != null;
  const favorGain = company.getFavorGain();

  return (
    <div>
      {isEmployedHere && (
        <div>
          <p>Job Title: {jobTitle}</p>
          <br />
          <p style={{ display: "block" }}>-------------------------</p>
          <br />
          <p className={"tooltip"}>
            Company reputation: {Reputation(company.playerReputation)}
            <span className={"tooltiptext"}>
              You will earn {Favor(favorGain[0])} company favor upon resetting after installing Augmentations
            </span>
          </p>
          <br />
          <br />
          <p style={{ display: "block" }}>-------------------------</p>
          <br />
          <p className={"tooltip"}>
            Company Favor: {Favor(company.favor)}
            <span className={"tooltiptext"}>
              Company favor increases the rate at which you earn reputation for this company by 1% per favor. Company
              favor is gained whenever you reset after installing Augmentations. The amount of favor you gain depends on
              how much reputation you have with the comapny.
            </span>
          </p>
          <br />
          <br />
          <p style={{ display: "block" }}>-------------------------</p>
          <br />
          <StdButton onClick={work} text={"Work"} />
          &nbsp;&nbsp;&nbsp;&nbsp;
          <StdButton onClick={quit} text={"Quit"} />
        </div>
      )}
      {company.hasAgentPositions() && (
        <ApplyToJobButton
          company={company}
          entryPosType={CompanyPositions[posNames.AgentCompanyPositions[0]]}
          onClick={applyForAgentJob}
          p={p}
          style={{ display: "block" }}
          text={"Apply for Agent Job"}
        />
      )}
      {company.hasBusinessConsultantPositions() && (
        <ApplyToJobButton
          company={company}
          entryPosType={CompanyPositions[posNames.BusinessConsultantCompanyPositions[0]]}
          onClick={applyForBusinessConsultantJob}
          p={p}
          style={{ display: "block" }}
          text={"Apply for Business Consultant Job"}
        />
      )}
      {company.hasBusinessPositions() && (
        <ApplyToJobButton
          company={company}
          entryPosType={CompanyPositions[posNames.BusinessCompanyPositions[0]]}
          onClick={applyForBusinessJob}
          p={p}
          style={{ display: "block" }}
          text={"Apply for Business Job"}
        />
      )}
      {company.hasEmployeePositions() && (
        <ApplyToJobButton
          company={company}
          entryPosType={CompanyPositions[posNames.MiscCompanyPositions[1]]}
          onClick={applyForEmployeeJob}
          p={p}
          style={{ display: "block" }}
          text={"Apply to be an Employee"}
        />
      )}
      {company.hasEmployeePositions() && (
        <ApplyToJobButton
          company={company}
          entryPosType={CompanyPositions[posNames.PartTimeCompanyPositions[1]]}
          onClick={applyForPartTimeEmployeeJob}
          p={p}
          style={{ display: "block" }}
          text={"Apply to be a part-time Employee"}
        />
      )}
      {company.hasITPositions() && (
        <ApplyToJobButton
          company={company}
          entryPosType={CompanyPositions[posNames.ITCompanyPositions[0]]}
          onClick={applyForItJob}
          p={p}
          style={{ display: "block" }}
          text={"Apply for IT Job"}
        />
      )}
      {company.hasSecurityPositions() && (
        <ApplyToJobButton
          company={company}
          entryPosType={CompanyPositions[posNames.SecurityCompanyPositions[2]]}
          onClick={applyForSecurityJob}
          p={p}
          style={{ display: "block" }}
          text={"Apply for Security Job"}
        />
      )}
      {company.hasSoftwareConsultantPositions() && (
        <ApplyToJobButton
          company={company}
          entryPosType={CompanyPositions[posNames.SoftwareConsultantCompanyPositions[0]]}
          onClick={applyForSoftwareConsultantJob}
          p={p}
          style={{ display: "block" }}
          text={"Apply for Software Consultant Job"}
        />
      )}
      {company.hasSoftwarePositions() && (
        <ApplyToJobButton
          company={company}
          entryPosType={CompanyPositions[posNames.SoftwareCompanyPositions[0]]}
          onClick={applyForSoftwareJob}
          p={p}
          style={{ display: "block" }}
          text={"Apply for Software Job"}
        />
      )}
      {company.hasWaiterPositions() && (
        <ApplyToJobButton
          company={company}
          entryPosType={CompanyPositions[posNames.MiscCompanyPositions[0]]}
          onClick={applyForWaiterJob}
          p={p}
          style={{ display: "block" }}
          text={"Apply to be a Waiter"}
        />
      )}
      {company.hasWaiterPositions() && (
        <ApplyToJobButton
          company={company}
          entryPosType={CompanyPositions[posNames.PartTimeCompanyPositions[0]]}
          onClick={applyForPartTimeWaiterJob}
          p={p}
          style={{ display: "block" }}
          text={"Apply to be a part-time Waiter"}
        />
      )}
      {location.infiltrationData != null && (
        <StdButton onClick={startInfiltration} style={{ display: "block" }} text={"Infiltrate Company"} />
      )}
      <br />
      <br />
      <br />
      <br />
      <br />
    </div>
  );
}
