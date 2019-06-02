import { IMap } from "../../types";

// Corporation Upgrades
// Upgrades for entire corporation, levelable upgrades
// The data structure is an array with the following format
//  [index in Corporation upgrades array, base price, price mult, benefit mult (additive), name, desc]
export const CorporationUpgrades: IMap<any[]> = {
    //Smart factories, increases production
    "0":    [0, 2e9, 1.06, 0.03,
            "Smart Factories", "Advanced AI automatically optimizes the operation and productivity " +
            "of factories. Each level of this upgrade increases your global production by 3% (additive)."],

    //Smart warehouses, increases storage size
    "1":    [1, 2e9, 1.06, .1,
             "Smart Storage", "Advanced AI automatically optimizes your warehouse storage methods. " +
             "Each level of this upgrade increases your global warehouse storage size by 10% (additive)."],

    //Advertise through dreams, passive popularity/ awareness gain
    "2":    [2, 4e9, 1.1, .001,
            "DreamSense", "Use DreamSense LCC Technologies to advertise your corporation " +
            "to consumers through their dreams. Each level of this upgrade provides a passive " +
            "increase in awareness of all of your companies (divisions) by 0.004 / market cycle," +
            "and in popularity by 0.001 / market cycle. A market cycle is approximately " +
            "15 seconds."],

    //Makes advertising more effective
    "3":    [3, 4e9, 1.12, 0.005,
            "Wilson Analytics", "Purchase data and analysis from Wilson, a marketing research " +
            "firm. Each level of this upgrades increases the effectiveness of your " +
            "advertising by 0.5% (additive)."],

    //Augmentation for employees, increases cre
    "4":    [4, 1e9, 1.06, 0.1,
            "Nuoptimal Nootropic Injector Implants", "Purchase the Nuoptimal Nootropic " +
            "Injector augmentation for your employees. Each level of this upgrade " +
            "globally increases the creativity of your employees by 10% (additive)."],

    //Augmentation for employees, increases cha
    "5":    [5, 1e9, 1.06, 0.1,
            "Speech Processor Implants", "Purchase the Speech Processor augmentation for your employees. " +
            "Each level of this upgrade globally increases the charisma of your employees by 10% (additive)."],

    //Augmentation for employees, increases int
    "6":    [6, 1e9, 1.06, 0.1,
            "Neural Accelerators", "Purchase the Neural Accelerator augmentation for your employees. " +
            "Each level of this upgrade globally increases the intelligence of your employees " +
            "by 10% (additive)."],

    //Augmentation for employees, increases eff
    "7":    [7, 1e9, 1.06, 0.1,
            "FocusWires", "Purchase the FocusWire augmentation for your employees. Each level " +
            "of this upgrade globally increases the efficiency of your employees by 10% (additive)."],

    //Improves sales of materials/products
    "8":    [8, 1e9, 1.07, 0.01,
            "ABC SalesBots", "Always Be Closing. Purchase these robotic salesmen to increase the amount of " +
            "materials and products you sell. Each level of this upgrade globally increases your sales " +
            "by 1% (additive)."],

    //Improves scientific research rate
    "9":    [9, 5e9, 1.07, 0.05,
            "Project Insight", "Purchase 'Project Insight', a R&D service provided by the secretive " +
            "Fulcrum Technologies. Each level of this upgrade globally increases the amount of " +
            "Scientific Research you produce by 5% (additive)."],
}
