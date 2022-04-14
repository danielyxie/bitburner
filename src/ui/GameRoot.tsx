import Box from "@mui/material/Box";
import type { Theme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import _functions from "lodash/functions";
import _wrap from "lodash/wrap";
import React, { useEffect, useState } from "react";

import { calculateAchievements } from "../Achievements/Achievements";
import { AchievementsRoot } from "../Achievements/AchievementsRoot";
import { installAugmentations } from "../Augmentation/AugmentationHelpers";
import { AugmentationsRoot } from "../Augmentation/ui/AugmentationsRoot";
import { BitverseRoot } from "../BitNode/ui/BitverseRoot";
import { BladeburnerCinematic } from "../Bladeburner/ui/BladeburnerCinematic";
import { BladeburnerRoot } from "../Bladeburner/ui/BladeburnerRoot";
import { CorporationRoot } from "../Corporation/ui/CorporationRoot";
import { staneksGift } from "../CotMG/Helper";
import { StaneksGiftRoot } from "../CotMG/ui/StaneksGiftRoot";
import { DevMenuRoot } from "../DevMenu";
import { Unclickable } from "../Exploits/Unclickable";
import { onExport } from "../ExportBonus";
import type { Faction } from "../Faction/Faction";
import { Factions } from "../Faction/Factions";
import { FactionRoot } from "../Faction/ui/FactionRoot";
import { FactionsRoot } from "../Faction/ui/FactionsRoot";
import { InvitationModal } from "../Faction/ui/InvitationModal";
import { GangRoot } from "../Gang/ui/GangRoot";
import { HacknetRoot } from "../Hacknet/ui/HacknetRoot";
import type { IEngine } from "../IEngine";
import { InfiltrationRoot } from "../Infiltration/ui/InfiltrationRoot";
import { ITutorial, iTutorialStart } from "../InteractiveTutorial";
import { LocationName } from "../Locations/data/LocationNames";
import type { Location } from "../Locations/Location";
import { Locations } from "../Locations/Locations";
import { LocationCity } from "../Locations/ui/City";
import { GenericLocation } from "../Locations/ui/GenericLocation";
import { TravelAgencyRoot } from "../Locations/ui/TravelAgencyRoot";
import { MilestonesRoot } from "../Milestones/ui/MilestonesRoot";
import { workerScripts } from "../Netscript/WorkerScripts";
import { GraftingRoot } from "../PersonObjects/Grafting/ui/GraftingRoot";
import type { IPlayer } from "../PersonObjects/IPlayer";
import { SleeveRoot } from "../PersonObjects/Sleeve/ui/SleeveRoot";
import { prestigeAugmentation } from "../Prestige";
import { ProgramsRoot } from "../Programs/ui/ProgramsRoot";
import { enterBitNode } from "../RedPill";
import { saveObject } from "../SaveObject";
import { Root as ScriptEditorRoot } from "../ScriptEditor/ui/ScriptEditorRoot";
import { GetAllServers } from "../Server/AllServers";
import { Settings } from "../Settings/Settings";
import { SidebarRoot } from "../Sidebar/ui/SidebarRoot";
import { buyStock, sellShort, sellStock, shortStock } from "../StockMarket/BuyingAndSelling";
import {
  StockMarket,
  cancelOrder,
  eventEmitterForUiReset,
  initStockMarketFn,
  placeOrder,
} from "../StockMarket/StockMarket";
import { StockMarketRoot } from "../StockMarket/ui/StockMarketRoot";
import type { ITerminal } from "../Terminal/ITerminal";
import { TerminalRoot } from "../Terminal/ui/TerminalRoot";
import { ThemeBrowser } from "../Themes/ui/ThemeBrowser";
import { TutorialRoot } from "../Tutorial/ui/TutorialRoot";

import { ActiveScriptsRoot } from "./ActiveScripts/ActiveScriptsRoot";
import { Apr1 } from "./Apr1";
import { CharacterStats } from "./CharacterStats";
import { Context } from "./Context";
import { ErrorBoundary } from "./ErrorBoundary";
import { InteractiveTutorialRoot } from "./InteractiveTutorial/InteractiveTutorialRoot";
import { ITutorialEvents } from "./InteractiveTutorial/ITutorialEvents";
import { AlertManager } from "./React/AlertManager";
import { BypassWrapper } from "./React/BypassWrapper";
import { CharacterOverview } from "./React/CharacterOverview";
import { dialogBoxCreate } from "./React/DialogBox";
import { GameOptionsRoot } from "./React/GameOptionsRoot";
import { ImportSaveRoot } from "./React/ImportSaveRoot";
import { LogBoxManager } from "./React/LogBoxManager";
import { Overview } from "./React/Overview";
import { PromptManager } from "./React/PromptManager";
import { RecoveryMode, RecoveryRoot } from "./React/RecoveryRoot";
import { Snackbar, SnackbarProvider } from "./React/Snackbar";
import { Page } from "./Router";
import type { IRouter, ScriptEditorRouteOptions } from "./Router";
import { WorkInProgressRoot } from "./WorkInProgressRoot";

const htmlLocation = location;

interface IProps {
  terminal: ITerminal;
  player: IPlayer;
  engine: IEngine;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      "-ms-overflow-style": "none" /* for Internet Explorer, Edge */,
      "scrollbar-width": "none" /* for Firefox */,
      margin: theme.spacing(0),
      flexGrow: 1,
      display: "block",
      padding: "8px",
      minHeight: "100vh",
      boxSizing: "border-box",
    },
  }),
);

