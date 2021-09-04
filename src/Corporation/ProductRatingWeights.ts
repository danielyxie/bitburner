import { Industries } from "./IndustryData";
import { IMap } from "../types";

export interface IProductRatingWeight {
  Aesthetics?: number;
  Durability?: number;
  Features?: number;
  Quality?: number;
  Performance?: number;
  Reliability?: number;
}

export const ProductRatingWeights: IMap<any> = {
  [Industries.Food]: {
    Quality: 0.7,
    Durability: 0.1,
    Aesthetics: 0.2,
  },
  [Industries.Tobacco]: {
    Quality: 0.4,
    Durability: 0.2,
    Reliability: 0.2,
    Aesthetics: 0.2,
  },
  [Industries.Pharmaceutical]: {
    Quality: 0.2,
    Performance: 0.2,
    Durability: 0.1,
    Reliability: 0.3,
    Features: 0.2,
  },
  [Industries.Computer]: {
    Quality: 0.15,
    Performance: 0.25,
    Durability: 0.25,
    Reliability: 0.2,
    Aesthetics: 0.05,
    Features: 0.1,
  },
  Computer: {
    //Repeat
    Quality: 0.15,
    Performance: 0.25,
    Durability: 0.25,
    Reliability: 0.2,
    Aesthetics: 0.05,
    Features: 0.1,
  },
  [Industries.Robotics]: {
    Quality: 0.1,
    Performance: 0.2,
    Durability: 0.2,
    Reliability: 0.2,
    Aesthetics: 0.1,
    Features: 0.2,
  },
  [Industries.Software]: {
    Quality: 0.2,
    Performance: 0.2,
    Reliability: 0.2,
    Durability: 0.2,
    Features: 0.2,
  },
  [Industries.Healthcare]: {
    Quality: 0.4,
    Performance: 0.1,
    Durability: 0.1,
    Reliability: 0.3,
    Features: 0.1,
  },
  [Industries.RealEstate]: {
    Quality: 0.2,
    Durability: 0.25,
    Reliability: 0.1,
    Aesthetics: 0.35,
    Features: 0.1,
  },
};
