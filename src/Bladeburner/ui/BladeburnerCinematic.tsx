import React from "react";
import { use } from "../../ui/Context";
import { CinematicText } from "../../ui/React/CinematicText";
import { dialogBoxCreate } from "../../ui/React/DialogBox";

export function BladeburnerCinematic(): React.ReactElement {
  const router = use.Router();
  return (
    <CinematicText
      lines={[
        "In the middle of the 21st century, OmniTek Incorporated advanced robot evolution ",
        "with their Synthoids (synthetic androids), a being virtually identical to a human.",
        "------",
        "Their sixth-generation Synthoids, called MK-VI, were stronger, faster, and more ",
        "intelligent than humans. Many argued that the MK-VI Synthoids were the first ",
        "example of sentient AI.",
        "------",
        "Unfortunately, in 2070 a terrorist group called Ascendis Totalis hacked into OmniTek and ",
        "uploaded a rogue AI into their Synthoid manufacturing facilities.",
        "------",
        "The MK-VI Synthoids infected by the rogue AI turned hostile toward humanity, initiating ",
        "the deadliest conflict in human history. This dark chapter is now known as the Synthoid Uprising.",
        "------",
        "In the aftermath of the Uprising, further manufacturing of Synthoids with advanced AI ",
        "was banned. MK-VI Synthoids that did not have the rogue Ascendis Totalis AI were ",
        "allowed to continue their existence.",
        "------",
        "The intelligence community believes that not all of the rogue MK-VI Synthoids from the Uprising were ",
        "found and destroyed, and that many of them are blending in as normal humans in society today. ",
        "As a result, many nations have created Bladeburner divisions, special units that are tasked with ",
        "investigating and dealing with Synthoid threats.",
      ]}
      onDone={() => {
        router.toTerminal();
        dialogBoxCreate(
          "Visit the National Security Agency (NSA) to apply for their Bladeburner " +
            "division! You will need 100 of each combat stat before doing this.",
        );
      }}
    />
  );
}
