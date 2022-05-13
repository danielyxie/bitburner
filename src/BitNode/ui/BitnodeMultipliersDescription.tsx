import ExpandMore from "@mui/icons-material/ExpandMore";
import ExpandLess from "@mui/icons-material/ExpandLess";
import { Box, Collapse, ListItemButton, ListItemText, Paper, Typography } from "@mui/material";
import React from "react";
import { use } from "../../ui/Context";
import { defaultMultipliers, getBitNodeMultipliers } from "../BitNode";
import { IBitNodeMultipliers } from "../BitNodeMultipliers";
import { SpecialServers } from "../../Server/data/SpecialServers";

interface IProps {
  n: number;
}

export function BitnodeMultiplierDescription({ n }: IProps): React.ReactElement {
  const player = use.Player();
  const [open, setOpen] = React.useState(false);
  const mults = getBitNodeMultipliers(n, player.sourceFileLvl(n));
  if (n === 1) return <></>;

  return (
    <>
      <br />
      <Box component={Paper}>
        <ListItemButton onClick={() => setOpen((old) => !old)}>
          <ListItemText primary={<Typography>Bitnode multipliers:</Typography>} />
          {open ? <ExpandLess color="primary" /> : <ExpandMore color="primary" />}
        </ListItemButton>
        <Box mx={2}>
          <Collapse in={open}>
            <GeneralMults n={n} mults={mults} />
            <FactionMults n={n} mults={mults} />
            <AugmentationMults n={n} mults={mults} />
            <StockMults n={n} mults={mults} />
            <SkillMults n={n} mults={mults} />
            <HackingMults n={n} mults={mults} />
            <PurchasedServersMults n={n} mults={mults} />
            <CrimeMults n={n} mults={mults} />
            <InfiltrationMults n={n} mults={mults} />
            <CompanyMults n={n} mults={mults} />
            <GangMults n={n} mults={mults} />
            <CorporationMults n={n} mults={mults} />
            <BladeburnerMults n={n} mults={mults} />
            <StanekMults n={n} mults={mults} />
            <br />
          </Collapse>
        </Box>
      </Box>
    </>
  );
}

interface IMultsProps {
  n: number;
  mults: IBitNodeMultipliers;
}

function GeneralMults({ mults }: IMultsProps): React.ReactElement {
  // is it empty check
  if (
    mults.ClassGymExpGain === defaultMultipliers.ClassGymExpGain &&
    mults.CodingContractMoney === defaultMultipliers.CodingContractMoney &&
    mults.DaedalusAugsRequirement === defaultMultipliers.DaedalusAugsRequirement &&
    mults.WorldDaemonDifficulty === defaultMultipliers.WorldDaemonDifficulty &&
    mults.HacknetNodeMoney === defaultMultipliers.HacknetNodeMoney
  )
    return <></>;
  return (
    <>
      <br />
      <Typography variant={"h5"}>General:</Typography>
      <Box mx={1}>
        {mults.WorldDaemonDifficulty !== defaultMultipliers.WorldDaemonDifficulty ? (
          <Typography>
            {SpecialServers.WorldDaemon} difficulty: x{mults.WorldDaemonDifficulty.toFixed(3)}
          </Typography>
        ) : (
          <></>
        )}
        {mults.DaedalusAugsRequirement !== defaultMultipliers.DaedalusAugsRequirement ? (
          <Typography>Daedalus aug req.: {mults.DaedalusAugsRequirement}</Typography>
        ) : (
          <></>
        )}
        {mults.HacknetNodeMoney !== defaultMultipliers.HacknetNodeMoney ? (
          <Typography>Hacknet production: x{mults.HacknetNodeMoney.toFixed(3)}</Typography>
        ) : (
          <></>
        )}
        {mults.CodingContractMoney !== defaultMultipliers.CodingContractMoney ? (
          <Typography>Coding contract reward: x{mults.CodingContractMoney.toFixed(3)}</Typography>
        ) : (
          <></>
        )}
        {mults.ClassGymExpGain !== defaultMultipliers.ClassGymExpGain ? (
          <Typography>Class/Gym exp: x{mults.ClassGymExpGain.toFixed(3)}</Typography>
        ) : (
          <></>
        )}
      </Box>
    </>
  );
}

