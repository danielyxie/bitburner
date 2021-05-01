/**
 * Close button for popup dialog boxes
 * It creates an event handler such that pressing Esc will close the binded popup
 *
 * Should only be used in other React components, otherwise it may not be properly
 * unmounted
 */
import * as React       from "react";
import *  as ReactDOM   from "react-dom";

import { KEY } from "../../../utils/helpers/keyCodes";
import { removeElement } from "../../../utils/uiHelpers/removeElement";

export interface IPopupCloseButtonProps {
    class?: string;
    popup: HTMLElement | string;
    style?: any;
    text: string;
}

export class PopupCloseButton extends React.Component<IPopupCloseButtonProps, any> {
    constructor(props: IPopupCloseButtonProps) {
        super(props);

        this.closePopup = this.closePopup.bind(this);
        this.keyListener = this.keyListener.bind(this);
    }

    componentDidMount(): void {
        document.addEventListener("keydown", this.keyListener);
    }

    componentWillUnmount(): void {
        document.removeEventListener("keydown", this.keyListener);
    }

    closePopup(): void {
        let popup: HTMLElement | null;
        if (typeof this.props.popup === "string") {
            popup = document.getElementById(this.props.popup);
        } else {
            popup = this.props.popup;
        }

        // TODO Check if this is okay? This is essentially calling to unmount a parent component
        if (popup instanceof HTMLElement) {
            ReactDOM.unmountComponentAtNode(popup); // Removes everything inside the wrapper container
            removeElement(popup); // Removes the wrapper container
        }
    }

    keyListener(e: KeyboardEvent): void {
        if (e.keyCode === KEY.ESC) {
            this.closePopup();
        }
    }

    render(): React.ReactNode {
        const className = this.props.class ? this.props.class : "std-button";

        return (
            <button className={className} onClick={this.closePopup} style={this.props.style}>
                {this.props.text}
            </button>
        )
    }
}
