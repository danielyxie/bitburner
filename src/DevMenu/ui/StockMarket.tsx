import React, { useState } from "react";

import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import { Button } from "../../ui/React/Button";
import { TextField } from "../../ui/React/TextField";
import { Money } from "../../ui/React/Money";
import { Adjuster } from "./Adjuster";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { dialogBoxCreate } from "../../../utils/DialogBox";
import { StockMarket as SM } from "../../StockMarket/StockMarket";
import { Stock } from "../../StockMarket/Stock";

const bigNumber = 1e27;

interface IProps {
  player: IPlayer;
}

export function StockMarket(props: IProps): React.ReactElement {
  const [stockPrice, setStockPrice] = useState(0);
  const [stockSymbol, setStockSymbol] = useState("");

  function setStockPriceField(event: React.ChangeEvent<HTMLInputElement>): void {
    setStockPrice(parseFloat(event.target.value));
  }

  function setStockSymbolField(event: React.ChangeEvent<HTMLInputElement>): void {
    setStockSymbol(event.target.value);
  }

  function processStocks(sub: (arg0: Stock) => void): void {
    const inputSymbols = stockSymbol.replace(/\s/g, "");

    let match: (symbol: string) => boolean = (): boolean => {
      return true;
    };

    if (inputSymbols !== "" && inputSymbols !== "all") {
      match = function (symbol: string): boolean {
        return inputSymbols.split(",").includes(symbol);
      };
    }

    for (const name in SM) {
      if (SM.hasOwnProperty(name)) {
        const stock = SM[name];
        if (stock instanceof Stock && match(stock.symbol)) {
          sub(stock);
        }
      }
    }
  }

  function doSetStockPrice(): void {
    if (!isNaN(stockPrice)) {
      processStocks((stock: Stock) => {
        stock.price = stockPrice;
      });
    }
  }

  function viewStockCaps(): void {
    const stocks: JSX.Element[] = [];
    processStocks((stock: Stock) => {
      stocks.push(
        <tr key={stock.symbol}>
          <td>{stock.symbol}</td>
          <td style={{ textAlign: "right" }}>
            <Money money={stock.cap} />
          </td>
        </tr>,
      );
    });
    dialogBoxCreate(
      <table>
        <tbody>
          <tr>
            <th>Stock</th>
            <th>Price cap</th>
          </tr>
          {stocks}
        </tbody>
      </table>,
    );
  }
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <h2>Stock Market</h2>
      </AccordionSummary>
      <AccordionDetails>
        <table>
          <tbody>
            <tr>
              <td>
                <span className="text">Symbol:</span>
              </td>
              <td>
                <TextField placeholder="symbol/'all'" onChange={setStockSymbolField} />
              </td>
            </tr>
            <tr>
              <td>
                <span className="text">Price:</span>
              </td>
              <td>
                <TextField placeholder="$$$" onChange={setStockPriceField} />
                <Button onClick={doSetStockPrice}>Set</Button>
              </td>
            </tr>
            <tr>
              <td>
                <span className="text">Caps:</span>
              </td>
              <td>
                <Button onClick={viewStockCaps}>View stock caps</Button>
              </td>
            </tr>
          </tbody>
        </table>
      </AccordionDetails>
    </Accordion>
  );
}
