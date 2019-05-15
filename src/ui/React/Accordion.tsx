/**
 * React component to create an accordion element
 */
import * as React from "react";

type IProps = {
    headerContent: React.ReactElement;
    panelContent: React.ReactElement;
    panelInitiallyOpened?: boolean;
}

type IState = {
    panelOpened: boolean;
}

export class Accordion extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.handleHeaderClick = this.handleHeaderClick.bind(this);

        this.state = {
            panelOpened: props.panelInitiallyOpened ? true : false,
        }
    }

    handleHeaderClick(e: React.MouseEvent<HTMLButtonElement>) {
        const elem = e.currentTarget;
        elem.classList.toggle("active");

        const panel: HTMLElement = elem.nextElementSibling as HTMLElement;
        const active = elem.classList.contains("active");
        if (active) {
            panel!.style.display = "block";
            this.setState({
                panelOpened: true,
            });
        } else {
            panel!.style.display = "none";
            this.setState({
                panelOpened: false,
            });
        }
    }

    render() {
        return (
            <>
            <button className={"accordion-header"} onClick={this.handleHeaderClick}>
                {this.props.headerContent}
            </button>
            <AccordionPanel opened={this.state.panelOpened} panelContent={this.props.panelContent} />
            </>
        )
    }
}

type IPanelProps = {
    opened: boolean;
    panelContent: React.ReactElement;
}

class AccordionPanel extends React.Component<IPanelProps, any> {
    shouldComponentUpdate(nextProps: IPanelProps) {
        return this.props.opened || nextProps.opened;
    }

    render() {
        return (
            <div className={"accordion-panel"}>
                {this.props.panelContent}
            </div>
        )
    }
}
