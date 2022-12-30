import { LocationName } from "../../Enums";

//Enum-like object because some keys are created via code and have spaces. Membership can still be checked with checkEnum.
export const StockSymbols = {
  // Stocks for companies at which you can work
  [LocationName.AevumECorp]: "ECP",
  [LocationName.Sector12MegaCorp]: "MGCP",
  [LocationName.Sector12BladeIndustries]: "BLD",
  [LocationName.AevumClarkeIncorporated]: "CLRK",
  [LocationName.VolhavenOmniTekIncorporated]: "OMTK",
  [LocationName.Sector12FourSigma]: "FSIG",
  [LocationName.ChongqingKuaiGongInternational]: "KGI",
  [LocationName.AevumFulcrumTechnologies]: "FLCM",
  [LocationName.IshimaStormTechnologies]: "STM",
  [LocationName.NewTokyoDefComm]: "DCOMM",
  [LocationName.VolhavenHeliosLabs]: "HLS",
  [LocationName.NewTokyoVitaLife]: "VITA",
  [LocationName.Sector12IcarusMicrosystems]: "ICRS",
  [LocationName.Sector12UniversalEnergy]: "UNV",
  [LocationName.AevumAeroCorp]: "AERO",
  [LocationName.VolhavenOmniaCybersystems]: "OMN",
  [LocationName.ChongqingSolarisSpaceSystems]: "SLRS",
  [LocationName.NewTokyoGlobalPharmaceuticals]: "GPH",
  [LocationName.IshimaNovaMedical]: "NVMD",
  [LocationName.AevumWatchdogSecurity]: "WDS",
  [LocationName.VolhavenLexoCorp]: "LXO",
  [LocationName.AevumRhoConstruction]: "RHOC",
  [LocationName.Sector12AlphaEnterprises]: "APHE",
  [LocationName.VolhavenSysCoreSecurities]: "SYSC",
  [LocationName.VolhavenCompuTek]: "CTK",
  [LocationName.AevumNetLinkTechnologies]: "NTLK",
  [LocationName.IshimaOmegaSoftware]: "OMGA",
  [LocationName.Sector12FoodNStuff]: "FNS",
  [LocationName.Sector12JoesGuns]: "JGN",

  // Stocks for other companies
  ["Sigma Cosmetics"]: "SGC",
  ["Catalyst Ventures"]: "CTYS",
  ["Microdyne Technologies"]: "MDYN",
  ["Titan Laboratories"]: "TITN",
} as const;
