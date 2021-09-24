import { DarkWebItems } from "./DarkWebItems";

import { Player } from "../Player";
import { Terminal } from "../Terminal";
import { SpecialServerIps } from "../Server/SpecialServerIps";
import { numeralWrapper } from "../ui/numeralFormat";

import { isValidIPAddress } from "../../utils/helpers/isValidIPAddress";

//Posts a "help" message if connected to DarkWeb
export function checkIfConnectedToDarkweb(): void {
  if (SpecialServerIps.hasOwnProperty("Darkweb Server")) {
    const darkwebIp = SpecialServerIps.getIp("Darkweb Server");
    if (!isValidIPAddress(darkwebIp)) {
      return;
    }
    const server = Player.getCurrentServer();
    if (server !== null && darkwebIp == server.ip) {
      Terminal.print(
        "You are now connected to the dark web. From the dark web you can purchase illegal items. " +
          "Use the 'buy -l' command to display a list of all the items you can buy. Use 'buy [item-name] " +
          "to purchase an item.",
      );
    }
  }
}

export function listAllDarkwebItems(): void {
  for (const key in DarkWebItems) {
    const item = DarkWebItems[key];
    Terminal.print(`${item.program} - ${numeralWrapper.formatMoney(item.price)} - ${item.description}`);
  }
}

export function buyDarkwebItem(itemName: string): void {
  itemName = itemName.toLowerCase();

  // find the program that matches, if any
  let item = null;
  for (const key in DarkWebItems) {
    const i = DarkWebItems[key];
    if (i.program.toLowerCase() == itemName) {
      item = i;
    }
  }

  // return if invalid
  if (item === null) {
    Terminal.print("Unrecognized item: " + itemName);
    return;
  }

  // return if the player already has it.
  if (Player.hasProgram(item.program)) {
    Terminal.print("You already have the " + item.program + " program");
    return;
  }

  // return if the player doesn't have enough money
  if (Player.money.lt(item.price)) {
    Terminal.print("Not enough money to purchase " + item.program);
    return;
  }

  // buy and push
  Player.loseMoney(item.price);
  Player.getHomeComputer().programs.push(item.program);
  Terminal.print(
    "You have purchased the " + item.program + " program. The new program can be found on your home computer.",
  );
}
