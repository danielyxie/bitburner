import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { createStyles, makeStyles, useTheme, Theme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import Collapse from "@material-ui/core/Collapse";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";

import { Theme as BBTheme, colors } from "../../ui/React/Theme";

import ComputerIcon from "@material-ui/icons/Computer";
import LastPageIcon from "@material-ui/icons/LastPage"; // Terminal
import CreateIcon from "@material-ui/icons/Create"; // Create Script
import StorageIcon from "@material-ui/icons/Storage"; // Active Scripts
import BugReportIcon from "@material-ui/icons/BugReport"; // Create Program
import EqualizerIcon from "@material-ui/icons/Equalizer"; // Stats
import ContactsIcon from "@material-ui/icons/Contacts"; // Factions
import DoubleArrowIcon from "@material-ui/icons/DoubleArrow"; // Augmentations
import AccountTreeIcon from "@material-ui/icons/AccountTree"; // Hacknet
import PeopleAltIcon from "@material-ui/icons/PeopleAlt"; // Sleeves
import LocationCityIcon from "@material-ui/icons/LocationCity"; // City
import AirplanemodeActiveIcon from "@material-ui/icons/AirplanemodeActive"; // Travel
import WorkIcon from "@material-ui/icons/Work"; // Job
import TrendingUpIcon from "@material-ui/icons/TrendingUp"; // Stock Market
import FormatBoldIcon from "@material-ui/icons/FormatBold"; // Bladeburner
import BusinessIcon from "@material-ui/icons/Business"; // Corp
import SportsMmaIcon from "@material-ui/icons/SportsMma"; // Gang
import CheckIcon from "@material-ui/icons/Check"; // Milestones
import HelpIcon from "@material-ui/icons/Help"; // Tutorial
import SettingsIcon from "@material-ui/icons/Settings"; // options
import DeveloperBoardIcon from "@material-ui/icons/DeveloperBoard"; // Dev
// import MemoryIcon from "@material-ui/icons/Memory";
// import ShareIcon from "@material-ui/icons/Share";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import PublicIcon from "@material-ui/icons/Public";
import LiveHelpIcon from "@material-ui/icons/LiveHelp";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import { IEngine } from "../../IEngine";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { CONSTANTS } from "../../Constants";
import { iTutorialSteps, iTutorialNextStep, ITutorial } from "../../InteractiveTutorial";
import { getAvailableCreatePrograms } from "../../Programs/ProgramHelpers";
import { Settings } from "../../Settings/Settings";
import { redPillFlag } from "../../RedPill";

import { inMission } from "../../Missions";
import { cinematicTextFlag } from "../../CinematicText";
import { KEY } from "../../../utils/helpers/keyCodes";
import { FconfSettings } from "../../Fconf/FconfSettings";
import { Page, routing } from "../../ui/navigationTracking";

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: "nowrap",
    },
    drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: "hidden",
      width: theme.spacing(7) + 1,
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9) + 1,
      },
    },
    active: {
      borderLeft: "3px solid " + colors.primary,
    },
  }),
);

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
    const id = setInterval(rerender, 200);
    return () => clearInterval(id);
  }, []);

  const [activeTab, setActiveTab] = useState("Terminal");
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

  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const toggleDrawer = () => setOpen((old) => !old);
  return (
    <BBTheme>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <ListItem button onClick={toggleDrawer}>
          <ListItemIcon>{!open ? <ChevronRightIcon /> : <ChevronLeftIcon />}</ListItemIcon>
          <ListItemText primary={<Typography color="primary">Bitburner {CONSTANTS.Version}</Typography>} />
        </ListItem>
        <Divider />
        <List>
          <ListItem button onClick={() => setHackingOpen((old) => !old)}>
            <ListItemIcon>
              <ComputerIcon />
            </ListItemIcon>
            <ListItemText primary={<Typography color="primary">Hacking</Typography>} />
            {hackingOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItem>
          <Collapse in={hackingOpen} timeout="auto" unmountOnExit>
            <List>
              <ListItem
                button
                key={"Terminal"}
                className={clsx({
                  [classes.active]: activeTab === "Terminal",
                })}
                onClick={clickTerminal}
              >
                <ListItemIcon>
                  <LastPageIcon color={flashTerminal ? "error" : activeTab !== "Terminal" ? "secondary" : "primary"} />
                </ListItemIcon>
                <ListItemText>
                  <Typography color={flashTerminal ? "error" : activeTab !== "Terminal" ? "secondary" : "primary"}>
                    Terminal
                  </Typography>
                </ListItemText>
              </ListItem>
              <ListItem
                button
                key={"Create Scripts"}
                className={clsx({
                  [classes.active]: activeTab === "CreateScripts",
                })}
                onClick={clickCreateScripts}
              >
                <ListItemIcon>
                  <CreateIcon color={activeTab !== "CreateScripts" ? "secondary" : "primary"} />
                </ListItemIcon>
                <ListItemText>
                  <Typography color={activeTab !== "CreateScripts" ? "secondary" : "primary"}>Create Script</Typography>
                </ListItemText>
              </ListItem>
              <ListItem
                button
                key={"Active Scripts"}
                className={clsx({
                  [classes.active]: activeTab === "ActiveScripts",
                })}
                onClick={clickActiveScripts}
              >
                <ListItemIcon>
                  <StorageIcon
                    color={flashActiveScripts ? "error" : activeTab !== "ActiveScripts" ? "secondary" : "primary"}
                  />
                </ListItemIcon>
                <ListItemText>
                  <Typography
                    color={flashActiveScripts ? "error" : activeTab !== "ActiveScripts" ? "secondary" : "primary"}
                  >
                    Active Scripts
                  </Typography>
                </ListItemText>
              </ListItem>
              {canCreateProgram && (
                <ListItem
                  button
                  key={"Create Program"}
                  className={clsx({
                    [classes.active]: activeTab === "CreateProgram",
                  })}
                  onClick={clickCreateProgram}
                >
                  <ListItemIcon>
                    <BugReportIcon color={activeTab !== "CreateProgram" ? "secondary" : "primary"} />
                  </ListItemIcon>
                  <ListItemText>
                    <Typography color={activeTab !== "CreateProgram" ? "secondary" : "primary"}>
                      Create Program
                    </Typography>
                  </ListItemText>
                </ListItem>
              )}
            </List>
          </Collapse>

          <Divider />
          <ListItem button onClick={() => setCharacterOpen((old) => !old)}>
            <ListItemIcon>
              <AccountBoxIcon />
            </ListItemIcon>
            <ListItemText primary={<Typography color="primary">Character</Typography>} />
            {characterOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItem>
          <Collapse in={characterOpen} timeout="auto" unmountOnExit>
            <ListItem
              button
              key={"Stats"}
              className={clsx({
                [classes.active]: activeTab === "Stats",
              })}
              onClick={clickStats}
            >
              <ListItemIcon>
                <EqualizerIcon color={flashStats ? "error" : activeTab !== "Stats" ? "secondary" : "primary"} />
              </ListItemIcon>
              <ListItemText>
                <Typography color={flashStats ? "error" : activeTab !== "Stats" ? "secondary" : "primary"}>
                  Stats
                </Typography>
              </ListItemText>
            </ListItem>
            {canOpenFactions && (
              <ListItem
                button
                key={"Factions"}
                className={clsx({
                  [classes.active]: activeTab === "Factions",
                })}
                onClick={clickFactions}
              >
                <ListItemIcon>
                  <ContactsIcon color={activeTab !== "Factions" ? "secondary" : "primary"} />
                </ListItemIcon>
                <ListItemText>
                  <Typography color={activeTab !== "Factions" ? "secondary" : "primary"}>Factions</Typography>
                </ListItemText>
              </ListItem>
            )}
            {canOpenAugmentations && (
              <ListItem
                button
                key={"Augmentations"}
                className={clsx({
                  [classes.active]: activeTab === "Augmentations",
                })}
                onClick={clickAugmentations}
              >
                <ListItemIcon>
                  <DoubleArrowIcon
                    style={{ transform: "rotate(-90deg)" }}
                    color={activeTab !== "Augmentations" ? "secondary" : "primary"}
                  />
                </ListItemIcon>
                <ListItemText>
                  <Typography color={activeTab !== "Augmentations" ? "secondary" : "primary"}>Augmentations</Typography>
                </ListItemText>
              </ListItem>
            )}
            <ListItem
              button
              key={"Hacknet"}
              className={clsx({
                [classes.active]: activeTab === "Hacknet",
              })}
              onClick={clickHacknet}
            >
              <ListItemIcon>
                <AccountTreeIcon color={flashHacknet ? "error" : activeTab !== "Hacknet" ? "secondary" : "primary"} />
              </ListItemIcon>
              <ListItemText>
                <Typography color={flashHacknet ? "error" : activeTab !== "Hacknet" ? "secondary" : "primary"}>
                  Hacknet
                </Typography>
              </ListItemText>
            </ListItem>
            {canOpenSleeves && (
              <ListItem
                button
                key={"Sleeves"}
                className={clsx({
                  [classes.active]: activeTab === "Sleeves",
                })}
                onClick={clickSleeves}
              >
                <ListItemIcon>
                  <PeopleAltIcon color={activeTab !== "Sleeves" ? "secondary" : "primary"} />
                </ListItemIcon>
                <ListItemText>
                  <Typography color={activeTab !== "Sleeves" ? "secondary" : "primary"}>Sleeves</Typography>
                </ListItemText>
              </ListItem>
            )}
          </Collapse>

          <Divider />
          <ListItem button onClick={() => setWorldOpen((old) => !old)}>
            <ListItemIcon>
              <PublicIcon />
            </ListItemIcon>
            <ListItemText primary={<Typography color="primary">World</Typography>} />
            {worldOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItem>
          <Collapse in={worldOpen} timeout="auto" unmountOnExit>
            <ListItem
              button
              key={"City"}
              className={clsx({
                [classes.active]: activeTab === "City",
              })}
              onClick={clickCity}
            >
              <ListItemIcon>
                <LocationCityIcon color={flashCity ? "error" : activeTab !== "City" ? "secondary" : "primary"} />
              </ListItemIcon>
              <ListItemText>
                <Typography color={flashCity ? "error" : activeTab !== "City" ? "secondary" : "primary"}>
                  City
                </Typography>
              </ListItemText>
            </ListItem>
            <ListItem
              button
              key={"Travel"}
              className={clsx({
                [classes.active]: activeTab === "Travel",
              })}
              onClick={clickTravel}
            >
              <ListItemIcon>
                <AirplanemodeActiveIcon color={activeTab !== "Travel" ? "secondary" : "primary"} />
              </ListItemIcon>
              <ListItemText>
                <Typography color={activeTab !== "Travel" ? "secondary" : "primary"}>Travel</Typography>
              </ListItemText>
            </ListItem>
            {canJob && (
              <ListItem
                button
                key={"Job"}
                className={clsx({
                  [classes.active]: activeTab === "Job",
                })}
                onClick={clickJob}
              >
                <ListItemIcon>
                  <WorkIcon color={activeTab !== "Job" ? "secondary" : "primary"} />
                </ListItemIcon>
                <ListItemText>
                  <Typography color={activeTab !== "Job" ? "secondary" : "primary"}>Job</Typography>
                </ListItemText>
              </ListItem>
            )}
            {canStockMarket && (
              <ListItem
                button
                key={"Stock Market"}
                className={clsx({
                  [classes.active]: activeTab === "StockMarket",
                })}
                onClick={clickStockMarket}
              >
                <ListItemIcon>
                  <TrendingUpIcon color={activeTab !== "StockMarket" ? "secondary" : "primary"} />
                </ListItemIcon>
                <ListItemText>
                  <Typography color={activeTab !== "StockMarket" ? "secondary" : "primary"}>Stock Market</Typography>
                </ListItemText>
              </ListItem>
            )}
            {canBladeburner && (
              <ListItem
                button
                key={"Bladeburner"}
                className={clsx({
                  [classes.active]: activeTab === "Bladeburner",
                })}
                onClick={clickBladeburner}
              >
                <ListItemIcon>
                  <FormatBoldIcon color={activeTab !== "Bladeburner" ? "secondary" : "primary"} />
                </ListItemIcon>
                <ListItemText>
                  <Typography color={activeTab !== "Bladeburner" ? "secondary" : "primary"}>Bladeburner</Typography>
                </ListItemText>
              </ListItem>
            )}
            {canCorporation && (
              <ListItem
                button
                key={"Corp"}
                className={clsx({
                  [classes.active]: activeTab === "Corp",
                })}
                onClick={clickCorp}
              >
                <ListItemIcon>
                  <BusinessIcon color={activeTab !== "Corp" ? "secondary" : "primary"} />
                </ListItemIcon>
                <ListItemText>
                  <Typography color={activeTab !== "Corp" ? "secondary" : "primary"}>Corp</Typography>
                </ListItemText>
              </ListItem>
            )}
            {canGang && (
              <ListItem
                button
                key={"Gang"}
                className={clsx({
                  [classes.active]: activeTab === "Gang",
                })}
                onClick={clickGang}
              >
                <ListItemIcon>
                  <SportsMmaIcon color={activeTab !== "Gang" ? "secondary" : "primary"} />
                </ListItemIcon>
                <ListItemText>
                  <Typography color={activeTab !== "Gang" ? "secondary" : "primary"}>Gang</Typography>
                </ListItemText>
              </ListItem>
            )}
          </Collapse>

          <Divider />
          <ListItem button onClick={() => setHelpOpen((old) => !old)}>
            <ListItemIcon>
              <LiveHelpIcon />
            </ListItemIcon>
            <ListItemText primary={<Typography color="primary">Help</Typography>} />
            {helpOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItem>
          <Collapse in={helpOpen} timeout="auto" unmountOnExit>
            <ListItem
              button
              key={"Milestones"}
              className={clsx({
                [classes.active]: activeTab === "Milestones",
              })}
              onClick={clickMilestones}
            >
              <ListItemIcon>
                <CheckIcon color={activeTab !== "Milestones" ? "secondary" : "primary"} />
              </ListItemIcon>
              <ListItemText>
                <Typography color={activeTab !== "Milestones" ? "secondary" : "primary"}>Milestones</Typography>
              </ListItemText>
            </ListItem>
            <ListItem
              button
              key={"Tutorial"}
              className={clsx({
                [classes.active]: activeTab === "Tutorial",
              })}
              onClick={clickTutorial}
            >
              <ListItemIcon>
                <HelpIcon color={flashTutorial ? "error" : activeTab !== "Tutorial" ? "secondary" : "primary"} />
              </ListItemIcon>
              <ListItemText>
                <Typography color={flashTutorial ? "error" : activeTab !== "Tutorial" ? "secondary" : "primary"}>
                  Tutorial
                </Typography>
              </ListItemText>
            </ListItem>
            {/*<ListItem
              button
              key={"Options"}
              className={clsx({
                [classes.active]: activeTab === "Options",
              })}
            >
              <ListItemIcon>
                <SettingsIcon color={activeTab !== "Options" ? "secondary" : "primary"} />
              </ListItemIcon>
              <ListItemText>
                <Typography color={activeTab !== "Options" ? "secondary" : "primary"}>options</Typography>
              </ListItemText>
            </ListItem>*/}
            {process.env.NODE_ENV === "development" && (
              <ListItem
                button
                key={"Dev"}
                className={clsx({
                  [classes.active]: activeTab === "Dev",
                })}
                onClick={clickDev}
              >
                <ListItemIcon>
                  <DeveloperBoardIcon color={activeTab !== "Dev" ? "secondary" : "primary"} />
                </ListItemIcon>
                <ListItemText>
                  <Typography color={activeTab !== "Dev" ? "secondary" : "primary"}>Dev</Typography>
                </ListItemText>
              </ListItem>
            )}
          </Collapse>
        </List>
      </Drawer>
    </BBTheme>
  );
}
