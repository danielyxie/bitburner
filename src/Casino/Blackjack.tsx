import * as React from "react";

import { IPlayer } from "../PersonObjects/IPlayer";
import { Money } from "../ui/React/Money";
import { Game } from "./Game";
import { Deck } from "./CardDeck/Deck";
import { Hand } from "./CardDeck/Hand";
import { InputAdornment, Paper } from "@material-ui/core";
import { ReactCard } from "./CardDeck/ReactCard";
import { MuiTextField } from "../ui/React/MuiTextField";
import { MuiButton } from "../ui/React/MuiButton";
import { MuiPaper } from "../ui/React/MuiPaper";

const MAX_BET = 100e6;

enum Result {
    Pending = "",
    PlayerWon = "You won!",
    PlayerWonByBlackjack = "You Won! Blackjack!",
    DealerWon = "You lost!",
    Tie = "Push! (Tie)",
}

type Props = {
    p: IPlayer;
}

type State ={
    playerHand: Hand;
    dealerHand: Hand;
    bet: number;
    betInput: string;
    gameInProgress: boolean;
    result: Result;
    gains: number; // Track gains only for this session
    wagerInvalid: boolean;
    wagerInvalidHelperText: string;
}

export class Blackjack extends Game<Props, State> {

    deck: Deck; 

    constructor(props: Props) {
        super(props);

        this.deck = new Deck(5); // 5-deck multideck

        const initialBet = 1e6;

        this.state = {
            playerHand: new Hand([]),
            dealerHand: new Hand([]),
            bet: initialBet,
            betInput: String(initialBet),
            gameInProgress: false,
            result: Result.Pending,
            gains: 0,
            wagerInvalid: false,
            wagerInvalidHelperText: "",
        }
    }

    startGame = (): void => {
        const playerHand = new Hand([ this.deck.safeDrawCard(), this.deck.safeDrawCard() ]);
        const dealerHand = new Hand([ this.deck.safeDrawCard(), this.deck.safeDrawCard() ]);

        this.setState({
            playerHand,
            dealerHand,
            gameInProgress: true,
            result: Result.Pending,
        });

        // If the player is dealt a blackjack and the dealer is not, then the player 
        // immediately wins
        if (this.getTrueHandValue(playerHand) === 21) {
            if (this.getTrueHandValue(dealerHand) === 21) {
                this.finishGame(Result.Tie);
            } else {
                this.finishGame(Result.PlayerWonByBlackjack);
            }
        }
    }

    // Returns a Tuple-2<number> since Aces can count as 1 or 11. If there's no Ace in the hand,
    // then both numbers will be equal. The 2nd number is guaranteed to be higher
    getHandValue = (hand: Hand): [ number, number ] => {
        let sum1 = 0;
        let sum2 = 0;

        for (let i = 0 ; i < hand.cards.length; ++i) {
            const value = hand.cards[i].value;
            if (value >= 10) {
                sum1 += 10;
                sum2 += 10;
            } else if (value === 1) {
                sum1 += 1;
                sum2 += 11;
            } else {
                sum1 += value;
                sum2 += value;
            }
        }

        return [ sum1, sum2 ];
    }

    // Returns the single hand value used for determine things like victory and whether or not 
    // the dealer has to hit. Essentially this uses the bigger value (2nd value from getHandValue()) if i
    // its 21 or under, otherwise the 1st value. 
    getTrueHandValue = (hand: Hand): number => {
        const [value1, value2] = this.getHandValue(hand);

        return value2 <= 21 ? value2 : value1;
    }

    isHandBusted = (hand: Hand): boolean => {
        const [ value1, value2 ] = this.getHandValue(hand);

        return value1 > 21 && value2 > 21;
    }

    playerHit = (): void => {
        const newHand = this.state.playerHand.addCards(this.deck.safeDrawCard());

        this.setState({
            playerHand: newHand,
        });

        // Check if player busted, and finish the game if so
        if (this.isHandBusted(newHand)) {
            this.finishGame(Result.DealerWon);
        }
    }

    playerStay = (): void => {
        // Determine if Dealer needs to hit. A dealer must hit if they have 16 or lower.
        // If the dealer has a Soft 17 (Ace + 6), then they stay.
        let newDealerHand = this.state.dealerHand;
        while (true) {
            // The dealer's "true" hand value is the 2nd one if its 21 or less (the 2nd value is always guaranteed
            // to be equal or larger). Otherwise its the 1st.
            const dealerHandValue = this.getTrueHandValue(newDealerHand);

            if (dealerHandValue <= 16) {
                newDealerHand = newDealerHand.addCards(this.deck.safeDrawCard());
            } else {
                break;
            }
        }

        this.setState({
            dealerHand: newDealerHand,
        })

        // If dealer has busted, then player wins
        if (this.isHandBusted(newDealerHand)) {
            this.finishGame(Result.PlayerWon);
        } else {
            const dealerHandValue = this.getTrueHandValue(newDealerHand);
            const playerHandValue = this.getTrueHandValue(this.state.playerHand);

            // We expect nobody to have busted. If someone busted, there is an error 
            // in our game logic
            if (dealerHandValue > 21 || playerHandValue > 21) {
                throw new Error("Someone busted when not expected to");
            }

            if (playerHandValue > dealerHandValue) {
                this.finishGame(Result.PlayerWon);
            } else if (playerHandValue < dealerHandValue) {
                this.finishGame(Result.DealerWon);
            } else {
                this.finishGame(Result.Tie);
            }
            
        }
    }

