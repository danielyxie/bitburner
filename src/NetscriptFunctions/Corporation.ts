import { IPlayer } from "../PersonObjects/IPlayer";

import { OfficeSpace } from "../Corporation/OfficeSpace";
import { Employee } from "../Corporation/Employee";
import { Product } from "../Corporation/Product";
import { Material } from "../Corporation/Material";
import { Warehouse } from "../Corporation/Warehouse";
import { IIndustry } from "../Corporation/IIndustry";

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

export interface INetscriptCorporation {
  expandIndustry(industryName: any, divisionName: any): any;
  expandCity(divisionName: any, cityName: any): any;
  unlockUpgrade(upgradeName: any): any;
  levelUpgrade(upgradeName: any): any;
  issueDividends(percent: any): any;
  sellMaterial(divisionName: any, cityName: any, materialName: any, amt: any, price: any): any;
  sellProduct(divisionName: any, cityName: any, productName: any, amt: any, price: any, all: any): any;
  discontinueProduct(divisionName: any, productName: any): any;
  setSmartSupply(divisionName: any, cityName: any, enabled: any): any;
  buyMaterial(divisionName: any, cityName: any, materialName: any, amt: any): any;
  employees(divisionName: any, cityName: any): any;
  assignJob(divisionName: any, cityName: any, employeeName: any, job: any): any;
  hireEmployee(divisionName: any, cityName: any): any;
  upgradeOfficeSize(divisionName: any, cityName: any, size: any): any;
  throwParty(divisionName: any, cityName: any, costPerEmployee: any): any;
  purchaseWarehouse(divisionName: any, cityName: any): any;
  upgradeWarehouse(divisionName: any, cityName: any): any;
  buyCoffee(divisionName: any, cityName: any): any;
  hireAdVert(divisionName: any): any;
  makeProduct(divisionName: any, cityName: any, productName: any, designInvest: any, marketingInvest: any): any;
  research(divisionName: any, researchName: any): any;
  exportMaterial(
    sourceDivision: any,
    sourceCity: any,
    targetDivision: any,
    targetCity: any,
    materialName: any,
    amt: any,
  ): any;
  cancelExportMaterial(
    sourceDivision: any,
    sourceCity: any,
    targetDivision: any,
    targetCity: any,
    materialName: any,
    amt: any,
  ): any;
  setMaterialMarketTA1(divisionName: any, cityName: any, materialName: any, on: any): any;
  setMaterialMarketTA2(divisionName: any, cityName: any, materialName: any, on: any): any;
  setProductMarketTA1(divisionName: any, productName: any, on: any): any;
  setProductMarketTA2(divisionName: any, productName: any, on: any): any;
  getDivision(divisionName: any): any;
  getOffice(divisionName: any, cityName: any): any;
  getWarehouse(divisionName: any, cityName: any): any;
  getMaterial(divisionName: any, cityName: any, materialName: any): any;
  getProduct(divisionName: any, productName: any): any;
  getEmployee(divisionName: any, cityName: any, employeeName: any): any;
}

