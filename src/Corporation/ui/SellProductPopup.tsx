import React, { useState } from 'react';
import { Warehouse } from "../Warehouse";
import { dialogBoxCreate } from "../../../utils/DialogBox";
import { createElement } from "../../../utils/uiHelpers/createElement";
import { removePopup } from "../../ui/React/createPopup";
import { createOptionElement } from "../../../utils/uiHelpers/createOptionElement";
import { clearSelector } from "../../../utils/uiHelpers/clearSelector";
import { getSelectText,
         getSelectValue } from "../../../utils/uiHelpers/getSelectData";
import { Cities } from "../../Locations/Cities";

function initialPrice(product: any): string {
    let val = product.sCost ? product.sCost : '';
    if (product.marketTa2) {
        val += " (Market-TA.II)";
    } else if (product.marketTa1) {
        val += " (Market-TA.I)";
    }
    return val;
}

interface IProps {
    product: any;
    city: string;
    popupId: string;
}

// Create a popup that let the player manage sales of a material
export function SellProductPopup(props: IProps): React.ReactElement {
    const [checked, setChecked] = useState(true);
    const [iQty, setQty] = useState<string>(props.product.sllman[props.city][1] ? props.product.sllman[props.city][1] : '');
    const [px, setPx] = useState<string>(initialPrice(props.product));

    function onCheckedChange(event: React.ChangeEvent<HTMLInputElement>): void {
        setChecked(event.target.checked);
    }

    function sellProduct(): void {
        //Parse price
        if (px.includes("MP")) {
            //Dynamically evaluated quantity. First test to make sure its valid
            //Sanitize input, then replace dynamic variables with arbitrary numbers
            var price = px.replace(/\s+/g, '');
            price = price.replace(/[^-()\d/*+.MP]/g, '');
            var temp = price.replace(/MP/g, '1');
            try {
                temp = eval(temp);
            } catch(e) {
                dialogBoxCreate("Invalid value or expression for sell quantity field: " + e);
                return;
            }
            if (temp == null || isNaN(parseFloat(temp))) {
                dialogBoxCreate("Invalid value or expression for sell quantity field.");
                return;
            }
            props.product.sCost = price; //Use sanitized price
        } else {
            var cost = parseFloat(px);
            if (isNaN(cost)) {
                dialogBoxCreate("Invalid value for sell price field");
                return;
            }
            props.product.sCost = cost;
        }

        // Array of all cities. Used later
        const cities = Object.keys(Cities);

        // Parse quantity
        if (iQty.includes("MAX") || iQty.includes("PROD")) {
            //Dynamically evaluated quantity. First test to make sure its valid
            var qty = iQty.replace(/\s+/g, '');
            qty = qty.replace(/[^-()\d/*+.MAXPROD]/g, '');
            var temp = qty.replace(/MAX/g, '1');
            temp = temp.replace(/PROD/g, '1');
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
            if (checked) {
                for (let i = 0; i < cities.length; ++i) {
                    const tempCity = cities[i];
                    props.product.sllman[tempCity][0] = true;
                    props.product.sllman[tempCity][1] = qty; //Use sanitized input
                }
            } else {
                props.product.sllman[props.city][0] = true;
                props.product.sllman[props.city][1] = qty; //Use sanitized input
            }
        } else if (isNaN(parseFloat(iQty))) {
            dialogBoxCreate("Invalid value for sell quantity field! Must be numeric");
            return;
        } else {
            let qty = parseFloat(iQty);
            if (isNaN(qty)) {qty = 0;}
            if (qty === 0) {
                if (checked) {
                    for (let i = 0; i < cities.length; ++i) {
                        const tempCity = cities[i];
                        props.product.sllman[tempCity][0] = false;
                        props.product.sllman[tempCity][1] = '';
                    }
                } else {
                    props.product.sllman[props.city][0] = false;
                    props.product.sllman[props.city][1] = '';
                }
            } else {
                if (checked) {
                    for (let i = 0; i < cities.length; ++i) {
                        const tempCity = cities[i];
                        props.product.sllman[tempCity][0] = true;
                        props.product.sllman[tempCity][1] = qty;
                    }
                } else {
                    props.product.sllman[props.city][0] = true;
                    props.product.sllman[props.city][1] = qty;
                }
            }
        }

        removePopup(props.popupId);
    }

    function onAmtChange(event: React.ChangeEvent<HTMLInputElement>): void {
        setQty(event.target.value);
    }

    function onPriceChange(event: React.ChangeEvent<HTMLInputElement>): void {
        setPx(event.target.value);
    }

    function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void {
        if (event.keyCode === 13) sellProduct();
    }

    return (<>
        <p>
Enter the maximum amount of {props.product.name} you would like 
to sell per second, as well as the price at which you would like to 
sell it at.<br /><br />
If the sell amount is set to 0, then the product will not be sold. If the 
sell price is set to 0, then the product will be discarded.<br /><br />
Setting the sell amount to 'MAX' will result in you always selling the 
maximum possible amount of the material.<br /><br />
When setting the sell amount, you can use the 'PROD' variable to designate a 
dynamically changing amount that depends on your production. For example, 
if you set the sell amount to 'PROD-1' then you will always sell 1 less of  
the material than you produce.<br /><br />
When setting the sell price, you can use the 'MP' variable to set a 
dynamically changing price that depends on the Product's estimated 
market price. For example, if you set it to 'MP*5' then it 
will always be sold at five times the estimated market price.
        </p>
        <br />
        <input className="text-input" value={iQty} autoFocus={true} type="text" placeholder="Sell amount" style={{marginTop: "4px"}} onChange={onAmtChange} onKeyDown={onKeyDown} />
        <input className="text-input" value={px} type="text" placeholder="Sell price" style={{marginTop: "4px"}} onChange={onPriceChange} onKeyDown={onKeyDown} />
        <button className="std-button" onClick={sellProduct}>Confirm</button>
        <div style={{border: "1px solid white", display: "inline-block"}}>
            <label htmlFor={props.popupId+'-checkbox'}>Use same 'Sell Amount' for all cities</label>
            <input checked={checked} onChange={onCheckedChange} id={props.popupId + "-checkbox"} style={{margin:"2px"}} type="checkbox" />
        </div>
    </>);
}
