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
        name: LocationName.AevumAeroCorp,
        types: [LocationType.Company],
    },
    {
        city: CityName.Aevum,
        name: LocationName.AevumBachmanAndAssociates,
        types: [LocationType.Company],
    },
    {
        city: CityName.Aevum,
        name: LocationName.AevumClarkeIncorporated,
        types: [LocationType.Company],
    },
    {
        city: CityName.Aevum,
        name: LocationName.AevumCrushFitnessGym,
        types: [LocationType.Gym],
    },
    {
        city: CityName.Aevum,
        name: LocationName.AevumECorp,
        types: [LocationType.Company, LocationType.TechVendor],
        techVendorMaxRam: 512,
        techVendorMinRam: 128,
    },
    {
        city: CityName.Aevum,
        name: LocationName.AevumFulcrumTechnologies,
        types: [LocationType.Company, LocationType.TechVendor],
        techVendorMaxRam: 1024,
        techVendorMinRam: 256,
    },
    {
        city: CityName.Aevum,
        name: LocationName.AevumGalacticCybersystems,
        types: [LocationType.Company],
    },
    {
        city: CityName.Aevum,
        name: LocationName.AevumNetLinkTechnologies,
        types: [LocationType.Company, LocationType.TechVendor],
        techVendorMaxRam: 64,
        techVendorMinRam: 8,
    },
    {
        city: CityName.Aevum,
        name: LocationName.AevumPolice,
        types: [LocationType.Company],
    },
    {
        city: CityName.Aevum,
        name: LocationName.AevumRhoConstruction,
        types: [LocationType.Company],
    },
    {
        city: CityName.Aevum,
        name: LocationName.AevumSnapFitnessGym,
        types: [LocationType.Gym],
    },
    {
        city: CityName.Aevum,
        name: LocationName.AevumSummitUniversity,
        types: [LocationType.University],
    },
    {
        city: CityName.Aevum,
        name: LocationName.AevumWatchdogSecurity,
        types: [LocationType.Company],
    },
    {
        city: CityName.Chongqing,
        name: LocationName.ChongqingKuaiGongInternational,
        types: [LocationType.Company],
    },
    {
        city: CityName.Chongqing,
        name: LocationName.ChongqingSolarisSpaceSystems,
        types: [LocationType.Company],
    },
    {
        city: CityName.Ishima,
        name: LocationName.IshimaNovaMedical,
        types: [LocationType.Company],
    },
    {
        city: CityName.Ishima,
        name: LocationName.IshimaOmegaSoftware,
        types: [LocationType.Company, LocationType.TechVendor],
        techVendorMaxRam: 128,
        techVendorMinRam: 4,
    },
    {
        city: CityName.Ishima,
        name: LocationName.IshimaStormTechnologies,
        types: [LocationType.Company, LocationType.TechVendor],
        techVendorMaxRam: 512,
        techVendorMinRam: 32,
    },
    {
        city: CityName.NewTokyo,
        name: LocationName.NewTokyoDefComm,
        types: [LocationType.Company],
    },
    {
        city: CityName.NewTokyo,
        name: LocationName.NewTokyoGlobalPharmaceuticals,
        types: [LocationType.Company],
    },
    {
        city: CityName.NewTokyo,
        name: LocationName.NewTokyoNoodleBar,
        types: [LocationType.Company],
    },
    {
        city: CityName.NewTokyo,
        name: LocationName.NewTokyoVitaLife,
        types: [LocationType.Company, LocationType.Special],
    },
    {
        city: CityName.Sector12,
        name: LocationName.Sector12AlphaEnterprises,
        types: [LocationType.Company, LocationType.TechVendor],
        techVendorMaxRam: 8,
        techVendorMinRam: 2,
    },
    {
        city: CityName.Sector12,
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
        name: LocationName.Sector12FourSigma,
        types: [LocationType.Company],
    },
    {
        city: CityName.Sector12,
        name: LocationName.Sector12IcarusMicrosystems,
        types: [LocationType.Company],
    },
    {
        city: CityName.Sector12,
        name: LocationName.Sector12IronGym,
        types: [LocationType.Gym],
    },
    {
        city: CityName.Sector12,
        name: LocationName.Sector12JoesGuns,
        types: [LocationType.Company],
    },
    {
        city: CityName.Sector12,
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
        name: LocationName.Sector12PowerhouseGym,
        types: [LocationType.Gym],
    },
    {
        city: CityName.Sector12,
        name: LocationName.Sector12RothmanUniversity,
        types: [LocationType.University],
    },
    {
        city: CityName.Sector12,
        name: LocationName.Sector12UniversalEnergy,
        types: [LocationType.Company],
    },
    {
        city: CityName.Volhaven,
        name: LocationName.VolhavenCompuTek,
        types: [LocationType.Company, LocationType.TechVendor],
        techVendorMaxRam: 256,
        techVendorMinRam: 8,
    },
    {
        city: CityName.Volhaven,
        name: LocationName.VolhavenHeliosLabs,
        types: [LocationType.Company],
    },
    {
        city: CityName.Volhaven,
        name: LocationName.VolhavenLexoCorp,
        types: [LocationType.Company],
    },
    {
        city: CityName.Volhaven,
        name: LocationName.VolhavenMilleniumFitnessGym,
        types: [LocationType.Gym],
    },
    {
        city: CityName.Volhaven,
        name: LocationName.VolhavenNWO,
        types: [LocationType.Company],
    },
    {
        city: CityName.Volhaven,
        name: LocationName.VolhavenOmniTekIncorporated,
        types: [LocationType.Company, LocationType.TechVendor],
        techVendorMaxRam: 1024,
        techVendorMinRam: 128,
    },
    {
        city: CityName.Volhaven,
        name: LocationName.VolhavenOmniaCybersystems,
        types: [LocationType.Company],
    },
    {
        city: CityName.Volhaven,
        name: LocationName.VolhavenSysCoreSecurities,
        types: [LocationType.Company],
    },
    {
        city: CityName.Volhaven,
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
