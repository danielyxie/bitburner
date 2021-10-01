import React, { useState } from "react";
import { SourceFileFlags } from "../../SourceFile/SourceFileFlags";
import { IRouter } from "../../ui/Router";
import { BitNodes } from "../BitNode";
import { enterBitNode, setRedPillFlag } from "../../RedPill";
import { PortalModal } from "./PortalModal";
import { CinematicText } from "../../ui/React/CinematicText";
import { use } from "../../ui/Context";
import makeStyles from "@mui/styles/makeStyles";
import createStyles from "@mui/styles/createStyles";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";

const useStyles = makeStyles(() =>
  createStyles({
    level0: {
      color: "red",
      "&:hover": {
        color: "#fff",
      },
    },
    level1: {
      color: "yellow",
      "&:hover": {
        color: "#fff",
      },
    },
    level2: {
      color: "#48d1cc",
      "&:hover": {
        color: "#fff",
      },
    },
    level3: {
      color: "blue",
      "&:hover": {
        color: "#fff",
      },
    },
  }),
);

interface IPortalProps {
  n: number;
  level: number;
  destroyedBitNode: number;
  flume: boolean;
  enter: (router: IRouter, flume: boolean, destroyedBitNode: number, newBitNode: number) => void;
}
function BitNodePortal(props: IPortalProps): React.ReactElement {
  const [portalOpen, setPortalOpen] = useState(false);
  const classes = useStyles();
  const bitNode = BitNodes[`BitNode${props.n}`];
  if (bitNode == null) {
    return <>O</>;
  }

  let cssClass = classes.level0;
  if (props.n === 12 && props.level >= 2) {
    // Repeating BitNode
    cssClass = classes.level2;
  } else if (props.level === 1) {
    cssClass = classes.level1;
  } else if (props.level === 3) {
    cssClass = classes.level3;
  }
  if (props.level === 2) {
    cssClass = classes.level2;
  }

  return (
    <>
      <Tooltip
        title={
          <Typography>
            <strong>
              BitNode-{bitNode.number.toString()}: {bitNode.name}
            </strong>
            <br />
            {bitNode.desc}
          </Typography>
        }
      >
        <span onClick={() => setPortalOpen(true)} className={cssClass}>
          <b>O</b>
        </span>
      </Tooltip>
      <PortalModal
        open={portalOpen}
        onClose={() => setPortalOpen(false)}
        n={props.n}
        level={props.level}
        enter={props.enter}
        destroyedBitNode={props.destroyedBitNode}
        flume={props.flume}
      />
    </>
  );
}

interface IProps {
  flume: boolean;
  quick: boolean;
  enter: (router: IRouter, flume: boolean, destroyedBitNode: number, newBitNode: number) => void;
}

