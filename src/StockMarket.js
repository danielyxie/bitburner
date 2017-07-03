/* StockMarket.js */
function Stock(name, symbol, mv, b, otlkMag, initPrice=10000) {
    this.symbol     = symbol;
    this.name       = name;
    this.price      = initPrice;
    
    this.playerShares   = 0;
    this.playerAvgPx    = 0;
    this.mv             = mv;
    this.b              = b;
    this.otlkMag        = otlkMag;
}


StockMarket = {}        //Full name to stock object
StockSymbols = {}       //Full name to symbol
SymbolToStockMap = {};  //Symbol to Stock object

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
    StockSymbols[Locations.AevumGalacticCybersystems]       = "GLC"
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
    StockSymbols["UnitaLife Group"]                         = "UNT";
    StockSymbols["Zeus Medical"]                            = "ZEUS";
    StockSymbols["Taiyang Digital"]                         = "TAI";
    StockSymbols["Microdyne Technologies"]                  = "MDYN";
    StockSymbols["Titan Laboratories"]                      = "TITN";
}

function initStockMarket() {
    StockMarket = {};
    
    var ecorp = Locations.AevumECorp;
    var ecorpStk = new Stock(ecorp, StockSymbols[ecorp], 0.5, true, 20, getRandomInt(20000, 25000));
    StockMarket[ecorp] = ecorpStk;
    
    var megacorp = Locations.Sector12MegaCorp;
    var megacorpStk = new Stock(megacorp, StockSymbols[megacorp], 0.5, true, 20, getRandomInt(25000, 33000));
    StockMarket[megacorp] = megacorpStk;
    
    var blade = Locations.Sector12BladeIndustries;
    var bladeStk = new Stock(blade, StockSymbols[blade], 0.75, true, 16, getRandomInt(15000, 22000));
    StockMarket[blade] = bladeStk;
    
    var clarke = Locations.AevumClarkeIncorporated;
    var clarkeStk = new Stock(clarke, StockSymbols[clarke], 0.7, true, 15, getRandomInt(15000, 20000));
    StockMarket[clarke] = clarkeStk;
    
    var omnitek = Locations.VolhavenOmniTekIncorporated;
    var omnitekStk = new Stock(omnitek, StockSymbols[omnitek], 0.65, true, 15, getRandomInt(35000, 40000));
    StockMarket[omnitek] = omnitekStk;
    
    var foursigma = Locations.Sector12FourSigma;
    var foursigmaStk = new Stock(foursigma, StockSymbols[foursigma], 1.25, true, 20, getRandomInt(75000, 80000));
    StockMarket[foursigma] = foursigmaStk;
    
    var kuaigong = Locations.ChongqingKuaiGongInternational;
    var kuaigongStk = new Stock(kuaigong, StockSymbols[kuaigong], 0.8, true, 12, getRandomInt(20000, 24000));
    StockMarket[kuaigong] = kuaigongStk;
    
    var fulcrum = Locations.AevumFulcrumTechnologies;
    var fulcrumStk = new Stock(fulcrum, StockSymbols[fulcrum], 1.25, true, 21, getRandomInt(30000, 35000));
    StockMarket[fulcrum] = fulcrumStk;
    
    var storm = Locations.IshimaStormTechnologies;
    var stormStk = new Stock(storm, StockSymbols[storm], 0.85, true, 9, getRandomInt(21000, 24000));
    StockMarket[storm] = stormStk;
    
    var defcomm = Locations.NewTokyoDefComm;
    var defcommStk = new Stock(defcomm, StockSymbols[defcomm], 0.65, true, 12, getRandomInt(10000, 15000));
    StockMarket[defcomm] = defcommStk;
    
    var helios = Locations.VolhavenHeliosLabs;
    var heliosStk = new Stock(helios, StockSymbols[helios], 0.6, true, 11, getRandomInt(12000, 16000));
    StockMarket[helios] = heliosStk;
    
    var vitalife = Locations.NewTokyoVitaLife;
    var vitalifeStk = new Stock(vitalife, StockSymbols[vitalife], 0.75, true, 7.5, getRandomInt(10000, 12000));
    StockMarket[vitalife] = vitalifeStk;
    
    var icarus = Locations.Sector12IcarusMicrosystems;
    var icarusStk = new Stock(icarus, StockSymbols[icarus], 0.65, true, 9, getRandomInt(16000, 20000));
    StockMarket[icarus] = icarusStk;
    
    var universalenergy = Locations.Sector12UniversalEnergy;
    var universalenergyStk = new Stock(universalenergy, StockSymbols[universalenergy], 0.55, true, 12, getRandomInt(20000, 25000));
    StockMarket[universalenergy] = universalenergyStk;
    
    var galactic = Locations.AevumGalacticCybersystems;
    var galacticStk = new Stock(galactic, StockSymbols[galactic], 0.6, true, 6, getRandomInt(8000, 10000));
    StockMarket[galactic] = galacticStk;
    
    var aerocorp = Locations.AevumAeroCorp;
    var aerocorpStk = new Stock(aerocorp, StockSymbols[aerocorp], 0.6, true, 7, getRandomInt(10000, 15000));
    StockMarket[aerocorp] = aerocorpStk;
    
    var omnia = Locations.VolhavenOmniaCybersystems;
    var omniaStk = new Stock(omnia, StockSymbols[omnia], 0.7, true, 4.5, getRandomInt(9000, 12000));
    StockMarket[omnia] = omniaStk;
    
    var solaris = Locations.ChongqingSolarisSpaceSystems;
    var solarisStk = new Stock(solaris, StockSymbols[solaris], 0.75, true, 10, getRandomInt(18000, 24000));
    StockMarket[solaris] = solarisStk;
    
    var globalpharm = Locations.NewTokyoGlobalPharmaceuticals;
    var globalpharmStk = new Stock(globalpharm, StockSymbols[globalpharm], 0.6, true, 12, getRandomInt(18000, 24000));
    StockMarket[globalpharm] = globalpharmStk;
    
    var nova = Locations.IshimaNovaMedical;
    var novaStk = new Stock(nova, StockSymbols[nova], 0.75, true, 6, getRandomInt(18000, 24000));
    StockMarket[nova] = novaStk;
    
    var watchdog = Locations.AevumWatchdogSecurity;
    var watchdogStk = new Stock(watchdog, StockSymbols[watchdog], 1, true, 2, getRandomInt(5000, 7500));
    StockMarket[watchdog] = watchdogStk;
    
    var lexocorp = Locations.VolhavenLexoCorp;
    var lexocorpStk = new Stock(lexocorp, StockSymbols[lexocorp], 1.25, true, 3, getRandomInt(5000, 7500));
    StockMarket[lexocorp] = lexocorpStk;
    
    var rho = Locations.AevumRhoConstruction;
    var rhoStk = new Stock(rho, StockSymbols[rho], 0.6, true, 1, getRandomInt(3000, 6000));
    StockMarket[rho] = rhoStk;
    
    var alpha = Locations.Sector12AlphaEnterprises;
    var alphaStk = new Stock(alpha, StockSymbols[alpha], 1.05, true, 2, getRandomInt(5000, 7500));
    StockMarket[alpha] = alphaStk;
    
    var syscore = Locations.VolhavenSysCoreSecurities;
    var syscoreStk = new Stock(syscore, StockSymbols[syscore], 1.25, true, 0, getRandomInt(4000, 7000))
    StockMarket[syscore] = syscoreStk;
    
    var computek = Locations.VolhavenCompuTek;
    var computekStk = new Stock(computek, StockSymbols[computek], 0.9, true, 0, getRandomInt(2000, 5000));
    StockMarket[computek] = computekStk;
    
    var netlink = Locations.AevumNetLinkTechnologies;
    var netlinkStk = new Stock(netlink, StockSymbols[netlink], 1, true, 1, getRandomInt(2000, 4000));
    StockMarket[netlink] = netlinkStk;
    
    var omega = Locations.IshimaOmegaSoftware;
    var omegaStk = new Stock(omega, StockSymbols[omega], 1, true, 0.5, getRandomInt(3000, 6000));
    StockMarket[omega] = omegaStk;
    
    var fns = Locations.Sector12FoodNStuff;
    var fnsStk = new Stock(fns, StockSymbols[fns], 0.75, false, 1, getRandomInt(1000, 4000));
    StockMarket[fns] = fnsStk;
    
    var sigmacosm = "Sigma Cosmetics";
    var sigmacosmStk = new Stock(sigmacosm, StockSymbols[sigmacosm], 0.9, true, 0, getRandomInt(2000, 3000));
    StockMarket[sigmacosm] = sigmacosmStk;
    
    var joesguns = "Joes Guns";
    var joesgunsStk = new Stock(joesguns, StockSymbols[joesguns], 1, true, 1, getRandomInt(500, 1000));
    StockMarket[joesguns] = joesgunsStk;
    
    var catalyst = "Catalyst Ventures";
    var catalystStk = new Stock(catalyst, StockSymbols[catalyst], 1.25, true, 0, getRandomInt(1000, 1500));
    StockMarket[catalyst] = catalystStk;
    
    var unitalife = "UnitaLife Group";
    var unitalifeStk = new Stock(unitalife, StockSymbols[unitalife], 0.75, true, 8, getRandomInt(10000, 15000));
    StockMarket[unitalife] = unitalifeStk;
    
    var zeus = "Zeus Medical";
    var zeusStk = new Stock(zeus, StockSymbols[zeus], 0.6, true, 9, getRandomInt(20000, 25000));
    StockMarket[zeus] = zeusStk;
    
    var taiyang = "Taiyang Digital";
    var taiyangStk = new Stock(taiyang, StockSymbols[taiyang], 0.75, true, 12, getRandomInt(25000, 30000));
    StockMarket[taiyang] = taiyangStk;
    
    var microdyne = "Microdyne Technologies";
    var microdyneStk = new Stock(microdyne, StockSymbols[microdyne], 0.75, true, 8, getRandomInt(20000, 25000));
    StockMarket[microdyne] = microdyneStk;
    
    var titanlabs = "Titan Laboratories";
    var titanlabsStk = new Stock(titanlabs, StockSymbols[titanlabs], 0.6, true, 11, getRandomInt(15000, 20000));
    StockMarket[titanlabs] = titanlabsStk;
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

//Returns true if successful, false otherwise
function buyStock(stock, shares) {
    if (stock == null || shares < 0) {
        dialogBoxCreate("Failed to buy stock. This may be a bug, contact developer");
        return false;
    }
    shares = Math.round(shares);
    
    var totalPrice = stock.price * shares;
    if (Player.money < totalPrice + CONSTANTS.StockMarketCommission) {
        dialogBoxCreate("You do not have enough money to purchase this. You need $" + 
                        formatNumber(totalPrice + CONSTANTS.StockMarketCommission, 2).toString() + ".");
        return false;
    }
    
    var origTotal = stock.playerShares * stock.playerAvgPx;
    Player.loseMoney(totalPrice + CONSTANTS.StockMarketCommission);
    var newTotal = origTotal + totalPrice;
    stock.playerShares += shares; 
    stock.playerAvgPx = newTotal / stock.playerShares;
    updateStockPlayerPosition(stock);
    dialogBoxCreate("Bought " + formatNumber(shares, 0) + " shares of " + stock.symbol + " at $" + 
                    formatNumber(stock.price, 2) + " per share. You also paid $" + 
                    formatNumber(CONSTANTS.StockMarketCommission, 2) + " in commission fees.");
    return true;
}


//Returns true if successful and false otherwise
function sellStock(stock, shares) {
    if (stock == null || shares < 0) {
        dialogBoxCreate("Failed to sell stock. This may be a bug, contact developer");
        return false;
    }
    if (shares > stock.playerShares) {shares = stock.playerShares;}
    var gains = stock.price * shares - CONSTANTS.StockMarketCommission;
    Player.gainMoney(gains);
    stock.playerShares -= shares;
    if (stock.playerShares == 0) {
        stock.playerAvgPx = 0;
    }
    updateStockPlayerPosition(stock);
    dialogBoxCreate("Sold " + formatNumber(shares, 0) + " shares of " + stock.symbol + " at $" + 
                    formatNumber(stock.price, 2) + " per share. After commissions, you gained " + 
                    "a total of $" + formatNumber(gains, 2));
    return true;
}

function updateStockPrices() {
    var v = Math.random();
    for (var name in StockMarket) {
        if (StockMarket.hasOwnProperty(name)) {
            var stock = StockMarket[name];
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
            
            var c = Math.random();
            if (c < chc) {
                stock.price *= (1 + av);
                if (Engine.currentPage == Engine.Page.StockMarket) {
                    updateStockTicker(stock, true);
                }
            } else {
                stock.price /= (1 + av);
                if (Engine.currentPage == Engine.Page.StockMarket) {
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

var stockMarketContentCreated = false;
function displayStockMarketContent() {
    if (Player.hasWseAccount == null) {Player.hasWseAccount = false;}
    if (Player.hasTixApiAccess == null) {Player.hasTixApiAccess = false;}
    
    var wseAccountButton = clearEventListeners("stock-market-buy-account");
    wseAccountButton.innerText = "Buy WSE Account - $" + formatNumber(CONSTANTS.WSEAccountCost, 2).toString()
    if (!Player.hasWseAccount && Player.money >= CONSTANTS.WSEAccountCost) {    
        wseAccountButton.setAttribute("class", "a-link-button");
    } else {
        wseAccountButton.setAttribute("class", "a-link-button-inactive");
    }
    wseAccountButton.addEventListener("click", function() {
        Player.hasWseAccount = true;
        initStockMarket();
        Player.loseMoney(CONSTANTS.WSEAccountCost);
        displayStockMarketContent();
        return false;
    });
    
    var stockList = document.getElementById("stock-market-list");
    if (stockList == null) {return;}
    
    if (!Player.hasWseAccount) {
        stockMarketContentCreated = false;
        while (stockList.firstChild) {
            stockList.removeChild(stockList.firstChild);
        }
        return;
    }
    
    if (!stockMarketContentCreated && Player.hasWseAccount) {
        console.log("Creating Stock Market UI");
        document.getElementById("stock-market-commission").innerText =
            "Commission Fees: Every transaction you make has a $" + 
            formatNumber(CONSTANTS.StockMarketCommission, 2) + " commission fee.<br><br>" + 
            "WARNING: When you reset after installing Augmentations, the Stock Market is reset. " + 
            "This means all your positions are lost, so make sure to sell your stocks before installing " + 
            "Augmentations!";
        
        var hdrLi       = document.createElement("li");
        var hdrName     = document.createElement("p");
        var hdrSym      = document.createElement("p");
        var hdrPrice    = document.createElement("p");
        var hdrQty      = document.createElement("p");
        var hdrBuySell  = document.createElement("p")
        var hdrAvgPrice = document.createElement("p");
        var hdrShares   = document.createElement("p");
        var hdrReturn   = document.createElement("p");
        hdrName.style.display = "inline-block";
        hdrName.innerText = "Stock Name";
        hdrName.style.width = "8%";
        hdrSym.style.display = "inline-block";
        hdrSym.innerText = "Symbol";
        hdrSym.style.width = "4%";
        hdrPrice.style.display = "inline-block";
        hdrPrice.innerText = "Price";
        hdrPrice.style.width = "8%";
        hdrQty.style.display = "inline-block";
        hdrQty.innerText = "Quantity";
        hdrQty.style.width = "3%";
        hdrBuySell.style.display = "inline-block";
        hdrBuySell.innerText = "Buy/Sell";
        hdrBuySell.style.width = "5%";
        hdrAvgPrice.style.display = "inline-block";
        hdrAvgPrice.innerText = "Avg price of owned shares";
        hdrAvgPrice.style.width = "7.5%";
        hdrShares.style.display = "inline-block";
        hdrShares.innerText = "Shares owned";
        hdrShares.style.width = "4%";
        hdrReturn.style.display = "inline-block";
        hdrReturn.innerText = "Total Return";
        hdrReturn.style.width = "6%";
        hdrLi.appendChild(hdrName);
        hdrLi.appendChild(hdrSym);
        hdrLi.appendChild(hdrPrice);
        hdrLi.appendChild(hdrQty);
        hdrLi.appendChild(hdrBuySell);
        hdrLi.appendChild(hdrAvgPrice);
        hdrLi.appendChild(hdrShares);
        hdrLi.appendChild(hdrReturn);
        stockList.appendChild(hdrLi);
        
        for (var name in StockMarket) {
            if (StockMarket.hasOwnProperty(name)) {
            (function() {
                var stock = StockMarket[name];
                
                var li          = document.createElement("li");
                var stkName     = document.createElement("p");
                var stkSym      = document.createElement("p");
                var stkPrice    = document.createElement("p");
                var qtyInput    = document.createElement("input");
                var buyButton   = document.createElement("span");
                var sellButton  = document.createElement("span");
                var avgPriceTxt = document.createElement("p");
                var sharesTxt   = document.createElement("p");
                var returnTxt   = document.createElement("p");
                
                var tickerId = "stock-market-ticker-" + stock.symbol;
                stkName.setAttribute("id", tickerId + "-name");
                stkSym.setAttribute("id", tickerId + "-sym");
                stkPrice.setAttribute("id", tickerId + "-price");
                stkName.style.display = "inline-block";
                stkName.style.width = "8%";
                stkSym.style.display = "inline-block";
                stkSym.style.width = "4%";
                stkPrice.style.display = "inline-block";
                stkPrice.style.width = "9%";
                
                li.setAttribute("display", "inline-block");
                
                qtyInput.setAttribute("type", "text");
                qtyInput.setAttribute("id", tickerId + "-qty-input");
                qtyInput.setAttribute("class", "stock-market-qty-input");
                qtyInput.setAttribute("onkeypress", 'return event.charCode >= 48 && event.charCode <= 57');
                qtyInput.style.width = "3%";
                qtyInput.style.display = "inline-block";
                
                buyButton.innerHTML = "Buy";
                buyButton.setAttribute("class", "stock-market-buy-sell-button");
                buyButton.style.width = "3%";
                buyButton.style.display = "inline-block";
                buyButton.addEventListener("click", function() {
                    var shares = document.getElementById(tickerId + "-qty-input").value;
                    shares = Number(shares);
                    if (isNaN(shares)) {return false;}
                    buyStock(stock, shares);
                });
                sellButton.innerHTML = "Sell";
                sellButton.setAttribute("class", "stock-market-buy-sell-button");
                sellButton.style.width = "3%";
                sellButton.style.display = "inline-block";
                sellButton.addEventListener("click", function() {
                    var shares = document.getElementById(tickerId + "-qty-input").value;
                    shares = Number(shares);
                    if (isNaN(shares)) {return false;}
                    sellStock(stock, shares);
                });
                
                avgPriceTxt.setAttribute("id", tickerId + "-avgprice");
                avgPriceTxt.style.display = "inline-block";
                avgPriceTxt.style.width = "8%";
                avgPriceTxt.style.color = "white";
                sharesTxt.setAttribute("id", tickerId + "-shares");
                sharesTxt.style.display = "inline-block";
                sharesTxt.style.width = "4%";
                sharesTxt.style.color = "white";
                returnTxt.setAttribute("id", tickerId + "-return");
                returnTxt.style.display = "inline-block";
                returnTxt.style.width = "6%";
                returnTxt.style.color = "white";
                
                li.appendChild(stkName);
                li.appendChild(stkSym);
                li.appendChild(stkPrice);
                li.appendChild(qtyInput);
                li.appendChild(buyButton);
                li.appendChild(sellButton);
                li.appendChild(avgPriceTxt);
                li.appendChild(sharesTxt);
                li.appendChild(returnTxt);
                stockList.appendChild(li);
                
                updateStockTicker(stock, true);
                updateStockPlayerPosition(stock);
            }()); //Immediate invocation
            }//End if
            
        }
        stockMarketContentCreated = true;
    }
}

//'increase' argument is a boolean indicating whether the price increased or decreased
function updateStockTicker(stock, increase) {
    var tickerId = "stock-market-ticker-" + stock.symbol;
    stkName = document.getElementById(tickerId + "-name");
    stkSym = document.getElementById(tickerId + "-sym");
    stkPrice = document.getElementById(tickerId + "-price");
    
    if (stkName == null || stkSym == null || stkPrice == null) {
        console.log("ERROR, couldn't find elements with tickerId " + tickerId);
        return;
    }
    stkName.innerText = stock.name;
    stkSym.innerText = stock.symbol;
    stkPrice.innerText = "$" + formatNumber(stock.price, 2).toString();
    
    var returnTxt = document.getElementById(tickerId + "-return");
    var totalCost = stock.playerShares * stock.playerAvgPx;
    var gains = (stock.price - stock.playerAvgPx) * stock.playerShares;
    var percentageGains = gains / totalCost;
    if (totalCost > 0) {
        returnTxt.innerText = "$" + formatNumber(gains, 2) + " (" + 
                              formatNumber(percentageGains * 100, 2) + "%)";
    } else {
        returnTxt.innerText = "N/A";
    }
    
    
    if (increase) {
        stkName.style.color = "#66ff33";
        stkSym.style.color = "#66ff33";
        stkPrice.style.color = "#66ff33";
    } else {
        stkName.style.color = "red";
        stkSym.style.color = "red";
        stkPrice.style.color = "red";
    }
}

function updateStockPlayerPosition(stock) {
    var tickerId = "stock-market-ticker-" + stock.symbol;
    var avgPriceTxt = document.getElementById(tickerId + "-avgprice");
    var sharesTxt = document.getElementById(tickerId + "-shares");
    if (avgPriceTxt == null || sharesTxt == null) {
        dialogBoxCreate("Could not find element for player positions for stock " + 
                        stock.symbol + ". This is a bug please contact developer");
        return;
    }
    avgPriceTxt.innerText = "$" + formatNumber(stock.playerAvgPx, 2);
    sharesTxt.innerText = stock.playerShares.toString();
}