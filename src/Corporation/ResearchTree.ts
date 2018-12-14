// Defines a "Research Tree"
// Each Industry has a unique Research Tree
// Each Node in the Research Trees only holds the name(s) of Research,
// not an actual Research object. The name can be used to obtain a reference
// to the corresponding Research object using the ResearchMap

import { ResearchMap } from "./ResearchMap";

interface IConstructorParams {
    children?: Node[];
    data: string;
    parent?: Node | null;
}

export class Node {
    // All child Nodes in the tree
    // The Research held in this Node is a prerequisite for all Research in
    // child Nodes
    children: Node[] = [];

    // Name of the Research held in this Node
    data: string = "";

    // Parent node in the tree
    // The parent node defines the prerequisite Research (there can only be one)
    // Set as null for no prerequisites
    parent: Node | null = null;

    constructor(p: IConstructorParams) {
        if (ResearchMap[p.data] == null) {
            throw new Error(`Invalid Research name used when constructing ResearchTree Node: ${p.data}`);
        }

        this.data = p.data;

        if (p.children && p.children.length > 0) {
            this.children = p.children;
        }

        if (p.parent != null) {
            this.parent = p.parent;
        }
    }

    addChild(n: Node) {
        this.children.push(n);
        n.parent = this;
    }

    setParent(n: Node) {
        this.parent =  n;
    }
}

// A ResearchTree defines all available Research in an Industry
// The root node in a Research Tree must always be the "Hi-Tech R&D Laboratory"
export class ResearchTree {
    root: Node | null = null;

    constructor() {}

    setRoot(root: Node): void {
        this.root = root;
    }
}
