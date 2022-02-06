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
  InvestmentOffer,
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

  function getUpgradeLevel(_upgradeName: string): number {
    const upgradeName = helper.string("levelUpgrade", "upgradeName", _upgradeName);
    const corporation = getCorporation();
    const upgrade = Object.values(CorporationUpgrades).find((upgrade) => upgrade[4] === upgradeName);
    if (upgrade === undefined) throw new Error(`No upgrade named '${upgradeName}'`);
    const upgN = upgrade[0];
    return corporation.upgrades[upgN];
  }

  function getUpgradeLevelCost(_upgradeName: string): number {
    const upgradeName = helper.string("levelUpgrade", "upgradeName", _upgradeName);
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
    if (
      corporation.fundingRound >= CorporationConstants.FundingRoundShares.length ||
      corporation.fundingRound >= CorporationConstants.FundingRoundMultiplier.length ||
      corporation.public
    )
      return {
        funds: 0,
        shares: 0,
        round: corporation.fundingRound + 1, // Make more readable
      }; // Don't throw an error here, no reason to have a second function to check if you can get investment.
    const val = corporation.determineValuation();
    const percShares = CorporationConstants.FundingRoundShares[corporation.fundingRound];
    const roundMultiplier = CorporationConstants.FundingRoundMultiplier[corporation.fundingRound];
    const funding = val * percShares * roundMultiplier;
    const investShares = Math.floor(CorporationConstants.INITIALSHARES * percShares);
    return {
      funds: funding,
      shares: investShares,
      round: corporation.fundingRound + 1, // Make more readable
    };
  }

  function acceptInvestmentOffer(): boolean {
    const corporation = getCorporation();
    if (
      corporation.fundingRound >= CorporationConstants.FundingRoundShares.length ||
      corporation.fundingRound >= CorporationConstants.FundingRoundMultiplier.length ||
      corporation.public
    )
      return false;
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
    return division.researched[researchName] === undefined ? false : (division.researched[researchName] as boolean);
  }

  function bribe(factionName: string, amountCash: number, amountShares: number): boolean {
    if (!player.factions.includes(factionName)) throw new Error("Invalid faction name");
    if (isNaN(amountCash) || amountCash < 0 || isNaN(amountShares) || amountShares < 0)
      throw new Error("Invalid value for amount field! Must be numeric, grater than 0.");

    const corporation = getCorporation();
    if (corporation.funds < amountCash) return false;
    if (corporation.numShares < amountShares) return false;
    const faction = Factions[factionName];
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

  function getDivision(divisionName: string): IIndustry {
    const corporation = getCorporation();
    const division = corporation.divisions.find((div) => div.name === divisionName);
    if (division === undefined) throw new Error(`No division named '${divisionName}'`);
    return division;
  }

  function getOffice(divisionName: string, cityName: string): OfficeSpace {
    const division = getDivision(divisionName);
    if (!(cityName in division.offices)) throw new Error(`Invalid city name '${cityName}'`);
    const office = division.offices[cityName];
    if (office === 0) throw new Error(`${division.name} has not expanded to '${cityName}'`);
    return office;
  }

  function getWarehouse(divisionName: string, cityName: string): Warehouse {
    const division = getDivision(divisionName);
    if (!(cityName in division.warehouses)) throw new Error(`Invalid city name '${cityName}'`);
    const warehouse = division.warehouses[cityName];
    if (warehouse === 0) throw new Error(`${division.name} has not expanded to '${cityName}'`);
    return warehouse;
  }

  function getMaterial(divisionName: string, cityName: string, materialName: string): Material {
    const warehouse = getWarehouse(divisionName, cityName);
    const matName = (materialName as string).replace(/ /g, "");
    const material = warehouse.materials[matName];
    if (material === undefined) throw new Error(`Invalid material name: '${materialName}'`);
    return material;
  }

  function getProduct(divisionName: string, productName: string): Product {
    const division = getDivision(divisionName);
    const product = division.products[productName];
    if (product === undefined) throw new Error(`Invalid product name: '${productName}'`);
    return product;
  }

  function getEmployee(divisionName: string, cityName: string, employeeName: string): Employee {
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
    getUpgradeWarehouseCost: function (_divisionName: unknown, _cityName: unknown): number {
      checkAccess("upgradeWarehouse", 7);
      const divisionName = helper.string("getUpgradeWarehouseCost", "divisionName", _divisionName);
      const cityName = helper.city("getUpgradeWarehouseCost", "cityName", _cityName);
      const warehouse = getWarehouse(divisionName, cityName);
      return CorporationConstants.WarehouseUpgradeBaseCost * Math.pow(1.07, warehouse.level + 1);
    },
    hasWarehouse: function (_divisionName: unknown, _cityName: unknown): boolean {
      checkAccess("hasWarehouse", 7);
      const divisionName = helper.string("getWarehouse", "divisionName", _divisionName);
      const cityName = helper.city("getWarehouse", "cityName", _cityName);
      const division = getDivision(divisionName);
      if (!(cityName in division.warehouses)) throw new Error(`Invalid city name '${cityName}'`);
      const warehouse = division.warehouses[cityName];
      return warehouse !== 0;
    },
    getWarehouse: function (_divisionName: unknown, _cityName: unknown): NSWarehouse {
      checkAccess("getWarehouse", 7);
      const divisionName = helper.string("getWarehouse", "divisionName", _divisionName);
      const cityName = helper.city("getWarehouse", "cityName", _cityName);
      const warehouse = getWarehouse(divisionName, cityName);
      return {
        level: warehouse.level,
        loc: warehouse.loc,
        size: warehouse.size,
        sizeUsed: warehouse.sizeUsed,
        smartSupplyEnabled: warehouse.smartSupplyEnabled,
      };
    },
    getMaterial: function (_divisionName: unknown, _cityName: unknown, _materialName: unknown): NSMaterial {
      checkAccess("getMaterial", 7);
      const divisionName = helper.string("getMaterial", "divisionName", _divisionName);
      const cityName = helper.city("getMaterial", "cityName", _cityName);
      const materialName = helper.string("getMaterial", "materialName", _materialName);
      const material = getMaterial(divisionName, cityName, materialName);
      return {
        name: material.name,
        qty: material.qty,
        qlt: material.qlt,
        prod: material.prd,
        sell: material.sll,
      };
    },
    getProduct: function (_divisionName: unknown, _productName: unknown): NSProduct {
      checkAccess("getProduct", 7);
      const divisionName = helper.string("getProduct", "divisionName", _divisionName);
      const productName = helper.string("getProduct", "productName", _productName);
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
    purchaseWarehouse: function (_divisionName: unknown, _cityName: unknown): void {
      checkAccess("purchaseWarehouse", 7);
      const divisionName = helper.string("purchaseWarehouse", "divisionName", _divisionName);
      const cityName = helper.city("purchaseWarehouse", "cityName", _cityName);
      const corporation = getCorporation();
      PurchaseWarehouse(corporation, getDivision(divisionName), cityName);
    },
    upgradeWarehouse: function (_divisionName: unknown, _cityName: unknown): void {
      checkAccess("upgradeWarehouse", 7);
      const divisionName = helper.string("upgradeWarehouse", "divisionName", _divisionName);
      const cityName = helper.city("upgradeWarehouse", "cityName", _cityName);
      const corporation = getCorporation();
      UpgradeWarehouse(corporation, getDivision(divisionName), getWarehouse(divisionName, cityName));
    },
    sellMaterial: function (
      _divisionName: unknown,
      _cityName: unknown,
      _materialName: unknown,
      _amt: unknown,
      _price: unknown,
    ): void {
      checkAccess("sellMaterial", 7);
      const divisionName = helper.string("sellMaterial", "divisionName", _divisionName);
      const cityName = helper.city("sellMaterial", "cityName", _cityName);
      const materialName = helper.string("sellMaterial", "materialName", _materialName);
      const amt = helper.string("sellMaterial", "amt", _amt);
      const price = helper.string("sellMaterial", "price", _price);
      const material = getMaterial(divisionName, cityName, materialName);
      SellMaterial(material, amt, price);
    },
    sellProduct: function (
      _divisionName: unknown,
      _cityName: unknown,
      _productName: unknown,
      _amt: unknown,
      _price: unknown,
      _all: unknown,
    ): void {
      checkAccess("sellProduct", 7);
      const divisionName = helper.string("sellProduct", "divisionName", _divisionName);
      const cityName = helper.city("sellProduct", "cityName", _cityName);
      const productName = helper.string("sellProduct", "productName", _productName);
      const amt = helper.string("sellProduct", "amt", _amt);
      const price = helper.string("sellProduct", "price", _price);
      const all = helper.boolean(_all);
      const product = getProduct(divisionName, productName);
      SellProduct(product, cityName, amt, price, all);
    },
    discontinueProduct: function (_divisionName: unknown, _productName: unknown): void {
      checkAccess("discontinueProduct", 7);
      const divisionName = helper.string("discontinueProduct", "divisionName", _divisionName);
      const productName = helper.string("discontinueProduct", "productName", _productName);
      getDivision(divisionName).discontinueProduct(getProduct(divisionName, productName));
    },
    setSmartSupply: function (_divisionName: unknown, _cityName: unknown, _enabled: unknown): void {
      checkAccess("setSmartSupply", 7);
      const divisionName = helper.string("setSmartSupply", "divisionName", _divisionName);
      const cityName = helper.city("sellProduct", "cityName", _cityName);
      const enabled = helper.boolean(_enabled);
      const warehouse = getWarehouse(divisionName, cityName);
      if (!hasUnlockUpgrade("Smart Supply"))
        throw helper.makeRuntimeErrorMsg(
          `corporation.setSmartSupply`,
          `You have not purchased the Smart Supply upgrade!`,
        );
      SetSmartSupply(warehouse, enabled);
    },
    setSmartSupplyUseLeftovers: function (
      _divisionName: unknown,
      _cityName: unknown,
      _materialName: unknown,
      _enabled: unknown,
    ): void {
      checkAccess("setSmartSupplyUseLeftovers", 7);
      const divisionName = helper.string("setSmartSupply", "divisionName", _divisionName);
      const cityName = helper.city("sellProduct", "cityName", _cityName);
      const materialName = helper.string("sellProduct", "materialName", _materialName);
      const enabled = helper.boolean(_enabled);
      const warehouse = getWarehouse(divisionName, cityName);
      const material = getMaterial(divisionName, cityName, materialName);
      if (!hasUnlockUpgrade("Smart Supply"))
        throw helper.makeRuntimeErrorMsg(
          `corporation.setSmartSupply`,
          `You have not purchased the Smart Supply upgrade!`,
        );
      SetSmartSupplyUseLeftovers(warehouse, material, enabled);
    },
    buyMaterial: function (_divisionName: unknown, _cityName: unknown, _materialName: unknown, _amt: unknown): void {
      checkAccess("buyMaterial", 7);
      const divisionName = helper.string("buyMaterial", "divisionName", _divisionName);
      const cityName = helper.city("buyMaterial", "cityName", _cityName);
      const materialName = helper.string("buyMaterial", "materialName", _materialName);
      const amt = helper.number("buyMaterial", "amt", _amt);
      if (amt < 0) throw new Error("Invalid value for amount field! Must be numeric and greater than 0");
      const material = getMaterial(divisionName, cityName, materialName);
      BuyMaterial(material, amt);
    },
    bulkPurchase: function (_divisionName: unknown, _cityName: unknown, _materialName: unknown, _amt: unknown): void {
      checkAccess("bulkPurchase", 7);
      const divisionName = helper.string("bulkPurchase", "divisionName", _divisionName);
      if (!hasResearched(getDivision(divisionName), "Bulk Purchasing"))
        throw new Error(`You have not researched Bulk Purchasing in ${divisionName}`);
      const corporation = getCorporation();
      const cityName = helper.city("bulkPurchase", "cityName", _cityName);
      const materialName = helper.string("bulkPurchase", "materialName", _materialName);
      const amt = helper.number("bulkPurchase", "amt", _amt);
      const warehouse = getWarehouse(divisionName, cityName);
      const material = getMaterial(divisionName, cityName, materialName);
      BulkPurchase(corporation, warehouse, material, amt);
    },
    makeProduct: function (
      _divisionName: unknown,
      _cityName: unknown,
      _productName: unknown,
      _designInvest: unknown,
      _marketingInvest: unknown,
    ): void {
      checkAccess("makeProduct", 7);
      const divisionName = helper.string("makeProduct", "divisionName", _divisionName);
      const cityName = helper.city("makeProduct", "cityName", _cityName);
      const productName = helper.string("makeProduct", "productName", _productName);
      const designInvest = helper.number("makeProduct", "designInvest", _designInvest);
      const marketingInvest = helper.number("makeProduct", "marketingInvest", _marketingInvest);
      const corporation = getCorporation();
      MakeProduct(corporation, getDivision(divisionName), cityName, productName, designInvest, marketingInvest);
    },
    exportMaterial: function (
      _sourceDivision: unknown,
      _sourceCity: unknown,
      _targetDivision: unknown,
      _targetCity: unknown,
      _materialName: unknown,
      _amt: unknown,
    ): void {
      checkAccess("exportMaterial", 7);
      const sourceDivision = helper.string("exportMaterial", "sourceDivision", _sourceDivision);
      const sourceCity = helper.string("exportMaterial", "sourceCity", _sourceCity);
      const targetDivision = helper.string("exportMaterial", "targetDivision", _targetDivision);
      const targetCity = helper.string("exportMaterial", "targetCity", _targetCity);
      const materialName = helper.string("exportMaterial", "materialName", _materialName);
      const amt = helper.string("exportMaterial", "amt", _amt);
      ExportMaterial(
        targetDivision,
        targetCity,
        getMaterial(sourceDivision, sourceCity, materialName),
        amt + "",
        getDivision(targetDivision),
      );
    },
    cancelExportMaterial: function (
      _sourceDivision: unknown,
      _sourceCity: unknown,
      _targetDivision: unknown,
      _targetCity: unknown,
      _materialName: unknown,
      _amt: unknown,
    ): void {
      checkAccess("cancelExportMaterial", 7);
      const sourceDivision = helper.string("cancelExportMaterial", "sourceDivision", _sourceDivision);
      const sourceCity = helper.string("cancelExportMaterial", "sourceCity", _sourceCity);
      const targetDivision = helper.string("cancelExportMaterial", "targetDivision", _targetDivision);
      const targetCity = helper.string("cancelExportMaterial", "targetCity", _targetCity);
      const materialName = helper.string("cancelExportMaterial", "materialName", _materialName);
      const amt = helper.string("cancelExportMaterial", "amt", _amt);
      CancelExportMaterial(targetDivision, targetCity, getMaterial(sourceDivision, sourceCity, materialName), amt + "");
    },
    setMaterialMarketTA1: function (
      _divisionName: unknown,
      _cityName: unknown,
      _materialName: unknown,
      _on: unknown,
    ): void {
      checkAccess("setMaterialMarketTA1", 7);
      const divisionName = helper.string("setMaterialMarketTA1", "divisionName", _divisionName);
      const cityName = helper.city("setMaterialMarketTA1", "cityName", _cityName);
      const materialName = helper.string("setMaterialMarketTA1", "materialName", _materialName);
      const on = helper.boolean(_on);
      if (!getDivision(divisionName).hasResearch("Market-TA.I"))
        throw helper.makeRuntimeErrorMsg(
          `corporation.setMaterialMarketTA1`,
          `You have not researched MarketTA.I for division: ${divisionName}`,
        );
      SetMaterialMarketTA1(getMaterial(divisionName, cityName, materialName), on);
    },
    setMaterialMarketTA2: function (
      _divisionName: unknown,
      _cityName: unknown,
      _materialName: unknown,
      _on: unknown,
    ): void {
      checkAccess("setMaterialMarketTA2", 7);
      const divisionName = helper.string("setMaterialMarketTA2", "divisionName", _divisionName);
      const cityName = helper.city("setMaterialMarketTA2", "cityName", _cityName);
      const materialName = helper.string("setMaterialMarketTA2", "materialName", _materialName);
      const on = helper.boolean(_on);
      if (!getDivision(divisionName).hasResearch("Market-TA.II"))
        throw helper.makeRuntimeErrorMsg(
          `corporation.setMaterialMarketTA2`,
          `You have not researched MarketTA.II for division: ${divisionName}`,
        );
      SetMaterialMarketTA2(getMaterial(divisionName, cityName, materialName), on);
    },
    setProductMarketTA1: function (_divisionName: unknown, _productName: unknown, _on: unknown): void {
      checkAccess("setProductMarketTA1", 7);
      const divisionName = helper.string("setProductMarketTA1", "divisionName", _divisionName);
      const productName = helper.string("setProductMarketTA1", "productName", _productName);
      const on = helper.boolean(_on);
      if (!getDivision(divisionName).hasResearch("Market-TA.I"))
        throw helper.makeRuntimeErrorMsg(
          `corporation.setProductMarketTA1`,
          `You have not researched MarketTA.I for division: ${divisionName}`,
        );
      SetProductMarketTA1(getProduct(divisionName, productName), on);
    },
    setProductMarketTA2: function (_divisionName: unknown, _productName: unknown, _on: unknown): void {
      checkAccess("setProductMarketTA2", 7);
      const divisionName = helper.string("setProductMarketTA2", "divisionName", _divisionName);
      const productName = helper.string("setProductMarketTA2", "productName", _productName);
      const on = helper.boolean(_on);
      if (!getDivision(divisionName).hasResearch("Market-TA.II"))
        throw helper.makeRuntimeErrorMsg(
          `corporation.setProductMarketTA2`,
          `You have not researched MarketTA.II for division: ${divisionName}`,
        );
      SetProductMarketTA2(getProduct(divisionName, productName), on);
    },
  };

  const officeAPI: OfficeAPI = {
    getHireAdVertCost: function (_divisionName: unknown): number {
      checkAccess("getHireAdVertCost", 8);
      const divisionName = helper.string("getHireAdVertCost", "divisionName", _divisionName);
      const division = getDivision(divisionName);
      const upgrade = IndustryUpgrades[1];
      return upgrade[1] * Math.pow(upgrade[2], division.upgrades[1]);
    },
    getHireAdVertCount: function (_divisionName: unknown): number {
      checkAccess("getHireAdVertCount", 8);
      const divisionName = helper.string("getHireAdVertCount", "divisionName", _divisionName);
      const division = getDivision(divisionName);
      return division.upgrades[1];
    },
    getResearchCost: function (_divisionName: unknown, _researchName: unknown): number {
      checkAccess("getResearchCost", 8);
      const divisionName = helper.string("getResearchCost", "divisionName", _divisionName);
      const researchName = helper.string("getResearchCost", "researchName", _researchName);
      return getResearchCost(getDivision(divisionName), researchName);
    },
    hasResearched: function (_divisionName: unknown, _researchName: unknown): boolean {
      checkAccess("hasResearched", 8);
      const divisionName = helper.string("hasResearched", "divisionName", _divisionName);
      const researchName = helper.string("hasResearched", "researchName", _researchName);
      return hasResearched(getDivision(divisionName), researchName);
    },
    setAutoJobAssignment: function (
      _divisionName: unknown,
      _cityName: unknown,
      _job: unknown,
      _amount: unknown,
    ): Promise<boolean> {
      checkAccess("setAutoJobAssignment", 8);
      const divisionName = helper.string("setAutoJobAssignment", "divisionName", _divisionName);
      const cityName = helper.city("setAutoJobAssignment", "cityName", _cityName);
      const amount = helper.number("setAutoJobAssignment", "amount", _amount);
      const job = helper.string("setAutoJobAssignment", "job", _job);
      const office = getOffice(divisionName, cityName);
      if (!Object.values(EmployeePositions).includes(job)) throw new Error(`'${job}' is not a valid job.`);
      return netscriptDelay(1000, workerScript).then(function () {
        return Promise.resolve(office.setEmployeeToJob(job, amount));
      });
    },
    getOfficeSizeUpgradeCost: function (_divisionName: unknown, _cityName: unknown, _size: unknown): number {
      checkAccess("getOfficeSizeUpgradeCost", 8);
      const divisionName = helper.string("getOfficeSizeUpgradeCost", "divisionName", _divisionName);
      const cityName = helper.city("getOfficeSizeUpgradeCost", "cityName", _cityName);
      const size = helper.number("getOfficeSizeUpgradeCost", "size", _size);
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
    assignJob: function (
      _divisionName: unknown,
      _cityName: unknown,
      _employeeName: unknown,
      _job: unknown,
    ): Promise<void> {
      checkAccess("assignJob", 8);
      const divisionName = helper.string("assignJob", "divisionName", _divisionName);
      const cityName = helper.city("assignJob", "cityName", _cityName);
      const employeeName = helper.string("assignJob", "employeeName", _employeeName);
      const job = helper.string("assignJob", "job", _job);
      const employee = getEmployee(divisionName, cityName, employeeName);
      return netscriptDelay(1000, workerScript).then(function () {
        return Promise.resolve(AssignJob(employee, job));
      });
    },
    hireEmployee: function (_divisionName: unknown, _cityName: unknown): any {
      checkAccess("hireEmployee", 8);
      const divisionName = helper.string("hireEmployee", "divisionName", _divisionName);
      const cityName = helper.city("hireEmployee", "cityName", _cityName);
      const office = getOffice(divisionName, cityName);
      return office.hireRandomEmployee();
    },
    upgradeOfficeSize: function (_divisionName: unknown, _cityName: unknown, _size: unknown): void {
      checkAccess("upgradeOfficeSize", 8);
      const divisionName = helper.string("upgradeOfficeSize", "divisionName", _divisionName);
      const cityName = helper.city("upgradeOfficeSize", "cityName", _cityName);
      const size = helper.number("upgradeOfficeSize", "size", _size);
      if (size < 0) throw new Error("Invalid value for size field! Must be numeric and greater than 0");
      const office = getOffice(divisionName, cityName);
      const corporation = getCorporation();
      UpgradeOfficeSize(corporation, office, size);
    },
    throwParty: function (_divisionName: unknown, _cityName: unknown, _costPerEmployee: unknown): Promise<number> {
      checkAccess("throwParty", 8);
      const divisionName = helper.string("throwParty", "divisionName", _divisionName);
      const cityName = helper.city("throwParty", "cityName", _cityName);
      const costPerEmployee = helper.number("throwParty", "costPerEmployee", _costPerEmployee);
      if (costPerEmployee < 0)
        throw new Error("Invalid value for Cost Per Employee field! Must be numeric and greater than 0");
      const office = getOffice(divisionName, cityName);
      const corporation = getCorporation();
      return netscriptDelay(
        (60 * 1000) / (player.hacking_speed_mult * calculateIntelligenceBonus(player.intelligence, 1)),
        workerScript,
      ).then(function () {
        return Promise.resolve(ThrowParty(corporation, office, costPerEmployee));
      });
    },
    buyCoffee: function (_divisionName: unknown, _cityName: unknown): Promise<void> {
      checkAccess("buyCoffee", 8);
      const divisionName = helper.string("buyCoffee", "divisionName", _divisionName);
      const cityName = helper.city("buyCoffee", "cityName", _cityName);
      const corporation = getCorporation();
      return netscriptDelay(
        (60 * 1000) / (player.hacking_speed_mult * calculateIntelligenceBonus(player.intelligence, 1)),
        workerScript,
      ).then(function () {
        return Promise.resolve(BuyCoffee(corporation, getDivision(divisionName), getOffice(divisionName, cityName)));
      });
    },
    hireAdVert: function (_divisionName: unknown): void {
      checkAccess("hireAdVert", 8);
      const divisionName = helper.string("hireAdVert", "divisionName", _divisionName);
      const corporation = getCorporation();
      HireAdVert(corporation, getDivision(divisionName), getOffice(divisionName, "Sector-12"));
    },
    research: function (_divisionName: unknown, _researchName: unknown): void {
      checkAccess("research", 8);
      const divisionName = helper.string("research", "divisionName", _divisionName);
      const researchName = helper.string("research", "researchName", _researchName);
      Research(getDivision(divisionName), researchName);
    },
    getOffice: function (_divisionName: unknown, _cityName: unknown): any {
      checkAccess("getOffice", 8);
      const divisionName = helper.string("getOffice", "divisionName", _divisionName);
      const cityName = helper.city("getOffice", "cityName", _cityName);
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
    getEmployee: function (_divisionName: unknown, _cityName: unknown, _employeeName: unknown): NSEmployee {
      checkAccess("getEmployee", 8);
      const divisionName = helper.string("getEmployee", "divisionName", _divisionName);
      const cityName = helper.city("getEmployee", "cityName", _cityName);
      const employeeName = helper.string("getEmployee", "employeeName", _employeeName);
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
    expandIndustry: function (_industryName: unknown, _divisionName: unknown): void {
      checkAccess("expandIndustry");
      const industryName = helper.string("expandIndustry", "industryName", _industryName);
      const divisionName = helper.string("expandIndustry", "divisionName", _divisionName);
      const corporation = getCorporation();
      NewIndustry(corporation, industryName, divisionName);
    },
    expandCity: function (_divisionName: unknown, _cityName: unknown): void {
      checkAccess("expandCity");
      const divisionName = helper.string("expandCity", "divisionName", _divisionName);
      const cityName = helper.city("expandCity", "cityName", _cityName);
      if (!CorporationConstants.Cities.includes(cityName)) throw new Error("Invalid city name");
      const corporation = getCorporation();
      const division = getDivision(divisionName);
      NewCity(corporation, division, cityName);
    },
    unlockUpgrade: function (_upgradeName: unknown): void {
      checkAccess("unlockUpgrade");
      const upgradeName = helper.string("unlockUpgrade", "upgradeName", _upgradeName);
      const corporation = getCorporation();
      const upgrade = Object.values(CorporationUnlockUpgrades).find((upgrade) => upgrade[2] === upgradeName);
      if (upgrade === undefined) throw new Error(`No upgrade named '${upgradeName}'`);
      UnlockUpgrade(corporation, upgrade);
    },
    levelUpgrade: function (_upgradeName: unknown): void {
      checkAccess("levelUpgrade");
      const upgradeName = helper.string("levelUpgrade", "upgradeName", _upgradeName);
      const corporation = getCorporation();
      const upgrade = Object.values(CorporationUpgrades).find((upgrade) => upgrade[4] === upgradeName);
      if (upgrade === undefined) throw new Error(`No upgrade named '${upgradeName}'`);
      LevelUpgrade(corporation, upgrade);
    },
    issueDividends: function (_percent: unknown): void {
      checkAccess("issueDividends");
      const percent = helper.number("issueDividends", "percent", _percent);
      if (percent < 0 || percent > 100)
        throw new Error("Invalid value for percent field! Must be numeric, greater than 0, and less than 100");
      const corporation = getCorporation();
      if (!corporation.public)
        throw helper.makeRuntimeErrorMsg(`corporation.issueDividends`, `Your company has not gone public!`);
      IssueDividends(corporation, percent);
    },

    // If you modify these objects you will affect them for real, it's not
    // copies.
    getDivision: function (_divisionName: unknown): NSDivision {
      checkAccess("getDivision");
      const divisionName = helper.string("getDivision", "divisionName", _divisionName);
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
    createCorporation: function (_corporationName: unknown, _selfFund: unknown = true): boolean {
      const corporationName = helper.string("createCorporation", "corporationName", _corporationName);
      const selfFund = helper.boolean(_selfFund);
      return createCorporation(corporationName, selfFund);
    },
    hasUnlockUpgrade: function (_upgradeName: unknown): boolean {
      checkAccess("hasUnlockUpgrade");
      const upgradeName = helper.string("hasUnlockUpgrade", "upgradeName", _upgradeName);
      return hasUnlockUpgrade(upgradeName);
    },
    getUnlockUpgradeCost: function (_upgradeName: unknown): number {
      checkAccess("getUnlockUpgradeCost");
      const upgradeName = helper.string("getUnlockUpgradeCost", "upgradeName", _upgradeName);
      return getUnlockUpgradeCost(upgradeName);
    },
    getUpgradeLevel: function (_upgradeName: unknown): number {
      checkAccess("hasUnlockUpgrade");
      const upgradeName = helper.string("getUpgradeLevel", "upgradeName", _upgradeName);
      return getUpgradeLevel(upgradeName);
    },
    getUpgradeLevelCost: function (_upgradeName: unknown): number {
      checkAccess("getUpgradeLevelCost");
      const upgradeName = helper.string("getUpgradeLevelCost", "upgradeName", _upgradeName);
      return getUpgradeLevelCost(upgradeName);
    },
    getExpandIndustryCost: function (_industryName: unknown): number {
      checkAccess("getExpandIndustryCost");
      const industryName = helper.string("getExpandIndustryCost", "industryName", _industryName);
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
    goPublic: function (_numShares: unknown): boolean {
      checkAccess("acceptInvestmentOffer");
      const numShares = helper.number("goPublic", "numShares", _numShares);
      return goPublic(numShares);
    },
    sellShares: function (_numShares: unknown): number {
      checkAccess("acceptInvestmentOffer");
      const numShares = helper.number("sellStock", "numShares", _numShares);
      return SellShares(getCorporation(), player, numShares);
    },
    buyBackShares: function (_numShares: unknown): boolean {
      checkAccess("acceptInvestmentOffer");
      const numShares = helper.number("buyStock", "numShares", _numShares);
      return BuyBackShares(getCorporation(), player, numShares);
    },
    bribe: function (_factionName: unknown, _amountCash: unknown, _amountShares: unknown): boolean {
      checkAccess("bribe");
      const factionName = helper.string("bribe", "factionName", _factionName);
      const amountCash = helper.number("bribe", "amountCash", _amountCash);
      const amountShares = helper.number("bribe", "amountShares", _amountShares);
      return bribe(factionName, amountCash, amountShares);
    },
    getBonusTime: function (): number {
      checkAccess("getBonusTime");
      return Math.round(getCorporation().storedCycles / 5) * 1000;
    },
  };
}
