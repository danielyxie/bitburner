// Defines the ResearchTree that is common to all Corporation Industries
// i.e. all Industries have these types of Research available to unlock
import { Research } from "../Research";
import { ResearchMap } from "../ResearchMap";
import { ResearchTree, Node } from "../ResearchTree";

function makeNode(name: string): Node {
  const research: Research | null = ResearchMap[name];
  if (research == null) {
    throw new Error(`Invalid research name: ${name}`);
  }

  return new Node({ text: research.name, cost: research.cost });
}

// Creates the Nodes for the BaseResearchTree.
// Return the Root Node
function createBaseResearchTreeNodes(): Node {
  const rootNode: Node = makeNode("Hi-Tech R&D Laboratory");
  const autoBrew: Node = makeNode("AutoBrew");
  const autoParty: Node = makeNode("AutoPartyManager");
  const autoDrugs: Node = makeNode("Automatic Drug Administration");
  const bulkPurchasing: Node = makeNode("Bulk Purchasing");
  const cph4: Node = makeNode("CPH4 Injections");
  const drones: Node = makeNode("Drones");
  const dronesAssembly: Node = makeNode("Drones - Assembly");
  const dronesTransport: Node = makeNode("Drones - Transport");
  const goJuice: Node = makeNode("Go-Juice");
  const hrRecruitment: Node = makeNode("HRBuddy-Recruitment");
  const hrTraining: Node = makeNode("HRBuddy-Training");
  const joywire: Node = makeNode("JoyWire");
  const marketta1: Node = makeNode("Market-TA.I");
  const marketta2: Node = makeNode("Market-TA.II");
  const overclock: Node = makeNode("Overclock");
  const scAssemblers: Node = makeNode("Self-Correcting Assemblers");
  const stimu: Node = makeNode("Sti.mu");

  autoDrugs.addChild(goJuice);
  autoDrugs.addChild(cph4);

  drones.addChild(dronesAssembly);
  drones.addChild(dronesTransport);

  hrRecruitment.addChild(hrTraining);

  marketta1.addChild(marketta2);

  overclock.addChild(stimu);

  rootNode.addChild(autoBrew);
  rootNode.addChild(autoParty);
  rootNode.addChild(autoDrugs);
  rootNode.addChild(bulkPurchasing);
  rootNode.addChild(drones);
  rootNode.addChild(hrRecruitment);
  rootNode.addChild(joywire);
  rootNode.addChild(marketta1);
  rootNode.addChild(overclock);
  rootNode.addChild(scAssemblers);

  return rootNode;
}

export function getBaseResearchTreeCopy(): ResearchTree {
  const baseResearchTree: ResearchTree = new ResearchTree();
  baseResearchTree.setRoot(createBaseResearchTreeNodes());

  return baseResearchTree;
}

// Base Research Tree for Industry's that make products
export function getProductIndustryResearchTreeCopy(): ResearchTree {
  const researchTree: ResearchTree = new ResearchTree();
  const root = createBaseResearchTreeNodes();

  const upgradeFulcrum = makeNode("uPgrade: Fulcrum");
  const upgradeCapacity1 = makeNode("uPgrade: Capacity.I");
  const upgradeCapacity2 = makeNode("uPgrade: Capacity.II");
  const upgradeDashboard = makeNode("uPgrade: Dashboard");

  upgradeCapacity1.addChild(upgradeCapacity2);
  upgradeFulcrum.addChild(upgradeCapacity1);
  upgradeFulcrum.addChild(upgradeDashboard);
  root.addChild(upgradeFulcrum);

  researchTree.setRoot(root);

  return researchTree;
}
