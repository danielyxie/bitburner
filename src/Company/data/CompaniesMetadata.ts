import * as posNames from "./companypositionnames";
import { IConstructorParams } from "../Company";

import { IMap } from "../../types";
import { LocationName } from "../../Locations/data/LocationNames";

// Create Objects containing Company Positions by category
// Will help in metadata construction later
const AllSoftwarePositions: IMap<boolean> = {};
const AllITPositions: IMap<boolean> = {};
const AllNetworkEngineerPositions: IMap<boolean> = {};
const SecurityEngineerPositions: IMap<boolean> = {};
const AllTechnologyPositions: IMap<boolean> = {};
const AllBusinessPositions: IMap<boolean> = {};
const AllAgentPositions: IMap<boolean> = {};
const AllSecurityPositions: IMap<boolean> = {};
const AllSoftwareConsultantPositions: IMap<boolean> = {};
const AllBusinessConsultantPositions: IMap<boolean> = {};
const SoftwarePositionsUpToHeadOfEngineering: IMap<boolean> = {};
const SoftwarePositionsUpToLeadDeveloper: IMap<boolean> = {};
const BusinessPositionsUpToOperationsManager: IMap<boolean> = {};
const WaiterOnly: IMap<boolean> = {};
const EmployeeOnly: IMap<boolean> = {};
const PartTimeWaiterOnly: IMap<boolean> = {};
const PartTimeEmployeeOnly: IMap<boolean> = {};
const OperationsManagerOnly: IMap<boolean> = {};
const CEOOnly: IMap<boolean> = {};

posNames.SoftwareCompanyPositions.forEach((e) => {
  AllSoftwarePositions[e] = true;
  AllTechnologyPositions[e] = true;
});

posNames.ITCompanyPositions.forEach((e) => {
  AllITPositions[e] = true;
  AllTechnologyPositions[e] = true;
});

posNames.NetworkEngineerCompanyPositions.forEach((e) => {
  AllNetworkEngineerPositions[e] = true;
  AllTechnologyPositions[e] = true;
});

AllTechnologyPositions[posNames.SecurityEngineerCompanyPositions[0]] = true;
SecurityEngineerPositions[posNames.SecurityEngineerCompanyPositions[0]] = true;

posNames.BusinessCompanyPositions.forEach((e) => {
  AllBusinessPositions[e] = true;
});

posNames.SecurityCompanyPositions.forEach((e) => {
  AllSecurityPositions[e] = true;
});

posNames.AgentCompanyPositions.forEach((e) => {
  AllAgentPositions[e] = true;
});

posNames.SoftwareConsultantCompanyPositions.forEach((e) => {
  AllSoftwareConsultantPositions[e] = true;
});

posNames.BusinessConsultantCompanyPositions.forEach((e) => {
  AllBusinessConsultantPositions[e] = true;
});

for (let i = 0; i < posNames.SoftwareCompanyPositions.length; ++i) {
  const e = posNames.SoftwareCompanyPositions[i];
  if (i <= 5) {
    SoftwarePositionsUpToHeadOfEngineering[e] = true;
  }
  if (i <= 3) {
    SoftwarePositionsUpToLeadDeveloper[e] = true;
  }
}
for (let i = 0; i < posNames.BusinessCompanyPositions.length; ++i) {
  const e = posNames.BusinessCompanyPositions[i];
  if (i <= 3) {
    BusinessPositionsUpToOperationsManager[e] = true;
  }
}

WaiterOnly[posNames.MiscCompanyPositions[0]] = true;
EmployeeOnly[posNames.MiscCompanyPositions[1]] = true;
PartTimeWaiterOnly[posNames.PartTimeCompanyPositions[0]] = true;
PartTimeEmployeeOnly[posNames.PartTimeCompanyPositions[1]] = true;
OperationsManagerOnly[posNames.BusinessCompanyPositions[3]] = true;
CEOOnly[posNames.BusinessCompanyPositions[5]] = true;

