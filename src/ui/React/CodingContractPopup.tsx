import * as React from "react";
import { KEY } from "../../../utils/helpers/keyCodes";

import { CodingContract, CodingContractType, CodingContractTypes } from "../../CodingContracts";
import { ClickableTag, CopyableText } from "./CopyableText";
import { PopupCloseButton } from "./PopupCloseButton";

type IProps = {
    c: CodingContract;
    popupId: string;
    onClose: () => void;
    onAttempt: (answer: string) => void;
}

type IState = {
    answer: string;
}

export class CodingContractPopup extends React.Component<IProps, IState>{
    constructor(props: IProps) {
        super(props);
        this.state = { answer: ''};
        this.setAnswer = this.setAnswer.bind(this);
        this.onInputKeydown = this.onInputKeydown.bind(this);
    }

    setAnswer(event: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({ answer: event.target.value });
    }

    onInputKeydown(event: React.KeyboardEvent<HTMLInputElement>): void {
        // React just won't cooperate on this one. 
        // "React.KeyboardEvent<HTMLInputElement>" seems like the right type but
        // whatever ...
        const value = (event.target as any).value;

        if (event.keyCode === KEY.ENTER && value !== "") {
            event.preventDefault();
            this.props.onAttempt(this.state.answer);
        } else if (event.keyCode === KEY.ESC) {
            event.preventDefault();
            this.props.onClose();
        }
    }

    render(): React.ReactNode {
        const contractType: CodingContractType = CodingContractTypes[this.props.c.type];
        const description = [];
        for (const [i, value] of contractType.desc(this.props.c.data).split('\n').entries()) 
            description.push(<span key={i} dangerouslySetInnerHTML={{__html: value+'<br />'}}></span>);
        return (
            <div>
                <CopyableText value={this.props.c.type} tag={ClickableTag.Tag_h1} />
                <br/><br/>
                <p>You are attempting to solve a Coding Contract. You have {this.props.c.getMaxNumTries() - this.props.c.tries} tries remaining, after which the contract will self-destruct.</p>
                <br/>
                <p>{description}</p>
                <br/>
                <input className="text-input" style={{ width:"50%",marginTop:"8px" }} autoFocus={true} placeholder="Enter Solution here" value={this.state.answer} 
                    onChange={this.setAnswer} onKeyDown={this.onInputKeydown} />
                <PopupCloseButton popup={this.props.popupId} onClose={() => this.props.onAttempt(this.state.answer)} text={"Solve"} />
                <PopupCloseButton popup={this.props.popupId} onClose={this.props.onClose} text={"Close"} />
            </div>
        )
    }
}