import {CONSTANTS}                              from "./Constants";
import {Locations}                              from "./Locations";
import {hasWallStreetSF, wallStreetSFLvl}       from "./NetscriptFunctions";
import {WorkerScript}                           from "./NetscriptWorker";
import {Player}                                 from "./Player";

import {dialogBoxCreate}                        from "../utils/DialogBox";
import {clearEventListeners}                    from "../utils/uiHelpers/clearEventListeners";
import {Reviver, Generic_toJSON,
        Generic_fromJSON}                       from "../utils/JSONReviver";
import {Page, routing}                          from "./ui/navigationTracking";
import numeral                                  from "numeral/min/numeral.min";
import {exceptionAlert}                         from "../utils/helpers/exceptionAlert";
import {getRandomInt}                           from "../utils/helpers/getRandomInt";
import {KEY}                                    from "../utils/helpers/keyCodes";
import {createElement}                          from "../utils/uiHelpers/createElement";
import {removeChildrenFromElement}              from "../utils/uiHelpers/removeChildrenFromElement";
import {removeElementById}                      from "../utils/uiHelpers/removeElementById";
import {yesNoBoxCreate, yesNoTxtInpBoxCreate,
        yesNoBoxGetYesButton, yesNoBoxGetNoButton,
        yesNoTxtInpBoxGetYesButton, yesNoTxtInpBoxGetNoButton,
        yesNoTxtInpBoxGetInput, yesNoBoxClose,
        yesNoTxtInpBoxClose, yesNoBoxOpen}      from "../utils/YesNoBox";

let StockPriceCap = 1e9; //Put a limit on how high a price can go

function Stock(name, symbol, mv, b, otlkMag, initPrice=10000) {
    this.symbol     = symbol;
    this.name       = name;
    this.price      = initPrice;

    this.playerShares       = 0;
    this.playerAvgPx        = 0;
    this.playerShortShares  = 0;
    this.playerAvgShortPx   = 0;
    this.mv             = mv;
    this.b              = b;
    this.otlkMag        = otlkMag;

    this.posTxtEl       = null;
}

Stock.prototype.toJSON = function() {
	return Generic_toJSON("Stock", this);
}

Stock.fromJSON = function(value) {
	return Generic_fromJSON(Stock, value.data);
}

Reviver.constructors.Stock = Stock;

var OrderTypes = {
    LimitBuy: "Limit Buy Order",
    LimitSell: "Limit Sell Order",
    StopBuy: "Stop Buy Order",
    StopSell: "Stop Sell Order"
}

var PositionTypes = {
    Long: "L",
    Short: "S"
}

function placeOrder(stock, shares, price, type, position, workerScript=null) {
    var tixApi = (workerScript instanceof WorkerScript);
    var order = new Order(stock, shares, price, type, position);
    if (isNaN(shares) || isNaN(price)) {
        if (tixApi) {
            workerScript.scriptRef.log("ERROR: Invalid numeric value provided for either 'shares' or 'price' argument");
        } else {
            dialogBoxCreate("ERROR: Invalid numeric value provided for either 'shares' or 'price' argument");
        }
        return false;
    }
    if (StockMarket["Orders"] == null) {
        var orders = {};
        for (var name in StockMarket) {
            if (StockMarket.hasOwnProperty(name)) {
                var stock = StockMarket[name];
                if (!(stock instanceof Stock)) {continue;}
                orders[stock.symbol] = [];
            }
        }
        StockMarket["Orders"] = orders;
    }
    StockMarket["Orders"][stock.symbol].push(order);
    //Process to see if it should be executed immediately
    processOrders(order.stock, order.type, order.pos);
    updateStockOrderList(order.stock);
    return true;
}

//Returns true if successfully cancels an order, false otherwise
function cancelOrder(params, workerScript=null) {
    var tixApi = (workerScript instanceof WorkerScript);
    if (StockMarket["Orders"] == null) {return false;}
    if (params.order && params.order instanceof Order) {
        var order = params.order;
        //An 'Order' object is passed in
        var stockOrders = StockMarket["Orders"][order.stock.symbol];
        for (var i = 0; i < stockOrders.length; ++i) {
            if (order == stockOrders[i]) {
                stockOrders.splice(i, 1);
                updateStockOrderList(order.stock);
                return true;
            }
        }
        return false;
    } else if (params.stock && params.shares && params.price && params.type &&
               params.pos && params.stock instanceof Stock) {
        //Order properties are passed in. Need to look for the order
        var stockOrders = StockMarket["Orders"][params.stock.symbol];
        var orderTxt = params.stock.symbol + " - " + params.shares + " @ " +
                       numeral(params.price).format('$0.000a');
        for (var i = 0; i < stockOrders.length; ++i) {
            var order = stockOrders[i];
            if (params.shares === order.shares &&
                params.price === order.price &&
                params.type === order.type &&
                params.pos === order.pos) {
                stockOrders.splice(i, 1);
                updateStockOrderList(order.stock);
                if (tixApi) {
                    workerScript.scriptRef.log("Successfully cancelled order: " + orderTxt);
                }
                return true;
            }
        }
        if (tixApi) {
            workerScript.scriptRef.log("Failed to cancel order: " + orderTxt);
        }
        return false;
    }
    return false;
}

function executeOrder(order) {
    var stock = order.stock;
    var orderBook = StockMarket["Orders"];
    var stockOrders = orderBook[stock.symbol];
    var res = true;
    console.log("Executing the following order:");
    console.log(order);
    switch (order.type) {
        case OrderTypes.LimitBuy:
        case OrderTypes.StopBuy:
            if (order.pos === PositionTypes.Long) {
                res = buyStock(order.stock, order.shares) && res;
            } else if (order.pos === PositionTypes.Short) {
                res = shortStock(order.stock, order.shares) && res;
            }
            break;
        case OrderTypes.LimitSell:
        case OrderTypes.StopSell:
            if (order.pos === PositionTypes.Long) {
                res = sellStock(order.stock, order.shares) && res;
            } else if (order.pos === PositionTypes.Short) {
                res = sellShort(order.stock, order.shares) && res;
            }
            break;
    }
    if (res) {
        //Remove order from order book
        for (var i = 0; i < stockOrders.length; ++i) {
            if (order == stockOrders[i]) {
                stockOrders.splice(i, 1);
                updateStockOrderList(order.stock);
                return;
            }
        }
        console.log("ERROR: Could not find the following Order in Order Book: ");
        console.log(order);
    } else {
        console.log("Order failed to execute");
    }
}

function Order(stock, shares, price, type, position) {
    this.stock = stock;
    this.shares = shares;
    this.price = price;
    this.type = type;
    this.pos = position;
}

Order.prototype.toJSON = function() {
	return Generic_toJSON("Order", this);
}

Order.fromJSON = function(value) {
	return Generic_fromJSON(Order, value.data);
}

Reviver.constructors.Order = Order;

let StockMarket = {}        //Full name to stock object
let StockSymbols = {}       //Full name to symbol
let SymbolToStockMap = {};  //Symbol to Stock object

function loadStockMarket(saveString) {
    if (saveString === "") {
        StockMarket = {};
    } else {
        StockMarket = JSON.parse(saveString, Reviver);
    }
}

