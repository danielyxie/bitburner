import { KEY } from "./helpers/keyCodes";
import { DialogBox } from "./ui/DialogBox";
import { createPopup } from "../src/ui/React/createPopup";
import { getRandomInt } from "./helpers/getRandomInt";

import React from "react";
import ReactDOM from "react-dom";

interface IProps {
    content: JSX.Element;
}

export function MessagePopup(props: IProps): React.ReactElement {
    return (<>{props.content}</>);
}

function dialogBoxCreate(txt: string | JSX.Element, preformatted: boolean = false): void {
    const popupId = `popup-`+(Array.from(Array(16))).map(() => `${getRandomInt(0, 9)}`).join('');
    if (typeof txt === 'string') {
        if (preformatted) {
            // For text files as they are often computed data that
            // shouldn't be wrapped and should retain tabstops.
            createPopup(popupId, MessagePopup, {
                content: (<pre dangerouslySetInnerHTML={{ __html: txt }} />)
            });
        } else {
            createPopup(popupId, MessagePopup, {
                content: (<p dangerouslySetInnerHTML={{ __html: txt.replace(/(?:\r\n|\r|\n)/g, '<br />') }} />)
            });
        }
    } else {
        createPopup(popupId, MessagePopup, {
            content: txt
        });
    }
}

export {dialogBoxCreate};
