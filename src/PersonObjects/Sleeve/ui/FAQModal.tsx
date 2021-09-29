import React from "react";

import { Modal } from "../../../ui/React/Modal";
import Typography from "@mui/material/Typography";

interface IProps {
  open: boolean;
  onClose: () => void;
}

export function FAQModal({ open, onClose }: IProps): React.ReactElement {
  return (
    <Modal open={open} onClose={onClose}>
      <>
        <Typography variant="h4">How do Duplicate Sleeves work?</Typography>
        <br />
        <Typography>
          Duplicate Sleeves are essentially clones. You can use them to perform any work type action, such as working
          for a company/faction or committing a crime. Having sleeves perform these tasks earns you money, experience,
          and reputation.
        </Typography>
        <br />
        <br />
        <Typography>
          Sleeves are their own individuals, which means they each have their own experience and stats.
        </Typography>
        <br />
        <br />
        <Typography>
          When a sleeve earns experience, it earns experience for itself, the player's original 'consciousness', as well
          as all of the player's other sleeves.
        </Typography>
        <br />
        <br />
        <Typography variant="h4">What is Synchronization (Sync)?</Typography>
        <br />
        <Typography>
          Synchronization is a measure of how aligned your consciousness is with that of your Duplicate Sleeves. It is a
          numerical value between 1 and 100, and it affects how much experience is earned when the sleeve is performing
          a task.
        </Typography>
        <br />
        <br />
        <Typography>
          Let N be the sleeve's synchronization. When the sleeve earns experience by performing a task, both the sleeve
          and the player's original host consciousness earn N% of the amount of experience normally earned by the task.
          All of the player's other sleeves earn ((N/100)^2 * 100)% of the experience.
        </Typography>
        <br />
        <br />
        <Typography>Synchronization can be increased by assigning sleeves to the 'Synchronize' task.</Typography>
        <br />
        <br />
        <Typography variant="h4">What is Shock?</Typography>
        <br />
        <Typography>
          Sleeve shock is a measure of how much trauma the sleeve has due to being placed in a new body. It is a
          numerical value between 0 and 99, where 99 indicates full shock and 0 indicates no shock. Shock affects the
          amount of experience earned by the sleeve.
        </Typography>
        <br />
        <br />
        <Typography>
          Sleeve shock slowly decreases over time. You can further increase the rate at which it decreases by assigning
          sleeves to the 'Shock Recovery' task.
        </Typography>
        <br />
        <br />
        <Typography variant="h4">Why can't I work for this company or faction?</Typography>
        <br />
        <Typography>
          Only one of your sleeves can work for a given company/faction a time. To clarify further, if you have two
          sleeves they can work for two different companies, but they cannot both work for the same company.
        </Typography>
        <br />
        <br />
        <Typography variant="h4">Why did my Sleeve stop working?</Typography>
        <br />
        <Typography>
          Sleeves are subject to the same time restrictions as you. This means that they automatically stop working at a
          company after 8 hours, and stop working for a faction after 20 hours.
        </Typography>
        <br />
        <br />
        <Typography variant="h4">How do I buy Augmentations for my Sleeves?</Typography>
        <br />
        <Typography>Your Sleeve needs to have a Shock of 0 in order for you to buy Augmentations for it.</Typography>
        <br />
        <br />
        <Typography variant="h4">Why can't I buy the X Augmentation for my sleeve?</Typography>
        <br />
        <Typography>
          Certain Augmentations, like Bladeburner-specific ones and NeuroFlux Governor, are not available for sleeves.
        </Typography>
        <br />
        <br />
        <Typography variant="h4">Do sleeves get reset when installing Augmentations or switching BitNodes?</Typography>
        <br />
        <Typography>Sleeves are reset when switching BitNodes, but not when installing Augmentations.</Typography>
        <br />
        <br />
        <Typography variant="h4">What is Memory?</Typography>
        <br />
        <Typography>
          Sleeve memory dictates what a sleeve's synchronization will be when its reset by switching BitNodes. For
          example, if a sleeve has a memory of 25, then when you switch BitNodes its synchronization will initially be
          set to 25, rather than 1.
        </Typography>
        <br />
        <br />
        <Typography>
          Memory can only be increased by purchasing upgrades from The Covenant. It is a persistent stat, meaning it
          never gets resets back to 1. The maximum possible value for a sleeve's memory is 100.
        </Typography>
      </>
    </Modal>
  );
}
