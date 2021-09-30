import React, { useState } from "react";
import { dialogBoxCreate } from "../../ui/React/DialogBox";
import { Modal } from "../../ui/React/Modal";
import { Industries } from "../IndustryData";
import { MakeProduct } from "../Actions";
import { useCorporation, useDivision } from "./Context";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";

interface IProps {
  open: boolean;
  onClose: () => void;
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
export function MakeProductModal(props: IProps): React.ReactElement {
  const corp = useCorporation();
  const division = useDivision();
  const allCities = Object.keys(division.offices).filter((cityName: string) => division.offices[cityName] !== 0);
  const [city, setCity] = useState(allCities.length > 0 ? allCities[0] : "");
  const [name, setName] = useState("");
  const [design, setDesign] = useState<number | null>(null);
  const [marketing, setMarketing] = useState<number | null>(null);
  if (division.hasMaximumNumberProducts()) return <></>;

  let createProductPopupText = <></>;
  switch (division.type) {
    case Industries.Food:
      createProductPopupText = (
        <>
          {createProductPopupText}
          <br />
          Build and manage a new restaurant!
        </>
      );
      break;
    case Industries.Tobacco:
      createProductPopupText = (
        <>
          {createProductPopupText}
          <br />
          Create a new tobacco product!
        </>
      );
      break;
    case Industries.Pharmaceutical:
      createProductPopupText = (
        <>
          {createProductPopupText}
          <br />
          Design and develop a new pharmaceutical drug!
        </>
      );
      break;
    case Industries.Computer:
    case "Computer":
      createProductPopupText = (
        <>
          {createProductPopupText}
          <br />
          Design and manufacture a new computer hardware product!
        </>
      );
      break;
    case Industries.Robotics:
      createProductPopupText = (
        <>
          {createProductPopupText}
          <br />
          Design and create a new robot or robotic system!
        </>
      );
      break;
    case Industries.Software:
      createProductPopupText = (
        <>
          {createProductPopupText}
          <br />
          Develop a new piece of software!
        </>
      );
      break;
    case Industries.Healthcare:
      createProductPopupText = (
        <>
          {createProductPopupText}
          <br />
          Build and manage a new hospital!
        </>
      );
      break;
    case Industries.RealEstate:
      createProductPopupText = (
        <>
          {createProductPopupText}
          <br />
          Develop a new piece of real estate property!
        </>
      );
      break;
    default:
      createProductPopupText = (
        <>
          {createProductPopupText}
          <br />
          Create a new product!
        </>
      );
      return <></>;
  }
  createProductPopupText = (
    <>
      {createProductPopupText}
      <br />
      <br />
      To begin developing a product, first choose the city in which it will be designed. The stats of your employees in
      the selected city affect the properties of the finished product, such as its quality, performance, and durability.
      <br />
      <br />
      You can also choose to invest money in the design and marketing of the product. Investing money in its design will
      result in a superior product. Investing money in marketing the product will help the product's sales.
    </>
  );

  function makeProduct(): void {
    if (design === null || marketing === null) return;
    try {
      MakeProduct(corp, division, city, name, design, marketing);
    } catch (err) {
      dialogBoxCreate(err + "");
    }
    props.onClose();
  }

  function onCityChange(event: SelectChangeEvent<string>): void {
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
    <Modal open={props.open} onClose={props.onClose}>
      <Typography>{createProductPopupText}</Typography>
      <Select style={{ margin: "5px" }} onChange={onCityChange} defaultValue={city}>
        {allCities.map((cityName: string) => (
          <MenuItem key={cityName} value={cityName}>
            {cityName}
          </MenuItem>
        ))}
      </Select>
      <TextField onChange={onProductNameChange} placeholder={productPlaceholder(division.type)} />
      <br />
      <TextField onChange={onDesignChange} autoFocus={true} type="number" placeholder={"Design investment"} />
      <TextField
        onChange={onMarketingChange}
        onKeyDown={onKeyDown}
        type="number"
        placeholder={"Marketing investment"}
      />
      <Button onClick={makeProduct}>Develop Product</Button>
    </Modal>
  );
}