function AugmentationMults({ mults }: IMultsProps): React.ReactElement {
  // is it empty check
  if (
    mults.AugmentationMoneyCost === defaultMultipliers.AugmentationMoneyCost &&
    mults.AugmentationRepCost === defaultMultipliers.AugmentationRepCost
  )
    return <></>;
  return (
    <>
      <br />
      <Typography variant={"h5"}>Augmentations:</Typography>
      <Box mx={1}>
        {mults.AugmentationMoneyCost !== defaultMultipliers.AugmentationMoneyCost ? (
          <Typography>Cost: x{mults.AugmentationMoneyCost.toFixed(3)}</Typography>
        ) : (
          <></>
        )}
        {mults.AugmentationRepCost !== defaultMultipliers.AugmentationRepCost ? (
          <Typography>Reputation: x{mults.AugmentationRepCost.toFixed(3)}</Typography>
        ) : (
          <></>
        )}
      </Box>
    </>
  );
}

function CompanyMults({ mults }: IMultsProps): React.ReactElement {
  // is it empty check
  if (
    mults.CompanyWorkExpGain === defaultMultipliers.CompanyWorkExpGain &&
    mults.CompanyWorkMoney === defaultMultipliers.CompanyWorkMoney
  )
    return <></>;
  return (
    <>
      <br />
      <Typography variant={"h5"}>Company:</Typography>
      <Box mx={1}>
        {mults.CompanyWorkMoney !== defaultMultipliers.CompanyWorkMoney ? (
          <Typography>Money: x{mults.CompanyWorkMoney.toFixed(3)}</Typography>
        ) : (
          <></>
        )}
        {mults.CompanyWorkExpGain !== defaultMultipliers.CompanyWorkExpGain ? (
          <Typography>Exp: x{mults.CompanyWorkExpGain.toFixed(3)}</Typography>
        ) : (
          <></>
        )}
      </Box>
    </>
  );
}

function StockMults({ mults }: IMultsProps): React.ReactElement {
  // is it empty check
  if (
    mults.FourSigmaMarketDataApiCost === defaultMultipliers.FourSigmaMarketDataApiCost &&
    mults.FourSigmaMarketDataCost === defaultMultipliers.FourSigmaMarketDataCost
  )
    return <></>;
  return (
    <>
      <br />
      <Typography variant={"h5"}>Stock market:</Typography>
      <Box mx={1}>
        {mults.FourSigmaMarketDataCost !== defaultMultipliers.FourSigmaMarketDataCost ? (
          <Typography>Market data cost: x{mults.FourSigmaMarketDataCost.toFixed(3)}</Typography>
        ) : (
          <></>
        )}
        {mults.FourSigmaMarketDataApiCost !== defaultMultipliers.FourSigmaMarketDataApiCost ? (
          <Typography>Market data API cost: x{mults.FourSigmaMarketDataApiCost.toFixed(3)}</Typography>
        ) : (
          <></>
        )}
      </Box>
    </>
  );
}

function FactionMults({ mults }: IMultsProps): React.ReactElement {
  // is it empty check
  if (
    mults.FactionPassiveRepGain === defaultMultipliers.FactionPassiveRepGain &&
    mults.FactionWorkExpGain === defaultMultipliers.FactionWorkExpGain &&
    mults.FactionWorkRepGain === defaultMultipliers.FactionWorkRepGain &&
    mults.RepToDonateToFaction === defaultMultipliers.RepToDonateToFaction
  )
    return <></>;
  return (
    <>
      <br />
      <Typography variant={"h5"}>Faction:</Typography>
      <Box mx={1}>
        {mults.RepToDonateToFaction !== defaultMultipliers.RepToDonateToFaction ? (
          <Typography>Favor to donate: x{mults.RepToDonateToFaction.toFixed(3)}</Typography>
        ) : (
          <></>
        )}
        {mults.FactionWorkRepGain !== defaultMultipliers.FactionWorkRepGain ? (
          <Typography>Work rep: x{mults.FactionWorkRepGain.toFixed(3)}</Typography>
        ) : (
          <></>
        )}
        {mults.FactionWorkExpGain !== defaultMultipliers.FactionWorkExpGain ? (
          <Typography>Work exp: x{mults.FactionWorkExpGain.toFixed(3)}</Typography>
        ) : (
          <></>
        )}
        {mults.FactionPassiveRepGain !== defaultMultipliers.FactionPassiveRepGain ? (
          <Typography>Passive rep: x{mults.FactionPassiveRepGain.toFixed(3)}</Typography>
        ) : (
          <></>
        )}
      </Box>
    </>
  );
}

