import React, { useState } from 'react';
import { dialogBoxCreate } from "../../../utils/DialogBox";
import { removePopup } from "../../ui/React/createPopup";
import { Industries } from "../IndustryData";
import { Product } from "../Product";
import { ICorporation } from "../ICorporation";
import { IIndustry } from "../IIndustry";

interface IProps {
    popupText: string;
    division: IIndustry;
    corp: ICorporation;
    popupId: string;
}

function productPlaceholder(tpe: string): string {
    if (tpe === Industries.Food) {
        return "Restaurant Name";
    } else if (tpe === Industries.Healthcare) {
        return "Hospital Name";
    } else if (tpe === Industries.RealEstate) {
        return "Property Name";
    }
    return "Product Name";
}

// Create a popup that lets the player create a product for their current industry
export function MakeProductPopup(props: IProps): React.ReactElement {
    const allCities = Object.keys(props.division.offices)
        .filter((cityName: string) => props.division.offices[cityName] !== 0);
    const [city, setCity] = useState(allCities.length > 0 ? allCities[0] : '');
    const [name, setName] = useState('');
    const [design, setDesign] = useState<number | null>(null);
    const [marketing, setMarketing] = useState<number | null>(null);
    if (props.division.hasMaximumNumberProducts()) return (<></>);

    function makeProduct(): void {
        let designInvest = design;
        let marketingInvest = marketing;
        if (designInvest == null || designInvest < 0) { designInvest = 0; }
        if (marketingInvest == null || marketingInvest < 0) { marketingInvest = 0; }
        if (name == null || name === "") {
            dialogBoxCreate("You must specify a name for your product!");
        } else if (isNaN(designInvest)) {
            dialogBoxCreate("Invalid value for design investment");
        } else if (isNaN(marketingInvest))  {
            dialogBoxCreate("Invalid value for marketing investment");
        } else if (props.corp.funds.lt(designInvest + marketingInvest)) {
            dialogBoxCreate("You don't have enough company funds to make this large of an investment");
        } else {
            const product = new Product({
                name: name.replace(/[<>]/g, ''), //Sanitize for HTMl elements
                createCity: city,
                designCost: designInvest,
                advCost: marketingInvest,
            });
            if (props.division.products[product.name] instanceof Product) {
                dialogBoxCreate(`You already have a product with this name!`);
                return;
            }
            props.corp.funds = props.corp.funds.minus(designInvest + marketingInvest);
            props.division.products[product.name] = product;
            removePopup(props.popupId);
        }
    }

    function onCityChange(event: React.ChangeEvent<HTMLSelectElement>): void {
        setCity(event.target.value);
    }

    function onProductNameChange(event: React.ChangeEvent<HTMLInputElement>): void {
        setName(event.target.value);
    }

    function onDesignChange(event: React.ChangeEvent<HTMLInputElement>): void {
        if(event.target.value === "") setDesign(null);
        else setDesign(parseFloat(event.target.value));
    }

    function onMarketingChange(event: React.ChangeEvent<HTMLInputElement>): void {
        if(event.target.value === "") setMarketing(null);
        else setMarketing(parseFloat(event.target.value));
    }

    function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void {
        if (event.keyCode === 13) makeProduct();
    }

    return (<>
        <p dangerouslySetInnerHTML={{__html: props.popupText}} />
        <select className="dropdown" style={{margin: "5px"}} onChange={onCityChange} defaultValue={city}>
            {
                allCities.map((cityName: string) => <option key={cityName} value={cityName}>{cityName}</option>)
            }
        </select>
        <input onChange={onProductNameChange} className="text-input" style={{margin:"5px"}} placeholder={productPlaceholder(props.division.type)} />
        <br />
        <input onChange={onDesignChange} autoFocus={true} type="number" className="text-input" style={{margin:"5px"}} placeholder={"Design investment"}/>
        <input onChange={onMarketingChange} onKeyDown={onKeyDown} type="number" className="text-input" style={{margin:"5px"}} placeholder={"Marketing investment"}/>
        <button className="std-button" onClick={makeProduct}>Develop Product</button>
    </>);
}