function initStockSymbols() {
    //Stocks for companies at which you can work
    StockSymbols[Locations.AevumECorp]                      = "ECP";
    StockSymbols[Locations.Sector12MegaCorp]                = "MGCP";
    StockSymbols[Locations.Sector12BladeIndustries]         = "BLD";
    StockSymbols[Locations.AevumClarkeIncorporated]         = "CLRK";
    StockSymbols[Locations.VolhavenOmniTekIncorporated]     = "OMTK";
    StockSymbols[Locations.Sector12FourSigma]               = "FSIG";
    StockSymbols[Locations.ChongqingKuaiGongInternational]  = "KGI";
    StockSymbols[Locations.AevumFulcrumTechnologies]        = "FLCM";
    StockSymbols[Locations.IshimaStormTechnologies]         = "STM";
    StockSymbols[Locations.NewTokyoDefComm]                 = "DCOMM";
    StockSymbols[Locations.VolhavenHeliosLabs]              = "HLS";
    StockSymbols[Locations.NewTokyoVitaLife]                = "VITA";
    StockSymbols[Locations.Sector12IcarusMicrosystems]      = "ICRS";
    StockSymbols[Locations.Sector12UniversalEnergy]         = "UNV";
    StockSymbols[Locations.AevumAeroCorp]                   = "AERO";
    StockSymbols[Locations.VolhavenOmniaCybersystems]       = "OMN";
    StockSymbols[Locations.ChongqingSolarisSpaceSystems]    = "SLRS";
    StockSymbols[Locations.NewTokyoGlobalPharmaceuticals]   = "GPH";
    StockSymbols[Locations.IshimaNovaMedical]               = "NVMD";
    StockSymbols[Locations.AevumWatchdogSecurity]           = "WDS";
    StockSymbols[Locations.VolhavenLexoCorp]                = "LXO";
    StockSymbols[Locations.AevumRhoConstruction]            = "RHOC";
    StockSymbols[Locations.Sector12AlphaEnterprises]        = "APHE";
    StockSymbols[Locations.VolhavenSysCoreSecurities]       = "SYSC";
    StockSymbols[Locations.VolhavenCompuTek]                = "CTK";
    StockSymbols[Locations.AevumNetLinkTechnologies]        = "NTLK";
    StockSymbols[Locations.IshimaOmegaSoftware]             = "OMGA";
    StockSymbols[Locations.Sector12FoodNStuff]              = "FNS";

    //Stocks for other companies
    StockSymbols["Sigma Cosmetics"]                         = "SGC";
    StockSymbols["Joes Guns"]                               = "JGN";
    StockSymbols["Catalyst Ventures"]                       = "CTYS";
    StockSymbols["Microdyne Technologies"]                  = "MDYN";
    StockSymbols["Titan Laboratories"]                      = "TITN";
}

function initStockMarket() {
    for (var stk in StockMarket) {
        if (StockMarket.hasOwnProperty(stk)) {
            delete StockMarket[stk];
        }
    }

    var ecorp = Locations.AevumECorp;
    var ecorpStk = new Stock(ecorp, StockSymbols[ecorp], 0.45, true, 19, getRandomInt(20000, 25000));
    StockMarket[ecorp] = ecorpStk;

    var megacorp = Locations.Sector12MegaCorp;
    var megacorpStk = new Stock(megacorp, StockSymbols[megacorp], 0.45, true, 19, getRandomInt(25000, 33000));
    StockMarket[megacorp] = megacorpStk;

    var blade = Locations.Sector12BladeIndustries;
    var bladeStk = new Stock(blade, StockSymbols[blade], 0.75, true, 13, getRandomInt(15000, 22000));
    StockMarket[blade] = bladeStk;

    var clarke = Locations.AevumClarkeIncorporated;
    var clarkeStk = new Stock(clarke, StockSymbols[clarke], 0.7, true, 12, getRandomInt(15000, 20000));
    StockMarket[clarke] = clarkeStk;

    var omnitek = Locations.VolhavenOmniTekIncorporated;
    var omnitekStk = new Stock(omnitek, StockSymbols[omnitek], 0.65, true, 12, getRandomInt(35000, 40000));
    StockMarket[omnitek] = omnitekStk;

    var foursigma = Locations.Sector12FourSigma;
    var foursigmaStk = new Stock(foursigma, StockSymbols[foursigma], 1.05, true, 17, getRandomInt(60000, 70000));
    StockMarket[foursigma] = foursigmaStk;

    var kuaigong = Locations.ChongqingKuaiGongInternational;
    var kuaigongStk = new Stock(kuaigong, StockSymbols[kuaigong], 0.8, true, 10, getRandomInt(20000, 24000));
    StockMarket[kuaigong] = kuaigongStk;

    var fulcrum = Locations.AevumFulcrumTechnologies;
    var fulcrumStk = new Stock(fulcrum, StockSymbols[fulcrum], 1.25, true, 16, getRandomInt(30000, 35000));
    StockMarket[fulcrum] = fulcrumStk;

    var storm = Locations.IshimaStormTechnologies;
    var stormStk = new Stock(storm, StockSymbols[storm], 0.85, true, 7, getRandomInt(21000, 24000));
    StockMarket[storm] = stormStk;

    var defcomm = Locations.NewTokyoDefComm;
    var defcommStk = new Stock(defcomm, StockSymbols[defcomm], 0.65, true, 10, getRandomInt(10000, 15000));
    StockMarket[defcomm] = defcommStk;

    var helios = Locations.VolhavenHeliosLabs;
    var heliosStk = new Stock(helios, StockSymbols[helios], 0.6, true, 9, getRandomInt(12000, 16000));
    StockMarket[helios] = heliosStk;

    var vitalife = Locations.NewTokyoVitaLife;
    var vitalifeStk = new Stock(vitalife, StockSymbols[vitalife], 0.75, true, 7, getRandomInt(10000, 12000));
    StockMarket[vitalife] = vitalifeStk;

    var icarus = Locations.Sector12IcarusMicrosystems;
    var icarusStk = new Stock(icarus, StockSymbols[icarus], 0.65, true, 7.5, getRandomInt(16000, 20000));
    StockMarket[icarus] = icarusStk;

    var universalenergy = Locations.Sector12UniversalEnergy;
    var universalenergyStk = new Stock(universalenergy, StockSymbols[universalenergy], 0.55, true, 10, getRandomInt(20000, 25000));
    StockMarket[universalenergy] = universalenergyStk;

    var aerocorp = Locations.AevumAeroCorp;
    var aerocorpStk = new Stock(aerocorp, StockSymbols[aerocorp], 0.6, true, 6, getRandomInt(10000, 15000));
    StockMarket[aerocorp] = aerocorpStk;

    var omnia = Locations.VolhavenOmniaCybersystems;
    var omniaStk = new Stock(omnia, StockSymbols[omnia], 0.7, true, 4.5, getRandomInt(9000, 12000));
    StockMarket[omnia] = omniaStk;

    var solaris = Locations.ChongqingSolarisSpaceSystems;
    var solarisStk = new Stock(solaris, StockSymbols[solaris], 0.75, true, 8.5, getRandomInt(18000, 24000));
    StockMarket[solaris] = solarisStk;

    var globalpharm = Locations.NewTokyoGlobalPharmaceuticals;
    var globalpharmStk = new Stock(globalpharm, StockSymbols[globalpharm], 0.6, true, 10.5, getRandomInt(18000, 24000));
    StockMarket[globalpharm] = globalpharmStk;

    var nova = Locations.IshimaNovaMedical;
    var novaStk = new Stock(nova, StockSymbols[nova], 0.75, true, 5, getRandomInt(18000, 24000));
    StockMarket[nova] = novaStk;

    var watchdog = Locations.AevumWatchdogSecurity;
    var watchdogStk = new Stock(watchdog, StockSymbols[watchdog], 2.5, true, 1.5, getRandomInt(5000, 7500));
    StockMarket[watchdog] = watchdogStk;

    var lexocorp = Locations.VolhavenLexoCorp;
    var lexocorpStk = new Stock(lexocorp, StockSymbols[lexocorp], 1.25, true, 6, getRandomInt(5000, 7500));
    StockMarket[lexocorp] = lexocorpStk;

    var rho = Locations.AevumRhoConstruction;
    var rhoStk = new Stock(rho, StockSymbols[rho], 0.6, true, 1, getRandomInt(3000, 6000));
    StockMarket[rho] = rhoStk;

    var alpha = Locations.Sector12AlphaEnterprises;
    var alphaStk = new Stock(alpha, StockSymbols[alpha], 1.9, true, 10, getRandomInt(5000, 7500));
    StockMarket[alpha] = alphaStk;

    var syscore = Locations.VolhavenSysCoreSecurities;
    var syscoreStk = new Stock(syscore, StockSymbols[syscore], 1.6, true, 3, getRandomInt(4000, 7000))
    StockMarket[syscore] = syscoreStk;

    var computek = Locations.VolhavenCompuTek;
    var computekStk = new Stock(computek, StockSymbols[computek], 0.9, true, 4, getRandomInt(2000, 5000));
    StockMarket[computek] = computekStk;

    var netlink = Locations.AevumNetLinkTechnologies;
    var netlinkStk = new Stock(netlink, StockSymbols[netlink], 4.2, true, 1, getRandomInt(2000, 4000));
    StockMarket[netlink] = netlinkStk;

    var omega = Locations.IshimaOmegaSoftware;
    var omegaStk = new Stock(omega, StockSymbols[omega], 1, true, 0.5, getRandomInt(3000, 6000));
    StockMarket[omega] = omegaStk;

    var fns = Locations.Sector12FoodNStuff;
    var fnsStk = new Stock(fns, StockSymbols[fns], 0.75, false, 1, getRandomInt(1000, 4000));
    StockMarket[fns] = fnsStk;

    var sigmacosm = "Sigma Cosmetics";
    var sigmacosmStk = new Stock(sigmacosm, StockSymbols[sigmacosm], 2.8, true, 0, getRandomInt(2000, 3000));
    StockMarket[sigmacosm] = sigmacosmStk;

    var joesguns = "Joes Guns";
    var joesgunsStk = new Stock(joesguns, StockSymbols[joesguns], 3.8, true, 1, getRandomInt(500, 1000));
    StockMarket[joesguns] = joesgunsStk;

    var catalyst = "Catalyst Ventures";
    var catalystStk = new Stock(catalyst, StockSymbols[catalyst], 1.45, true, 13.5, getRandomInt(500, 1000));
    StockMarket[catalyst] = catalystStk;

    var microdyne = "Microdyne Technologies";
    var microdyneStk = new Stock(microdyne, StockSymbols[microdyne], 0.75, true, 8, getRandomInt(20000, 25000));
    StockMarket[microdyne] = microdyneStk;

    var titanlabs = "Titan Laboratories";
    var titanlabsStk = new Stock(titanlabs, StockSymbols[titanlabs], 0.6, true, 11, getRandomInt(15000, 20000));
    StockMarket[titanlabs] = titanlabsStk;

    var orders = {};
    for (var name in StockMarket) {
        if (StockMarket.hasOwnProperty(name)) {
            var stock = StockMarket[name];
            if (!(stock instanceof Stock)) {continue;}
            orders[stock.symbol] = [];
        }
    }
    StockMarket["Orders"] = orders;
}

