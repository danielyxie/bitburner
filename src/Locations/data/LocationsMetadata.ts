/**
 * Metadata for constructing Location objects for all Locations
 * in the game
 */
import { CityName } from "./CityNames";
import { LocationName } from "./LocationNames";
import { IConstructorParams } from "../Location";
import { LocationType } from "../LocationTypeEnum";

export const LocationsMetadata: IConstructorParams[] = [
    {
        city: CityName.Aevum,
        infiltrationData: {
            maxClearanceLevel: 12,
            startingSecurityLevel: 8.18,
        },
        name: LocationName.AevumAeroCorp,
        types: [LocationType.Company],
    },
    {
        city: CityName.Aevum,
        infiltrationData: {
            maxClearanceLevel: 15,
            startingSecurityLevel: 8.19,
        },
        name: LocationName.AevumBachmanAndAssociates,
        types: [LocationType.Company],
    },
    {
        city: CityName.Aevum,
        infiltrationData: {
            maxClearanceLevel: 18,
            startingSecurityLevel: 9.55,
        },
        name: LocationName.AevumClarkeIncorporated,
        types: [LocationType.Company],
    },
    {
        city: CityName.Aevum,
        costMult: 3,
        expMult: 2,
        name: LocationName.AevumCrushFitnessGym,
        types: [LocationType.Gym],
    },
    {
        city: CityName.Aevum,
        infiltrationData: {
            maxClearanceLevel: 37,
            startingSecurityLevel: 17.02,
        },
        name: LocationName.AevumECorp,
        types: [LocationType.Company, LocationType.TechVendor],
        techVendorMaxRam: 512,
        techVendorMinRam: 128,
    },
    {
        city: CityName.Aevum,
        infiltrationData: {
            maxClearanceLevel: 25,
            startingSecurityLevel: 15.54,
        },
        name: LocationName.AevumFulcrumTechnologies,
        types: [LocationType.Company, LocationType.TechVendor],
        techVendorMaxRam: 1024,
        techVendorMinRam: 256,
    },
    {
        city: CityName.Aevum,
        infiltrationData: {
            maxClearanceLevel: 12,
            startingSecurityLevel: 7.89,
        },
        name: LocationName.AevumGalacticCybersystems,
        types: [LocationType.Company],
    },
    {
        city: CityName.Aevum,
        infiltrationData: {
            maxClearanceLevel: 6,
            startingSecurityLevel: 3.29,
        },
        name: LocationName.AevumNetLinkTechnologies,
        types: [LocationType.Company, LocationType.TechVendor],
        techVendorMaxRam: 64,
        techVendorMinRam: 8,
    },
    {
        city: CityName.Aevum,
        infiltrationData: {
            maxClearanceLevel: 6,
            startingSecurityLevel: 5.35,
        },
        name: LocationName.AevumPolice,
        types: [LocationType.Company],
    },
    {
        city: CityName.Aevum,
        infiltrationData: {
            maxClearanceLevel: 5,
            startingSecurityLevel: 5.02,
        },
        name: LocationName.AevumRhoConstruction,
        types: [LocationType.Company],
    },
    {
        city: CityName.Aevum,
        costMult: 10,
        expMult: 5,
        name: LocationName.AevumSnapFitnessGym,
        types: [LocationType.Gym],
    },
    {
        city: CityName.Aevum,
        costMult: 4,
        expMult: 3,
        name: LocationName.AevumSummitUniversity,
        types: [LocationType.University],
    },
    {
        city: CityName.Aevum,
        infiltrationData: {
            maxClearanceLevel: 7,
            startingSecurityLevel: 5.85,
        },
        name: LocationName.AevumWatchdogSecurity,
        types: [LocationType.Company],
    },
    {
        city: CityName.Aevum,
        name: LocationName.AevumCasino,
        types: [LocationType.Casino],
    },
    {
        city: CityName.Chongqing,
        infiltrationData: {
            maxClearanceLevel: 25,
            startingSecurityLevel: 16.25,
        },
        name: LocationName.ChongqingKuaiGongInternational,
        types: [LocationType.Company],
    },
    {
        city: CityName.Chongqing,
        infiltrationData: {
            maxClearanceLevel: 18,
            startingSecurityLevel: 12.59,
        },
        name: LocationName.ChongqingSolarisSpaceSystems,
        types: [LocationType.Company],
    },
    {
        city: CityName.Ishima,
        infiltrationData: {
            maxClearanceLevel: 12,
            startingSecurityLevel: 5.02,
        },
        name: LocationName.IshimaNovaMedical,
        types: [LocationType.Company],
    },
    {
        city: CityName.Ishima,
        infiltrationData: {
            maxClearanceLevel: 10,
            startingSecurityLevel: 3.2,
        },
        name: LocationName.IshimaOmegaSoftware,
        types: [LocationType.Company, LocationType.TechVendor],
        techVendorMaxRam: 128,
        techVendorMinRam: 4,
    },
    {
        city: CityName.Ishima,
        infiltrationData: {
            maxClearanceLevel: 25,
            startingSecurityLevel: 5.38,
        },
        name: LocationName.IshimaStormTechnologies,
        types: [LocationType.Company, LocationType.TechVendor],
        techVendorMaxRam: 512,
        techVendorMinRam: 32,
    },
    {
        city: CityName.NewTokyo,
        infiltrationData: {
            maxClearanceLevel: 17,
            startingSecurityLevel: 7.18,
        },
        name: LocationName.NewTokyoDefComm,
        types: [LocationType.Company],
    },
    {
        city: CityName.NewTokyo,
        infiltrationData: {
            maxClearanceLevel: 20,
            startingSecurityLevel: 5.9,
        },
        name: LocationName.NewTokyoGlobalPharmaceuticals,
        types: [LocationType.Company],
    },
    {
        city: CityName.NewTokyo,
        infiltrationData: {
            maxClearanceLevel: 5,
            startingSecurityLevel: 2.5,
        },
        name: LocationName.NewTokyoNoodleBar,
        types: [LocationType.Company],
    },
    {
        city: CityName.NewTokyo,
        infiltrationData: {
            maxClearanceLevel: 25,
            startingSecurityLevel: 5.52,
        },
        name: LocationName.NewTokyoVitaLife,
        types: [LocationType.Company, LocationType.Special],
    },
    {
        city: CityName.Sector12,
        infiltrationData: {
            maxClearanceLevel: 10,
            startingSecurityLevel: 3.62,
        },
        name: LocationName.Sector12AlphaEnterprises,
        types: [LocationType.Company, LocationType.TechVendor],
        techVendorMaxRam: 8,
        techVendorMinRam: 2,
    },
    {
        city: CityName.Sector12,
        infiltrationData: {
            maxClearanceLevel: 25,
            startingSecurityLevel: 10.59,
        },
        name: LocationName.Sector12BladeIndustries,
        types: [LocationType.Company],
    },
    {
        city: CityName.Sector12,
        name: LocationName.Sector12CIA,
        types: [LocationType.Company],
    },
    {
        city: CityName.Sector12,
        infiltrationData: {
            maxClearanceLevel: 15,
            startingSecurityLevel: 4.66,
        },
        name: LocationName.Sector12CarmichaelSecurity,
        types: [LocationType.Company],
    },
    {
        city: CityName.Sector12,
        name: LocationName.Sector12CityHall,
        types: [LocationType.Special],
    },
    {
        city: CityName.Sector12,
        infiltrationData: {
            maxClearanceLevel: 12,
            startingSecurityLevel: 5.9,
        },
        name: LocationName.Sector12DeltaOne,
        types: [LocationType.Company],
    },
    {
        city: CityName.Sector12,
        name: LocationName.Sector12FoodNStuff,
        types: [LocationType.Company],
    },
    {
        city: CityName.Sector12,
        infiltrationData: {
            maxClearanceLevel: 25,
            startingSecurityLevel: 8.18,
        },
        name: LocationName.Sector12FourSigma,
        types: [LocationType.Company],
    },
    {
        city: CityName.Sector12,
        infiltrationData: {
            maxClearanceLevel: 17,
            startingSecurityLevel: 6.02,
        },
        name: LocationName.Sector12IcarusMicrosystems,
        types: [LocationType.Company],
    },
    {
        city: CityName.Sector12,
        expMult: 1,
        costMult: 1,
        name: LocationName.Sector12IronGym,
        types: [LocationType.Gym],
    },
    {
        city: CityName.Sector12,
        infiltrationData: {
            maxClearanceLevel: 5,
            startingSecurityLevel: 3.13,
        },
        name: LocationName.Sector12JoesGuns,
        types: [LocationType.Company],
    },
    {
        city: CityName.Sector12,
        infiltrationData: {
            maxClearanceLevel: 31,
            startingSecurityLevel: 16.36,
        },
        name: LocationName.Sector12MegaCorp,
        types: [LocationType.Company],
    },
    {
        city: CityName.Sector12,
        name: LocationName.Sector12NSA,
        types: [LocationType.Company, LocationType.Special],
    },
    {
        city: CityName.Sector12,
        costMult: 20,
        expMult: 10,
        name: LocationName.Sector12PowerhouseGym,
        types: [LocationType.Gym],
    },
    {
        city: CityName.Sector12,
        costMult: 3,
        expMult: 2,
        name: LocationName.Sector12RothmanUniversity,
        types: [LocationType.University],
    },
    {
        city: CityName.Sector12,
        infiltrationData: {
            maxClearanceLevel: 12,
            startingSecurityLevel: 5.9,
        },
        name: LocationName.Sector12UniversalEnergy,
        types: [LocationType.Company],
    },
    {
        city: CityName.Volhaven,
        infiltrationData: {
            maxClearanceLevel: 15,
            startingSecurityLevel: 3.59,
        },
        name: LocationName.VolhavenCompuTek,
        types: [LocationType.Company, LocationType.TechVendor],
        techVendorMaxRam: 256,
        techVendorMinRam: 8,
    },
    {
        city: CityName.Volhaven,
        infiltrationData: {
            maxClearanceLevel: 18,
            startingSecurityLevel: 7.28,
        },
        name: LocationName.VolhavenHeliosLabs,
        types: [LocationType.Company],
    },
    {
        city: CityName.Volhaven,
        infiltrationData: {
            maxClearanceLevel: 15,
            startingSecurityLevel: 4.35,
        },
        name: LocationName.VolhavenLexoCorp,
        types: [LocationType.Company],
    },
    {
        city: CityName.Volhaven,
        costMult: 7,
        expMult: 4,
        name: LocationName.VolhavenMilleniumFitnessGym,
        types: [LocationType.Gym],
    },
    {
        city: CityName.Volhaven,
        infiltrationData: {
            maxClearanceLevel: 50,
            startingSecurityLevel: 8.53,
        },
        name: LocationName.VolhavenNWO,
        types: [LocationType.Company],
    },
    {
        city: CityName.Volhaven,
        infiltrationData: {
            maxClearanceLevel: 25,
            startingSecurityLevel: 7.74,
        },
        name: LocationName.VolhavenOmniTekIncorporated,
        types: [LocationType.Company, LocationType.TechVendor],
        techVendorMaxRam: 1024,
        techVendorMinRam: 128,
    },
    {
        city: CityName.Volhaven,
        infiltrationData: {
            maxClearanceLevel: 22,
            startingSecurityLevel: 6,
        },
        name: LocationName.VolhavenOmniaCybersystems,
        types: [LocationType.Company],
    },
    {
        city: CityName.Volhaven,
        infiltrationData: {
            maxClearanceLevel: 18,
            startingSecurityLevel: 4.77,
        },
        name: LocationName.VolhavenSysCoreSecurities,
        types: [LocationType.Company],
    },
    {
        city: CityName.Volhaven,
        costMult: 5,
        expMult: 4,
        name: LocationName.VolhavenZBInstituteOfTechnology,
        types: [LocationType.University],
    },
    {
        city: null,
        name: LocationName.Hospital,
        types: [LocationType.Hospital],
    },
    {
        city: null,
        name: LocationName.Slums,
        types: [LocationType.Slums],
    },
    {
        city: null,
        name: LocationName.TravelAgency,
        types: [LocationType.TravelAgency],
    },
    {
        city: null,
        name: LocationName.WorldStockExchange,
        types: [LocationType.StockMarket],
    },
];