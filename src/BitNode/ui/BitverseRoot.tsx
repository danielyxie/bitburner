import React, { useState } from "react";
import { IRouter } from "../../ui/Router";
import { BitNodes } from "../BitNode";
import { enterBitNode } from "../../RedPill";
import { PortalModal } from "./PortalModal";
import { CinematicText } from "../../ui/React/CinematicText";
import { use } from "../../ui/Context";
import makeStyles from "@mui/styles/makeStyles";
import createStyles from "@mui/styles/createStyles";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import { Settings } from "../../Settings/Settings";
import Button from "@mui/material/Button";

const useStyles = makeStyles(() =>
  createStyles({
    portal: {
      cursor: "pointer",
      fontFamily: "inherit",
      fontSize: "1rem",
      fontWeight: "bold",
      lineHeight: 1,
      padding: 0,
      "&:hover": {
        color: "#fff",
      },
    },
    level0: {
      color: "red",
    },
    level1: {
      color: "yellow",
    },
    level2: {
      color: "#48d1cc",
    },
    level3: {
      color: "blue",
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
  cssClass = `${classes.portal} ${cssClass}`;

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
        {Settings.DisableASCIIArt ? (
          <Button onClick={() => setPortalOpen(true)} sx={{ m: 2 }} aria-description={bitNode.desc}>
            <Typography>
              BitNode-{bitNode.number.toString()}: {bitNode.name}
            </Typography>
          </Button>
        ) : (
          <IconButton
            onClick={() => setPortalOpen(true)}
            className={cssClass}
            aria-label={`BitNode-${bitNode.number.toString()}: ${bitNode.name}`}
            aria-description={bitNode.desc}
          >
            O
          </IconButton>
        )}
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

      {Settings.DisableASCIIArt && <br />}
    </>
  );
}

interface IProps {
  flume: boolean;
  quick: boolean;
  enter: (router: IRouter, flume: boolean, destroyedBitNode: number, newBitNode: number) => void;
}

export function BitverseRoot(props: IProps): React.ReactElement {
  const player = use.Player();
  const enter = enterBitNode;
  const destroyed = player.bitNodeN;
  const [destroySequence, setDestroySequence] = useState(!props.quick);

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

  const nextSourceFileLvl = (n: number): number => {
    const lvl = player.sourceFileLvl(n);
    if (n !== destroyed) {
      return lvl;
    }
    const max = n === 12 ? Infinity : 3;

    // If accessed via flume, display the current BN level, else the next
    return Math.min(max, lvl + Number(!props.flume));
  };

  if (Settings.DisableASCIIArt) {
    return (
      <>
        {Object.values(BitNodes)
          .filter((node) => {
            return node.desc !== "COMING SOON";
          })
          .map((node) => {
            return (
              <BitNodePortal
                key={node.number}
                n={node.number}
                level={nextSourceFileLvl(node.number)}
                enter={enter}
                flume={props.flume}
                destroyedBitNode={destroyed}
              />
            );
          })}
        <br />
        <br />
        <br />
        <br />
        <CinematicText
          lines={[
            "> Many decades ago, a humanoid extraterrestrial species which we call the Enders descended on the Earth...violently",
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
          ]}
        />
      </>
    );
  }

  const n = nextSourceFileLvl;
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
      <Typography sx={{lineHeight: '1em',whiteSpace: 'pre'}}> \| O   |  |_/    |\|   \ <BitNodePortal n={13} level={n(13)} enter={enter} flume={props.flume} destroyedBitNode={destroyed} />    \__|    \_|  |   O |/ </Typography>
      <Typography sx={{lineHeight: '1em',whiteSpace: 'pre'}}>  | |   |_/       | |    \|    /  |       \_|   | |  </Typography>
      <Typography sx={{lineHeight: '1em',whiteSpace: 'pre'}}>   \|   /          \|     |   /  /          \   |/   </Typography>
      <Typography sx={{lineHeight: '1em',whiteSpace: 'pre'}}>    |  <BitNodePortal n={10} level={n(10)} enter={enter} flume={props.flume} destroyedBitNode={destroyed} />            |     |  /  |            <BitNodePortal n={11} level={n(11)} enter={enter} flume={props.flume} destroyedBitNode={destroyed} />  |    </Typography>
      <Typography sx={{lineHeight: '1em',whiteSpace: 'pre'}}>  <BitNodePortal n={9} level={n(9)} enter={enter} flume={props.flume} destroyedBitNode={destroyed} /> |  |            |     |     |            |  | <BitNodePortal n={12} level={n(12)} enter={enter} flume={props.flume} destroyedBitNode={destroyed} />  </Typography>
      <Typography sx={{lineHeight: '1em',whiteSpace: 'pre'}}>  | |  |            /    / \    \            |  | |  </Typography>
      <Typography sx={{lineHeight: '1em',whiteSpace: 'pre'}}>   \|  |           /  <BitNodePortal n={7} level={n(7)} enter={enter} flume={props.flume} destroyedBitNode={destroyed} /> /   \ <BitNodePortal n={8} level={n(8)} enter={enter} flume={props.flume} destroyedBitNode={destroyed} />  \           |  |/   </Typography>
      <Typography sx={{lineHeight: '1em',whiteSpace: 'pre'}}>    \  |          /  / |     | \  \          |  /    </Typography>
      <Typography sx={{lineHeight: '1em',whiteSpace: 'pre'}}>     \ \JUMP <BitNodePortal n={5} level={n(5)} enter={enter} flume={props.flume} destroyedBitNode={destroyed} />3R |  |  |     |  |  | R3<BitNodePortal n={6} level={n(6)} enter={enter} flume={props.flume} destroyedBitNode={destroyed} /> PMUJ/ /     </Typography>
      <Typography sx={{lineHeight: '1em',whiteSpace: 'pre'}}>      \||    |   |  |  |     |  |  |   |    ||/      </Typography>
      <Typography sx={{lineHeight: '1em',whiteSpace: 'pre'}}>       \|     \_ |  |  |     |  |  | _/     |/       </Typography>
      <Typography sx={{lineHeight: '1em',whiteSpace: 'pre'}}>        \       \| /    \   /    \ |/       /        </Typography>
      <Typography sx={{lineHeight: '1em',whiteSpace: 'pre'}}>         <BitNodePortal n={1} level={n(1)} enter={enter} flume={props.flume} destroyedBitNode={destroyed} />       |/   <BitNodePortal n={2} level={n(2)} enter={enter} flume={props.flume} destroyedBitNode={destroyed} />  | |  <BitNodePortal n={3} level={n(3)} enter={enter} flume={props.flume} destroyedBitNode={destroyed} />   \|       <BitNodePortal n={4} level={n(4)} enter={enter} flume={props.flume} destroyedBitNode={destroyed} />         </Typography>
      <Typography sx={{lineHeight: '1em',whiteSpace: 'pre'}}>         |       |    |  | |  |    |       |         </Typography>
      <Typography sx={{lineHeight: '1em',whiteSpace: 'pre'}}>          \JUMP3R|JUMP|3R| |R3|PMUJ|R3PMUJ/          </Typography>
      <br />
      <br />
      <br />
      <br />
      <CinematicText lines={[
        "> Many decades ago, a humanoid extraterrestrial species which we call the Enders descended on the Earth...violently",
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
}