function initSymbolToStockMap() {
    for (var name in StockSymbols) {
        if (StockSymbols.hasOwnProperty(name)) {
            var stock = StockMarket[name];
            if (stock == null) {
                console.log("ERROR finding stock");
                continue;
            }
            var symbol = StockSymbols[name];
            SymbolToStockMap[symbol] = stock;
        }
    }
}

function stockMarketCycle() {
    for (var name in StockMarket) {
        if (StockMarket.hasOwnProperty(name)) {
            var stock = StockMarket[name];
            if (!(stock instanceof Stock)) {continue;}
            var thresh = 0.6;
            if (stock.b) {thresh = 0.4;}
            if (Math.random() < thresh) {
                stock.b = !stock.b;
            }
        }
    }
}

//Returns true if successful, false otherwise
function buyStock(stock, shares) {
    if (stock == null || shares < 0 || isNaN(shares)) {
        dialogBoxCreate("Failed to buy stock. This may be a bug, contact developer");
        return false;
    }
    shares = Math.round(shares);
    if (shares == 0) {return false;}

    var totalPrice = stock.price * shares;
    if (Player.money.lt(totalPrice + CONSTANTS.StockMarketCommission)) {
        dialogBoxCreate("You do not have enough money to purchase this. You need " +
                        numeral(totalPrice + CONSTANTS.StockMarketCommission).format('($0.000a)') + ".");
        return false;
    }

    var origTotal = stock.playerShares * stock.playerAvgPx;
    Player.loseMoney(totalPrice + CONSTANTS.StockMarketCommission);
    var newTotal = origTotal + totalPrice;
    stock.playerShares += shares;
    stock.playerAvgPx = newTotal / stock.playerShares;
    updateStockPlayerPosition(stock);
    dialogBoxCreate("Bought " + numeral(shares).format('0,0') + " shares of " + stock.symbol + " at " +
                    numeral(stock.price).format('($0.000a)') + " per share. Paid " +
                    numeral(CONSTANTS.StockMarketCommission).format('($0.000a)') + " in commission fees.");
    return true;
}

//Returns true if successful and false otherwise
function sellStock(stock, shares) {
    if (shares == 0) {return false;}
    if (stock == null || shares < 0 || isNaN(shares)) {
        dialogBoxCreate("Failed to sell stock. This may be a bug, contact developer");
        return false;
    }
    shares = Math.round(shares);
    if (shares > stock.playerShares) {shares = stock.playerShares;}
    if (shares === 0) {return false;}
    var gains = stock.price * shares - CONSTANTS.StockMarketCommission;
    Player.gainMoney(gains);
    stock.playerShares -= shares;
    if (stock.playerShares == 0) {
        stock.playerAvgPx = 0;
    }
    updateStockPlayerPosition(stock);
    dialogBoxCreate("Sold " + numeral(shares).format('0,0') + " shares of " + stock.symbol + " at " +
                    numeral(stock.price).format('($0.000a)') + " per share. After commissions, you gained " +
                    "a total of " + numeral(gains).format('($0.000a)') + ".");
    return true;
}

//Returns true if successful and false otherwise
function shortStock(stock, shares, workerScript=null) {
    var tixApi = (workerScript instanceof WorkerScript);
    if (stock == null || isNaN(shares) || shares < 0) {
        if (tixApi) {
            workerScript.scriptRef.log("ERROR: shortStock() failed because of invalid arguments.");
        } else {
            dialogBoxCreate("Failed to initiate a short position in a stock. This is probably " +
                            "due to an invalid quantity. Otherwise, this may be a bug,  so contact developer");
        }
        return false;
    }
    shares = Math.round(shares);
    if (shares === 0) {return false;}

    var totalPrice = stock.price * shares;
    if (Player.money.lt(totalPrice + CONSTANTS.StockMarketCommission)) {
        if (tixApi) {
            workerScript.scriptRef.log("ERROR: shortStock() failed because you do not have enough " +
                                       "money to purchase this short position. You need " +
                                       numeral(totalPrice + CONSTANTS.StockMarketCommission).format('($0.000a)') + ".");
        } else {
            dialogBoxCreate("You do not have enough money to purchase this short position. You need " +
                            numeral(totalPrice + CONSTANTS.StockMarketCommission).format('($0.000a)') + ".");
        }

        return false;
    }

    var origTotal = stock.playerShortShares * stock.playerAvgShortPx;
    Player.loseMoney(totalPrice + CONSTANTS.StockMarketCommission);
    var newTotal = origTotal + totalPrice;
    stock.playerShortShares += shares;
    stock.playerAvgShortPx = newTotal / stock.playerShortShares;
    updateStockPlayerPosition(stock);
    if (tixApi) {
        if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.shortStock == null) {
            workerScript.scriptRef.log("Bought a short position of " + numeral(shares).format('0,0') + " shares of " + stock.symbol + " at " +
                                       numeral(stock.price).format('($0.000a)') + " per share. Paid " +
                                       numeral(CONSTANTS.StockMarketCommission).format('($0.000a)') + " in commission fees.");
        }
    } else {
        dialogBoxCreate("Bought a short position of " + numeral(shares).format('0,0') + " shares of " + stock.symbol + " at " +
                        numeral(stock.price).format('($0.000a)') + " per share. Paid " +
                        numeral(CONSTANTS.StockMarketCommission).format('($0.000a)') + " in commission fees.");
    }
    return true;
}