export function NetscriptCorporation(player: IPlayer): INetscriptCorporation {
  function getDivision(divisionName: any): IIndustry {
    const corporation = player.corporation;
    if (corporation === null) throw new Error("cannot be called without a corporation");
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
  // Hi, if you're reading this you're a bit nosy.
  // There's a corporation API but it's very imbalanced right now.
  // It's here so players can test with if they want.
  return {
    expandIndustry: function (industryName: any, divisionName: any): any {
      const corporation = player.corporation;
      if (corporation === null) throw new Error("Should not be called without a corporation");
      NewIndustry(corporation, industryName, divisionName);
    },
    expandCity: function (divisionName: any, cityName: any): any {
      const division = getDivision(divisionName);
      const corporation = player.corporation;
      if (corporation === null) throw new Error("Should not be called without a corporation");
      NewCity(corporation, division, cityName);
    },
    unlockUpgrade: function (upgradeName: any): any {
      const upgrade = Object.values(CorporationUnlockUpgrades).find((upgrade) => upgrade[2] === upgradeName);
      if (upgrade === undefined) throw new Error(`No upgrade named '${upgradeName}'`);
      const corporation = player.corporation;
      if (corporation === null) throw new Error("Should not be called without a corporation");
      UnlockUpgrade(corporation, upgrade);
    },
    levelUpgrade: function (upgradeName: any): any {
      const upgrade = Object.values(CorporationUpgrades).find((upgrade) => upgrade[4] === upgradeName);
      if (upgrade === undefined) throw new Error(`No upgrade named '${upgradeName}'`);
      const corporation = player.corporation;
      if (corporation === null) throw new Error("Should not be called without a corporation");
      LevelUpgrade(corporation, upgrade);
    },
    issueDividends: function (percent: any): any {
      const corporation = player.corporation;
      if (corporation === null) throw new Error("Should not be called without a corporation");
      IssueDividends(corporation, percent);
    },
    sellMaterial: function (divisionName: any, cityName: any, materialName: any, amt: any, price: any): any {
      const material = getMaterial(divisionName, cityName, materialName);
      SellMaterial(material, amt, price);
    },
    sellProduct: function (divisionName: any, cityName: any, productName: any, amt: any, price: any, all: any): any {
      const product = getProduct(divisionName, productName);
      SellProduct(product, cityName, amt, price, all);
    },
    discontinueProduct: function (divisionName: any, productName: any): any {
      getDivision(divisionName).discontinueProduct(getProduct(divisionName, productName));
    },
    setSmartSupply: function (divisionName: any, cityName: any, enabled: any): any {
      const warehouse = getWarehouse(divisionName, cityName);
      SetSmartSupply(warehouse, enabled);
    },
    // setSmartSupplyUseLeftovers: function (): any {},
    buyMaterial: function (divisionName: any, cityName: any, materialName: any, amt: any): any {
      const material = getMaterial(divisionName, cityName, materialName);
      BuyMaterial(material, amt);
    },
    employees: function (divisionName: any, cityName: any): any {
      const office = getOffice(divisionName, cityName);
      return office.employees.map((e) => Object.assign({}, e));
    },
    assignJob: function (divisionName: any, cityName: any, employeeName: any, job: any): any {
      const employee = getEmployee(divisionName, cityName, employeeName);
      AssignJob(employee, job);
    },
    hireEmployee: function (divisionName: any, cityName: any): any {
      const office = getOffice(divisionName, cityName);
      office.hireRandomEmployee();
    },
    upgradeOfficeSize: function (divisionName: any, cityName: any, size: any): any {
      const office = getOffice(divisionName, cityName);
      const corporation = player.corporation;
      if (corporation === null) throw new Error("Should not be called without a corporation");
      UpgradeOfficeSize(corporation, office, size);
    },
    throwParty: function (divisionName: any, cityName: any, costPerEmployee: any): any {
      const office = getOffice(divisionName, cityName);
      const corporation = player.corporation;
      if (corporation === null) throw new Error("Should not be called without a corporation");
      ThrowParty(corporation, office, costPerEmployee);
    },
    purchaseWarehouse: function (divisionName: any, cityName: any): any {
      const corporation = player.corporation;
      if (corporation === null) throw new Error("Should not be called without a corporation");
      PurchaseWarehouse(corporation, getDivision(divisionName), cityName);
    },
    upgradeWarehouse: function (divisionName: any, cityName: any): any {
      const corporation = player.corporation;
      if (corporation === null) throw new Error("Should not be called without a corporation");
      UpgradeWarehouse(corporation, getDivision(divisionName), getWarehouse(divisionName, cityName));
    },
    buyCoffee: function (divisionName: any, cityName: any): any {
      const corporation = player.corporation;
      if (corporation === null) throw new Error("Should not be called without a corporation");
      BuyCoffee(corporation, getDivision(divisionName), getOffice(divisionName, cityName));
    },
    hireAdVert: function (divisionName: any): any {
      const corporation = player.corporation;
      if (corporation === null) throw new Error("Should not be called without a corporation");
      HireAdVert(corporation, getDivision(divisionName), getOffice(divisionName, "Sector-12"));
    },
    makeProduct: function (
      divisionName: any,
      cityName: any,
      productName: any,
      designInvest: any,
      marketingInvest: any,
    ): any {
      const corporation = player.corporation;
      if (corporation === null) throw new Error("Should not be called without a corporation");
      MakeProduct(corporation, getDivision(divisionName), cityName, productName, designInvest, marketingInvest);
    },
    research: function (divisionName: any, researchName: any): any {
      Research(getDivision(divisionName), researchName);
    },
    exportMaterial: function (
      sourceDivision: any,
      sourceCity: any,
      targetDivision: any,
      targetCity: any,
      materialName: any,
      amt: any,
    ): any {
      ExportMaterial(targetDivision, targetCity, getMaterial(sourceDivision, sourceCity, materialName), amt + "");
    },
    cancelExportMaterial: function (
      sourceDivision: any,
      sourceCity: any,
      targetDivision: any,
      targetCity: any,
      materialName: any,
      amt: any,
    ): any {
      CancelExportMaterial(targetDivision, targetCity, getMaterial(sourceDivision, sourceCity, materialName), amt + "");
    },
    setMaterialMarketTA1: function (divisionName: any, cityName: any, materialName: any, on: any): any {
      SetMaterialMarketTA1(getMaterial(divisionName, cityName, materialName), on);
    },
    setMaterialMarketTA2: function (divisionName: any, cityName: any, materialName: any, on: any) {
      SetMaterialMarketTA2(getMaterial(divisionName, cityName, materialName), on);
    },
    setProductMarketTA1: function (divisionName: any, productName: any, on: any): any {
      SetProductMarketTA1(getProduct(divisionName, productName), on);
    },
    setProductMarketTA2: function (divisionName: any, productName: any, on: any) {
      SetProductMarketTA2(getProduct(divisionName, productName), on);
    },
    // If you modify these objects you will affect them for real, it's not
    // copies.
    getDivision: function (divisionName: any): any {
      return getDivision(divisionName);
    },
    getOffice: function (divisionName: any, cityName: any): any {
      return getOffice(divisionName, cityName);
    },
    getWarehouse: function (divisionName: any, cityName: any): any {
      return getWarehouse(divisionName, cityName);
    },
    getMaterial: function (divisionName: any, cityName: any, materialName: any): any {
      return getMaterial(divisionName, cityName, materialName);
    },
    getProduct: function (divisionName: any, productName: any): any {
      return getProduct(divisionName, productName);
    },
    getEmployee: function (divisionName: any, cityName: any, employeeName: any): any {
      return getEmployee(divisionName, cityName, employeeName);
    },
  };
}
