/**
 * Close button for popup dialog boxes
 * It creates an event handler such that pressing Esc will close the binded popup
 *
 * Should only be used in other React components, otherwise it may not be properly
 * unmounted
 */
import * as React from "react";
import * as ReactDOM from "react-dom";

import { removeElement } from "../uiHelpers/removeElement";
import { IPopupButtonProps, PopupButton } from "./PopupButton";

export interface IPopupCloseButtonProps extends IPopupButtonProps {
  class?: string;
  popup: HTMLElement | string;
  style?: any;
  text: string;
  onClose: () => void;
}

export class PopupCloseButton extends PopupButton {
  constructor(props: IPopupCloseButtonProps) {
    super(props);

    this.closePopup = this.closePopup.bind(this);
  }

  closePopup(): void {
    if (this.props.onClose) this.props.onClose();
    let popup: HTMLElement | null;
    if (typeof this.props.popup === "string") {
      popup = document.getElementById(this.props.popup);
    } else {
      popup = this.props.popup;
    }

    // TODO Check if this is okay? This is essentially calling to unmount a
    // parent component
    if (popup instanceof HTMLElement) {
      // Removes everything inside the wrapper container
      ReactDOM.unmountComponentAtNode(popup);
      removeElement(popup); // Removes the wrapper container
    }
  }

  render(): React.ReactNode {
    const className = this.props.class ? this.props.class : "std-button";

    return (
      <button className={className} onClick={this.closePopup} style={this.props.style}>
        {this.props.text}
      </button>
    );
  }
}
