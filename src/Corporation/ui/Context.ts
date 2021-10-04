import React, { useContext } from "react";
import { ICorporation } from "../ICorporation";
import { IIndustry } from "../IIndustry";

export const Context: {
  Corporation: React.Context<ICorporation>;
  Division: React.Context<IIndustry>;
} = {
  Corporation: React.createContext<ICorporation>({} as ICorporation),
  Division: React.createContext<IIndustry>({} as IIndustry),
};

export const useCorporation = (): ICorporation => useContext(Context.Corporation);
export const useDivision = (): IIndustry => useContext(Context.Division);
