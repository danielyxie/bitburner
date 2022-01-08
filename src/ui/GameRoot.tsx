import React, { useState, useEffect } from "react";

import { IPlayer } from "../PersonObjects/IPlayer";
import { IEngine } from "../IEngine";
import { ITerminal } from "../Terminal/ITerminal";
import { installAugmentations } from "../Augmentation/AugmentationHelpers";
import { saveObject } from "../SaveObject";
import { onExport } from "../ExportBonus";
import { LocationName } from "../Locations/data/LocationNames";
import { Location } from "../Locations/Location";
import { Locations } from "../Locations/Locations";
import { ITutorial, iTutorialStart } from "../InteractiveTutorial";
import { InteractiveTutorialRoot } from "./InteractiveTutorial/InteractiveTutorialRoot";
import { ITutorialEvents } from "./InteractiveTutorial/ITutorialEvents";

import { Faction } from "../Faction/Faction";
import { prestigeAugmentation } from "../Prestige";
import { dialogBoxCreate } from "./React/DialogBox";
import { GetAllServers } from "../Server/AllServers";
import { Factions } from "../Faction/Factions";
import { buyStock, sellStock, shortStock, sellShort } from "../StockMarket/BuyingAndSelling";
import {
  cancelOrder,
  eventEmitterForUiReset,
  initStockMarketFnForReact,
  placeOrder,
  StockMarket,
} from "../StockMarket/StockMarket";

import { Theme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import createStyles from "@mui/styles/createStyles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { Page, IRouter, ScriptEditorRouteOptions } from "./Router";
import { Overview } from "./React/Overview";
import { SidebarRoot } from "../Sidebar/ui/SidebarRoot";
import { AugmentationsRoot } from "../Augmentation/ui/AugmentationsRoot";
import { DevMenuRoot } from "../DevMenu";
import { BladeburnerRoot } from "../Bladeburner/ui/BladeburnerRoot";
import { GangRoot } from "../Gang/ui/GangRoot";
import { CorporationRoot } from "../Corporation/ui/CorporationRoot";
import { InfiltrationRoot } from "../Infiltration/ui/InfiltrationRoot";
import { ResleeveRoot } from "../PersonObjects/Resleeving/ui/ResleeveRoot";
import { WorkInProgressRoot } from "./WorkInProgressRoot";
import { GameOptionsRoot } from "../ui/React/GameOptionsRoot";
import { SleeveRoot } from "../PersonObjects/Sleeve/ui/SleeveRoot";
import { HacknetRoot } from "../Hacknet/ui/HacknetRoot";
import { GenericLocation } from "../Locations/ui/GenericLocation";
import { LocationCity } from "../Locations/ui/City";
import { ProgramsRoot } from "../Programs/ui/ProgramsRoot";
import { Root as ScriptEditorRoot } from "../ScriptEditor/ui/ScriptEditorRoot";
import { MilestonesRoot } from "../Milestones/ui/MilestonesRoot";
import { TerminalRoot } from "../Terminal/ui/TerminalRoot";
import { TutorialRoot } from "../Tutorial/ui/TutorialRoot";
import { ActiveScriptsRoot } from "../ui/ActiveScripts/ActiveScriptsRoot";
import { FactionsRoot } from "../Faction/ui/FactionsRoot";
import { FactionRoot } from "../Faction/ui/FactionRoot";
import { CharacterStats } from "./CharacterStats";
import { TravelAgencyRoot } from "../Locations/ui/TravelAgencyRoot";
import { StockMarketRoot } from "../StockMarket/ui/StockMarketRoot";
import { BitverseRoot } from "../BitNode/ui/BitverseRoot";
import { StaneksGiftRoot } from "../CotMG/ui/StaneksGiftRoot";
import { staneksGift } from "../CotMG/Helper";
import { CharacterOverview } from "./React/CharacterOverview";
import { BladeburnerCinematic } from "../Bladeburner/ui/BladeburnerCinematic";
import { workerScripts } from "../Netscript/WorkerScripts";
import { Unclickable } from "../Exploits/Unclickable";
import { Snackbar, SnackbarProvider } from "./React/Snackbar";
import { LogBoxManager } from "./React/LogBoxManager";
import { AlertManager } from "./React/AlertManager";
import { PromptManager } from "./React/PromptManager";
import { InvitationModal } from "../Faction/ui/InvitationModal";

import { enterBitNode } from "../RedPill";
import { Context } from "./Context";
import { RecoveryMode, RecoveryRoot } from "./React/RecoveryRoot";

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
    },
  }),
);

