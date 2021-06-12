import React from 'react';

export function BlinkingCursor(): React.ReactElement {
    return (<span style={{fontSize: "1em"}} className={"blinking-cursor"}>|</span>)
}