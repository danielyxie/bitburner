import React, { useState, useEffect } from "react";
import { convertTimeMsToTimeElapsedString } from "../../utils/StringHelperFunctions";
import { CONSTANTS } from "../../Constants";
import { StaneksGiftEvents } from "../StaneksGiftEvents";
import { MainBoard } from "./MainBoard";
import { IStaneksGift } from "../IStaneksGift";
import { Info } from "@mui/icons-material";
import { dialogBoxCreate } from "../../ui/React/DialogBox";
import Typography from "@mui/material/Typography";
// import { ActiveFragment } from "../ActiveFragment";
// import { Fragments } from "../Fragment";
// import { DummyGrid } from "./DummyGrid";

type IProps = {
  staneksGift: IStaneksGift;
};

export function StaneksGiftRoot({ staneksGift }: IProps): React.ReactElement {
  const setRerender = useState(true)[1];
  function rerender(): void {
    setRerender((o) => !o);
  }
  useEffect(() => StaneksGiftEvents.subscribe(rerender), []);
  return (
    <>
      <Typography variant="h4">
        Stanek's Gift
        <Info
          sx={{ ml: 1, mb: 0 }}
          color="info"
          onClick={() =>
            dialogBoxCreate(
              <>
                <Typography>
                  Stanek's Gift is a powerful, unique augmentation obtained by joining the Church of the Machine God,
                  which can be found in Chongqing. It is only possible to join the church if you are in BitNode 13 or
                  possess at least one level of Source File 13, and you will be turned away if you have purchased or
                  installed any augmentations beside NeuroFlux Governors. You are, however, permitted to install
                  augmentations as normal once you have joined the church.
                </Typography>
                <br />
                <Typography>
                  Initially, those bearing the gift will find that its overwhelming power worsens all of their stats by
                  10%. This penalty can be overcome in time by receiving free upgrades from the Church of the Machine
                  God faction, but the reputation requirements for these upgrades are steep, and you can only obtain
                  reputation with the church by charging the gift.
                </Typography>
                <br />
                <Typography>
                  In order to charge Stanek's Gift, the user must first arrange stat-modifying fragments within the grid
                  located on the device. This may be done manually or by scripts that utilize the Stanek's Gift
                  Netscript API. Not every tile of the grid must house a fragment, but fragments cannot overlap or
                  otherwise share tiles. Fragments can be rotated, but their design does not allow them to be flipped
                  around to mirror their original shape. Note that the size of the grid is determined by the BitNode you
                  are currently in and the level of your Source File 13, if applicable.
                </Typography>
                <br />
                <Typography>
                  There exist two kinds of fragments. The first are Stat Fragments, which take up 4 tiles of the grid.
                  Each Stat Fragment is unique, and there is only one of each. There is no way to obtain more of these
                  fragments. Each Stat Fragment has an associated stat that it will improve, as well as a multiplier on
                  its effectiveness known as power. When initially placed, a Stat Fragment will have no effect. In order
                  for the fragment to gain stat boosts, it must be charged. The other kind of fragments are known as
                  Booster Fragments, which take up 5 tiles of the grid. There is no shortage of Booster Fragments, and
                  it is virtually impossible to run out of them. While not providing any direct stat increases to their
                  user, Stat Fragments increase the efficacy of adjacent Stat Fragments by 10%, and do not need to be
                  charged.
                </Typography>

                {/*
                <DummyGrid
                  width={4}
                  height={4}
                  fragments={[
                    new ActiveFragment({
                      x: 0,
                      y: 0,
                      rotation: 0,
                      fragment: Fragments.find((f) => f.id === 5) ?? Fragments[0],
                    }),
                    new ActiveFragment({
                      x: 0,
                      y: 2,
                      rotation: 0,
                      fragment: Fragments.find((f) => f.id === 101) ?? Fragments[0],
                    }),
                  ]}
                />
                <Typography sx={{ fontStyle: "italic" }}>
                  This boost provides a bonus to the touching fragment
                </Typography>

                <DummyGrid
                  width={4}
                  height={4}
                  fragments={[
                    new ActiveFragment({
                      x: 0,
                      y: 1,
                      rotation: 3,
                      fragment: Fragments.find((f) => f.id === 100) ?? Fragments[0],
                    }),
                    new ActiveFragment({
                      x: 0,
                      y: 0,
                      rotation: 2,
                      fragment: Fragments.find((f) => f.id === 1) ?? Fragments[0],
                    }),
                  ]}
                />
                <Typography sx={{ fontStyle: "italic" }}>
                  Even though the booster touches many tiles, the bonus is only applied once.
                </Typography>

                <DummyGrid
                  width={4}
                  height={4}
                  fragments={[
                    new ActiveFragment({
                      x: 0,
                      y: 0,
                      rotation: 0,
                      fragment: Fragments.find((f) => f.id === 5) ?? Fragments[0],
                    }),
                    new ActiveFragment({
                      x: 2,
                      y: 0,
                      rotation: 0,
                      fragment: Fragments.find((f) => f.id === 105) ?? Fragments[0],
                    }),
                  ]}
                />
                <Typography sx={{ fontStyle: "italic" }}>
                  Even though the booster touches many tiles, the bonus is only applied once.
                </Typography>

                <DummyGrid
                  width={4}
                  height={4}
                  fragments={[
                    new ActiveFragment({
                      x: 0,
                      y: 0,
                      rotation: 1,
                      fragment: Fragments.find((f) => f.id === 27) ?? Fragments[0],
                    }),
                    new ActiveFragment({
                      x: 0,
                      y: 1,
                      rotation: 2,
                      fragment: Fragments.find((f) => f.id === 100) ?? Fragments[0],
                    }),
                    new ActiveFragment({
                      x: 2,
                      y: 0,
                      rotation: 1,
                      fragment: Fragments.find((f) => f.id === 30) ?? Fragments[0],
                    }),
                  ]}
                />
                <Typography sx={{ fontStyle: "italic" }}>
                  This booster provides bonus to all fragment it touches.
                </Typography>
                */}

                <br />
                <Typography>
                  Stat Fragments are charged using the stanek.chargeFragment(rootX, rootY) NetScript API function. The
                  charging process ordinarily takes 1000ms to complete, but only takes 200ms during bonus time. When the
                  function finishes executing, the fragment's charge levels will be raised by an amount corresponding to
                  the number of threads that were used. Note that it is no more effective to charge a fragment many
                  times with few threads than to charge few times with many threads, so there is no need to distribute
                  charging jobs across multiple scripts. As a Stat Fragment's charge level is increased, its bonuses
                  will increase, but there will be diminishing returns. As such, it is generally most efficient to
                  charge all of the placed fragments equally. The charge level of a fragment will not decrease over
                  time, but it will be reset to 0 upon removing it from the board or installing augmentations.
                </Typography>
              </>,
            )
          }
        />
      </Typography>

      <Typography>
        The gift is a grid on which you can place upgrades called fragments. The main type of fragment increases a stat,
        like your hacking skill or agility exp. Once a stat fragment is placed it then needs to be charged via scripts
        in order to become useful. The other kind of fragments are called booster fragments. They increase the
        efficiency of the neighboring fragments (not diagonally). Use Q/E to rotate fragments.
      </Typography>
      {staneksGift.storedCycles > 5 && (
        <Typography>
          Bonus time: {convertTimeMsToTimeElapsedString(CONSTANTS._idleSpeed * staneksGift.storedCycles)}
        </Typography>
      )}
      <MainBoard gift={staneksGift} />
    </>
  );
}
