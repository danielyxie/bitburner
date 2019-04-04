/**
 * Stateless button that represents something that has been purchased.
 */
import * as React from "react";

interface IStdButtonPurchasedProps {
    onClick?: (e: React.MouseEvent<HTMLElement>) => any;
    style?: object;
    text: string;
}

export class StdButtonPurchased extends React.Component<IStdButtonPurchasedProps, any> {
    render() {
        return (
            <button className={"std-button-bought"} onClick={this.props.onClick} style={this.props.style}>
                {this.props.text}
            </button>
        )
    }
}
