import React, { useRef } from "react";
import { IIndustry } from "../IIndustry";
import { numeralWrapper } from "../../ui/numeralFormat";
import { CorporationConstants } from "../data/Constants";
import { removePopup } from "../../ui/React/createPopup";
import { dialogBoxCreate } from "../../../utils/DialogBox";
import { OfficeSpace } from "../OfficeSpace";
import { ICorporation } from "../ICorporation";
import { NewCity } from "../Actions";

interface IProps {
  popupId: string;
  corp: ICorporation;
  division: IIndustry;
  cityStateSetter: (city: string) => void;
}

export function ExpandNewCityPopup(props: IProps): React.ReactElement {
  const dropdown = useRef<HTMLSelectElement>(null);

  function expand(): void {
    if (dropdown.current === null) return;
    try {
      NewCity(props.corp, props.division, dropdown.current.value);
    } catch (err) {
      dialogBoxCreate(err + "");
      return;
    }

    dialogBoxCreate(`Opened a new office in ${dropdown.current.value}!`);

    props.cityStateSetter(dropdown.current.value);
    removePopup(props.popupId);
  }
  return (
    <>
      <p>
        Would you like to expand into a new city by opening an office? This
        would cost{" "}
        {numeralWrapper.format(
          CorporationConstants.OfficeInitialCost,
          "$0.000a",
        )}
      </p>
      <select ref={dropdown} className="dropdown" style={{ margin: "5px" }}>
        {Object.keys(props.division.offices)
          .filter((cityName: string) => props.division.offices[cityName] === 0)
          .map((cityName: string) => (
            <option key={cityName} value={cityName}>
              {cityName}
            </option>
          ))}
      </select>
      <button
        className="std-button"
        style={{ display: "inline-block" }}
        onClick={expand}
      >
        Confirm
      </button>
    </>
  );
}