//Returns true if successful and false otherwise
function sellShort(stock, shares, workerScript=null) {
    var tixApi = (workerScript instanceof WorkerScript);
    if (stock == null || isNaN(shares) || shares < 0) {
        if (tixApi) {
            workerScript.scriptRef.log("ERROR: sellShort() failed because of invalid arguments.");
        } else {
            dialogBoxCreate("Failed to sell a short position in a stock. This is probably " +
                            "due to an invalid quantity. Otherwise, this may be a bug, so contact developer");
        }
        return false;
    }
    shares = Math.round(shares);
    if (shares > stock.playerShortShares) {shares = stock.playerShortShares;}
    if (shares === 0) {return false;}

    var origCost = shares * stock.playerAvgShortPx;
    var profit = ((stock.playerAvgShortPx - stock.price) * shares) - CONSTANTS.StockMarketCommission;
    if (isNaN(profit)) {profit = 0;}
    Player.gainMoney(origCost + profit);
    if (tixApi) {
        workerScript.scriptRef.onlineMoneyMade += profit;
        Player.scriptProdSinceLastAug += profit;
    }

    stock.playerShortShares -= shares;
    if (stock.playerShortShares === 0) {
        stock.playerAvgShortPx = 0;
    }
    updateStockPlayerPosition(stock);
    if (tixApi) {
        if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.sellShort == null) {
            workerScript.scriptRef.log("Sold your short position of " + numeral(shares).format('0,0') + " shares of " + stock.symbol + " at " +
                                       numeral(stock.price).format('($0.000a)') + " per share. After commissions, you gained " +
                                       "a total of " + numeral(origCost + profit).format('($0.000a)') + ".");
        }
    } else {
        dialogBoxCreate("Sold your short position of " + numeral(shares).format('0,0') + " shares of " + stock.symbol + " at " +
                        numeral(stock.price).format('($0.000a)') + " per share. After commissions, you gained " +
                        "a total of " + numeral(origCost + profit).format('($0.000a)') + ".");
    }

    return true;
}

function updateStockPrices() {
    var v = Math.random();
    for (var name in StockMarket) {
        if (StockMarket.hasOwnProperty(name)) {
            var stock = StockMarket[name];
            if (!(stock instanceof Stock)) {continue;}
            var av = (v * stock.mv) / 100;
            if (isNaN(av)) {av = .02;}

            var chc = 50;
            if (stock.b) {
                chc = (chc + stock.otlkMag)/100;
                if (isNaN(chc)) {chc = 0.5;}
            } else {
                chc = (chc - stock.otlkMag)/100;
                if (isNaN(chc)) {chc = 0.5;}
            }
            if (stock.price >= StockPriceCap) {
                chc = -1; //Limit on stock price
                stock.b = false;
            }

            var c = Math.random();
            if (c < chc) {
                stock.price *= (1 + av);
                processOrders(stock, OrderTypes.LimitBuy, PositionTypes.Short);
                processOrders(stock, OrderTypes.LimitSell, PositionTypes.Long);
                processOrders(stock, OrderTypes.StopBuy, PositionTypes.Long);
                processOrders(stock, OrderTypes.StopSell, PositionTypes.Short);
                if (routing.isOn(Page.StockMarket)) {
                    updateStockTicker(stock, true);
                }
            } else {
                stock.price /= (1 + av);
                processOrders(stock, OrderTypes.LimitBuy, PositionTypes.Long);
                processOrders(stock, OrderTypes.LimitSell, PositionTypes.Short);
                processOrders(stock, OrderTypes.StopBuy, PositionTypes.Short);
                processOrders(stock, OrderTypes.StopSell, PositionTypes.Long);
                if (routing.isOn(Page.StockMarket)) {
                    updateStockTicker(stock, false);
                }
            }

            var otlkMagChange = stock.otlkMag * av;
            if (stock.otlkMag <= 0.1) {
                otlkMagChange = 1;
            }
            if (c < 0.5) {
                stock.otlkMag += otlkMagChange;
            } else {
                stock.otlkMag -= otlkMagChange;
            }
            if (stock.otlkMag < 0) {
                stock.otlkMag *= -1;
                stock.b = !stock.b;
            }

        }
    }
}

//Checks and triggers any orders for the specified stock
function processOrders(stock, orderType, posType) {
    var orderBook = StockMarket["Orders"];
    if (orderBook == null) {
        var orders = {};
        for (var name in StockMarket) {
            if (StockMarket.hasOwnProperty(name)) {
                var stock = StockMarket[name];
                if (!(stock instanceof Stock)) {continue;}
                orders[stock.symbol] = [];
            }
        }
        StockMarket["Orders"] = orders;
        return; //Newly created, so no orders to process
    }
    var stockOrders = orderBook[stock.symbol];
    if (stockOrders == null || !(stockOrders.constructor === Array)) {
        console.log("ERROR: Invalid Order book for " + stock.symbol + " in processOrders()");
        stockOrders = [];
        return;
    }
    for (var i = 0; i < stockOrders.length; ++i) {
        var order = stockOrders[i];
        if (order.type === orderType && order.pos === posType) {
            switch(order.type) {
                case OrderTypes.LimitBuy:
                    if (order.pos === PositionTypes.Long && stock.price <= order.price) {
                        executeOrder/*66*/(order);
                    } else if (order.pos === PositionTypes.Short && stock.price >= order.price) {
                        executeOrder/*66*/(order);
                    }
                    break;
                case OrderTypes.LimitSell:
                    if (order.pos === PositionTypes.Long && stock.price >= order.price) {
                        executeOrder/*66*/(order);
                    } else if (order.pos === PositionTypes.Short && stock.price <= order.price) {
                        executeOrder/*66*/(order);
                    }
                    break;
                case OrderTypes.StopBuy:
                    if (order.pos === PositionTypes.Long && stock.price >= order.price) {
                        executeOrder/*66*/(order);
                    } else if (order.pos === PositionTypes.Short && stock.price <= order.price) {
                        executeOrder/*66*/(order);
                    }
                    break;
                case OrderTypes.StopSell:
                    if (order.pos === PositionTypes.Long && stock.price <= order.price) {
                        executeOrder/*66*/(order);
                    } else if (order.pos === PositionTypes.Short && stock.price >= order.price) {
                        executeOrder/*66*/(order);
                    }
                    break;
                default:
                    console.log("Invalid order type: " + order.type);
                    return;
            }
        }
    }
}

function setStockMarketContentCreated(b) {
    stockMarketContentCreated = b;
}

