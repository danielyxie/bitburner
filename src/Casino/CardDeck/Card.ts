export enum Suit {
    Clubs,
    Diamonds,
    Hearts,
    Spades,
};

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

}