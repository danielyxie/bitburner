export const libSource = `interface NS {
    args: string[];
    /**
     * Example documentation for scan.
     * Example documentation for scan.
     * Example documentation for scan.
     * Example documentation for scan.
     * Example documentation for scan.
     * Example documentation for scan.
     * Example documentation for scan.
     * Example documentation for scan.
     * Example documentation for scan.
     */
    scan(ip: string, hostnames: boolean): string[];
    hack(ip: string, threads: number, stock: boolean): Promise<string>;
    hackAnalyzeThreads(ip: string, hackAmount: number): number;
    hackAnalyzePercent(ip: string): number;
    hackChance(ip: string): number;
    sleep(time: number): Promise<void>;
    grow(ip: string, threads: number, stock: boolean): Promise<string>;
    growthAnalyze(ip: string, growth: number): number;
    weaken(ip: string, threads: boolean): Promise<string>;
    print(...args: any[]): void;
    tprint(...args: any[]): void;
    clearLog(): void;
    disableLog(fn: string): void;
    enableLog(fn: string): void;
    isLogEnabled(fn: string): boolean;
    getScriptLogs(fn: string, ip: string, ...scriptArgs: any[]): string[];
    tail(fn: string, ip: string, ...scriptArgs: any[]): void;
    nuke(ip: string): boolean;
    brutessh(ip: string): boolean;
    ftpcrack(ip: string): boolean;
    relaysmtp(ip: string): boolean;
    httpworm(ip: string): boolean;
    sqlinject(ip: string): boolean;
    run(scriptname: string, threads: number): number;
    exec(scriptname: string, ip: string, threads: number): number;
    spawn(scriptname: string, threads: number): void;
    kill(filename: string, ip: string, ...scriptArgs: any[]): boolean;
    killall(ip: string): boolean;
    exit(): void;
    scp(scriptname: string, ip1: string, ip2: string): boolean;
    ls(ip: string, grep: string): string[];
    ps(ip: string): {filename: string, threads: number, args: string[], pid: number}[];
    hasRootAccess(ip: string): boolean;
    getIp(): string;
    getHostname(): string;
    getHackingLevel(): number;
    getHackingMultipliers(): number;
    getHacknetMultipliers(): number;
    getBitNodeMultipliers(): number;
    getServer(ip: string): any;
    getServerMoneyAvailable(ip: string): number;
    getServerSecurityLevel(ip: string): number;
    getServerBaseSecurityLevel(ip: string): number;
    getServerMinSecurityLevel(ip: string): number;
    getServerRequiredHackingLevel(ip: string): number;
    getServerMaxMoney(ip: string): number;
    getServerGrowth(ip: string): number;
    getServerNumPortsRequired(ip: string): number;
    getServerRam(ip: string): number[];
    getServerMaxRam(ip: string): number;
    getServerUsedRam(ip: string): number;
    serverExists(ip: string): boolean;
    fileExists(filename: string, ip: string): boolean;
    isRunning(fn: string, ip: string, ...scriptArgs: any[]): boolean;
    getStockSymbols(): string[];
    getStockPrice(symbol: string): number;
    getStockAskPrice(symbol: string): number;
    getStockBidPrice(symbol: string): number;
    getStockPosition(symbol: string): number;
    getStockMaxShares(symbol: string): number;
    getStockPurchaseCost(symbol: string, shares: number, posType: string): number;
    getStockSaleGain(symbol: string, shares: number, posType: string): number;
    buyStock(symbol: string, shares: number): number;
    sellStock(symbol: string, shares: number): number;
    shortStock(symbol: string, shares: number): number;
    sellShort(symbol: string, shares: number): number;
    placeOrder(symbol: string, shares: number, price: number, type: string, pos: string): boolean;
    cancelOrder(symbol: string, shares: number, price: number, type: string, pos: string): boolean;
    getOrders(): any;
    getStockVolatility(symbol: string): number;
    getStockForecast(symbol: string): number;
    getPurchasedServerLimit(): number;
    getPurchasedServerMaxRam(): number;
    getPurchasedServerCost(ram: number): number;
    purchaseServer(hostname: string, ram: number): string;
    deleteServer(hostname: string): boolean;
    getPurchasedServers(hostname: string): string[];
    write(port: number, data: string, mode: string): boolean;
    tryWrite(port: number, data: string): boolean;
    read(port: number): any;
    peek(port: number): any;
    clear(port: number): number;
    getPortHandle(port: number): any; // netscript port
    rm(fn: string, ip: string): boolean;
    scriptRunning(scriptname: string, ip: string): boolean;
    scriptKill(scriptname: string, ip: string): boolean;
    getScriptName(): string;
    getScriptRam(scriptname: string, ip: string): number;
    getRunningScript(fn: string, ip: string): any; // running script
    getHackTime(ip: string): number;
    getGrowTime(ip: string): number;
    getWeakenTime(ip: string): number;
    getScriptIncome(scriptname: string, ip: string): number;
    getScriptExpGain(scriptname: string, ip: string): number;
    nFormat(n: number, format: string): string;
    tFormat(milliseconds: number, milliPrecision: boolean): string;
    getTimeSinceLastAug(): number;
    prompt(txt: string): Promise<boolean>;
    getFavorToDonate(): number;
    universityCourse(universityName: string, className: string): boolean;
    gymWorkout(gymName: string, stat: string): boolean;
    travelToCity(cityname: string): boolean;
    purchaseTor(): boolean;
    purchaseProgram(programName: string): boolean;
    getCurrentServer(): any; // server object
    connect(hostname: string): boolean;
    manualHack(): Promise<string>;
    installBackdoor(): Promise<void>;
    getStats(): any; // complex type
    getCharacterInformation(): any; // complex type
    getPlayer(): any; // complex type
    hospitalize(): number;
    isBusy(): boolean;
    stopAction(): boolean;
    upgradeHomeRam(): number;
    getUpgradeHomeRamCost(): number;
    workForCompany(companyName: string): boolean;
    applyToCompany(companyName: string, field: string): boolean;
    getCompanyRep(companyName: string): number;
    getCompanyFavor(companyName: string): number;
    getCompanyFavorGain(companyName: string): number;
    checkFactionInvitations(): string[];
    joinFaction(name: string): boolean;
    workForFaction(name: string, type: string): boolean;
    getFactionRep(name: string): number;
    getFactionFavor(name: string): number;
    getFactionFavorGain(name: string): number;
    donateToFaction(name: string, amt: number): boolean;
    createProgram(name: string): boolean;
    commitCrime(crimeRoughName: string): number;
    getCrimeChance(crimeRoughName: string): boolean;
    getCrimeStats(crimeRoughName: string): any; // complex type
    getOwnedAugmentations(purchased: boolean): string[];
    getOwnedSourceFiles(): any; // complex type
    getAugmentationsFromFaction(facname: string): string[];
    getAugmentationCost(name: string): number;
    getAugmentationPrereq(name: string): string[];
    getAugmentationPrice(name: string): number;
    getAugmentationRepReq(name: string): number;
    getAugmentationStats(name: string): any; // complex type
    purchaseAugmentation(faction: string, name: string): boolean;
    softReset(cbScript: string): void;
    installAugmentations(cbScript: string): void;
    exploit(): void;
    bypass(doc: any): void;
    flags(data: any): any;
}`;
