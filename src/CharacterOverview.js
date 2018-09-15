import {Player}  from "./Player";

import {numeralWrapper} from "./ui/numeralFormat";

function CharacterOverview() {
	this.hp = document.getElementById("character-hp-text");
	this.money = document.getElementById("character-money-text");
	this.hack = document.getElementById("character-hack-text");
	this.str = document.getElementById("character-str-text");
	this.def = document.getElementById("character-def-text");
	this.dex = document.getElementById("character-dex-text");
	this.agi = document.getElementById("character-agi-text");
	this.cha = document.getElementById("character-cha-text");
	this.int = document.getElementById("character-int-text");
	this.intWrapper = document.getElementById("character-int-wrapper");
	this.repaintElem = document.getElementById("character-overview-text");
}

CharacterOverview.prototype.repaint = function() {
	// this is an arbitrary function we can call to trigger a repaint.
	this.repaintElem.getClientRects();
}

CharacterOverview.prototype.update = function() {
		if (Player.hp == null) {Player.hp = Player.max_hp;}

        const replaceAndChanged = function(elem, text) {
            if(elem.textContent === text) {
                return false;
            }
            elem.textContent = text;
            return true;
        }

        let changed = false;
        changed = replaceAndChanged(this.hp, Player.hp + " / " + Player.max_hp) || changed;
        changed = replaceAndChanged(this.money, numeralWrapper.format(Player.money.toNumber(), '($0.000a)')) || changed;
        changed = replaceAndChanged(this.hack, (Player.hacking_skill).toLocaleString()) || changed;
        changed = replaceAndChanged(this.str, (Player.strength).toLocaleString()) || changed;
        changed = replaceAndChanged(this.def, (Player.defense).toLocaleString()) || changed;
        changed = replaceAndChanged(this.dex, (Player.dexterity).toLocaleString()) || changed;
        changed = replaceAndChanged(this.agi, (Player.agility).toLocaleString()) || changed;
        changed = replaceAndChanged(this.cha, (Player.charisma).toLocaleString()) || changed;
        changed = replaceAndChanged(this.int, (Player.intelligence).toLocaleString()) || changed;

        // handle int appearing
        const int = this.intWrapper;
        const old = int.style.display;
        const now = Player.intelligence >= 1 ? "" : "none";
        if(old !== now) {
            int.style.display = now;
            changed = true;
        }

        // recalculate box size if something changed
        if(changed) this.repaint();
}

export {CharacterOverview};
