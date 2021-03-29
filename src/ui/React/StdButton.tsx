/**
 * Basic stateless button
 * Uses the 'std-button' css class
 */
import * as React from "react";

interface IStdButtonProps {
    addClasses?: string;
    disabled?: boolean;
    id?: string;
    onClick?: (e: React.MouseEvent<HTMLElement>) => any;
    style?: object;
    text: string | JSX.Element;
    tooltip?: string;
}

type IInnerHTMLMarkup = {
    __html: string;
}

export function StdButton(props: IStdButtonProps): React.ReactElement {
    const hasTooltip = props.tooltip != null && props.tooltip !== "";
    let className = props.disabled ? "std-button-disabled" : "std-button";
    if (hasTooltip) {
        className += " tooltip";
    }

    if (typeof props.addClasses === "string") {
        className += ` ${props.addClasses}`;
    }

    // Tooltip will be set using inner HTML
    let tooltipMarkup: IInnerHTMLMarkup | null;
    if (hasTooltip) {
        tooltipMarkup = {
            __html: props.tooltip!
        }
    }

    return (
        <button className={className} id={props.id} onClick={props.onClick} style={props.style}>
            {props.text}
            {
                hasTooltip &&
                <span className={"tooltiptext"} dangerouslySetInnerHTML={tooltipMarkup!}></span>
            }
        </button>
    )
}
