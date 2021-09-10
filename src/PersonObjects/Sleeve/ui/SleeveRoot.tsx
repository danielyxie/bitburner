import React, { useState, useEffect } from "react";

import { Sleeve } from "../Sleeve";
import { SleeveTaskType } from "../SleeveTaskTypesEnum";
import { SleeveFaq } from "../data/SleeveFaq";

import { IPlayer } from "../../IPlayer";

import { Faction } from "../../../Faction/Faction";
import { Factions } from "../../../Faction/Factions";
import { FactionWorkType } from "../../../Faction/FactionWorkTypeEnum";

import { Crime } from "../../../Crime/Crime";
import { Crimes } from "../../../Crime/Crimes";
import { CityName } from "../../../Locations/data/CityNames";
import { LocationName } from "../../../Locations/data/LocationNames";

import { numeralWrapper } from "../../../ui/numeralFormat";
import { Page, routing } from "../../../ui/navigationTracking";

import { dialogBoxCreate } from "../../../../utils/DialogBox";

import { createProgressBarText } from "../../../../utils/helpers/createProgressBarText";
import { exceptionAlert } from "../../../../utils/helpers/exceptionAlert";

import { clearEventListeners } from "../../../../utils/uiHelpers/clearEventListeners";
import { createElement } from "../../../../utils/uiHelpers/createElement";
import { createOptionElement } from "../../../../utils/uiHelpers/createOptionElement";
import { createPopup } from "../../../ui/React/createPopup";
import { getSelectValue } from "../../../../utils/uiHelpers/getSelectData";
import { removeChildrenFromElement } from "../../../../utils/uiHelpers/removeChildrenFromElement";
import { removeElement } from "../../../../utils/uiHelpers/removeElement";

import { SleeveAugmentationsPopup } from "../ui/SleeveAugmentationsPopup";
import { TravelPopup } from "../ui/TravelPopup";
import { EarningsTableElement } from "../ui/EarningsTableElement";
import { Money } from "../../../ui/React/Money";
import { MoneyRate } from "../../../ui/React/MoneyRate";
import { ReputationRate } from "../../../ui/React/ReputationRate";
import { StatsElement } from "../ui/StatsElement";
import { MoreStatsContent } from "../ui/MoreStatsContent";
import { MoreEarningsContent } from "../ui/MoreEarningsContent";
import { SleeveElem } from "../ui/SleeveElem";

interface IProps {
  player: IPlayer;
}

export function SleeveRoot(props: IProps): React.ReactElement {
  const setRerender = useState(false)[1];
  function rerender(): void {
    setRerender((old) => !old);
  }

  useEffect(() => {
    const id = setInterval(rerender, 150);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ width: "70%" }}>
      <h1>Sleeves</h1>
      <p>
        Duplicate Sleeves are MK-V Synthoids (synthetic androids) into which your consciousness has been copied. In
        other words, these Synthoids contain a perfect duplicate of your mind.
        <br />
        <br />
        Sleeves can be used to perform different tasks synchronously.
        <br />
        <br />
      </p>

      <button className="std-button" style={{ display: "inline-block" }}>
        FAQ
      </button>
      <a
        className="std-button"
        style={{ display: "inline-block" }}
        target="_blank"
        href="https://bitburner.readthedocs.io/en/latest/advancedgameplay/sleeves.html#duplicate-sleeves"
      >
        Documentation
      </a>
      <ul>
        {props.player.sleeves.map((sleeve, i) => (
          <li key={i}>
            <SleeveElem rerender={rerender} player={props.player} sleeve={sleeve} />
          </li>
        ))}
      </ul>
    </div>
  );
}