var stockMarketContentCreated = false;
var stockMarketPortfolioMode = false;
var COMM = CONSTANTS.StockMarketCommission;
function displayStockMarketContent() {
    if (Player.hasWseAccount == null)   {Player.hasWseAccount = false;}
    if (Player.hasTixApiAccess == null) {Player.hasTixApiAccess = false;}
    if (Player.has4SData == null)       {Player.has4SData = false;}
    if (Player.has4SDataTixApi == null) {Player.has4SDataTixApi = false;}

    function stylePurchaseButton(btn, cost, flag, initMsg, purchasedMsg) {
        btn.innerText = initMsg;
        btn.classList.remove("a-link-button");
        btn.classList.remove("a-link-button-bought");
        btn.classList.remove("a-link-button-inactive");
        if (!flag && Player.money.gte(cost)) {
            btn.classList.add("a-link-button");
        } else if (flag) {
            btn.innerText = purchasedMsg;
            btn.classList.add("a-link-button-bought");
        } else {
            btn.classList.add("a-link-button-inactive");
        }
    }

    //Purchase WSE Account button
    var wseAccountButton = clearEventListeners("stock-market-buy-account");
    stylePurchaseButton(wseAccountButton, CONSTANTS.WSEAccountCost, Player.hasWseAccount,
                        "Buy WSE Account - " + numeral(CONSTANTS.WSEAccountCost).format('($0.000a)'),
                        "WSE Account - Purchased");
    wseAccountButton.addEventListener("click", function() {
        Player.hasWseAccount = true;
        initStockMarket();
        initSymbolToStockMap();
        Player.loseMoney(CONSTANTS.WSEAccountCost);
        displayStockMarketContent();
        return false;
    });

    //Purchase TIX API Access account
    var tixApiAccessButton = clearEventListeners("stock-market-buy-tix-api");
    stylePurchaseButton(tixApiAccessButton, CONSTANTS.TIXAPICost, Player.hasTixApiAccess,
                        "Buy Trade Information eXchange (TIX) API Access - " + numeral(CONSTANTS.TIXAPICost).format('($0.000a)'),
                        "TIX API Access - Purchased");
    tixApiAccessButton.addEventListener("click", function() {
        Player.hasTixApiAccess = true;
        Player.loseMoney(CONSTANTS.TIXAPICost);
        displayStockMarketContent();
        return false;
    });

    //Purchase Four Sigma Market Data Feed
    var marketDataButton = clearEventListeners("stock-market-buy-4s-data");
    stylePurchaseButton(marketDataButton, CONSTANTS.MarketData4SCost, Player.has4SData,
                        "Buy 4S Market Data Access - " + numeral(CONSTANTS.MarketData4SCost).format('($0.000a)'),
                        "4S Market Data - Purchased");
    marketDataButton.addEventListener("click", function() {
        Player.has4SData = true;
        Player.loseMoney(CONSTANTS.MarketData4SCost);
        displayStockMarketContent();
        return false;
    });
    marketDataButton.appendChild(createElement("span", {
        class:"tooltiptext",
        innerText:"Lets you view additional pricing and volatility information about stocks"
    }));
    marketDataButton.style.marginRight = "2px"; //Adjusts following help tip to be slightly closer

    //4S Market Data Help Tip
    var marketDataHelpTip = clearEventListeners("stock-market-4s-data-help-tip");
    marketDataHelpTip.style.marginTop = "10px";
    marketDataHelpTip.addEventListener("click", ()=>{
        dialogBoxCreate("Access to the 4S Market Data feed will display two additional pieces " +
                        "of information about each stock: Price Forecast & Volatility<br><br>" +
                        "Price Forecast indicates the probability the stock has of increasing or " +
                        "decreasing. A '+' forecast means the stock has a higher chance of increasing "  +
                        "than decreasing, and a '-' means the opposite. The number of '+/-' symbols " +
                        "is used to illustrate the magnitude of these probabilities. For example, " +
                        "'+++' means that the stock has a significantly higher chance of increasing " +
                        "than decreasing, while '+' means that the stock only has a slightly higher chance " +
                        "of increasing than decreasing.<br><br>"  +
                        "Volatility represents the maximum percentage by which a stock's price " +
                        "can change every tick (a tick occurs every few seconds while the game " +
                        "is running).<br><br>" +
                        "A stock's price forecast can change over time. This is also affected by volatility. " +
                        "The more volatile a stock is, the more its price forecast will change.");
        return false;
    });

    //Purchase Four Sigma Market Data TIX API (Requires TIX API Access)
    var marketDataTixButton = clearEventListeners("stock-market-buy-4s-tix-api");
    stylePurchaseButton(marketDataTixButton, CONSTANTS.MarketDataTixApi4SCost, Player.has4SDataTixApi,
                        "Buy 4S Market Data TIX API Access - " + numeral(CONSTANTS.MarketDataTixApi4SCost).format('($0.000a)'),
                        "4S Market Data TIX API - Purchased");
    if (Player.hasTixApiAccess) {
        marketDataTixButton.addEventListener("click", function() {
            Player.has4SDataTixApi = true;
            Player.loseMoney(CONSTANTS.MarketDataTixApi4SCost);
            displayStockMarketContent();
            return false;
        });
        marketDataTixButton.appendChild(createElement("span", {
            class:"tooltiptext",
            innerText:"Lets you access 4S Market Data through Netscript"
        }));
    } else {
        marketDataTixButton.classList.remove("a-link-button");
        marketDataTixButton.classList.remove("a-link-button-bought");
        marketDataTixButton.classList.remove("a-link-button-inactive");
        marketDataTixButton.classList.add("a-link-button-inactive");
        marketDataTixButton.appendChild(createElement("span", {
            class:"tooltiptext",
            innerText:"Requires TIX API Access"
        }));
    }


    var stockList = document.getElementById("stock-market-list");
    if (stockList == null) {return;}

    //UI Elements that should only appear if you have WSE account access
    var commissionText     = document.getElementById("stock-market-commission");
    var modeBtn            = document.getElementById("stock-market-mode");
    var expandBtn          = document.getElementById("stock-market-expand-tickers");
    var collapseBtn        = document.getElementById("stock-market-collapse-tickers");
    var watchlistFilter    = document.getElementById("stock-market-watchlist-filter");
    var watchlistUpdateBtn = document.getElementById("stock-market-watchlist-filter-update");

    //If Player doesn't have account, clear stocks UI and return
    if (!Player.hasWseAccount) {
        stockMarketContentCreated = false;
        while (stockList.firstChild) {
            stockList.removeChild(stockList.firstChild);
        }
        commissionText.style.visibility = "hidden";
        modeBtn.style.visibility = "hidden";
        expandBtn.style.visibility = "hidden";
        collapseBtn.style.visibility = "hidden";
        watchlistFilter.style.visibility = "hidden";
        watchlistUpdateBtn.style.visibility = "hidden";
        return;
    } else {
        commissionText.style.visibility = "visible";
        modeBtn.style.visibility = "visible";
        expandBtn.style.visibility = "visible";
        collapseBtn.style.visibility = "visible";
        watchlistFilter.style.visibility = "visible";
        watchlistUpdateBtn.style.visibility = "visible";
    }

    //Create stock market content if you have an account
    if (!stockMarketContentCreated && Player.hasWseAccount) {
        console.log("Creating Stock Market UI");
        commissionText.innerHTML =
            "Commission Fees: Every transaction you make has a " +
            numeral(CONSTANTS.StockMarketCommission).format('($0.000a)') + " commission fee.<br><br>" +
            "WARNING: When you reset after installing Augmentations, the Stock Market is reset. " +
            "This means all your positions are lost, so make sure to sell your stocks before installing " +
            "Augmentations!";

        var investopediaButton = clearEventListeners("stock-market-investopedia");
        investopediaButton.addEventListener("click", function() {
            var txt = "When making a transaction on the stock market, there are two " +
                "types of positions: Long and Short. A Long position is the typical " +
                "scenario where you buy a stock and earn a profit if the price of that " +
                "stock increases. Meanwhile, a Short position is the exact opposite. " +
                "In a Short position you purchase shares of a stock and earn a profit " +
                "if the price of that stock decreases. This is also called 'shorting' a stock.<br><br>" +
                "NOTE: Shorting stocks is not available immediately, and must be unlocked later on in the game.<br><br>" +
                "There are three different types of orders you can make to buy or sell " +
                "stocks on the exchange: Market Order, Limit Order, and Stop Order. " +
                "Note that Limit Orders and Stop Orders are not available immediately, and must be unlocked " +
                "later on in the game.<br><br>" +
                "When you place a Market Order to buy or sell a stock, the order executes " +
                "immediately at whatever the current price of the stock is. For example " +
                "if you choose to short a stock with 5000 shares using a Market Order, " +
                "you immediately purchase those 5000 shares in a Short position at whatever " +
                "the current market price is for that stock.<br><br>" +
                "A Limit Order is an order that only executes under certain conditions. " +
                "A Limit Order is used to buy or sell a stock at a specified price or better. " +
                "For example, lets say you purchased a Long position of 100 shares of some stock " +
                "at a price of $10 per share. You can place a Limit Order to sell those 100 shares " +
                "at $50 or better. The Limit Order will execute when the price of the stock reaches a  " +
                "value of $50 or higher.<br><br>" +
                "A Stop Order is the opposite of a Limit Order. It is used to buy or sell a stock " +
                "at a specified price (before the price gets 'worse'). For example, lets say you purchased " +
                "a Short position of 100 shares of some stock at a price of $100 per share. " +
                "The current price of the stock is $80 (a profit of $20 per share). You can place a " +
                "Stop Order to sell the Short position if the stock's price reaches $90 or higher. " +
                "This can be used to lock in your profits and limit any losses.<br><br>" +
                "Here is a summary of how each order works and when they execute:<br><br>" +
                "In a LONG Position:<br><br>" +
                "A Limit Order to buy will execute if the stock's price <= order's price<br>" +
                "A Limit Order to sell will execute if the stock's price >= order's price<br>" +
                "A Stop Order to buy will execute if the stock's price >= order's price<br>" +
                "A Stop Order to sell will execute if the stock's price <= order's price<br><br>" +
                "In a SHORT Position:<br><br>" +
                "A Limit Order to buy will execute if the stock's price >= order's price<br>" +
                "A Limit Order to sell will execute if the stock's price <= order's price<br>" +
                "A Stop Order to buy will execute if the stock's price <= order's price<br>" +
                "A Stop Order to sell will execute if the stock's price >= order's price.";
            dialogBoxCreate(txt);
            return false;
        });

        //Switch to Portfolio Mode Button
        if (modeBtn) {
            modeBtn.innerHTML = "Switch to 'Portfolio' Mode" +
                "<span class='tooltiptext'>Displays only the stocks for which you have shares or orders</span>";
            modeBtn.addEventListener("click", switchToPortfolioMode);
        }

        //Expand/Collapse tickers buttons
        var stockList = document.getElementById("stock-market-list");
        if (expandBtn) {
            expandBtn.addEventListener("click", ()=>{
                var tickerHdrs = stockList.getElementsByClassName("accordion-header");
                for (var i = 0; i < tickerHdrs.length; ++i) {
                    if (!tickerHdrs[i].classList.contains("active")) {
                        tickerHdrs[i].click();
                    }
                }
            });
        }
        if (collapseBtn) {
            collapseBtn.addEventListener("click",()=>{
                var tickerHdrs = stockList.getElementsByClassName("accordion-header");
                for (var i = 0; i < tickerHdrs.length; ++i) {
                    if (tickerHdrs[i].classList.contains("active")) {
                        tickerHdrs[i].click();
                    }
                }
            });
        }

        //Watchlish filter
        if (watchlistFilter && watchlistUpdateBtn) {
            //Initialize value in watchlist
            if (StockMarket.watchlistFilter) {
                watchlistFilter.value = StockMarket.watchlistFilter; //Remove whitespace
            }
            watchlistUpdateBtn.addEventListener("click", ()=> {
                let filterValue = watchlistFilter.value.toString();
                StockMarket.watchlistFilter = filterValue.replace(/\s/g, '');
                if (stockMarketPortfolioMode) {
                    switchToPortfolioMode();
                } else {
                    switchToDisplayAllMode();
                }
            });
            watchlistFilter.addEventListener("keyup", (e)=>{
                e.preventDefault();
                if (e.keyCode === KEY.ENTER) {watchlistUpdateBtn.click();}
            })
        } else {
            console.warn("Stock Market Watchlist DOM elements could not be found");
        }

        createAllStockTickers();
        stockMarketContentCreated = true;
    }

    if (Player.hasWseAccount) {
        for (var name in StockMarket) {
            if (StockMarket.hasOwnProperty(name)) {
                var stock = StockMarket[name];
                if (stock instanceof Stock) {
                    updateStockTicker(stock, null);
                    updateStockOrderList(stock);
                }
            }
        }
    }
}

