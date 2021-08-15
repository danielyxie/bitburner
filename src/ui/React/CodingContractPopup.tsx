import React, { useState } from 'react';
import { KEY } from "../../../utils/helpers/keyCodes";

import { CodingContract, CodingContractType, CodingContractTypes } from "../../CodingContracts";
import { ClickableTag, CopyableText } from "./CopyableText";
import { PopupCloseButton } from "./PopupCloseButton";

type IProps = {
    c: CodingContract;
    popupId: string;
    onClose: () => void;
    onAttempt: (answer: string) => void;
}

export function CodingContractPopup(props: IProps): React.ReactElement {
    const [answer, setAnswer] = useState("");

    function onChange(event: React.ChangeEvent<HTMLInputElement>): void {
        setAnswer(event.target.value);
    }

    function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void {
        // React just won't cooperate on this one. 
        // "React.KeyboardEvent<HTMLInputElement>" seems like the right type but
        // whatever ...
        const value = (event.target as any).value;

        if (event.keyCode === KEY.ENTER && value !== "") {
            event.preventDefault();
            props.onAttempt(answer);
        } else if (event.keyCode === KEY.ESC) {
            event.preventDefault();
            props.onClose();
        }
    }

    const contractType: CodingContractType = CodingContractTypes[props.c.type];
    const description = [];
    for (const [i, value] of contractType.desc(props.c.data).split('\n').entries()) 
        description.push(<span key={i} dangerouslySetInnerHTML={{__html: value+'<br />'}}></span>);
    return (
        <div>
            <CopyableText value={props.c.type} tag={ClickableTag.Tag_h1} />
            <br/><br/>
            <p>You are attempting to solve a Coding Contract. You have {props.c.getMaxNumTries() - props.c.tries} tries remaining, after which the contract will self-destruct.</p>
            <br/>
            <p>{description}</p>
            <br/>
            <input
                className="text-input"
                style={{ width:"50%",marginTop:"8px" }}
                autoFocus={true}
                placeholder="Enter Solution here"
                value={answer}
                onChange={onChange}
                onKeyDown={onKeyDown} />
            <PopupCloseButton
                popup={props.popupId}
                onClose={() => props.onAttempt(answer)}
                text={"Solve"} />
            <PopupCloseButton
                popup={props.popupId}
                onClose={props.onClose}
                text={"Close"} />
        </div>
    )
}