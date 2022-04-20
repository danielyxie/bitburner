import { Message } from "./Message";
import { AugmentationNames } from "../Augmentation/data/AugmentationNames";
import { Router } from "../ui/GameRoot";
import { Programs } from "../Programs/Programs";
import { Player } from "../Player";
import { Page } from "../ui/Router";
import { GetServer } from "../Server/AllServers";
import { SpecialServers } from "../Server/data/SpecialServers";
import { Settings } from "../Settings/Settings";
import { dialogBoxCreate } from "../ui/React/DialogBox";
import { FactionNames } from "../Faction/data/FactionNames";
import { Server } from "../Server/Server";

//Sends message to player, including a pop up
function sendMessage(msg: Message, forced = false): void {
  if (forced || !Settings.SuppressMessages) {
    showMessage(msg.filename);
  }
  addMessageToServer(msg);
}

function showMessage(name: MessageFilenames): void {
  const msg = Messages[name];
  if (!(msg instanceof Message)) throw new Error("trying to display unexistent message");
  const txt =
    "Message received from unknown sender: <br><br>" +
    "<i>" +
    msg.msg +
    "</i><br><br>" +
    "This message was saved as " +
    msg.filename +
    " onto your home computer.";
  dialogBoxCreate(txt);
}

//Adds a message to a server
function addMessageToServer(msg: Message): void {
  //Short-circuit if the message has already been saved
  if (recvd(msg)) {
    return;
  }
  const server = GetServer("home");
  if (server == null) {
    throw new Error("The home server doesn't exist. You done goofed.");
  }
  server.messages.push(msg.filename);
}

//Returns whether the given message has already been received
function recvd(msg: Message): boolean {
  const server = GetServer("home");
  if (server == null) {
    throw new Error("The home server doesn't exist. You done goofed.");
  }
  return server.messages.includes(msg.filename);
}

//Checks if any of the 'timed' messages should be sent
function checkForMessagesToSend(): void {
  if (Router.page() === Page.BitVerse) return;
  const jumper0 = Messages[MessageFilenames.Jumper0];
  const jumper1 = Messages[MessageFilenames.Jumper1];
  const jumper2 = Messages[MessageFilenames.Jumper2];
  const jumper3 = Messages[MessageFilenames.Jumper3];
  const jumper4 = Messages[MessageFilenames.Jumper4];
  const cybersecTest = Messages[MessageFilenames.CyberSecTest];
  const nitesecTest = Messages[MessageFilenames.NiteSecTest];
  const bitrunnersTest = Messages[MessageFilenames.BitRunnersTest];
  const truthGazer = Messages[MessageFilenames.TruthGazer];
  const redpill = Messages[MessageFilenames.RedPill];

  if (Player.hasAugmentation(AugmentationNames.TheRedPill)) {
    //Get the world daemon required hacking level
    const worldDaemon = GetServer(SpecialServers.WorldDaemon);
    if (!(worldDaemon instanceof Server)) {
      throw new Error("The world daemon is not a server???? Please un-break reality");
    }
    //If the daemon can be hacked, send the player icarus.msg
    if (Player.hacking >= worldDaemon.requiredHackingSkill) {
      sendMessage(redpill, Player.sourceFiles.length === 0);
    }
    //If the daemon cannot be hacked, send the player truthgazer.msg a single time.
    else if (!recvd(truthGazer)) {
      sendMessage(truthGazer);
    }
  } else if (!recvd(jumper0) && Player.hacking >= 25) {
    sendMessage(jumper0);
    const flightName = Programs.Flight.name;
    const homeComp = Player.getHomeComputer();
    if (!homeComp.programs.includes(flightName)) {
      homeComp.programs.push(flightName);
    }
  } else if (!recvd(jumper1) && Player.hacking >= 40) {
    sendMessage(jumper1);
  } else if (!recvd(cybersecTest) && Player.hacking >= 50) {
    sendMessage(cybersecTest);
  } else if (!recvd(jumper2) && Player.hacking >= 175) {
    sendMessage(jumper2);
  } else if (!recvd(nitesecTest) && Player.hacking >= 200) {
    sendMessage(nitesecTest);
  } else if (!recvd(jumper3) && Player.hacking >= 350) {
    sendMessage(jumper3);
  } else if (!recvd(jumper4) && Player.hacking >= 490) {
    sendMessage(jumper4);
  } else if (!recvd(bitrunnersTest) && Player.hacking >= 500) {
    sendMessage(bitrunnersTest);
  }
}

export enum MessageFilenames {
  Jumper0 = "j0.msg",
  Jumper1 = "j1.msg",
  Jumper2 = "j2.msg",
  Jumper3 = "j3.msg",
  Jumper4 = "j4.msg",
  CyberSecTest = "csec-test.msg",
  NiteSecTest = "nitesec-test.msg",
  BitRunnersTest = "19dfj3l1nd.msg",
  TruthGazer = "truthgazer.msg",
  RedPill = "icarus.msg",
}