export let Router: IRouter = {
  page: () => {
    throw new Error("Router called before initialization");
  },
  toActiveScripts: () => {
    throw new Error("Router called before initialization");
  },
  toAugmentations: () => {
    throw new Error("Router called before initialization");
  },
  toBitVerse: () => {
    throw new Error("Router called before initialization");
  },
  toBladeburner: () => {
    throw new Error("Router called before initialization");
  },
  toStats: () => {
    throw new Error("Router called before initialization");
  },
  toCity: () => {
    throw new Error("Router called before initialization");
  },
  toCorporation: () => {
    throw new Error("Router called before initialization");
  },
  toCreateProgram: () => {
    throw new Error("Router called before initialization");
  },
  toDevMenu: () => {
    throw new Error("Router called before initialization");
  },
  toFaction: () => {
    throw new Error("Router called before initialization");
  },
  toFactions: () => {
    throw new Error("Router called before initialization");
  },
  toGameOptions: () => {
    throw new Error("Router called before initialization");
  },
  toGang: () => {
    throw new Error("Router called before initialization");
  },
  toHacknetNodes: () => {
    throw new Error("Router called before initialization");
  },
  toInfiltration: () => {
    throw new Error("Router called before initialization");
  },
  toJob: () => {
    throw new Error("Router called before initialization");
  },
  toMilestones: () => {
    throw new Error("Router called before initialization");
  },
  toResleeves: () => {
    throw new Error("Router called before initialization");
  },
  toScriptEditor: () => {
    throw new Error("Router called before initialization");
  },
  toSleeves: () => {
    throw new Error("Router called before initialization");
  },
  toStockMarket: () => {
    throw new Error("Router called before initialization");
  },
  toTerminal: () => {
    throw new Error("Router called before initialization");
  },
  toTravel: () => {
    throw new Error("Router called before initialization");
  },
  toTutorial: () => {
    throw new Error("Router called before initialization");
  },
  toWork: () => {
    throw new Error("Router called before initialization");
  },
  toBladeburnerCinematic: () => {
    throw new Error("Router called before initialization");
  },
  toLocation: () => {
    throw new Error("Router called before initialization");
  },
  toStaneksGift: () => {
    throw new Error("Router called before initialization");
  },
};

function determineStartPage(player: IPlayer): Page {
  if (RecoveryMode) return Page.Recovery;
  if (player.isWorking) return Page.Work;
  return Page.Terminal;
}