// Metadata
export const companiesMetadata: IConstructorParams[] = [
  {
    name: LocationName.AevumECorp,
    info: "",
    companyPositions: Object.assign(
      {},
      AllTechnologyPositions,
      AllBusinessPositions,
      AllSecurityPositions,
    ),
    expMultiplier: 3,
    salaryMultiplier: 3,
    jobStatReqOffset: 249,
  },
  {
    name: LocationName.Sector12MegaCorp,
    info: "",
    companyPositions: Object.assign(
      {},
      AllTechnologyPositions,
      AllBusinessPositions,
      AllSecurityPositions,
    ),
    expMultiplier: 3,
    salaryMultiplier: 3,
    jobStatReqOffset: 249,
  },
  {
    name: LocationName.AevumBachmanAndAssociates,
    info: "",
    companyPositions: Object.assign(
      {},
      AllTechnologyPositions,
      AllBusinessPositions,
      AllSecurityPositions,
    ),
    expMultiplier: 2.6,
    salaryMultiplier: 2.6,
    jobStatReqOffset: 224,
  },
  {
    name: LocationName.Sector12BladeIndustries,
    info: "",
    companyPositions: Object.assign(
      {},
      AllTechnologyPositions,
      AllBusinessPositions,
      AllSecurityPositions,
    ),
    expMultiplier: 2.75,
    salaryMultiplier: 2.75,
    jobStatReqOffset: 224,
  },
  {
    name: LocationName.VolhavenNWO,
    info: "",
    companyPositions: Object.assign(
      {},
      AllTechnologyPositions,
      AllBusinessPositions,
      AllSecurityPositions,
    ),
    expMultiplier: 2.75,
    salaryMultiplier: 2.75,
    jobStatReqOffset: 249,
  },
  {
    name: LocationName.AevumClarkeIncorporated,
    info: "",
    companyPositions: Object.assign(
      {},
      AllTechnologyPositions,
      AllBusinessPositions,
      AllSecurityPositions,
    ),
    expMultiplier: 2.25,
    salaryMultiplier: 2.25,
    jobStatReqOffset: 224,
  },
  {
    name: LocationName.VolhavenOmniTekIncorporated,
    info: "",
    companyPositions: Object.assign(
      {},
      AllTechnologyPositions,
      AllBusinessPositions,
      AllSecurityPositions,
    ),
    expMultiplier: 2.25,
    salaryMultiplier: 2.25,
    jobStatReqOffset: 224,
  },
  {
    name: LocationName.Sector12FourSigma,
    info: "",
    companyPositions: Object.assign(
      {},
      AllTechnologyPositions,
      AllBusinessPositions,
      AllSecurityPositions,
    ),
    expMultiplier: 2.5,
    salaryMultiplier: 2.5,
    jobStatReqOffset: 224,
  },
  {
    name: LocationName.ChongqingKuaiGongInternational,
    info: "",
    companyPositions: Object.assign(
      {},
      AllTechnologyPositions,
      AllBusinessPositions,
      AllSecurityPositions,
    ),
    expMultiplier: 2.2,
    salaryMultiplier: 2.2,
    jobStatReqOffset: 224,
  },
  {
    name: LocationName.AevumFulcrumTechnologies,
    info: "",
    companyPositions: Object.assign(
      {},
      AllTechnologyPositions,
      AllBusinessPositions,
    ),
    expMultiplier: 2,
    salaryMultiplier: 2,
    jobStatReqOffset: 224,
  },
  {
    name: LocationName.IshimaStormTechnologies,
    info: "",
    companyPositions: Object.assign(
      {},
      AllTechnologyPositions,
      AllSoftwareConsultantPositions,
      AllBusinessPositions,
    ),
    expMultiplier: 1.8,
    salaryMultiplier: 1.8,
    jobStatReqOffset: 199,
  },
  {
    name: LocationName.NewTokyoDefComm,
    info: "",
    companyPositions: Object.assign(
      {},
      CEOOnly,
      AllTechnologyPositions,
      AllSoftwareConsultantPositions,
    ),
    expMultiplier: 1.75,
    salaryMultiplier: 1.75,
    jobStatReqOffset: 199,
  },
  {
    name: LocationName.VolhavenHeliosLabs,
    info: "",
    companyPositions: Object.assign(
      {},
      CEOOnly,
      AllTechnologyPositions,
      AllSoftwareConsultantPositions,
    ),
    expMultiplier: 1.8,
    salaryMultiplier: 1.8,
    jobStatReqOffset: 199,
  },
  {
    name: LocationName.NewTokyoVitaLife,
    info: "",
    companyPositions: Object.assign(
      {},
      AllTechnologyPositions,
      AllBusinessPositions,
      AllSoftwareConsultantPositions,
    ),
    expMultiplier: 1.8,
    salaryMultiplier: 1.8,
    jobStatReqOffset: 199,
  },
  {
    name: LocationName.Sector12IcarusMicrosystems,
    info: "",
    companyPositions: Object.assign(
      {},
      AllTechnologyPositions,
      AllBusinessPositions,
      AllSoftwareConsultantPositions,
    ),
    expMultiplier: 1.9,
    salaryMultiplier: 1.9,
    jobStatReqOffset: 199,
  },
  {
    name: LocationName.Sector12UniversalEnergy,
    info: "",
    companyPositions: Object.assign(
      {},
      AllTechnologyPositions,
      AllBusinessPositions,
      AllSoftwareConsultantPositions,
    ),
    expMultiplier: 2,
    salaryMultiplier: 2,
    jobStatReqOffset: 199,
  },
  {
    name: LocationName.AevumGalacticCybersystems,
    info: "",
    companyPositions: Object.assign(
      {},
      AllTechnologyPositions,
      AllBusinessPositions,
      AllSoftwareConsultantPositions,
    ),
    expMultiplier: 1.9,
    salaryMultiplier: 1.9,
    jobStatReqOffset: 199,
  },
  {
    name: LocationName.AevumAeroCorp,
    info: "",
    companyPositions: Object.assign(
      {},
      CEOOnly,
      OperationsManagerOnly,
      AllTechnologyPositions,
      AllSecurityPositions,
    ),
    expMultiplier: 1.7,
    salaryMultiplier: 1.7,
    jobStatReqOffset: 199,
  },
  {
    name: LocationName.VolhavenOmniaCybersystems,
    info: "",
    companyPositions: Object.assign(
      {},
      CEOOnly,
      OperationsManagerOnly,
      AllTechnologyPositions,
      AllSecurityPositions,
    ),
    expMultiplier: 1.7,
    salaryMultiplier: 1.7,
    jobStatReqOffset: 199,
  },
  {
    name: LocationName.ChongqingSolarisSpaceSystems,
    info: "",
    companyPositions: Object.assign(
      {},
      CEOOnly,
      OperationsManagerOnly,
      AllTechnologyPositions,
      AllSecurityPositions,
    ),
    expMultiplier: 1.7,
    salaryMultiplier: 1.7,
    jobStatReqOffset: 199,
  },
  {
    name: LocationName.Sector12DeltaOne,
    info: "",
    companyPositions: Object.assign(
      {},
      CEOOnly,
      OperationsManagerOnly,
      AllTechnologyPositions,
      AllSecurityPositions,
    ),
    expMultiplier: 1.6,
    salaryMultiplier: 1.6,
    jobStatReqOffset: 199,
  },
  {
    name: LocationName.NewTokyoGlobalPharmaceuticals,
    info: "",
    companyPositions: Object.assign(
      {},
      AllTechnologyPositions,
      AllBusinessPositions,
      AllSoftwareConsultantPositions,
      AllSecurityPositions,
    ),
    expMultiplier: 1.8,
    salaryMultiplier: 1.8,
    jobStatReqOffset: 224,
  },
  {
    name: LocationName.IshimaNovaMedical,
    info: "",
    companyPositions: Object.assign(
      {},
      AllTechnologyPositions,
      AllBusinessPositions,
      AllSoftwareConsultantPositions,
      AllSecurityPositions,
    ),
    expMultiplier: 1.75,
    salaryMultiplier: 1.75,
    jobStatReqOffset: 199,
  },
  {
    name: LocationName.Sector12CIA,
    info: "",
    companyPositions: Object.assign(
      {},
      SoftwarePositionsUpToHeadOfEngineering,
      AllNetworkEngineerPositions,
      SecurityEngineerPositions,
      AllITPositions,
      AllSecurityPositions,
      AllAgentPositions,
    ),
    expMultiplier: 2,
    salaryMultiplier: 2,
    jobStatReqOffset: 149,
  },
  {
    name: LocationName.Sector12NSA,
    info: "",
    companyPositions: Object.assign(
      {},
      SoftwarePositionsUpToHeadOfEngineering,
      AllNetworkEngineerPositions,
      SecurityEngineerPositions,
      AllITPositions,
      AllSecurityPositions,
      AllAgentPositions,
    ),
    expMultiplier: 2,
    salaryMultiplier: 2,
    jobStatReqOffset: 149,
  },
  {
    name: LocationName.AevumWatchdogSecurity,
    info: "",
    companyPositions: Object.assign(
      {},
      SoftwarePositionsUpToHeadOfEngineering,
      AllNetworkEngineerPositions,
      AllITPositions,
      AllSecurityPositions,
      AllAgentPositions,
      AllSoftwareConsultantPositions,
    ),
    expMultiplier: 1.5,
    salaryMultiplier: 1.5,
    jobStatReqOffset: 124,
  },
  {
    name: LocationName.VolhavenLexoCorp,
    info: "",
    companyPositions: Object.assign(
      {},
      AllTechnologyPositions,
      AllSoftwareConsultantPositions,
      AllBusinessPositions,
      AllSecurityPositions,
    ),
    expMultiplier: 1.4,
    salaryMultiplier: 1.4,
    jobStatReqOffset: 99,
  },
  {
    name: LocationName.AevumRhoConstruction,
    info: "",
    companyPositions: Object.assign(
      {},
      SoftwarePositionsUpToLeadDeveloper,
      BusinessPositionsUpToOperationsManager,
    ),
    expMultiplier: 1.3,
    salaryMultiplier: 1.3,
    jobStatReqOffset: 49,
  },
  {
    name: LocationName.Sector12AlphaEnterprises,
    info: "",
    companyPositions: Object.assign(
      {},
      SoftwarePositionsUpToLeadDeveloper,
      BusinessPositionsUpToOperationsManager,
      AllSoftwareConsultantPositions,
    ),
    expMultiplier: 1.5,
    salaryMultiplier: 1.5,
    jobStatReqOffset: 99,
  },
  {
    name: LocationName.AevumPolice,
    info: "",
    companyPositions: Object.assign(
      {},
      AllSecurityPositions,
      SoftwarePositionsUpToLeadDeveloper,
    ),
    expMultiplier: 1.3,
    salaryMultiplier: 1.3,
    jobStatReqOffset: 99,
  },
  {
    name: LocationName.VolhavenSysCoreSecurities,
    info: "",
    companyPositions: Object.assign({}, AllTechnologyPositions),
    expMultiplier: 1.3,
    salaryMultiplier: 1.3,
    jobStatReqOffset: 124,
  },
  {
    name: LocationName.VolhavenCompuTek,
    info: "",
    companyPositions: Object.assign({}, AllTechnologyPositions),
    expMultiplier: 1.2,
    salaryMultiplier: 1.2,
    jobStatReqOffset: 74,
  },
  {
    name: LocationName.AevumNetLinkTechnologies,
    info: "",
    companyPositions: Object.assign({}, AllTechnologyPositions),
    expMultiplier: 1.2,
    salaryMultiplier: 1.2,
    jobStatReqOffset: 99,
  },
  {
    name: LocationName.Sector12CarmichaelSecurity,
    info: "",
    companyPositions: Object.assign(
      {},
      AllTechnologyPositions,
      AllSoftwareConsultantPositions,
      AllAgentPositions,
      AllSecurityPositions,
    ),
    expMultiplier: 1.2,
    salaryMultiplier: 1.2,
    jobStatReqOffset: 74,
  },
  {
    name: LocationName.Sector12FoodNStuff,
    info: "",
    companyPositions: Object.assign({}, EmployeeOnly, PartTimeEmployeeOnly),
    expMultiplier: 1,
    salaryMultiplier: 1,
    jobStatReqOffset: 0,
  },
  {
    name: LocationName.Sector12JoesGuns,
    info: "",
    companyPositions: Object.assign({}, EmployeeOnly, PartTimeEmployeeOnly),
    expMultiplier: 1,
    salaryMultiplier: 1,
    jobStatReqOffset: 0,
  },
  {
    name: LocationName.IshimaOmegaSoftware,
    info: "",
    companyPositions: Object.assign(
      {},
      AllSoftwarePositions,
      AllSoftwareConsultantPositions,
      AllITPositions,
    ),
    expMultiplier: 1.1,
    salaryMultiplier: 1.1,
    jobStatReqOffset: 49,
  },
  {
    name: LocationName.NewTokyoNoodleBar,
    info: "",
    companyPositions: Object.assign({}, WaiterOnly, PartTimeWaiterOnly),
    expMultiplier: 1,
    salaryMultiplier: 1,
    jobStatReqOffset: 0,
  },
];
