/**
 * Initialization metadata for all Stocks. This is used to generate the
 * stock parameter values upon a reset
 *
 * Some notes:
 *  - Megacorporations have better otlkMags
 *  - Higher volatility -> Bigger spread
 *  - Lower price -> Bigger spread
 *  - Share tx required for movement used for balancing
 */
import { StockSymbols } from "./StockSymbols";
import { IConstructorParams } from "../Stock";
import { LocationName } from "../../Locations/data/LocationNames";

export const InitStockMetadata: IConstructorParams[] = [
    {
        b: true,
        initPrice: {
            max: 28e3,
            min: 17e3,
        },
        marketCap: 2.4e12,
        mv: {
            divisor: 100,
            max: 50,
            min: 40,
        },
        name: LocationName.AevumECorp,
        otlkMag: 19,
        spreadPerc: {
            divisor: 10,
            max: 5,
            min: 1,
        },
        shareTxForMovement: {
            max: 90e3,
            min: 30e3,
        },
        symbol: StockSymbols[LocationName.AevumECorp],
    },

    {
        b: true,
        initPrice: {
            max: 34e3,
            min: 24e3,
        },
        marketCap: 2.4e12,
        mv: {
            divisor: 100,
            max: 50,
            min: 40,
        },
        name: LocationName.Sector12MegaCorp,
        otlkMag: 19,
        spreadPerc: {
            divisor: 10,
            max: 5,
            min: 1,
        },
        shareTxForMovement: {
            max: 90e3,
            min: 30e3,
        },
        symbol: StockSymbols[LocationName.Sector12MegaCorp],
    },

    {
        b: true,
        initPrice: {
            max: 25e3,
            min: 12e3,
        },
        marketCap: 1.6e12,
        mv: {
            divisor: 100,
            max: 80,
            min: 70,
        },
        name: LocationName.Sector12BladeIndustries,
        otlkMag: 13,
        spreadPerc: {
            divisor: 10,
            max: 6,
            min: 1,
        },
        shareTxForMovement: {
            max: 90e3,
            min: 30e3,
        },
        symbol: StockSymbols[LocationName.Sector12BladeIndustries],
    },

    {
        b: true,
        initPrice: {
            max: 25e3,
            min: 10e3,
        },
        marketCap: 1.5e12,
        mv: {
            divisor: 100,
            max: 75,
            min: 65,
        },
        name: LocationName.AevumClarkeIncorporated,
        otlkMag: 12,
        spreadPerc: {
            divisor: 10,
            max: 5,
            min: 1,
        },
        shareTxForMovement: {
            max: 90e3,
            min: 30e3,
        },
        symbol: StockSymbols[LocationName.AevumClarkeIncorporated],
    },

    {
        b: true,
        initPrice: {
            max: 43e3,
            min: 32e3,
        },
        marketCap: 1.8e12,
        mv: {
            divisor: 100,
            max: 70,
            min: 60,
        },
        name: LocationName.VolhavenOmniTekIncorporated,
        otlkMag: 12,
        spreadPerc: {
            divisor: 10,
            max: 6,
            min: 1,
        },
        shareTxForMovement: {
            max: 90e3,
            min: 30e3,
        },
        symbol: StockSymbols[LocationName.VolhavenOmniTekIncorporated],
    },

    {
        b: true,
        initPrice: {
            max: 80e3,
            min: 50e3,
        },
        marketCap: 2e12,
        mv: {
            divisor: 100,
            max: 110,
            min: 100,
        },
        name: LocationName.Sector12FourSigma,
        otlkMag: 17,
        spreadPerc: {
            divisor: 10,
            max: 10,
            min: 1,
        },
        shareTxForMovement: {
            max: 90e3,
            min: 30e3,
        },
        symbol: StockSymbols[LocationName.Sector12FourSigma],
    },

    {
        b: true,
        initPrice: {
            max: 28e3,
            min: 16e3,
        },
        marketCap: 1.9e12,
        mv: {
            divisor: 100,
            max: 85,
            min: 75,
        },
        name: LocationName.ChongqingKuaiGongInternational,
        otlkMag: 10,
        spreadPerc: {
            divisor: 10,
            max: 7,
            min: 1,
        },
        shareTxForMovement: {
            max: 90e3,
            min: 30e3,
        },
        symbol: StockSymbols[LocationName.ChongqingKuaiGongInternational],
    },

    {
        b: true,
        initPrice: {
            max: 36e3,
            min: 29e3,
        },
        marketCap: 2e12,
        mv: {
            divisor: 100,
            max: 130,
            min: 120,
        },
        name: LocationName.AevumFulcrumTechnologies,
        otlkMag: 16,
        spreadPerc: {
            divisor: 10,
            max: 10,
            min: 1,
        },
        shareTxForMovement: {
            max: 90e3,
            min: 30e3,
        },
        symbol: StockSymbols[LocationName.AevumFulcrumTechnologies],
    },

    {
        b: true,
        initPrice: {
            max: 25e3,
            min: 20e3,
        },
        marketCap: 1.2e12,
        mv: {
            divisor: 100,
            max: 90,
            min: 80,
        },
        name: LocationName.IshimaStormTechnologies,
        otlkMag: 7,
        spreadPerc: {
            divisor: 10,
            max: 10,
            min: 2,
        },
        shareTxForMovement: {
            max: 108e3,
            min: 36e3,
        },
        symbol: StockSymbols[LocationName.IshimaStormTechnologies],
    },

    {
        b: true,
        initPrice: {
            max: 19e3,
            min: 6e3,
        },
        marketCap: 900e9,
        mv: {
            divisor: 100,
            max: 70,
            min: 60,
        },
        name: LocationName.NewTokyoDefComm,
        otlkMag: 10,
        spreadPerc: {
            divisor: 10,
            max: 10,
            min: 2,
        },
        shareTxForMovement: {
            max: 108e3,
            min: 36e3,
        },
        symbol: StockSymbols[LocationName.NewTokyoDefComm],
    },

    {
        b: true,
        initPrice: {
            max: 18e3,
            min: 10e3,
        },
        marketCap: 825e9,
        mv: {
            divisor: 100,
            max: 65,
            min: 55,
        },
        name: LocationName.VolhavenHeliosLabs,
        otlkMag: 9,
        spreadPerc: {
            divisor: 10,
            max: 10,
            min: 2,
        },
        shareTxForMovement: {
            max: 108e3,
            min: 36e3,
        },
        symbol: StockSymbols[LocationName.VolhavenHeliosLabs],
    },

    {
        b: true,
        initPrice: {
            max: 14e3,
            min: 8e3,
        },
        marketCap: 1e12,
        mv: {
            divisor: 100,
            max: 80,
            min: 70,
        },
        name: LocationName.NewTokyoVitaLife,
        otlkMag: 7,
        spreadPerc: {
            divisor: 10,
            max: 10,
            min: 2,
        },
        shareTxForMovement: {
            max: 108e3,
            min: 36e3,
        },
        symbol: StockSymbols[LocationName.NewTokyoVitaLife],
    },

    {
        b: true,
        initPrice: {
            max: 24e3,
            min: 12e3,
        },
        marketCap: 800e9,
        mv: {
            divisor: 100,
            max: 70,
            min: 60,
        },
        name: LocationName.Sector12IcarusMicrosystems,
        otlkMag: 7.5,
        spreadPerc: {
            divisor: 10,
            max: 10,
            min: 3,
        },
        shareTxForMovement: {
            max: 108e3,
            min: 36e3,
        },
        symbol: StockSymbols[LocationName.Sector12IcarusMicrosystems],
    },

    {
        b: true,
        initPrice: {
            max: 29e3,
            min: 16e3,
        },
        marketCap: 900e9,
        mv: {
            divisor: 100,
            max: 60,
            min: 50,
        },
        name: LocationName.Sector12UniversalEnergy,
        otlkMag: 10,
        spreadPerc: {
            divisor: 10,
            max: 10,
            min: 2,
        },
        shareTxForMovement: {
            max: 108e3,
            min: 36e3,
        },
        symbol: StockSymbols[LocationName.Sector12UniversalEnergy],
    },

    {
        b: true,
        initPrice: {
            max: 17e3,
            min: 8e3,
        },
        marketCap: 640e9,
        mv: {
            divisor: 100,
            max: 65,
            min: 55,
        },
        name: LocationName.AevumAeroCorp,
        otlkMag: 6,
        spreadPerc: {
            divisor: 10,
            max: 10,
            min: 3,
        },
        shareTxForMovement: {
            max: 126e3,
            min: 42e3,
        },
        symbol: StockSymbols[LocationName.AevumAeroCorp],
    },

    {
        b: true,
        initPrice: {
            max: 15e3,
            min: 6e3,
        },
        marketCap: 600e9,
        mv: {
            divisor: 100,
            max: 75,
            min: 65,
        },
        name: LocationName.VolhavenOmniaCybersystems,
        otlkMag: 4.5,
        spreadPerc: {
            divisor: 10,
            max: 11,
            min: 4,
        },
        shareTxForMovement: {
            max: 126e3,
            min: 42e3,
        },
        symbol: StockSymbols[LocationName.VolhavenOmniaCybersystems],
    },

    {
        b: true,
        initPrice: {
            max: 28e3,
            min: 14e3,
        },
        marketCap: 705e9,
        mv: {
            divisor: 100,
            max: 80,
            min: 70,
        },
        name: LocationName.ChongqingSolarisSpaceSystems,
        otlkMag: 8.5,
        spreadPerc: {
            divisor: 10,
            max: 12,
            min: 4,
        },
        shareTxForMovement: {
            max: 126e3,
            min: 42e3,
        },
        symbol: StockSymbols[LocationName.ChongqingSolarisSpaceSystems],
    },

    {
        b: true,
        initPrice: {
            max: 30e3,
            min: 12e3,
        },
        marketCap: 695e9,
        mv: {
            divisor: 100,
            max: 65,
            min: 55,
        },
        name: LocationName.NewTokyoGlobalPharmaceuticals,
        otlkMag: 10.5,
        spreadPerc: {
            divisor: 10,
            max: 10,
            min: 4,
        },
        shareTxForMovement: {
            max: 126e3,
            min: 42e3,
        },
        symbol: StockSymbols[LocationName.NewTokyoGlobalPharmaceuticals],
    },

    {
        b: true,
        initPrice: {
            max: 27e3,
            min: 15e3,
        },
        marketCap: 600e9,
        mv: {
            divisor: 100,
            max: 80,
            min: 70,
        },
        name: LocationName.IshimaNovaMedical,
        otlkMag: 5,
        spreadPerc: {
            divisor: 10,
            max: 11,
            min: 4,
        },
        shareTxForMovement: {
            max: 126e3,
            min: 42e3,
        },
        symbol: StockSymbols[LocationName.IshimaNovaMedical],
    },

    {
        b: true,
        initPrice: {
            max: 8.5e3,
            min: 4e3,
        },
        marketCap: 450e9,
        mv: {
            divisor: 100,
            max: 260,
            min: 240,
        },
        name: LocationName.AevumWatchdogSecurity,
        otlkMag: 1.5,
        spreadPerc: {
            divisor: 10,
            max: 12,
            min: 5,
        },
        shareTxForMovement: {
            max: 54e3,
            min: 12e3,
        },
        symbol: StockSymbols[LocationName.AevumWatchdogSecurity],
    },

    {
        b: true,
        initPrice: {
            max: 8e3,
            min: 4.5e3,
        },
        marketCap: 300e9,
        mv: {
            divisor: 100,
            max: 135,
            min: 115,
        },
        name: LocationName.VolhavenLexoCorp,
        otlkMag: 6,
        spreadPerc: {
            divisor: 10,
            max: 12,
            min: 5,
        },
        shareTxForMovement: {
            max: 108e3,
            min: 36e3,
        },
        symbol: StockSymbols[LocationName.VolhavenLexoCorp],
    },

    {
        b: true,
        initPrice: {
            max: 7e3,
            min: 2e3,
        },
        marketCap: 180e9,
        mv: {
            divisor: 100,
            max: 70,
            min: 50,
        },
        name: LocationName.AevumRhoConstruction,
        otlkMag: 1,
        spreadPerc: {
            divisor: 10,
            max: 10,
            min: 3,
        },
        shareTxForMovement: {
            max: 126e3,
            min: 60e3,
        },
        symbol: StockSymbols[LocationName.AevumRhoConstruction],
    },

    {
        b: true,
        initPrice: {
            max: 8.5e3,
            min: 4e3,
        },
        marketCap: 240e9,
        mv: {
            divisor: 100,
            max: 205,
            min: 175,
        },
        name: LocationName.Sector12AlphaEnterprises,
        otlkMag: 10,
        spreadPerc: {
            divisor: 10,
            max: 16,
            min: 5,
        },
        shareTxForMovement: {
            max: 90e3,
            min: 30e3,
        },
        symbol: StockSymbols[LocationName.Sector12AlphaEnterprises],
    },

    {
        b: true,
        initPrice: {
            max: 8e3,
            min: 3e3,
        },
        marketCap: 200e9,
        mv: {
            divisor: 100,
            max: 170,
            min: 150,
        },
        name: LocationName.VolhavenSysCoreSecurities,
        otlkMag: 3,
        spreadPerc: {
            divisor: 10,
            max: 12,
            min: 5,
        },
        shareTxForMovement: {
            max: 90e3,
            min: 15e3,
        },
        symbol: StockSymbols[LocationName.VolhavenSysCoreSecurities],
    },

    {
        b: true,
        initPrice: {
            max: 6e3,
            min: 1e3,
        },
        marketCap: 185e9,
        mv: {
            divisor: 100,
            max: 100,
            min: 80,
        },
        name: LocationName.VolhavenCompuTek,
        otlkMag: 4,
        spreadPerc: {
            divisor: 10,
            max: 12,
            min: 4,
        },
        shareTxForMovement: {
            max: 126e3,
            min: 60e3,
        },
        symbol: StockSymbols[LocationName.VolhavenCompuTek],
    },

    {
        b: true,
        initPrice: {
            max: 5e3,
            min: 1e3,
        },
        marketCap: 58e9,
        mv: {
            divisor: 100,
            max: 430,
            min: 400,
        },
        name: LocationName.AevumNetLinkTechnologies,
        otlkMag: 1,
        spreadPerc: {
            divisor: 10,
            max: 20,
            min: 5,
        },
        shareTxForMovement: {
            max: 54e3,
            min: 18e3,
        },
        symbol: StockSymbols[LocationName.AevumNetLinkTechnologies],
    },

    {
        b: true,
        initPrice: {
            max: 8e3,
            min: 1e3,
        },
        marketCap: 60e9,
        mv: {
            divisor: 100,
            max: 110,
            min: 90,
        },
        name: LocationName.IshimaOmegaSoftware,
        otlkMag: 0.5,
        spreadPerc: {
            divisor: 10,
            max: 13,
            min: 4,
        },
        shareTxForMovement: {
            max: 90e3,
            min: 30e3,
        },
        symbol: StockSymbols[LocationName.IshimaOmegaSoftware],
    },

    {
        b: false,
        initPrice: {
            max: 4.5e3,
            min: 500,
        },
        marketCap: 45e9,
        mv: {
            divisor: 100,
            max: 80,
            min: 70,
        },
        name: LocationName.Sector12FoodNStuff,
        otlkMag: 1,
        spreadPerc: {
            divisor: 10,
            max: 10,
            min: 6,
        },
        shareTxForMovement: {
            max: 180e3,
            min: 60e3,
        },
        symbol: StockSymbols[LocationName.Sector12FoodNStuff],
    },

    {
        b: true,
        initPrice: {
            max: 3.5e3,
            min: 1.5e3,
        },
        marketCap: 30e9,
        mv: {
            divisor: 100,
            max: 300,
            min: 260,
        },
        name: "Sigma Cosmetics",
        otlkMag: 0,
        spreadPerc: {
            divisor: 10,
            max: 14,
            min: 6,
        },
        shareTxForMovement: {
            max: 84e3,
            min: 24e3,
        },
        symbol: StockSymbols["Sigma Cosmetics"],
    },

    {
        b: true,
        initPrice: {
            max: 1.5e3,
            min: 250,
        },
        marketCap: 42e9,
        mv: {
            divisor: 100,
            max: 400,
            min: 360,
        },
        name: "Joes Guns",
        otlkMag: 1,
        spreadPerc: {
            divisor: 10,
            max: 14,
            min: 6,
        },
        shareTxForMovement: {
            max: 64e3,
            min: 18e3,
        },
        symbol: StockSymbols["Joes Guns"],
    },

    {
        b: true,
        initPrice: {
            max: 1.5e3,
            min: 250,
        },
        marketCap: 100e9,
        mv: {
            divisor: 100,
            max: 175,
            min: 120,
        },
        name: "Catalyst Ventures",
        otlkMag: 13.5,
        spreadPerc: {
            divisor: 10,
            max: 14,
            min: 5,
        },
        shareTxForMovement: {
            max: 72e3,
            min: 24e3,
        },
        symbol: StockSymbols["Catalyst Ventures"],
    },

    {
        b: true,
        initPrice: {
            max: 30e3,
            min: 15e3,
        },
        marketCap: 360e9,
        mv: {
            divisor: 100,
            max: 80,
            min: 70,
        },
        name: "Microdyne Technologies",
        otlkMag: 8,
        spreadPerc: {
            divisor: 10,
            max: 10,
            min: 3,
        },
        shareTxForMovement: {
            max: 216e3,
            min: 90e3,
        },
        symbol: StockSymbols["Microdyne Technologies"],
    },

    {
        b: true,
        initPrice: {
            max: 24e3,
            min: 12e3,
        },
        marketCap: 420e9,
        mv: {
            divisor: 100,
            max: 70,
            min: 50,
        },
        name: "Titan Laboratories",
        otlkMag: 11,
        spreadPerc: {
            divisor: 10,
            max: 10,
            min: 2,
        },
        shareTxForMovement: {
            max: 216e3,
            min: 90e3,
        },
        symbol: StockSymbols["Titan Laboratories"],
    },
];