export function GameRoot({ player, engine, terminal }: IProps): React.ReactElement {
  const classes = useStyles();
  const [{files, vim}, setEditorOptions] = useState({files: {}, vim: false})
  const [page, setPage] = useState(determineStartPage(player));
  const setRerender = useState(0)[1];
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
    page: () => page,
    toActiveScripts: () => setPage(Page.ActiveScripts),
    toAugmentations: () => setPage(Page.Augmentations),
    toBladeburner: () => setPage(Page.Bladeburner),
    toStats: () => setPage(Page.Stats),
    toCorporation: () => setPage(Page.Corporation),
    toCreateProgram: () => setPage(Page.CreateProgram),
    toDevMenu: () => setPage(Page.DevMenu),
    toFaction: (faction?: Faction) => {
      setPage(Page.Faction);
      if (faction) setFaction(faction);
    },
    toFactions: () => setPage(Page.Factions),
    toGameOptions: () => setPage(Page.Options),
    toGang: () => setPage(Page.Gang),
    toHacknetNodes: () => setPage(Page.Hacknet),
    toMilestones: () => setPage(Page.Milestones),
    toResleeves: () => setPage(Page.Resleeves),
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
  };

  useEffect(() => {
    if (page !== Page.Terminal) window.scrollTo(0, 0);
  });

  let mainPage = <Typography>Cannot load</Typography>;
  let withSidebar = true;
  switch (page) {
    case Page.Recovery: {
      mainPage = <RecoveryRoot router={Router} />;
      withSidebar = false;
      break;
    }
    case Page.BitVerse: {
      mainPage = <BitverseRoot flume={flume} enter={enterBitNode} quick={quick} />;
      withSidebar = false;
      break
    }
    case Page.Infiltration: {
      mainPage = <InfiltrationRoot location={location} />;
      withSidebar = false;
      break;
    }
    case Page.BladeburnerCinematic: {
      mainPage = <BladeburnerCinematic />;
      withSidebar = false;
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
      mainPage = <ScriptEditorRoot
        files={files}
        hostname={player.getCurrentServer().hostname}
        player={player}
        router={Router}
        vim={vim}
      />;
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
      mainPage = <FactionRoot faction={faction} />;
      break;
    }
    case Page.Milestones: {
      mainPage = <MilestonesRoot player={player} />;
      break;
    }
    case Page.Tutorial: {
      mainPage = <TutorialRoot
        reactivateTutorial={() => {
          prestigeAugmentation();
          Router.toTerminal();
          iTutorialStart();
        }}
      />;
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
    case Page.Resleeves: {
      mainPage = <ResleeveRoot />;
      break;
    }
    case Page.Travel: {
      mainPage = <TravelAgencyRoot p={player} router={Router} />;
      break;
    }
    case Page.StockMarket: {
      mainPage = <StockMarketRoot
        buyStockLong={buyStock}
        buyStockShort={shortStock}
        cancelOrder={cancelOrder}
        eventEmitterForReset={eventEmitterForUiReset}
        initStockMarket={initStockMarketFnForReact}
        p={player}
        placeOrder={placeOrder}
        sellStockLong={sellStock}
        sellStockShort={sellShort}
        stockMarket={StockMarket}
      />;
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
      mainPage = <GameOptionsRoot
        player={player}
        save={() => saveObject.saveGame()}
        export={() => {
          // Apply the export bonus before saving the game
          onExport(player);
          saveObject.exportGame()
        }}
        forceKill={killAllScripts}
        softReset={() => {
          dialogBoxCreate("Soft Reset!");
          prestigeAugmentation();
          Router.toTerminal();
        }}
      />;
      break;
    }
    case Page.Augmentations: {
      mainPage = <AugmentationsRoot
        exportGameFn={() => {
          // Apply the export bonus before saving the game
          onExport(player);
          saveObject.exportGame();
        }}
        installAugmentationsFn={() => {
          installAugmentations();
          Router.toTerminal();
        }}
      />;
      break;
    }
  }

  const renderPopups = [Page.Recovery, Page.BitVerse, Page.Infiltration, Page.BladeburnerCinematic].includes(page);
  return (
    <Context.Player.Provider value={player}>
      <Context.Router.Provider value={Router}>
        <SnackbarProvider>
          <Overview>
            {!ITutorial.isRunning ? (
              <CharacterOverview save={() => saveObject.saveGame()} killScripts={killAllScripts} />
            ) : (
              <InteractiveTutorialRoot />
            )}
          </Overview>
          {withSidebar ? (
            <Box display="flex" flexDirection="row" width="100%">
              <SidebarRoot player={player} router={Router} page={page} />
              <Box className={classes.root} flexGrow={1} display="block" px={1} min-height="100vh">
                {mainPage}
              </Box>
            </Box>
          ) : mainPage }
          <Unclickable />
          {renderPopups && (
            <>
            <LogBoxManager />
            <AlertManager />
            <PromptManager />
            <InvitationModal />
            <Snackbar />
            </>
          )}
        </SnackbarProvider>
      </Context.Router.Provider>
    </Context.Player.Provider>
  );
}


