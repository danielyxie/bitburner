import React, { useState, useEffect, useRef } from "react";

import { IPlayer } from "../PersonObjects/IPlayer";
import { IEngine } from "../IEngine";
import { ITerminal } from "../Terminal/ITerminal";
import { installAugmentations } from "../Augmentation/AugmentationHelpers";
import { saveObject } from "../SaveObject";
import { onExport } from "../ExportBonus";
import { LocationName } from "../Locations/data/LocationNames";
import { CityName } from "../Locations/data/CityNames";
import { Faction } from "../Faction/Faction";
import { prestigeAugmentation } from "../Prestige";
import { dialogBoxCreate } from "../../utils/DialogBox";
import { AllServers } from "../Server/AllServers";
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

import { Page, IRouter } from "./Router";
import { SidebarRoot } from "../Sidebar/ui/SidebarRoot";
import { AugmentationsRoot } from "../Augmentation/ui/Root";
import { DevMenuRoot } from "../DevMenu";
import { Root as BladeburnerRoot } from "../Bladeburner/ui/Root";
import { Root as GangRoot } from "../Gang/ui/Root";
import { CorporationRoot } from "../Corporation/ui/CorporationRoot";
import { ResleeveRoot } from "../PersonObjects/Resleeving/ui/ResleeveRoot";
import { GameOptionsRoot } from "../ui/React/GameOptionsRoot";
import { SleeveRoot } from "../PersonObjects/Sleeve/ui/SleeveRoot";
import { HacknetRoot } from "../Hacknet/ui/HacknetRoot";
import { LocationRoot } from "../Locations/ui/Root";
import { ProgramsRoot } from "../Programs/ui/ProgramsRoot";
import { Root as ScriptEditorRoot } from "../ScriptEditor/ui/Root";
import { MilestonesRoot } from "../Milestones/ui/MilestonesRoot";
import { TerminalRoot } from "../Terminal/ui/TerminalRoot";
import { TutorialRoot } from "../Tutorial/ui/TutorialRoot";
import { ActiveScriptsRoot } from "../ui/ActiveScripts/Root";
import { FactionsRoot } from "../Faction/ui/FactionsRoot";
import { FactionRoot } from "../Faction/ui/FactionRoot";
import { CharacterInfo } from "./CharacterInfo";
import { TravelAgencyRoot } from "../Locations/ui/TravelAgencyRoot";
import { StockMarketRoot } from "../StockMarket/ui/StockMarketRoot";
import { workerScripts } from "../Netscript/WorkerScripts";

import { startHackingMission } from "../Faction/FactionHelpers";

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
    },
  }),
);

let filename = "";
let code = "";

