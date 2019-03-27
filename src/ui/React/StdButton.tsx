/**
 * Basic stateless button
 * Uses the 'std-button' css class
 */
import * as React       from "react";

export interface IStdButtonProps {
    disabled?: boolean;
    onClick?: (e: React.MouseEvent<HTMLElement>) => any;
    style?: object;
    text: string;
}

export class StdButton extends React.Component<IStdButtonProps, any> {
    render() {
        const className = this.props.disabled ? "std-button-disabled" : "std-button";

        return (
            <button className={className} onClick={this.props.onClick} style={this.props.style}>
                {this.props.text}
            </button>
        )
    }
}
