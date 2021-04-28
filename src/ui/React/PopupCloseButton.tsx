/**
 * Close button for popup dialog boxes
 * It creates an event handler such that pressing Esc will close the binded popup
 *
 * Should only be used in other React components, otherwise it may not be properly
 * unmounted
 */
import * as React       from "react";

import { IPopupButtonProps, PopupButton } from "./PopupButton";

export interface IPopupCloseButtonProps extends IPopupButtonProps {
    class?: string;
    popup: HTMLElement | string;
    style?: object;
    text: string;
}

export class PopupCloseButton extends PopupButton {
    constructor(props: IPopupCloseButtonProps) {
        super(props);
    }

    render() {
        const className = this.props.class ? this.props.class : "std-button";

        return (
            <button className={className} onClick={this.handleClick} style={this.props.style}>
                {this.props.text}
            </button>
        )
    }
}