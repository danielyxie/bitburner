import React, { useState } from 'react';
import { dialogBoxCreate } from "../../../utils/DialogBox";
import { removePopup } from "../../ui/React/createPopup";

function initialPrice(mat: any): string {
    let val = mat.sCost ? mat.sCost : '';
    if (mat.marketTa2) {
        val += " (Market-TA.II)";
    } else if (mat.marketTa1) {
        val += " (Market-TA.I)";
    }
    return val;
}

interface IProps {
    mat: any;
    corp: any;
    popupId: string;
}

// Create a popup that let the player manage sales of a material
export function SellMaterialPopup(props: IProps): React.ReactElement {
    const [amt, setAmt] = useState<string>(props.mat.sllman[1] ? props.mat.sllman[1] : '');
    const [price, setPrice] = useState<string>(initialPrice(props.mat));

    function sellMaterial(): void {
        let p = price;
        let qty = amt;
        if(p === '') p = '0';
        if(qty === '') qty = '0';
        let cost = p.replace(/\s+/g, '');
        cost = cost.replace(/[^-()\d/*+.MP]/g, ''); //Sanitize cost
        let temp = cost.replace(/MP/g, props.mat.bCost);
        try {
            temp = eval(temp);
        } catch(e) {
            dialogBoxCreate("Invalid value or expression for sell price field: " + e);
            return;
        }

        if (temp == null || isNaN(parseFloat(temp))) {
            dialogBoxCreate("Invalid value or expression for sell price field");
            return;
        }

        if (cost.includes("MP")) {
            props.mat.sCost = cost; //Dynamically evaluated
        } else {
            props.mat.sCost = temp;
        }

        //Parse quantity
        if (qty.includes("MAX") || qty.includes("PROD")) {
            let q = qty.replace(/\s+/g, '');
            q = q.replace(/[^-()\d/*+.MAXPROD]/g, '');
            let tempQty = q.replace(/MAX/g, '1');
            tempQty = tempQty.replace(/PROD/g, '1');
            try {
                tempQty = eval(tempQty);
            } catch(e) {
                dialogBoxCreate("Invalid value or expression for sell price field: " + e);
                return;
            }

            if (tempQty == null || isNaN(parseFloat(tempQty))) {
                dialogBoxCreate("Invalid value or expression for sell price field");
                return;
            }

            props.mat.sllman[0] = true;
            props.mat.sllman[1] = q; //Use sanitized input
        } else if (isNaN(parseFloat(qty))) {
            dialogBoxCreate("Invalid value for sell quantity field! Must be numeric or 'MAX'");
            return;
        } else {
            let q = parseFloat(qty);
            if (isNaN(q)) {q = 0;}
            if (q === 0) {
                props.mat.sllman[0] = false;
                props.mat.sllman[1] = 0;
            } else {
                props.mat.sllman[0] = true;
                props.mat.sllman[1] = q;
            }
        }

        removePopup(props.popupId);
    }

    function onAmtChange(event: React.ChangeEvent<HTMLInputElement>): void {
        setAmt(event.target.value);
    }

    function onPriceChange(event: React.ChangeEvent<HTMLInputElement>): void {
        setPrice(event.target.value);
    }

    function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void {
        if (event.keyCode === 13) sellMaterial();
    }

    return (<>
        <p>
Enter the maximum amount of {props.mat.name} you would like
to sell per second, as well as the price at which you would
like to sell at.<br /><br />
If the sell amount is set to 0, then the material will not be sold. If the sell price
if set to 0, then the material will be discarded<br /><br />
Setting the sell amount to 'MAX' will result in you always selling the
maximum possible amount of the material.<br /><br />
When setting the sell amount, you can use the 'PROD' variable to designate a dynamically
changing amount that depends on your production. For example, if you set the sell amount
to 'PROD-5' then you will always sell 5 less of the material than you produce.<br /><br />
When setting the sell price, you can use the 'MP' variable to designate a dynamically
changing price that depends on the market price. For example, if you set the sell price
to 'MP+10' then it will always be sold at $10 above the market price.
        </p>
        <br />
        <input className="text-input" value={amt} autoFocus={true} type="text" placeholder="Sell amount" style={{marginTop: "4px"}} onChange={onAmtChange} onKeyDown={onKeyDown} />
        <input className="text-input" value={price} type="text" placeholder="Sell price" style={{marginTop: "4px"}} onChange={onPriceChange} onKeyDown={onKeyDown} />
        <button className="std-button" onClick={sellMaterial}>Confirm</button>
    </>);
}