function CrimeMults({ mults }: IMultsProps): React.ReactElement {
  // is it empty check
  if (mults.CrimeExpGain === defaultMultipliers.CrimeExpGain && mults.CrimeMoney === defaultMultipliers.CrimeMoney)
    return <></>;
  return (
    <>
      <br />
      <Typography variant={"h5"}>Crime:</Typography>
      <Box mx={1}>
        {mults.CrimeExpGain !== defaultMultipliers.CrimeExpGain ? (
          <Typography>Exp: x{mults.CrimeExpGain.toFixed(3)}</Typography>
        ) : (
          <></>
        )}
        {mults.CrimeMoney !== defaultMultipliers.CrimeMoney ? (
          <Typography>Money: x{mults.CrimeMoney.toFixed(3)}</Typography>
        ) : (
          <></>
        )}
      </Box>
    </>
  );
}

function SkillMults({ mults }: IMultsProps): React.ReactElement {
  // is it empty check
  if (
    mults.HackingLevelMultiplier === defaultMultipliers.HackingLevelMultiplier &&
    mults.AgilityLevelMultiplier === defaultMultipliers.AgilityLevelMultiplier &&
    mults.DefenseLevelMultiplier === defaultMultipliers.DefenseLevelMultiplier &&
    mults.DexterityLevelMultiplier === defaultMultipliers.DexterityLevelMultiplier &&
    mults.StrengthLevelMultiplier === defaultMultipliers.StrengthLevelMultiplier &&
    mults.CharismaLevelMultiplier === defaultMultipliers.CharismaLevelMultiplier
  )
    return <></>;
  return (
    <>
      <br />
      <Typography variant={"h5"}>Skills:</Typography>
      <Box mx={1}>
        {mults.HackingLevelMultiplier !== defaultMultipliers.HackingLevelMultiplier ? (
          <Typography>Hacking: x{mults.HackingLevelMultiplier.toFixed(3)}</Typography>
        ) : (
          <></>
        )}
        {mults.AgilityLevelMultiplier !== defaultMultipliers.AgilityLevelMultiplier ? (
          <Typography>Agility: x{mults.AgilityLevelMultiplier.toFixed(3)}</Typography>
        ) : (
          <></>
        )}
        {mults.DefenseLevelMultiplier !== defaultMultipliers.DefenseLevelMultiplier ? (
          <Typography>Defense: x{mults.DefenseLevelMultiplier.toFixed(3)}</Typography>
        ) : (
          <></>
        )}
        {mults.DexterityLevelMultiplier !== defaultMultipliers.DexterityLevelMultiplier ? (
          <Typography>Dexterity: x{mults.DexterityLevelMultiplier.toFixed(3)}</Typography>
        ) : (
          <></>
        )}
        {mults.StrengthLevelMultiplier !== defaultMultipliers.StrengthLevelMultiplier ? (
          <Typography>Strength: x{mults.StrengthLevelMultiplier.toFixed(3)}</Typography>
        ) : (
          <></>
        )}
        {mults.CharismaLevelMultiplier !== defaultMultipliers.CharismaLevelMultiplier ? (
          <Typography>Charisma: x{mults.CharismaLevelMultiplier.toFixed(3)}</Typography>
        ) : (
          <></>
        )}
      </Box>
    </>
  );
}

