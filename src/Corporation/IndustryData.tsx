import React from "react";
import { ResearchTree } from "./ResearchTree";
import { Corporation } from "./Corporation";
import { getBaseResearchTreeCopy, getProductIndustryResearchTreeCopy } from "./data/BaseResearchTree";
import { MoneyCost } from "./ui/MoneyCost";
import { CorpIndustryData, CorpIndustryName } from "@nsdefs";
import { IndustryType } from "./data/Enums";

export const IndustriesData: Record<CorpIndustryName, CorpIndustryData> = {
  [IndustryType.Agriculture]: {
    startingCost: 40e9,
    description: "Cultivate crops and breed livestock to produce food.",
    recommendStarting: true,
    realEstateFactor: 0.72,
    scienceFactor: 0.5,
    hardwareFactor: 0.2,
    robotFactor: 0.3,
    aiCoreFactor: 0.3,
    advertisingFactor: 0.04,
    requiredMaterials: { Water: 0.5, Energy: 0.5 },
    producedMaterials: ["Plants", "Food"],
  },
  [IndustryType.Chemical]: {
    startingCost: 70e9,
    description: "Produce industrial chemicals.",
    recommendStarting: false,
    realEstateFactor: 0.25,
    scienceFactor: 0.75,
    hardwareFactor: 0.2,
    robotFactor: 0.25,
    aiCoreFactor: 0.2,
    advertisingFactor: 0.07,
    requiredMaterials: { Plants: 1, Energy: 0.5, Water: 0.5 },
    producedMaterials: ["Chemicals"],
  },
  [IndustryType.Computers]: {
    startingCost: 500e9,
    description: "Develop and manufacture new computer hardware and networking infrastructures.",
    product: {
      name: "Product",
      verb: "Create",
      desc: "Design and manufacture a new computer hardware product!",
      ratingWeights: {
        quality: 0.15,
        performance: 0.25,
        durability: 0.25,
        reliability: 0.2,
        aesthetics: 0.05,
        features: 0.1,
      },
    },
    recommendStarting: false,
    realEstateFactor: 0.2,
    scienceFactor: 0.62,
    robotFactor: 0.36,
    aiCoreFactor: 0.19,
    advertisingFactor: 0.17,
    requiredMaterials: { Metal: 2, Energy: 1 },
    producedMaterials: ["Hardware"],
  },
  [IndustryType.Energy]: {
    startingCost: 225e9,
    description: "Engage in the production and distribution of energy.",
    recommendStarting: false,
    realEstateFactor: 0.65,
    scienceFactor: 0.7,
    robotFactor: 0.05,
    aiCoreFactor: 0.3,
    advertisingFactor: 0.08,
    requiredMaterials: { Hardware: 0.1, Metal: 0.2 },
    producedMaterials: ["Energy"],
  },
  [IndustryType.Fishing]: {
    startingCost: 80e9,
    description: "Produce food through the breeding and processing of fish and fish products.",
    recommendStarting: false,
    realEstateFactor: 0.15,
    scienceFactor: 0.35,
    hardwareFactor: 0.35,
    robotFactor: 0.5,
    aiCoreFactor: 0.2,
    advertisingFactor: 0.08,
    requiredMaterials: { Energy: 0.5 },
    producedMaterials: ["Food"],
  },
  [IndustryType.Food]: {
    startingCost: 10e9,
    description: "Create your own restaurants all around the world.",
    product: {
      name: "Restaurant",
      verb: "Build",
      desc: "Build and manage a new restaurant!",
      ratingWeights: {
        quality: 0.7,
        durability: 0.1,
        aesthetics: 0.2,
      },
    },
    recommendStarting: true,
    scienceFactor: 0.12,
    hardwareFactor: 0.15,
    robotFactor: 0.3,
    aiCoreFactor: 0.25,
    advertisingFactor: 0.25,
    realEstateFactor: 0.05,
    requiredMaterials: { Food: 0.5, Water: 0.5, Energy: 0.2 },
  },
  [IndustryType.Healthcare]: {
    startingCost: 750e9,
    description: "Create and manage hospitals.",
    product: {
      name: "Hospital",
      verb: "Build",
      desc: "Build and manage a new hospital!",
      ratingWeights: {
        quality: 0.4,
        performance: 0.1,
        durability: 0.1,
        reliability: 0.3,
        features: 0.1,
      },
    },
    recommendStarting: false,
    realEstateFactor: 0.1,
    scienceFactor: 0.75,
    advertisingFactor: 0.11,
    hardwareFactor: 0.1,
    robotFactor: 0.1,
    aiCoreFactor: 0.1,
    requiredMaterials: { Robots: 10, "AI Cores": 5, Energy: 5, Water: 5 },
  },
  [IndustryType.Mining]: {
    startingCost: 300e9,
    description: "Extract and process metals from the earth.",
    recommendStarting: false,
    realEstateFactor: 0.3,
    scienceFactor: 0.26,
    hardwareFactor: 0.4,
    robotFactor: 0.45,
    aiCoreFactor: 0.45,
    advertisingFactor: 0.06,
    requiredMaterials: { Energy: 0.8 },
    producedMaterials: ["Metal"],
  },
  [IndustryType.Pharmaceutical]: {
    startingCost: 200e9,
    description: "Discover, develop, and create new pharmaceutical drugs.",
    product: {
      name: "Drug",
      verb: "Develop",
      desc: "Design and develop a new pharmaceutical drug!",
      ratingWeights: {
        quality: 0.2,
        performance: 0.2,
        durability: 0.1,
        reliability: 0.3,
        features: 0.2,
      },
    },
    recommendStarting: false,
    realEstateFactor: 0.05,
    scienceFactor: 0.8,
    hardwareFactor: 0.15,
    robotFactor: 0.25,
    aiCoreFactor: 0.2,
    advertisingFactor: 0.16,
    requiredMaterials: { Chemicals: 2, Energy: 1, Water: 0.5 },
    producedMaterials: ["Drugs"],
  },
  [IndustryType.RealEstate]: {
    startingCost: 600e9,
    description: "Develop and manage real estate properties.",
    product: {
      name: "Property",
      verb: "Develop",
      desc: "Develop a new piece of real estate property!",
      ratingWeights: {
        quality: 0.2,
        durability: 0.25,
        reliability: 0.1,
        aesthetics: 0.35,
        features: 0.1,
      },
    },
    recommendStarting: false,
    robotFactor: 0.6,
    aiCoreFactor: 0.6,
    advertisingFactor: 0.25,
    scienceFactor: 0.05,
    hardwareFactor: 0.05,
    requiredMaterials: { Metal: 5, Energy: 5, Water: 2, Hardware: 4 },
    producedMaterials: ["Real Estate"],
  },
  [IndustryType.Robotics]: {
    startingCost: 1e12,
    description: "Develop and create robots.",
    product: {
      name: "Robot",
      verb: "Design",
      desc: "Design and create a new robot or robotic system!",
      ratingWeights: {
        quality: 0.1,
        performance: 0.2,
        durability: 0.2,
        reliability: 0.2,
        aesthetics: 0.1,
        features: 0.2,
      },
    },
    recommendStarting: false,
    realEstateFactor: 0.32,
    scienceFactor: 0.65,
    aiCoreFactor: 0.36,
    advertisingFactor: 0.18,
    hardwareFactor: 0.19,
    requiredMaterials: { Hardware: 5, Energy: 3 },
    producedMaterials: ["Robots"],
  },
  [IndustryType.Software]: {
    startingCost: 25e9,
    description: "Develop computer software and create AI Cores.",
    product: {
      name: "Software",
      verb: "Develop",
      desc: "Develop a new piece of software!",
      ratingWeights: {
        quality: 0.2,
        performance: 0.2,
        reliability: 0.2,
        durability: 0.2,
        features: 0.2,
      },
    },
    recommendStarting: false,
    scienceFactor: 0.62,
    advertisingFactor: 0.16,
    hardwareFactor: 0.25,
    realEstateFactor: 0.15,
    aiCoreFactor: 0.18,
    robotFactor: 0.05,
    requiredMaterials: { Hardware: 0.5, Energy: 0.5 },
    producedMaterials: ["AI Cores"],
  },
  [IndustryType.Tobacco]: {
    startingCost: 20e9,
    description: "Create and distribute tobacco and tobacco-related products.",
    product: {
      name: "Product",
      verb: "Create",
      desc: "Create a new tobacco product!",
      ratingWeights: {
        quality: 0.7,
        durability: 0.1,
        aesthetics: 0.2,
      },
    },
    recommendStarting: true,
    realEstateFactor: 0.15,
    scienceFactor: 0.75,
    hardwareFactor: 0.15,
    robotFactor: 0.2,
    aiCoreFactor: 0.15,
    advertisingFactor: 0.2,
    requiredMaterials: { Plants: 1, Water: 0.2 },
  },
  [IndustryType.Utilities]: {
    startingCost: 150e9,
    description: "Distribute water and provide wastewater services.",
    recommendStarting: false,
    realEstateFactor: 0.5,
    scienceFactor: 0.6,
    robotFactor: 0.4,
    aiCoreFactor: 0.4,
    advertisingFactor: 0.08,
    requiredMaterials: { Hardware: 0.1, Metal: 0.1 },
    producedMaterials: ["Water"],
  },
};

export const IndustryStartingCosts = {};

// Map of description for each industry
export const IndustryDescriptions = (industry: IndustryType, corp: Corporation) => {
  const data = IndustriesData[industry];
  return (
    <>
      {data.description}
      <br />
      <br />
      Required Materials: {Object.keys(data.requiredMaterials).toString().replace(/,/gi, ", ")}
      <br />
      Produces Materials: {data.producedMaterials ? data.producedMaterials.toString().replace(/,/gi, ", ") : "NONE"}
      <br />
      Produces products: {data.product ? "YES" : "NO"}
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
