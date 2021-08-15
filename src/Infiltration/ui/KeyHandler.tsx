import React, { useEffect } from 'react';

interface IProps {
    onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => void;
}

export function KeyHandler(props: IProps): React.ReactElement {
    let elem: any;
    useEffect(() => elem.focus());

    function onKeyDown(event: React.KeyboardEvent<HTMLElement>): void {
        if(!event.isTrusted) return;
        props.onKeyDown(event);
    }

    // invisible autofocused element that eats all the keypress for the minigames.
    return (<div tabIndex={1} ref={c => elem = c} onKeyDown={onKeyDown} />)
}