/**
 * Basic button for popup dialog boxes
 * It creates an event handler such that pressing Esc will perform the click handler.
 *
 * Should only be used in other React components, otherwise it may not be properly
 * unmounted
 */
import * as React from "react";
import * as ReactDOM from "react-dom";

import { KEY } from "../../../utils/helpers/keyCodes";
import { removeElement } from "../../../utils/uiHelpers/removeElement";

export interface IPopupButtonProps {
  class?: string;
  popup: HTMLElement | string;
  style?: any;
  text: string;
  onClose?: () => void;
}

export class PopupButton extends React.Component<IPopupButtonProps, any> {
  constructor(props: IPopupButtonProps) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.keyListener = this.keyListener.bind(this);
  }

  componentDidMount(): void {
    document.addEventListener("keydown", this.keyListener);
  }

  componentWillUnmount(): void {
    document.removeEventListener("keydown", this.keyListener);
  }

  handleClick(): void {
    if (this.props.onClose) this.props.onClose();
    //We might be able to remove this?
    //Clickhandler from the props will override this anyhow.
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
    //This doesn't really make sense, a button doesnt have to listen to escape IMO
    //Too affraid to remove it since im not sure what it will break.. But yuck..
    if (e.keyCode === KEY.ESC) {
      this.handleClick();
    }
  }

  render(): React.ReactNode {
    const className = this.props.class ? this.props.class : "std-button";

    return (
      <button className={className} onClick={this.handleClick} style={this.props.style}>
        {this.props.text}
      </button>
    );
  }
}
