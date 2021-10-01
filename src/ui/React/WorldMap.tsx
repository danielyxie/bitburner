import React from "react";
import { CityName } from "../../Locations/data/CityNames";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";

interface ICityProps {
  currentCity: CityName;
  city: CityName;
  onTravel: (city: CityName) => void;
}

function City(props: ICityProps): React.ReactElement {
  if (props.city !== props.currentCity) {
    return (
      <Tooltip title={props.city}>
        <span
          onClick={() => props.onTravel(props.city)}
          style={{ color: "white", lineHeight: "1em", whiteSpace: "pre" }}
        >
          {props.city[0]}
        </span>
      </Tooltip>
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
    <>
        <Typography sx={{lineHeight: '1em',whiteSpace: 'pre'}}>               ,_   .  ._. _.  .</Typography>
        <Typography sx={{lineHeight: '1em',whiteSpace: 'pre'}}>           , _-\','|~\~      ~/      ;-'_   _-'     ,;_;_,    ~~-</Typography>
        <Typography sx={{lineHeight: '1em',whiteSpace: 'pre'}}>  /~~-\_/-'~'--' \~~| ',    ,'      /  / ~|-_\_/~/~      ~~--~~~~'--_</Typography>
        <Typography sx={{lineHeight: '1em',whiteSpace: 'pre'}}>  /              ,/'-/~ '\ ,' _  , '<City onTravel={props.onTravel} currentCity={props.currentCity} city={CityName.Volhaven} />,'|~                   ._/-, /~</Typography>
        <Typography sx={{lineHeight: '1em',whiteSpace: 'pre'}}>  ~/-'~\_,       '-,| '|. '   ~  ,\ /'~                /    /_  /~</Typography>
        <Typography sx={{lineHeight: '1em',whiteSpace: 'pre'}}>.-~      '|        '',\~|\       _\~     ,_  ,     <City onTravel={props.onTravel} currentCity={props.currentCity} city={CityName.Chongqing} />         /,</Typography>
        <Typography sx={{lineHeight: '1em',whiteSpace: 'pre'}}>          '\     <City onTravel={props.onTravel} currentCity={props.currentCity} city={CityName.Sector12} />  /'~          |_/~\\,-,~  \ "         ,_,/ |</Typography>
        <Typography sx={{lineHeight: '1em',whiteSpace: 'pre'}}>           |       /            ._-~'\_ _~|              \ ) <City onTravel={props.onTravel} currentCity={props.currentCity} city={CityName.NewTokyo} /></Typography>
        <Typography sx={{lineHeight: '1em',whiteSpace: 'pre'}}>            \   __-\           '/      ~ |\  \_          /  ~</Typography>
        <Typography sx={{lineHeight: '1em',whiteSpace: 'pre'}}>  .,         '\ |,  ~-_      - |          \\_' ~|  /\  \~ ,</Typography>
        <Typography sx={{lineHeight: '1em',whiteSpace: 'pre'}}>               ~-_'  _;       '\           '-,   \,' /\/  |</Typography>
        <Typography sx={{lineHeight: '1em',whiteSpace: 'pre'}}>                 '\_,~'\_       \_ _,       /'    '  |, /|'</Typography>
        <Typography sx={{lineHeight: '1em',whiteSpace: 'pre'}}>                   /     \_       ~ |      /         \  ~'; -,_.</Typography>
        <Typography sx={{lineHeight: '1em',whiteSpace: 'pre'}}>                   |       ~\        |    |  ,        '-_, ,; ~ ~\</Typography>
        <Typography sx={{lineHeight: '1em',whiteSpace: 'pre'}}>                    \,   <City onTravel={props.onTravel} currentCity={props.currentCity} city={CityName.Aevum} />  /        \    / /|            ,-, ,   -,</Typography>
        <Typography sx={{lineHeight: '1em',whiteSpace: 'pre'}}>                     |    ,/          |  |' |/          ,-   ~ \   '.</Typography>
        <Typography sx={{lineHeight: '1em',whiteSpace: 'pre'}}>                    ,|   ,/           \ ,/              \   <City onTravel={props.onTravel} currentCity={props.currentCity} city={CityName.Ishima} />   |</Typography>
        <Typography sx={{lineHeight: '1em',whiteSpace: 'pre'}}>                    /    |             ~                 -~~-, /   _</Typography>
        <Typography sx={{lineHeight: '1em',whiteSpace: 'pre'}}>                    | ,-'                                    ~    /</Typography>
        <Typography sx={{lineHeight: '1em',whiteSpace: 'pre'}}>                    / ,'                                      ~</Typography>
        <Typography sx={{lineHeight: '1em',whiteSpace: 'pre'}}>                    ',|  ~</Typography>
        <Typography sx={{lineHeight: '1em',whiteSpace: 'pre'}}>                      ~'</Typography>
    </>
  );
}
