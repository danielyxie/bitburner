import { Bladeburner } from "../../Bladeburner";
import { SourceFileFlags } from "../../SourceFile/SourceFileFlags";

export function canAccessBladeburner() {
    if (this.bitNodeN === 8) { return false; }
    
    return (this.bitNodeN === 6) || (this.bitNodeN === 7) || (SourceFileFlags[6] > 0) || (SourceFileFlags[7] > 0);
}

export function inBladeburner() {
    if (this.bladeburner == null) { return false; }
    return (this.bladeburner instanceof Bladeburner);
}

export function startBladeburner() {
    this.bladeburner = new Bladeburner({ new: true });
}
