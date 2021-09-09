import React, { useState, useEffect } from "react";
import { Sleeve } from "../Sleeve";
import { findSleevePurchasableAugs } from "../SleeveHelpers";
import { Augmentations } from "../../../Augmentation/Augmentations";
import { Augmentation } from "../../../Augmentation/Augmentation";
import { IPlayer } from "../../IPlayer";
import { Money } from "../../../ui/React/Money";
import { renderToStaticMarkup } from "react-dom/server";

interface IProps {
  sleeve: Sleeve;
  player: IPlayer;
}

export function SleeveAugmentationsPopup(props: IProps): React.ReactElement {
  const setRerender = useState(false)[1];
  function rerender(): void {
    setRerender((old) => !old);
  }

  useEffect(() => {
    const id = setInterval(rerender, 150);
    return () => clearInterval(id);
  }, []);

  // Array of all owned Augmentations. Names only
  const ownedAugNames = props.sleeve.augmentations.map((e) => e.name);

  // You can only purchase Augmentations that are actually available from
  // your factions. I.e. you must be in a faction that has the Augmentation
  // and you must also have enough rep in that faction in order to purchase it.
  const availableAugs = findSleevePurchasableAugs(props.sleeve, props.player);

  function purchaseAugmentation(aug: Augmentation): void {
    props.sleeve.tryBuyAugmentation(props.player, aug);
    rerender();
  }

  return (
    <div className="noselect">
      <p style={{ display: "block" }}>Owned Augmentations:</p>
      <div style={{ width: "70%" }}>
        {ownedAugNames.map((augName) => {
          const aug = Augmentations[augName];
          let tooltip = aug.info;
          if (typeof tooltip !== "string") {
            tooltip = renderToStaticMarkup(tooltip);
          }
          tooltip += "<br /><br />";
          tooltip += renderToStaticMarkup(aug.stats);
          return (
            <div key={augName} className="gang-owned-upgrade tooltip">
              {augName}
              <span className="tooltiptext" dangerouslySetInnerHTML={{ __html: tooltip }}></span>
            </div>
          );
        })}
      </div>
      <p>
        You can purchase Augmentations for your Duplicate Sleeves. These Augmentations have the same effect as they
        would for you. You can only purchase Augmentations that you have unlocked through Factions.
        <br />
        <br />
        When purchasing an Augmentation for a Duplicate Sleeve, they are immediately installed. This means that the
        Duplicate Sleeve will immediately lose all of its stat experience.
      </p>
      {availableAugs.map((aug) => {
        let info = aug.info;
        if (typeof info !== "string") {
          info = renderToStaticMarkup(info);
        }
        info += "<br /><br />";
        info += renderToStaticMarkup(aug.stats);

        return (
          <div key={aug.name} className="cmpy-mgmt-upgrade-div" onClick={() => purchaseAugmentation(aug)}>
            <div style={{ fontSize: "12px", padding: "2px" }}>
              <h2>{aug.name}</h2>
              <br />
              Cost: <Money money={aug.startingCost} player={props.player} />
              <br />
              <br />
              <span dangerouslySetInnerHTML={{ __html: info }}></span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
