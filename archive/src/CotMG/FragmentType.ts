export enum FragmentType {
  // Special fragments for the UI
  None,
  Delete,

  // Stats boosting fragments
  HackingChance,
  HackingSpeed,
  HackingMoney,
  HackingGrow,
  Hacking,
  Strength,
  Defense,
  Dexterity,
  Agility,
  Charisma,
  HacknetMoney,
  HacknetCost,
  Rep,
  WorkMoney,
  Crime,
  Bladeburner,

  // utility fragments.
  Booster,
}

export function Effect(tpe: FragmentType): string {
  switch (tpe) {
    case FragmentType.HackingChance: {
      return "+x% hack() success chance";
    }
    case FragmentType.HackingSpeed: {
      return "+x% faster hack(), grow(), and weaken()";
    }
    case FragmentType.HackingMoney: {
      return "+x% hack() power";
    }
    case FragmentType.HackingGrow: {
      return "+x% grow() power";
    }
    case FragmentType.Hacking: {
      return "+x% hacking skill";
    }
    case FragmentType.Strength: {
      return "+x% strength skill";
    }
    case FragmentType.Defense: {
      return "+x% defense skill";
    }
    case FragmentType.Dexterity: {
      return "+x% dexterity skill";
    }
    case FragmentType.Agility: {
      return "+x% agility skill";
    }
    case FragmentType.Charisma: {
      return "+x% charisma skill";
    }
    case FragmentType.HacknetMoney: {
      return "+x% hacknet production";
    }
    case FragmentType.HacknetCost: {
      return "-x% cheaper hacknet cost";
    }
    case FragmentType.Rep: {
      return "+x% reputation from factions and companies";
    }
    case FragmentType.WorkMoney: {
      return "+x% work money";
    }
    case FragmentType.Crime: {
      return "+x% crime money";
    }
    case FragmentType.Bladeburner: {
      return "+x% all bladeburner stats";
    }
  }
  throw new Error("Calling effect for fragment type that doesn't have an effect " + tpe);
}
