/**
 * React Subcomponent for displaying a location's UI, when that location is a company
 *
 * This subcomponent renders all of the buttons for applying to jobs at a company
 */
import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";

import { ApplyToJobButton } from "./ApplyToJobButton";

import { Locations } from "../Locations";
import { LocationName } from "../data/LocationNames";

import { Companies } from "../../Company/Companies";
import { CompanyPositions } from "../../Company/CompanyPositions";
import * as posNames from "../../Company/data/companypositionnames";

import { Reputation } from "../../ui/React/Reputation";
import { Favor } from "../../ui/React/Favor";
import { Router } from "../../ui/GameRoot";
import { Player } from "@player";
import { QuitJobModal } from "../../Company/ui/QuitJobModal";
import { CompanyWork } from "../../Work/CompanyWork";

type IProps = {
  locName: LocationName;
};

export function CompanyLocation(props: IProps): React.ReactElement {
  const [quitOpen, setQuitOpen] = useState(false);
  const setRerender = useState(false)[1];
  function rerender(): void {
    setRerender((old) => !old);
  }

  useEffect(() => {
    const id = setInterval(rerender, 200);
    return () => clearInterval(id);
  }, []);
  /**
   * We'll keep a reference to the Company that this component is being rendered for,
   * so we don't have to look it up every time
   */
  const company = Companies[props.locName];
  if (company == null) throw new Error(`CompanyLocation component constructed with invalid company: ${props.locName}`);

  /** Reference to the Location that this component is being rendered for */
  const location = Locations[props.locName];
  if (location == null) {
    throw new Error(`CompanyLocation component constructed with invalid location: ${props.locName}`);
  }

  /** Name of company position that player holds, if applicable */
  const jobTitle = Player.jobs[props.locName] ? Player.jobs[props.locName] : null;

  /**
   * CompanyPosition object for the job that the player holds at this company
   * (if he has one)
   */
  const companyPosition = jobTitle ? CompanyPositions[jobTitle] : null;

  Player.location = props.locName;

  function applyForAgentJob(e: React.MouseEvent<HTMLElement>): void {
    if (!e.isTrusted) {
      return;
    }
    Player.applyForAgentJob();
    rerender();
  }

  function applyForBusinessConsultantJob(e: React.MouseEvent<HTMLElement>): void {
    if (!e.isTrusted) {
      return;
    }
    Player.applyForBusinessConsultantJob();
    rerender();
  }

  function applyForBusinessJob(e: React.MouseEvent<HTMLElement>): void {
    if (!e.isTrusted) {
      return;
    }
    Player.applyForBusinessJob();
    rerender();
  }

  function applyForEmployeeJob(e: React.MouseEvent<HTMLElement>): void {
    if (!e.isTrusted) {
      return;
    }
    Player.applyForEmployeeJob();
    rerender();
  }

  function applyForItJob(e: React.MouseEvent<HTMLElement>): void {
    if (!e.isTrusted) {
      return;
    }
    Player.applyForItJob();
    rerender();
  }

  function applyForPartTimeEmployeeJob(e: React.MouseEvent<HTMLElement>): void {
    if (!e.isTrusted) {
      return;
    }
    Player.applyForPartTimeEmployeeJob();
    rerender();
  }

  function applyForPartTimeWaiterJob(e: React.MouseEvent<HTMLElement>): void {
    if (!e.isTrusted) {
      return;
    }
    Player.applyForPartTimeWaiterJob();
    rerender();
  }

  function applyForSecurityJob(e: React.MouseEvent<HTMLElement>): void {
    if (!e.isTrusted) {
      return;
    }
    Player.applyForSecurityJob();
    rerender();
  }

  function applyForSoftwareConsultantJob(e: React.MouseEvent<HTMLElement>): void {
    if (!e.isTrusted) {
      return;
    }
    Player.applyForSoftwareConsultantJob();
    rerender();
  }

  function applyForSoftwareJob(e: React.MouseEvent<HTMLElement>): void {
    if (!e.isTrusted) {
      return;
    }
    Player.applyForSoftwareJob();
    rerender();
  }

  function applyForWaiterJob(e: React.MouseEvent<HTMLElement>): void {
    if (!e.isTrusted) {
      return;
    }
    Player.applyForWaiterJob();
    rerender();
  }

  function startInfiltration(e: React.MouseEvent<HTMLElement>): void {
    if (!e.isTrusted) {
      return;
    }
    const loc = location;
    if (!loc.infiltrationData)
      throw new Error(`trying to start infiltration at ${props.locName} but the infiltrationData is null`);

    Router.toInfiltration(loc);
  }

  function work(e: React.MouseEvent<HTMLElement>): void {
    if (!e.isTrusted) {
      return;
    }

    const pos = companyPosition;
    if (pos) {
      Player.startWork(
        new CompanyWork({
          singularity: false,
          companyName: props.locName,
        }),
      );
      Player.startFocusing();
      Router.toWork();
    }
  }

  const isEmployedHere = jobTitle != null;
  const favorGain = company.getFavorGain();

  return (
    <>
      {isEmployedHere && (
        <>
          <Typography>Job Title: {jobTitle}</Typography>
          <Typography>-------------------------</Typography>
          <Box display="flex">
            <Tooltip
              title={
                <>
                  You will have <Favor favor={company.favor + favorGain} /> company favor upon resetting after
                  installing Augmentations
                </>
              }
            >
              <Typography>
                Company reputation: <Reputation reputation={company.playerReputation} />
              </Typography>
            </Tooltip>
          </Box>
          <Typography>-------------------------</Typography>
          <Box display="flex">
            <Tooltip
              title={
                <>
                  Company favor increases the rate at which you earn reputation for this company by 1% per favor.
                  Company favor is gained whenever you reset after installing Augmentations. The amount of favor you
                  gain depends on how much reputation you have with the company.
                </>
              }
            >
              <Typography>
                Company Favor: <Favor favor={company.favor} />
              </Typography>
            </Tooltip>
          </Box>
          <Typography>-------------------------</Typography>
          <br />
        </>
      )}
      <Box sx={{ display: "grid", width: "fit-content" }}>
        {isEmployedHere && (
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
            <Button onClick={work}>Work</Button>
            <Button onClick={() => setQuitOpen(true)}>Quit</Button>
            <QuitJobModal
              locName={props.locName}
              company={company}
              onQuit={rerender}
              open={quitOpen}
              onClose={() => setQuitOpen(false)}
            />
          </Box>
        )}
        {company.hasAgentPositions() && (
          <ApplyToJobButton
            company={company}
            entryPosType={CompanyPositions[posNames.AgentCompanyPositions[0]]}
            onClick={applyForAgentJob}
            text={"Apply for Agent Job"}
          />
        )}
        {company.hasBusinessConsultantPositions() && (
          <ApplyToJobButton
            company={company}
            entryPosType={CompanyPositions[posNames.BusinessConsultantCompanyPositions[0]]}
            onClick={applyForBusinessConsultantJob}
            text={"Apply for Business Consultant Job"}
          />
        )}
        {company.hasBusinessPositions() && (
          <ApplyToJobButton
            company={company}
            entryPosType={CompanyPositions[posNames.BusinessCompanyPositions[0]]}
            onClick={applyForBusinessJob}
            text={"Apply for Business Job"}
          />
        )}
        {company.hasEmployeePositions() && (
          <ApplyToJobButton
            company={company}
            entryPosType={CompanyPositions[posNames.MiscCompanyPositions[1]]}
            onClick={applyForEmployeeJob}
            text={"Apply to be an Employee"}
          />
        )}
        {company.hasEmployeePositions() && (
          <ApplyToJobButton
            company={company}
            entryPosType={CompanyPositions[posNames.PartTimeCompanyPositions[1]]}
            onClick={applyForPartTimeEmployeeJob}
            text={"Apply to be a part-time Employee"}
          />
        )}
        {company.hasITPositions() && (
          <ApplyToJobButton
            company={company}
            entryPosType={CompanyPositions[posNames.ITCompanyPositions[0]]}
            onClick={applyForItJob}
            text={"Apply for IT Job"}
          />
        )}
        {company.hasSecurityPositions() && (
          <ApplyToJobButton
            company={company}
            entryPosType={CompanyPositions[posNames.SecurityCompanyPositions[2]]}
            onClick={applyForSecurityJob}
            text={"Apply for Security Job"}
          />
        )}
        {company.hasSoftwareConsultantPositions() && (
          <ApplyToJobButton
            company={company}
            entryPosType={CompanyPositions[posNames.SoftwareConsultantCompanyPositions[0]]}
            onClick={applyForSoftwareConsultantJob}
            text={"Apply for Software Consultant Job"}
          />
        )}
        {company.hasSoftwarePositions() && (
          <ApplyToJobButton
            company={company}
            entryPosType={CompanyPositions[posNames.SoftwareCompanyPositions[0]]}
            onClick={applyForSoftwareJob}
            text={"Apply for Software Job"}
          />
        )}
        {company.hasWaiterPositions() && (
          <ApplyToJobButton
            company={company}
            entryPosType={CompanyPositions[posNames.MiscCompanyPositions[0]]}
            onClick={applyForWaiterJob}
            text={"Apply to be a Waiter"}
          />
        )}
        {company.hasWaiterPositions() && (
          <ApplyToJobButton
            company={company}
            entryPosType={CompanyPositions[posNames.PartTimeCompanyPositions[0]]}
            onClick={applyForPartTimeWaiterJob}
            text={"Apply to be a part-time Waiter"}
          />
        )}
        {location.infiltrationData != null && <Button onClick={startInfiltration}>Infiltrate Company</Button>}
      </Box>
    </>
  );
}