/*
{page === Page.Recovery ? (
  <RecoveryRoot router={Router} />
) : page === Page.BitVerse ? (
  <BitverseRoot flume={flume} enter={enterBitNode} quick={quick} />
) : page === Page.Infiltration ? (
  <InfiltrationRoot location={location} />
) : page === Page.BladeburnerCinematic ? (
  <BladeburnerCinematic />
) : page === Page.Work ? (
  <WorkInProgressRoot />
) : (
  <Box display="flex" flexDirection="row" width="100%">
    <SidebarRoot player={player} router={Router} page={page} />
    <Box className={classes.root} flexGrow={1} display="block" px={1} min-height="100vh">
      {page === Page.Terminal ? (
        <TerminalRoot terminal={terminal} router={Router} player={player} />
      ) : page === Page.Sleeves ? (
        <SleeveRoot />
      ) : page === Page.StaneksGift ? (
        <StaneksGiftRoot staneksGift={staneksGift} />
      ) : page === Page.Stats ? (
        <CharacterStats />
      ) : page === Page.ScriptEditor ? (
        <ScriptEditorRoot
          files={files}
          hostname={player.getCurrentServer().hostname}
          player={player}
          router={Router}
          vim={vim}
        />
      ) : page === Page.ActiveScripts ? (
        <ActiveScriptsRoot workerScripts={workerScripts} />
      ) : page === Page.Hacknet ? (
        <HacknetRoot player={player} />
      ) : page === Page.CreateProgram ? (
        <ProgramsRoot />
      ) : page === Page.Factions ? (
        <FactionsRoot player={player} router={Router} />
      ) : page === Page.Faction ? (
        <FactionRoot faction={faction} />
      ) : page === Page.Milestones ? (
        <MilestonesRoot player={player} />
      ) : page === Page.Tutorial ? (
        <TutorialRoot
          reactivateTutorial={() => {
            prestigeAugmentation();
            Router.toTerminal();
            iTutorialStart();
          }}
        />
      ) : page === Page.DevMenu ? (
        <DevMenuRoot player={player} engine={engine} router={Router} />
      ) : page === Page.Gang ? (
        <GangRoot />
      ) : page === Page.Corporation ? (
        <CorporationRoot />
      ) : page === Page.Bladeburner ? (
        <BladeburnerRoot />
      ) : page === Page.Resleeves ? (
        <ResleeveRoot />
      ) : page === Page.Travel ? (
        <TravelAgencyRoot p={player} router={Router} />
      ) : page === Page.StockMarket ? (
        <StockMarketRoot
          buyStockLong={buyStock}
          buyStockShort={shortStock}
          cancelOrder={cancelOrder}
          eventEmitterForReset={eventEmitterForUiReset}
          initStockMarket={initStockMarketFnForReact}
          p={player}
          placeOrder={placeOrder}
          sellStockLong={sellStock}
          sellStockShort={sellShort}
          stockMarket={StockMarket}
        />
      ) : page === Page.City ? (
        <LocationCity />
      ) : page === Page.Job ? (
        <GenericLocation loc={location} />
      ) : page === Page.Location ? (
        <GenericLocation loc={location} />
      ) : page === Page.Options ? (
        <GameOptionsRoot
          player={player}
          save={() => saveObject.saveGame()}
          export={() => {
            // Apply the export bonus before saving the game
            onExport(player);
            saveObject.exportGame()
          }}
          forceKill={killAllScripts}
          softReset={() => {
            dialogBoxCreate("Soft Reset!");
            prestigeAugmentation();
            Router.toTerminal();
          }}
        />
      ) : page === Page.Augmentations ? (
        <AugmentationsRoot
          exportGameFn={() => {
            // Apply the export bonus before saving the game
            onExport(player);
            saveObject.exportGame();
          }}
          installAugmentationsFn={() => {
            installAugmentations();
            Router.toTerminal();
          }}
        />
      ) : (
        <>
          <Typography>Cannot load</Typography>
        </>
      )}
    </Box>
  </Box>
)}
*/