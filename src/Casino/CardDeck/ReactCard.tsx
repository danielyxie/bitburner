import React, { FC } from "react";
import { Card, Suit } from "./Card";

type Props = {
    card: Card;
    hidden?: boolean;
}

export const ReactCard: FC<Props> = ({ card, hidden }) => {
    let suit : React.ReactNode;
    switch (card.suit) {
        case Suit.Clubs:
            suit = <span>&#9827;</span>;
            break;
        case Suit.Diamonds:
            suit = <span>&#9830;</span>;
            break;
        case Suit.Hearts:
            suit = <span>&#9829;</span>;
            break;
        case Suit.Spades:
            suit = <span>&#9824;</span>;
            break;
        default:
            throw new Error(`MissingCaseException: ${card.suit}`);

    }
    return (
        <div className={`casino-card ${card.isRedSuit() ? "red" : "black"}`}>
            {!hidden && (
                <>
                    <div className="value">
                        {card.formatValue()}
                    </div>
                    <div className={`suit`}>
                        {suit}
                    </div>
                </>
            )}
        </div>
    )
}