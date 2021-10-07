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
      break;
    }
    case FragmentType.HackingSpeed: {
      return "+x% faster hack(), grow(), and weaken()";
      break;
    }
    case FragmentType.HackingMoney: {
      return "+x% hack() power";
      break;
    }
    case FragmentType.HackingGrow: {
      return "+x% grow() power";
      break;
    }
    case FragmentType.Hacking: {
      return "+x% hacking skill";
      break;
    }
    case FragmentType.Strength: {
      return "+x% strength skill";
      break;
    }
    case FragmentType.Defense: {
      return "+x% defense skill";
      break;
    }
    case FragmentType.Dexterity: {
      return "+x% dexterity skill";
      break;
    }
    case FragmentType.Agility: {
      return "+x% agility skill";
      break;
    }
    case FragmentType.Charisma: {
      return "+x% charisma skill";
      break;
    }
    case FragmentType.HacknetMoney: {
      return "+x% hacknet production";
      break;
    }
    case FragmentType.HacknetCost: {
      return "-x% all hacknet cost";
      break;
    }
    case FragmentType.Rep: {
      return "+x% reputation from factions and companies";
      break;
    }
    case FragmentType.WorkMoney: {
      return "+x% work money";
      break;
    }
    case FragmentType.Crime: {
      return "+x% crime money";
      break;
    }
    case FragmentType.Bladeburner: {
      return "+x% all bladeburner stats";
      break;
    }
  }
  throw new Error("Calling effect for fragment type that doesn't have an effect " + tpe);
}
