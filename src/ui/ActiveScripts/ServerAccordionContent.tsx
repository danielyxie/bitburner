import React, { useState } from "react";
import { WorkerScript } from "../../Netscript/WorkerScript";
import { WorkerScriptAccordion } from "./WorkerScriptAccordion";
import { AccordionButton } from "../React/AccordionButton";

const pageSize = 20;

interface IProps {
  workerScripts: WorkerScript[];
}

export function ServerAccordionContent(props: IProps): React.ReactElement {
  if (props.workerScripts.length > pageSize) {
    return <ServerAccordionContentPaginated workerScripts={props.workerScripts} />;
  }

  return (
    <ul>
      {props.workerScripts.map((ws) => {
        return <WorkerScriptAccordion key={`${ws.name}_${ws.args}`} workerScript={ws} />;
      })}
    </ul>
  );
}

export function ServerAccordionContentPaginated(props: IProps): React.ReactElement {
  const [page, setPage] = useState(0);
  const scripts: React.ReactElement[] = [];
  const maxPage = Math.ceil(props.workerScripts.length / pageSize);
  const maxScript = Math.min((page + 1) * pageSize, props.workerScripts.length);
  for (let i = page * pageSize; i < maxScript; i++) {
    const ws = props.workerScripts[i];
    scripts.push(<WorkerScriptAccordion key={`${ws.name}_${ws.args}`} workerScript={ws} />);
  }

  function capPage(page: number): number {
    if (page < 0) {
      page = 0;
    }

    if (maxPage - 1 < page) {
      page = maxPage - 1;
    }

    return page;
  }

  // in case we're on an invalid page number because scripts were killed.
  const capped = capPage(page);
  if (capped !== page) setPage(capped);

  function changePage(n: number): void {
    setPage((newPage) => {
      newPage += n;
      newPage = Math.round(newPage);
      return capPage(newPage);
    });
  }

  return (
    <>
      <ul>{scripts}</ul>
      <AccordionButton onClick={() => changePage(-1e99)} text="<<" />
      <AccordionButton onClick={() => changePage(-1)} text="<" />
      <span className="text">
        {page + 1} / {maxPage}
      </span>
      <AccordionButton onClick={() => changePage(1)} text=">" />
      <AccordionButton onClick={() => changePage(1e99)} text=">>" />
    </>
  );
}
