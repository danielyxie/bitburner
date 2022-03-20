import { INetscriptHelper } from "./INetscriptHelper";
import { WorkerScript } from "../Netscript/WorkerScript";
import { IPlayer } from "../PersonObjects/IPlayer";
import { netscriptDelay } from "../NetscriptEvaluator";

import { OfficeSpace } from "../Corporation/OfficeSpace";
import { Employee } from "../Corporation/Employee";
import { Product } from "../Corporation/Product";
import { Material } from "../Corporation/Material";
import { Warehouse } from "../Corporation/Warehouse";
import { IIndustry } from "../Corporation/IIndustry";
import { ICorporation } from "../Corporation/ICorporation";

import {
  Corporation as NSCorporation,
  CorporationInfo,
  Employee as NSEmployee,
  Product as NSProduct,
  Material as NSMaterial,
  Warehouse as NSWarehouse,
  Division as NSDivision,
  WarehouseAPI,
  OfficeAPI,
  InvestmentOffer
} from "../ScriptEditor/NetscriptDefinitions";

import {
  NewIndustry,
  NewCity,
  UnlockUpgrade,
  LevelUpgrade,
  IssueDividends,
  SellMaterial,
  SellProduct,
  SetSmartSupply,
  BuyMaterial,
  AssignJob,
  UpgradeOfficeSize,
  ThrowParty,
  PurchaseWarehouse,
  UpgradeWarehouse,
  BuyCoffee,
  HireAdVert,
  MakeProduct,
  Research,
  ExportMaterial,
  CancelExportMaterial,
  SetMaterialMarketTA1,
  SetMaterialMarketTA2,
  SetProductMarketTA1,
  SetProductMarketTA2,
  BulkPurchase,
  SellShares,
  BuyBackShares,
  SetSmartSupplyUseLeftovers,
} from "../Corporation/Actions";
import { CorporationUnlockUpgrades } from "../Corporation/data/CorporationUnlockUpgrades";
import { CorporationUpgrades } from "../Corporation/data/CorporationUpgrades";
import { EmployeePositions } from "../Corporation/EmployeePositions";
import { calculateIntelligenceBonus } from "../PersonObjects/formulas/intelligence";
import { Industry } from "../Corporation/Industry";
import { IndustryResearchTrees, IndustryStartingCosts } from "../Corporation/IndustryData";
import { CorporationConstants } from "../Corporation/data/Constants";
import { IndustryUpgrades } from "../Corporation/IndustryUpgrades";
import { ResearchMap } from "../Corporation/ResearchMap";
import { Factions } from "../Faction/Factions";

