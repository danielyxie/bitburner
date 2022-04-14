import type { Theme } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import React from "react";

import { CityName } from "../../Locations/data/CityNames";

interface ICityProps {
  currentCity: CityName;
  city: CityName;
  onTravel: (city: CityName) => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    travel: {
      color: theme.colors.white,
      lineHeight: "1em",
      whiteSpace: "pre",
      cursor: "pointer",
    },
  }),
);

function City(props: ICityProps): React.ReactElement {
  const classes = useStyles();
  if (props.city !== props.currentCity) {
    return (
      <Tooltip title={<Typography>{props.city}</Typography>}>
        <span onClick={() => props.onTravel(props.city)} className={classes.travel}>
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
