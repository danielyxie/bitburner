/**
 * React component for a popup content container
 *
 * Takes in a prop for rendering the content inside the popup
 */
import * as React from "react";

type ReactComponent = new(...args: any[]) => React.Component<any, any>

interface IProps {
    content: ReactComponent;
    id: string;
    props: object;
}

export function Popup(props: IProps): React.ReactElement {
    return (
        <div className={"popup-box-content"} id={`${props.id}-content`}>
            {React.createElement(props.content, props.props)}
        </div>
    )
}