export function NetscriptCorporation(
  player: IPlayer,
  workerScript: WorkerScript,
  helper: INetscriptHelper,
): NSCorporation {
  function createCorporation(corporationName: string, selfFund = true): boolean {
    if (!player.canAccessCorporation() || player.hasCorporation()) return false;
    if (!corporationName) return false;
    if (player.bitNodeN !== 3 && !selfFund) throw new Error("cannot use seed funds outside of BitNode 3");

    if (selfFund) {
      if (!player.canAfford(150e9)) return false;

      player.startCorporation(corporationName);
      player.loseMoney(150e9, "corporation");
    } else {
      player.startCorporation(corporationName, 500e6);
    }
    return true;
  }

  function hasUnlockUpgrade(upgradeName: string): boolean {
    const corporation = getCorporation();
    const upgrade = Object.values(CorporationUnlockUpgrades).find((upgrade) => upgrade[2] === upgradeName);
    if (upgrade === undefined) throw new Error(`No upgrade named '${upgradeName}'`);
    const upgN = upgrade[0];
    return corporation.unlockUpgrades[upgN] === 1;
  }

  function getUnlockUpgradeCost(upgradeName: string): number {
    const upgrade = Object.values(CorporationUnlockUpgrades).find((upgrade) => upgrade[2] === upgradeName);
    if (upgrade === undefined) throw new Error(`No upgrade named '${upgradeName}'`);
    return upgrade[1];
  }

  function getUpgradeLevel(aupgradeName: string): number {
    const upgradeName = helper.string("levelUpgrade", "upgradeName", aupgradeName);
    const corporation = getCorporation();
    const upgrade = Object.values(CorporationUpgrades).find((upgrade) => upgrade[4] === upgradeName);
    if (upgrade === undefined) throw new Error(`No upgrade named '${upgradeName}'`);
    const upgN = upgrade[0];
    return corporation.upgrades[upgN];
  }

  function getUpgradeLevelCost(aupgradeName: string): number {
    const upgradeName = helper.string("levelUpgrade", "upgradeName", aupgradeName);
    const corporation = getCorporation();
    const upgrade = Object.values(CorporationUpgrades).find((upgrade) => upgrade[4] === upgradeName);
    if (upgrade === undefined) throw new Error(`No upgrade named '${upgradeName}'`);
    const upgN = upgrade[0];
    const baseCost = upgrade[1];
    const priceMult = upgrade[2];
    const level = corporation.upgrades[upgN];
    return baseCost * Math.pow(priceMult, level);
  }

  function getExpandIndustryCost(industryName: string): number {
    const cost = IndustryStartingCosts[industryName];
    if (cost === undefined) {
      throw new Error(`Invalid industry: '${industryName}'`);
    }
    return cost;
  }

  function getExpandCityCost(): number {
    return CorporationConstants.OfficeInitialCost;
  }

  function getInvestmentOffer(): InvestmentOffer {
    const corporation = getCorporation();
    if (corporation.fundingRound >= CorporationConstants.FundingRoundShares.length || corporation.fundingRound >= CorporationConstants.FundingRoundMultiplier.length || corporation.public)
      return {
        funds: 0,
        shares: 0,
        round: corporation.fundingRound + 1 // Make more readable
      }; // Don't throw an error here, no reason to have a second function to check if you can get investment.
    const val = corporation.determineValuation();
    const percShares = CorporationConstants.FundingRoundShares[corporation.fundingRound];
    const roundMultiplier = CorporationConstants.FundingRoundMultiplier[corporation.fundingRound];
    const funding = val * percShares * roundMultiplier;
    const investShares = Math.floor(CorporationConstants.INITIALSHARES * percShares);
    return {
      funds: funding,
      shares: investShares,
      round: corporation.fundingRound + 1 // Make more readable
    };
  }

  function acceptInvestmentOffer(): boolean {
    const corporation = getCorporation();
    if (corporation.fundingRound >= CorporationConstants.FundingRoundShares.length || corporation.fundingRound >= CorporationConstants.FundingRoundMultiplier.length || corporation.public) return false;
    const val = corporation.determineValuation();
    const percShares = CorporationConstants.FundingRoundShares[corporation.fundingRound];
    const roundMultiplier = CorporationConstants.FundingRoundMultiplier[corporation.fundingRound];
    const funding = val * percShares * roundMultiplier;
    const investShares = Math.floor(CorporationConstants.INITIALSHARES * percShares);
    corporation.fundingRound++;
    corporation.addFunds(funding);
    corporation.numShares -= investShares;
    return true;
  }

  function goPublic(numShares: number): boolean {
    const corporation = getCorporation();
    const initialSharePrice = corporation.determineValuation() / corporation.totalShares;
    if (isNaN(numShares)) throw new Error("Invalid value for number of issued shares");
    if (numShares < 0) throw new Error("Invalid value for number of issued shares");
    if (numShares > corporation.numShares) throw new Error("You don't have that many shares to issue!");
    corporation.public = true;
    corporation.sharePrice = initialSharePrice;
    corporation.issuedShares = numShares;
    corporation.numShares -= numShares;
    corporation.addFunds(numShares * initialSharePrice);
    return true;
  }


  function getResearchCost(division: IIndustry, researchName: string): number {
    const researchTree = IndustryResearchTrees[division.type];
    if (researchTree === undefined) throw new Error(`No research tree for industry '${division.type}'`);
    const allResearch = researchTree.getAllNodes();
    if (!allResearch.includes(researchName)) throw new Error(`No research named '${researchName}'`);
    const research = ResearchMap[researchName];
    return research.cost;
  }

  function hasResearched(division: IIndustry, researchName: string): boolean {
    return division.researched[researchName] === undefined ? false : division.researched[researchName] as boolean;
  }

  function bribe(factionName: string, amountCash: number, amountShares: number): boolean {
    if (!player.factions.includes(factionName)) throw new Error("Invalid faction name");
    if (isNaN(amountCash) || amountCash < 0 || isNaN(amountShares) || amountShares < 0) throw new Error("Invalid value for amount field! Must be numeric, grater than 0.");

    const corporation = getCorporation();
    if (corporation.funds < amountCash) return false;
    if (corporation.numShares < amountShares) return false;
    const faction = Factions[factionName]
    const info = faction.getInfo();
    if (!info.offersWork()) return false;
    if (player.hasGangWith(factionName)) return false;

    const repGain = (amountCash + amountShares * corporation.sharePrice) / CorporationConstants.BribeToRepRatio;
    faction.playerReputation += repGain;
    corporation.funds = corporation.funds - amountCash;
    corporation.numShares -= amountShares;

    return true;
  }

  function getCorporation(): ICorporation {
    const corporation = player.corporation;
    if (corporation === null) throw new Error("cannot be called without a corporation");
    return corporation;
  }

  function getDivision(divisionName: any): IIndustry {
    const corporation = getCorporation();
    const division = corporation.divisions.find((div) => div.name === divisionName);
    if (division === undefined) throw new Error(`No division named '${divisionName}'`);
    return division;
  }

  function getOffice(divisionName: any, cityName: any): OfficeSpace {
    const division = getDivision(divisionName);
    if (!(cityName in division.offices)) throw new Error(`Invalid city name '${cityName}'`);
    const office = division.offices[cityName];
    if (office === 0) throw new Error(`${division.name} has not expanded to '${cityName}'`);
    return office;
  }

  function getWarehouse(divisionName: any, cityName: any): Warehouse {
    const division = getDivision(divisionName);
    if (!(cityName in division.warehouses)) throw new Error(`Invalid city name '${cityName}'`);
    const warehouse = division.warehouses[cityName];
    if (warehouse === 0) throw new Error(`${division.name} has not expanded to '${cityName}'`);
    return warehouse;
  }

  function getMaterial(divisionName: any, cityName: any, materialName: any): Material {
    const warehouse = getWarehouse(divisionName, cityName);
    const matName = (materialName as string).replace(/ /g, "");
    const material = warehouse.materials[matName];
    if (material === undefined) throw new Error(`Invalid material name: '${materialName}'`);
    return material;
  }

  function getProduct(divisionName: any, productName: any): Product {
    const division = getDivision(divisionName);
    const product = division.products[productName];
    if (product === undefined) throw new Error(`Invalid product name: '${productName}'`);
    return product;
  }

  function getEmployee(divisionName: any, cityName: any, employeeName: any): Employee {
    const office = getOffice(divisionName, cityName);
    const employee = office.employees.find((e) => e.name === employeeName);
    if (employee === undefined) throw new Error(`Invalid employee name: '${employeeName}'`);
    return employee;
  }

  function checkAccess(func: string, api?: number): void {
    if (player.corporation === null) throw helper.makeRuntimeErrorMsg(`corporation.${func}`, "Must own a corporation.");
    if (!api) return;

    if (!player.corporation.unlockUpgrades[api])
      throw helper.makeRuntimeErrorMsg(`corporation.${func}`, "You do not have access to this API.");
  }

  function getSafeDivision(division: Industry): NSDivision {
    const cities: string[] = [];
    for (const office of Object.values(division.offices)) {
      if (office === 0) continue;
      cities.push(office.loc);
    }
    return {
      name: division.name,
      type: division.type,
      awareness: division.awareness,
      popularity: division.popularity,
      prodMult: division.prodMult,
      research: division.sciResearch.qty,
      lastCycleRevenue: division.lastCycleRevenue,
      lastCycleExpenses: division.lastCycleExpenses,
      thisCycleRevenue: division.thisCycleRevenue,
      thisCycleExpenses: division.thisCycleExpenses,
      upgrades: division.upgrades.slice(),
      cities: cities,
      products: division.products === undefined ? [] : Object.keys(division.products),
    };
  }

  const warehouseAPI: WarehouseAPI = {
    getPurchaseWarehouseCost: function (): number {
      checkAccess("getPurchaseWarehouseCost", 7);
      return CorporationConstants.WarehouseInitialCost;
    },
    getUpgradeWarehouseCost: function (adivisionName: any, acityName: any): number {
      checkAccess("upgradeWarehouse", 7);
      const divisionName = helper.string("getUpgradeWarehouseCost", "divisionName", adivisionName);
      const cityName = helper.string("getUpgradeWarehouseCost", "cityName", acityName);
      const warehouse = getWarehouse(divisionName, cityName);
      return CorporationConstants.WarehouseUpgradeBaseCost * Math.pow(1.07, warehouse.level + 1);
    },
    hasWarehouse: function (adivisionName: any, acityName: any): boolean {
      checkAccess("hasWarehouse", 7);
      const divisionName = helper.string("getWarehouse", "divisionName", adivisionName);
      const cityName = helper.string("getWarehouse", "cityName", acityName);
      const division = getDivision(divisionName);
      if (!(cityName in division.warehouses)) throw new Error(`Invalid city name '${cityName}'`);
      const warehouse = division.warehouses[cityName];
      return warehouse !== 0;
    },
    getWarehouse: function (adivisionName: any, acityName: any): NSWarehouse {
      checkAccess("getWarehouse", 7);
      const divisionName = helper.string("getWarehouse", "divisionName", adivisionName);
      const cityName = helper.string("getWarehouse", "cityName", acityName);
      const warehouse = getWarehouse(divisionName, cityName);
      return {
        level: warehouse.level,
        loc: warehouse.loc,
        size: warehouse.size,
        sizeUsed: warehouse.sizeUsed,
        smartSupplyEnabled: warehouse.smartSupplyEnabled
      };
    },
    getMaterial: function (adivisionName: any, acityName: any, amaterialName: any): NSMaterial {
      checkAccess("getMaterial", 7);
      const divisionName = helper.string("getMaterial", "divisionName", adivisionName);
      const cityName = helper.string("getMaterial", "cityName", acityName);
      const materialName = helper.string("getMaterial", "materialName", amaterialName);
      const material = getMaterial(divisionName, cityName, materialName);
      return {
        name: material.name,
        qty: material.qty,
        qlt: material.qlt,
        prod: material.prd,
        sell: material.sll,
      };
    },
    getProduct: function (adivisionName: any, aproductName: any): NSProduct {
      checkAccess("getProduct", 7);
      const divisionName = helper.string("getProduct", "divisionName", adivisionName);
      const productName = helper.string("getProduct", "productName", aproductName);
      const product = getProduct(divisionName, productName);
      return {
        name: product.name,
        dmd: product.dmd,
        cmp: product.cmp,
        pCost: product.pCost,
        sCost: product.sCost,
        cityData: product.data,
        developmentProgress: product.prog,
      };
    },
    purchaseWarehouse: function (adivisionName: any, acityName: any): void {
      checkAccess("purchaseWarehouse", 7);
      const divisionName = helper.string("purchaseWarehouse", "divisionName", adivisionName);
      const cityName = helper.string("purchaseWarehouse", "cityName", acityName);
      const corporation = getCorporation();
      PurchaseWarehouse(corporation, getDivision(divisionName), cityName);
    },
    upgradeWarehouse: function (adivisionName: any, acityName: any): void {
      checkAccess("upgradeWarehouse", 7);
      const divisionName = helper.string("upgradeWarehouse", "divisionName", adivisionName);
      const cityName = helper.string("upgradeWarehouse", "cityName", acityName);
      const corporation = getCorporation();
      UpgradeWarehouse(corporation, getDivision(divisionName), getWarehouse(divisionName, cityName));
    },
    sellMaterial: function (adivisionName: any, acityName: any, amaterialName: any, aamt: any, aprice: any): void {
      checkAccess("sellMaterial", 7);
      const divisionName = helper.string("sellMaterial", "divisionName", adivisionName);
      const cityName = helper.string("sellMaterial", "cityName", acityName);
      const materialName = helper.string("sellMaterial", "materialName", amaterialName);
      const amt = helper.string("sellMaterial", "amt", aamt);
      const price = helper.string("sellMaterial", "price", aprice);
      const material = getMaterial(divisionName, cityName, materialName);
      SellMaterial(material, amt, price);
    },
    sellProduct: function (
      adivisionName: any,
      acityName: any,
      aproductName: any,
      aamt: any,
      aprice: any,
      aall: any,
    ): void {
      checkAccess("sellProduct", 7);
      const divisionName = helper.string("sellProduct", "divisionName", adivisionName);
      const cityName = helper.string("sellProduct", "cityName", acityName);
      const productName = helper.string("sellProduct", "productName", aproductName);
      const amt = helper.string("sellProduct", "amt", aamt);
      const price = helper.string("sellProduct", "price", aprice);
      const all = helper.boolean(aall);
      const product = getProduct(divisionName, productName);
      SellProduct(product, cityName, amt, price, all);
    },
    discontinueProduct: function (adivisionName: any, aproductName: any): void {
      checkAccess("discontinueProduct", 7);
      const divisionName = helper.string("discontinueProduct", "divisionName", adivisionName);
      const productName = helper.string("discontinueProduct", "productName", aproductName);
      getDivision(divisionName).discontinueProduct(getProduct(divisionName, productName));
    },
    setSmartSupply: function (adivisionName: any, acityName: any, aenabled: any): void {
      checkAccess("setSmartSupply", 7);
      const divisionName = helper.string("setSmartSupply", "divisionName", adivisionName);
      const cityName = helper.string("sellProduct", "cityName", acityName);
      const enabled = helper.boolean(aenabled);
      const warehouse = getWarehouse(divisionName, cityName);
      if (!hasUnlockUpgrade("Smart Supply"))
        throw helper.makeRuntimeErrorMsg(`corporation.setSmartSupply`, `You have not purchased the Smart Supply upgrade!`);
      SetSmartSupply(warehouse, enabled);
    },
    setSmartSupplyUseLeftovers: function (adivisionName: any, acityName: any, amaterialName: any, aenabled: any): void {
      checkAccess("setSmartSupplyUseLeftovers", 7);
      const divisionName = helper.string("setSmartSupply", "divisionName", adivisionName);
      const cityName = helper.string("sellProduct", "cityName", acityName);
      const materialName = helper.string("sellProduct", "materialName", amaterialName);
      const enabled = helper.boolean(aenabled);
      const warehouse = getWarehouse(divisionName, cityName);
      const material = getMaterial(divisionName, cityName, materialName);
      if (!hasUnlockUpgrade("Smart Supply"))
        throw helper.makeRuntimeErrorMsg(`corporation.setSmartSupply`, `You have not purchased the Smart Supply upgrade!`);
      SetSmartSupplyUseLeftovers(warehouse, material, enabled);
    },
    buyMaterial: function (adivisionName: any, acityName: any, amaterialName: any, aamt: any): void {
      checkAccess("buyMaterial", 7);
      const divisionName = helper.string("buyMaterial", "divisionName", adivisionName);
      const cityName = helper.string("buyMaterial", "cityName", acityName);
      const materialName = helper.string("buyMaterial", "materialName", amaterialName);
      const amt = helper.number("buyMaterial", "amt", aamt);
      if (amt < 0) throw new Error("Invalid value for amount field! Must be numeric and greater than 0");
      const material = getMaterial(divisionName, cityName, materialName);
      BuyMaterial(material, amt);
    },
    bulkPurchase: function (adivisionName: any, acityName: any, amaterialName: any, aamt: any): void {
      checkAccess("bulkPurchase", 7);
      const divisionName = helper.string("bulkPurchase", "divisionName", adivisionName);
      if (!hasResearched(getDivision(adivisionName), "Bulk Purchasing")) throw new Error(`You have not researched Bulk Purchasing in ${divisionName}`)
      const corporation = getCorporation();
      const cityName = helper.string("bulkPurchase", "cityName", acityName);
      const materialName = helper.string("bulkPurchase", "materialName", amaterialName);
      const amt = helper.number("bulkPurchase", "amt", aamt);
      const warehouse = getWarehouse(divisionName, cityName)
      const material = getMaterial(divisionName, cityName, materialName);
      BulkPurchase(corporation, warehouse, material, amt);
    },
    makeProduct: function (
      adivisionName: any,
      acityName: any,
      aproductName: any,
      adesignInvest: any,
      amarketingInvest: any,
    ): void {
      checkAccess("makeProduct", 7);
      const divisionName = helper.string("makeProduct", "divisionName", adivisionName);
      const cityName = helper.string("makeProduct", "cityName", acityName);
      const productName = helper.string("makeProduct", "productName", aproductName);
      const designInvest = helper.number("makeProduct", "designInvest", adesignInvest);
      const marketingInvest = helper.number("makeProduct", "marketingInvest", amarketingInvest);
      const corporation = getCorporation();
      MakeProduct(corporation, getDivision(divisionName), cityName, productName, designInvest, marketingInvest);
    },
    exportMaterial: function (
      asourceDivision: any,
      asourceCity: any,
      atargetDivision: any,
      atargetCity: any,
      amaterialName: any,
      aamt: any,
    ): void {
      checkAccess("exportMaterial", 7);
      const sourceDivision = helper.string("exportMaterial", "sourceDivision", asourceDivision);
      const sourceCity = helper.string("exportMaterial", "sourceCity", asourceCity);
      const targetDivision = helper.string("exportMaterial", "targetDivision", atargetDivision);
      const targetCity = helper.string("exportMaterial", "targetCity", atargetCity);
      const materialName = helper.string("exportMaterial", "materialName", amaterialName);
      const amt = helper.string("exportMaterial", "amt", aamt);
      ExportMaterial(targetDivision, targetCity, getMaterial(sourceDivision, sourceCity, materialName), amt + "", getDivision(targetDivision));
    },
    cancelExportMaterial: function (
      asourceDivision: any,
      asourceCity: any,
      atargetDivision: any,
      atargetCity: any,
      amaterialName: any,
      aamt: any,
    ): void {
      checkAccess("cancelExportMaterial", 7);
      const sourceDivision = helper.string("cancelExportMaterial", "sourceDivision", asourceDivision);
      const sourceCity = helper.string("cancelExportMaterial", "sourceCity", asourceCity);
      const targetDivision = helper.string("cancelExportMaterial", "targetDivision", atargetDivision);
      const targetCity = helper.string("cancelExportMaterial", "targetCity", atargetCity);
      const materialName = helper.string("cancelExportMaterial", "materialName", amaterialName);
      const amt = helper.string("cancelExportMaterial", "amt", aamt);
      CancelExportMaterial(targetDivision, targetCity, getMaterial(sourceDivision, sourceCity, materialName), amt + "");
    },
    setMaterialMarketTA1: function (adivisionName: any, acityName: any, amaterialName: any, aon: any): void {
      checkAccess("setMaterialMarketTA1", 7);
      const divisionName = helper.string("setMaterialMarketTA1", "divisionName", adivisionName);
      const cityName = helper.string("setMaterialMarketTA1", "cityName", acityName);
      const materialName = helper.string("setMaterialMarketTA1", "materialName", amaterialName);
      const on = helper.boolean(aon);
      if (!getDivision(divisionName).hasResearch("Market-TA.I"))
        throw helper.makeRuntimeErrorMsg(`corporation.setMaterialMarketTA1`, `You have not researched MarketTA.I for division: ${divisionName}`);
      SetMaterialMarketTA1(getMaterial(divisionName, cityName, materialName), on);
    },
    setMaterialMarketTA2: function (adivisionName: any, acityName: any, amaterialName: any, aon: any): void {
      checkAccess("setMaterialMarketTA2", 7);
      const divisionName = helper.string("setMaterialMarketTA2", "divisionName", adivisionName);
      const cityName = helper.string("setMaterialMarketTA2", "cityName", acityName);
      const materialName = helper.string("setMaterialMarketTA2", "materialName", amaterialName);
      const on = helper.boolean(aon);
      if (!getDivision(divisionName).hasResearch("Market-TA.II"))
        throw helper.makeRuntimeErrorMsg(`corporation.setMaterialMarketTA2`, `You have not researched MarketTA.II for division: ${divisionName}`);
      SetMaterialMarketTA2(getMaterial(divisionName, cityName, materialName), on);
    },
    setProductMarketTA1: function (adivisionName: any, aproductName: any, aon: any): void {
      checkAccess("setProductMarketTA1", 7);
      const divisionName = helper.string("setProductMarketTA1", "divisionName", adivisionName);
      const productName = helper.string("setProductMarketTA1", "productName", aproductName);
      const on = helper.boolean(aon);
      if (!getDivision(divisionName).hasResearch("Market-TA.I"))
        throw helper.makeRuntimeErrorMsg(`corporation.setProductMarketTA1`, `You have not researched MarketTA.I for division: ${divisionName}`);
      SetProductMarketTA1(getProduct(divisionName, productName), on);
    },
    setProductMarketTA2: function (adivisionName: any, aproductName: any, aon: any): void {
      checkAccess("setProductMarketTA2", 7);
      const divisionName = helper.string("setProductMarketTA2", "divisionName", adivisionName);
      const productName = helper.string("setProductMarketTA2", "productName", aproductName);
      const on = helper.boolean(aon);
      if (!getDivision(divisionName).hasResearch("Market-TA.II"))
        throw helper.makeRuntimeErrorMsg(`corporation.setProductMarketTA2`, `You have not researched MarketTA.II for division: ${divisionName}`);
      SetProductMarketTA2(getProduct(divisionName, productName), on);
    },
  };

  const officeAPI: OfficeAPI = {
    getHireAdVertCost: function (adivisionName: any): number {
      checkAccess("getHireAdVertCost", 8);
      const divisionName = helper.string("getHireAdVertCost", "divisionName", adivisionName);
      const division = getDivision(divisionName);
      const upgrade = IndustryUpgrades[1];
      return upgrade[1] * Math.pow(upgrade[2], division.upgrades[1]);
    },
    getHireAdVertCount: function (adivisionName: any): number {
      checkAccess("getHireAdVertCount", 8);
      const divisionName = helper.string("getHireAdVertCount", "divisionName", adivisionName);
      const division = getDivision(divisionName);
      return division.upgrades[1]
    },
    getResearchCost: function (adivisionName: any, aresearchName: any): number {
      checkAccess("getResearchCost", 8);
      const divisionName = helper.string("getResearchCost", "divisionName", adivisionName);
      const researchName = helper.string("getResearchCost", "researchName", aresearchName);
      return getResearchCost(getDivision(divisionName), researchName);
    },
    hasResearched: function (adivisionName: any, aresearchName: any): boolean {
      checkAccess("hasResearched", 8);
      const divisionName = helper.string("hasResearched", "divisionName", adivisionName);
      const researchName = helper.string("hasResearched", "researchName", aresearchName);
      return hasResearched(getDivision(divisionName), researchName);
    },
    setAutoJobAssignment: function (adivisionName: any, acityName: any, ajob: any, aamount: any): Promise<boolean> {
      checkAccess("setAutoJobAssignment", 8);
      const divisionName = helper.string("setAutoJobAssignment", "divisionName", adivisionName);
      const cityName = helper.string("setAutoJobAssignment", "cityName", acityName);
      const amount = helper.number("setAutoJobAssignment", "amount", aamount);
      const job = helper.string("setAutoJobAssignment", "job", ajob);
      const office = getOffice(divisionName, cityName);
      if (!Object.values(EmployeePositions).includes(job)) throw new Error(`'${job}' is not a valid job.`);
      return netscriptDelay(1000, workerScript).then(function () {
        if (workerScript.env.stopFlag) {
          return Promise.reject(workerScript);
        }
        return Promise.resolve(office.setEmployeeToJob(job, amount));
      });
    },
    getOfficeSizeUpgradeCost: function (adivisionName: any, acityName: any, asize: any): number {
      checkAccess("getOfficeSizeUpgradeCost", 8);
      const divisionName = helper.string("getOfficeSizeUpgradeCost", "divisionName", adivisionName);
      const cityName = helper.string("getOfficeSizeUpgradeCost", "cityName", acityName);
      const size = helper.number("getOfficeSizeUpgradeCost", "size", asize);
      if (size < 0) throw new Error("Invalid value for size field! Must be numeric and greater than 0");
      const office = getOffice(divisionName, cityName);
      const initialPriceMult = Math.round(office.size / CorporationConstants.OfficeInitialSize);
      const costMultiplier = 1.09;
      let mult = 0;
      for (let i = 0; i < size / CorporationConstants.OfficeInitialSize; ++i) {
        mult += Math.pow(costMultiplier, initialPriceMult + i);
      }
      return CorporationConstants.OfficeInitialCost * mult;
    },
    assignJob: function (adivisionName: any, acityName: any, aemployeeName: any, ajob: any): Promise<void> {
      checkAccess("assignJob", 8);
      const divisionName = helper.string("assignJob", "divisionName", adivisionName);
      const cityName = helper.string("assignJob", "cityName", acityName);
      const employeeName = helper.string("assignJob", "employeeName", aemployeeName);
      const job = helper.string("assignJob", "job", ajob);
      const employee = getEmployee(divisionName, cityName, employeeName);
      return netscriptDelay(1000, workerScript).then(function () {
        return Promise.resolve(AssignJob(employee, job));
      });
    },
    hireEmployee: function (adivisionName: any, acityName: any): any {
      checkAccess("hireEmployee", 8);
      const divisionName = helper.string("hireEmployee", "divisionName", adivisionName);
      const cityName = helper.string("hireEmployee", "cityName", acityName);
      const office = getOffice(divisionName, cityName);
      return office.hireRandomEmployee();
    },
    upgradeOfficeSize: function (adivisionName: any, acityName: any, asize: any): void {
      checkAccess("upgradeOfficeSize", 8);
      const divisionName = helper.string("upgradeOfficeSize", "divisionName", adivisionName);
      const cityName = helper.string("upgradeOfficeSize", "cityName", acityName);
      const size = helper.number("upgradeOfficeSize", "size", asize);
      if (size < 0) throw new Error("Invalid value for size field! Must be numeric and greater than 0");
      const office = getOffice(divisionName, cityName);
      const corporation = getCorporation();
      UpgradeOfficeSize(corporation, office, size);
    },
    throwParty: function (adivisionName: any, acityName: any, acostPerEmployee: any): Promise<number> {
      checkAccess("throwParty", 8);
      const divisionName = helper.string("throwParty", "divisionName", adivisionName);
      const cityName = helper.string("throwParty", "cityName", acityName);
      const costPerEmployee = helper.number("throwParty", "costPerEmployee", acostPerEmployee);
      if (costPerEmployee < 0) throw new Error("Invalid value for Cost Per Employee field! Must be numeric and greater than 0");
      const office = getOffice(divisionName, cityName);
      const corporation = getCorporation();
      return netscriptDelay(
        (60 * 1000) / (player.hacking_speed_mult * calculateIntelligenceBonus(player.intelligence, 1)),
        workerScript,
      ).then(function () {
        return Promise.resolve(ThrowParty(corporation, office, costPerEmployee));
      });
    },
    buyCoffee: function (adivisionName: any, acityName: any): Promise<void> {
      checkAccess("buyCoffee", 8);
      const divisionName = helper.string("buyCoffee", "divisionName", adivisionName);
      const cityName = helper.string("buyCoffee", "cityName", acityName);
      const corporation = getCorporation();
      return netscriptDelay(
        (60 * 1000) / (player.hacking_speed_mult * calculateIntelligenceBonus(player.intelligence, 1)),
        workerScript,
      ).then(function () {
        return Promise.resolve(BuyCoffee(corporation, getDivision(divisionName), getOffice(divisionName, cityName)));
      });
    },
    hireAdVert: function (adivisionName: any): void {
      checkAccess("hireAdVert", 8);
      const divisionName = helper.string("hireAdVert", "divisionName", adivisionName);
      const corporation = getCorporation();
      HireAdVert(corporation, getDivision(divisionName), getOffice(divisionName, "Sector-12"));
    },
    research: function (adivisionName: any, aresearchName: any): void {
      checkAccess("research", 8);
      const divisionName = helper.string("research", "divisionName", adivisionName);
      const researchName = helper.string("research", "researchName", aresearchName);
      Research(getDivision(divisionName), researchName);
    },
    getOffice: function (adivisionName: any, acityName: any): any {
      checkAccess("getOffice", 8);
      const divisionName = helper.string("getOffice", "divisionName", adivisionName);
      const cityName = helper.string("getOffice", "cityName", acityName);
      const office = getOffice(divisionName, cityName);
      return {
        loc: office.loc,
        size: office.size,
        minEne: office.minEne,
        maxEne: office.maxEne,
        minHap: office.minHap,
        maxHap: office.maxHap,
        maxMor: office.maxMor,
        employees: office.employees.map((e) => e.name),
        employeeProd: {
          Operations: office.employeeProd[EmployeePositions.Operations],
          Engineer: office.employeeProd[EmployeePositions.Engineer],
          Business: office.employeeProd[EmployeePositions.Business],
          Management: office.employeeProd[EmployeePositions.Management],
          "Research & Development": office.employeeProd[EmployeePositions.RandD],
          Training: office.employeeProd[EmployeePositions.Training],
        },
      };
    },
    getEmployee: function (adivisionName: any, acityName: any, aemployeeName: any): NSEmployee {
      checkAccess("getEmployee", 8);
      const divisionName = helper.string("getEmployee", "divisionName", adivisionName);
      const cityName = helper.string("getEmployee", "cityName", acityName);
      const employeeName = helper.string("getEmployee", "employeeName", aemployeeName);
      const employee = getEmployee(divisionName, cityName, employeeName);
      return {
        name: employee.name,
        mor: employee.mor,
        hap: employee.hap,
        ene: employee.ene,
        int: employee.int,
        cha: employee.cha,
        exp: employee.exp,
        cre: employee.cre,
        eff: employee.eff,
        sal: employee.sal,
        loc: employee.loc,
        pos: employee.pos,
      };
    },
  };

  return {
    ...warehouseAPI,
    ...officeAPI,
    expandIndustry: function (aindustryName: any, adivisionName: any): void {
      checkAccess("expandIndustry");
      const industryName = helper.string("expandIndustry", "industryName", aindustryName);
      const divisionName = helper.string("expandIndustry", "divisionName", adivisionName);
      const corporation = getCorporation();
      NewIndustry(corporation, industryName, divisionName);
    },
    expandCity: function (adivisionName: any, acityName: any): void {
      checkAccess("expandCity");
      const divisionName = helper.string("expandCity", "divisionName", adivisionName);
      const cityName = helper.string("expandCity", "cityName", acityName);
      if (!CorporationConstants.Cities.includes(cityName)) throw new Error("Invalid city name");
      const corporation = getCorporation();
      const division = getDivision(divisionName);
      NewCity(corporation, division, cityName);
    },
    unlockUpgrade: function (aupgradeName: any): void {
      checkAccess("unlockUpgrade");
      const upgradeName = helper.string("unlockUpgrade", "upgradeName", aupgradeName);
      const corporation = getCorporation();
      const upgrade = Object.values(CorporationUnlockUpgrades).find((upgrade) => upgrade[2] === upgradeName);
      if (upgrade === undefined) throw new Error(`No upgrade named '${upgradeName}'`);
      UnlockUpgrade(corporation, upgrade);
    },
    levelUpgrade: function (aupgradeName: any): void {
      checkAccess("levelUpgrade");
      const upgradeName = helper.string("levelUpgrade", "upgradeName", aupgradeName);
      const corporation = getCorporation();
      const upgrade = Object.values(CorporationUpgrades).find((upgrade) => upgrade[4] === upgradeName);
      if (upgrade === undefined) throw new Error(`No upgrade named '${upgradeName}'`);
      LevelUpgrade(corporation, upgrade);
    },
    issueDividends: function (apercent: any): void {
      checkAccess("issueDividends");
      const percent = helper.number("issueDividends", "percent", apercent);
      if (percent < 0 || percent > 100) throw new Error("Invalid value for percent field! Must be numeric, greater than 0, and less than 100");
      const corporation = getCorporation();
      if (!corporation.public)
        throw helper.makeRuntimeErrorMsg(`corporation.issueDividends`, `Your company has not gone public!`);
      IssueDividends(corporation, percent);
    },

    // If you modify these objects you will affect them for real, it's not
    // copies.
    getDivision: function (adivisionName: any): NSDivision {
      checkAccess("getDivision");
      const divisionName = helper.string("getDivision", "divisionName", adivisionName);
      const division = getDivision(divisionName);
      return getSafeDivision(division);
    },
    getCorporation: function (): CorporationInfo {
      checkAccess("getCorporation");
      const corporation = getCorporation();
      return {
        name: corporation.name,
        funds: corporation.funds,
        revenue: corporation.revenue,
        expenses: corporation.expenses,
        public: corporation.public,
        totalShares: corporation.totalShares,
        numShares: corporation.numShares,
        shareSaleCooldown: corporation.shareSaleCooldown,
        issuedShares: corporation.issuedShares,
        sharePrice: corporation.sharePrice,
        state: corporation.state.getState(),
        divisions: corporation.divisions.map((division): NSDivision => getSafeDivision(division)),
      };
    },
    createCorporation: function (acorporationName: string, selfFund = true): boolean {
      const corporationName = helper.string("createCorporation", "corporationName", acorporationName);
      return createCorporation(corporationName, selfFund);
    },
    hasUnlockUpgrade: function (aupgradeName: any): boolean {
      checkAccess("hasUnlockUpgrade");
      const upgradeName = helper.string("hasUnlockUpgrade", "upgradeName", aupgradeName);
      return hasUnlockUpgrade(upgradeName);
    },
    getUnlockUpgradeCost: function (aupgradeName: any): number {
      checkAccess("getUnlockUpgradeCost");
      const upgradeName = helper.string("getUnlockUpgradeCost", "upgradeName", aupgradeName);
      return getUnlockUpgradeCost(upgradeName);
    },
    getUpgradeLevel: function (aupgradeName: any): number {
      checkAccess("hasUnlockUpgrade");
      const upgradeName = helper.string("getUpgradeLevel", "upgradeName", aupgradeName);
      return getUpgradeLevel(upgradeName);
    },
    getUpgradeLevelCost: function (aupgradeName: any): number {
      checkAccess("getUpgradeLevelCost");
      const upgradeName = helper.string("getUpgradeLevelCost", "upgradeName", aupgradeName);
      return getUpgradeLevelCost(upgradeName);
    },
    getExpandIndustryCost: function (aindustryName: any): number {
      checkAccess("getExpandIndustryCost");
      const industryName = helper.string("getExpandIndustryCost", "industryName", aindustryName);
      return getExpandIndustryCost(industryName);
    },
    getExpandCityCost: function (): number {
      checkAccess("getExpandCityCost");
      return getExpandCityCost();
    },
    getInvestmentOffer: function (): InvestmentOffer {
      checkAccess("getInvestmentOffer");
      return getInvestmentOffer();
    },
    acceptInvestmentOffer: function (): boolean {
      checkAccess("acceptInvestmentOffer");
      return acceptInvestmentOffer();
    },
    goPublic: function (anumShares: any): boolean {
      checkAccess("acceptInvestmentOffer");
      const numShares = helper.number("goPublic", "numShares", anumShares);
      return goPublic(numShares);
    },
    sellShares: function (anumShares: any): number {
      checkAccess("acceptInvestmentOffer");
      const numShares = helper.number("sellStock", "numShares", anumShares);
      return SellShares(getCorporation(), player, numShares);
    },
    buyBackShares: function (anumShares: any): boolean {
      checkAccess("acceptInvestmentOffer");
      const numShares = helper.number("buyStock", "numShares", anumShares);
      return BuyBackShares(getCorporation(), player, numShares);
    },
    bribe: function (afactionName: string, aamountCash: any, aamountShares: any): boolean {
      checkAccess("bribe");
      const factionName = helper.string("bribe", "factionName", afactionName);
      const amountCash = helper.number("bribe", "amountCash", aamountCash);
      const amountShares = helper.number("bribe", "amountShares", aamountShares);
      return bribe(factionName, amountCash, amountShares);
    },
  };
}
