import { IMap } from "../types";

// Corporation Unlock Upgrades
// Upgrades for entire corporation, unlocks features, either you have it or you dont
// The data structure is an array with the following format:
//  [index in Corporation feature upgrades array, price, name, description]
export const CorporationUnlockUpgrades: IMap<any[]> = {
    //Lets you export goods
    "0":  [0, 20e9, "Export",
                    "Develop infrastructure to export your materials to your other facilities. " +
                    "This allows you to move materials around between different divisions and cities."],

    //Lets you buy exactly however many required materials you need for production
    "1":  [1, 50e9, "Smart Supply", "Use advanced AI to anticipate your supply needs. " +
                     "This allows you to purchase exactly however many materials you need for production."],

    //Displays each material/product's demand
    "2":  [2, 5e9, "Market Research - Demand",
                    "Mine and analyze market data to determine the demand of all resources. " +
                    "The demand attribute, which affects sales, will be displayed for every material and product."],

    //Display's each material/product's competition
    "3":  [3, 5e9, "Market Data - Competition",
                    "Mine and analyze market data to determine how much competition there is on the market " +
                    "for all resources. The competition attribute, which affects sales, will be displayed for " +
                    "for every material and product."],
    "4":  [4, 10e9, "VeChain",
                    "Use AI and blockchain technology to identify where you can improve your supply chain systems. " +
                    "This upgrade will allow you to view a wide array of useful statistics about your " +
                    "Corporation."]
}
