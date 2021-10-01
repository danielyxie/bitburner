import React, { FC } from "react";
import { Card, Suit } from "./Card";
import { Theme } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import createStyles from "@mui/styles/createStyles";

type Props = {
  card: Card;
  hidden?: boolean;
};

const useStyles = makeStyles(() =>
  createStyles({
    card: {
      padding: "10px",
      border: "solid 1px #808080",
      backgroundColor: "white",
      display: "inline-block",
      borderRadius: "10px",
      fontSize: "18.5px",
      textAlign: "center",
      margin: "3px",
      fontWeight: "bold",
    },
    red: {
      color: "red",
    },

    black: {
      color: "black",
    },
    value: {
      fontSize: "20px",
      fontFamily: "sans-serif",
    },
  }),
);

export const ReactCard: FC<Props> = ({ card, hidden }) => {
  const classes = useStyles();
  let suit: React.ReactNode;
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
    <div className={`${classes.card} ${card.isRedSuit() ? classes.red : classes.black}`}>
      <>
        <div className={classes.value}>{hidden ? " - " : card.formatValue()}</div>
        <div>{hidden ? " - " : suit}</div>
      </>
    </div>
  );
};
