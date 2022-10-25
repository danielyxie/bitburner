import { IndustryType } from "./IndustryData";

export interface IProductRatingWeight {
  Aesthetics?: number;
  Durability?: number;
  Features?: number;
  Quality?: number;
  Performance?: number;
  Reliability?: number;
}
//TODO: Move this to IndustryData
export const ProductRatingWeights: Partial<Record<IndustryType, IProductRatingWeight>> = {
  [IndustryType.Food]: {
    Quality: 0.7,
    Durability: 0.1,
    Aesthetics: 0.2,
  },
  [IndustryType.Tobacco]: {
    Quality: 0.4,
    Durability: 0.2,
    Reliability: 0.2,
    Aesthetics: 0.2,
  },
  [IndustryType.Pharmaceutical]: {
    Quality: 0.2,
    Performance: 0.2,
    Durability: 0.1,
    Reliability: 0.3,
    Features: 0.2,
  },
  [IndustryType.Computers]: {
    Quality: 0.15,
    Performance: 0.25,
    Durability: 0.25,
    Reliability: 0.2,
    Aesthetics: 0.05,
    Features: 0.1,
  },
  [IndustryType.Robotics]: {
    Quality: 0.1,
    Performance: 0.2,
    Durability: 0.2,
    Reliability: 0.2,
    Aesthetics: 0.1,
    Features: 0.2,
  },
  [IndustryType.Software]: {
    Quality: 0.2,
    Performance: 0.2,
    Reliability: 0.2,
    Durability: 0.2,
    Features: 0.2,
  },
  [IndustryType.Healthcare]: {
    Quality: 0.4,
    Performance: 0.1,
    Durability: 0.1,
    Reliability: 0.3,
    Features: 0.1,
  },
  [IndustryType.RealEstate]: {
    Quality: 0.2,
    Durability: 0.25,
    Reliability: 0.1,
    Aesthetics: 0.35,
    Features: 0.1,
  },
};
