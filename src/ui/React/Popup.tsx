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

export class Popup extends React.Component<IProps, any> {
    render() {
        return (
            <div className={"popup-box-content"} id={`${this.props.id}-content`}>
                {React.createElement(this.props.content, this.props.props)}
            </div>
        )
    }
}
