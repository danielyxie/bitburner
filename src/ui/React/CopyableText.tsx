import * as React from "react";

type IProps = {
    value: string;
}

type IState = {
    tooltipVisible: boolean;
}

export class CopyableText extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.copy = this.copy.bind(this);
        this.tooltipClasses = this.tooltipClasses.bind(this);
        this.textClasses = this.textClasses.bind(this);

        this.state = {
            tooltipVisible: false,
        }
    }

    copy(e: React.MouseEvent<HTMLHeadingElement>) {
        const copyText = document.createElement("textarea");
        copyText.value = this.props.value;
        document.body.appendChild(copyText);
        copyText.select();
        copyText.setSelectionRange(0, 1e10);
        document.execCommand("copy");
        document.body.removeChild(copyText);
        this.setState({tooltipVisible: true});
        setTimeout(() => this.setState({tooltipVisible: false}), 1000);
    }

    tooltipClasses(): string {
        let classes = "copy_tooltip_text";
        if(this.state.tooltipVisible) {
            classes += " copy_tooltip_text_visible";
        }

        return classes;
    }

    textClasses(): string {
        let classes = "copy_tooltip noselect text";
        if(this.state.tooltipVisible) {
            classes += " copy_tooltip_copied";
        }

        return classes;
    }


    render() {
        return (<span className={this.textClasses()} onClick={this.copy}>
            <b>{this.props.value}</b>
            <span className={this.tooltipClasses()}>Copied!</span>
        </span>);
    }
}