function HackingMults({ mults }: IMultsProps): React.ReactElement {
  // is it empty check
  if (
    mults.ServerGrowthRate === defaultMultipliers.ServerGrowthRate &&
    mults.ServerMaxMoney === defaultMultipliers.ServerMaxMoney &&
    mults.ServerStartingMoney === defaultMultipliers.ServerStartingMoney &&
    mults.ServerStartingSecurity === defaultMultipliers.ServerStartingSecurity &&
    mults.ServerWeakenRate === defaultMultipliers.ServerWeakenRate &&
    mults.ManualHackMoney === defaultMultipliers.ManualHackMoney &&
    mults.ScriptHackMoney === defaultMultipliers.ScriptHackMoney &&
    mults.ScriptHackMoneyGain === defaultMultipliers.ScriptHackMoneyGain &&
    mults.HackExpGain === defaultMultipliers.HackExpGain
  )
    return <></>;

  return (
    <>
      <br />
      <Typography variant={"h5"}>Hacking:</Typography>
      <Box mx={1}>
        {mults.HackExpGain !== defaultMultipliers.HackExpGain ? (
          <Typography>Exp: x{mults.HackExpGain.toFixed(3)}</Typography>
        ) : (
          <></>
        )}
        {mults.ServerGrowthRate !== defaultMultipliers.ServerGrowthRate ? (
          <Typography>Growth rate: x{mults.ServerGrowthRate.toFixed(3)}</Typography>
        ) : (
          <></>
        )}
        {mults.ServerMaxMoney !== defaultMultipliers.ServerMaxMoney ? (
          <Typography>Max money: x{mults.ServerMaxMoney.toFixed(3)}</Typography>
        ) : (
          <></>
        )}
        {mults.ServerStartingMoney !== defaultMultipliers.ServerStartingMoney ? (
          <Typography>Starting money: x{mults.ServerStartingMoney.toFixed(3)}</Typography>
        ) : (
          <></>
        )}
        {mults.ServerStartingSecurity !== defaultMultipliers.ServerStartingSecurity ? (
          <Typography>Starting security: x{mults.ServerStartingSecurity.toFixed(3)}</Typography>
        ) : (
          <></>
        )}
        {mults.ServerWeakenRate !== defaultMultipliers.ServerWeakenRate ? (
          <Typography>Weaken rate: x{mults.ServerWeakenRate.toFixed(3)}</Typography>
        ) : (
          <></>
        )}
        {mults.ManualHackMoney !== defaultMultipliers.ManualHackMoney ? (
          <Typography>Manual hack money: x{mults.ManualHackMoney.toFixed(3)}</Typography>
        ) : (
          <></>
        )}
        {mults.ScriptHackMoney !== defaultMultipliers.ScriptHackMoney ? (
          <Typography>Hack money stolen: x{mults.ScriptHackMoney.toFixed(3)}</Typography>
        ) : (
          <></>
        )}
        {mults.ScriptHackMoneyGain !== defaultMultipliers.ScriptHackMoneyGain ? (
          <Typography>Money gained from hack: x{mults.ScriptHackMoneyGain.toFixed(3)}</Typography>
        ) : (
          <></>
        )}
      </Box>
    </>
  );
}

function PurchasedServersMults({ mults }: IMultsProps): React.ReactElement {
  // is it empty check
  if (
    mults.PurchasedServerCost === defaultMultipliers.PurchasedServerCost &&
    mults.PurchasedServerSoftcap === defaultMultipliers.PurchasedServerSoftcap &&
    mults.PurchasedServerLimit === defaultMultipliers.PurchasedServerLimit &&
    mults.PurchasedServerMaxRam === defaultMultipliers.PurchasedServerMaxRam &&
    mults.HomeComputerRamCost === defaultMultipliers.HomeComputerRamCost
  )
    return <></>;
  return (
    <>
      <br />
      <Typography variant={"h5"}>Purchased servers:</Typography>
      <Box mx={1}>
        {mults.PurchasedServerCost !== defaultMultipliers.PurchasedServerCost ? (
          <Typography>Base cost: {mults.PurchasedServerCost.toFixed(3)}</Typography>
        ) : (
          <></>
        )}
        {mults.PurchasedServerSoftcap !== defaultMultipliers.PurchasedServerSoftcap ? (
          <Typography>Softcap cost: {mults.PurchasedServerSoftcap.toFixed(3)}</Typography>
        ) : (
          <></>
        )}
        {mults.PurchasedServerLimit !== defaultMultipliers.PurchasedServerLimit ? (
          <Typography>Limit: x{mults.PurchasedServerLimit.toFixed(3)}</Typography>
        ) : (
          <></>
        )}
        {mults.PurchasedServerMaxRam !== defaultMultipliers.PurchasedServerMaxRam ? (
          <Typography>Max ram: x{mults.PurchasedServerMaxRam.toFixed(3)}</Typography>
        ) : (
          <></>
        )}
        {mults.HomeComputerRamCost !== defaultMultipliers.HomeComputerRamCost ? (
          <Typography>Home ram cost: x{mults.HomeComputerRamCost.toFixed(3)}</Typography>
        ) : (
          <></>
        )}
      </Box>
    </>
  );
}

function InfiltrationMults({ mults }: IMultsProps): React.ReactElement {
  // is it empty check
  if (
    mults.InfiltrationMoney === defaultMultipliers.InfiltrationMoney &&
    mults.InfiltrationRep === defaultMultipliers.InfiltrationRep
  )
    return <></>;
  return (
    <>
      <br />
      <Typography variant={"h5"}>Infiltration:</Typography>
      <Box mx={1}>
        {mults.InfiltrationMoney !== defaultMultipliers.InfiltrationMoney ? (
          <Typography>Money: {mults.InfiltrationMoney.toFixed(3)}</Typography>
        ) : (
          <></>
        )}
        {mults.InfiltrationRep !== defaultMultipliers.InfiltrationRep ? (
          <Typography>Reputation: x{mults.InfiltrationRep.toFixed(3)}</Typography>
        ) : (
          <></>
        )}
      </Box>
    </>
  );
}

