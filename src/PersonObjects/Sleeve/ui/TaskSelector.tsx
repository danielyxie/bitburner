import React, { useState } from "react";
import { Sleeve } from "../Sleeve";
import { IPlayer } from "../../IPlayer";
import { SleeveTaskType } from "../SleeveTaskTypesEnum";
import { Crimes } from "../../../Crime/Crimes";
import { LocationName } from "../../../Locations/data/LocationNames";
import { CityName } from "../../../Locations/data/CityNames";
import { Factions } from "../../../Faction/Factions";
import { FactionWorkType } from "../../../Faction/FactionWorkTypeEnum";

const universitySelectorOptions: string[] = [
  "Study Computer Science",
  "Data Structures",
  "Networks",
  "Algorithms",
  "Management",
  "Leadership",
];

const gymSelectorOptions: string[] = ["Train Strength", "Train Defense", "Train Dexterity", "Train Agility"];

interface IProps {
  sleeve: Sleeve;
  player: IPlayer;
  setABC: (abc: string[]) => void;
}

interface ITaskDetails {
  first: string[];
  second: (s1: string) => string[];
}

function possibleJobs(player: IPlayer, sleeve: Sleeve): string[] {
  // Array of all companies that other sleeves are working at
  const forbiddenCompanies = [];
  for (const otherSleeve of player.sleeves) {
    if (sleeve === otherSleeve) {
      continue;
    }
    if (otherSleeve.currentTask === SleeveTaskType.Company) {
      forbiddenCompanies.push(otherSleeve.currentTaskLocation);
    }
  }
  let allJobs: string[] = Object.keys(player.jobs);
  for (let i = 0; i < allJobs.length; ++i) {
    if (!forbiddenCompanies.includes(allJobs[i])) {
      allJobs[i];
    }
  }

  return allJobs;
}

function possibleFactions(player: IPlayer, sleeve: Sleeve): string[] {
  // Array of all factions that other sleeves are working for
  const forbiddenFactions = [];
  for (const otherSleeve of player.sleeves) {
    if (sleeve === otherSleeve) {
      continue;
    }
    if (otherSleeve.currentTask === SleeveTaskType.Faction) {
      forbiddenFactions.push(otherSleeve.currentTaskLocation);
    }
  }

  const factions = [];
  for (const fac of player.factions) {
    if (!forbiddenFactions.includes(fac)) {
      factions.push(fac);
    }
  }

  return factions;
}

