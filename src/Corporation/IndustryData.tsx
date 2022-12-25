import React from "react";
import { ResearchTree } from "./ResearchTree";
import { Corporation } from "./Corporation";
import { getBaseResearchTreeCopy, getProductIndustryResearchTreeCopy } from "./data/BaseResearchTree";
import { MoneyCost } from "./ui/MoneyCost";

export enum IndustryType {
  Energy = "Energy",
  Utilities = "Water Utilities",
  Agriculture = "Agriculture",
  Fishing = "Fishing",
  Mining = "Mining",
  Food = "Food",
  Tobacco = "Tobacco",
  Chemical = "Chemical",
  Pharmaceutical = "Pharmaceutical",
  Computers = "Computer Hardware",
  Robotics = "Robotics",
  Software = "Software",
  Healthcare = "Healthcare",
  RealEstate = "RealEstate",
}

export interface IProductRatingWeight {
  Aesthetics?: number;
  Durability?: number;
  Features?: number;
  Quality?: number;
  Performance?: number;
  Reliability?: number;
}

type IndustryData = {
  startingCost: number;
  description: string;
  /** Product name for industry. Empty string for industries with no products. */
  product?: { name: string; verb: string; desc: string };
  ProductRatingWeights?: IProductRatingWeight;
  recommendStarting: boolean;
  reqMats: Record<string, number>;
  /** Real estate factor */
  reFac?: number;
  /** Scientific research factor (affects quality) */
  sciFac?: number;
  /** Hardware factor */
  hwFac?: number;
  /** Robots factor */
  robFac?: number;
  /** AI Cores factor */
  aiFac?: number;
  /** Advertising factor (affects sales) */
  advFac?: number;
  prodMats?: string[];
};

