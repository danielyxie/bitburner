import React from 'react';
import { ResearchTree } from "./ResearchTree";
import { getBaseResearchTreeCopy,
         getProductIndustryResearchTreeCopy } from "./data/BaseResearchTree";
import { Money } from "../ui/React/Money";

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
    Utilities: "Water Utilities",
    Agriculture: "Agriculture",
    Fishing: "Fishing",
    Mining: "Mining",
    Food: "Food",
    Tobacco: "Tobacco",
    Chemical: "Chemical",
    Pharmaceutical: "Pharmaceutical",
    Computer: "Computer Hardware",
    Robotics: "Robotics",
    Software: "Software",
    Healthcare: "Healthcare",
    RealEstate: "RealEstate",
}

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
}

// Map of description for each industry
export const IndustryDescriptions: IIndustryMap<JSX.Element> = {
    Energy: (<>Engage in the production and distribution of energy.<br /><br />
            Starting cost: {Money(IndustryStartingCosts.Energy)}<br />
            Recommended starting Industry: NO</>),
    Utilities: (<>Distribute water and provide wastewater services.<br /><br />
               Starting cost: {Money(IndustryStartingCosts.Utilities)}<br />
               Recommended starting Industry: NO</>),
    Agriculture: (<>Cultivate crops and breed livestock to produce food.<br /><br />
                 Starting cost: {Money(IndustryStartingCosts.Agriculture)}<br />
                 Recommended starting Industry: YES</>),
    Fishing: (<>Produce food through the breeding and processing of fish and fish products.<br /><br />
             Starting cost: {Money(IndustryStartingCosts.Fishing)}<br />
             Recommended starting Industry: NO</>),
    Mining: (<>Extract and process metals from the earth.<br /><br />
            Starting cost: {Money(IndustryStartingCosts.Mining)}<br />
            Recommended starting Industry: NO</>),
    Food: (<>Create your own restaurants all around the world.<br /><br />
          Starting cost: {Money(IndustryStartingCosts.Food)}<br />
          Recommended starting Industry: YES</>),
    Tobacco: (<>Create and distribute tobacco and tobacco-related products.<br /><br />
             Starting cost: {Money(IndustryStartingCosts.Tobacco)}<br />
             Recommended starting Industry: YES</>),
    Chemical: (<>Produce industrial chemicals.<br /><br />
              Starting cost: {Money(IndustryStartingCosts.Chemical)}<br />
              Recommended starting Industry: NO</>),
    Pharmaceutical: (<>Discover, develop, and create new pharmaceutical drugs.<br /><br />
                    Starting cost: {Money(IndustryStartingCosts.Pharmaceutical)}<br />
                    Recommended starting Industry: NO</>),
    Computer: (<>Develop and manufacture new computer hardware and networking infrastructures.<br /><br />
              Starting cost: {Money(IndustryStartingCosts.Computer)}<br />
              Recommended starting Industry: NO</>),
    Robotics: (<>Develop and create robots.<br /><br />
              Starting cost: {Money(IndustryStartingCosts.Robotics)}<br />
              Recommended starting Industry: NO</>),
    Software: (<>Develop computer software and create AI Cores.<br /><br />
              Starting cost: {Money(IndustryStartingCosts.Software)}<br />
              Recommended starting Industry: YES</>),
    Healthcare: (<>Create and manage hospitals.<br /><br />
                Starting cost: {Money(IndustryStartingCosts.Healthcare)}<br />
                Recommended starting Industry: NO</>),
    RealEstate: (<>Develop and manage real estate properties.<br /><br />
                Starting cost: {Money(IndustryStartingCosts.RealEstate)}<br />
                Recommended starting Industry: NO</>),
}

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
}

export function resetIndustryResearchTrees(): void {
    IndustryResearchTrees.Energy         = getBaseResearchTreeCopy();
    IndustryResearchTrees.Utilities      = getBaseResearchTreeCopy();
    IndustryResearchTrees.Agriculture    = getBaseResearchTreeCopy();
    IndustryResearchTrees.Fishing        = getBaseResearchTreeCopy();
    IndustryResearchTrees.Mining         = getBaseResearchTreeCopy();
    IndustryResearchTrees.Food           = getBaseResearchTreeCopy();
    IndustryResearchTrees.Tobacco        = getBaseResearchTreeCopy();
    IndustryResearchTrees.Chemical       = getBaseResearchTreeCopy();
    IndustryResearchTrees.Pharmaceutical = getBaseResearchTreeCopy();
    IndustryResearchTrees.Computer       = getBaseResearchTreeCopy();
    IndustryResearchTrees.Robotics       = getBaseResearchTreeCopy();
    IndustryResearchTrees.Software       = getBaseResearchTreeCopy();
    IndustryResearchTrees.Healthcare     = getBaseResearchTreeCopy();
    IndustryResearchTrees.RealEstate     = getBaseResearchTreeCopy();
}