const tasks: {
  [key: string]: undefined | ((player: IPlayer, sleeve: Sleeve) => ITaskDetails);
  ["------"]: (player: IPlayer, sleeve: Sleeve) => ITaskDetails;
  ["Work for Company"]: (player: IPlayer, sleeve: Sleeve) => ITaskDetails;
  ["Work for Faction"]: (player: IPlayer, sleeve: Sleeve) => ITaskDetails;
  ["Commit Crime"]: (player: IPlayer, sleeve: Sleeve) => ITaskDetails;
  ["Take University Course"]: (player: IPlayer, sleeve: Sleeve) => ITaskDetails;
  ["Workout at Gym"]: (player: IPlayer, sleeve: Sleeve) => ITaskDetails;
  ["Shock Recovery"]: (player: IPlayer, sleeve: Sleeve) => ITaskDetails;
  ["Synchronize"]: (player: IPlayer, sleeve: Sleeve) => ITaskDetails;
} = {
  "------": (player: IPlayer, sleeve: Sleeve): ITaskDetails => {
    return { first: ["------"], second: () => ["------"] };
  },
  "Work for Company": (player: IPlayer, sleeve: Sleeve): ITaskDetails => {
    let jobs = possibleJobs(player, sleeve);

    if (jobs.length === 0) jobs = ["------"];
    return { first: jobs, second: () => ["------"] };
  },
  "Work for Faction": (player: IPlayer, sleeve: Sleeve): ITaskDetails => {
    let factions = possibleFactions(player, sleeve);
    if (factions.length === 0) factions = ["------"];

    return {
      first: factions,
      second: (s1: string) => {
        const faction = Factions[s1];
        const facInfo = faction.getInfo();
        const options: string[] = [];
        if (facInfo.offerHackingWork) {
          options.push("Hacking Contracts");
        }
        if (facInfo.offerFieldWork) {
          options.push("Field Work");
        }
        if (facInfo.offerSecurityWork) {
          options.push("Security Work");
        }
        return options;
      },
    };
  },
  "Commit Crime": (player: IPlayer, sleeve: Sleeve): ITaskDetails => {
    return { first: Object.keys(Crimes), second: () => ["------"] };
  },
  "Take University Course": (player: IPlayer, sleeve: Sleeve): ITaskDetails => {
    let universities: string[] = [];
    switch (sleeve.city) {
      case CityName.Aevum:
        universities = [LocationName.AevumSummitUniversity];
        break;
      case CityName.Sector12:
        universities = [LocationName.Sector12RothmanUniversity];
        break;
      case CityName.Volhaven:
        universities = [LocationName.VolhavenZBInstituteOfTechnology];
        break;
      default:
        universities = ["No university available in city!"];
        break;
    }

    return { first: universitySelectorOptions, second: () => universities };
  },
  "Workout at Gym": (player: IPlayer, sleeve: Sleeve): ITaskDetails => {
    let gyms: string[] = [];
    switch (sleeve.city) {
      case CityName.Aevum:
        gyms = [LocationName.AevumCrushFitnessGym, LocationName.AevumSnapFitnessGym];
        break;
      case CityName.Sector12:
        gyms = [LocationName.Sector12IronGym, LocationName.Sector12PowerhouseGym];
        break;
      case CityName.Volhaven:
        gyms = [LocationName.VolhavenMilleniumFitnessGym];
        break;
      default:
        gyms = ["No gym available in city!"];
        break;
    }

    return { first: gymSelectorOptions, second: () => gyms };
  },
  "Shock Recovery": (player: IPlayer, sleeve: Sleeve): ITaskDetails => {
    return { first: ["------"], second: () => ["------"] };
  },
  Synchronize: (player: IPlayer, sleeve: Sleeve): ITaskDetails => {
    return { first: ["------"], second: () => ["------"] };
  },
};

const canDo: {
  [key: string]: undefined | ((player: IPlayer, sleeve: Sleeve) => boolean);
  ["------"]: (player: IPlayer, sleeve: Sleeve) => boolean;
  ["Work for Company"]: (player: IPlayer, sleeve: Sleeve) => boolean;
  ["Work for Faction"]: (player: IPlayer, sleeve: Sleeve) => boolean;
  ["Commit Crime"]: (player: IPlayer, sleeve: Sleeve) => boolean;
  ["Take University Course"]: (player: IPlayer, sleeve: Sleeve) => boolean;
  ["Workout at Gym"]: (player: IPlayer, sleeve: Sleeve) => boolean;
  ["Shock Recovery"]: (player: IPlayer, sleeve: Sleeve) => boolean;
  ["Synchronize"]: (player: IPlayer, sleeve: Sleeve) => boolean;
} = {
  ["------"]: () => true,
  ["Work for Company"]: (player: IPlayer, sleeve: Sleeve) => possibleJobs(player, sleeve).length > 0,
  ["Work for Faction"]: (player: IPlayer, sleeve: Sleeve) => possibleFactions(player, sleeve).length > 0,
  ["Commit Crime"]: () => true,
  ["Take University Course"]: (player: IPlayer, sleeve: Sleeve) =>
    [CityName.Aevum, CityName.Sector12, CityName.Volhaven].includes(sleeve.city),
  ["Workout at Gym"]: (player: IPlayer, sleeve: Sleeve) =>
    [CityName.Aevum, CityName.Sector12, CityName.Volhaven].includes(sleeve.city),
  ["Shock Recovery"]: (player: IPlayer, sleeve: Sleeve) => sleeve.shock < 100,
  ["Synchronize"]: (player: IPlayer, sleeve: Sleeve) => sleeve.sync < 100,
};

