import React, { useState, useEffect } from "react";
import { IEngine } from "../../IEngine";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { iTutorialSteps, iTutorialNextStep, ITutorial } from "../../InteractiveTutorial";
import { getAvailableCreatePrograms } from "../../Programs/ProgramHelpers";
import { ICorporation } from "../../Corporation/ICorporation";
import { IGang } from "../../Gang/IGang";

interface IProps {
  player: IPlayer;
  engine: IEngine;
}

export function SidebarRoot(props: IProps): React.ReactElement {
  const setRerender = useState(false)[1];
  function rerender(): void {
    setRerender((old) => !old);
  }
  const [divisionName, setDivisionName] = useState("Overview");

  useEffect(() => {
    const id = setInterval(rerender, 20);
    return () => clearInterval(id);
  }, []);

  const [hackingOpen, setHackingOpen] = useState(true);
  const [characterOpen, setCharacterOpen] = useState(true);
  const [worldOpen, setWorldOpen] = useState(true);
  const [helpOpen, setHelpOpen] = useState(true);

  const flashTerminal =
    ITutorial.currStep === iTutorialSteps.CharacterGoToTerminalPage ||
    ITutorial.currStep === iTutorialSteps.ActiveScriptsPage;

  const flashStats = ITutorial.currStep === iTutorialSteps.GoToCharacterPage;

  const flashActiveScripts = ITutorial.currStep === iTutorialSteps.TerminalGoToActiveScriptsPage;

  const flashHacknet = ITutorial.currStep === iTutorialSteps.GoToHacknetNodesPage;

  const flashCity = ITutorial.currStep === iTutorialSteps.HacknetNodesGoToWorldPage;

  const flashTutorial = ITutorial.currStep === iTutorialSteps.WorldDescription;

  function clickTerminal() {
    props.engine.loadTerminalContent();
    if (flashTerminal) iTutorialNextStep();
  }

  function clickStats() {
    props.engine.loadTerminalContent();
    if (flashStats) iTutorialNextStep();
  }

  function clickActiveScripts() {
    props.engine.loadActiveScriptsContent();
    if (flashActiveScripts) iTutorialNextStep();
  }

  function clickHacknet() {
    props.engine.loadHacknetNodesContent();
    if (flashHacknet) iTutorialNextStep();
  }

  function clickCity() {
    props.engine.loadLocationContent();
    if (flashCity) iTutorialNextStep();
  }

  function clickTutorial() {
    props.engine.loadTutorialContent();
    if (flashTutorial) iTutorialNextStep();
  }

  const programCount = getAvailableCreatePrograms(props.player).length;
  const canCreateProgram =
    programCount > 0 ||
    props.player.augmentations.length > 0 ||
    props.player.queuedAugmentations.length > 0 ||
    props.player.sourceFiles.length > 0;

  const canOpenFactions =
    props.player.factionInvitations.length > 0 ||
    props.player.factions.length > 0 ||
    props.player.augmentations.length > 0 ||
    props.player.queuedAugmentations.length > 0 ||
    props.player.sourceFiles.length > 0;

  const canOpenAugmentations =
    props.player.augmentations.length > 0 ||
    props.player.queuedAugmentations.length > 0 ||
    props.player.sourceFiles.length > 0;

  const canOpenSleeves = props.player.sleeves.length > 0;

  const canCorporation = props.player.corporation != null;
  const canGang = props.player.gang != null;

  return (
    <ul id="mainmenu" className="mainmenu noscrollbar noselect">
      {/* Hacking dropdown */}
      <li className="menu-header">
        <button
          id="hacking-menu-header"
          className={
            "noselect mainmenu-accordion-header" +
            (hackingOpen ? " opened" : "") +
            (flashTerminal ? " flashing-button" : "")
          }
          onClick={() => setHackingOpen((old) => !old)}
        >
          Hacking
        </button>
      </li>
      {hackingOpen && (
        <>
          <li className="mainmenu-accordion-panel">
            <button className={flashTerminal ? "flashing-button" : ""} onClick={clickTerminal}>
              Terminal
            </button>
          </li>
          <li className="mainmenu-accordion-panel">
            <button onClick={() => props.engine.loadScriptEditorContent()}>Create Script</button>
          </li>
          <li className="mainmenu-accordion-panel">
            <button className={flashActiveScripts ? "flashing-button" : ""} onClick={clickActiveScripts}>
              Active Scripts
            </button>
          </li>
          {canCreateProgram && (
            <li className="mainmenu-accordion-panel">
              <button className="notification" onClick={() => props.engine.loadCreateProgramContent()}>
                Create Program
                {programCount > 0 && <span className="badge">{programCount}</span>}
              </button>
            </li>
          )}
        </>
      )}

      {/* Character dropdown */}
      <li className="menu-header">
        <button
          id="character-menu-header"
          className={"noselect mainmenu-accordion-header" + (characterOpen ? " opened" : "")}
          onClick={() => setCharacterOpen((old) => !old)}
        >
          Character
        </button>
      </li>
      {characterOpen && (
        <>
          <li className="mainmenu-accordion-panel">
            <button className={flashStats ? "flashing-button" : ""} onClick={clickStats}>
              Stats
            </button>
          </li>
          {canOpenFactions && (
            <li className="mainmenu-accordion-panel">
              <button className="notification" onClick={() => props.engine.loadFactionsContent()}>
                Factions
                {props.player.factionInvitations.length > 0 && (
                  <span className="badge">{props.player.factionInvitations.length}</span>
                )}
              </button>
            </li>
          )}
          {canOpenAugmentations && (
            <li className="mainmenu-accordion-panel">
              <button className="notification" onClick={() => props.engine.loadAugmentationsContent()}>
                Augmentations
                {props.player.queuedAugmentations.length > 0 && (
                  <span className="badge">{props.player.queuedAugmentations.length}</span>
                )}
              </button>
            </li>
          )}
          <li className="mainmenu-accordion-panel">
            <button className={flashHacknet ? "flashing-button" : ""} onClick={clickHacknet}>
              Hacknet
            </button>
          </li>
          {canOpenSleeves && (
            <li className="mainmenu-accordion-panel">
              <button onClick={() => props.engine.loadSleevesContent()}>Sleeves</button>
            </li>
          )}
        </>
      )}
      {/* World dropdown */}
      <li className="menu-header">
        <button
          id="world-menu-header"
          className={"noselect mainmenu-accordion-header" + (worldOpen ? " opened" : "")}
          onClick={() => setWorldOpen((old) => !old)}
        >
          World
        </button>
      </li>

      {worldOpen && (
        <>
          <li className="mainmenu-accordion-panel">
            <button className={flashCity ? "flashing-button" : ""} onClick={clickCity}>
              City
            </button>
          </li>
          <li className="mainmenu-accordion-panel">
            <button onClick={() => props.engine.loadTravelContent()}>Travel</button>
          </li>
          {props.player.companyName !== "" && (
            <li className="mainmenu-accordion-panel">
              <button onClick={() => props.engine.loadJobContent()}>Job</button>
            </li>
          )}
          {props.player.hasWseAccount && (
            <li className="mainmenu-accordion-panel">
              <button onClick={() => props.engine.loadStockMarketContent()}>Stock Market</button>
            </li>
          )}
          {props.player.bladeburner && (
            <li className="mainmenu-accordion-panel">
              <button onClick={() => props.engine.loadBladeburnerContent()}>Bladeburner</button>
            </li>
          )}
          {canCorporation && (
            <li className="mainmenu-accordion-panel">
              <button onClick={() => props.engine.loadCorporationContent()}>Corp</button>
            </li>
          )}
          {canGang && (
            <li className="mainmenu-accordion-panel">
              <button onClick={() => props.engine.loadGangContent()}>Gang</button>
            </li>
          )}
        </>
      )}
      <li className="menu-header">
        <button
          id="help-menu-header"
          className={"noselect mainmenu-accordion-header" + (helpOpen ? " opened" : "")}
          onClick={() => setHelpOpen((old) => !old)}
        >
          Help
        </button>
      </li>
      {helpOpen && (
        <>
          <li className="mainmenu-accordion-panel">
            <button onClick={() => props.engine.loadMilestonesContent()}>Milestones</button>
          </li>
          <li className="mainmenu-accordion-panel">
            <button className={flashTutorial ? "flashing-button" : ""} onClick={clickTutorial}>
              Tutorial
            </button>
          </li>
          {/*<li className="mainmenu-accordion-panel">
            <button>Options</button>
          </li>*/}
          {process.env.NODE_ENV === "development" && (
            <li className="mainmenu-accordion-panel">
              <button onClick={() => props.engine.loadDevMenuContent()}>Dev</button>
            </li>
          )}
        </>
      )}
    </ul>
  );
}
