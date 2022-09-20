import { Player } from "../Player";
import { MaterialSizes } from "./MaterialSizes";
import { Corporation } from "./Corporation";
import { IndustryStartingCosts, IndustryResearchTrees } from "./IndustryData";
import { Industry } from "./Industry";
import { CorporationConstants } from "./data/Constants";
import { OfficeSpace } from "./OfficeSpace";
import { Material } from "./Material";
import { Product } from "./Product";
import { Warehouse } from "./Warehouse";
import { CorporationUnlockUpgrade } from "./data/CorporationUnlockUpgrades";
import { CorporationUpgrade } from "./data/CorporationUpgrades";
import { Cities } from "../Locations/Cities";
import { EmployeePositions } from "./EmployeePositions";
import { ResearchMap } from "./ResearchMap";
import { isRelevantMaterial } from "./ui/Helpers";

export function NewIndustry(corporation: Corporation, industry: string, name: string): void {
  if (corporation.divisions.find(({ type }) => industry == type))
    throw new Error(`You have already expanded into the ${industry} industry!`);

  for (let i = 0; i < corporation.divisions.length; ++i) {
    if (corporation.divisions[i].name === name) {
      throw new Error("This division name is already in use!");
    }
  }

  const cost = IndustryStartingCosts[industry];
  if (cost === undefined) {
    throw new Error(`Invalid industry: '${industry}'`);
  }
  if (corporation.funds < cost) {
    throw new Error("Not enough money to create a new division in this industry");
  } else if (name === "") {
    throw new Error("New division must have a name!");
  } else {
    corporation.funds = corporation.funds - cost;
    corporation.divisions.push(
      new Industry({
        corp: corporation,
        name: name,
        type: industry,
      }),
    );
  }
}

export function NewCity(corporation: Corporation, division: Industry, city: string): void {
  if (corporation.funds < CorporationConstants.OfficeInitialCost) {
    throw new Error("You don't have enough company funds to open a new office!");
  }
  if (division.offices[city]) {
    throw new Error(`You have already expanded into ${city} for ${division.name}`);
  }
  corporation.funds = corporation.funds - CorporationConstants.OfficeInitialCost;
  division.offices[city] = new OfficeSpace({
    loc: city,
    size: CorporationConstants.OfficeInitialSize,
  });
}

export function UnlockUpgrade(corporation: Corporation, upgrade: CorporationUnlockUpgrade): void {
  if (corporation.funds < upgrade.price) {
    throw new Error("Insufficient funds");
  }
  if (corporation.unlockUpgrades[upgrade.index] === 1) {
    throw new Error(`You have already unlocked the ${upgrade.name} upgrade!`);
  }
  corporation.unlock(upgrade);
}

export function LevelUpgrade(corporation: Corporation, upgrade: CorporationUpgrade): void {
  const baseCost = upgrade.basePrice;
  const priceMult = upgrade.priceMult;
  const level = corporation.upgrades[upgrade.index];
  const cost = baseCost * Math.pow(priceMult, level);
  if (corporation.funds < cost) {
    throw new Error("Insufficient funds");
  } else {
    corporation.upgrade(upgrade);
  }
}

export function IssueDividends(corporation: Corporation, rate: number): void {
  if (isNaN(rate) || rate < 0 || rate > CorporationConstants.DividendMaxRate) {
    throw new Error(`Invalid value. Must be an number between 0 and ${CorporationConstants.DividendMaxRate}`);
  }

  corporation.dividendRate = rate;
}

