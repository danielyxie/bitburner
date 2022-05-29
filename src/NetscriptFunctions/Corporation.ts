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
  LimitMaterialProduction,
  LimitProductProduction,
  UpgradeWarehouseCost,
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
import { BitNodeMultipliers } from "../BitNode/BitNodeMultipliers";
import { InternalAPI, NetscriptContext } from "src/Netscript/APIWrapper";

export function NetscriptCorporation(player: IPlayer, workerScript: WorkerScript): InternalAPI<NSCorporation> {
  function createCorporation(corporationName: string, selfFund = true): boolean {
    if (!player.canAccessCorporation() || player.hasCorporation()) return false;
    if (!corporationName) return false;
    if (player.bitNodeN !== 3 && !selfFund) throw new Error("cannot use seed funds outside of BitNode 3");
    if (BitNodeMultipliers.CorporationSoftcap < 0.15)
      throw new Error(`You cannot create a corporation in Bitnode ${player.bitNodeN}`);

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
    const upgrade = Object.values(CorporationUnlockUpgrades).find((upgrade) => upgrade.name === upgradeName);
    if (upgrade === undefined) throw new Error(`No upgrade named '${upgradeName}'`);
    const upgN = upgrade.index;
    return corporation.unlockUpgrades[upgN] === 1;
  }

  function getUnlockUpgradeCost(upgradeName: string): number {
    const upgrade = Object.values(CorporationUnlockUpgrades).find((upgrade) => upgrade.name === upgradeName);
    if (upgrade === undefined) throw new Error(`No upgrade named '${upgradeName}'`);
    return upgrade.price;
  }

  function getUpgradeLevel(ctx: NetscriptContext, _upgradeName: string): number {
    const upgradeName = ctx.helper.string("upgradeName", _upgradeName);
    const corporation = getCorporation();
    const upgrade = Object.values(CorporationUpgrades).find((upgrade) => upgrade.name === upgradeName);
    if (upgrade === undefined) throw new Error(`No upgrade named '${upgradeName}'`);
    const upgN = upgrade.index;
    return corporation.upgrades[upgN];
  }

  function getUpgradeLevelCost(ctx: NetscriptContext, _upgradeName: string): number {
    const upgradeName = ctx.helper.string("upgradeName", _upgradeName);
    const corporation = getCorporation();
    const upgrade = Object.values(CorporationUpgrades).find((upgrade) => upgrade.name === upgradeName);
    if (upgrade === undefined) throw new Error(`No upgrade named '${upgradeName}'`);
    const upgN = upgrade.index;
    const baseCost = upgrade.basePrice;
    const priceMult = upgrade.priceMult;
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
    const matName = materialName.replace(/ /g, "");
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

  function checkAccess(ctx: NetscriptContext, api?: number): void {
    if (player.corporation === null) throw ctx.makeRuntimeErrorMsg("Must own a corporation.");
    if (!api) return;

    if (!player.corporation.unlockUpgrades[api]) throw ctx.makeRuntimeErrorMsg("You do not have access to this API.");
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
      makesProducts: division.makesProducts,
    };
  }

  const warehouseAPI: InternalAPI<WarehouseAPI> = {
    getPurchaseWarehouseCost: (ctx: NetscriptContext) => (): number => {
      checkAccess(ctx, 7);
      return CorporationConstants.WarehouseInitialCost;
    },
    getUpgradeWarehouseCost:
      (ctx: NetscriptContext) =>
      (_divisionName: unknown, _cityName: unknown, _amt: unknown = 1): number => {
        checkAccess(ctx, 7);
        const divisionName = ctx.helper.string("divisionName", _divisionName);
        const cityName = ctx.helper.city("cityName", _cityName);
        const amt = ctx.helper.number("amount", _amt);
        if (amt < 1) {
          throw ctx.makeRuntimeErrorMsg("You must provide a positive number");
        }
        const warehouse = getWarehouse(divisionName, cityName);
        return UpgradeWarehouseCost(warehouse, amt);
      },
    hasWarehouse:
      (ctx: NetscriptContext) =>
      (_divisionName: unknown, _cityName: unknown): boolean => {
        checkAccess(ctx, 7);
        const divisionName = ctx.helper.string("divisionName", _divisionName);
        const cityName = ctx.helper.city("cityName", _cityName);
        const division = getDivision(divisionName);
        if (!(cityName in division.warehouses)) throw new Error(`Invalid city name '${cityName}'`);
        const warehouse = division.warehouses[cityName];
        return warehouse !== 0;
      },
    getWarehouse:
      (ctx: NetscriptContext) =>
      (_divisionName: unknown, _cityName: unknown): NSWarehouse => {
        checkAccess(ctx, 7);
        const divisionName = ctx.helper.string("divisionName", _divisionName);
        const cityName = ctx.helper.city("cityName", _cityName);
        const warehouse = getWarehouse(divisionName, cityName);
        return {
          level: warehouse.level,
          loc: warehouse.loc,
          size: warehouse.size,
          sizeUsed: warehouse.sizeUsed,
          smartSupplyEnabled: warehouse.smartSupplyEnabled,
        };
      },
    getMaterial:
      (ctx: NetscriptContext) =>
      (_divisionName: unknown, _cityName: unknown, _materialName: unknown): NSMaterial => {
        checkAccess(ctx, 7);
        const divisionName = ctx.helper.string("divisionName", _divisionName);
        const cityName = ctx.helper.city("cityName", _cityName);
        const materialName = ctx.helper.string("materialName", _materialName);
        const material = getMaterial(divisionName, cityName, materialName);
        const corporation = getCorporation();
        return {
          cost: material.bCost,
          sCost: material.sCost,
          name: material.name,
          qty: material.qty,
          qlt: material.qlt,
          dmd: corporation.unlockUpgrades[2] ? material.dmd : undefined,
          cmp: corporation.unlockUpgrades[3] ? material.cmp : undefined,
          prod: material.prd,
          sell: material.sll,
        };
      },
    getProduct:
      (ctx: NetscriptContext) =>
      (_divisionName: unknown, _productName: unknown): NSProduct => {
        checkAccess(ctx, 7);
        const divisionName = ctx.helper.string("divisionName", _divisionName);
        const productName = ctx.helper.string("productName", _productName);
        const product = getProduct(divisionName, productName);
        const corporation = getCorporation();
        return {
          name: product.name,
          dmd: corporation.unlockUpgrades[2] ? product.dmd : undefined,
          cmp: corporation.unlockUpgrades[3] ? product.cmp : undefined,
          rat: product.rat,
          properties: {
            qlt: product.qlt,
            per: product.per,
            dur: product.dur,
            rel: product.rel,
            aes: product.aes,
            fea: product.fea,
          },
          pCost: product.pCost,
          sCost: product.sCost,
          cityData: product.data,
          developmentProgress: product.prog,
        };
      },
    purchaseWarehouse:
      (ctx: NetscriptContext) =>
      (_divisionName: unknown, _cityName: unknown): void => {
        checkAccess(ctx, 7);
        const divisionName = ctx.helper.string("divisionName", _divisionName);
        const cityName = ctx.helper.city("cityName", _cityName);
        const corporation = getCorporation();
        PurchaseWarehouse(corporation, getDivision(divisionName), cityName);
      },
    upgradeWarehouse:
      (ctx: NetscriptContext) =>
      (_divisionName: unknown, _cityName: unknown, _amt: unknown = 1): void => {
        checkAccess(ctx, 7);
        const divisionName = ctx.helper.string("divisionName", _divisionName);
        const cityName = ctx.helper.city("cityName", _cityName);
        const amt = ctx.helper.number("amount", _amt);
        const corporation = getCorporation();
        if (amt < 1) {
          throw ctx.makeRuntimeErrorMsg("You must provide a positive number");
        }
        UpgradeWarehouse(corporation, getDivision(divisionName), getWarehouse(divisionName, cityName), amt);
      },
    sellMaterial:
      (ctx: NetscriptContext) =>
      (_divisionName: unknown, _cityName: unknown, _materialName: unknown, _amt: unknown, _price: unknown): void => {
        checkAccess(ctx, 7);
        const divisionName = ctx.helper.string("divisionName", _divisionName);
        const cityName = ctx.helper.city("cityName", _cityName);
        const materialName = ctx.helper.string("materialName", _materialName);
        const amt = ctx.helper.string("amt", _amt);
        const price = ctx.helper.string("price", _price);
        const material = getMaterial(divisionName, cityName, materialName);
        SellMaterial(material, amt, price);
      },
    sellProduct:
      (ctx: NetscriptContext) =>
      (
        _divisionName: unknown,
        _cityName: unknown,
        _productName: unknown,
        _amt: unknown,
        _price: unknown,
        _all: unknown,
      ): void => {
        checkAccess(ctx, 7);
        const divisionName = ctx.helper.string("divisionName", _divisionName);
        const cityName = ctx.helper.city("cityName", _cityName);
        const productName = ctx.helper.string("productName", _productName);
        const amt = ctx.helper.string("amt", _amt);
        const price = ctx.helper.string("price", _price);
        const all = ctx.helper.boolean(_all);
        const product = getProduct(divisionName, productName);
        SellProduct(product, cityName, amt, price, all);
      },
    discontinueProduct:
      (ctx: NetscriptContext) =>
      (_divisionName: unknown, _productName: unknown): void => {
        checkAccess(ctx, 7);
        const divisionName = ctx.helper.string("divisionName", _divisionName);
        const productName = ctx.helper.string("productName", _productName);
        getDivision(divisionName).discontinueProduct(getProduct(divisionName, productName));
      },
    setSmartSupply:
      (ctx: NetscriptContext) =>
      (_divisionName: unknown, _cityName: unknown, _enabled: unknown): void => {
        checkAccess(ctx, 7);
        const divisionName = ctx.helper.string("divisionName", _divisionName);
        const cityName = ctx.helper.city("cityName", _cityName);
        const enabled = ctx.helper.boolean(_enabled);
        const warehouse = getWarehouse(divisionName, cityName);
        if (!hasUnlockUpgrade("Smart Supply"))
          throw ctx.makeRuntimeErrorMsg(`You have not purchased the Smart Supply upgrade!`);
        SetSmartSupply(warehouse, enabled);
      },
    setSmartSupplyUseLeftovers:
      (ctx: NetscriptContext) =>
      (_divisionName: unknown, _cityName: unknown, _materialName: unknown, _enabled: unknown): void => {
        checkAccess(ctx, 7);
        const divisionName = ctx.helper.string("divisionName", _divisionName);
        const cityName = ctx.helper.city("cityName", _cityName);
        const materialName = ctx.helper.string("materialName", _materialName);
        const enabled = ctx.helper.boolean(_enabled);
        const warehouse = getWarehouse(divisionName, cityName);
        const material = getMaterial(divisionName, cityName, materialName);
        if (!hasUnlockUpgrade("Smart Supply"))
          throw ctx.makeRuntimeErrorMsg(`You have not purchased the Smart Supply upgrade!`);
        SetSmartSupplyUseLeftovers(warehouse, material, enabled);
      },
    buyMaterial:
      (ctx: NetscriptContext) =>
      (_divisionName: unknown, _cityName: unknown, _materialName: unknown, _amt: unknown): void => {
        checkAccess(ctx, 7);
        const divisionName = ctx.helper.string("divisionName", _divisionName);
        const cityName = ctx.helper.city("cityName", _cityName);
        const materialName = ctx.helper.string("materialName", _materialName);
        const amt = ctx.helper.number("amt", _amt);
        if (amt < 0) throw new Error("Invalid value for amount field! Must be numeric and greater than 0");
        const material = getMaterial(divisionName, cityName, materialName);
        BuyMaterial(material, amt);
      },
    bulkPurchase:
      (ctx: NetscriptContext) =>
      (_divisionName: unknown, _cityName: unknown, _materialName: unknown, _amt: unknown): void => {
        checkAccess(ctx, 7);
        const divisionName = ctx.helper.string("divisionName", _divisionName);
        if (!hasResearched(getDivision(divisionName), "Bulk Purchasing"))
          throw new Error(`You have not researched Bulk Purchasing in ${divisionName}`);
        const corporation = getCorporation();
        const cityName = ctx.helper.city("cityName", _cityName);
        const materialName = ctx.helper.string("materialName", _materialName);
        const amt = ctx.helper.number("amt", _amt);
        const warehouse = getWarehouse(divisionName, cityName);
        const material = getMaterial(divisionName, cityName, materialName);
        BulkPurchase(corporation, warehouse, material, amt);
      },
    makeProduct:
      (ctx: NetscriptContext) =>
      (
        _divisionName: unknown,
        _cityName: unknown,
        _productName: unknown,
        _designInvest: unknown,
        _marketingInvest: unknown,
      ): void => {
        checkAccess(ctx, 7);
        const divisionName = ctx.helper.string("divisionName", _divisionName);
        const cityName = ctx.helper.city("cityName", _cityName);
        const productName = ctx.helper.string("productName", _productName);
        const designInvest = ctx.helper.number("designInvest", _designInvest);
        const marketingInvest = ctx.helper.number("marketingInvest", _marketingInvest);
        const corporation = getCorporation();
        MakeProduct(corporation, getDivision(divisionName), cityName, productName, designInvest, marketingInvest);
      },
    limitProductProduction:
      (ctx: NetscriptContext) =>
      (_divisionName: unknown, _productName: unknown, _cityName: unknown, _qty: unknown): void => {
        checkAccess(ctx, 7);
        const divisionName = ctx.helper.string("divisionName", _divisionName);
        const cityName = ctx.helper.city("cityName", _cityName);
        const productName = ctx.helper.string("productName", _productName);
        const qty = ctx.helper.number("qty", _qty);
        LimitProductProduction(getProduct(divisionName, productName), cityName, qty);
      },
    exportMaterial:
      (ctx: NetscriptContext) =>
      (
        _sourceDivision: unknown,
        _sourceCity: unknown,
        _targetDivision: unknown,
        _targetCity: unknown,
        _materialName: unknown,
        _amt: unknown,
      ): void => {
        checkAccess(ctx, 7);
        const sourceDivision = ctx.helper.string("sourceDivision", _sourceDivision);
        const sourceCity = ctx.helper.string("sourceCity", _sourceCity);
        const targetDivision = ctx.helper.string("targetDivision", _targetDivision);
        const targetCity = ctx.helper.string("targetCity", _targetCity);
        const materialName = ctx.helper.string("materialName", _materialName);
        const amt = ctx.helper.string("amt", _amt);
        ExportMaterial(
          targetDivision,
          targetCity,
          getMaterial(sourceDivision, sourceCity, materialName),
          amt + "",
          getDivision(targetDivision),
        );
      },
    cancelExportMaterial:
      (ctx: NetscriptContext) =>
      (
        _sourceDivision: unknown,
        _sourceCity: unknown,
        _targetDivision: unknown,
        _targetCity: unknown,
        _materialName: unknown,
        _amt: unknown,
      ): void => {
        checkAccess(ctx, 7);
        const sourceDivision = ctx.helper.string("sourceDivision", _sourceDivision);
        const sourceCity = ctx.helper.string("sourceCity", _sourceCity);
        const targetDivision = ctx.helper.string("targetDivision", _targetDivision);
        const targetCity = ctx.helper.string("targetCity", _targetCity);
        const materialName = ctx.helper.string("materialName", _materialName);
        const amt = ctx.helper.string("amt", _amt);
        CancelExportMaterial(
          targetDivision,
          targetCity,
          getMaterial(sourceDivision, sourceCity, materialName),
          amt + "",
        );
      },
    limitMaterialProduction:
      (ctx: NetscriptContext) =>
      (_divisionName: unknown, _cityName: unknown, _materialName: unknown, _qty: unknown): void => {
        checkAccess(ctx, 7);
        const divisionName = ctx.helper.string("divisionName", _divisionName);
        const cityName = ctx.helper.city("cityName", _cityName);
        const materialName = ctx.helper.string("materialName", _materialName);
        const qty = ctx.helper.number("qty", _qty);
        LimitMaterialProduction(getMaterial(divisionName, cityName, materialName), qty);
      },
    setMaterialMarketTA1:
      (ctx: NetscriptContext) =>
      (_divisionName: unknown, _cityName: unknown, _materialName: unknown, _on: unknown): void => {
        checkAccess(ctx, 7);
        const divisionName = ctx.helper.string("divisionName", _divisionName);
        const cityName = ctx.helper.city("cityName", _cityName);
        const materialName = ctx.helper.string("materialName", _materialName);
        const on = ctx.helper.boolean(_on);
        if (!getDivision(divisionName).hasResearch("Market-TA.I"))
          throw ctx.makeRuntimeErrorMsg(`You have not researched MarketTA.I for division: ${divisionName}`);
        SetMaterialMarketTA1(getMaterial(divisionName, cityName, materialName), on);
      },
    setMaterialMarketTA2:
      (ctx: NetscriptContext) =>
      (_divisionName: unknown, _cityName: unknown, _materialName: unknown, _on: unknown): void => {
        checkAccess(ctx, 7);
        const divisionName = ctx.helper.string("divisionName", _divisionName);
        const cityName = ctx.helper.city("cityName", _cityName);
        const materialName = ctx.helper.string("materialName", _materialName);
        const on = ctx.helper.boolean(_on);
        if (!getDivision(divisionName).hasResearch("Market-TA.II"))
          throw ctx.makeRuntimeErrorMsg(`You have not researched MarketTA.II for division: ${divisionName}`);
        SetMaterialMarketTA2(getMaterial(divisionName, cityName, materialName), on);
      },
    setProductMarketTA1:
      (ctx: NetscriptContext) =>
      (_divisionName: unknown, _productName: unknown, _on: unknown): void => {
        checkAccess(ctx, 7);
        const divisionName = ctx.helper.string("divisionName", _divisionName);
        const productName = ctx.helper.string("productName", _productName);
        const on = ctx.helper.boolean(_on);
        if (!getDivision(divisionName).hasResearch("Market-TA.I"))
          throw ctx.makeRuntimeErrorMsg(`You have not researched MarketTA.I for division: ${divisionName}`);
        SetProductMarketTA1(getProduct(divisionName, productName), on);
      },
    setProductMarketTA2:
      (ctx: NetscriptContext) =>
      (_divisionName: unknown, _productName: unknown, _on: unknown): void => {
        checkAccess(ctx, 7);
        const divisionName = ctx.helper.string("divisionName", _divisionName);
        const productName = ctx.helper.string("productName", _productName);
        const on = ctx.helper.boolean(_on);
        if (!getDivision(divisionName).hasResearch("Market-TA.II"))
          throw ctx.makeRuntimeErrorMsg(`You have not researched MarketTA.II for division: ${divisionName}`);
        SetProductMarketTA2(getProduct(divisionName, productName), on);
      },
  };

  const officeAPI: InternalAPI<OfficeAPI> = {
    getHireAdVertCost:
      (ctx: NetscriptContext) =>
      (_divisionName: unknown): number => {
        checkAccess(ctx, 8);
        const divisionName = ctx.helper.string("divisionName", _divisionName);
        const division = getDivision(divisionName);
        const upgrade = IndustryUpgrades[1];
        return upgrade[1] * Math.pow(upgrade[2], division.upgrades[1]);
      },
    getHireAdVertCount:
      (ctx: NetscriptContext) =>
      (_divisionName: unknown): number => {
        checkAccess(ctx, 8);
        const divisionName = ctx.helper.string("divisionName", _divisionName);
        const division = getDivision(divisionName);
        return division.upgrades[1];
      },
    getResearchCost:
      (ctx: NetscriptContext) =>
      (_divisionName: unknown, _researchName: unknown): number => {
        checkAccess(ctx, 8);
        const divisionName = ctx.helper.string("divisionName", _divisionName);
        const researchName = ctx.helper.string("researchName", _researchName);
        return getResearchCost(getDivision(divisionName), researchName);
      },
    hasResearched:
      (ctx: NetscriptContext) =>
      (_divisionName: unknown, _researchName: unknown): boolean => {
        checkAccess(ctx, 8);
        const divisionName = ctx.helper.string("divisionName", _divisionName);
        const researchName = ctx.helper.string("researchName", _researchName);
        return hasResearched(getDivision(divisionName), researchName);
      },
    setAutoJobAssignment:
      (ctx: NetscriptContext) =>
      (_divisionName: unknown, _cityName: unknown, _job: unknown, _amount: unknown): Promise<boolean> => {
        checkAccess(ctx, 8);
        const divisionName = ctx.helper.string("divisionName", _divisionName);
        const cityName = ctx.helper.city("cityName", _cityName);
        const amount = ctx.helper.number("amount", _amount);
        const job = ctx.helper.string("job", _job);
        const office = getOffice(divisionName, cityName);
        if (!Object.values(EmployeePositions).includes(job)) throw new Error(`'${job}' is not a valid job.`);
        return netscriptDelay(1000, workerScript).then(function () {
          return Promise.resolve(office.setEmployeeToJob(job, amount));
        });
      },
    getOfficeSizeUpgradeCost:
      (ctx: NetscriptContext) =>
      (_divisionName: unknown, _cityName: unknown, _size: unknown): number => {
        checkAccess(ctx, 8);
        const divisionName = ctx.helper.string("divisionName", _divisionName);
        const cityName = ctx.helper.city("cityName", _cityName);
        const size = ctx.helper.number("size", _size);
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
    assignJob:
      (ctx: NetscriptContext) =>
      (_divisionName: unknown, _cityName: unknown, _employeeName: unknown, _job: unknown): Promise<void> => {
        checkAccess(ctx, 8);
        const divisionName = ctx.helper.string("divisionName", _divisionName);
        const cityName = ctx.helper.city("cityName", _cityName);
        const employeeName = ctx.helper.string("employeeName", _employeeName);
        const job = ctx.helper.string("job", _job);
        const employee = getEmployee(divisionName, cityName, employeeName);
        return netscriptDelay(["Training", "Unassigned"].includes(employee.pos) ? 0 : 1000, workerScript).then(
          function () {
            return Promise.resolve(AssignJob(employee, job));
          },
        );
      },
    hireEmployee:
      (ctx: NetscriptContext) =>
      (_divisionName: unknown, _cityName: unknown): any => {
        checkAccess(ctx, 8);
        const divisionName = ctx.helper.string("divisionName", _divisionName);
        const cityName = ctx.helper.city("cityName", _cityName);
        const office = getOffice(divisionName, cityName);
        const employee = office.hireRandomEmployee();
        if (employee === undefined) return undefined;
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
    upgradeOfficeSize:
      (ctx: NetscriptContext) =>
      (_divisionName: unknown, _cityName: unknown, _size: unknown): void => {
        checkAccess(ctx, 8);
        const divisionName = ctx.helper.string("divisionName", _divisionName);
        const cityName = ctx.helper.city("cityName", _cityName);
        const size = ctx.helper.number("size", _size);
        if (size < 0) throw new Error("Invalid value for size field! Must be numeric and greater than 0");
        const office = getOffice(divisionName, cityName);
        const corporation = getCorporation();
        UpgradeOfficeSize(corporation, office, size);
      },
    throwParty:
      (ctx: NetscriptContext) =>
      async (_divisionName: unknown, _cityName: unknown, _costPerEmployee: unknown): Promise<number> => {
        checkAccess(ctx, 8);
        const divisionName = ctx.helper.string("divisionName", _divisionName);
        const cityName = ctx.helper.city("cityName", _cityName);
        const costPerEmployee = ctx.helper.number("costPerEmployee", _costPerEmployee);
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
    buyCoffee:
      (ctx: NetscriptContext) =>
      async (_divisionName: unknown, _cityName: unknown): Promise<void> => {
        checkAccess(ctx, 8);
        const divisionName = ctx.helper.string("divisionName", _divisionName);
        const cityName = ctx.helper.city("cityName", _cityName);
        const corporation = getCorporation();
        return netscriptDelay(
          (60 * 1000) / (player.hacking_speed_mult * calculateIntelligenceBonus(player.intelligence, 1)),
          workerScript,
        ).then(function () {
          return Promise.resolve(BuyCoffee(corporation, getDivision(divisionName), getOffice(divisionName, cityName)));
        });
      },
    hireAdVert:
      (ctx: NetscriptContext) =>
      (_divisionName: unknown): void => {
        checkAccess(ctx, 8);
        const divisionName = ctx.helper.string("divisionName", _divisionName);
        const corporation = getCorporation();
        HireAdVert(corporation, getDivision(divisionName), getOffice(divisionName, "Sector-12"));
      },
    research:
      (ctx: NetscriptContext) =>
      (_divisionName: unknown, _researchName: unknown): void => {
        checkAccess(ctx, 8);
        const divisionName = ctx.helper.string("divisionName", _divisionName);
        const researchName = ctx.helper.string("researchName", _researchName);
        Research(getDivision(divisionName), researchName);
      },
    getOffice:
      (ctx: NetscriptContext) =>
      (_divisionName: unknown, _cityName: unknown): any => {
        checkAccess(ctx, 8);
        const divisionName = ctx.helper.string("divisionName", _divisionName);
        const cityName = ctx.helper.city("cityName", _cityName);
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
          employeeJobs: {
            Operations: office.employeeJobs[EmployeePositions.Operations],
            Engineer: office.employeeJobs[EmployeePositions.Engineer],
            Business: office.employeeJobs[EmployeePositions.Business],
            Management: office.employeeJobs[EmployeePositions.Management],
            "Research & Development": office.employeeJobs[EmployeePositions.RandD],
            Training: office.employeeJobs[EmployeePositions.Training],
            Unassigned: office.employeeJobs[EmployeePositions.Unassigned],
          },
        };
      },
    getEmployee:
      (ctx: NetscriptContext) =>
      (_divisionName: unknown, _cityName: unknown, _employeeName: unknown): NSEmployee => {
        checkAccess(ctx, 8);
        const divisionName = ctx.helper.string("divisionName", _divisionName);
        const cityName = ctx.helper.city("cityName", _cityName);
        const employeeName = ctx.helper.string("employeeName", _employeeName);
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
    expandIndustry:
      (ctx: NetscriptContext) =>
      (_industryName: unknown, _divisionName: unknown): void => {
        checkAccess(ctx);
        const industryName = ctx.helper.string("industryName", _industryName);
        const divisionName = ctx.helper.string("divisionName", _divisionName);
        const corporation = getCorporation();
        NewIndustry(corporation, industryName, divisionName);
      },
    expandCity:
      (ctx: NetscriptContext) =>
      (_divisionName: unknown, _cityName: unknown): void => {
        checkAccess(ctx);
        const divisionName = ctx.helper.string("divisionName", _divisionName);
        const cityName = ctx.helper.city("cityName", _cityName);
        if (!CorporationConstants.Cities.includes(cityName)) throw new Error("Invalid city name");
        const corporation = getCorporation();
        const division = getDivision(divisionName);
        NewCity(corporation, division, cityName);
      },
    unlockUpgrade:
      (ctx: NetscriptContext) =>
      (_upgradeName: unknown): void => {
        checkAccess(ctx);
        const upgradeName = ctx.helper.string("upgradeName", _upgradeName);
        const corporation = getCorporation();
        const upgrade = Object.values(CorporationUnlockUpgrades).find((upgrade) => upgrade.name === upgradeName);
        if (upgrade === undefined) throw new Error(`No upgrade named '${upgradeName}'`);
        UnlockUpgrade(corporation, upgrade);
      },
    levelUpgrade:
      (ctx: NetscriptContext) =>
      (_upgradeName: unknown): void => {
        checkAccess(ctx);
        const upgradeName = ctx.helper.string("upgradeName", _upgradeName);
        const corporation = getCorporation();
        const upgrade = Object.values(CorporationUpgrades).find((upgrade) => upgrade.name === upgradeName);
        if (upgrade === undefined) throw new Error(`No upgrade named '${upgradeName}'`);
        LevelUpgrade(corporation, upgrade);
      },
    issueDividends:
      (ctx: NetscriptContext) =>
      (_percent: unknown): void => {
        checkAccess(ctx);
        const percent = ctx.helper.number("percent", _percent);
        if (percent < 0 || percent > 100)
          throw new Error("Invalid value for percent field! Must be numeric, greater than 0, and less than 100");
        const corporation = getCorporation();
        if (!corporation.public) throw ctx.makeRuntimeErrorMsg(`Your company has not gone public!`);
        IssueDividends(corporation, percent);
      },

    // If you modify these objects you will affect them for real, it's not
    // copies.
    getDivision:
      (ctx: NetscriptContext) =>
      (_divisionName: unknown): NSDivision => {
        checkAccess(ctx);
        const divisionName = ctx.helper.string("divisionName", _divisionName);
        const division = getDivision(divisionName);
        return getSafeDivision(division);
      },
    getCorporation: (ctx: NetscriptContext) => (): CorporationInfo => {
      checkAccess(ctx);
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
    createCorporation:
      (ctx: NetscriptContext) =>
      (_corporationName: unknown, _selfFund: unknown = true): boolean => {
        const corporationName = ctx.helper.string("corporationName", _corporationName);
        const selfFund = ctx.helper.boolean(_selfFund);
        return createCorporation(corporationName, selfFund);
      },
    hasUnlockUpgrade:
      (ctx: NetscriptContext) =>
      (_upgradeName: unknown): boolean => {
        checkAccess(ctx);
        const upgradeName = ctx.helper.string("upgradeName", _upgradeName);
        return hasUnlockUpgrade(upgradeName);
      },
    getUnlockUpgradeCost:
      (ctx: NetscriptContext) =>
      (_upgradeName: unknown): number => {
        checkAccess(ctx);
        const upgradeName = ctx.helper.string("upgradeName", _upgradeName);
        return getUnlockUpgradeCost(upgradeName);
      },
    getUpgradeLevel:
      (ctx: NetscriptContext) =>
      (_upgradeName: unknown): number => {
        checkAccess(ctx);
        const upgradeName = ctx.helper.string("upgradeName", _upgradeName);
        return getUpgradeLevel(ctx, upgradeName);
      },
    getUpgradeLevelCost:
      (ctx: NetscriptContext) =>
      (_upgradeName: unknown): number => {
        checkAccess(ctx);
        const upgradeName = ctx.helper.string("upgradeName", _upgradeName);
        return getUpgradeLevelCost(ctx, upgradeName);
      },
    getExpandIndustryCost:
      (ctx: NetscriptContext) =>
      (_industryName: unknown): number => {
        checkAccess(ctx);
        const industryName = ctx.helper.string("industryName", _industryName);
        return getExpandIndustryCost(industryName);
      },
    getExpandCityCost: (ctx: NetscriptContext) => (): number => {
      checkAccess(ctx);
      return getExpandCityCost();
    },
    getInvestmentOffer: (ctx: NetscriptContext) => (): InvestmentOffer => {
      checkAccess(ctx);
      return getInvestmentOffer();
    },
    acceptInvestmentOffer: (ctx: NetscriptContext) => (): boolean => {
      checkAccess(ctx);
      return acceptInvestmentOffer();
    },
    goPublic:
      (ctx: NetscriptContext) =>
      (_numShares: unknown): boolean => {
        checkAccess(ctx);
        const numShares = ctx.helper.number("numShares", _numShares);
        return goPublic(numShares);
      },
    sellShares:
      (ctx: NetscriptContext) =>
      (_numShares: unknown): number => {
        checkAccess(ctx);
        const numShares = ctx.helper.number("numShares", _numShares);
        return SellShares(getCorporation(), player, numShares);
      },
    buyBackShares:
      (ctx: NetscriptContext) =>
      (_numShares: unknown): boolean => {
        checkAccess(ctx);
        const numShares = ctx.helper.number("numShares", _numShares);
        return BuyBackShares(getCorporation(), player, numShares);
      },
    bribe:
      (ctx: NetscriptContext) =>
      (_factionName: unknown, _amountCash: unknown, _amountShares: unknown): boolean => {
        checkAccess(ctx);
        const factionName = ctx.helper.string("factionName", _factionName);
        const amountCash = ctx.helper.number("amountCash", _amountCash);
        const amountShares = ctx.helper.number("amountShares", _amountShares);
        return bribe(factionName, amountCash, amountShares);
      },
    getBonusTime: (ctx: NetscriptContext) => (): number => {
      checkAccess(ctx);
      return Math.round(getCorporation().storedCycles / 5) * 1000;
    },
  };
}
