import { IMults, UpgradeType } from "./data/upgrades";
import { numeralWrapper } from "../ui/numeralFormat";

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
    const lines = ["Effects:"];
    if (this.mults.str != null) {
      lines.push(`+${numeralWrapper.formatPercentage(this.mults.str - 1, 0)} strength skill`);
      lines.push(`+${numeralWrapper.formatPercentage((this.mults.str - 1) / 4, 2)} strength exp`);
    }
    if (this.mults.def != null) {
      lines.push(`+${numeralWrapper.formatPercentage(this.mults.def - 1, 0)} defense skill`);
      lines.push(`+${numeralWrapper.formatPercentage((this.mults.def - 1) / 4, 2)} defense exp`);
    }
    if (this.mults.dex != null) {
      lines.push(`+${numeralWrapper.formatPercentage(this.mults.dex - 1, 0)} dexterity skill`);
      lines.push(`+${numeralWrapper.formatPercentage((this.mults.dex - 1) / 4, 2)} dexterity exp`);
    }
    if (this.mults.agi != null) {
      lines.push(`+${numeralWrapper.formatPercentage(this.mults.agi - 1, 0)} agility skill`);
      lines.push(`+${numeralWrapper.formatPercentage((this.mults.agi - 1) / 4, 2)} agility exp`);
    }
    if (this.mults.cha != null) {
      lines.push(`+${numeralWrapper.formatPercentage(this.mults.cha - 1, 0)} charisma skill`);
      lines.push(`+${numeralWrapper.formatPercentage((this.mults.cha - 1) / 4, 2)} charisma exp`);
    }
    if (this.mults.hack != null) {
      lines.push(`+${numeralWrapper.formatPercentage(this.mults.hack - 1, 0)} hacking skill`);
      lines.push(`+${numeralWrapper.formatPercentage((this.mults.hack - 1) / 4, 2)} hacking exp`);
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
