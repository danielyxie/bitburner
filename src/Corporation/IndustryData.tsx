import React from "react";
import { ResearchTree } from "./ResearchTree";
import { Corporation } from "./Corporation";
import { getBaseResearchTreeCopy, getProductIndustryResearchTreeCopy } from "./data/BaseResearchTree";
import { MoneyCost } from "./ui/MoneyCost";
import { IMap } from "src/types";

interface IIndustryMap<T> {
  [key: string]: T | undefined;
  Energy: T;
  Utilities: T;
  Agriculture: T;
  Fishing: T;
  Mining: T;
  Food: T;
  Tobacco: T;
  Chemical: T;
  Pharmaceutical: T;
  Computer: T;
  Robotics: T;
  Software: T;
  Healthcare: T;
  RealEstate: T;
}

// Map of official names for each Industry
export const Industries: IIndustryMap<string> = {
  Energy: "Energy",
  Utilities: "Utilities",
  Agriculture: "Agriculture",
  Fishing: "Fishing",
  Mining: "Mining",
  Food: "Food",
  Tobacco: "Tobacco",
  Chemical: "Chemical",
  Pharmaceutical: "Pharmaceutical",
  Computer: "Computer",
  Robotics: "Robotics",
  Software: "Software",
  Healthcare: "Healthcare",
  RealEstate: "RealEstate",
};

// Map of how much money it takes to start each industry
export const IndustryStartingCosts: IIndustryMap<number> = {
  Energy: 225e9,
  Utilities: 150e9,
  Agriculture: 40e9,
  Fishing: 80e9,
  Mining: 300e9,
  Food: 10e9,
  Tobacco: 20e9,
  Chemical: 70e9,
  Pharmaceutical: 200e9,
  Computer: 500e9,
  Robotics: 1e12,
  Software: 25e9,
  Healthcare: 750e9,
  RealEstate: 600e9,
};

export const IndustryMaterialFactors: IMap<any> = {
  [Industries.Energy]: {
    reFac: 0.65,
    sciFac: 0.7,
    hwFac: 0,
    robFac: 0.05,
    aiFac: 0.3,
    advFac: 0.08,
    reqMats: {
      Hardware: 0.1,
      Metal: 0.2,
    },
    prodMats: ["Energy"],
  },
  [Industries.Utilities]: {
    reFac: 0.5,
    sciFac: 0.6,
    hwFac: 0,
    robFac: 0.4,
    aiFac: 0.4,
    advFac: 0.08,
    reqMats: {
      Hardware: 0.1,
      Metal: 0.1,
    },
    prodMats: ["Water"],
  },
  [Industries.Agriculture]: {
    reFac: 0.72,
    sciFac: 0.5,
    hwFac: 0.2,
    robFac: 0.3,
    aiFac: 0.3,
    advFac: 0.04,
    reqMats: {
      Water: 0.5,
      Energy: 0.5,
    },
    prodMats: ["Plants", "Food"],
  },
  [Industries.Fishing]: {
    reFac: 0.15,
    sciFac: 0.35,
    hwFac: 0.35,
    robFac: 0.5,
    aiFac: 0.2,
    advFac: 0.08,
    reqMats: {
      Energy: 0.5,
    },
    prodMats: ["Food"],
  },
  [Industries.Mining]: {
    reFac: 0.3,
    sciFac: 0.26,
    hwFac: 0.4,
    robFac: 0.45,
    aiFac: 0.45,
    advFac: 0.06,
    reqMats: {
      Energy: 0.8,
    },
    prodMats: ["Metal"],
  },
  [Industries.Food]: {
    reFac: 0.05,
    sciFac: 0.12,
    hwFac: 0.15,
    robFac: 0.3,
    aiFac: 0.25,
    advFac: 0.25,
    reqMats: {
      Food: 0.5,
      Water: 0.5,
      Energy: 0.2,
    },
  },
  [Industries.Tobacco]: {
    reFac: 0.15,
    sciFac: 0.75,
    hwFac: 0.15,
    robFac: 0.2,
    aiFac: 0.15,
    advFac: 0.2,
    reqMats: {
      Plants: 1,
      Water: 0.2,
    },
  },
  [Industries.Chemical]: {
    reFac: 0.25,
    sciFac: 0.75,
    hwFac: 0.2,
    robFac: 0.25,
    aiFac: 0.2,
    advFac: 0.07,
    reqMats: {
      Plants: 1,
      Energy: 0.5,
      Water: 0.5,
    },
    prodMats: ["Chemicals"],
  },
  [Industries.Pharmaceutical]: {
    reFac: 0.05,
    sciFac: 0.8,
    hwFac: 0.15,
    robFac: 0.25,
    aiFac: 0.2,
    advFac: 0.16,
    reqMats: {
      Chemicals: 2,
      Energy: 1,
      Water: 0.5,
    },
    prodMats: ["Drugs"],
  },
  [Industries.Computer]: {
    reFac: 0.2,
    sciFac: 0.62,
    hwFac: 0,
    robFac: 0.36,
    aiFac: 0.19,
    advFac: 0.17,
    reqMats: {
      Metal: 2,
      Energy: 1,
    },
    prodMats: ["Hardware"],
  },
  [Industries.Robotics]: {
    reFac: 0.32,
    sciFac: 0.65,
    hwFac: 0.19,
    robFac: 0,
    aiFac: 0.36,
    advFac: 0.18,
    reqMats: {
      Hardware: 5,
      Energy: 3,
    },
    prodMats: ["Robots"],
  },
  [Industries.Software]: {
    reFac: 0.15,
    sciFac: 0.62,
    hwFac: 0.25,
    robFac: 0.05,
    aiFac: 0.18,
    advFac: 0.16,
    reqMats: {
      Hardware: 0.5,
      Energy: 0.5,
    },
    prodMats: ["AICores"],
  },
  [Industries.Healthcare]: {
    reFac: 0.1,
    sciFac: 0.75,
    hwFac: 0.1,
    robFac: 0.1,
    aiFac: 0.1,
    advFac: 0.11,
    reqMats: {
      Robots: 10,
      AICores: 5,
      Energy: 5,
      Water: 5,
    },
  },
  [Industries.RealEstate]: {
    reFac: 0,
    sciFac: 0.05,
    hwFac: 0.05,
    robFac: 0.6,
    aiFac: 0.6,
    advFac: 0.25,
    reqMats: {
      Metal: 5,
      Energy: 5,
      Water: 2,
      Hardware: 4,
    },
    prodMats: ["RealEstate"],
  },
};

