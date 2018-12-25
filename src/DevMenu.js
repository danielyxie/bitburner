import { AugmentationNames }        from "./Augmentations";
import { generateRandomContract }   from "./CodingContractGenerator";
import { Programs }                 from "./Programs/Programs";
import { Factions }                 from "./Faction/Factions";
import { Player }                   from "./Player";
import { AllServers }               from "./Server";
import { hackWorldDaemon }          from "./RedPill";
import { StockMarket,
         SymbolToStockMap }         from "./StockMarket";
import { Stock }                    from "./Stock";
import { Terminal }                 from "./Terminal";
import { numeralWrapper }           from "./ui/numeralFormat";
import { dialogBoxCreate }          from "../utils/DialogBox";
import { exceptionAlert }           from "../utils/helpers/exceptionAlert";
import { createElement }            from "../utils/uiHelpers/createElement";
import { removeElementById }        from "../utils/uiHelpers/removeElementById";

const devMenuContainerId = "dev-menu-container";

export function createDevMenu() {
    if (process.env.NODE_ENV !== "development") {
        throw new Error("Cannot create Dev Menu because you are not in a dev build");
    }

    const devMenuText = createElement("h1", {
        display: "block",
        innerText: "Development Menu - Only meant to be used for testing/debugging",
    });

    // Generic
    const genericHeader = createElement("h2", {
        display: "block",
        innerText: "Generic"
    });

    const addMoney = createElement("button", {
        class: "std-button",
        clickListener: () => {
            Player.gainMoney(1e15);
        },
        display: "block",
        innerText: "Add $1000t",
    });

    const addRam = createElement("button", {
        class: "std-button",
        clickListener: () => {
            Player.getHomeComputer().maxRam *= 2;
        },
        display: "block",
        innerText: "Double Home Computer RAM",
    });

    const triggerBitflume = createElement("button", {
        class: "std-button",
        clickListener: () => {
            hackWorldDaemon(Player.bitNodeN, true);
        },
        innerText: "Trigger BitFlume",
    });

    const destroyCurrentBitnode = createElement("button", {
        class: "std-button",
        clickListener: () => {
            hackWorldDaemon(Player.bitNodeN);
        },
        innerText: "Destroy Current BitNode",
        tooltip: "Will grant Source-File for the BitNode",
    });

    // Experience / stats
    const statsHeader = createElement("h2", {
        display: "block",
        innerText: "Experience/Stats"
    });

    const statsHackingExpInput = createElement("input", {
        class: "text-input",
        margin: "5px",
        placeholder: "+/- hacking exp",
        type: "number",
    });
    const statsHackingExpButton = createElement("button", {
        class: "std-button",
        clickListener: () => {
            const exp = parseInt(statsHackingExpInput.value);
            Player.gainHackingExp(exp);
            Player.updateSkillLevels();
        },
        innerText: "Add Hacking Exp",
    });

    const statsStrengthExpInput = createElement("input", {
        class: "text-input",
        margin: "5px",
        placeholder: "+/- strength exp",
        type: "number",
    });
    const statsStrengthExpButton = createElement("button", {
        class: "std-button",
        clickListener: () => {
            const exp = parseInt(statsStrengthExpInput.value);
            Player.gainStrengthExp(exp);
            Player.updateSkillLevels();
        },
        innerText: "Add Strength Exp",
    });

    const statsDefenseExpInput = createElement("input", {
        class: "text-input",
        margin: "5px",
        placeholder: "+/- defense exp",
        type: "number",
    });
    const statsDefenseExpButton = createElement("button", {
        class: "std-button",
        clickListener: () => {
            const exp = parseInt(statsDefenseExpInput.value);
            Player.gainDefenseExp(exp);
            Player.updateSkillLevels();
        },
        innerText: "Add Defense Exp",
    });

    const statsDexterityExpInput = createElement("input", {
        class: "text-input",
        margin: "5px",
        placeholder: "+/- dexterity exp",
        type: "number",
    });
    const statsDexterityExpButton = createElement("button", {
        class: "std-button",
        clickListener: () => {
            const exp = parseInt(statsDexterityExpInput.value);
            Player.gainDexterityExp(exp);
            Player.updateSkillLevels();
        },
        innerText: "Add Dexterity Exp",
    });

    const statsAgilityExpInput = createElement("input", {
        class: "text-input",
        margin: "5px",
        placeholder: "+/- agility exp",
        type: "number",
    });
    const statsAgilityExpButton = createElement("button", {
        class: "std-button",
        clickListener: () => {
            const exp = parseInt(statsAgilityExpInput.value);
            Player.gainAgilityExp(exp);
            Player.updateSkillLevels();
        },
        innerText: "Add Agility Exp",
    });

    const statsCharismaExpInput = createElement("input", {
        class: "text-input",
        margin: "5px",
        placeholder: "+/- charisma exp",
        type: "number",
    });
    const statsCharismaExpButton = createElement("button", {
        class: "std-button",
        clickListener: () => {
            const exp = parseInt(statsCharismaExpInput.value);
            Player.gainCharismaExp(exp);
            Player.updateSkillLevels();
        },
        innerText: "Add Charisma Exp",
    });

    const statsIntelligenceExpInput = createElement("input", {
        class: "text-input",
        margin: "5px",
        placeholder: "+/- intelligence exp",
        type: "number",
    });
    const statsIntelligenceExpButton = createElement("button", {
        class: "std-button",
        clickListener: () => {
            const exp = parseInt(statsIntelligenceExpInput.value);
            Player.gainIntelligenceExp(exp);
            Player.updateSkillLevels();
        },
        innerText: "Add Intelligence Exp",
    });

    const statsEnableIntelligenceButton = createElement("button", {
        class: "std-button",
        clickListener: () => {
            Player.intelligence = 1;
        },
        innerText: "Enable Intelligence"
    });

    const statsDisableIntelligenceButton = createElement("button", {
        class: "std-button",
        clickListener: () => {
            Player.intelligence = 0;
        },
        innerText: "Disable Intelligence"
    });

    // Factions
    const factionsHeader = createElement("h2", {innerText: "Factions"});

    const factionsDropdown = createElement("select", {
        class: "dropdown",
        margin: "5px",
    });
    for (const i in Factions) {
        factionsDropdown.options[factionsDropdown.options.length] = new Option(Factions[i].name, Factions[i].name);
    }

    const factionsAddButton = createElement("button", {
        class: "std-button",
        clickListener: () => {
            const facName = factionsDropdown.options[factionsDropdown.selectedIndex].value;
            Player.receiveInvite(facName);
        },
        innerText: "Receive Invite to Faction",
    });

    // Augmentations / Source Files
    const augmentationsHeader = createElement("h2", {innerText: "Augmentations"});

    const augmentationsDropdown = createElement("select", {
        class: "dropdown",
        margin: "5px",
    });
    for (const i in AugmentationNames) {
        const augName = AugmentationNames[i];
        augmentationsDropdown.options[augmentationsDropdown.options.length] = new Option(augName, augName);
    }

    const augmentationsQueueButton = createElement("button", {
        class: "std-button",
        clickListener: () => {
            Player.queueAugmentation(augmentationsDropdown.options[augmentationsDropdown.selectedIndex].value);
        },
        innerText: "Queue Augmentation",
    })

    // Programs
    const programsHeader = createElement("h2", {innerText: "Programs"});

    const programsAddDropdown = createElement("select", {
        class: "dropdown",
        margin: "5px",
    });
    for (const i in Programs) {
        const progName = Programs[i].name;
        programsAddDropdown.options[programsAddDropdown.options.length] = new Option(progName, progName);
    }

    const programsAddButton = createElement("button", {
        class: "std-button",
        clickListener: () => {
            const program = programsAddDropdown.options[programsAddDropdown.selectedIndex].value;
            if(!Player.hasProgram(program)) {
                Player.getHomeComputer().programs.push(program);
            }
        },
        innerText: "Add Program",
    })

    // Servers
    const serversHeader = createElement("h2", {innerText: "Servers"});

    const serversOpenAll = createElement("button", {
        class: "std-button",
        clickListener: () => {
            for (const i in AllServers) {
                AllServers[i].hasAdminRights = true;
                AllServers[i].sshPortOpen    = true;
                AllServers[i].ftpPortOpen    = true;
                AllServers[i].smtpPortOpen   = true;
                AllServers[i].httpPortOpen   = true;
                AllServers[i].sqlPortOpen    = true;
                AllServers[i].openPortCount  = 5;
            }
        },
        display: "block",
        innerText: "Get Admin Rights to all servers",
    });

    const serversMinSecurityAll = createElement("button", {
        class: "std-button",
        clickListener: () => {
            for (const i in AllServers) {
                AllServers[i].hackDifficulty = AllServers[i].minDifficulty;
            }
        },
        display: "block",
        innerText: "Set all servers to min security",
    });

    const serversMaxMoneyAll = createElement("button", {
        class: "std-button",
        clickListener: () => {
            for (const i in AllServers) {
                AllServers[i].moneyAvailable = AllServers[i].moneyMax;
            }
        },
        display: "block",
        innerText: "Set all servers to max money",
    });

    const serversConnectToDropdown = createElement("select", {class: "dropdown"});
    for (const i in AllServers) {
        const hn = AllServers[i].hostname;
        serversConnectToDropdown.options[serversConnectToDropdown.options.length] = new Option(hn, hn);
    }

    const serversConnectToButton = createElement("button", {
        class: "std-button",
        clickListener: () => {
            const host = serversConnectToDropdown.options[serversConnectToDropdown.selectedIndex].value;
            Terminal.connectToServer(host);
        },
        innerText: "Connect to server",
    });

    // Bladeburner
    const bladeburnerHeader = createElement("h2", {innerText: "Bladeburner"});

    const bladeburnerGainRankInput = createElement("input", {
        class: "text-input",
        margin: "5px",
        placeholder: "Rank to gain (or negative to lose rank)",
        type: "number",
    });

    const bladeburnerGainRankButton = createElement("button", {
        class: "std-button",
        clickListener: () => {
            try {
                const rank = parseInt(bladeburnerGainRankInput.value);
                Player.bladeburner.changeRank(rank);
            } catch(e) {
                exceptionAlert(`Failed to change Bladeburner Rank in dev menu: ${e}`);
            }
        },
        innerText: "Gain Bladeburner Rank",
    });

    const bladeburnerStoredCyclesInput = createElement("input", {
        class: "text-input",
        margin: "5px",
        placeholder: "# Cycles to Add",
        type: "number",
    });

    const bladeburnerStoredCyclesButton = createElement("button", {
        class: "std-button",
        clickListener: () => {
            try {
                const cycles = parseInt(bladeburnerStoredCyclesInput.value);
                Player.bladeburner.storedCycles += cycles;
            } catch(e) {
                exceptionAlert(`Failed to add cycles to Bladeburner in dev menu: ${e}`);
            }
        },
        innerText: "Add Cycles to Bladeburner mechanic",
    });

    // Gang
    const gangHeader = createElement("h2", {innerText: "Gang"});

    const gangStoredCyclesInput = createElement("input", {
        class: "text-input",
        margin: "5px",
        placeholder: "# Cycles to add",
        type: "number",
    });

    const gangAddStoredCycles = createElement("button", {
        class: "std-button",
        clickListener: () => {
            try {
                const cycles = parseInt(gangStoredCyclesInput.value);
                Player.gang.storedCycles += cycles;
            } catch(e) {
                exceptionAlert(`Failed to add stored cycles to gang mechanic: ${e}`);
            }
        },
        innerText: "Add cycles to Gang mechanic",
    });

    // Coding Contracts
    const contractsHeader = createElement("h2", {innerText: "Coding Contracts"});

    const generateRandomContractBtn = createElement("button", {
        class: "std-button",
        clickListener: () => {
            generateRandomContract();
        },
        innerText: "Generate Random Contract",
    });

    // Stock Market
    const stockmarketHeader = createElement("h2", {innerText: "Stock Market"});

    const stockInput = createElement("input", {
        class: "text-input",
        display: "block",
        placeholder: "Stock symbol(s), or 'all'",
    });

    function processStocks(cb) {
        const input = stockInput.value.toString().replace(/\s/g, '');

        // Empty input, or "all", will process all stocks
        if (input === "" || input.toLowerCase() === "all") {
            for (const name in StockMarket) {
                if (StockMarket.hasOwnProperty(name)) {
                    const stock = StockMarket[name];
                    if (stock instanceof Stock) {
                        cb(stock);
                    }
                }
            }
            return;
        }

        const stockSymbols = input.split(",");
        for (let i = 0; i < stockSymbols.length; ++i) {
            const stock = SymbolToStockMap[stockSymbols];
            if (stock instanceof Stock) {
                cb(stock);
            }
        }
    }

    const stockPriceChangeInput = createElement("input", {
        class: "text-input",
        margin: "5px",
        placeholder: "Price to change stock(s) to",
        type: "number",
    });

    const stockPriceChangeBtn = createElement("button", {
        class: "std-button",
        clickListener: () => {
            const price = parseInt(stockPriceChangeInput.value);
            if (isNaN(price)) { return; }

            processStocks((stock) => {
                stock.price = price;
            });
            dialogBoxCreate(`Stock Prices changed to ${price}`);
        },
        innerText: "Change Stock Price(s)",
    });

    const stockViewPriceCapBtn = createElement("button", {
        class: "std-button",
        clickListener: () => {
            let text = "";
            processStocks((stock) => {
                text += `${stock.symbol}: ${numeralWrapper.format(stock.cap, '$0.000a')}<br>`;
            });
            dialogBoxCreate(text);
        },
        innerText: "View Stock Price Caps",
    });

    // Add everything to container, then append to main menu
    const devMenuContainer = createElement("div", {
        class: "generic-menupage-container",
        id: devMenuContainerId,
    });

    devMenuContainer.appendChild(devMenuText);
    devMenuContainer.appendChild(genericHeader);
    devMenuContainer.appendChild(addMoney);
    devMenuContainer.appendChild(addRam);
    devMenuContainer.appendChild(triggerBitflume);
    devMenuContainer.appendChild(destroyCurrentBitnode);
    devMenuContainer.appendChild(statsHeader);
    devMenuContainer.appendChild(statsHackingExpInput);
    devMenuContainer.appendChild(statsHackingExpButton);
    devMenuContainer.appendChild(createElement("br"));
    devMenuContainer.appendChild(statsStrengthExpInput);
    devMenuContainer.appendChild(statsStrengthExpButton);
    devMenuContainer.appendChild(createElement("br"));
    devMenuContainer.appendChild(statsDefenseExpInput);
    devMenuContainer.appendChild(statsDefenseExpButton);
    devMenuContainer.appendChild(createElement("br"));
    devMenuContainer.appendChild(statsDexterityExpInput);
    devMenuContainer.appendChild(statsDexterityExpButton);
    devMenuContainer.appendChild(createElement("br"));
    devMenuContainer.appendChild(statsAgilityExpInput);
    devMenuContainer.appendChild(statsAgilityExpButton);
    devMenuContainer.appendChild(createElement("br"));
    devMenuContainer.appendChild(statsCharismaExpInput);
    devMenuContainer.appendChild(statsCharismaExpButton);
    devMenuContainer.appendChild(createElement("br"));
    devMenuContainer.appendChild(statsIntelligenceExpInput);
    devMenuContainer.appendChild(statsIntelligenceExpButton);
    devMenuContainer.appendChild(createElement("br"));
    devMenuContainer.appendChild(statsEnableIntelligenceButton);
    devMenuContainer.appendChild(statsDisableIntelligenceButton);
    devMenuContainer.appendChild(factionsHeader);
    devMenuContainer.appendChild(factionsDropdown);
    devMenuContainer.appendChild(factionsAddButton);
    devMenuContainer.appendChild(augmentationsHeader);
    devMenuContainer.appendChild(augmentationsDropdown);
    devMenuContainer.appendChild(augmentationsQueueButton);
    devMenuContainer.appendChild(programsHeader);
    devMenuContainer.appendChild(programsAddDropdown);
    devMenuContainer.appendChild(programsAddButton);
    devMenuContainer.appendChild(serversHeader);
    devMenuContainer.appendChild(serversOpenAll);
    devMenuContainer.appendChild(serversMinSecurityAll);
    devMenuContainer.appendChild(serversMaxMoneyAll);
    devMenuContainer.appendChild(serversConnectToDropdown);
    devMenuContainer.appendChild(serversConnectToButton);
    devMenuContainer.appendChild(bladeburnerHeader);
    devMenuContainer.appendChild(bladeburnerGainRankInput);
    devMenuContainer.appendChild(bladeburnerGainRankButton);
    devMenuContainer.appendChild(createElement("br"));
    devMenuContainer.appendChild(bladeburnerStoredCyclesInput);
    devMenuContainer.appendChild(bladeburnerStoredCyclesButton);
    devMenuContainer.appendChild(createElement("br"));
    devMenuContainer.appendChild(gangHeader);
    devMenuContainer.appendChild(gangStoredCyclesInput);
    devMenuContainer.appendChild(gangAddStoredCycles);
    devMenuContainer.appendChild(createElement("br"));
    devMenuContainer.appendChild(contractsHeader);
    devMenuContainer.appendChild(generateRandomContractBtn);
    devMenuContainer.appendChild(stockmarketHeader);
    devMenuContainer.appendChild(stockInput);
    devMenuContainer.appendChild(stockPriceChangeInput);
    devMenuContainer.appendChild(stockPriceChangeBtn);
    devMenuContainer.appendChild(createElement("br"));
    devMenuContainer.appendChild(stockViewPriceCapBtn);

   const entireGameContainer = document.getElementById("entire-game-container");
   if (entireGameContainer == null) {
       throw new Error("Could not find entire-game-container DOM element");
   }
   entireGameContainer.appendChild(devMenuContainer);
}

export function closeDevMenu() {
    removeElementById(devMenuContainerId);
}
