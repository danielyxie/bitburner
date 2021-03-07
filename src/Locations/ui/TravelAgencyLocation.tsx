/**
 * React Subcomponent for displaying a location's UI, when that location is a Travel Agency
 *
 * This subcomponent renders all of the buttons for traveling to different cities
 */
import * as React from "react";

import { CityName }             from "../data/CityNames";
import { createTravelPopup }    from "../LocationsHelpers";

import { CONSTANTS }            from "../../Constants";
import { IPlayer }              from "../../PersonObjects/IPlayer";

import { numeralWrapper }       from "../../ui/numeralFormat";
import { StdButton }            from "../../ui/React/StdButton";

type IProps = {
    p: IPlayer;
    travel: (to: CityName) => void;
}

export class TravelAgencyLocation extends React.Component<IProps, any> {
    /**
     * Stores button styling that sets them all to block display
     */
    btnStyle: object;

    constructor(props: IProps) {
        super(props);

        this.btnStyle = { display: "block" };
    }

    render() {
        const thisTravelAgencyLocation = this;

        function LocationLetter(props: any) {
            if(props.city !== thisTravelAgencyLocation.props.p.city) {
                return <span className='tooltip' style={{color: 'blue', whiteSpace: 'nowrap', margin: '0px', padding: '0px'}} onClick={createTravelPopup.bind(null, props.city, thisTravelAgencyLocation.props.travel)}>
                    <span className='tooltiptext'>{props.city}</span>
                    {props.city[0]}
                </span>
            }
            return <span>{props.city[0]}</span>
        }

        return (
            <div>
                <p>
                    From here, you can travel to any other city! A ticket
                    costs {numeralWrapper.formatMoney(CONSTANTS.TravelCost)}
                </p>
<pre>               ,_   .  ._. _.  .</pre>
<pre>           , _-\','|~\~      ~/      ;-'_   _-'     ,;_;_,    ~~-</pre>
<pre>  /~~-\_/-'~'--' \~~| ',    ,'      /  / ~|-_\_/~/~      ~~--~~~~'--_</pre>
<pre>  /              ,/'-/~ '\ ,' _  , '<LocationLetter city='Volhaven' />,'|~                   ._/-, /~</pre>
<pre>  ~/-'~\_,       '-,| '|. '   ~  ,\ /'~                /    /_  /~</pre>
<pre>.-~      '|        '',\~|\       _\~     ,_  ,     <LocationLetter city='Chongqing' />         /,</pre>
<pre>          '\     <LocationLetter city='Sector-12' />  /'~          |_/~\\,-,~  \ "         ,_,/ |</pre>
<pre>           |       /            ._-~'\_ _~|              \ ) <LocationLetter city='New Tokyo' /></pre>
<pre>            \   __-\           '/      ~ |\  \_          /  ~</pre>
<pre>  .,         '\ |,  ~-_      - |          \\_' ~|  /\  \~ ,</pre>
<pre>               ~-_'  _;       '\           '-,   \,' /\/  |</pre>
<pre>                 '\_,~'\_       \_ _,       /'    '  |, /|'</pre>
<pre>                   /     \_       ~ |      /         \  ~'; -,_.</pre>
<pre>                   |       ~\        |    |  ,        '-_, ,; ~ ~\</pre>
<pre>                    \,   <LocationLetter city='Aevum' />  /        \    / /|            ,-, ,   -,</pre>
<pre>                     |    ,/          |  |' |/          ,-   ~ \   '.</pre>
<pre>                    ,|   ,/           \ ,/              \   <LocationLetter city='Ishima' />   |</pre>
<pre>                    /    |             ~                 -~~-, /   _</pre>
<pre>                    | ,-'                                    ~    /</pre>
<pre>                    / ,'                                      ~</pre>
<pre>                    ',|  ~</pre>
<pre>                      ~'</pre>
            </div>
        )
    }
}
