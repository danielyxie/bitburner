// Enum values are lowercased to match css classes
export enum Suit {
    Clubs = "clubs",
    Diamonds = "diamonds",
    Hearts = "hearts",
    Spades = "spades",
}

export class Card {

    constructor(readonly value: number, readonly suit: Suit) {
        if (value < 1 || value > 13) {
            throw new Error(`Card instantiated with improper value: ${value}`);
        }
    }

    formatValue(): string {
        switch (this.value) {
            case 1: 
                return "A";
            case 11: 
                return "J";
            case 12: 
                return "Q";
            case 13:
                return "K";
            default:
                return `${this.value}`;
        }
    }

    isRedSuit(): boolean {
        return this.suit === Suit.Hearts || this.suit === Suit.Diamonds;
    }

    getStringRepresentation(): string {
        const value = this.formatValue();

        return `${value} of ${this.suit}`;
    }

}