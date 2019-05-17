/**
 * Basic stateless button that uses the 'accordion-button' css class.
 * This class has a black background so that it does not clash with the default
 * accordion coloring
 */
import * as React from "react";

interface IProps {
    addClasses?: string;
    disabled?: boolean;
    id?: string;
    onClick?: (e: React.MouseEvent<HTMLElement>) => any;
    style?: object;
    text: string;
    tooltip?: string;
}

type IInnerHTMLMarkup = {
    __html: string;
}

export function AccordionButton(props: IProps): React.ReactElement {
    const hasTooltip = props.tooltip != null && props.tooltip !== "";

    // TODO Add a disabled class for accordion buttons?
    let className = "accordion-button";
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
