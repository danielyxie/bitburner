import * as React from "react";
import { KEY } from "../../utils/helpers/keyCodes";

import { CodingContract, CodingContractType, CodingContractTypes } from "../CodingContracts";
import { ClickableTag, CopyableText } from "../ui/React/CopyableText";
import { PopupCloseButton } from "../ui/React/PopupCloseButton";
import { PopupButton} from "../ui/React/PopupButton";

type IProps = {
    c: CodingContract;
    popupId: string;
    onClose: () => void;
    onAttempt: (val: string) => void;
}

type IState = {
    value: string;
}

export class CodingContractPopup extends React.Component<IProps, IState>{
    constructor(props: IProps) {
        super(props);
        this.state = {
            value: '',
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleAttempt = this.handleAttempt.bind(this);
    }
    handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
        const answer = e.target.value;
        this.setState({ value: answer });
    }
    handleAttempt(){
        this.props.onAttempt(this.state.value);
    }
    onInputKeydown(e:any){
        if (e.keyCode === KEY.ENTER && e.target.value !== "") {
            e.preventDefault();
            this.handleAttempt();
        } else if (e.keyCode === KEY.ESC) {
            e.preventDefault();
            this.props.onClose();
        }
    }

    render(){
        const contractType: CodingContractType = CodingContractTypes[this.props.c.type];
        let description = [];
        for (const [i, value] of contractType.desc(this.props.c.data).split('\n').entries()) 
            description.push(<span key={i}>{value}<br/></span>);
        return (
            <div>
                <CopyableText value={this.props.c.type} tag={ClickableTag.Tag_h1} />
                <br/><br/>
                <p>You are attempting to solve a Coding Contract. You have {this.props.c.getMaxNumTries() - this.props.c.tries} tries remaining, after which the contract will self-destruct.</p>
                <br/>
                <p>{description}</p>
                <br/>
                <input className='text-input' style={{ width:"50%",marginTop:"8px" }} autoFocus={true} placeholder="Enter Solution here"
                    onChange={this.handleChange} onKeyDown={this.onInputKeydown} />
                <PopupButton popup={this.props.popupId} onClick={this.handleAttempt} text={"Solve"} />
                <PopupCloseButton popup={this.props.popupId} onClick={this.props.onClose} text={"Close"} />
            </div>
        )
    }
}