export function SellMaterial(mat: Material, amt: string, price: string): void {
  if (price === "") price = "0";
  if (amt === "") amt = "0";
  let cost = price.replace(/\s+/g, "");
  cost = cost.replace(/[^-()\d/*+.MPe]/g, ""); //Sanitize cost
  let temp = cost.replace(/MP/g, mat.bCost + "");
  try {
    temp = eval(temp);
  } catch (e) {
    throw new Error("Invalid value or expression for sell price field: " + e);
  }

  if (temp == null || isNaN(parseFloat(temp)) || parseFloat(temp) < 0) {
    throw new Error("Invalid value or expression for sell price field");
  }

  if (cost.includes("MP")) {
    mat.sCost = cost; //Dynamically evaluated
  } else {
    mat.sCost = temp;
  }

  //Parse quantity
  amt = amt.toUpperCase();
  if (amt.includes("MAX") || amt.includes("PROD")) {
    let q = amt.replace(/\s+/g, "");
    q = q.replace(/[^-()\d/*+.MAXPROD]/g, "");
    let tempQty = q.replace(/MAX/g, mat.maxsll.toString());
    tempQty = tempQty.replace(/PROD/g, mat.prd.toString());
    try {
      tempQty = eval(tempQty);
    } catch (e) {
      throw new Error("Invalid value or expression for sell quantity field: " + e);
    }

    if (tempQty == null || isNaN(parseFloat(tempQty)) || parseFloat(tempQty) < 0) {
      throw new Error("Invalid value or expression for sell quantity field");
    }

    mat.sllman[0] = true;
    mat.sllman[1] = q; //Use sanitized input
  } else if (isNaN(parseFloat(amt)) || parseFloat(amt) < 0) {
    throw new Error("Invalid value for sell quantity field! Must be numeric or 'PROD' or 'MAX'");
  } else {
    let q = parseFloat(amt);
    if (isNaN(q)) {
      q = 0;
    }
    if (q === 0) {
      mat.sllman[0] = false;
      mat.sllman[1] = 0;
    } else {
      mat.sllman[0] = true;
      mat.sllman[1] = q;
    }
  }
}

export function SellProduct(product: Product, city: string, amt: string, price: string, all: boolean): void {
  //Parse price
  if (price.includes("MP")) {
    //Dynamically evaluated quantity. First test to make sure its valid
    //Sanitize input, then replace dynamic variables with arbitrary numbers
    price = price.replace(/\s+/g, "");
    price = price.replace(/[^-()\d/*+.MP]/g, "");
    let temp = price.replace(/MP/g, "1");
    try {
      temp = eval(temp);
    } catch (e) {
      throw new Error("Invalid value or expression for sell price field: " + e);
    }
    if (temp == null || isNaN(parseFloat(temp)) || parseFloat(temp) < 0) {
      throw new Error("Invalid value or expression for sell price field.");
    }
    product.sCost = price; //Use sanitized price
  } else {
    const cost = parseFloat(price);
    if (isNaN(cost)) {
      throw new Error("Invalid value for sell price field");
    }
    product.sCost = cost;
  }

  // Array of all cities. Used later
  const cities = Object.keys(Cities);

  // Parse quantity
  amt = amt.toUpperCase();
  if (amt.includes("MAX") || amt.includes("PROD")) {
    //Dynamically evaluated quantity. First test to make sure its valid
    let qty = amt.replace(/\s+/g, "");
    qty = qty.replace(/[^-()\d/*+.MAXPROD]/g, "");
    let temp = qty.replace(/MAX/g, product.maxsll.toString());
    temp = temp.replace(/PROD/g, product.data[city][1].toString());
    try {
      temp = eval(temp);
    } catch (e) {
      throw new Error("Invalid value or expression for sell quantity field: " + e);
    }

    if (temp == null || isNaN(parseFloat(temp)) || parseFloat(temp) < 0) {
      throw new Error("Invalid value or expression for sell quantity field");
    }
    if (all) {
      for (let i = 0; i < cities.length; ++i) {
        const tempCity = cities[i];
        product.sllman[tempCity][0] = true;
        product.sllman[tempCity][1] = qty; //Use sanitized input
      }
    } else {
      product.sllman[city][0] = true;
      product.sllman[city][1] = qty; //Use sanitized input
    }
  } else if (isNaN(parseFloat(amt)) || parseFloat(amt) < 0) {
    throw new Error("Invalid value for sell quantity field! Must be numeric or 'PROD' or 'MAX'");
  } else {
    let qty = parseFloat(amt);
    if (isNaN(qty)) {
      qty = 0;
    }
    if (qty === 0) {
      if (all) {
        for (let i = 0; i < cities.length; ++i) {
          const tempCity = cities[i];
          product.sllman[tempCity][0] = false;
          product.sllman[tempCity][1] = "";
        }
      } else {
        product.sllman[city][0] = false;
        product.sllman[city][1] = "";
      }
    } else if (all) {
      for (let i = 0; i < cities.length; ++i) {
        const tempCity = cities[i];
        product.sllman[tempCity][0] = true;
        product.sllman[tempCity][1] = qty;
      }
    } else {
      product.sllman[city][0] = true;
      product.sllman[city][1] = qty;
    }
  }
}

export function SetSmartSupply(warehouse: Warehouse, smartSupply: boolean): void {
  warehouse.smartSupplyEnabled = smartSupply;
}

export function SetSmartSupplyUseLeftovers(warehouse: Warehouse, material: Material, useLeftover: boolean): void {
  if (!Object.keys(warehouse.smartSupplyUseLeftovers).includes(material.name.replace(/ /g, "")))
    throw new Error(`Invalid material '${material.name}'`);
  warehouse.smartSupplyUseLeftovers[material.name.replace(/ /g, "")] = useLeftover;
}

export function BuyMaterial(material: Material, amt: number): void {
  if (isNaN(amt) || amt < 0) {
    throw new Error(`Invalid amount '${amt}' to buy material '${material.name}'`);
  }
  material.buy = amt;
}

export function BulkPurchase(corp: Corporation, warehouse: Warehouse, material: Material, amt: number): void {
  const matSize = MaterialSizes[material.name];
  const maxAmount = (warehouse.size - warehouse.sizeUsed) / matSize;
  if (isNaN(amt) || amt < 0) {
    throw new Error(`Invalid input amount`);
  }
  if (amt > maxAmount) {
    throw new Error(`You do not have enough warehouse size to fit this purchase`);
  }
  const cost = amt * material.bCost;
  if (corp.funds >= cost) {
    corp.funds = corp.funds - cost;
    material.qty += amt;
  } else {
    throw new Error(`You cannot afford this purchase.`);
  }
}

export function SellShares(corporation: Corporation, numShares: number): number {
  if (isNaN(numShares)) throw new Error("Invalid value for number of shares");
  if (numShares < 0) throw new Error("Invalid value for number of shares");
  if (numShares > corporation.numShares) throw new Error("You don't have that many shares to sell!");
  if (!corporation.public) throw new Error("You haven't gone public!");
  if (corporation.shareSaleCooldown) throw new Error("Share sale on cooldown!");
  const stockSaleResults = corporation.calculateShareSale(numShares);
  const profit = stockSaleResults[0];
  const newSharePrice = stockSaleResults[1];
  const newSharesUntilUpdate = stockSaleResults[2];

  corporation.numShares -= numShares;
  corporation.issuedShares += numShares;
  corporation.sharePrice = newSharePrice;
  corporation.shareSalesUntilPriceUpdate = newSharesUntilUpdate;
  corporation.shareSaleCooldown = CorporationConstants.SellSharesCooldown;
  Player.gainMoney(profit, "corporation");
  return profit;
}

export function BuyBackShares(corporation: Corporation, numShares: number): boolean {
  if (isNaN(numShares)) throw new Error("Invalid value for number of shares");
  if (numShares < 0) throw new Error("Invalid value for number of shares");
  if (numShares > corporation.issuedShares) throw new Error("You don't have that many shares to buy!");
  if (!corporation.public) throw new Error("You haven't gone public!");
  const buybackPrice = corporation.sharePrice * 1.1;
  if (Player.money < numShares * buybackPrice) throw new Error("You cant afford that many shares!");
  corporation.numShares += numShares;
  corporation.issuedShares -= numShares;
  Player.loseMoney(numShares * buybackPrice, "corporation");
  return true;
}

export function AssignJob(office: OfficeSpace, employeeName: string, job: string): void {
  const employee = office.employees.find((e) => e.name === employeeName);

  if (!employee) throw new Error(`Could not find employee '${name}'.`);
  if (!Object.values(EmployeePositions).includes(job)) throw new Error(`'${job}' is not a valid job.`);

  office.assignSingleJob(employee, job);
}

export function AutoAssignJob(office: OfficeSpace, job: string, count: number): boolean {
  if (!Object.values(EmployeePositions).includes(job)) throw new Error(`'${job}' is not a valid job.`);

  return office.autoAssignJob(job, count);
}

export function UpgradeOfficeSize(corp: Corporation, office: OfficeSpace, size: number): void {
  const initialPriceMult = Math.round(office.size / CorporationConstants.OfficeInitialSize);
  const costMultiplier = 1.09;
  // Calculate cost to upgrade size by 15 employees
  let mult = 0;
  for (let i = 0; i < size / CorporationConstants.OfficeInitialSize; ++i) {
    mult += Math.pow(costMultiplier, initialPriceMult + i);
  }
  const cost = CorporationConstants.OfficeInitialCost * mult;
  if (corp.funds < cost) return;
  office.size += size;
  corp.funds = corp.funds - cost;
}

export function BuyCoffee(corp: Corporation, office: OfficeSpace): boolean {
  const cost = office.getCoffeeCost();
  if (corp.funds < cost) {
    return false;
  }

  if (!office.setCoffee()) {
    return false;
  }
  corp.funds -= cost;

  return true;
}

export function ThrowParty(corp: Corporation, office: OfficeSpace, costPerEmployee: number): number {
  const mult = 1 + costPerEmployee / 10e6;
  const cost = costPerEmployee * office.employees.length;
  if (corp.funds < cost) {
    return 0;
  }

  if (!office.setParty(mult)) {
    return 0;
  }
  corp.funds -= cost;

  return mult;
}

export function PurchaseWarehouse(corp: Corporation, division: Industry, city: string): void {
  if (corp.funds < CorporationConstants.WarehouseInitialCost) return;
  if (division.warehouses[city] instanceof Warehouse) return;
  division.warehouses[city] = new Warehouse({
    corp: corp,
    industry: division,
    loc: city,
    size: CorporationConstants.WarehouseInitialSize,
  });
  corp.funds = corp.funds - CorporationConstants.WarehouseInitialCost;
}

export function UpgradeWarehouseCost(warehouse: Warehouse, amt: number): number {
  return Array.from(Array(amt).keys()).reduce(
    (acc, index) => acc + CorporationConstants.WarehouseUpgradeBaseCost * Math.pow(1.07, warehouse.level + 1 + index),
    0,
  );
}

export function UpgradeWarehouse(corp: Corporation, division: Industry, warehouse: Warehouse, amt = 1): void {
  const sizeUpgradeCost = UpgradeWarehouseCost(warehouse, amt);
  if (corp.funds < sizeUpgradeCost) return;
  warehouse.level += amt;
  warehouse.updateSize(corp, division);
  corp.funds = corp.funds - sizeUpgradeCost;
}

export function HireAdVert(corp: Corporation, division: Industry): void {
  const cost = division.getAdVertCost();
  if (corp.funds < cost) return;
  corp.funds = corp.funds - cost;
  division.applyAdVert(corp);
}

export function MakeProduct(
  corp: Corporation,
  division: Industry,
  city: string,
  productName: string,
  designInvest: number,
  marketingInvest: number,
): void {
  if (designInvest < 0) {
    designInvest = 0;
  }
  if (marketingInvest < 0) {
    marketingInvest = 0;
  }
  if (productName == null || productName === "") {
    throw new Error("You must specify a name for your product!");
  }
  if (!division.makesProducts) {
    throw new Error("You cannot create products for this industry!");
  }
  if (isNaN(designInvest)) {
    throw new Error("Invalid value for design investment");
  }
  if (isNaN(marketingInvest)) {
    throw new Error("Invalid value for marketing investment");
  }
  if (corp.funds < designInvest + marketingInvest) {
    throw new Error("You don't have enough company funds to make this large of an investment");
  }
  let maxProducts = 3;
  if (division.hasResearch("uPgrade: Capacity.II")) {
    maxProducts = 5;
  } else if (division.hasResearch("uPgrade: Capacity.I")) {
    maxProducts = 4;
  }
  const products = division.products;
  if (Object.keys(products).length >= maxProducts) {
    throw new Error(`You are already at the max products (${maxProducts}) for division: ${division.name}!`);
  }

  const product = new Product({
    name: productName.replace(/[<>]/g, "").trim(), //Sanitize for HTMl elements
    createCity: city,
    designCost: designInvest,
    advCost: marketingInvest,
  });
  if (products[product.name] instanceof Product) {
    throw new Error(`You already have a product with this name!`);
  }

  corp.funds = corp.funds - (designInvest + marketingInvest);
  products[product.name] = product;
}

export function Research(division: Industry, researchName: string): void {
  const researchTree = IndustryResearchTrees[division.type];
  if (researchTree === undefined) throw new Error(`No research tree for industry '${division.type}'`);
  const allResearch = researchTree.getAllNodes();
  if (!allResearch.includes(researchName)) throw new Error(`No research named '${researchName}'`);
  const research = ResearchMap[researchName];

  if (division.researched[researchName]) return;
  if (division.sciResearch.qty < research.cost)
    throw new Error(`You do not have enough Scientific Research for ${research.name}`);
  division.sciResearch.qty -= research.cost;

  // Get the Node from the Research Tree and set its 'researched' property
  researchTree.research(researchName);
  division.researched[researchName] = true;

  // I couldn't figure out where else to put this so that warehouse size would get updated instantly
  // whether research is done by script or UI. All other stats gets calculated in every cycle
  // Warehouse size gets updated only when something increases it.
  if (researchName == "Drones - Transport") {
    for (let i = 0; i < CorporationConstants.Cities.length; ++i) {
      const city = CorporationConstants.Cities[i];
      const warehouse = division.warehouses[city];
      if (!(warehouse instanceof Warehouse)) {
        continue;
      }
      if (Player.corporation instanceof Corporation) {
        // Stores cycles in a "buffer". Processed separately using Engine Counters
        warehouse.updateSize(Player.corporation, division);
      }
    }
  }
}

export function ExportMaterial(
  divisionName: string,
  cityName: string,
  material: Material,
  amt: string,
  division?: Industry,
): void {
  // Sanitize amt
  let sanitizedAmt = amt.replace(/\s+/g, "").toUpperCase();
  sanitizedAmt = sanitizedAmt.replace(/[^-()\d/*+.MAX]/g, "");
  let temp = sanitizedAmt.replace(/MAX/g, "1");
  try {
    temp = eval(temp);
  } catch (e) {
    throw new Error("Invalid expression entered for export amount: " + e);
  }

  const n = parseFloat(temp);

  if (n == null || isNaN(n) || n < 0) {
    throw new Error("Invalid amount entered for export");
  }

  if (!division || !isRelevantMaterial(material.name, division)) {
    throw new Error(`You cannot export material: ${material.name} to division: ${divisionName}!`);
  }

  const exportObj = { ind: divisionName, city: cityName, amt: sanitizedAmt };
  material.exp.push(exportObj);
}

export function CancelExportMaterial(divisionName: string, cityName: string, material: Material, amt: string): void {
  for (let i = 0; i < material.exp.length; ++i) {
    if (material.exp[i].ind !== divisionName || material.exp[i].city !== cityName || material.exp[i].amt !== amt)
      continue;
    material.exp.splice(i, 1);
    break;
  }
}

export function LimitProductProduction(product: Product, cityName: string, qty: number): void {
  if (qty < 0 || isNaN(qty)) {
    product.prdman[cityName][0] = false;
    product.prdman[cityName][1] = 0;
  } else {
    product.prdman[cityName][0] = true;
    product.prdman[cityName][1] = qty;
  }
}

export function LimitMaterialProduction(material: Material, qty: number): void {
  if (qty < 0 || isNaN(qty)) {
    material.prdman[0] = false;
    material.prdman[1] = 0;
  } else {
    material.prdman[0] = true;
    material.prdman[1] = qty;
  }
}

export function SetMaterialMarketTA1(material: Material, on: boolean): void {
  material.marketTa1 = on;
}

export function SetMaterialMarketTA2(material: Material, on: boolean): void {
  material.marketTa2 = on;
}

export function SetProductMarketTA1(product: Product, on: boolean): void {
  product.marketTa1 = on;
}

export function SetProductMarketTA2(product: Product, on: boolean): void {
  product.marketTa2 = on;
}
