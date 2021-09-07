/**
 * React Subcomponent for displaying a location's UI, when that location is a Travel Agency
 *
 * TThis subcomponent renders all of the buttons for traveling to different cities
 */
import * as React from "react";

import { CityName } from "../data/CityNames";
import { createTravelPopup } from "../LocationsHelpers";

import { CONSTANTS } from "../../Constants";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { Settings } from "../../Settings/Settings";

import { StdButton } from "../../ui/React/StdButton";
import { Money } from "../../ui/React/Money";

type IProps = {
  p: IPlayer;
  travel: (to: CityName) => void;
};

export class TravelAgencyLocation extends React.Component<IProps, any> {
  /**
   * Stores button styling that sets them all to block display
   */
  btnStyle: any;

  constructor(props: IProps) {
    super(props);

    this.btnStyle = { display: "block" };
  }

  asciiWorldMap(): React.ReactNode {
    const LocationLetter = (props: any): JSX.Element => {
      if (props.city !== this.props.p.city) {
        return (
          <span
            className="tooltip"
            style={{
              color: "white",
              whiteSpace: "nowrap",
              margin: "0px",
              padding: "0px",
            }}
            onClick={createTravelPopup.bind(
              null,
              props.city,
              this.props.travel,
            )}
          >
            <span className="tooltiptext">{props.city}</span>
            <b>{props.city[0]}</b>
          </span>
        );
      }
      return <span>{props.city[0]}</span>;
    };

    // map needs all this whitespace!
    // prettier-ignore
    return (
      <div className="noselect">
        <p>
          From here, you can travel to any other city! A ticket costs{" "}
          <Money money={CONSTANTS.TravelCost} player={this.props.p} />.
        </p>
        <pre>               ,_   .  ._. _.  .</pre>
        <pre>           , _-\','|~\~      ~/      ;-'_   _-'     ,;_;_,    ~~-</pre>
        <pre>  /~~-\_/-'~'--' \~~| ',    ,'      /  / ~|-_\_/~/~      ~~--~~~~'--_</pre>
        <pre>  /              ,/'-/~ '\ ,' _  , '<LocationLetter city="Volhaven" />,'|~                   ._/-, /~</pre>
        <pre>  ~/-'~\_,       '-,| '|. '   ~  ,\ /'~                /    /_  /~</pre>
        <pre>.-~      '|        '',\~|\       _\~     ,_  ,     <LocationLetter city="Chongqing" />         /,</pre>
        <pre>          '\     <LocationLetter city="Sector-12" />  /'~          |_/~\\,-,~  \ "         ,_,/ |</pre>
        <pre>           |       /            ._-~'\_ _~|              \ ) <LocationLetter city="New Tokyo" /></pre>
        <pre>            \   __-\           '/      ~ |\  \_          /  ~</pre>
        <pre>  .,         '\ |,  ~-_      - |          \\_' ~|  /\  \~ ,</pre>
        <pre>               ~-_'  _;       '\           '-,   \,' /\/  |</pre>
        <pre>                 '\_,~'\_       \_ _,       /'    '  |, /|'</pre>
        <pre>                   /     \_       ~ |      /         \  ~'; -,_.</pre>
        <pre>                   |       ~\        |    |  ,        '-_, ,; ~ ~\</pre>
        <pre>                    \,   <LocationLetter city="Aevum" />  /        \    / /|            ,-, ,   -,</pre>
        <pre>                     |    ,/          |  |' |/          ,-   ~ \   '.</pre>
        <pre>                    ,|   ,/           \ ,/              \   <LocationLetter city="Ishima" />   |</pre>
        <pre>                    /    |             ~                 -~~-, /   _</pre>
        <pre>                    | ,-'                                    ~    /</pre>
        <pre>                    / ,'                                      ~</pre>
        <pre>                    ',|  ~</pre>
        <pre>                      ~'</pre>
      </div>
    );
  }

  listWorldMap(): React.ReactNode {
    const travelBtns: React.ReactNode[] = [];
    for (const key in CityName) {
      const city: CityName = (CityName as any)[key];

      // Skip current city
      if (city === this.props.p.city) {
        continue;
      }

      travelBtns.push(
        <StdButton
          key={city}
          onClick={createTravelPopup.bind(null, city, this.props.travel)}
          style={this.btnStyle}
          text={`Travel to ${city}`}
        />,
      );
    }

    return (
      <div>
        <p>
          From here, you can travel to any other city! A ticket costs{" "}
          <Money money={CONSTANTS.TravelCost} />.
        </p>
        {travelBtns}
      </div>
    );
  }

  render(): React.ReactNode {
    if (Settings.DisableASCIIArt) {
      return this.listWorldMap();
    } else {
      return this.asciiWorldMap();
    }
  }
}