//Displays only stocks you have position/order in
function switchToPortfolioMode() {
    stockMarketPortfolioMode = true;
    var modeBtn = clearEventListeners("stock-market-mode");
    if (modeBtn) {
        modeBtn.innerHTML = "Switch to 'All stocks' Mode" +
            "<span class='tooltiptext'>Displays all stocks on the WSE</span>";
        modeBtn.addEventListener("click", switchToDisplayAllMode);
    }
    createAllStockTickers();
}

//Displays all stocks
function switchToDisplayAllMode() {
    stockMarketPortfolioMode = false;
    var modeBtn = clearEventListeners("stock-market-mode");
    if (modeBtn) {
        modeBtn.innerHTML = "Switch to 'Portfolio' Mode" +
            "<span class='tooltiptext'>Displays only the stocks for which you have shares or orders</span>";
        modeBtn.addEventListener("click", switchToPortfolioMode);
    }
    createAllStockTickers();
}

function createAllStockTickers() {
    var stockList = document.getElementById("stock-market-list");
    if (stockList == null) {
        exceptionAlert("Error creating Stock Tickers UI. DOM element with ID 'stock-market-list' could not be found");
    }
    removeChildrenFromElement(stockList);

    var orderBook = StockMarket["Orders"];
    if (orderBook == null) {
        var orders = {};
        for (var name in StockMarket) {
            if (StockMarket.hasOwnProperty(name)) {
                var stock = StockMarket[name];
                if (!(stock instanceof Stock)) {continue;}
                orders[stock.symbol] = [];
            }
        }
        StockMarket["Orders"] = orders;
        orderBook = StockMarket["Orders"];
    }

    let watchlist = null;
    if (StockMarket.watchlistFilter != null && StockMarket.watchlistFilter !== "") {
        let filter = StockMarket.watchlistFilter.replace(/\s/g, '');
        watchlist = filter.split(",");
    }

    for (var name in StockMarket) {
        if (StockMarket.hasOwnProperty(name)) {
            var stock = StockMarket[name];
            if (!(stock instanceof Stock)) {continue;} //orders property is an array
            if (watchlist && !watchlist.includes(stock.symbol)) {continue;} //Watchlist filtering

            let stockOrders = orderBook[stock.symbol];
            if (stockMarketPortfolioMode) {
                if (stock.playerShares === 0 && stock.playerShortShares === 0 &&
                    stockOrders.length === 0) {continue;}
            }
            createStockTicker(stock);
        }
    }
    setStockTickerClickHandlers(); //Clicking headers opens/closes panels
}