// Map of description for each industry
export const IndustryDescriptions: IIndustryMap<(corp: Corporation) => React.ReactElement> = {
  Energy: (corp: Corporation) => (
    <>
      Engage in the production and distribution of energy.
      <br />
      <br />
      Starting cost: <MoneyCost money={IndustryStartingCosts.Energy} corp={corp} />
      <br />
      Recommended starting Industry: NO
    </>
  ),
  Utilities: (corp: Corporation) => (
    <>
      Distribute water and provide wastewater services.
      <br />
      <br />
      Starting cost: <MoneyCost money={IndustryStartingCosts.Utilities} corp={corp} />
      <br />
      Recommended starting Industry: NO
    </>
  ),
  Agriculture: (corp: Corporation) => (
    <>
      Cultivate crops and breed livestock to produce food.
      <br />
      <br />
      Starting cost: <MoneyCost money={IndustryStartingCosts.Agriculture} corp={corp} />
      <br />
      Recommended starting Industry: YES
    </>
  ),
  Fishing: (corp: Corporation) => (
    <>
      Produce food through the breeding and processing of fish and fish products.
      <br />
      <br />
      Starting cost: <MoneyCost money={IndustryStartingCosts.Fishing} corp={corp} />
      <br />
      Recommended starting Industry: NO
    </>
  ),
  Mining: (corp: Corporation) => (
    <>
      Extract and process metals from the earth.
      <br />
      <br />
      Starting cost: <MoneyCost money={IndustryStartingCosts.Mining} corp={corp} />
      <br />
      Recommended starting Industry: NO
    </>
  ),
  Food: (corp: Corporation) => (
    <>
      Create your own restaurants all around the world.
      <br />
      <br />
      Starting cost: <MoneyCost money={IndustryStartingCosts.Food} corp={corp} />
      <br />
      Recommended starting Industry: YES
    </>
  ),
  Tobacco: (corp: Corporation) => (
    <>
      Create and distribute tobacco and tobacco-related products.
      <br />
      <br />
      Starting cost: <MoneyCost money={IndustryStartingCosts.Tobacco} corp={corp} />
      <br />
      Recommended starting Industry: YES
    </>
  ),
  Chemical: (corp: Corporation) => (
    <>
      Produce industrial chemicals.
      <br />
      <br />
      Starting cost: <MoneyCost money={IndustryStartingCosts.Chemical} corp={corp} />
      <br />
      Recommended starting Industry: NO
    </>
  ),
  Pharmaceutical: (corp: Corporation) => (
    <>
      Discover, develop, and create new pharmaceutical drugs.
      <br />
      <br />
      Starting cost: <MoneyCost money={IndustryStartingCosts.Pharmaceutical} corp={corp} />
      <br />
      Recommended starting Industry: NO
    </>
  ),
  Computer: (corp: Corporation) => (
    <>
      Develop and manufacture new computer hardware and networking infrastructures.
      <br />
      <br />
      Starting cost: <MoneyCost money={IndustryStartingCosts.Computer} corp={corp} />
      <br />
      Recommended starting Industry: NO
    </>
  ),
  Robotics: (corp: Corporation) => (
    <>
      Develop and create robots.
      <br />
      <br />
      Starting cost: <MoneyCost money={IndustryStartingCosts.Robotics} corp={corp} />
      <br />
      Recommended starting Industry: NO
    </>
  ),
  Software: (corp: Corporation) => (
    <>
      Develop computer software and create AI Cores.
      <br />
      <br />
      Starting cost: <MoneyCost money={IndustryStartingCosts.Software} corp={corp} />
      <br />
      Recommended starting Industry: YES
    </>
  ),
  Healthcare: (corp: Corporation) => (
    <>
      Create and manage hospitals.
      <br />
      <br />
      Starting cost: <MoneyCost money={IndustryStartingCosts.Healthcare} corp={corp} />
      <br />
      Recommended starting Industry: NO
    </>
  ),
  RealEstate: (corp: Corporation) => (
    <>
      Develop and manage real estate properties.
      <br />
      <br />
      Starting cost: <MoneyCost money={IndustryStartingCosts.RealEstate} corp={corp} />
      <br />
      Recommended starting Industry: NO
    </>
  ),
};

