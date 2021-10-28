import React from "react";
import { DarkWebItems } from "./DarkWebItems";

import { Player } from "../Player";
import { Terminal } from "../Terminal";
import { SpecialServers } from "../Server/data/SpecialServers";
import { Money } from "../ui/React/Money";

//Posts a "help" message if connected to DarkWeb
export function checkIfConnectedToDarkweb(): void {
  const server = Player.getCurrentServer();
  if (server !== null && SpecialServers.DarkWeb == server.hostname) {
    Terminal.print(
      "You are now connected to the dark web. From the dark web you can purchase illegal items. " +
        "Use the 'buy -l' command to display a list of all the items you can buy. Use 'buy [item-name] " +
        "to purchase an item.",
    );
  }
}

export function listAllDarkwebItems(): void {
  for (const key in DarkWebItems) {
    const item = DarkWebItems[key];
    Terminal.printRaw(
      <>
        {item.program} - <Money money={item.price} /> - {item.description}
      </>,
    );
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
    Terminal.error("Unrecognized item: " + itemName);
    return;
  }

  // return if the player already has it.
  if (Player.hasProgram(item.program)) {
    Terminal.print("You already have the " + item.program + " program");
    return;
  }

  // return if the player doesn't have enough money
  if (Player.money.lt(item.price)) {
    Terminal.error("Not enough money to purchase " + item.program);
    return;
  }

  // buy and push
  Player.loseMoney(item.price, "other");
  Player.getHomeComputer().programs.push(item.program);
  Terminal.print(
    "You have purchased the " + item.program + " program. The new program can be found on your home computer.",
  );
}