function getABC(sleeve: Sleeve): [string, string, string] {
  switch (sleeve.currentTask) {
    case SleeveTaskType.Idle:
      return ["------", "------", "------"];
    case SleeveTaskType.Company:
      return ["Work for Company", sleeve.currentTaskLocation, "------"];
    case SleeveTaskType.Faction:
      let workType = "";
      switch (sleeve.factionWorkType) {
        case FactionWorkType.Hacking:
          workType = "Hacking Contracts";
          break;
        case FactionWorkType.Field:
          workType = "Field Work";
          break;
        case FactionWorkType.Security:
          workType = "Security Work";
          break;
      }
      return ["Work for Faction", sleeve.currentTaskLocation, workType];
    case SleeveTaskType.Crime:
      return ["Commit Crime", sleeve.crimeType, "------"];
    case SleeveTaskType.Class:
      return ["Take University Course", sleeve.className, sleeve.currentTaskLocation];
    case SleeveTaskType.Gym:
      return ["Workout at Gym", sleeve.gymStatType, sleeve.currentTaskLocation];
    case SleeveTaskType.Recovery:
      return ["Shock Recovery", "------", "------"];
    case SleeveTaskType.Synchro:
      return ["Synchronize", "------", "------"];
  }
}

export function TaskSelector(props: IProps): React.ReactElement {
  const abc = getABC(props.sleeve);
  const [s0, setS0] = useState(abc[0]);
  const [s1, setS1] = useState(abc[1]);
  const [s2, setS2] = useState(abc[2]);

  const validActions = Object.keys(canDo).filter((k) =>
    (canDo[k] as (player: IPlayer, sleeve: Sleeve) => boolean)(props.player, props.sleeve),
  );

  const detailsF = tasks[s0];
  if (detailsF === undefined) throw new Error(`No function for task '${s0}'`);
  const details = detailsF(props.player, props.sleeve);
  const details2 = details.second(s1);

  function onS0Change(event: React.ChangeEvent<HTMLSelectElement>): void {
    const n = event.target.value;
    const detailsF = tasks[n];
    if (detailsF === undefined) throw new Error(`No function for task '${s0}'`);
    const details = detailsF(props.player, props.sleeve);
    const details2 = details.second(details.first[0]);
    setS2(details2[0]);
    setS1(details.first[0]);
    setS0(n);
    props.setABC([n, details.first[0], details2[0]]);
  }

  function onS1Change(event: React.ChangeEvent<HTMLSelectElement>): void {
    setS1(event.target.value);
    props.setABC([s0, event.target.value, s2]);
  }

  function onS2Change(event: React.ChangeEvent<HTMLSelectElement>): void {
    setS2(event.target.value);
    props.setABC([s0, s1, event.target.value]);
  }

  return (
    <>
      <select className="dropdown" onChange={onS0Change} defaultValue={s0}>
        {validActions.map((task) => (
          <option key={task} value={task}>
            {task}
          </option>
        ))}
      </select>
      {!(details.first.length === 1 && details.first[0] === "------") && (
        <select className="dropdown" onChange={onS1Change} defaultValue={s1}>
          {details.first.map((detail) => (
            <option key={detail} value={detail}>
              {detail}
            </option>
          ))}
        </select>
      )}
      {!(details2.length === 1 && details2[0] === "------") && (
        <select className="dropdown" onChange={onS2Change} defaultValue={s2}>
          {details2.map((detail) => (
            <option key={detail} value={detail}>
              {detail}
            </option>
          ))}
        </select>
      )}
    </>
  );
}