function BladeburnerMults({ n, mults }: IMultsProps): React.ReactElement {
  const player = use.Player();
  // access check
  if (n !== 6 && n !== 7 && player.sourceFileLvl(6) === 0) return <></>;
  //default mults check
  if (mults.BladeburnerRank === 1 && mults.BladeburnerSkillCost === 1) return <></>;
  return (
    <>
      <br />
      <Typography variant={"h5"}>Bladeburner:</Typography>
      <Box mx={1}>
        {mults.BladeburnerRank !== 1 ? <Typography>Rank gain: x{mults.BladeburnerRank.toFixed(3)}</Typography> : <></>}
        {mults.BladeburnerSkillCost !== 1 ? (
          <Typography>Skill cost: x{mults.BladeburnerSkillCost.toFixed(3)}</Typography>
        ) : (
          <></>
        )}
      </Box>
    </>
  );
}

function StanekMults({ n, mults }: IMultsProps): React.ReactElement {
  const player = use.Player();
  // access check
  if (n !== 13 && player.sourceFileLvl(13) === 0) return <></>;
  //default mults check
  if (
    mults.StaneksGiftExtraSize === defaultMultipliers.StaneksGiftExtraSize &&
    mults.StaneksGiftPowerMultiplier === defaultMultipliers.StaneksGiftPowerMultiplier
  )
    return <></>;

  const s = mults.StaneksGiftExtraSize;
  return (
    <>
      <br />
      <Typography variant={"h5"}>Stanek's Gift:</Typography>
      <Box mx={1}>
        {mults.StaneksGiftPowerMultiplier !== defaultMultipliers.StaneksGiftPowerMultiplier ? (
          <Typography>Gift power: x{mults.StaneksGiftPowerMultiplier.toFixed(3)}</Typography>
        ) : (
          <></>
        )}
        {s !== defaultMultipliers.StaneksGiftExtraSize ? (
          <Typography>Base size modifier: {s > defaultMultipliers.StaneksGiftExtraSize ? `+${s}` : s}</Typography>
        ) : (
          <></>
        )}
      </Box>
    </>
  );
}

function GangMults({ n, mults }: IMultsProps): React.ReactElement {
  const player = use.Player();
  // access check
  if (n !== 2 && player.sourceFileLvl(2) === 0) return <></>;
  // is it empty check
  if (
    mults.GangSoftcap === defaultMultipliers.GangSoftcap &&
    mults.GangUniqueAugs === defaultMultipliers.GangUniqueAugs
  )
    return <></>;
  return (
    <>
      <br />
      <Typography variant={"h5"}>Gang:</Typography>
      <Box mx={1}>
        {mults.GangSoftcap !== defaultMultipliers.GangSoftcap ? (
          <Typography>Softcap: {mults.GangSoftcap.toFixed(3)}</Typography>
        ) : (
          <></>
        )}
        {mults.GangUniqueAugs !== defaultMultipliers.GangUniqueAugs ? (
          <Typography>Unique augs: x{mults.GangUniqueAugs.toFixed(3)}</Typography>
        ) : (
          <></>
        )}
      </Box>
    </>
  );
}

function CorporationMults({ n, mults }: IMultsProps): React.ReactElement {
  const player = use.Player();
  // access check
  if (n !== 3 && player.sourceFileLvl(3) === 0) return <></>;
  // is it empty check
  if (
    mults.CorporationSoftcap === defaultMultipliers.CorporationSoftcap &&
    mults.CorporationValuation === defaultMultipliers.CorporationValuation
  )
    return <></>;

  return (
    <>
      <br />
      <Typography variant={"h5"}>Corporation:</Typography>
      <Box mx={1}>
        {mults.CorporationSoftcap !== defaultMultipliers.CorporationSoftcap ? (
          <Typography>Softcap: {mults.CorporationSoftcap.toFixed(3)}</Typography>
        ) : (
          <></>
        )}
        {mults.CorporationValuation !== defaultMultipliers.CorporationValuation ? (
          <Typography>Valuation: x{mults.CorporationValuation.toFixed(3)}</Typography>
        ) : (
          <></>
        )}
      </Box>
    </>
  );
}
