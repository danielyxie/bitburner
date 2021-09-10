import React, { useState } from "react";
import { dialogBoxCreate } from "../../../utils/DialogBox";
import { removePopup } from "../../ui/React/createPopup";
import { Industries } from "../IndustryData";
import { Product } from "../Product";
import { ICorporation } from "../ICorporation";
import { IIndustry } from "../IIndustry";
import { MakeProduct } from "../Actions";

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
  const allCities = Object.keys(props.division.offices).filter(
    (cityName: string) => props.division.offices[cityName] !== 0,
  );
  const [city, setCity] = useState(allCities.length > 0 ? allCities[0] : "");
  const [name, setName] = useState("");
  const [design, setDesign] = useState<number | null>(null);
  const [marketing, setMarketing] = useState<number | null>(null);
  if (props.division.hasMaximumNumberProducts()) return <></>;

  function makeProduct(): void {
    if (design === null || marketing === null) return;
    try {
      MakeProduct(props.corp, props.division, city, name, design, marketing);
    } catch (err) {
      dialogBoxCreate(err + "");
    }
    removePopup(props.popupId);
  }

  function onCityChange(event: React.ChangeEvent<HTMLSelectElement>): void {
    setCity(event.target.value);
  }

  function onProductNameChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setName(event.target.value);
  }

  function onDesignChange(event: React.ChangeEvent<HTMLInputElement>): void {
    if (event.target.value === "") setDesign(null);
    else setDesign(parseFloat(event.target.value));
  }

  function onMarketingChange(event: React.ChangeEvent<HTMLInputElement>): void {
    if (event.target.value === "") setMarketing(null);
    else setMarketing(parseFloat(event.target.value));
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void {
    if (event.keyCode === 13) makeProduct();
  }

  return (
    <>
      <p dangerouslySetInnerHTML={{ __html: props.popupText }} />
      <select className="dropdown" style={{ margin: "5px" }} onChange={onCityChange} defaultValue={city}>
        {allCities.map((cityName: string) => (
          <option key={cityName} value={cityName}>
            {cityName}
          </option>
        ))}
      </select>
      <input
        onChange={onProductNameChange}
        className="text-input"
        style={{ margin: "5px" }}
        placeholder={productPlaceholder(props.division.type)}
      />
      <br />
      <input
        onChange={onDesignChange}
        autoFocus={true}
        type="number"
        className="text-input"
        style={{ margin: "5px" }}
        placeholder={"Design investment"}
      />
      <input
        onChange={onMarketingChange}
        onKeyDown={onKeyDown}
        type="number"
        className="text-input"
        style={{ margin: "5px" }}
        placeholder={"Marketing investment"}
      />
      <button className="std-button" onClick={makeProduct}>
        Develop Product
      </button>
    </>
  );
}
