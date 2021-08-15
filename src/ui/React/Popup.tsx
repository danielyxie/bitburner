/**
 * React component for a popup content container
 *
 * Takes in a prop for rendering the content inside the popup
 */
import * as React from "react";

interface IProps<T> {
    content: (props: T) => React.ReactElement;
    id: string;
    props: T;
}

export function Popup<T>(props: IProps<T>): React.ReactElement {
    return (
        <div className={"popup-box-content"} id={`${props.id}-content`}>
            {React.createElement(props.content, props.props)}
        </div>
    )
}
