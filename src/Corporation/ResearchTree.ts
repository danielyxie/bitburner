// Defines a "Research Tree"
// Each Industry has a unique Research Tree
// Each Node in the Research Trees only holds the name(s) of Research,
// not an actual Research object. The name can be used to obtain a reference
// to the corresponding Research object using the ResearchMap

import { ResearchMap } from "./ResearchMap";

interface IConstructorParams {
    children?: Node[];
    cost: number;
    text: string;
    parent?: Node | null;
}

export class Node {
    // All child Nodes in the tree
    // The Research held in this Node is a prerequisite for all Research in
    // child Nodes
    children: Node[] = [];

    // How much Scientific Research is needed for this
    // Necessary to show it on the UI
    cost: number = 0;

    // Whether or not this Research has been unlocked
    researched: boolean = false;

    // Parent node in the tree
    // The parent node defines the prerequisite Research (there can only be one)
    // Set as null for no prerequisites
    parent: Node | null = null;

    // Name of the Research held in this Node
    text: string = "";

    constructor(p: IConstructorParams) {
        if (ResearchMap[p.text] == null) {
            throw new Error(`Invalid Research name used when constructing ResearchTree Node: ${p.text}`);
        }

        this.text = p.text;
        this.cost = p.cost;

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

    // Return an object that describes a TreantJS-compatible markup/config for this Node
    // See: http://fperucic.github.io/treant-js/
    createTreantMarkup(): object {
        const childrenArray = [];
        for (let i = 0; i < this.children.length; ++i) {
            childrenArray.push(this.children[i].createTreantMarkup());
        }

        // Determine what css class this Node should have in the diagram
        let htmlClass: string = "";
        if (this.researched) {
            htmlClass = "researched";
        } else if (this.parent && this.parent.researched === false) {
            htmlClass = "locked";
        } else {
            htmlClass = "unlocked";
        }

        const sanitizedName: string = this.text.replace(/\s/g, '');
        return {
            children: childrenArray,
            HTMLclass: htmlClass,
            innerHTML: `<div id="${sanitizedName}-click-listener">${this.text}<br>${this.cost} Scientific Research</div>`,
            text: { name: this.text },
        }
    }

    // Recursive function for finding a Node with the specified text
    findNode(text: string): Node | null {
        // Is this the Node?
        if (this.text === text) { return this; }

        // Recursively search chilren
        let res = null;
        for (let i = 0; i < this.children.length; ++i) {
            res = this.children[i].findNode(text);
            if (res != null) { return res; }
        }

        return null;
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

    // Return an object that contains a Tree markup for TreantJS (using the JSON approach)
    // See: http://fperucic.github.io/treant-js/
    createTreantMarkup(): object {
        if (this.root == null) { return {}; }

        const treeMarkup = this.root.createTreantMarkup();

        return {
            chart: {
                container: "",
            },
            nodeStructure: treeMarkup,
        };
    }

    // Gets an array with the 'text' values of ALL Nodes in the Research Tree
    getAllNodes(): string[] {
        const res: string[] = [];
        const queue: Node[] = [];

        if (this.root == null) { return res; }

        queue.push(this.root);
        while (queue.length !== 0) {
            const node: Node | undefined = queue.shift();
            if (node == null) { continue; }

            res.push(node.text);
            for (let i = 0; i < node.children.length; ++i) {
                queue.push(node.children[i]);
            }
        }

        return res;
    }

    // Search for a Node with the given name ('text' property on the Node)
    // Returns 'null' if it cannot be found
    findNode(name: string): Node | null {
        if (this.root == null) { return null; }
        return this.root.findNode(name);
    }

    // Marks a Node as researched
    research(name: string): void {
        if (this.root == null) { return; }

        const queue: Node[] = [];
        queue.push(this.root);
        while (queue.length !== 0) {
            const node: Node | undefined = queue.shift();
            if (node == null)  { continue; }

            if (node.text === name) {
                node.researched = true;
            }

            for (let i = 0; i < node.children.length; ++i) {
                queue.push(node.children[i]);
            }
        }
    }

    // Set the tree's Root Node
    setRoot(root: Node): void {
        this.root = root;
    }
}
