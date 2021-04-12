import { Card, Suit } from "./Card";
import { shuffle } from "lodash";

export class Deck {

    private cards: Card[] = [];

    constructor() {
        this.reset();
    }

    shuffle(): void {
        this.cards = shuffle(this.cards); // Just use lodash
    }

    drawCard(): Card | undefined {
        if (this.cards.length == 0) {
            throw new Error("Tried to draw card from empty deck");
        }

        return this.cards.shift();
    }

    // Reset the deck back to the original 52 cards and shuffle it
    reset(): void {
        this.cards = [];

        for (let i = 1; i <= 13; ++i) {
            this.cards.push(new Card(i, Suit.Clubs));
            this.cards.push(new Card(i, Suit.Diamonds));
            this.cards.push(new Card(i, Suit.Hearts));
            this.cards.push(new Card(i, Suit.Spades));
        }

        this.shuffle();
    }

    isEmpty() {
        return this.cards.length === 0;
    }

}