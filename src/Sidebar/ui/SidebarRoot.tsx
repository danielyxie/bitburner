import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { styled, Theme, CSSObject } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Collapse from "@mui/material/Collapse";
import Badge from "@mui/material/Badge";

import ComputerIcon from "@mui/icons-material/Computer";
import LastPageIcon from "@mui/icons-material/LastPage"; // Terminal
import CreateIcon from "@mui/icons-material/Create"; // Create Script
import StorageIcon from "@mui/icons-material/Storage"; // Active Scripts
import BugReportIcon from "@mui/icons-material/BugReport"; // Create Program
import EqualizerIcon from "@mui/icons-material/Equalizer"; // Stats
import ContactsIcon from "@mui/icons-material/Contacts"; // Factions
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow"; // Augmentations
import AccountTreeIcon from "@mui/icons-material/AccountTree"; // Hacknet
import PeopleAltIcon from "@mui/icons-material/PeopleAlt"; // Sleeves
import LocationCityIcon from "@mui/icons-material/LocationCity"; // City
import AirplanemodeActiveIcon from "@mui/icons-material/AirplanemodeActive"; // Travel
import WorkIcon from "@mui/icons-material/Work"; // Job
import TrendingUpIcon from "@mui/icons-material/TrendingUp"; // Stock Market
import FormatBoldIcon from "@mui/icons-material/FormatBold"; // Bladeburner
import BusinessIcon from "@mui/icons-material/Business"; // Corp
import SportsMmaIcon from "@mui/icons-material/SportsMma"; // Gang
import CheckIcon from "@mui/icons-material/Check"; // Milestones
import HelpIcon from "@mui/icons-material/Help"; // Tutorial
import SettingsIcon from "@mui/icons-material/Settings"; // options
import DeveloperBoardIcon from "@mui/icons-material/DeveloperBoard"; // Dev
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import PublicIcon from "@mui/icons-material/Public";
import LiveHelpIcon from "@mui/icons-material/LiveHelp";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { IRouter, Page } from "../../ui/Router";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { CONSTANTS } from "../../Constants";
import { iTutorialSteps, iTutorialNextStep, ITutorial } from "../../InteractiveTutorial";
import { getAvailableCreatePrograms } from "../../Programs/ProgramHelpers";
import { Settings } from "../../Settings/Settings";
import { redPillFlag } from "../../RedPill";

import { KEY } from "../../utils/helpers/keyCodes";
import { ProgramsSeen } from "../../Programs/ui/ProgramsRoot";
import { InvitationsSeen } from "../../Faction/ui/FactionsRoot";

const openedMixin = (theme: Theme): CSSObject => ({
  width: theme.spacing(31),
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(2)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(7)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== "open" })(({ theme, open }) => ({
  width: theme.spacing(31),
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    active: {
      borderLeft: "3px solid " + theme.palette.primary.main,
    },
    listitem: {},
  }),
);

interface IProps {
  player: IPlayer;
  router: IRouter;
  page: Page;
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

