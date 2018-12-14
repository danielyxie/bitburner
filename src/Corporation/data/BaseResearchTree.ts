// Defines the ResearchTree that is common to all Corporation Industries
// i.e. all Industries have these types of Research available to unlock
import { ResearchTree,
         Node } from "../ResearchTree";

export const BaseResearchTree: ResearchTree = new ResearchTree();

const rootNode          = new Node({data: "Hi-Tech R&D Laboratory"});
const autoBrew          = new Node({data: "AutoBrew"});
const autoParty         = new Node({data: "AutoPartyManager"});
const autoDrugs         = new Node({data: "Automatic Drug Administration"});
const cph4              = new Node({data: "CPH4 Injections"});
const drones            = new Node({data: "Drones"});
const dronesAssembly    = new Node({data: "Drones - Assembly"});
const dronesTransport   = new Node({data: "Drones - Transport"});
const goJuice           = new Node({data: "Go-Juice"});
const joywire           = new Node({data: "JoyWire"});
const marketta1         = new Node({data: "Market-TA.I"});
const marketta2         = new Node({data: "Market-TA.II"});
const overclock         = new Node({data: "Overclock"});
const scAssemblers      = new Node({data: "Self-Correcting Assemblers"});
const stimu             = new Node({data: "Sti.mu"});

autoDrugs.addChild(goJuice);
autoDrugs.addChild(cph4);

drones.addChild(dronesAssembly);
drones.addChild(dronesTransport);

marketta1.addChild(marketta2);

overclock.addChild(stimu);

rootNode.addChild(autoBrew);
rootNode.addChild(autoParty);
rootNode.addChild(autoDrugs);
rootNode.addChild(drones);
rootNode.addChild(joywire);
rootNode.addChild(marketta1);
rootNode.addChild(overclock);
rootNode.addChild(scAssemblers);

BaseResearchTree.setRoot(rootNode);

export function getBaseResearchTreeCopy(): ResearchTree {
    return Object.assign(Object.create(Object.getPrototypeOf(BaseResearchTree)), BaseResearchTree);
}
