// Defines the ResearchTree that is common to all Corporation Industries
// i.e. all Industries have these types of Research available to unlock
import { Research } from "../Research";
import { ResearchMap } from "../ResearchMap";
import { ResearchTree,
         Node } from "../ResearchTree";

function makeNode(name: string): Node {
    const research: Research | null = ResearchMap[name];
    if (research == null) {
        throw new Error(`Invalid research name: ${name}`);
    }

    return new Node({ text: research.name, cost: research.cost });
}


export function getBaseResearchTreeCopy(): ResearchTree {
    const baseResearchTree: ResearchTree = new ResearchTree();

    const rootNode: Node        = makeNode("Hi-Tech R&D Laboratory");
    const autoBrew: Node        = makeNode("AutoBrew");
    const autoParty: Node       = makeNode("AutoPartyManager");
    const autoDrugs: Node       = makeNode("Automatic Drug Administration");
    const cph4: Node            = makeNode("CPH4 Injections");
    const drones: Node          = makeNode("Drones");
    const dronesAssembly: Node  = makeNode("Drones - Assembly");
    const dronesTransport: Node = makeNode("Drones - Transport");
    const goJuice: Node         = makeNode("Go-Juice");
    const joywire: Node         = makeNode("JoyWire");
    const marketta1: Node       = makeNode("Market-TA.I");
    const marketta2: Node       = makeNode("Market-TA.II");
    const overclock: Node       = makeNode("Overclock");
    const scAssemblers: Node    = makeNode("Self-Correcting Assemblers");
    const stimu: Node           = makeNode("Sti.mu");

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

    baseResearchTree.setRoot(rootNode);

    return baseResearchTree;
}
