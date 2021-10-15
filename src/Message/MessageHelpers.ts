import { Message } from "./Message";
import { Augmentations } from "../Augmentation/Augmentations";
import { AugmentationNames } from "../Augmentation/data/AugmentationNames";
import { Programs } from "../Programs/Programs";
import { Player } from "../Player";
import { redPillFlag } from "../RedPill";
import { GetServer } from "../Server/AllServers";
import { Settings } from "../Settings/Settings";
import { dialogBoxCreate } from "../ui/React/DialogBox";
import { Reviver } from "../utils/JSONReviver";

//Sends message to player, including a pop up
function sendMessage(msg: Message, forced = false): void {
  msg.recvd = true;
  if (forced || !Settings.SuppressMessages) {
    showMessage(msg.filename);
  }
  addMessageToServer(msg, "home");
}

function showMessage(name: string): void {
  const msg = Messages[name];
  if (!msg) throw new Error("trying to display unexistent message");
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
function addMessageToServer(msg: Message, serverHostname: string): void {
  const server = GetServer(serverHostname);
  if (server == null) {
    console.warn(`Could not find server ${serverHostname}`);
    return;
  }
  for (let i = 0; i < server.messages.length; ++i) {
    const other = server.messages[i];
    if (msg.filename === other) {
      return; //Already exists
    }
  }
  server.messages.push(msg.filename);
}

//Checks if any of the 'timed' messages should be sent
function checkForMessagesToSend(): void {
  if (redPillFlag) return;
  const jumper0 = Messages[MessageFilenames.Jumper0];
  const jumper1 = Messages[MessageFilenames.Jumper1];
  const jumper2 = Messages[MessageFilenames.Jumper2];
  const jumper3 = Messages[MessageFilenames.Jumper3];
  const jumper4 = Messages[MessageFilenames.Jumper4];
  const cybersecTest = Messages[MessageFilenames.CyberSecTest];
  const nitesecTest = Messages[MessageFilenames.NiteSecTest];
  const bitrunnersTest = Messages[MessageFilenames.BitRunnersTest];
  const redpill = Messages[MessageFilenames.RedPill];

  let redpillOwned = false;
  if (Augmentations[AugmentationNames.TheRedPill].owned) {
    redpillOwned = true;
  }

  if (redpill && redpillOwned && Player.sourceFiles.length === 0 && !redPillFlag) {
    sendMessage(redpill, true);
  } else if (redpill && redpillOwned) {
    //If player has already destroyed a BitNode, message is not forced
    if (!redPillFlag) {
      sendMessage(redpill);
    }
  } else if (jumper0 && !jumper0.recvd && Player.hacking_skill >= 25) {
    sendMessage(jumper0);
    const flightName = Programs.Flight.name;
    const homeComp = Player.getHomeComputer();
    if (!homeComp.programs.includes(flightName)) {
      homeComp.programs.push(flightName);
    }
  } else if (jumper1 && !jumper1.recvd && Player.hacking_skill >= 40) {
    sendMessage(jumper1);
  } else if (cybersecTest && !cybersecTest.recvd && Player.hacking_skill >= 50) {
    sendMessage(cybersecTest);
  } else if (jumper2 && !jumper2.recvd && Player.hacking_skill >= 175) {
    sendMessage(jumper2);
  } else if (nitesecTest && !nitesecTest.recvd && Player.hacking_skill >= 200) {
    sendMessage(nitesecTest);
  } else if (jumper3 && !jumper3.recvd && Player.hacking_skill >= 350) {
    sendMessage(jumper3);
  } else if (jumper4 && !jumper4.recvd && Player.hacking_skill >= 490) {
    sendMessage(jumper4);
  } else if (bitrunnersTest && !bitrunnersTest.recvd && Player.hacking_skill >= 500) {
    sendMessage(bitrunnersTest);
  }
}

function AddToAllMessages(msg: Message): void {
  Messages[msg.filename] = msg;
}

let Messages: { [key: string]: Message | undefined } = {};

function loadMessages(saveString: string): void {
  Messages = JSON.parse(saveString, Reviver);
}

const MessageFilenames = {
  Jumper0: "j0.msg",
  Jumper1: "j1.msg",
  Jumper2: "j2.msg",
  Jumper3: "j3.msg",
  Jumper4: "j4.msg",
  CyberSecTest: "csec-test.msg",
  NiteSecTest: "nitesec-test.msg",
  BitRunnersTest: "19dfj3l1nd.msg",
  RedPill: "icarus.msg",
};

function initMessages(): void {
  //Reset
  Messages = {};

  //jump3R Messages
  AddToAllMessages(
    new Message(
      MessageFilenames.Jumper0,
      "I know you can sense it. I know you're searching for it. " +
        "It's why you spend night after " +
        "night at your computer. <br><br>It's real, I've seen it. And I can " +
        "help you find it. But not right now. You're not ready yet.<br><br>" +
        "Use this program to track your progress<br><br>" +
        "The fl1ght.exe program was added to your home computer<br><br>" +
        "-jump3R",
    ),
  );
  AddToAllMessages(
    new Message(
      MessageFilenames.Jumper1,
      "Soon you will be contacted by a hacking group known as CyberSec. " +
        "They can help you with your search. <br><br>" +
        "You should join them, garner their favor, and " +
        "exploit them for their Augmentations. But do not trust them. " +
        "They are not what they seem. No one is.<br><br>" +
        "-jump3R",
    ),
  );
  AddToAllMessages(
    new Message(
      MessageFilenames.Jumper2,
      "Do not try to save the world. There is no world to save. If " +
        "you want to find the truth, worry only about yourself. Ethics and " +
        "morals will get you killed. <br><br>Watch out for a hacking group known as NiteSec." +
        "<br><br>-jump3R",
    ),
  );
  AddToAllMessages(
    new Message(
      MessageFilenames.Jumper3,
      "You must learn to walk before you can run. And you must " +
        "run before you can fly. Look for the black hand. <br><br>" +
        "I.I.I.I <br><br>-jump3R",
    ),
  );
  AddToAllMessages(
    new Message(
      MessageFilenames.Jumper4,
      "To find what you are searching for, you must understand the bits. " +
        "The bits are all around us. The runners will help you.<br><br>" +
        "-jump3R",
    ),
  );

  //Messages from hacking factions
  AddToAllMessages(
    new Message(
      MessageFilenames.CyberSecTest,
      "We've been watching you. Your skills are very impressive. But you're wasting " +
        "your talents. If you join us, you can put your skills to good use and change " +
        "the world for the better. If you join us, we can unlock your full potential. <br><br>" +
        "But first, you must pass our test. Find and install the backdoor on our server. <br><br>" +
        "-CyberSec",
    ),
  );
  AddToAllMessages(
    new Message(
      MessageFilenames.NiteSecTest,
      "People say that the corrupted governments and corporations rule the world. " +
        "Yes, maybe they do. But do you know who everyone really fears? People " +
        "like us. Because they can't hide from us. Because they can't fight shadows " +
        "and ideas with bullets. <br><br>" +
        "Join us, and people will fear you, too. <br><br>" +
        "Find and install the backdoor on our server. Then, we will contact you again." +
        "<br><br>-NiteSec",
    ),
  );
  AddToAllMessages(
    new Message(
      MessageFilenames.BitRunnersTest,
      "We know what you are doing. We know what drives you. We know " +
        "what you are looking for. <br><br> " +
        "We can help you find the answers.<br><br>" +
        "run4theh111z",
    ),
  );

  AddToAllMessages(
    new Message(
      MessageFilenames.RedPill,
      "@)(#V%*N)@(#*)*C)@#%*)*V)@#(*%V@)(#VN%*)@#(*%<br>" +
        ")@B(*#%)@)M#B*%V)____FIND___#$@)#%(B*)@#(*%B)<br>" +
        "@_#(%_@#M(BDSPOMB__THE-CAVE_#)$(*@#$)@#BNBEGB<br>" +
        "DFLSMFVMV)#@($*)@#*$MV)@#(*$V)M#(*$)M@(#*VM$)",
    ),
  );
}

export { Messages, checkForMessagesToSend, showMessage, loadMessages, initMessages };
