import * as React from "react";

import { IPlayer } from "../PersonObjects/IPlayer";
import { Money } from "../ui/React/Money";
import { Game } from "./Game";
import { Deck } from "./CardDeck/Deck";
import { Hand } from "./CardDeck/Hand";
import { InputAdornment } from "@material-ui/core";
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
};

type State = {
  playerHand: Hand;
  dealerHand: Hand;
  bet: number;
  betInput: string;
  gameInProgress: boolean;
  result: Result;
  gains: number; // Track gains only for this session
  wagerInvalid: boolean;
  wagerInvalidHelperText: string;
};

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
    };
  }

  canStartGame = (): boolean => {
    const { p } = this.props;
    const { bet } = this.state;

    return p.canAfford(bet);
  };

  startGame = (): void => {
    if (!this.canStartGame()) {
      return;
    }

    // Take money from player right away so that player's dont just "leave" to avoid the loss (I mean they could
    // always reload without saving but w.e)
    this.props.p.loseMoney(this.state.bet);

    const playerHand = new Hand([this.deck.safeDrawCard(), this.deck.safeDrawCard()]);
    const dealerHand = new Hand([this.deck.safeDrawCard(), this.deck.safeDrawCard()]);

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
    } else if (this.getTrueHandValue(dealerHand) === 21) {
      // Check if dealer won by blackjack. We know at this point that the player does not also have blackjack.
      this.finishGame(Result.DealerWon);
    }
  };

  // Returns an array of numbers representing all possible values of the given Hand. The reason it needs to be
  // an array is because an Ace can count as both 1 and 11.
  getHandValue = (hand: Hand): number[] => {
    let result: number[] = [0];

    for (let i = 0; i < hand.cards.length; ++i) {
      const value = hand.cards[i].value;
      if (value >= 10) {
        result = result.map((x) => x + 10);
      } else if (value === 1) {
        result = result.flatMap((x) => [x + 1, x + 11]);
      } else {
        result = result.map((x) => x + value);
      }
    }

    return result;
  };

  // Returns the single hand value used for determine things like victory and whether or not
  // the dealer has to hit. Essentially this uses the biggest value that's 21 or under. If no such value exists,
  // then it means the hand is busted and we can just return whatever
  getTrueHandValue = (hand: Hand): number => {
    const handValues = this.getHandValue(hand);
    const valuesUnder21 = handValues.filter((x) => x <= 21);

    if (valuesUnder21.length > 0) {
      valuesUnder21.sort((a, b) => a - b);
      return valuesUnder21[valuesUnder21.length - 1];
    } else {
      // Just return the first value. It doesnt really matter anyways since hand is buted
      return handValues[0];
    }
  };

  // Returns all hand values that are 21 or under. If no values are 21 or under, then the first value is returned.
  getHandDisplayValues = (hand: Hand): number[] => {
    const handValues = this.getHandValue(hand);
    if (this.isHandBusted(hand)) {
      // Hand is busted so just return the 1st value, doesn't really matter
      return [...new Set([handValues[0]])];
    } else {
      return [...new Set(handValues.filter((x) => x <= 21))];
    }
  };

  isHandBusted = (hand: Hand): boolean => {
    return this.getTrueHandValue(hand) > 21;
  };

  playerHit = (event: React.MouseEvent): void => {
    if (!event.isTrusted) {
      return;
    }

    const newHand = this.state.playerHand.addCards(this.deck.safeDrawCard());

    this.setState({
      playerHand: newHand,
    });

    // Check if player busted, and finish the game if so
    if (this.isHandBusted(newHand)) {
      this.finishGame(Result.DealerWon);
    }
  };

  playerStay = (event: React.MouseEvent): void => {
    if (!event.isTrusted) {
      return;
    }

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
    });

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
  };

  finishGame = (result: Result): void => {
    let gains = 0;
    if (this.isPlayerWinResult(result)) {
      gains = this.state.bet;

      // We 2x the gains because we took away money at the start, so we need to give the original bet back.
      this.win(this.props.p, 2 * gains);
    } else if (result === Result.DealerWon) {
      gains = -1 * this.state.bet;
      // Dont need to take money here since we already did it at the start
    } else if (result === Result.Tie) {
      this.win(this.props.p, this.state.bet); // Get the original bet back
    }

    this.setState({
      gameInProgress: false,
      result,
      gains: this.state.gains + gains,
    });
  };

  isPlayerWinResult = (result: Result): boolean => {
    return result === Result.PlayerWon || result === Result.PlayerWonByBlackjack;
  };

  wagerOnChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { p } = this.props;
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
    } else if (!p.canAfford(wager)) {
      this.setState({
        bet: 0,
        betInput,
        wagerInvalid: true,
        wagerInvalidHelperText: "Not enough money",
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
  };

  // Start game button
  startOnClick = (event: React.MouseEvent): void => {
    // Protect against scripting...although maybe this would be fun to automate
    if (!event.isTrusted) {
      return;
    }

    if (!this.state.wagerInvalid) {
      this.startGame();
    }
  };

  render(): React.ReactNode {
    const { betInput, playerHand, dealerHand, gameInProgress, result, wagerInvalid, wagerInvalidHelperText, gains } =
      this.state;

    // Get the player totals to display.
    const playerHandValues = this.getHandDisplayValues(playerHand);
    const dealerHandValues = this.getHandDisplayValues(dealerHand);

    return (
      <div>
        {/* Wager input */}
        <div>
          <MuiTextField
            value={betInput}
            label={
              <>
                {"Wager (Max: "}
                <Money money={MAX_BET} />
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
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
          />

          <p>
            {"Total earnings this session: "}
            <Money money={gains} />
          </p>
        </div>

        {/* Buttons */}
        {!gameInProgress ? (
          <div>
            <MuiButton color="primary" onClick={this.startOnClick} disabled={wagerInvalid || !this.canStartGame()}>
              Start
            </MuiButton>
          </div>
        ) : (
          <div>
            <MuiButton color="primary" onClick={this.playerHit}>
              Hit
            </MuiButton>
            <MuiButton color="secondary" onClick={this.playerStay}>
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

              <pre>Value(s): </pre>
              {playerHandValues.map((value, i) => (
                <pre key={i}>{value}</pre>
              ))}
            </MuiPaper>

            <br />

            <MuiPaper variant="outlined" elevation={2}>
              <pre>Dealer</pre>
              {dealerHand.cards.map((card, i) => (
                // Hide every card except the first while game is in progress
                <ReactCard card={card} hidden={gameInProgress && i !== 0} key={i} />
              ))}

              {!gameInProgress && (
                <>
                  <pre>Value(s): </pre>
                  {dealerHandValues.map((value, i) => (
                    <pre key={i}>{value}</pre>
                  ))}
                </>
              )}
            </MuiPaper>
          </div>
        )}

        {/* Results from previous round */}
        {result !== Result.Pending && (
          <p>
            {result}
            {this.isPlayerWinResult(result) && (
              <>
                {" You gained "}
                <Money money={this.state.bet} />
              </>
            )}
            {result === Result.DealerWon && (
              <>
                {" You lost "}
                <Money money={this.state.bet} />
              </>
            )}
          </p>
        )}
      </div>
    );
  }
}
