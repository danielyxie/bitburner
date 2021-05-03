/**
 * React component for a panel that lets you purchase upgrades for a Duplicate
 * Sleeve's Memory (through The Covenant)
 */
import * as React from "react";

import { Sleeve } from "../Sleeve";
import { IPlayer } from "../../IPlayer";

import { numeralWrapper } from "../../../ui/numeralFormat";
import { StdButton } from "../../../ui/React/StdButton";
import { Money } from "../../../ui/React/Money";

interface IProps {
    index: number;
    p: IPlayer;
    rerender: () => void;
    sleeve: Sleeve;
}

interface IState {
    amt: number;
}

export class CovenantSleeveMemoryUpgrade extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            amt: 1,
        }

        this.changePurchaseAmount = this.changePurchaseAmount.bind(this);
        this.purchaseMemory = this.purchaseMemory.bind(this);
    }

    changePurchaseAmount(e: React.ChangeEvent<HTMLInputElement>): void {
        let n: number = parseInt(e.target.value);

        if(isNaN(n)) n = 1;
        const maxMemory = 100 - this.props.sleeve.memory;
        if (n > maxMemory) n = maxMemory;

        this.setState({
            amt: n,
        });
    }

    getPurchaseCost(): number {
        if (isNaN(this.state.amt)) { return Infinity; }

        const maxMemory = 100 - this.props.sleeve.memory;
        if (this.state.amt > maxMemory) { return Infinity; }

        return this.props.sleeve.getMemoryUpgradeCost(this.state.amt);
    }

    purchaseMemory(): void {
        const cost = this.getPurchaseCost();
        if (this.props.p.canAfford(cost)) {
            this.props.sleeve.upgradeMemory(this.state.amt);
            this.props.p.loseMoney(cost);
            this.props.rerender();
        }
    }

    render(): React.ReactNode {
        const inputId = `sleeve-${this.props.index}-memory-upgrade-input`;

        // Memory cannot go above 100
        const maxMemory = 100 - this.props.sleeve.memory;

        // Purchase button props
        const cost = this.getPurchaseCost();
        const purchaseBtnDisabled = !this.props.p.canAfford(cost);
        let purchaseBtnContent;
        if (isNaN(this.state.amt)) {
            purchaseBtnContent = <>Invalid value</>;
        } else if (this.state.amt > maxMemory) {
            purchaseBtnContent = <>Memory cannot exceed 100?</>;
        } else {
            purchaseBtnContent = <>Purchase {this.state.amt} memory - {Money(cost)}?</>;
        }

        return (
            <div>
                <h2><u>Upgrade Memory</u></h2>
                <p>
                    Purchase a memory upgrade for your sleeve. Note that a sleeve's max memory
                    is 100 (current: {numeralWrapper.formatSleeveMemory(this.props.sleeve.memory)})
                </p>

                <label htmlFor={inputId}>
                    Amount of memory to purchase (must be an integer):
                </label>
                <input className="text-input" id={inputId} onChange={this.changePurchaseAmount} type={"number"} value={this.state.amt} />
                <br />
                <StdButton disabled={purchaseBtnDisabled} onClick={this.purchaseMemory} text={purchaseBtnContent} />
            </div>
        )
    }
}