export const IndustriesData: Record<IndustryType, IndustryData> = {
  [IndustryType.Agriculture]: {
    startingCost: 40e9,
    description: "Cultivate crops and breed livestock to produce food.",
    recommendStarting: true,
    reFac: 0.72,
    sciFac: 0.5,
    hwFac: 0.2,
    robFac: 0.3,
    aiFac: 0.3,
    advFac: 0.04,
    reqMats: { Water: 0.5, Energy: 0.5 },
    prodMats: ["Plants", "Food"],
  },
  [IndustryType.Chemical]: {
    startingCost: 70e9,
    description: "Produce industrial chemicals.",
    recommendStarting: false,
    reFac: 0.25,
    sciFac: 0.75,
    hwFac: 0.2,
    robFac: 0.25,
    aiFac: 0.2,
    advFac: 0.07,
    reqMats: { Plants: 1, Energy: 0.5, Water: 0.5 },
    prodMats: ["Chemicals"],
  },
  [IndustryType.Computers]: {
    startingCost: 500e9,
    description: "Develop and manufacture new computer hardware and networking infrastructures.",
    product: { name: "Product", verb: "Create", desc: "Design and manufacture a new computer hardware product!" },
    ProductRatingWeights: {
      Quality: 0.15,
      Performance: 0.25,
      Durability: 0.25,
      Reliability: 0.2,
      Aesthetics: 0.05,
      Features: 0.1,
    },
    recommendStarting: false,
    reFac: 0.2,
    sciFac: 0.62,
    robFac: 0.36,
    aiFac: 0.19,
    advFac: 0.17,
    reqMats: { Metal: 2, Energy: 1 },
    prodMats: ["Hardware"],
  },
  [IndustryType.Energy]: {
    startingCost: 225e9,
    description: "Engage in the production and distribution of energy.",
    recommendStarting: false,
    reFac: 0.65,
    sciFac: 0.7,
    robFac: 0.05,
    aiFac: 0.3,
    advFac: 0.08,
    reqMats: { Hardware: 0.1, Metal: 0.2 },
    prodMats: ["Energy"],
  },
  [IndustryType.Fishing]: {
    startingCost: 80e9,
    description: "Produce food through the breeding and processing of fish and fish products.",
    recommendStarting: false,
    reFac: 0.15,
    sciFac: 0.35,
    hwFac: 0.35,
    robFac: 0.5,
    aiFac: 0.2,
    advFac: 0.08,
    reqMats: { Energy: 0.5 },
    prodMats: ["Food"],
  },
  [IndustryType.Food]: {
    startingCost: 10e9,
    description: "Create your own restaurants all around the world.",
    product: { name: "Restaurant", verb: "Build", desc: "Build and manage a new restaurant!" },
    ProductRatingWeights: {
      Quality: 0.7,
      Durability: 0.1,
      Aesthetics: 0.2,
    },
    recommendStarting: true,
    sciFac: 0.12,
    hwFac: 0.15,
    robFac: 0.3,
    aiFac: 0.25,
    advFac: 0.25,
    reFac: 0.05,
    reqMats: { Food: 0.5, Water: 0.5, Energy: 0.2 },
  },
  [IndustryType.Healthcare]: {
    startingCost: 750e9,
    description: "Create and manage hospitals.",
    product: { name: "Hospital", verb: "Build", desc: "Build and manage a new hospital!" },
    ProductRatingWeights: {
      Quality: 0.4,
      Performance: 0.1,
      Durability: 0.1,
      Reliability: 0.3,
      Features: 0.1,
    },
    recommendStarting: false,
    reFac: 0.1,
    sciFac: 0.75,
    advFac: 0.11,
    hwFac: 0.1,
    robFac: 0.1,
    aiFac: 0.1,
    reqMats: { Robots: 10, AICores: 5, Energy: 5, Water: 5 },
  },
  [IndustryType.Mining]: {
    startingCost: 300e9,
    description: "Extract and process metals from the earth.",
    recommendStarting: false,
    reFac: 0.3,
    sciFac: 0.26,
    hwFac: 0.4,
    robFac: 0.45,
    aiFac: 0.45,
    advFac: 0.06,
    reqMats: { Energy: 0.8 },
    prodMats: ["Metal"],
  },
  [IndustryType.Pharmaceutical]: {
    startingCost: 200e9,
    description: "Discover, develop, and create new pharmaceutical drugs.",
    product: { name: "Drug", verb: "Develop", desc: "Design and develop a new pharmaceutical drug!" },
    ProductRatingWeights: {
      Quality: 0.2,
      Performance: 0.2,
      Durability: 0.1,
      Reliability: 0.3,
      Features: 0.2,
    },
    recommendStarting: false,
    reFac: 0.05,
    sciFac: 0.8,
    hwFac: 0.15,
    robFac: 0.25,
    aiFac: 0.2,
    advFac: 0.16,
    reqMats: { Chemicals: 2, Energy: 1, Water: 0.5 },
    prodMats: ["Drugs"],
  },
  [IndustryType.RealEstate]: {
    startingCost: 600e9,
    description: "Develop and manage real estate properties.",
    product: { name: "Property", verb: "Develop", desc: "Develop a new piece of real estate property!" },
    ProductRatingWeights: {
      Quality: 0.2,
      Durability: 0.25,
      Reliability: 0.1,
      Aesthetics: 0.35,
      Features: 0.1,
    },
    recommendStarting: false,
    robFac: 0.6,
    aiFac: 0.6,
    advFac: 0.25,
    sciFac: 0.05,
    hwFac: 0.05,
    reqMats: { Metal: 5, Energy: 5, Water: 2, Hardware: 4 },
    prodMats: ["Real Estate"],
  },
  [IndustryType.Robotics]: {
    startingCost: 1e12,
    description: "Develop and create robots.",
    product: { name: "Robot", verb: "Design", desc: "Design and create a new robot or robotic system!" },
    ProductRatingWeights: {
      Quality: 0.1,
      Performance: 0.2,
      Durability: 0.2,
      Reliability: 0.2,
      Aesthetics: 0.1,
      Features: 0.2,
    },
    recommendStarting: false,
    reFac: 0.32,
    sciFac: 0.65,
    aiFac: 0.36,
    advFac: 0.18,
    hwFac: 0.19,
    reqMats: { Hardware: 5, Energy: 3 },
    prodMats: ["Robots"],
  },
  [IndustryType.Software]: {
    startingCost: 25e9,
    description: "Develop computer software and create AI Cores.",
    product: { name: "Software", verb: "Develop", desc: "Develop a new piece of software!" },
    ProductRatingWeights: {
      Quality: 0.2,
      Performance: 0.2,
      Reliability: 0.2,
      Durability: 0.2,
      Features: 0.2,
    },
    recommendStarting: false,
    sciFac: 0.62,
    advFac: 0.16,
    hwFac: 0.25,
    reFac: 0.15,
    aiFac: 0.18,
    robFac: 0.05,
    reqMats: { Hardware: 0.5, Energy: 0.5 },
    prodMats: ["AI Cores"],
  },
  [IndustryType.Tobacco]: {
    startingCost: 20e9,
    description: "Create and distribute tobacco and tobacco-related products.",
    product: { name: "Product", verb: "Create", desc: "Create a new tobacco product!" },
    ProductRatingWeights: {
      Quality: 0.7,
      Durability: 0.1,
      Aesthetics: 0.2,
    },
    recommendStarting: true,
    reFac: 0.15,
    sciFac: 0.75,
    hwFac: 0.15,
    robFac: 0.2,
    aiFac: 0.15,
    advFac: 0.2,
    reqMats: { Plants: 1, Water: 0.2 },
  },
  [IndustryType.Utilities]: {
    startingCost: 150e9,
    description: "Distribute water and provide wastewater services.",
    recommendStarting: false,
    reFac: 0.5,
    sciFac: 0.6,
    robFac: 0.4,
    aiFac: 0.4,
    advFac: 0.08,
    reqMats: { Hardware: 0.1, Metal: 0.1 },
    prodMats: ["Water"],
  },
};

export const IndustryStartingCosts = {};

// Map of description for each industry
export const IndustryDescriptions = (industry: IndustryType, corp: Corporation) => {
  const data = IndustriesData[industry];
  return (
    <>
      ${data.description}
      <br />
      <br />
      Starting cost: <MoneyCost money={data.startingCost} corp={corp} />
      <br />
      Recommended starting Industry: {data.recommendStarting ? "YES" : "NO"}
    </>
  );
};

export const IndustryResearchTrees = {} as Record<IndustryType, ResearchTree>;
resetIndustryResearchTrees();

export function resetIndustryResearchTrees() {
  Object.values(IndustryType).forEach(
    (ind) =>
      (IndustryResearchTrees[ind] = IndustriesData[ind].product
        ? getProductIndustryResearchTreeCopy()
        : getBaseResearchTreeCopy()),
  );
}
