import React from "react";
import { CityName } from "../../Locations/data/CityNames";

interface ICityProps {
  currentCity: CityName;
  city: CityName;
  onTravel: (city: CityName) => void;
}

function City(props: ICityProps): React.ReactElement {
  if (props.city !== props.currentCity) {
    return (
      <span
        className="tooltip"
        style={{
          color: "white",
          whiteSpace: "nowrap",
          margin: "0px",
          padding: "0px",
        }}
        onClick={() => props.onTravel(props.city)}
      >
        <span className="tooltiptext">{props.city}</span>
        <b>{props.city[0]}</b>
      </span>
    );
  }
  return <span>{props.city[0]}</span>;
}

interface IProps {
  currentCity: CityName;
  onTravel: (city: CityName) => void;
}

export function WorldMap(props: IProps): React.ReactElement {
  // prettier-ignore
  return (
    <div className="noselect">
        <pre>               ,_   .  ._. _.  .</pre>
        <pre>           , _-\','|~\~      ~/      ;-'_   _-'     ,;_;_,    ~~-</pre>
        <pre>  /~~-\_/-'~'--' \~~| ',    ,'      /  / ~|-_\_/~/~      ~~--~~~~'--_</pre>
        <pre>  /              ,/'-/~ '\ ,' _  , '<City onTravel={props.onTravel} currentCity={props.currentCity} city={CityName.Volhaven} />,'|~                   ._/-, /~</pre>
        <pre>  ~/-'~\_,       '-,| '|. '   ~  ,\ /'~                /    /_  /~</pre>
        <pre>.-~      '|        '',\~|\       _\~     ,_  ,     <City onTravel={props.onTravel} currentCity={props.currentCity} city={CityName.Chongqing} />         /,</pre>
        <pre>          '\     <City onTravel={props.onTravel} currentCity={props.currentCity} city={CityName.Sector12} />  /'~          |_/~\\,-,~  \ "         ,_,/ |</pre>
        <pre>           |       /            ._-~'\_ _~|              \ ) <City onTravel={props.onTravel} currentCity={props.currentCity} city={CityName.NewTokyo} /></pre>
        <pre>            \   __-\           '/      ~ |\  \_          /  ~</pre>
        <pre>  .,         '\ |,  ~-_      - |          \\_' ~|  /\  \~ ,</pre>
        <pre>               ~-_'  _;       '\           '-,   \,' /\/  |</pre>
        <pre>                 '\_,~'\_       \_ _,       /'    '  |, /|'</pre>
        <pre>                   /     \_       ~ |      /         \  ~'; -,_.</pre>
        <pre>                   |       ~\        |    |  ,        '-_, ,; ~ ~\</pre>
        <pre>                    \,   <City onTravel={props.onTravel} currentCity={props.currentCity} city={CityName.Aevum} />  /        \    / /|            ,-, ,   -,</pre>
        <pre>                     |    ,/          |  |' |/          ,-   ~ \   '.</pre>
        <pre>                    ,|   ,/           \ ,/              \   <City onTravel={props.onTravel} currentCity={props.currentCity} city={CityName.Ishima} />   |</pre>
        <pre>                    /    |             ~                 -~~-, /   _</pre>
        <pre>                    | ,-'                                    ~    /</pre>
        <pre>                    / ,'                                      ~</pre>
        <pre>                    ',|  ~</pre>
        <pre>                      ~'</pre>
    </div>
  );
}