export function GameRoot({ player, engine, terminal }: IProps): React.ReactElement {
  const contentRef = useRef<HTMLDivElement>(null);
  const [faction, setFaction] = useState<Faction | null>(null);
  const [page, setPage] = useState(Page.Terminal);
  const classes = useStyles();

  const router = {
    toActiveScripts: () => setPage(Page.ActiveScripts),
    toAugmentations: () => setPage(Page.Augmentations),
    toBladeburner: () => setPage(Page.Bladeburner),
    toCharacterInfo: () => setPage(Page.Stats),
    toCorporation: () => setPage(Page.Corporation),
    toCreateProgram: () => setPage(Page.CreateProgram),
    toDevMenu: () => setPage(Page.DevMenu),
    toFaction: (faction: Faction) => {
      setPage(Page.Faction);
      setFaction(faction);
    },
    toFactions: () => setPage(Page.Factions),
    toGameOptions: () => setPage(Page.Options),
    toGang: () => setPage(Page.Gang),
    toHacknetNodes: () => setPage(Page.Hacknet),
    toMilestones: () => setPage(Page.Milestones),
    toResleeves: () => setPage(Page.Resleeves),
    toScriptEditor: (fn: string, c: string) => {
      filename = fn;
      code = c;
      setPage(Page.CreateScript);
    },
    toSleeves: () => setPage(Page.Sleeves),
    toStockMarket: () => setPage(Page.StockMarket),
    toTerminal: () => setPage(Page.Terminal),
    toTutorial: () => setPage(Page.Tutorial),
    toJob: () => {
      player.gotoLocation(player.companyName as LocationName);
      setPage(Page.Job);
    },
    toCity: () => {
      // TODO This is bad.
      player.gotoLocation(player.city as unknown as LocationName);
      setPage(Page.City);
    },
    toTravel: () => {
      player.gotoLocation(LocationName.TravelAgency);
      setPage(Page.Travel);
    },
  };

  useEffect(() => {
    filename = "";
    code = "";
  });

  return (
    <>
      <Box display="flex" flexDirection="row" width="100%">
        <SidebarRoot player={player} router={router} page={page} />
        <Box ref={contentRef} className={classes.root} flexGrow={1} display="block" width="100%" px={1} height="100vh">
          {page === Page.Terminal ? (
            <TerminalRoot terminal={terminal} router={router} player={player} />
          ) : page === Page.Sleeves ? (
            <SleeveRoot player={player} />
          ) : page === Page.Stats ? (
            <CharacterInfo player={player} />
          ) : page === Page.CreateScript ? (
            <ScriptEditorRoot filename={filename} code={code} player={player} router={router} />
          ) : page === Page.ActiveScripts ? (
            <ActiveScriptsRoot p={player} workerScripts={workerScripts} />
          ) : page === Page.Hacknet ? (
            <HacknetRoot player={player} />
          ) : page === Page.CreateProgram ? (
            <ProgramsRoot player={player} />
          ) : page === Page.Factions ? (
            <FactionsRoot player={player} router={router} />
          ) : page === Page.Faction ? (
            <FactionRoot engine={engine} faction={faction} p={player} startHackingMissionFn={startHackingMission} />
          ) : page === Page.Milestones ? (
            <MilestonesRoot player={player} />
          ) : page === Page.Tutorial ? (
            <TutorialRoot />
          ) : page === Page.DevMenu ? (
            <DevMenuRoot player={player} engine={engine} />
          ) : page === Page.Gang ? (
            <GangRoot engine={engine} gang={player.gang} player={player} />
          ) : page === Page.Corporation ? (
            <CorporationRoot corp={player.corporation} player={player} />
          ) : page === Page.Bladeburner ? (
            <BladeburnerRoot bladeburner={player.bladeburner} player={player} engine={engine} />
          ) : page === Page.Resleeves ? (
            <ResleeveRoot player={player} />
          ) : page === Page.Travel ? (
            <TravelAgencyRoot p={player} router={router} />
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
            <LocationRoot initiallyInCity={true} engine={engine} p={player} router={router} />
          ) : page === Page.Job ? (
            <LocationRoot initiallyInCity={false} engine={engine} p={player} router={router} />
          ) : page === Page.Options ? (
            <GameOptionsRoot
              player={player}
              save={() => saveObject.saveGame(engine.indexedDb)}
              delete={() => saveObject.deleteGame(engine.indexedDb)}
              export={() => saveObject.exportGame()}
              import={() => saveObject.importGame()}
              forceKill={() => {
                for (const hostname of Object.keys(AllServers)) {
                  AllServers[hostname].runningScripts = [];
                }
                dialogBoxCreate("Forcefully deleted all running scripts. Please save and refresh page.");
              }}
              softReset={() => {
                dialogBoxCreate("Soft Reset!");
                prestigeAugmentation();
              }}
            />
          ) : page === Page.Augmentations ? (
            <AugmentationsRoot
              exportGameFn={() => {
                saveObject.exportGame();
                onExport(player);
              }}
              installAugmentationsFn={installAugmentations}
            />
          ) : (
            <>
              <Typography>Cannot load</Typography>
            </>
          )}
        </Box>
      </Box>
    </>
  );
}