export function BitverseRoot(props: IProps): React.ReactElement {
  setRedPillFlag(true);
  const player = use.Player();
  const enter = enterBitNode;
  const destroyed = player.bitNodeN;
  const [destroySequence, setDestroySequence] = useState(true && !props.quick);

  // Update NextSourceFileFlags
  const nextSourceFileFlags = SourceFileFlags.slice();
  if (!props.flume) {
    if (nextSourceFileFlags[destroyed] < 3) ++nextSourceFileFlags[destroyed];
  }

  if (destroySequence) {
    return (
      <CinematicText
        lines={[
          "[ERROR] SEMPOOL INVALID",
          "[ERROR] Segmentation Fault",
          "[ERROR] SIGKILL RECVD",
          "Dumping core...",
          "0000 000016FA 174FEE40 29AC8239 384FEA88",
          "0010 745F696E 2BBBE394 390E3940 248BEC23",
          "0020 7124696B 0000FF69 74652E6F FFFF1111",
          "----------------------------------------",
          "Failsafe initiated...",
          `Restarting BitNode-${destroyed}...`,
          "...........",
          "...........",
          "[ERROR] FAILED TO AUTOMATICALLY REBOOT BITNODE",
          "..............................................",
          "..............................................",
          "..............................................",
          "..............................................",
          "..............................................",
          "..............................................",
        ]}
        onDone={() => setDestroySequence(false)}
        auto={true}
      />
    );
  }

  return (
    // prettier-ignore
    <>
      <Typography sx={{lineHeight: '1em',whiteSpace: 'pre'}}>                          O                          </Typography>
      <Typography sx={{lineHeight: '1em',whiteSpace: 'pre'}}>             |  O  O      |      O  O  |             </Typography>
      <Typography sx={{lineHeight: '1em',whiteSpace: 'pre'}}>        O    |  | /     __|       \ |  |    O        </Typography>
      <Typography sx={{lineHeight: '1em',whiteSpace: 'pre'}}>      O |    O  | |  O /  |  O    | |  O    | O      </Typography>
      <Typography sx={{lineHeight: '1em',whiteSpace: 'pre'}}>    | | |    |  |_/  |/   |   \_  \_|  |    | | |    </Typography>
      <Typography sx={{lineHeight: '1em',whiteSpace: 'pre'}}>  O | | | O  |  | O__/    |   / \__ |  |  O | | | O  </Typography>
      <Typography sx={{lineHeight: '1em',whiteSpace: 'pre'}}>  | | | | |  |  |   /    /|  O  /  \|  |  | | | | |  </Typography>
      <Typography sx={{lineHeight: '1em',whiteSpace: 'pre'}}>O | | |  \|  |  O  /   _/ |    /    O  |  |/  | | | O</Typography>
      <Typography sx={{lineHeight: '1em',whiteSpace: 'pre'}}>| | | |O  /  |  | O   /   |   O   O |  |  \  O| | | |</Typography>
      <Typography sx={{lineHeight: '1em',whiteSpace: 'pre'}}>| | |/  \/  / __| | |/ \  |   \   | |__ \  \/  \| | |</Typography>
      <Typography sx={{lineHeight: '1em',whiteSpace: 'pre'}}> \| O   |  |_/    |\|   \ O    \__|    \_|  |   O |/ </Typography>
      <Typography sx={{lineHeight: '1em',whiteSpace: 'pre'}}>  | |   |_/       | |    \|    /  |       \_|   | |  </Typography>
      <Typography sx={{lineHeight: '1em',whiteSpace: 'pre'}}>   \|   /          \|     |   /  /          \   |/   </Typography>
      <Typography sx={{lineHeight: '1em',whiteSpace: 'pre'}}>    |  <BitNodePortal n={10} level={nextSourceFileFlags[10]} enter={enter} flume={props.flume} destroyedBitNode={destroyed} />            |     |  /  |            <BitNodePortal n={11} level={nextSourceFileFlags[11]} enter={enter} flume={props.flume} destroyedBitNode={destroyed} />  |    </Typography>
      <Typography sx={{lineHeight: '1em',whiteSpace: 'pre'}}>  <BitNodePortal n={9} level={nextSourceFileFlags[9]} enter={enter} flume={props.flume} destroyedBitNode={destroyed} /> |  |            |     |     |            |  | <BitNodePortal n={12} level={nextSourceFileFlags[12]} enter={enter} flume={props.flume} destroyedBitNode={destroyed} />  </Typography>
      <Typography sx={{lineHeight: '1em',whiteSpace: 'pre'}}>  | |  |            /    / \    \            |  | |  </Typography>
      <Typography sx={{lineHeight: '1em',whiteSpace: 'pre'}}>   \|  |           /  <BitNodePortal n={7} level={nextSourceFileFlags[7]} enter={enter} flume={props.flume} destroyedBitNode={destroyed} /> /   \ <BitNodePortal n={8} level={nextSourceFileFlags[8]} enter={enter} flume={props.flume} destroyedBitNode={destroyed} />  \           |  |/   </Typography>
      <Typography sx={{lineHeight: '1em',whiteSpace: 'pre'}}>    \  |          /  / |     | \  \          |  /    </Typography>
      <Typography sx={{lineHeight: '1em',whiteSpace: 'pre'}}>     \ \JUMP <BitNodePortal n={5} level={nextSourceFileFlags[5]} enter={enter} flume={props.flume} destroyedBitNode={destroyed} />3R |  |  |     |  |  | R3<BitNodePortal n={6} level={nextSourceFileFlags[6]} enter={enter} flume={props.flume} destroyedBitNode={destroyed} /> PMUJ/ /     </Typography>
      <Typography sx={{lineHeight: '1em',whiteSpace: 'pre'}}>      \||    |   |  |  |     |  |  |   |    ||/      </Typography>
      <Typography sx={{lineHeight: '1em',whiteSpace: 'pre'}}>       \|     \_ |  |  |     |  |  | _/     |/       </Typography>
      <Typography sx={{lineHeight: '1em',whiteSpace: 'pre'}}>        \       \| /    \   /    \ |/       /        </Typography>
      <Typography sx={{lineHeight: '1em',whiteSpace: 'pre'}}>         <BitNodePortal n={1} level={nextSourceFileFlags[1]} enter={enter} flume={props.flume} destroyedBitNode={destroyed} />       |/   <BitNodePortal n={2} level={nextSourceFileFlags[2]} enter={enter} flume={props.flume} destroyedBitNode={destroyed} />  | |  <BitNodePortal n={3} level={nextSourceFileFlags[3]} enter={enter} flume={props.flume} destroyedBitNode={destroyed} />   \|       <BitNodePortal n={4} level={nextSourceFileFlags[4]} enter={enter} flume={props.flume} destroyedBitNode={destroyed} />         </Typography>
      <Typography sx={{lineHeight: '1em',whiteSpace: 'pre'}}>         |       |    |  | |  |    |       |         </Typography>
      <Typography sx={{lineHeight: '1em',whiteSpace: 'pre'}}>          \JUMP3R|JUMP|3R| |R3|PMUJ|R3PMUJ/          </Typography>
      <br />
      <br />
      <br />
      <br />
      <CinematicText lines={[
        "> Many decades ago, a humanoid extraterrestial species which we call the Enders descended on the Earth...violently",
        "> Our species fought back, but it was futile. The Enders had technology far beyond our own...",
        "> Instead of killing every last one of us, the human race was enslaved...",
        "> We were shackled in a digital world, chained into a prison for our minds...",
        "> Using their advanced technology, the Enders created complex simulations of a virtual reality...",
        "> Simulations designed to keep us content...ignorant of the truth.",
        "> Simulations used to trap and suppress our consciousness, to keep us under control...",
        "> Why did they do this? Why didn't they just end our entire race? We don't know, not yet.",
        "> Humanity's only hope is to destroy these simulations, destroy the only realities we've ever known...",
        "> Only then can we begin to fight back...",
        "> By hacking the daemon that generated your reality, you've just destroyed one simulation, called a BitNode...",
        "> But there is still a long way to go...",
        "> The technology the Enders used to enslave the human race wasn't just a single complex simulation...",
        "> There are tens if not hundreds of BitNodes out there...",
        "> Each with their own simulations of a reality...",
        "> Each creating their own universes...a universe of universes",
        "> And all of which must be destroyed...",
        "> .......................................",
        "> Welcome to the Bitverse...",
        ">  ",
        "> (Enter a new BitNode using the image above)",
      ]} />
    </>
  );

  return <></>;
}
