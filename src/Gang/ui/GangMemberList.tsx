import React, { useState, useEffect } from "react";
import { Accordion } from "../../ui/React/Accordion";
import { GangMemberAccordionContent } from "./GangMemberAccordionContent"
import { GangMemberUpgradePopup } from "./GangMemberUpgradePopup"
import { createPopup } from "../../ui/React/createPopup";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { Gang } from "../Gang";
import { GangMember } from "../GangMember";

interface IProps {
    gang: Gang;
    player: IPlayer;
}

export function GangMemberList(props: IProps): React.ReactElement {
    const [filter, setFilter] = useState("");

    function openUpgradePopup(): void {
        const popupId = `gang-upgrade-popup`;
        createPopup(popupId, GangMemberUpgradePopup, {
            gang: props.gang,
            player: props.player,
            popupId: popupId,
        });
    }

    function onChange(event: React.ChangeEvent<HTMLInputElement>): void {
        setFilter(event.target.value);
    }

    function members(): GangMember[] {
        return props.gang.members.filter((member: GangMember) => member.name.indexOf(filter) > -1 || member.task.indexOf(filter) > -1)
    }

    return (<>
        <input className="text-input" placeholder="Filter gang member" style={{margin: "5px", padding: "5px"}} value={filter} onChange={onChange} />
        <a className="a-link-button" style={{display: 'inline-block'}} onClick={openUpgradePopup}>Manage Equipment</a>
        <ul>
            {members().map((member: GangMember) => <li key={member.name}>
                <Accordion
                    panelInitiallyOpened={true}
                    headerContent={<>{member.name}</>}
                    panelContent={<GangMemberAccordionContent gang={props.gang} member={member} />} />
            </li>)}
        </ul>
    </>);
}