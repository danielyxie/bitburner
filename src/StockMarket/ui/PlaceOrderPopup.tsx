import React, { useState } from "react";

import { removePopup } from "../../ui/React/createPopup";

interface IProps {
  text: string;
  placeText: string;
  place: (price: number) => void;
  popupId: string;
}

export function PlaceOrderPopup(props: IProps): React.ReactElement {
  const [price, setPrice] = useState<number | null>(null);
  function onClick(): void {
    if (price === null) return;
    if (isNaN(price)) return;
    props.place(price);
    removePopup(props.popupId);
  }

  function onChange(event: React.ChangeEvent<HTMLInputElement>): void {
    if (event.target.value === "") setPrice(null);
    else setPrice(parseFloat(event.target.value));
  }
  return (
    <>
      <p>{props.text}</p>
      <input autoFocus={true} className="text-input" type="number" onChange={onChange} placeholder="price" />
      <button className="std-button" onClick={onClick}>
        {props.placeText}
      </button>
    </>
  );
}
