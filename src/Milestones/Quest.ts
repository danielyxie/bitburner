import { Milestone } from "./Milestone";

export class Quest {
    title: string;
    milestones: Milestone[];
    
    constructor(title: string, milestones: Milestone[]) {
        this.title = title;
        this.milestones = milestones;
    }
}