function createStockTicker(stock) {
    if (!(stock instanceof Stock)) {
        console.log("Invalid stock in createStockSticker()");
        return;
    }
    var tickerId = "stock-market-ticker-" + stock.symbol;
    var li = document.createElement("li"), hdr = document.createElement("button");
    hdr.classList.add("accordion-header");
    hdr.setAttribute("id", tickerId + "-hdr");
    hdr.innerHTML = stock.name + "  -  " + stock.symbol + "  -  " + numeral(stock.price).format('($0.000a)');

    //Div for entire panel
    var stockDiv = document.createElement("div");
    stockDiv.classList.add("accordion-panel");
    stockDiv.setAttribute("id", tickerId + "-panel");

    /* Create panel DOM */
    var qtyInput = document.createElement("input"),
        longShortSelect = document.createElement("select"),
        orderTypeSelect = document.createElement("select"),
        buyButton = document.createElement("span"),
        sellButton = document.createElement("span"),
        buyMaxButton = document.createElement("span"),
        sellAllButton = document.createElement("span"),
        positionTxt = document.createElement("p"),
        orderList = document.createElement("ul");

    qtyInput.classList.add("stock-market-input");
    qtyInput.placeholder = "Quantity (Shares)";
    qtyInput.setAttribute("id", tickerId + "-qty-input");
    qtyInput.setAttribute("onkeydown", "return ( event.ctrlKey || event.altKey " +
                          " || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false) " +
                          " || (95<event.keyCode && event.keyCode<106) " +
                          " || (event.keyCode==8) || (event.keyCode==9) " +
                          " || (event.keyCode>34 && event.keyCode<40) " +
                          " || (event.keyCode==46) )");

    longShortSelect.classList.add("stock-market-input");
    longShortSelect.setAttribute("id", tickerId + "-pos-selector");
    var longOpt = document.createElement("option");
    longOpt.text = "Long";
    longShortSelect.add(longOpt);
    if (Player.bitNodeN === 8 || (hasWallStreetSF && wallStreetSFLvl >= 2)) {
        var shortOpt = document.createElement("option");
        shortOpt.text = "Short";
        longShortSelect.add(shortOpt);
    }

    orderTypeSelect.classList.add("stock-market-input");
    orderTypeSelect.setAttribute("id", tickerId + "-order-selector");
    var marketOpt = document.createElement("option");
    marketOpt.text = "Market Order";
    orderTypeSelect.add(marketOpt);
    if (Player.bitNodeN === 8 || (hasWallStreetSF && wallStreetSFLvl >= 3)) {
        var limitOpt = document.createElement("option");
        limitOpt.text = "Limit Order";
        orderTypeSelect.add(limitOpt);
        var stopOpt = document.createElement("option");
        stopOpt.text = "Stop Order";
        orderTypeSelect.add(stopOpt);
    }

    buyButton.classList.add("stock-market-input");
    buyButton.classList.add("a-link-button");
    buyButton.innerHTML = "Buy";
    buyButton.addEventListener("click", ()=>{
        var pos = longShortSelect.options[longShortSelect.selectedIndex].text;
        pos === "Long" ? pos = PositionTypes.Long : pos = PositionTypes.Short;
        var ordType = orderTypeSelect.options[orderTypeSelect.selectedIndex].text;
        var shares = Number(document.getElementById(tickerId + "-qty-input").value);
        if (isNaN(shares)) {return false;}
        switch (ordType) {
            case "Market Order":
                pos === PositionTypes.Long ? buyStock(stock, shares) : shortStock(stock, shares, null);
                break;
            case "Limit Order":
            case "Stop Order":
                var yesBtn = yesNoTxtInpBoxGetYesButton(),
                    noBtn = yesNoTxtInpBoxGetNoButton();
                yesBtn.innerText = "Place Buy " + ordType;
                noBtn.innerText = "Cancel Order";
                yesBtn.addEventListener("click", ()=>{
                    var price = Number(yesNoTxtInpBoxGetInput()), type;
                    if (ordType === "Limit Order") {
                        type = OrderTypes.LimitBuy;
                    } else {
                        type = OrderTypes.StopBuy;
                    }
                    placeOrder(stock, shares, price, type, pos);
                    yesNoTxtInpBoxClose();
                });
                noBtn.addEventListener("click", ()=>{
                    yesNoTxtInpBoxClose();
                });
                yesNoTxtInpBoxCreate("Enter the price for your " + ordType);
                break;
            default:
                console.log("ERROR: Invalid order type");
                break;
        }
        return false;
    });

    sellButton.classList.add("stock-market-input");
    sellButton.classList.add("a-link-button");
    sellButton.innerHTML = "Sell";
    sellButton.addEventListener("click", ()=>{
        var pos = longShortSelect.options[longShortSelect.selectedIndex].text;
        pos === "Long" ? pos = PositionTypes.Long : pos = PositionTypes.Short;
        var ordType = orderTypeSelect.options[orderTypeSelect.selectedIndex].text;
        var shares = Number(document.getElementById(tickerId + "-qty-input").value);
        if (isNaN(shares)) {return false;}
        switch (ordType) {
            case "Market Order":
                pos === PositionTypes.Long ? sellStock(stock, shares) : sellShort(stock, shares, null);
                break;
            case "Limit Order":
            case "Stop Order":
                var yesBtn = yesNoTxtInpBoxGetYesButton(),
                    noBtn = yesNoTxtInpBoxGetNoButton();
                yesBtn.innerText = "Place Sell " + ordType;
                noBtn.innerText = "Cancel Order";
                yesBtn.addEventListener("click", ()=>{
                    var price = Number(yesNoTxtInpBoxGetInput()), type;
                    if (ordType === "Limit Order") {
                        type = OrderTypes.LimitSell;
                    } else {
                        type = OrderTypes.StopSell;
                    }
                    yesNoTxtInpBoxClose();
                    placeOrder(stock, shares, price, type, pos);
                });
                noBtn.addEventListener("click", ()=>{
                    yesNoTxtInpBoxClose();
                });
                yesNoTxtInpBoxCreate("Enter the price for your " + ordType);
                break;
            default:
                console.log("ERROR: Invalid order type");
                break;
        }
        return false;
    });

    buyMaxButton.classList.add("stock-market-input");
    buyMaxButton.classList.add("a-link-button");
    buyMaxButton.innerHTML = "Buy MAX";
    buyMaxButton.addEventListener("click", ()=>{
        var pos = longShortSelect.options[longShortSelect.selectedIndex].text;
        pos === "Long" ? pos = PositionTypes.Long : pos = PositionTypes.Short;
        var ordType = orderTypeSelect.options[orderTypeSelect.selectedIndex].text;
        var money = Player.money.toNumber();
        switch (ordType) {
            case "Market Order":
                var shares = Math.floor((money - COMM) / stock.price);
                pos === PositionTypes.Long ? buyStock(stock, shares) : shortStock(stock, shares, null);
                break;
            case "Limit Order":
            case "Stop Order":
                var yesBtn = yesNoTxtInpBoxGetYesButton(),
                    noBtn = yesNoTxtInpBoxGetNoButton();
                yesBtn.innerText = "Place Buy " + ordType;
                noBtn.innerText = "Cancel Order";
                yesBtn.addEventListener("click", ()=>{
                    var price = Number(yesNoTxtInpBoxGetInput()), type;
                    if (ordType === "Limit Order") {
                        type = OrderTypes.LimitBuy;
                    } else {
                        type = OrderTypes.StopBuy;
                    }
                    var shares = Math.floor((money-COMM) / price);
                    placeOrder(stock, shares, price, type, pos);
                    yesNoTxtInpBoxClose();
                });
                noBtn.addEventListener("click", ()=>{
                    yesNoTxtInpBoxClose();
                });
                yesNoTxtInpBoxCreate("Enter the price for your " + ordType);
                break;
            default:
                console.log("ERROR: Invalid order type");
                break;
        }
        return false;
    });

    sellAllButton.classList.add("stock-market-input");
    sellAllButton.classList.add("a-link-button");
    sellAllButton.innerHTML = "Sell ALL";
    sellAllButton.addEventListener("click", ()=>{
        var pos = longShortSelect.options[longShortSelect.selectedIndex].text;
        pos === "Long" ? pos = PositionTypes.Long : pos = PositionTypes.Short;
        var ordType = orderTypeSelect.options[orderTypeSelect.selectedIndex].text;
        switch (ordType) {
            case "Market Order":
                if (pos === PositionTypes.Long) {
                    var shares = stock.playerShares;
                    sellStock(stock, shares);
                } else {
                    var shares = stock.playerShortShares;
                    sellShort(stock, shares, null);
                }
                break;
            case "Limit Order":
            case "Stop Order":
                dialogBoxCreate("ERROR: 'Sell All' only works for Market Orders")
                break;
            default:
                console.log("ERROR: Invalid order type");
                break;
        }
        return false;
    });

    positionTxt.setAttribute("id", tickerId + "-position-text");
    positionTxt.classList.add("stock-market-position-text");
    stock.posTxtEl = positionTxt;

    orderList.setAttribute("id", tickerId + "-order-list");
    orderList.classList.add("stock-market-order-list");

    stockDiv.appendChild(qtyInput);
    stockDiv.appendChild(longShortSelect);
    stockDiv.appendChild(orderTypeSelect);
    stockDiv.appendChild(buyButton);
    stockDiv.appendChild(sellButton);
    stockDiv.appendChild(buyMaxButton);
    stockDiv.appendChild(sellAllButton);
    stockDiv.appendChild(positionTxt);
    stockDiv.appendChild(orderList);

    li.appendChild(hdr);
    li.appendChild(stockDiv);
    document.getElementById("stock-market-list").appendChild(li);

    updateStockTicker(stock, true);
    updateStockPlayerPosition(stock);
    updateStockOrderList(stock);
}

function setStockTickerClickHandlers() {
    var stockList = document.getElementById("stock-market-list");
    var tickerHdrs = stockList.getElementsByClassName("accordion-header");
    if (tickerHdrs == null) {
        console.log("ERROR: Could not find header elements for stock tickers");
        return;
    }
    for (var i = 0; i < tickerHdrs.length; ++i) {
        tickerHdrs[i].onclick = function() {
            this.classList.toggle("active");

            var panel = this.nextElementSibling;
            if (panel.style.display === "block") {
                panel.style.display = "none";
            } else {
                panel.style.display = "block";
            }
        }
    }
}

