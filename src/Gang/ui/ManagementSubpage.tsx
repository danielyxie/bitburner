/**
 * React Component for the subpage that manages gang members, the main page.
 */
import React from "react";
import { GangStats } from "./GangStats";
import { GangMemberList } from "./GangMemberList";
import { useGang } from "./Context";
import Typography from "@mui/material/Typography";

export function ManagementSubpage(): React.ReactElement {
  const gang = useGang();
  return (
    <>
      <Typography>
        This page is used to manage your gang members and get an overview of your gang's stats.
        <br />
        <br />
        If a gang member is not earning much money or respect, the task that you have assigned to that member might be
        too difficult. Consider training that member's stats or choosing an easier task. The tasks closer to the top of
        the dropdown list are generally easier. Alternatively, the gang member's low production might be due to the fact
        that your wanted level is too high. Consider assigning a few members to the '
        {gang.isHackingGang ? "Ethical Hacking" : "Vigilante Justice"}' task to lower your wanted level.
        <br />
        <br />
        Installing Augmentations does NOT reset your progress with your Gang. Furthermore, after installing
        Augmentations, you will automatically be a member of whatever Faction you created your gang with.
        <br />
        <br />
        You can also manage your gang programmatically through Netscript using the Gang API
      </Typography>
      <br />
      <GangStats />
      <br />
      <GangMemberList />
    </>
  );
}
