import React from "react";

interface IProps {
  onClick: () => void;
  name: string;
  current: boolean;
}

export function CityTab(props: IProps): React.ReactElement {
  let className = "cmpy-mgmt-city-tab";
  if (props.current) {
    className += " current";
  }

  return (
    <button className={className} onClick={props.onClick}>
      {props.name}
    </button>
  );
}