//'increase' argument is a boolean indicating whether the price increased or decreased
function updateStockTicker(stock, increase) {
    if (!routing.isOn(Page.StockMarket)) {return;}
    if (!(stock instanceof Stock)) {
        console.log("Invalid stock in updateStockTicker():");
        console.log(stock);
        return;
    }
    var tickerId = "stock-market-ticker-" + stock.symbol;

    if (stock.playerShares > 0 || stock.playerShortShares > 0) {
        updateStockPlayerPosition(stock);
    }

    var hdr = document.getElementById(tickerId + "-hdr");

    if (hdr == null) {
        if (!stockMarketPortfolioMode) {
            let watchlist = StockMarket.watchlistFilter;
            if (watchlist !== "" && watchlist.includes(stock.symbol)) {
                console.log("ERROR: Couldn't find ticker element for stock: " + stock.symbol);
            }
        }
        return;
    }
    let hdrText = stock.name + " (" + stock.symbol + ") - " + numeral(stock.price).format('($0.000a)');
    if (Player.has4SData) {
        hdrText += " - Volatility: " + numeral(stock.mv).format('0,0.00') + "%" +
                   " - Price Forecast: ";
        if (stock.b) {
            hdrText += "+".repeat(Math.floor(stock.otlkMag/10) + 1);
        } else {
            hdrText += "-".repeat(Math.floor(stock.otlkMag/10) + 1);
        }
    }
    hdr.innerText = hdrText;
    if (increase != null) {
        increase ? hdr.style.color = "#66ff33" : hdr.style.color = "red";
    }
}

function updateStockPlayerPosition(stock) {
    if (!routing.isOn(Page.StockMarket)) {return;}
    if (!(stock instanceof Stock)) {
        console.log("Invalid stock in updateStockPlayerPosition():");
        console.log(stock);
        return;
    }
    var tickerId = "stock-market-ticker-" + stock.symbol;

    if (stockMarketPortfolioMode) {
        if (stock.playerShares === 0 && stock.playerShortShares === 0 &&
            StockMarket["Orders"] && StockMarket["Orders"][stock.symbol] &&
            StockMarket["Orders"][stock.symbol].length === 0) {
            removeElementById(tickerId + "-hdr");
            removeElementById(tickerId + "-panel");
            return;
        } else {
            //If the ticker hasn't been created, create it (handles updating)
            //If it has been created, continue normally
            if (document.getElementById(tickerId + "-hdr") == null) {
                createStockTicker(stock);
                setStockTickerClickHandlers();
                return;
            }
        }
    }

    if (!(stock.posTxtEl instanceof Element)) {
        stock.posTxtEl = document.getElementById(tickerId + "-position-text");
    }
    if (stock.posTxtEl == null) {
        console.log("ERROR: Could not find stock position element for: " + stock.symbol);
        return;
    }

    //Calculate returns
    var totalCost = stock.playerShares * stock.playerAvgPx,
        gains = (stock.price - stock.playerAvgPx) * stock.playerShares,
        percentageGains = gains / totalCost;
    if (isNaN(percentageGains)) {percentageGains = 0;}

    var shortTotalCost = stock.playerShortShares * stock.playerAvgShortPx,
        shortGains = (stock.playerAvgShortPx - stock.price) * stock.playerShortShares,
        shortPercentageGains = shortGains/ shortTotalCost;
    if (isNaN(shortPercentageGains)) {shortPercentageGains = 0;}

    stock.posTxtEl.innerHTML =
        "<h1 class='tooltip stock-market-position-text'>Long Position: " +
        "<span class='tooltiptext'>Shares in the long position will increase " +
        "in value if the price of the corresponding stock increases</span></h1>" +
        "<br>Shares: " + numeral(stock.playerShares).format('0,0') +
        "<br>Average Price: " + numeral(stock.playerAvgPx).format('$0.000a') +
        " (Total Cost: " + numeral(totalCost).format('$0.000a') + ")" +
        "<br>Profit: " + numeral(gains).format('$0.000a') +
                     " (" + numeral(percentageGains).format('0.00%') + ")<br><br>";
        if (Player.bitNodeN === 8 || (hasWallStreetSF && wallStreetSFLvl >= 2)) {
            stock.posTxtEl.innerHTML +=
            "<h1 class='tooltip stock-market-position-text'>Short Position: " +
            "<span class='tooltiptext'>Shares in short position will increase " +
            "in value if the price of the corresponding stock decreases</span></h1>" +
            "<br>Shares: " + numeral(stock.playerShortShares).format('0,0') +
            "<br>Average Price: " + numeral(stock.playerAvgShortPx).format('$0.000a') +
            " (Total Cost: " + numeral(shortTotalCost).format('$0.000a') + ")" +
            "<br>Profit: " + numeral(shortGains).format('$0.000a') +
                         " (" + numeral(shortPercentageGains).format('0.00%') + ")" +
            "<br><br><h1 class='stock-market-position-text'>Orders: </h1>";
        }

}

function updateStockOrderList(stock) {
    if (!routing.isOn(Page.StockMarket)) {return;}
    var tickerId = "stock-market-ticker-" + stock.symbol;
    var orderList = document.getElementById(tickerId + "-order-list");
    if (orderList == null) {
        //Log only if its a valid error
        if (!stockMarketPortfolioMode) {
            let watchlist = StockMarket.watchlistFilter;
            if (watchlist !== "" && watchlist.includes(stock.symbol)) {
                console.log("ERROR: Could not find order list for " + stock.symbol);
            }
        }
        return;
    }

    var orderBook = StockMarket["Orders"];
    if (orderBook == null) {
        console.log("ERROR: Could not find order book in stock market");
        return;
    }
    var stockOrders = orderBook[stock.symbol];
    if (stockOrders == null) {
        console.log("ERROR: Could not find orders for: " + stock.symbol);
        return;
    }

    if (stockMarketPortfolioMode) {
        if (stock.playerShares === 0 && stock.playerShortShares === 0 &&
            StockMarket["Orders"] && StockMarket["Orders"][stock.symbol] &&
            StockMarket["Orders"][stock.symbol].length === 0) {
            removeElementById(tickerId + "-hdr");
            removeElementById(tickerId + "-panel");
            return;
        } else {
            //If the ticker hasn't been created, create it (handles updating)
            //If it has been created, continue normally
            if (document.getElementById(tickerId + "-hdr") == null) {
                createStockTicker(stock);
                setStockTickerClickHandlers();
                return;
            }
        }
    }

    //Remove everything from list
    while (orderList.firstChild) {
        orderList.removeChild(orderList.firstChild);
    }

    for (var i = 0; i < stockOrders.length; ++i) {
        (function() {
            var order = stockOrders[i];
            var li = document.createElement("li");
            li.style.padding = "4px";
            var posText = (order.pos === PositionTypes.Long ? "Long Position" : "Short Position");
            li.style.color = "white";
            li.innerText = order.type + " - " + posText + " - " +
                           order.shares + " @ " + numeral(order.price).format('($0.000a)');

            var cancelButton = document.createElement("span");
            cancelButton.classList.add("stock-market-order-cancel-btn");
            cancelButton.classList.add("a-link-button");
            cancelButton.innerHTML = "Cancel Order";
            cancelButton.addEventListener("click", function() {
                cancelOrder({order: order}, null);
                return false;
            });
            li.appendChild(cancelButton);
            orderList.appendChild(li);
        }());

    }
}

export {StockMarket, StockSymbols, SymbolToStockMap, initStockSymbols,
        initStockMarket, initSymbolToStockMap, stockMarketCycle, buyStock,
        sellStock, shortStock, sellShort, updateStockPrices, displayStockMarketContent,
        updateStockTicker, updateStockPlayerPosition, loadStockMarket,
        setStockMarketContentCreated, placeOrder, cancelOrder, Order, OrderTypes, PositionTypes};
