export interface CorporationUpgrade {
  index: number;
  basePrice: number;
  priceMult: number;
  benefit: number;
  name: string;
  desc: string;
}

export enum CorporationUpgradeIndex {
  SmartFactories = 0,
  SmartStorage = 1,
  DreamSense = 2,
  WilsonAnalytics = 3,
  NuoptimalNootropicInjectorImplants = 4,
  SpeechProcessorImplants = 5,
  NeuralAccelerators = 6,
  FocusWires = 7,
  ABCSalesBots = 8,
  ProjectInsight = 9,
}

// Corporation Upgrades
// Upgrades for entire corporation, levelable upgrades
// The data structure is an array with the following format
//  [index in Corporation upgrades array, base price, price mult, benefit mult (additive), name, desc]
export const CorporationUpgrades: Record<CorporationUpgradeIndex, CorporationUpgrade> = {
  //Smart factories, increases production
  [CorporationUpgradeIndex.SmartFactories]: {
    index: CorporationUpgradeIndex.SmartFactories,
    basePrice: 2e9,
    priceMult: 1.06,
    benefit: 0.03,
    name: "Smart Factories",
    desc:
      "Advanced AI automatically optimizes the operation and productivity " +
      "of factories. Each level of this upgrade increases your global production by 3% (additive).",
  },

  //Smart warehouses, increases storage size
  [CorporationUpgradeIndex.SmartStorage]: {
    index: CorporationUpgradeIndex.SmartStorage,
    basePrice: 2e9,
    priceMult: 1.06,
    benefit: 0.1,
    name: "Smart Storage",
    desc:
      "Advanced AI automatically optimizes your warehouse storage methods. " +
      "Each level of this upgrade increases your global warehouse storage size by 10% (additive).",
  },

  //Advertise through dreams, passive popularity/ awareness gain
  [CorporationUpgradeIndex.DreamSense]: {
    index: CorporationUpgradeIndex.DreamSense,
    basePrice: 4e9,
    priceMult: 1.1,
    benefit: 0.001,
    name: "DreamSense",
    desc:
      "Use DreamSense LCC Technologies to advertise your corporation " +
      "to consumers through their dreams. Each level of this upgrade provides a passive " +
      "increase in awareness of all of your companies (divisions) by 0.004 / market cycle," +
      "and in popularity by 0.001 / market cycle. A market cycle is approximately " +
      "15 seconds.",
  },

  //Makes advertising more effective
  [CorporationUpgradeIndex.WilsonAnalytics]: {
    index: CorporationUpgradeIndex.WilsonAnalytics,
    basePrice: 4e9,
    priceMult: 1.5,
    benefit: 0.005,
    name: "Wilson Analytics",
    desc:
      "Purchase data and analysis from Wilson, a marketing research " +
      "firm. Each level of this upgrades increases the effectiveness of your " +
      "advertising by 0.5% (additive).",
  },

  //Augmentation for employees, increases cre
  [CorporationUpgradeIndex.NuoptimalNootropicInjectorImplants]: {
    index: CorporationUpgradeIndex.NuoptimalNootropicInjectorImplants,
    basePrice: 1e9,
    priceMult: 1.06,
    benefit: 0.1,
    name: "Nuoptimal Nootropic Injector Implants",
    desc:
      "Purchase the Nuoptimal Nootropic " +
      "Injector augmentation for your employees. Each level of this upgrade " +
      "globally increases the creativity of your employees by 10% (additive).",
  },

  //Augmentation for employees, increases cha
  [CorporationUpgradeIndex.SpeechProcessorImplants]: {
    index: CorporationUpgradeIndex.SpeechProcessorImplants,
    basePrice: 1e9,
    priceMult: 1.06,
    benefit: 0.1,
    name: "Speech Processor Implants",
    desc:
      "Purchase the Speech Processor augmentation for your employees. " +
      "Each level of this upgrade globally increases the charisma of your employees by 10% (additive).",
  },

  //Augmentation for employees, increases int
  [CorporationUpgradeIndex.NeuralAccelerators]: {
    index: CorporationUpgradeIndex.NeuralAccelerators,
    basePrice: 1e9,
    priceMult: 1.06,
    benefit: 0.1,
    name: "Neural Accelerators",
    desc:
      "Purchase the Neural Accelerator augmentation for your employees. " +
      "Each level of this upgrade globally increases the intelligence of your employees " +
      "by 10% (additive).",
  },

  //Augmentation for employees, increases eff
  [CorporationUpgradeIndex.FocusWires]: {
    index: CorporationUpgradeIndex.FocusWires,
    basePrice: 1e9,
    priceMult: 1.06,
    benefit: 0.1,
    name: "FocusWires",
    desc:
      "Purchase the FocusWire augmentation for your employees. Each level " +
      "of this upgrade globally increases the efficiency of your employees by 10% (additive).",
  },

  //Improves sales of materials/products
  [CorporationUpgradeIndex.ABCSalesBots]: {
    index: CorporationUpgradeIndex.ABCSalesBots,
    basePrice: 1e9,
    priceMult: 1.07,
    benefit: 0.01,
    name: "ABC SalesBots",
    desc:
      "Always Be Closing. Purchase these robotic salesmen to increase the amount of " +
      "materials and products you sell. Each level of this upgrade globally increases your sales " +
      "by 1% (additive).",
  },

  //Improves scientific research rate
  [CorporationUpgradeIndex.ProjectInsight]: {
    index: CorporationUpgradeIndex.ProjectInsight,
    basePrice: 5e9,
    priceMult: 1.07,
    benefit: 0.05,
    name: "Project Insight",
    desc:
      "Purchase 'Project Insight', a R&D service provided by the secretive " +
      "Fulcrum Technologies. Each level of this upgrade globally increases the amount of " +
      "Scientific Research you produce by 5% (additive).",
  },
};
