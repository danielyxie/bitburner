export interface CorporationUnlockUpgrade {
  index: number;
  price: number;
  name: string;
  desc: string;
}

export enum CorporationUnlockUpgradeIndex {
  Export = 0,
  SmartSupply = 1,
  MarketResearchDemand = 2,
  MarketDataCompetition = 3,
  VeChain = 4,
  ShadyAccounting = 5,
  GovernmentPartnership = 6,
  WarehouseAPI = 7,
  OfficeAPI = 8,
}

// Corporation Unlock Upgrades
// Upgrades for entire corporation, unlocks features, either you have it or you don't.
export const CorporationUnlockUpgrades: Record<CorporationUnlockUpgradeIndex, CorporationUnlockUpgrade> = {
  //Lets you export goods
  [CorporationUnlockUpgradeIndex.Export]: {
    index: 0,
    price: 20e9,
    name: "Export",
    desc:
      "Develop infrastructure to export your materials to your other facilities. " +
      "This allows you to move materials around between different divisions and cities.",
  },

  //Lets you buy exactly however many required materials you need for production
  [CorporationUnlockUpgradeIndex.SmartSupply]: {
    index: 1,
    price: 25e9,
    name: "Smart Supply",
    desc:
      "Use advanced AI to anticipate your supply needs. " +
      "This allows you to purchase exactly however many materials you need for production.",
  },

  //Displays each material/product's demand
  [CorporationUnlockUpgradeIndex.MarketResearchDemand]: {
    index: 2,
    price: 5e9,
    name: "Market Research - Demand",
    desc:
      "Mine and analyze market data to determine the demand of all resources. " +
      "The demand attribute, which affects sales, will be displayed for every material and product.",
  },

  //Display's each material/product's competition
  [CorporationUnlockUpgradeIndex.MarketDataCompetition]: {
    index: 3,
    price: 5e9,
    name: "Market Data - Competition",
    desc:
      "Mine and analyze market data to determine how much competition there is on the market " +
      "for all resources. The competition attribute, which affects sales, will be displayed for " +
      "every material and product.",
  },
  [CorporationUnlockUpgradeIndex.VeChain]: {
    index: 4,
    price: 10e9,
    name: "VeChain",
    desc:
      "Use AI and blockchain technology to identify where you can improve your supply chain systems. " +
      "This upgrade will allow you to view a wide array of useful statistics about your " +
      "Corporation.",
  },
  [CorporationUnlockUpgradeIndex.ShadyAccounting]: {
    index: 5,
    price: 500e12,
    name: "Shady Accounting",
    desc:
      "Utilize unscrupulous accounting practices and pay off government officials to save money " +
      "on taxes. This reduces the dividend tax rate by 5%.",
  },
  [CorporationUnlockUpgradeIndex.GovernmentPartnership]: {
    index: 6,
    price: 2e15,
    name: "Government Partnership",
    desc:
      "Help national governments further their agendas in exchange for lowered taxes. " +
      "This reduces the dividend tax rate by 10%",
  },
  [CorporationUnlockUpgradeIndex.WarehouseAPI]: {
    index: 7,
    price: 50e9,
    name: "Warehouse API",
    desc: "Enables the warehouse API.",
  },
  [CorporationUnlockUpgradeIndex.OfficeAPI]: {
    index: 8,
    price: 50e9,
    name: "Office API",
    desc: "Enables the office API.",
  },
};
