import { Card, Suit } from "./Card";
import { shuffle } from "lodash";

export class Deck {
  private cards: Card[] = [];

  // Support multiple decks
  constructor(private numDecks = 1) {
    this.reset();
  }

  shuffle(): void {
    this.cards = shuffle(this.cards); // Just use lodash
  }

  drawCard(): Card {
    if (this.cards.length == 0) {
      throw new Error("Tried to draw card from empty deck");
    }

    return this.cards.shift() as Card; // Guaranteed to return a Card since we throw an Error if array is empty
  }

  // Draws a card, resetting the deck beforehands if the Deck is empty
  safeDrawCard(): Card {
    if (this.cards.length === 0) {
      this.reset();
    }

    return this.drawCard();
  }

  // Reset the deck back to the original 52 cards and shuffle it
  reset(): void {
    this.cards = [];

    for (let i = 1; i <= 13; ++i) {
      for (let j = 0; j < this.numDecks; ++j) {
        this.cards.push(new Card(i, Suit.Clubs));
        this.cards.push(new Card(i, Suit.Diamonds));
        this.cards.push(new Card(i, Suit.Hearts));
        this.cards.push(new Card(i, Suit.Spades));
      }
    }

    this.shuffle();
  }

  size(): number {
    return this.cards.length;
  }

  isEmpty(): boolean {
    return this.cards.length === 0;
  }
}
