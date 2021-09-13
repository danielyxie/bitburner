import React, { useState, useEffect } from "react";
import { IEngine } from "../../IEngine";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { iTutorialSteps, iTutorialNextStep, ITutorial } from "../../InteractiveTutorial";
import { getAvailableCreatePrograms } from "../../Programs/ProgramHelpers";
import { Settings } from "../../Settings/Settings";
import { redPillFlag } from "../../RedPill";

import { inMission } from "../../Missions";
import { cinematicTextFlag } from "../../CinematicText";
import { KEY } from "../../../utils/helpers/keyCodes";
import { FconfSettings } from "../../Fconf/FconfSettings";
import { Page, routing } from "../../ui/navigationTracking";

interface IProps {
  player: IPlayer;
  engine: IEngine;
}

export function SidebarRoot(props: IProps): React.ReactElement {
  const setRerender = useState(false)[1];
  function rerender(): void {
    setRerender((old) => !old);
  }

  useEffect(() => {
    const id = setInterval(rerender, 20);
    return () => clearInterval(id);
  }, []);

  const [activeTab, setActiveTab] = useState("");
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

  // TODO(hydroflame): these should not as any but right now the def is that it
  // can only be defined;
  const canCorporation = !!(props.player.corporation as any);
  const canGang = !!(props.player.gang as any);
  const canJob = props.player.companyName !== "";
  const canStockMarket = props.player.hasWseAccount;
  const canBladeburner = !!(props.player.bladeburner as any);

  function clickTerminal(): void {
    setActiveTab("Terminal");
    props.engine.loadTerminalContent();
    if (flashTerminal) iTutorialNextStep();
  }

  function clickCreateScripts(): void {
    setActiveTab("CreateScripts");
    props.engine.loadScriptEditorContent();
  }

  function clickStats(): void {
    setActiveTab("Stats");
    props.engine.loadCharacterContent();
    if (flashStats) iTutorialNextStep();
  }

  function clickActiveScripts(): void {
    setActiveTab("ActiveScripts");
    props.engine.loadActiveScriptsContent();
    if (flashActiveScripts) iTutorialNextStep();
  }

  function clickCreateProgram(): void {
    setActiveTab("CreateProgram");
    props.engine.loadCreateProgramContent();
  }

  function clickFactions(): void {
    setActiveTab("Factions");
    props.engine.loadFactionsContent();
  }

  function clickAugmentations(): void {
    setActiveTab("Augmentations");
    props.engine.loadAugmentationsContent();
  }

  function clickSleeves(): void {
    setActiveTab("Sleeves");
    props.engine.loadSleevesContent();
  }

  function clickHacknet(): void {
    setActiveTab("Hacknet");
    props.engine.loadHacknetNodesContent();
    if (flashHacknet) iTutorialNextStep();
  }

  function clickCity(): void {
    setActiveTab("City");
    props.engine.loadLocationContent();
    if (flashCity) iTutorialNextStep();
  }

  function clickTravel(): void {
    setActiveTab("Travel");
    props.engine.loadTravelContent();
  }

  function clickJob(): void {
    setActiveTab("Job");
    props.engine.loadJobContent();
  }

  function clickStockMarket(): void {
    setActiveTab("StockMarket");
    props.engine.loadStockMarketContent();
  }

  function clickBladeburner(): void {
    setActiveTab("Bladeburner");
    props.engine.loadBladeburnerContent();
  }

  function clickCorp(): void {
    setActiveTab("Corp");
    props.engine.loadCorporationContent();
  }

  function clickGang(): void {
    setActiveTab("Gang");
    props.engine.loadGangContent();
  }

  function clickTutorial(): void {
    setActiveTab("Tutorial");
    props.engine.loadTutorialContent();
    if (flashTutorial) iTutorialNextStep();
  }

  function clickMilestones(): void {
    setActiveTab("Milestones");
    props.engine.loadMilestonesContent();
  }

  function clickDev(): void {
    setActiveTab("Dev");
    props.engine.loadDevMenuContent();
  }

  useEffect(() => {
    // Shortcuts to navigate through the game
    //  Alt-t - Terminal
    //  Alt-c - Character
    //  Alt-e - Script editor
    //  Alt-s - Active scripts
    //  Alt-h - Hacknet Nodes
    //  Alt-w - City
    //  Alt-j - Job
    //  Alt-r - Travel Agency of current city
    //  Alt-p - Create program
    //  Alt-f - Factions
    //  Alt-a - Augmentations
    //  Alt-u - Tutorial
    //  Alt-o - Options
    function handleShortcuts(this: Document, event: KeyboardEvent): any {
      if (Settings.DisableHotkeys) return;
      if (props.player.isWorking || redPillFlag || inMission || cinematicTextFlag) return;
      if (event.keyCode == KEY.T && event.altKey) {
        event.preventDefault();
        clickTerminal();
      } else if (event.keyCode === KEY.C && event.altKey) {
        event.preventDefault();
        clickStats();
      } else if (event.keyCode === KEY.E && event.altKey) {
        event.preventDefault();
        clickCreateScripts();
      } else if (event.keyCode === KEY.S && event.altKey) {
        event.preventDefault();
        clickActiveScripts();
      } else if (event.keyCode === KEY.H && event.altKey) {
        event.preventDefault();
        clickHacknet();
      } else if (event.keyCode === KEY.W && event.altKey) {
        event.preventDefault();
        clickCity();
      } else if (event.keyCode === KEY.J && event.altKey) {
        event.preventDefault();
        clickJob();
      } else if (event.keyCode === KEY.R && event.altKey) {
        event.preventDefault();
        clickTravel();
      } else if (event.keyCode === KEY.P && event.altKey) {
        event.preventDefault();
        clickCreateProgram();
      } else if (event.keyCode === KEY.F && event.altKey) {
        // Overriden by Fconf
        if (routing.isOn(Page.Terminal) && FconfSettings.ENABLE_BASH_HOTKEYS) {
          return;
        }
        event.preventDefault();
        clickFactions();
      } else if (event.keyCode === KEY.A && event.altKey) {
        event.preventDefault();
        clickAugmentations();
      } else if (event.keyCode === KEY.U && event.altKey) {
        event.preventDefault();
        clickTutorial();
      } else if (event.keyCode === KEY.B && event.altKey) {
        event.preventDefault();
        clickBladeburner();
      } else if (event.keyCode === KEY.G && event.altKey) {
        event.preventDefault();
        clickGang();
      }
      // if (event.keyCode === KEY.O && event.altKey) {
      //   event.preventDefault();
      //   gameOptionsBoxOpen();
      // }
    }

    document.addEventListener("keypress", handleShortcuts);
    return () => document.removeEventListener("keypress", handleShortcuts);
  }, []);

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
          <li className={`mainmenu-accordion-panel`}>
            <button
              className={(flashTerminal ? "flashing-button" : "") + activeTab === "Terminal" ? " active" : ""}
              onClick={clickTerminal}
            >
              Terminal
            </button>
          </li>
          <li className={`mainmenu-accordion-panel`}>
            <button className={activeTab === "CreateScripts" ? " active" : ""} onClick={clickCreateScripts}>
              Create Script
            </button>
          </li>
          <li className={`mainmenu-accordion-panel`}>
            <button
              className={(flashActiveScripts ? "flashing-button" : "") + activeTab === "ActiveScripts" ? " active" : ""}
              onClick={clickActiveScripts}
            >
              Active Scripts
            </button>
          </li>
          {canCreateProgram && (
            <li className={`mainmenu-accordion-panel`}>
              <button
                className={"notification" + (activeTab === "CreateProgram" ? " active" : "")}
                onClick={clickCreateProgram}
              >
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
          <li className={`mainmenu-accordion-panel`}>
            <button
              className={(flashStats ? "flashing-button" : "") + activeTab === "Stats" ? " active" : ""}
              onClick={clickStats}
            >
              Stats
            </button>
          </li>
          {canOpenFactions && (
            <li className={`mainmenu-accordion-panel`}>
              <button className={"notification" + (activeTab === "Factions" ? " active" : "")} onClick={clickFactions}>
                Factions
                {props.player.factionInvitations.length > 0 && (
                  <span className="badge">{props.player.factionInvitations.length}</span>
                )}
              </button>
            </li>
          )}
          {canOpenAugmentations && (
            <li className={`mainmenu-accordion-panel`}>
              <button
                className={"notification" + (activeTab === "Augmentations" ? " active" : "")}
                onClick={clickAugmentations}
              >
                Augmentations
                {props.player.queuedAugmentations.length > 0 && (
                  <span className="badge">{props.player.queuedAugmentations.length}</span>
                )}
              </button>
            </li>
          )}
          <li className={`mainmenu-accordion-panel`}>
            <button
              className={(flashHacknet ? "flashing-button" : "") + activeTab === "Hacknet" ? " active" : ""}
              onClick={clickHacknet}
            >
              Hacknet
            </button>
          </li>
          {canOpenSleeves && (
            <li className={`mainmenu-accordion-panel`}>
              <button className={activeTab === "Sleeves" ? " active" : ""} onClick={clickSleeves}>
                Sleeves
              </button>
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
          <li className={`mainmenu-accordion-panel`}>
            <button
              className={(flashCity ? "flashing-button" : "") + activeTab === "City" ? " active" : ""}
              onClick={clickCity}
            >
              City
            </button>
          </li>
          <li className={`mainmenu-accordion-panel`}>
            <button className={activeTab === "Travel" ? " active" : ""} onClick={clickTravel}>
              Travel
            </button>
          </li>
          {canJob && (
            <li className={`mainmenu-accordion-panel`}>
              <button className={activeTab === "Job" ? " active" : ""} onClick={clickJob}>
                Job
              </button>
            </li>
          )}
          {canStockMarket && (
            <li className={`mainmenu-accordion-panel`}>
              <button className={activeTab === "StockMarket" ? " active" : ""} onClick={clickStockMarket}>
                Stock Market
              </button>
            </li>
          )}
          {canBladeburner && (
            <li className={`mainmenu-accordion-panel`}>
              <button className={activeTab === "Bladeburner" ? " active" : ""} onClick={clickBladeburner}>
                Bladeburner
              </button>
            </li>
          )}
          {canCorporation && (
            <li className={`mainmenu-accordion-panel`}>
              <button className={activeTab === "Corp" ? " active" : ""} onClick={clickCorp}>
                Corp
              </button>
            </li>
          )}
          {canGang && (
            <li className={`mainmenu-accordion-panel`}>
              <button className={activeTab === "Gang" ? " active" : ""} onClick={clickGang}>
                Gang
              </button>
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
          <li className={`mainmenu-accordion-panel`}>
            <button className={activeTab === "Milestones" ? " active" : ""} onClick={clickMilestones}>
              Milestones
            </button>
          </li>
          <li className={`mainmenu-accordion-panel`}>
            <button
              className={(flashTutorial ? "flashing-button" : "") + activeTab === "Tutorial" ? " active" : ""}
              onClick={clickTutorial}
            >
              Tutorial
            </button>
          </li>
          {/*<li className="mainmenu-accordion-panel">
            <button>Options</button>
          </li>*/}
          {process.env.NODE_ENV === "development" && (
            <li className={`mainmenu-accordion-panel`}>
              <button className={activeTab === "Dev" ? " active" : ""} onClick={clickDev}>
                Dev
              </button>
            </li>
          )}
        </>
      )}
    </ul>
  );
}
