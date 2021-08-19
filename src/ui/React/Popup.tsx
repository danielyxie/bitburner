/**
 * React component for a popup content container
 *
 * Takes in a prop for rendering the content inside the popup
 */
import React, { useEffect } from "react";

interface IProps<T> {
    content: (props: T) => React.ReactElement;
    id: string;
    props: T;
    removePopup: (id: string) => void;
}

export function Popup<T>(props: IProps<T>): React.ReactElement {
    function keyDown(event: KeyboardEvent): void {
        if(event.key === 'Escape') props.removePopup(props.id);
    }

    useEffect(() => {
        document.addEventListener('keydown', keyDown);
        return () => {
            document.removeEventListener('keydown', keyDown);
        }
    });

    return (
        <div className={"popup-box-content"} id={`${props.id}-content`}>
            {React.createElement(props.content, props.props)}
        </div>
    )
}
