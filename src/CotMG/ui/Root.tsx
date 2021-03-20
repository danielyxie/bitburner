import * as React from "react";
import { Grid } from "./Grid";
import { IStaneksGift } from "../IStaneksGift";

type IProps = {
    staneksGift: IStaneksGift;
}

export class Root extends React.Component<IProps, any> {
    staneksGift: IStaneksGift;

    constructor(props: IProps) {
        super(props);
        this.staneksGift = props.staneksGift;
    }

    render() {
        return (<div className="staneksgift_container"><h1>Stanek's Gift</h1>
            <Grid gift={this.staneksGift} />
        </div>)
    }
}