const uninitialized = (): any => {
  throw new Error("Router called before initialization");
};

export let Router: IRouter = {
  isInitialized: false,
  page: uninitialized,
  allowRouting: uninitialized,
  toActiveScripts: uninitialized,
  toAugmentations: uninitialized,
  toBitVerse: uninitialized,
  toBladeburner: uninitialized,
  toStats: uninitialized,
  toCity: uninitialized,
  toCorporation: uninitialized,
  toCreateProgram: uninitialized,
  toDevMenu: uninitialized,
  toFaction: uninitialized,
  toFactions: uninitialized,
  toGameOptions: uninitialized,
  toGang: uninitialized,
  toHacknetNodes: uninitialized,
  toInfiltration: uninitialized,
  toJob: uninitialized,
  toMilestones: uninitialized,
  toGrafting: uninitialized,
  toScriptEditor: uninitialized,
  toSleeves: uninitialized,
  toStockMarket: uninitialized,
  toTerminal: uninitialized,
  toTravel: uninitialized,
  toTutorial: uninitialized,
  toWork: uninitialized,
  toBladeburnerCinematic: uninitialized,
  toLocation: uninitialized,
  toStaneksGift: uninitialized,
  toAchievements: uninitialized,
  toThemeBrowser: uninitialized,
  toImportSave: uninitialized,
};

function determineStartPage(player: IPlayer): Page {
  if (RecoveryMode) return Page.Recovery;
  if (player.isWorking) return Page.Work;
  return Page.Terminal;
}

