import * as React from "react";
import { KEY } from "../../utils/helpers/keyCodes";

import { CodingContract, CodingContractType, CodingContractTypes } from "../CodingContracts";
import { ClickableTag, CopyableText } from "../ui/React/CopyableText";
import { PopupCloseButton } from "../ui/React/PopupCloseButton";

type IProps = {
    c: CodingContract;
    onCloseClick: () => void;
    onSolveClick: () => void;
}

export class CodingContractPopup extends React.Component<IProps>{
    state: any;
    constructor(props: IProps) {
        super(props);
        this.state = { value: ''};
        this.setValue = this.setValue.bind(this);
    }
    getValue(){
        let input = document.getElementById('contractInput')?.getAttribute('value');
        if (input === null || input === undefined) //Make sure to always return a string
            input = "";
        return input;
    }
    setValue(event: any) {
        this.setState({ value: event.target.value });
    }
    onInputKeydown(e:any){
        if (e.keyCode === KEY.ENTER && e.target.value !== "") {
            e.preventDefault();
            this.props.onSolveClick();
        } else if (e.keyCode === KEY.ESC) {
            e.preventDefault();
            this.props.onCloseClick();  
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
                <input style={{ width:"50%",marginTop:"8px" }} autoFocus={true} placeholder="Enter Solution here" value={this.state.value} 
                    onChange={this.setValue} onKeyDown={this.onInputKeydown} />
                <PopupCloseButton popup={this.props.c.popupId} ClickHandler={this.props.onSolveClick} text={"Solve"} />
                <PopupCloseButton popup={this.props.c.popupId} ClickHandler={this.props.onCloseClick} text={"Close"} />
            </div>
        )
    }
}