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
} from "../Corporation/Actions";
import { CorporationUnlockUpgrades } from "../Corporation/data/CorporationUnlockUpgrades";
import { CorporationUpgrades } from "../Corporation/data/CorporationUpgrades";
import { EmployeePositions } from "../Corporation/EmployeePositions";
import { calculateIntelligenceBonus } from "../PersonObjects/formulas/intelligence";

export function NetscriptCorporation(
  player: IPlayer,
  workerScript: WorkerScript,
  helper: INetscriptHelper,
): NSCorporation {
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
    const material = warehouse.materials[materialName];
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

  const warehouseAPI: WarehouseAPI = {
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
      SetSmartSupply(warehouse, enabled);
    },
    buyMaterial: function (adivisionName: any, acityName: any, amaterialName: any, aamt: any): void {
      checkAccess("buyMaterial", 7);
      const divisionName = helper.string("buyMaterial", "divisionName", adivisionName);
      const cityName = helper.string("buyMaterial", "cityName", acityName);
      const materialName = helper.string("buyMaterial", "materialName", amaterialName);
      const amt = helper.number("buyMaterial", "amt", aamt);
      const material = getMaterial(divisionName, cityName, materialName);
      BuyMaterial(material, amt);
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
      ExportMaterial(targetDivision, targetCity, getMaterial(sourceDivision, sourceCity, materialName), amt + "");
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
      SetMaterialMarketTA1(getMaterial(divisionName, cityName, materialName), on);
    },
    setMaterialMarketTA2: function (adivisionName: any, acityName: any, amaterialName: any, aon: any): void {
      checkAccess("setMaterialMarketTA2", 7);
      const divisionName = helper.string("setMaterialMarketTA2", "divisionName", adivisionName);
      const cityName = helper.string("setMaterialMarketTA2", "cityName", acityName);
      const materialName = helper.string("setMaterialMarketTA2", "materialName", amaterialName);
      const on = helper.boolean(aon);
      SetMaterialMarketTA2(getMaterial(divisionName, cityName, materialName), on);
    },
    setProductMarketTA1: function (adivisionName: any, aproductName: any, aon: any): void {
      checkAccess("setProductMarketTA1", 7);
      const divisionName = helper.string("setProductMarketTA1", "divisionName", adivisionName);
      const productName = helper.string("setProductMarketTA1", "productName", aproductName);
      const on = helper.boolean(aon);
      SetProductMarketTA1(getProduct(divisionName, productName), on);
    },
    setProductMarketTA2: function (adivisionName: any, aproductName: any, aon: any): void {
      checkAccess("setProductMarketTA2", 7);
      const divisionName = helper.string("setProductMarketTA2", "divisionName", adivisionName);
      const productName = helper.string("setProductMarketTA2", "productName", aproductName);
      const on = helper.boolean(aon);
      SetProductMarketTA2(getProduct(divisionName, productName), on);
    },
  };

  const officeAPI: OfficeAPI = {
    employees: function (adivisionName: any, acityName: any): any {
      checkAccess("employees", 8);
      const divisionName = helper.string("employees", "divisionName", adivisionName);
      const cityName = helper.string("employees", "cityName", acityName);
      const office = getOffice(divisionName, cityName);
      return office.employees.map((e) => Object.assign({}, e));
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
      office.hireRandomEmployee();
    },
    upgradeOfficeSize: function (adivisionName: any, acityName: any, asize: any): void {
      checkAccess("upgradeOfficeSize", 8);
      const divisionName = helper.string("upgradeOfficeSize", "divisionName", adivisionName);
      const cityName = helper.string("upgradeOfficeSize", "cityName", acityName);
      const size = helper.number("upgradeOfficeSize", "size", asize);
      const office = getOffice(divisionName, cityName);
      const corporation = getCorporation();
      UpgradeOfficeSize(corporation, office, size);
    },
    throwParty: function (adivisionName: any, acityName: any, acostPerEmployee: any): Promise<number> {
      checkAccess("throwParty", 8);
      const divisionName = helper.string("throwParty", "divisionName", adivisionName);
      const cityName = helper.string("throwParty", "cityName", acityName);
      const costPerEmployee = helper.number("throwParty", "costPerEmployee", acostPerEmployee);
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
      const corporation = getCorporation();
      IssueDividends(corporation, percent);
    },

    // If you modify these objects you will affect them for real, it's not
    // copies.
    getDivision: function (adivisionName: any): NSDivision {
      checkAccess("getDivision");
      const divisionName = helper.string("getDivision", "divisionName", adivisionName);
      const division = getDivision(divisionName);
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
        upgrades: division.upgrades,
        cities: cities,
      };
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
        state: corporation.state + "",
      };
    },
  };
}
