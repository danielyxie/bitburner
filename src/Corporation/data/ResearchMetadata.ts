import { IConstructorParams } from "../Research";

export const researchMetadata: IConstructorParams[] = [
  {
    name: "AutoBrew",
    cost: 12e3,
    desc:
      "Automatically keep your employees fully caffeinated with " +
      "coffee injections. This research will keep the energy of all " +
      "employees at its maximum possible value, for no cost. " +
      "This will also disable the Coffee upgrade.",
  },
  {
    name: "AutoPartyManager",
    cost: 15e3,
    desc:
      "Automatically analyzes your employees' happiness and morale " +
      "and boosts them whenever it detects a decrease. This research will " +
      "keep the morale and happiness of all employees at their maximum possible " +
      "values, for no cost. " +
      "This will also disable the 'Throw Party' feature.",
  },
  {
    name: "Automatic Drug Administration",
    cost: 10e3,
    desc:
      "Research how to automatically administer performance-enhacing drugs to all of " +
      "your employees. This unlocks Drug-related Research.",
  },
  {
    name: "Bulk Purchasing",
    cost: 5e3,
    desc:
      "Research the art of buying materials in bulk. This allows you to purchase " +
      "any amount of a material instantly.",
  },
  {
    name: "CPH4 Injections",
    cost: 25e3,
    desc:
      "Develop an advanced and harmless synthetic drug that is administered to " +
      "employees to increase all of their stats, except experience, by 10%.",
    employeeCreMult: 1.1,
    employeeChaMult: 1.1,
    employeeEffMult: 1.1,
    employeeIntMult: 1.1,
  },
  {
    name: "Drones",
    cost: 5e3,
    desc:
      "Acquire the knowledge needed to create advanced drones. This research does nothing " +
      "by itself, but unlocks other Drone-related research.",
  },
  {
    name: "Drones - Assembly",
    cost: 25e3,
    desc:
      "Manufacture and use Assembly Drones to improve the efficiency of " +
      "your production lines. This increases all production by 20%.",
    productionMult: 1.2,
  },
  {
    name: "Drones - Transport",
    cost: 30e3,
    desc:
      "Manufacture and use intelligent Transport Drones to optimize " +
      "your warehouses. This increases the storage space of all warehouses " +
      "by 50%.",
    storageMult: 1.5,
  },
  {
    name: "Go-Juice",
    cost: 25e3,
    desc:
      "Provide employees with Go-Juice, a coffee-derivative that further enhances " +
      "the brain's dopamine production. This increases the maximum energy of all " +
      "employees by 10.",
  },
  {
    name: "Hi-Tech R&D Laboratory",
    cost: 5e3,
    desc:
      "Construct a cutting edge facility dedicated to advanced research and " +
      "and development. This allows you to spend Scientific Research " +
      "on powerful upgrades. It also globally increases Scientific Research " +
      "production by 10%.",
    sciResearchMult: 1.1,
  },
  {
    name: "HRBuddy-Recruitment",
    cost: 15e3,
    desc:
      "Use automated software to handle the hiring of employees. With this " +
      "research, each office will automatically hire one employee per " +
      "market cycle if there is available space.",
  },
  {
    name: "HRBuddy-Training",
    cost: 20e3,
    desc:
      "Use automated software to handle the training of employees. With this " +
      "research, each employee hired with HRBuddy-Recruitment will automatically " +
      "be assigned to 'Training', rather than being unassigned.",
  },
  {
    name: "JoyWire",
    cost: 20e3,
    desc: "A brain implant which is installed in employees, increasing their maximum happiness by 10.",
  },
  {
    name: "Market-TA.I",
    cost: 20e3,
    desc:
      "Develop advanced AI software that uses technical analysis to " +
      "help you understand and exploit the market. This research " +
      "allows you to know what price to sell your Materials/Products " +
      "at in order to avoid losing sales due to having too high of a mark-up. " +
      "It also lets you automatically use that sale price.",
  },
  {
    name: "Market-TA.II",
    cost: 50e3,
    desc:
      "Develop double-advanced AI software that uses technical analysis to " +
      "help you understand and exploit the market. This research " +
      "allows you to know how many sales of a Material/Product you lose or gain " +
      "from having too high or too low or a sale price. It also lets you automatically " +
      "set the sale price of your Materials/Products at the optimal price such that " +
      "the amount sold matches the amount produced.",
  },
  {
    name: "Overclock",
    cost: 15e3,
    desc:
      "Equip employees with a headset that uses transcranial direct current " +
      "stimulation (tDCS) to increase the speed of their neurotransmitters. " +
      "This research increases the intelligence and efficiency of all " +
      "employees by 25%.",
    employeeEffMult: 1.25,
    employeeIntMult: 1.25,
  },
  {
    name: "Self-Correcting Assemblers",
    cost: 25e3,
    desc:
      "Create assemblers that can be used for universal production. " +
      "These assemblers use deep learning to improve their efficiency " +
      "at their tasks. This research increases all production by 10%",
    productionMult: 1.1,
  },
  {
    name: "Sti.mu",
    cost: 30e3,
    desc:
      "Upgrade the tDCS headset to stimulate regions of the brain that " +
      "control confidence and enthusiasm. This research increases the max " +
      "morale of all employees by 10.",
  },
  {
    name: "sudo.Assist",
    cost: 15e3,
    desc: "Develop a virtual assistant AI to handle and manage administrative issues for your corporation.",
  },
  {
    name: "uPgrade: Capacity.I",
    cost: 20e3,
    desc:
      "Expand the industry's capacity for designing and manufacturing its " +
      "various products. This increases the industry's maximum number of products " +
      "by 1 (from 3 to 4).",
  },
  {
    name: "uPgrade: Capacity.II",
    cost: 30e3,
    desc:
      "Expand the industry's capacity for designing and manufacturing its " +
      "various products. This increases the industry's maximum number of products " +
      "by 1 (from 4 to 5).",
  },
  {
    name: "uPgrade: Dashboard",
    cost: 5e3,
    desc:
      "Improve the software used to manage the industry's production line " +
      "for its various products. This allows you to manage the production and " +
      "sale of a product before it's finished being designed.",
  },
  {
    name: "uPgrade: Fulcrum",
    cost: 10e3,
    desc:
      "Streamline the manufacturing of this industry's various products. " +
      "This research increases the production of your products by 5%",
    productProductionMult: 1.05,
  },
];
