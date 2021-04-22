/**
 * Represents a Hand of cards.
 * 
 * This class is IMMUTABLE 
 */

import { Card } from "./Card";

export class Hand {

    constructor(readonly cards: readonly Card[]) {}

    addCards(...cards: Card[]): Hand {
        return new Hand([ ...this.cards, ...cards ]);
    }

    removeByIndex(i: number): Hand {
        if (i >= this.cards.length) {
            throw new Error(`Tried to remove invalid card from Hand by index: ${i}`);
        }

        return new Hand([ ...this.cards.slice().splice(i, 1) ])
    }

}