/**
 * Root React Component for displaying a faction's "Purchase Augmentations" page
 */
import * as React from "react";

import { PurchaseableAugmentation } from "./PurchaseableAugmentation";

import { Augmentations } from "../../Augmentation/Augmentations";
import { AugmentationNames } from "../../Augmentation/data/AugmentationNames";
import { Faction } from "../../Faction/Faction";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { PurchaseAugmentationsOrderSetting } from "../../Settings/SettingEnums";
import { Settings } from "../../Settings/Settings";

import { StdButton } from "../../ui/React/StdButton";

type IProps = {
  faction: Faction;
  p: IPlayer;
  routeToMainPage: () => void;
};

type IState = {
  rerenderFlag: boolean;
  sortOrder: PurchaseAugmentationsOrderSetting;
};

const infoStyleMarkup = {
  width: "70%",
};

export class AugmentationsPage extends React.Component<IProps, IState> {
  // Flag for whether the player has a gang with this faction
  isPlayersGang: boolean;
  constructor(props: IProps) {
    super(props);

    this.isPlayersGang = props.p.inGang() && props.p.getGangName() === props.faction.name;

    this.state = {
      rerenderFlag: false,
      sortOrder: PurchaseAugmentationsOrderSetting.Default,
    };

    this.rerender = this.rerender.bind(this);
  }

  getAugs(): string[] {
    if (this.isPlayersGang) {
      const augs: string[] = [];
      for (const augName in Augmentations) {
        const aug = Augmentations[augName];
        if (!aug.isSpecial) {
          augs.push(augName);
        }
      }

      return augs;
    } else {
      return this.props.faction.augmentations.slice();
    }
  }

  getAugsSorted(): string[] {
    switch (Settings.PurchaseAugmentationsOrder) {
      case PurchaseAugmentationsOrderSetting.Cost: {
        return this.getAugsSortedByCost();
      }
      case PurchaseAugmentationsOrderSetting.Reputation: {
        return this.getAugsSortedByReputation();
      }
      default:
        return this.getAugsSortedByDefault();
    }
  }

  getAugsSortedByCost(): string[] {
    const augs = this.getAugs();
    augs.sort((augName1, augName2) => {
      const aug1 = Augmentations[augName1],
        aug2 = Augmentations[augName2];
      if (aug1 == null || aug2 == null) {
        throw new Error("Invalid Augmentation Names");
      }

      return aug1.baseCost - aug2.baseCost;
    });

    return augs;
  }

  getAugsSortedByReputation(): string[] {
    const augs = this.getAugs();
    augs.sort((augName1, augName2) => {
      const aug1 = Augmentations[augName1],
        aug2 = Augmentations[augName2];
      if (aug1 == null || aug2 == null) {
        throw new Error("Invalid Augmentation Names");
      }
      return aug1.baseRepRequirement - aug2.baseRepRequirement;
    });

    return augs;
  }

  getAugsSortedByDefault(): string[] {
    return this.getAugs();
  }

  switchSortOrder(newOrder: PurchaseAugmentationsOrderSetting): void {
    Settings.PurchaseAugmentationsOrder = newOrder;
    this.rerender();
  }

  rerender(): void {
    this.setState((prevState) => {
      return {
        rerenderFlag: !prevState.rerenderFlag,
      };
    });
  }

  render(): React.ReactNode {
    const augs = this.getAugsSorted();
    const purchasable = augs.filter(
      (aug: string) =>
        aug === AugmentationNames.NeuroFluxGovernor ||
        (!this.props.p.augmentations.some((a) => a.name === aug) &&
          !this.props.p.queuedAugmentations.some((a) => a.name === aug)),
    );

    const purchaseableAugmentation = (aug: string): React.ReactNode => {
      return (
        <PurchaseableAugmentation
          augName={aug}
          faction={this.props.faction}
          key={aug}
          p={this.props.p}
          rerender={this.rerender}
        />
      );
    };

    const augListElems = purchasable.map((aug) => purchaseableAugmentation(aug));

    let ownedElem = <></>;
    const owned = augs.filter((aug: string) => !purchasable.includes(aug));
    if (owned.length !== 0) {
      ownedElem = (
        <>
          <br />
          <h2>Purchased Augmentations</h2>
          <p style={infoStyleMarkup}>This factions also offers these augmentations but you already own them.</p>
          {owned.map((aug) => purchaseableAugmentation(aug))}
        </>
      );
    }

    return (
      <div>
        <StdButton onClick={this.props.routeToMainPage} text={"Back"} />
        <h1>Faction Augmentations</h1>
        <p style={infoStyleMarkup}>
          These are all of the Augmentations that are available to purchase from {this.props.faction.name}.
          Augmentations are powerful upgrades that will enhance your abilities.
        </p>
        <StdButton onClick={() => this.switchSortOrder(PurchaseAugmentationsOrderSetting.Cost)} text={"Sort by Cost"} />
        <StdButton
          onClick={() => this.switchSortOrder(PurchaseAugmentationsOrderSetting.Reputation)}
          text={"Sort by Reputation"}
        />
        <StdButton
          onClick={() => this.switchSortOrder(PurchaseAugmentationsOrderSetting.Default)}
          text={"Sort by Default Order"}
        />
        <br />
        {augListElems}
        {ownedElem}
      </div>
    );
  }
}