export function GameRoot({ player, engine, terminal }: IProps): React.ReactElement {
  const classes = useStyles();
  const [{ files, vim }, setEditorOptions] = useState({ files: {}, vim: false });
  const [page, setPage] = useState(determineStartPage(player));
  const setRerender = useState(0)[1];
  const [augPage, setAugPage] = useState<boolean>(false);
  const [faction, setFaction] = useState<Faction>(
    player.currentWorkFactionName ? Factions[player.currentWorkFactionName] : (undefined as unknown as Faction),
  );
  if (faction === undefined && page === Page.Faction)
    throw new Error("Trying to go to a page without the proper setup");

  const [flume, setFlume] = useState<boolean>(false);
  const [quick, setQuick] = useState<boolean>(false);
  const [location, setLocation] = useState<Location>(undefined as unknown as Location);
  if (location === undefined && (page === Page.Infiltration || page === Page.Location || page === Page.Job))
    throw new Error("Trying to go to a page without the proper setup");

  const [cinematicText, setCinematicText] = useState("");
  const [errorBoundaryKey, setErrorBoundaryKey] = useState<number>(0);
  const [sidebarOpened, setSideBarOpened] = useState(Settings.IsSidebarOpened);

  const [importString, setImportString] = useState<string>(undefined as unknown as string);
  const [importAutomatic, setImportAutomatic] = useState<boolean>(false);
  if (importString === undefined && page === Page.ImportSave)
    throw new Error("Trying to go to a page without the proper setup");

  const [allowRoutingCalls, setAllowRoutingCalls] = useState(true);

  function resetErrorBoundary(): void {
    setErrorBoundaryKey(errorBoundaryKey + 1);
  }

  function rerender(): void {
    setRerender((old) => old + 1);
  }
  useEffect(() => {
    return ITutorialEvents.subscribe(rerender);
  }, []);

  function killAllScripts(): void {
    for (const server of GetAllServers()) {
      server.runningScripts = [];
    }
    saveObject.saveGame();
    setTimeout(() => htmlLocation.reload(), 2000);
  }

  Router = {
    isInitialized: true,
    page: () => page,
    allowRouting: (value: boolean) => setAllowRoutingCalls(value),
    toActiveScripts: () => setPage(Page.ActiveScripts),
    toAugmentations: () => setPage(Page.Augmentations),
    toBladeburner: () => setPage(Page.Bladeburner),
    toStats: () => setPage(Page.Stats),
    toCorporation: () => setPage(Page.Corporation),
    toCreateProgram: () => setPage(Page.CreateProgram),
    toDevMenu: () => setPage(Page.DevMenu),
    toFaction: (faction: Faction, augPage = false) => {
      setAugPage(augPage);
      setPage(Page.Faction);
      if (faction) setFaction(faction);
    },
    toFactions: () => setPage(Page.Factions),
    toGameOptions: () => setPage(Page.Options),
    toGang: () => setPage(Page.Gang),
    toHacknetNodes: () => setPage(Page.Hacknet),
    toMilestones: () => setPage(Page.Milestones),
    toGrafting: () => setPage(Page.Grafting),
    toScriptEditor: (files: Record<string, string>, options?: ScriptEditorRouteOptions) => {
      setEditorOptions({
        files,
        vim: !!options?.vim,
      });
      setPage(Page.ScriptEditor);
    },
    toSleeves: () => setPage(Page.Sleeves),
    toStockMarket: () => setPage(Page.StockMarket),
    toTerminal: () => setPage(Page.Terminal),
    toTutorial: () => setPage(Page.Tutorial),
    toJob: () => {
      setLocation(Locations[player.companyName]);
      setPage(Page.Job);
    },
    toCity: () => {
      setPage(Page.City);
    },
    toTravel: () => {
      player.gotoLocation(LocationName.TravelAgency);
      setPage(Page.Travel);
    },
    toBitVerse: (flume: boolean, quick: boolean) => {
      setFlume(flume);
      setQuick(quick);
      calculateAchievements();
      setPage(Page.BitVerse);
    },
    toInfiltration: (location: Location) => {
      setLocation(location);
      setPage(Page.Infiltration);
    },
    toWork: () => setPage(Page.Work),
    toBladeburnerCinematic: () => {
      setPage(Page.BladeburnerCinematic);
      setCinematicText(cinematicText);
    },
    toLocation: (location: Location) => {
      setLocation(location);
      setPage(Page.Location);
    },
    toStaneksGift: () => {
      setPage(Page.StaneksGift);
    },
    toAchievements: () => {
      setPage(Page.Achievements);
    },
    toThemeBrowser: () => {
      setPage(Page.ThemeBrowser);
    },
    toImportSave: (base64save: string, automatic = false) => {
      setImportString(base64save);
      setImportAutomatic(automatic);
      setPage(Page.ImportSave);
    },
  };

  useEffect(() => {
    // Wrap Router navigate functions to be able to disable the execution
    _functions(Router)
      .filter((fnName) => fnName.startsWith("to"))
      .forEach((fnName) => {
        // @ts-ignore - tslint does not like this, couldn't find a way to make it cooperate
        Router[fnName] = _wrap(Router[fnName], (func, ...args) => {
          if (!allowRoutingCalls) {
            // Let's just log to console.
            console.log(`Routing is currently disabled - Attempted router.${fnName}()`);
            return;
          }

          // Call the function normally
          return func(...args);
        });
      });
  });

  useEffect(() => {
    if (page !== Page.Terminal) window.scrollTo(0, 0);
  });

  function softReset(): void {
    dialogBoxCreate("Soft Reset!");
    installAugmentations(true);
    resetErrorBoundary();
    Router.toTerminal();
  }

  let mainPage = <Typography>Cannot load</Typography>;
  let withSidebar = true;
  let withPopups = true;
  let bypassGame = false;
  switch (page) {
    case Page.Recovery: {
      mainPage = <RecoveryRoot router={Router} softReset={softReset} />;
      withSidebar = false;
      withPopups = false;
      bypassGame = true;
      break;
    }
    case Page.BitVerse: {
      mainPage = <BitverseRoot flume={flume} enter={enterBitNode} quick={quick} />;
      withSidebar = false;
      withPopups = false;
      break;
    }
    case Page.Infiltration: {
      mainPage = <InfiltrationRoot location={location} />;
      withSidebar = false;
      withPopups = false;
      break;
    }
    case Page.BladeburnerCinematic: {
      mainPage = <BladeburnerCinematic />;
      withSidebar = false;
      withPopups = false;
      break;
    }
    case Page.Work: {
      mainPage = <WorkInProgressRoot />;
      withSidebar = false;
      break;
    }
    case Page.Terminal: {
      mainPage = <TerminalRoot terminal={terminal} router={Router} player={player} />;
      break;
    }
    case Page.Sleeves: {
      mainPage = <SleeveRoot />;
      break;
    }
    case Page.StaneksGift: {
      mainPage = <StaneksGiftRoot staneksGift={staneksGift} />;
      break;
    }
    case Page.Stats: {
      mainPage = <CharacterStats />;
      break;
    }
    case Page.ScriptEditor: {
      mainPage = (
        <ScriptEditorRoot
          files={files}
          hostname={player.getCurrentServer().hostname}
          player={player}
          router={Router}
          vim={vim}
        />
      );
      break;
    }
    case Page.ActiveScripts: {
      mainPage = <ActiveScriptsRoot workerScripts={workerScripts} />;
      break;
    }
    case Page.Hacknet: {
      mainPage = <HacknetRoot player={player} />;
      break;
    }
    case Page.CreateProgram: {
      mainPage = <ProgramsRoot />;
      break;
    }
    case Page.Factions: {
      mainPage = <FactionsRoot player={player} router={Router} />;
      break;
    }
    case Page.Faction: {
      mainPage = <FactionRoot faction={faction} augPage={augPage} />;
      break;
    }
    case Page.Milestones: {
      mainPage = <MilestonesRoot player={player} />;
      break;
    }
    case Page.Tutorial: {
      mainPage = (
        <TutorialRoot
          reactivateTutorial={() => {
            prestigeAugmentation();
            Router.toTerminal();
            iTutorialStart();
          }}
        />
      );
      break;
    }
    case Page.DevMenu: {
      mainPage = <DevMenuRoot player={player} engine={engine} router={Router} />;
      break;
    }
    case Page.Gang: {
      mainPage = <GangRoot />;
      break;
    }
    case Page.Corporation: {
      mainPage = <CorporationRoot />;
      break;
    }
    case Page.Bladeburner: {
      mainPage = <BladeburnerRoot />;
      break;
    }
    case Page.Grafting: {
      mainPage = <GraftingRoot />;
      break;
    }
    case Page.Travel: {
      mainPage = <TravelAgencyRoot p={player} router={Router} />;
      break;
    }
    case Page.StockMarket: {
      mainPage = (
        <StockMarketRoot
          buyStockLong={buyStock}
          buyStockShort={shortStock}
          cancelOrder={cancelOrder}
          eventEmitterForReset={eventEmitterForUiReset}
          initStockMarket={initStockMarketFn}
          p={player}
          placeOrder={placeOrder}
          sellStockLong={sellStock}
          sellStockShort={sellShort}
          stockMarket={StockMarket}
        />
      );
      break;
    }
    case Page.City: {
      mainPage = <LocationCity />;
      break;
    }
    case Page.Job:
    case Page.Location: {
      mainPage = <GenericLocation loc={location} />;
      break;
    }
    case Page.Options: {
      mainPage = (
        <GameOptionsRoot
          player={player}
          router={Router}
          save={() => saveObject.saveGame()}
          export={() => {
            // Apply the export bonus before saving the game
            onExport(player);
            saveObject.exportGame();
          }}
          forceKill={killAllScripts}
          softReset={softReset}
        />
      );
      break;
    }
    case Page.Augmentations: {
      mainPage = (
        <AugmentationsRoot
          exportGameFn={() => {
            // Apply the export bonus before saving the game
            onExport(player);
            saveObject.exportGame();
          }}
          installAugmentationsFn={() => {
            installAugmentations();
          }}
        />
      );
      break;
    }
    case Page.Achievements: {
      mainPage = <AchievementsRoot />;
      break;
    }
    case Page.ThemeBrowser: {
      mainPage = <ThemeBrowser router={Router} />;
      break;
    }
    case Page.ImportSave: {
      mainPage = <ImportSaveRoot importString={importString} automatic={importAutomatic} router={Router} />;
      withSidebar = false;
      withPopups = false;
      bypassGame = true;
    }
  }

  return (
    <Context.Player.Provider value={player}>
      <Context.Router.Provider value={Router}>
        <ErrorBoundary key={errorBoundaryKey} router={Router} softReset={softReset}>
          <BypassWrapper content={bypassGame ? mainPage : null}>
            <SnackbarProvider>
              <Overview mode={ITutorial.isRunning ? "tutorial" : "overview"}>
                {!ITutorial.isRunning ? (
                  <CharacterOverview save={() => saveObject.saveGame()} killScripts={killAllScripts} />
                ) : (
                  <InteractiveTutorialRoot />
                )}
              </Overview>
              {withSidebar ? (
                <Box display="flex" flexDirection="row" width="100%">
                  <SidebarRoot
                    player={player}
                    router={Router}
                    page={page}
                    opened={sidebarOpened}
                    onToggled={(isOpened) => {
                      setSideBarOpened(isOpened);
                      Settings.IsSidebarOpened = isOpened;
                    }}
                  />
                  <Box className={classes.root}>{mainPage}</Box>
                </Box>
              ) : (
                <Box className={classes.root}>{mainPage}</Box>
              )}
              <Unclickable />
              {withPopups && (
                <>
                  <LogBoxManager />
                  <AlertManager />
                  <PromptManager />
                  <InvitationModal />
                  <Snackbar />
                </>
              )}
              <Apr1 />
            </SnackbarProvider>
          </BypassWrapper>
        </ErrorBoundary>
      </Context.Router.Provider>
    </Context.Player.Provider>
  );
}
