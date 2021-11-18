import React, { useState, useEffect } from "react";

import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import ArrowForwardIos from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIos from "@mui/icons-material/ArrowBackIos";
import { ITutorialEvents } from "./ITutorialEvents";
import { CopyableText } from "../React/CopyableText";

import ListItem from "@mui/material/ListItem";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import LastPageIcon from "@mui/icons-material/LastPage";
import HelpIcon from "@mui/icons-material/Help";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import StorageIcon from "@mui/icons-material/Storage";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import { Theme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import createStyles from "@mui/styles/createStyles";

import {
  iTutorialPrevStep,
  iTutorialNextStep,
  ITutorial,
  iTutorialSteps,
  iTutorialEnd,
} from "../../InteractiveTutorial";

interface IContent {
  content: React.ReactElement;
  canNext: boolean;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    textfield: {
      borderBottom: "1px solid " + theme.palette.primary.main,
    },
    code: {
      whiteSpace: "pre",
      backgroundColor: theme.palette.background.paper,
    },
  }),
);

export function InteractiveTutorialRoot(): React.ReactElement {
  const classes = useStyles();

  const contents: { [number: string]: IContent | undefined } = {
    [iTutorialSteps.Start as number]: {
      content: (
        <>
          <Typography>
            Welcome to Bitburner, a cyberpunk-themed incremental RPG! The game takes place in a dark, dystopian
            future... The year is 2077...
            <br />
            <br />
            This tutorial will show you the basics of the game. You may skip the tutorial at any time.
          </Typography>
        </>
      ),
      canNext: true,
    },
    [iTutorialSteps.GoToCharacterPage as number]: {
      content: (
        <>
          <Typography>Let's start by heading to the Stats page. Click</Typography>
          <ListItem>
            <EqualizerIcon color={"error"} />
            <Typography color={"error"}>Stats</Typography>
          </ListItem>

          <Typography>on the main navigation menu (left-hand side of the screen)</Typography>
        </>
      ),
      canNext: false,
    },
    [iTutorialSteps.CharacterPage as number]: {
      content: (
        <>
          <ListItem>
            <EqualizerIcon color={"primary"} />
            <Typography color={"primary"}>Stats</Typography>
          </ListItem>
          <Typography>
            shows a lot of important information about your progress, such as your skills, money, and bonuses.
          </Typography>
        </>
      ),
      canNext: true,
    },
    [iTutorialSteps.CharacterGoToTerminalPage as number]: {
      content: (
        <>
          <Typography>Let's head to your computer's terminal by clicking</Typography>
          <ListItem>
            <LastPageIcon color={"error"} />
            <Typography color={"error"}>Terminal</Typography>
          </ListItem>
          <Typography>on the main navigation menu.</Typography>
        </>
      ),
      canNext: false,
    },
    [iTutorialSteps.TerminalIntro as number]: {
      content: (
        <>
          <ListItem>
            <LastPageIcon color={"primary"} />
            <Typography color={"primary"}>Terminal</Typography>
          </ListItem>
          <Typography>
            is used to interface with your home computer as well as all of the other machines around the world.
          </Typography>
        </>
      ),
      canNext: true,
    },
    [iTutorialSteps.TerminalHelp as number]: {
      content: (
        <>
          <Typography>Let's try it out. Start by entering</Typography>
          <Typography classes={{ root: classes.textfield }}>{"[home ~/]> help"}</Typography>
          <Typography>(Don't forget to press Enter after typing the command)</Typography>
        </>
      ),
      canNext: false,
    },
    [iTutorialSteps.TerminalLs as number]: {
      content: (
        <>
          <Typography classes={{ root: classes.textfield }}>{"[home ~/]> help"}</Typography>
          <Typography>
            displays a list of all available Terminal commands, how to use them, and a description of what they do.{" "}
            <br />
            <br />
            Let's try another command. Enter
          </Typography>

          <Typography classes={{ root: classes.textfield }}>{"[home ~/]> ls"}</Typography>
        </>
      ),
      canNext: false,
    },
    [iTutorialSteps.TerminalScan as number]: {
      content: (
        <>
          <Typography classes={{ root: classes.textfield }}>{"[home ~/]> ls"}</Typography>
          <Typography>
            {" "}
            is a basic command that shows files on the computer. Right now, it shows that you have a program called{" "}
            NUKE.exe on your computer. We'll get to what this does later. <br />
            <br />
            Using your home computer's terminal, you can connect to other machines throughout the world. Let's do that
            now by first entering
          </Typography>
          <Typography classes={{ root: classes.textfield }}>{"[home ~/]> scan"}</Typography>
        </>
      ),
      canNext: false,
    },
    [iTutorialSteps.TerminalScanAnalyze1 as number]: {
      content: (
        <>
          <Typography classes={{ root: classes.textfield }}>{"[home ~/]> scan"}</Typography>
          <Typography>
            shows all available network connections. In other words, it displays a list of all servers that can be
            connected to from your current machine. A server is identified by its hostname. <br />
            <br />
            That's great and all, but there's so many servers. Which one should you go to?{" "}
          </Typography>

          <Typography classes={{ root: classes.textfield }}>{"[home ~/]> scan-analyze"}</Typography>
          <Typography>gives some more detailed information about servers on the network. Try it now!</Typography>
        </>
      ),
      canNext: false,
    },
    [iTutorialSteps.TerminalScanAnalyze2 as number]: {
      content: (
        <>
          <Typography classes={{ root: classes.textfield }}>{"[home ~/]> scan-analyze"}</Typography>
          <Typography>
            shows more detailed information about each server that you can connect to (servers that are a distance of
            one node away). <br />
            <br /> It is also possible to run scan-analyze with a higher depth. Let's try a depth of two with the
            following command:{" "}
          </Typography>

          <Typography classes={{ root: classes.textfield }}>{"[home ~/]> scan-analyze 2"}</Typography>
        </>
      ),
      canNext: false,
    },
    [iTutorialSteps.TerminalConnect as number]: {
      content: (
        <>
          <Typography>
            Now you can see information about all servers that are up to two nodes away, as well as figure out how to
            navigate to those servers through the network. You can only connect to a server that is one node away. To
            connect to a machine, use
          </Typography>
          <Typography classes={{ root: classes.textfield }}>{"[home ~/]> connect hostname"}</Typography>

          <Typography>From the results of </Typography>
          <Typography classes={{ root: classes.textfield }}>{"[home ~/]> scan-analyze 2"}</Typography>

          <Typography>
            {" "}
            we can see that the n00dles server is only one node away. Let's connect so it now using:
          </Typography>

          <Typography classes={{ root: classes.textfield }}>{"[home ~/]> connect n00dles"}</Typography>
        </>
      ),
      canNext: false,
    },
    [iTutorialSteps.TerminalAnalyze as number]: {
      content: (
        <>
          <Typography>
            You are now connected to another machine! What can you do now? You can hack it!
            <br />
            <br /> In the year 2077, currency has become digital and decentralized. People and corporations store their
            money on servers and computers. Using your hacking abilities, you can hack servers to steal money and gain
            experience. <br />
            <br />
            Before you try to hack a server, you should run diagnostics using{" "}
          </Typography>
          <Typography classes={{ root: classes.textfield }}>{"[n00dles ~/]> analyze"}</Typography>
        </>
      ),
      canNext: false,
    },
    [iTutorialSteps.TerminalNuke as number]: {
      content: (
        <>
          <Typography>When </Typography>
          <Typography classes={{ root: classes.textfield }}>{"[n00dles ~/]> analyze"}</Typography>

          <Typography>
            finishes running it will show useful information about hacking the server. <br />
            <br /> For this server, the required hacking skill is only 1, which means you can hack it right now.
            However, in order to hack a server you must first gain root access. The NUKE.exe program that we saw earlier
            on your home computer is a virus that will grant you root access to a machine if there are enough open
            ports.
          </Typography>
          <Typography classes={{ root: classes.textfield }}>{"[n00dles ~/]> analyze"}</Typography>

          <Typography>
            {" "}
            shows that there do not need to be any open ports on this machine for the NUKE virus to work, so go ahead
            and run the virus using{" "}
          </Typography>
          <Typography classes={{ root: classes.textfield }}>{"[n00dles ~/]> run NUKE.exe"}</Typography>

          <Typography></Typography>
        </>
      ),
      canNext: true,
    },
    [iTutorialSteps.TerminalManualHack as number]: {
      content: (
        <>
          <Typography>You now have root access! You can hack the server using </Typography>
          <Typography classes={{ root: classes.textfield }}>{"[n00dles ~/]> hack"}</Typography>

          <Typography> Try doing that now.</Typography>
        </>
      ),
      canNext: true,
    },
    [iTutorialSteps.TerminalHackingMechanics as number]: {
      content: (
        <Typography>
          You are now attempting to hack the server. Performing a hack takes time and only has a certain percentage
          chance of success. This time and success chance is determined by a variety of factors, including your hacking
          skill and the server's security level.
          <br />
          <br />
          If your attempt to hack the server is successful, you will steal a certain percentage of the server's total
          money. This percentage is affected by your hacking skill and the server's security level.
          <br />
          <br />
          The amount of money on a server is not limitless. So, if you constantly hack a server and deplete its money,
          then you will encounter diminishing returns in your hacking. You will need to use{" "}
          <Typography classes={{ root: classes.textfield }}>{"[n00dles ~/]> grow"}</Typography>
          and <Typography classes={{ root: classes.textfield }}>{"[n00dles ~/]> weaken"}</Typography>
        </Typography>
      ),
      canNext: true,
    },
    [iTutorialSteps.TerminalGoHome as number]: {
      content: (
        <>
          <Typography>From any server you can get back home using</Typography>
          <Typography classes={{ root: classes.textfield }}>{"[n00dles ~/]> home"}</Typography>

          <Typography>Let's head home before creating our first script!</Typography>
        </>
      ),
      canNext: true,
    },
    [iTutorialSteps.TerminalCreateScript as number]: {
      content: (
        <>
          <Typography>
            Hacking is the core mechanic of the game and is necessary for progressing. However, you don't want to be
            hacking manually the entire time. You can automate your hacking by writing scripts!
            <br />
            <br />
            To create a new script or edit an existing one, you can use{" "}
          </Typography>
          <Typography classes={{ root: classes.textfield }}>{"[home ~/]> nano"}</Typography>

          <Typography>Scripts must end with the .script extension. Let's make a script now by entering </Typography>
          <Typography classes={{ root: classes.textfield }}>{"[home ~/]> nano n00dles.script"}</Typography>

          <Typography>
            after the hack command finishes running (Sidenote: Pressing ctrl + c will end a command like hack early)
          </Typography>
        </>
      ),
      canNext: false,
    },
    [iTutorialSteps.TerminalTypeScript as number]: {
      content: (
        <>
          <Typography>
            This is the script editor. You can use it to program your scripts. Scripts are written in a simplified
            version of javascript. Copy and paste the following code into the script editor: <br />
          </Typography>

          <Typography classes={{ root: classes.code }}>
            <CopyableText
              value={`while(true) {
  hack('n00dles');
}`}
            />
          </Typography>
          <Typography>
            For anyone with basic programming experience, this code should be straightforward. This script will
            continuously hack the n00dles server.
            <br />
            <br />
            If you're an intermediate programmer you should use ns2 instead. It is much faster and offers more
            possibilities.
            <br />
            <br />
            To save and close the script editor, press the button in the bottom left, or press ctrl + b.
          </Typography>
        </>
      ),
      canNext: false,
    },
    [iTutorialSteps.TerminalFree as number]: {
      content: (
        <>
          <Typography>
            Now we'll run the script. Scripts require a certain amount of RAM to run, and can be run on any machine
            which you have root access to. Different servers have different amounts of RAM. You can also purchase more
            RAM for your home server.
            <br />
            <br />
            To check how much RAM is available on this machine, enter
          </Typography>
          <Typography classes={{ root: classes.textfield }}>{"[home ~/]> free"}</Typography>
        </>
      ),
      canNext: false,
    },
    [iTutorialSteps.TerminalRunScript as number]: {
      content: (
        <>
          <Typography>
            We have 8GB of free RAM on this machine, which is enough to run our script. Let's run our script using
          </Typography>
          <Typography classes={{ root: classes.textfield }}>{"[home ~/]> run n00dles.script"}</Typography>
        </>
      ),
      canNext: false,
    },
    [iTutorialSteps.TerminalGoToActiveScriptsPage as number]: {
      content: (
        <>
          <Typography>
            Your script is now running! It will continuously run in the background and will automatically stop if the
            code ever completes (the n00dles.script will never complete because it runs an infinite loop). <br />
            <br />
            These scripts can passively earn you income and hacking experience. Your scripts will also earn money and
            experience while you are offline, although at a slightly slower rate. <br />
            <br />
            Let's check out some statistics for our running scripts by clicking{" "}
          </Typography>
          <ListItem>
            <StorageIcon color={"error"} />
            <Typography color={"error"}>Active Scripts</Typography>
          </ListItem>
        </>
      ),
      canNext: false,
    },
    [iTutorialSteps.ActiveScriptsPage as number]: {
      content: (
        <>
          <Typography>
            This page displays information about all of your scripts that are running across every server. You can use
            this to gauge how well your scripts are doing. Let's go back to
          </Typography>
          <ListItem>
            <LastPageIcon color={"error"} />
            <Typography color={"error"}>Terminal</Typography>
          </ListItem>
        </>
      ),
      canNext: false,
    },
    [iTutorialSteps.ActiveScriptsToTerminal as number]: {
      content: (
        <>
          <Typography>
            One last thing about scripts, each active script contains logs that detail what it's doing. We can check
            these logs using the tail command. Do that now for the script we just ran by typing{" "}
          </Typography>
          <Typography classes={{ root: classes.textfield }}>{"[home ~/]> tail n00dles.script"}</Typography>
        </>
      ),
      canNext: false,
    },
    [iTutorialSteps.TerminalTailScript as number]: {
      content: (
        <>
          <Typography>
            The log for this script won't show much right now (it might show nothing at all) because it just started
            running...but check back again in a few minutes! <br />
            <br />
            This covers the basics of hacking. To learn more about writing scripts, select
          </Typography>
          <ListItem>
            <HelpIcon color={"primary"} />
            <Typography color={"primary"}>Tutorial</Typography>
          </ListItem>
          <Typography>
            in the main navigation menu to look at the documentation. If you are an experienced JavaScript developer, I
            would highly suggest you check out the section on NetscriptJS/Netscript 2.0, it's faster and more powerful.
            <br />
            <br />
            For now, let's move on to something else!
          </Typography>
        </>
      ),
      canNext: true,
    },
    [iTutorialSteps.GoToHacknetNodesPage as number]: {
      content: (
        <>
          <Typography>
            Hacking is not the only way to earn money. One other way to passively earn money is by purchasing and
            upgrading Hacknet Nodes. Let's go to
          </Typography>
          <ListItem>
            <AccountTreeIcon color={"error"} />
            <Typography color={"error"}>Hacknet</Typography>
          </ListItem>
          <Typography>through the main navigation menu now.</Typography>
        </>
      ),
      canNext: true,
    },
    [iTutorialSteps.HacknetNodesIntroduction as number]: {
      content: (
        <Typography>
          Here you can purchase new Hacknet Nodes and upgrade your existing ones. Let's purchase a new one now.
        </Typography>
      ),
      canNext: true,
    },
    [iTutorialSteps.HacknetNodesGoToWorldPage as number]: {
      content: (
        <>
          <Typography>
            You just purchased a Hacknet Node! This Hacknet Node will passively earn you money over time, both online
            and offline. When you get enough money, you can upgrade your newly-purchased Hacknet Node below.
            <br />
            <br />
            Let's go to
          </Typography>
          <ListItem>
            <LocationCityIcon color={"error"} />
            <Typography color={"error"}>City</Typography>
          </ListItem>
        </>
      ),
      canNext: true,
    },
    [iTutorialSteps.WorldDescription as number]: {
      content: (
        <>
          <Typography>
            This page lists all of the different locations you can currently travel to. Each location has something that
            you can do. There's a lot of content out in the world, make sure you explore and discover!
            <br />
            <br />
            Lastly, click on
          </Typography>
          <ListItem>
            <HelpIcon color={"error"} />
            <Typography color={"error"}>Tutorial</Typography>
          </ListItem>
        </>
      ),
      canNext: true,
    },
    [iTutorialSteps.TutorialPageInfo as number]: {
      content: (
        <Typography>
          This page contains a lot of different documentation about the game's content and mechanics. I know it's a lot,
          but I highly suggest you read (or at least skim) through this before you start playing . That's the end of the
          tutorial. Hope you enjoy the game!
        </Typography>
      ),
      canNext: true,
    },
    [iTutorialSteps.End as number]: {
      content: <Typography></Typography>,
      canNext: true,
    },
  };

  const setRerender = useState(false)[1];
  function rerender(): void {
    setRerender((old) => !old);
  }

  useEffect(() => {
    return ITutorialEvents.subscribe(rerender);
  }, []);
  const step = ITutorial.currStep;
  const content = contents[step];
  if (content === undefined) throw new Error("error in the tutorial");
  return (
    <Paper square sx={{ maxWidth: "70vw", p: 2 }}>
      {content.content}
      {step !== iTutorialSteps.TutorialPageInfo && (
        <>
          <IconButton onClick={iTutorialPrevStep} aria-label="previous">
            <ArrowBackIos />
          </IconButton>
          {content.canNext && (
            <IconButton onClick={iTutorialNextStep} aria-label="next">
              <ArrowForwardIos />
            </IconButton>
          )}
        </>
      )}
      <br />
      <br />
      <Button onClick={iTutorialEnd}>
        {step !== iTutorialSteps.TutorialPageInfo ? "SKIP TUTORIAL" : "FINISH TUTORIAL"}
      </Button>
    </Paper>
  );
}
