import { IMults, UpgradeType } from "./data/upgrades";

export class GangMemberUpgrade {
    name: string;
    cost: number;
    type: UpgradeType;
    desc: string;
    mults: IMults;

    constructor(name = "", cost = 0, type: UpgradeType = UpgradeType.Weapon, mults: IMults = {}) {
        this.name = name;
        this.cost = cost;
        this.type = type;
        this.mults = mults;

        this.desc = this.createDescription();
    }

    createDescription(): string {
        const lines = ["Increases:"];
        if (this.mults.str != null) {
            lines.push(`* Strength by ${Math.round((this.mults.str - 1) * 100)}%`);
        }
        if (this.mults.def != null) {
            lines.push(`* Defense by ${Math.round((this.mults.def - 1) * 100)}%`);
        }
        if (this.mults.dex != null) {
            lines.push(`* Dexterity by ${Math.round((this.mults.dex - 1) * 100)}%`);
        }
        if (this.mults.agi != null) {
            lines.push(`* Agility by ${Math.round((this.mults.agi - 1) * 100)}%`);
        }
        if (this.mults.cha != null) {
            lines.push(`* Charisma by ${Math.round((this.mults.cha - 1) * 100)}%`);
        }
        if (this.mults.hack != null) {
            lines.push(`* Hacking by ${Math.round((this.mults.hack - 1) * 100)}%`);
        }
        return lines.join("<br>");
    }

    // User friendly version of type.
    getType(): string {
        switch (this.type) {
            case UpgradeType.Weapon:
                return "Weapon";
            case UpgradeType.Armor:
                return "Armor";
            case UpgradeType.Vehicle:
                return "Vehicle";
            case UpgradeType.Rootkit:
                return "Rootkit";
            case UpgradeType.Augmentation:
                return "Augmentation";
            default:
                return "";
        }
    }
}