//Reset
const Messages: Record<MessageFilenames, Message> = {
  //jump3R Messages
  [MessageFilenames.Jumper0]: new Message(
    MessageFilenames.Jumper0,
    "I know you can sense it. I know you're searching for it. " +
      "It's why you spend night after " +
      "night at your computer. <br><br>It's real, I've seen it. And I can " +
      "help you find it. But not right now. You're not ready yet.<br><br>" +
      "Use this program to track your progress<br><br>" +
      "The fl1ght.exe program was added to your home computer<br><br>" +
      "-jump3R",
  ),

  [MessageFilenames.Jumper1]: new Message(
    MessageFilenames.Jumper1,
    `Soon you will be contacted by a hacking group known as ${FactionNames.NiteSec}. ` +
      "They can help you with your search. <br><br>" +
      "You should join them, garner their favor, and " +
      "exploit them for their Augmentations. But do not trust them. " +
      "They are not what they seem. No one is.<br><br>" +
      "-jump3R",
  ),

  [MessageFilenames.Jumper2]: new Message(
    MessageFilenames.Jumper2,
    "Do not try to save the world. There is no world to save. If " +
      "you want to find the truth, worry only about yourself. Ethics and " +
      `morals will get you killed. <br><br>Watch out for a hacking group known as ${FactionNames.NiteSec}.` +
      "<br><br>-jump3R",
  ),

  [MessageFilenames.Jumper3]: new Message(
    MessageFilenames.Jumper3,
    "You must learn to walk before you can run. And you must " +
      `run before you can fly. Look for ${FactionNames.TheBlackHand}. <br><br>` +
      "I.I.I.I <br><br>-jump3R",
  ),

  [MessageFilenames.Jumper4]: new Message(
    MessageFilenames.Jumper4,
    "To find what you are searching for, you must understand the bits. " +
      "The bits are all around us. The runners will help you.<br><br>" +
      "-jump3R",
  ),

  //Messages from hacking factions
  [MessageFilenames.CyberSecTest]: new Message(
    MessageFilenames.CyberSecTest,
    "We've been watching you. Your skills are very impressive. But you're wasting " +
      "your talents. If you join us, you can put your skills to good use and change " +
      "the world for the better. If you join us, we can unlock your full potential. <br><br>" +
      "But first, you must pass our test. Find and install the backdoor on our server. <br><br>" +
      `-${FactionNames.CyberSec}`,
  ),

  [MessageFilenames.NiteSecTest]: new Message(
    MessageFilenames.NiteSecTest,
    "People say that the corrupted governments and corporations rule the world. " +
      "Yes, maybe they do. But do you know who everyone really fears? People " +
      "like us. Because they can't hide from us. Because they can't fight shadows " +
      "and ideas with bullets. <br><br>" +
      "Join us, and people will fear you, too. <br><br>" +
      "Find and install the backdoor on our server, avmnite-02h. Then, we will contact you again." +
      `<br><br>-${FactionNames.NiteSec}`,
  ),

  [MessageFilenames.BitRunnersTest]: new Message(
    MessageFilenames.BitRunnersTest,
    "We know what you are doing. We know what drives you. We know " +
      "what you are looking for. <br><br> " +
      "We can help you find the answers.<br><br>" +
      "run4theh111z",
  ),

  //Messages to guide players to the daemon
  [MessageFilenames.TruthGazer]: new Message(
    MessageFilenames.TruthGazer,
    //"THE TRUTH CAN NO LONGER ESCAPE YOUR GAZE"
    "@&*($#@&__TH3__#@A&#@*)__TRU1H__(*)&*)($#@&()E&R)W&<br>" +
      "%@*$^$()@&$)$*@__CAN__()(@^#)@&@)#__N0__(#@&#)@&@&(<br>" +
      "*(__LON6ER__^#)@)(()*#@)@__ESCAP3__)#(@(#@*@()@(#*$<br>" +
      "()@)#$*%)$#()$#__Y0UR__(*)$#()%(&(%)*!)($__GAZ3__#(",
  ),

  [MessageFilenames.RedPill]: new Message(
    MessageFilenames.RedPill,
    //"FIND THE-CAVE"
    "@)(#V%*N)@(#*)*C)@#%*)*V)@#(*%V@)(#VN%*)@#(*%<br>" +
      ")@B(*#%)@)M#B*%V)____FIND___#$@)#%(B*)@#(*%B)<br>" +
      "@_#(%_@#M(BDSPOMB__THE-CAVE_#)$(*@#$)@#BNBEGB<br>" +
      "DFLSMFVMV)#@($*)@#*$MV)@#(*$V)M#(*$)M@(#*VM$)",
  ),
};

export { Messages, checkForMessagesToSend, showMessage };
