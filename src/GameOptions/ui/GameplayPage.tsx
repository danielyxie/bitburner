import React from "react";
import { OptionSwitch } from "../../ui/React/OptionSwitch";
import { Settings } from "../../Settings/Settings";
import { GameOptionsPage } from "./GameOptionsPage";
import { Player } from "../../Player";

export const GameplayPage = (): React.ReactElement => {
  return (
    <GameOptionsPage title="Gameplay">
      <OptionSwitch
        checked={Settings.SuppressMessages}
        onChange={(newValue) => (Settings.SuppressMessages = newValue)}
        text="Suppress story messages"
        tooltip={
          <>
            If this is set, then any messages you receive will not appear as popups on the screen. They will still get
            sent to your home computer as '.msg' files and can be viewed with the 'cat' Terminal command.
          </>
        }
      />
      <OptionSwitch
        checked={Settings.SuppressFactionInvites}
        onChange={(newValue) => (Settings.SuppressFactionInvites = newValue)}
        text="Suppress faction invites"
        tooltip={
          <>
            If this is set, then any faction invites you receive will not appear as popups on the screen. Your
            outstanding faction invites can be viewed in the 'Factions' page.
          </>
        }
      />
      <OptionSwitch
        checked={Settings.SuppressTravelConfirmation}
        onChange={(newValue) => (Settings.SuppressTravelConfirmation = newValue)}
        text="Suppress travel confirmations"
        tooltip={
          <>
            If this is set, the confirmation message before traveling will not show up. You will automatically be
            deducted the travel cost as soon as you click.
          </>
        }
      />
      <OptionSwitch
        checked={Settings.SuppressBuyAugmentationConfirmation}
        onChange={(newValue) => (Settings.SuppressBuyAugmentationConfirmation = newValue)}
        text="Suppress augmentations confirmation"
        tooltip={<>If this is set, the confirmation message before buying augmentation will not show up.</>}
      />
      <OptionSwitch
        checked={Settings.SuppressTIXPopup}
        onChange={(newValue) => (Settings.SuppressTIXPopup = newValue)}
        text="Suppress TIX messages"
        tooltip={<>If this is set, the stock market will never create any popup.</>}
      />
      {Player.bladeburner && (
        <OptionSwitch
          checked={Settings.SuppressBladeburnerPopup}
          onChange={(newValue) => (Settings.SuppressBladeburnerPopup = newValue)}
          text="Suppress bladeburner popup"
          tooltip={
            <>
              If this is set, then having your Bladeburner actions interrupted by being busy with something else will
              not display a popup message.
            </>
          }
        />
      )}
    </GameOptionsPage>
  );
};
