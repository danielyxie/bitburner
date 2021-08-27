import React, { useEffect } from 'react';

interface IProps {
    onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => void;
    onFailure: (options?: { automated: boolean }) => void;
}

export function KeyHandler(props: IProps): React.ReactElement {
    let elem: any;
    useEffect(() => elem.focus());

    function onKeyDown(event: React.KeyboardEvent<HTMLElement>): void {
        console.log("isTrusted?", event.isTrusted)
        if(!event.isTrusted) {
            console.log("untrusted event!")
            props.onFailure({ automated: true });
            return;
        }
        props.onKeyDown(event);
    }

    // invisible autofocused element that eats all the keypress for the minigames.
    return (<div tabIndex={1} ref={c => elem = c} onKeyDown={onKeyDown} />)
}