// Map of available Research for each Industry. This data is held in a
// ResearchTree object
export const IndustryResearchTrees: IIndustryMap<ResearchTree> = {
  Energy: getBaseResearchTreeCopy(),
  Utilities: getBaseResearchTreeCopy(),
  Agriculture: getBaseResearchTreeCopy(),
  Fishing: getBaseResearchTreeCopy(),
  Mining: getBaseResearchTreeCopy(),
  Food: getProductIndustryResearchTreeCopy(),
  Tobacco: getProductIndustryResearchTreeCopy(),
  Chemical: getBaseResearchTreeCopy(),
  Pharmaceutical: getProductIndustryResearchTreeCopy(),
  Computer: getProductIndustryResearchTreeCopy(),
  Robotics: getProductIndustryResearchTreeCopy(),
  Software: getProductIndustryResearchTreeCopy(),
  Healthcare: getProductIndustryResearchTreeCopy(),
  RealEstate: getProductIndustryResearchTreeCopy(),
};

export function resetIndustryResearchTrees(): void {
  IndustryResearchTrees.Energy = getBaseResearchTreeCopy();
  IndustryResearchTrees.Utilities = getBaseResearchTreeCopy();
  IndustryResearchTrees.Agriculture = getBaseResearchTreeCopy();
  IndustryResearchTrees.Fishing = getBaseResearchTreeCopy();
  IndustryResearchTrees.Mining = getBaseResearchTreeCopy();
  IndustryResearchTrees.Food = getProductIndustryResearchTreeCopy();
  IndustryResearchTrees.Tobacco = getProductIndustryResearchTreeCopy();
  IndustryResearchTrees.Chemical = getBaseResearchTreeCopy();
  IndustryResearchTrees.Pharmaceutical = getProductIndustryResearchTreeCopy();
  IndustryResearchTrees.Computer = getProductIndustryResearchTreeCopy();
  IndustryResearchTrees.Robotics = getProductIndustryResearchTreeCopy();
  IndustryResearchTrees.Software = getProductIndustryResearchTreeCopy();
  IndustryResearchTrees.Healthcare = getProductIndustryResearchTreeCopy();
  IndustryResearchTrees.RealEstate = getProductIndustryResearchTreeCopy();
}
