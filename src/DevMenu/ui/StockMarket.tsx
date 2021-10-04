import React, { useState } from "react";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Money } from "../../ui/React/Money";
import { dialogBoxCreate } from "../../ui/React/DialogBox";
import { StockMarket as SM } from "../../StockMarket/StockMarket";
import { Stock } from "../../StockMarket/Stock";

export function StockMarket(): React.ReactElement {
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
    <Accordion TransitionProps={{ unmountOnExit: true }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Stock Market</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <table>
          <tbody>
            <tr>
              <td>
                <Typography>Symbol:</Typography>
              </td>
              <td>
                <TextField placeholder="symbol/'all'" onChange={setStockSymbolField} />
              </td>
            </tr>
            <tr>
              <td>
                <Typography>Price:</Typography>
              </td>
              <td>
                <TextField placeholder="$$$" onChange={setStockPriceField} />
                <Button onClick={doSetStockPrice}>Set</Button>
              </td>
            </tr>
            <tr>
              <td>
                <Typography>Caps:</Typography>
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