    finishGame = (result: Result): void => {
        let gains = 0;
        if (this.isPlayerWinResult(result)) {
            gains = this.state.bet;
            this.win(this.props.p, gains);
        } else if (result === Result.DealerWon) {
            gains = -1 * this.state.bet;
            this.win(this.props.p, gains);
        }

        this.setState({
            gameInProgress: false,
            result,
            gains: this.state.gains + gains,
        });
    }

    isPlayerWinResult = (result: Result): boolean => {
        return (result === Result.PlayerWon || result === Result.PlayerWonByBlackjack);
    }

    wagerOnChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const betInput = event.target.value;
        const wager = Math.round(parseFloat(betInput));
        if (isNaN(wager)) {
            this.setState({
                bet: 0,
                betInput,
                wagerInvalid: true,
                wagerInvalidHelperText: "Not a valid number",
            });
        } else if (wager <= 0) {
            this.setState({
                bet: 0,
                betInput,
                wagerInvalid: true,
                wagerInvalidHelperText: "Must bet a postive amount",
            });
        } else if (wager > MAX_BET) {
            this.setState({
                bet: 0,
                betInput,
                wagerInvalid: true,
                wagerInvalidHelperText: "Exceeds max bet",
            });
        } else {
            // Valid wager
            this.setState({
                bet: wager,
                betInput,
                wagerInvalid: false,
                wagerInvalidHelperText: "",
                result: Result.Pending, // Reset previous game status to clear the win/lose text UI
            });
        }
    }

    // Start game button
    startOnClick = (event: React.MouseEvent): void => {
        // Protect against scripting...although maybe this would be fun to automate
        if (!event.isTrusted) { return; }

        if (!this.state.wagerInvalid) {
            this.startGame();
        }
    }

    render(): React.ReactNode {
        const { 
            betInput,
            playerHand,
            dealerHand,
            gameInProgress,
            result,
            wagerInvalid,
            wagerInvalidHelperText,
        } = this.state;

        // Get the player totals to display. 
        const playerHandValues = this.getHandValue(playerHand);
        if (playerHandValues[1] > 21 || playerHandValues[0] === playerHandValues[1]) { playerHandValues.pop() }

        const dealerHandValues = this.getHandValue(dealerHand);
        if (dealerHandValues[1] > 21 || dealerHandValues[0] === dealerHandValues[1]) { dealerHandValues.pop(); }

        console.log(dealerHandValues);
        console.log(playerHandValues);

        return (
            <div> 
                {/* Wager input */}
                <MuiTextField 
                    value={betInput}
                    label={
                        <>
                            {"Wager (Max: "}
                            {Money(MAX_BET)}
                            {")"}
                        </>
                    }
                    disabled={gameInProgress}
                    onChange={this.wagerOnChange}
                    error={wagerInvalid}
                    helperText={wagerInvalid ? wagerInvalidHelperText : ""}
                    type="number"
                    variant="filled"
                    style={{
                        width: "200px",
                    }}
                    InputProps={{
                        startAdornment: <InputAdornment position="start" >$</InputAdornment>,
                    }} />

                {/* Buttons */}
                {!gameInProgress ? (
                    <div>
                        <MuiButton color="primary" onClick={this.startOnClick} disabled={wagerInvalid}>
                            Start
                        </MuiButton>
                    </div>
                ) : (
                    <div>
                        <MuiButton color="primary" onClick={this.playerHit} >
                            Hit
                        </MuiButton>
                        <MuiButton color="secondary" onClick={this.playerStay} >
                            Stay
                        </MuiButton>
                    </div>
                )}

                {/* Main game part. Displays both if the game is in progress OR if there's a result so you can see 
                  * the cards that led to that result. */}
                {(gameInProgress || result !== Result.Pending) && (
                    <div>
                        <MuiPaper variant="outlined" elevation={2}>
                            <pre>Player</pre> 
                            {playerHand.cards.map((card, i) => (
                                <ReactCard card={card} key={i} />
                            ))}

                            <pre>Value: </pre>
                            {playerHandValues.map((value, i) => (
                                <pre key={i}>{value}</pre>  
                            ))}
                        </MuiPaper>

                        <br />
                        
                        <MuiPaper variant="outlined" elevation={2}>
                            <pre>Dealer</pre>
                            {dealerHand.cards.map((card, i) => (
                                <ReactCard card={card} key={i} />
                            ))}

                            <pre>Value: </pre>
                            {dealerHandValues.map((value, i) => (
                                <pre key={i}>{value}</pre>
                            ))}
                        </MuiPaper>
                    </div>
                )}

                {/* Results from previous round */}
                {result !== Result.Pending && (
                    <p>
                        {result}
                        {this.isPlayerWinResult(result) && (
                            <>
                                {"You gained "}
                                {Money(this.state.bet)}
                            </>
                        )}
                        {result === Result.DealerWon && (
                            <>
                                {"You lost "}
                                {Money(this.state.bet)}
                            </>
                        )}
                    </p>
                )}
            </div>
        )
    }
}
