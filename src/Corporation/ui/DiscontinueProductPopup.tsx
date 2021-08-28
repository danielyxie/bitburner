import React from 'react';
import { removePopup } from "../../ui/React/createPopup";

interface IProps {
    product: any;
    industry: any;
    corp: any;
    popupId: string;
}

// Create a popup that lets the player discontinue a product
export function DiscontinueProductPopup(props: IProps): React.ReactElement {
    function discontinue(): void {
        props.industry.discontinueProduct(props.product);
        removePopup(props.popupId);
        props.corp.rerender();
    }

    return (<>
        <p>
Are you sure you want to do this? Discontinuing a product
removes it completely and permanently. You will no longer
produce this product and all of its existing stock will be
removed and left unsold</p>
        <button className="popup-box-button" onClick={discontinue}>Discontinue</button>
    </>);
}