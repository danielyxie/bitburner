/**
 * React Component for the list of gang members on the management subpage.
 */
import React, { useState } from "react";
import { GangMemberUpgradePopup } from "./GangMemberUpgradePopup";
import { GangMemberAccordion } from "./GangMemberAccordion";
import { createPopup } from "../../ui/React/createPopup";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { Gang } from "../Gang";
import { GangMember } from "../GangMember";
import { RecruitButton } from "./RecruitButton";

interface IProps {
    gang: Gang;
    player: IPlayer;
}

export function GangMemberList(props: IProps): React.ReactElement {
    const [filter, setFilter] = useState("");
    const setRerender = useState(false)[1];

    function openUpgradePopup(): void {
        const popupId = `gang-upgrade-popup`;
        createPopup(popupId, GangMemberUpgradePopup, {
            gang: props.gang,
            player: props.player,
            popupId: popupId,
        });
    }

    function onFilterChange(event: React.ChangeEvent<HTMLInputElement>): void {
        setFilter(event.target.value);
    }

    const members = props.gang.members.filter((member: GangMember) =>
        member.name.indexOf(filter) > -1 || member.task.indexOf(filter) > -1);

    return (<>
        <RecruitButton
            onRecruit={() => setRerender(old => !old)}
            gang={props.gang} />
        <br />
        <input
            className="text-input"
            placeholder="Filter gang member"
            style={{margin: "5px", padding: "5px"}}
            value={filter}
            onChange={onFilterChange} />
        <a
            className="a-link-button"
            style={{display: 'inline-block'}}
            onClick={openUpgradePopup}>Manage Equipment</a>
        <ul>
            {members.map((member: GangMember) => <li key={member.name}>
                <GangMemberAccordion gang={props.gang} member={member} />
            </li>)}
        </ul>
    </>);
}