  const augmentationCount = props.player.queuedAugmentations.length;
  const invitationsCount = props.player.factionInvitations.length; //- InvitationsSeen.length;
  const programCount = getAvailableCreatePrograms(props.player).length; //- ProgramsSeen.length;
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
    props.router.toTerminal();
    if (flashTerminal) iTutorialNextStep();
  }

  function clickScriptEditor(): void {
    props.router.toScriptEditor();
  }

  function clickStats(): void {
    props.router.toStats();
    if (flashStats) iTutorialNextStep();
  }

  function clickActiveScripts(): void {
    props.router.toActiveScripts();
    if (flashActiveScripts) iTutorialNextStep();
  }

  function clickCreateProgram(): void {
    props.router.toCreateProgram();
  }

  function clickFactions(): void {
    props.router.toFactions();
  }

  function clickAugmentations(): void {
    props.router.toAugmentations();
  }

  function clickSleeves(): void {
    props.router.toSleeves();
  }

  function clickHacknet(): void {
    props.router.toHacknetNodes();
    if (flashHacknet) iTutorialNextStep();
  }

  function clickCity(): void {
    props.router.toCity();
    if (flashCity) iTutorialNextStep();
  }

  function clickTravel(): void {
    props.router.toTravel();
  }

  function clickJob(): void {
    props.router.toJob();
  }

  function clickStockMarket(): void {
    props.router.toStockMarket();
  }

  function clickBladeburner(): void {
    props.router.toBladeburner();
  }

  function clickCorp(): void {
    props.router.toCorporation();
  }

  function clickGang(): void {
    props.router.toGang();
  }

  function clickTutorial(): void {
    props.router.toTutorial();
    if (flashTutorial) iTutorialNextStep();
  }

  function clickMilestones(): void {
    props.router.toMilestones();
  }
  function clickOptions(): void {
    props.router.toGameOptions();
  }

  function clickDev(): void {
    props.router.toDevMenu();
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
      if (props.player.isWorking || redPillFlag) return;
      if (event.keyCode == KEY.T && event.altKey) {
        event.preventDefault();
        clickTerminal();
      } else if (event.keyCode === KEY.C && event.altKey) {
        event.preventDefault();
        clickStats();
      } else if (event.keyCode === KEY.E && event.altKey) {
        event.preventDefault();
        clickScriptEditor();
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
        if (props.page == Page.Terminal && Settings.EnableBashHotkeys) {
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
  const toggleDrawer = (): void => setOpen((old) => !old);
  return (
    <Drawer open={open} anchor="left" variant="permanent">
      <ListItem classes={{ root: classes.listitem }} button onClick={toggleDrawer}>
        <ListItemIcon>
          {!open ? <ChevronRightIcon color="primary" /> : <ChevronLeftIcon color="primary" />}
        </ListItemIcon>
        <ListItemText primary={<Typography>Bitburner v{CONSTANTS.Version}</Typography>} />
      </ListItem>
      <Divider />
      <List>
        <ListItem classes={{ root: classes.listitem }} button onClick={() => setHackingOpen((old) => !old)}>
          <ListItemIcon>
            <ComputerIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary={<Typography>Hacking</Typography>} />
          {hackingOpen ? <ExpandLessIcon color="primary" /> : <ExpandMoreIcon color="primary" />}
        </ListItem>
        <Collapse in={hackingOpen} timeout="auto" unmountOnExit>
          <List>
            <ListItem
              classes={{ root: classes.listitem }}
              button
              key={"Terminal"}
              className={clsx({
                [classes.active]: props.page === Page.Terminal,
              })}
              onClick={clickTerminal}
            >
              <ListItemIcon>
                <LastPageIcon
                  color={flashTerminal ? "error" : props.page !== Page.Terminal ? "secondary" : "primary"}
                />
              </ListItemIcon>
              <ListItemText>
                <Typography color={flashTerminal ? "error" : props.page !== Page.Terminal ? "secondary" : "primary"}>
                  Terminal
                </Typography>
              </ListItemText>
            </ListItem>
            <ListItem
              classes={{ root: classes.listitem }}
              button
              key={"Script Editor"}
              className={clsx({
                [classes.active]: props.page === Page.ScriptEditor,
              })}
              onClick={clickScriptEditor}
            >
              <ListItemIcon>
                <CreateIcon color={props.page !== Page.ScriptEditor ? "secondary" : "primary"} />
              </ListItemIcon>
              <ListItemText>
                <Typography color={props.page !== Page.ScriptEditor ? "secondary" : "primary"}>
                  Script Editor
                </Typography>
              </ListItemText>
            </ListItem>
            <ListItem
              classes={{ root: classes.listitem }}
              button
              key={"Active Scripts"}
              className={clsx({
                [classes.active]: props.page === Page.ActiveScripts,
              })}
              onClick={clickActiveScripts}
            >
              <ListItemIcon>
                <StorageIcon
                  color={flashActiveScripts ? "error" : props.page !== Page.ActiveScripts ? "secondary" : "primary"}
                />
              </ListItemIcon>
              <ListItemText>
                <Typography
                  color={flashActiveScripts ? "error" : props.page !== Page.ActiveScripts ? "secondary" : "primary"}
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
                  [classes.active]: props.page === Page.CreateProgram,
                })}
                onClick={clickCreateProgram}
              >
                <ListItemIcon>
                  <Badge badgeContent={programCount > 0 ? programCount : undefined} color="error">
                    <BugReportIcon color={props.page !== Page.CreateProgram ? "secondary" : "primary"} />
                  </Badge>
                </ListItemIcon>
                <ListItemText>
                  <Typography color={props.page !== Page.CreateProgram ? "secondary" : "primary"}>
                    Create Program
                  </Typography>
                </ListItemText>
              </ListItem>
            )}
          </List>
        </Collapse>

        <Divider />
        <ListItem classes={{ root: classes.listitem }} button onClick={() => setCharacterOpen((old) => !old)}>
          <ListItemIcon>
            <AccountBoxIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary={<Typography>Character</Typography>} />
          {characterOpen ? <ExpandLessIcon color="primary" /> : <ExpandMoreIcon color="primary" />}
        </ListItem>
        <Collapse in={characterOpen} timeout="auto" unmountOnExit>
          <ListItem
            button
            key={"Stats"}
            className={clsx({
              [classes.active]: props.page === Page.Stats,
            })}
            onClick={clickStats}
          >
            <ListItemIcon>
              <EqualizerIcon color={flashStats ? "error" : props.page !== Page.Stats ? "secondary" : "primary"} />
            </ListItemIcon>
            <ListItemText>
              <Typography color={flashStats ? "error" : props.page !== Page.Stats ? "secondary" : "primary"}>
                Stats
              </Typography>
            </ListItemText>
          </ListItem>
          {canOpenFactions && (
            <ListItem
              classes={{ root: classes.listitem }}
              button
              key={"Factions"}
              className={clsx({
                [classes.active]: [Page.Factions, Page.Faction].includes(props.page),
              })}
              onClick={clickFactions}
            >
              <ListItemIcon>
                <Badge badgeContent={invitationsCount !== 0 ? invitationsCount : undefined} color="error">
                  <ContactsIcon color={![Page.Factions, Page.Faction].includes(props.page) ? "secondary" : "primary"} />
                </Badge>
              </ListItemIcon>
              <ListItemText>
                <Typography color={![Page.Factions, Page.Faction].includes(props.page) ? "secondary" : "primary"}>
                  Factions
                </Typography>
              </ListItemText>
            </ListItem>
          )}
          {canOpenAugmentations && (
            <ListItem
              classes={{ root: classes.listitem }}
              button
              key={"Augmentations"}
              className={clsx({
                [classes.active]: props.page === Page.Augmentations,
              })}
              onClick={clickAugmentations}
            >
              <ListItemIcon>
                <Badge badgeContent={augmentationCount !== 0 ? augmentationCount : undefined} color="error">
                  <DoubleArrowIcon
                    style={{ transform: "rotate(-90deg)" }}
                    color={props.page !== Page.Augmentations ? "secondary" : "primary"}
                  />
                </Badge>
              </ListItemIcon>
              <ListItemText>
                <Typography color={props.page !== Page.Augmentations ? "secondary" : "primary"}>
                  Augmentations
                </Typography>
              </ListItemText>
            </ListItem>
          )}
          <ListItem
            button
            key={"Hacknet"}
            className={clsx({
              [classes.active]: props.page === Page.Hacknet,
            })}
            onClick={clickHacknet}
          >
            <ListItemIcon>
              <AccountTreeIcon color={flashHacknet ? "error" : props.page !== Page.Hacknet ? "secondary" : "primary"} />
            </ListItemIcon>
            <ListItemText>
              <Typography color={flashHacknet ? "error" : props.page !== Page.Hacknet ? "secondary" : "primary"}>
                Hacknet
              </Typography>
            </ListItemText>
          </ListItem>
          {canOpenSleeves && (
            <ListItem
              classes={{ root: classes.listitem }}
              button
              key={"Sleeves"}
              className={clsx({
                [classes.active]: props.page === Page.Sleeves,
              })}
              onClick={clickSleeves}
            >
              <ListItemIcon>
                <PeopleAltIcon color={props.page !== Page.Sleeves ? "secondary" : "primary"} />
              </ListItemIcon>
              <ListItemText>
                <Typography color={props.page !== Page.Sleeves ? "secondary" : "primary"}>Sleeves</Typography>
              </ListItemText>
            </ListItem>
          )}
        </Collapse>

        <Divider />
        <ListItem classes={{ root: classes.listitem }} button onClick={() => setWorldOpen((old) => !old)}>
          <ListItemIcon>
            <PublicIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary={<Typography>World</Typography>} />
          {worldOpen ? <ExpandLessIcon color="primary" /> : <ExpandMoreIcon color="primary" />}
        </ListItem>
        <Collapse in={worldOpen} timeout="auto" unmountOnExit>
          <ListItem
            button
            key={"City"}
            className={clsx({
              [classes.active]:
                props.page === Page.City || props.page === Page.Resleeves || props.page === Page.Location,
            })}
            onClick={clickCity}
          >
            <ListItemIcon>
              <LocationCityIcon color={flashCity ? "error" : props.page !== Page.City ? "secondary" : "primary"} />
            </ListItemIcon>
            <ListItemText>
              <Typography color={flashCity ? "error" : props.page !== Page.City ? "secondary" : "primary"}>
                City
              </Typography>
            </ListItemText>
          </ListItem>
          <ListItem
            button
            key={"Travel"}
            className={clsx({
              [classes.active]: props.page === Page.Travel,
            })}
            onClick={clickTravel}
          >
            <ListItemIcon>
              <AirplanemodeActiveIcon color={props.page !== Page.Travel ? "secondary" : "primary"} />
            </ListItemIcon>
            <ListItemText>
              <Typography color={props.page !== Page.Travel ? "secondary" : "primary"}>Travel</Typography>
            </ListItemText>
          </ListItem>
          {canJob && (
            <ListItem
              classes={{ root: classes.listitem }}
              button
              key={"Job"}
              className={clsx({
                [classes.active]: props.page === Page.Job,
              })}
              onClick={clickJob}
            >
              <ListItemIcon>
                <WorkIcon color={props.page !== Page.Job ? "secondary" : "primary"} />
              </ListItemIcon>
              <ListItemText>
                <Typography color={props.page !== Page.Job ? "secondary" : "primary"}>Job</Typography>
              </ListItemText>
            </ListItem>
          )}
          {canStockMarket && (
            <ListItem
              classes={{ root: classes.listitem }}
              button
              key={"Stock Market"}
              className={clsx({
                [classes.active]: props.page === Page.StockMarket,
              })}
              onClick={clickStockMarket}
            >
              <ListItemIcon>
                <TrendingUpIcon color={props.page !== Page.StockMarket ? "secondary" : "primary"} />
              </ListItemIcon>
              <ListItemText>
                <Typography color={props.page !== Page.StockMarket ? "secondary" : "primary"}>Stock Market</Typography>
              </ListItemText>
            </ListItem>
          )}
          {canBladeburner && (
            <ListItem
              classes={{ root: classes.listitem }}
              button
              key={"Bladeburner"}
              className={clsx({
                [classes.active]: props.page === Page.Bladeburner,
              })}
              onClick={clickBladeburner}
            >
              <ListItemIcon>
                <FormatBoldIcon color={props.page !== Page.Bladeburner ? "secondary" : "primary"} />
              </ListItemIcon>
              <ListItemText>
                <Typography color={props.page !== Page.Bladeburner ? "secondary" : "primary"}>Bladeburner</Typography>
              </ListItemText>
            </ListItem>
          )}
          {canCorporation && (
            <ListItem
              classes={{ root: classes.listitem }}
              button
              key={"Corp"}
              className={clsx({
                [classes.active]: props.page === Page.Corporation,
              })}
              onClick={clickCorp}
            >
              <ListItemIcon>
                <BusinessIcon color={props.page !== Page.Corporation ? "secondary" : "primary"} />
              </ListItemIcon>
              <ListItemText>
                <Typography color={props.page !== Page.Corporation ? "secondary" : "primary"}>Corp</Typography>
              </ListItemText>
            </ListItem>
          )}
          {canGang && (
            <ListItem
              classes={{ root: classes.listitem }}
              button
              key={"Gang"}
              className={clsx({
                [classes.active]: props.page === Page.Gang,
              })}
              onClick={clickGang}
            >
              <ListItemIcon>
                <SportsMmaIcon color={props.page !== Page.Gang ? "secondary" : "primary"} />
              </ListItemIcon>
              <ListItemText>
                <Typography color={props.page !== Page.Gang ? "secondary" : "primary"}>Gang</Typography>
              </ListItemText>
            </ListItem>
          )}
        </Collapse>

        <Divider />
        <ListItem classes={{ root: classes.listitem }} button onClick={() => setHelpOpen((old) => !old)}>
          <ListItemIcon>
            <LiveHelpIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary={<Typography>Help</Typography>} />
          {helpOpen ? <ExpandLessIcon color="primary" /> : <ExpandMoreIcon color="primary" />}
        </ListItem>
        <Collapse in={helpOpen} timeout="auto" unmountOnExit>
          <ListItem
            button
            key={"Milestones"}
            className={clsx({
              [classes.active]: props.page === Page.Milestones,
            })}
            onClick={clickMilestones}
          >
            <ListItemIcon>
              <CheckIcon color={props.page !== Page.Milestones ? "secondary" : "primary"} />
            </ListItemIcon>
            <ListItemText>
              <Typography color={props.page !== Page.Milestones ? "secondary" : "primary"}>Milestones</Typography>
            </ListItemText>
          </ListItem>
          <ListItem
            button
            key={"Tutorial"}
            className={clsx({
              [classes.active]: props.page === Page.Tutorial,
            })}
            onClick={clickTutorial}
          >
            <ListItemIcon>
              <HelpIcon color={flashTutorial ? "error" : props.page !== Page.Tutorial ? "secondary" : "primary"} />
            </ListItemIcon>
            <ListItemText>
              <Typography color={flashTutorial ? "error" : props.page !== Page.Tutorial ? "secondary" : "primary"}>
                Tutorial
              </Typography>
            </ListItemText>
          </ListItem>
          <ListItem
            button
            key={"Options"}
            className={clsx({
              [classes.active]: props.page === Page.Options,
            })}
            onClick={clickOptions}
          >
            <ListItemIcon>
              <SettingsIcon color={props.page !== Page.Options ? "secondary" : "primary"} />
            </ListItemIcon>
            <ListItemText>
              <Typography color={props.page !== Page.Options ? "secondary" : "primary"}>Options</Typography>
            </ListItemText>
          </ListItem>
          {process.env.NODE_ENV === "development" && (
            <ListItem
              classes={{ root: classes.listitem }}
              button
              key={"Dev"}
              className={clsx({
                [classes.active]: props.page === Page.DevMenu,
              })}
              onClick={clickDev}
            >
              <ListItemIcon>
                <DeveloperBoardIcon color={props.page !== Page.DevMenu ? "secondary" : "primary"} />
              </ListItemIcon>
              <ListItemText>
                <Typography color={props.page !== Page.DevMenu ? "secondary" : "primary"}>Dev</Typography>
              </ListItemText>
            </ListItem>
          )}
        </Collapse>
      </List>
    </Drawer>
  );
}
