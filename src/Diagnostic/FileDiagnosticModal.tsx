import React from "react";
import { AllServers } from "../Server/AllServers";
import { Modal } from "../ui/React/Modal";
import { numeralWrapper } from "../ui/numeralFormat";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

interface IServerProps {
  ip: string;
}

export function ServerAccordion(props: IServerProps): React.ReactElement {
  const server = AllServers[props.ip];
  let totalSize = 0;
  for (const f of server.scripts) {
    totalSize += f.code.length;
  }

  for (const f of server.textFiles) {
    totalSize += f.text.length;
  }

  if (totalSize === 0) {
    return <></>;
  }

  interface File {
    name: string;
    size: number;
  }

  const files: File[] = [];

  for (const f of server.scripts) {
    files.push({ name: f.filename, size: f.code.length });
  }

  for (const f of server.textFiles) {
    files.push({ name: f.fn, size: f.text.length });
  }

  files.sort((a: File, b: File): number => b.size - a.size);

  return (
    <Accordion TransitionProps={{ unmountOnExit: true }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>
          {server.hostname} ({numeralWrapper.formatBigNumber(totalSize)}b)
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography>Filename</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography>Size</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {files.map((file: File) => (
                <TableRow key={file.name}>
                  <TableCell component="th" scope="row">
                    <Typography>{file.name}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography>{numeralWrapper.formatBigNumber(file.size)}b</Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <ul></ul>
      </AccordionDetails>
    </Accordion>
  );
}

interface IProps {
  open: boolean;
  onClose: () => void;
}

export function FileDiagnosticModal(props: IProps): React.ReactElement {
  const ips: string[] = [];
  for (const ip of Object.keys(AllServers)) {
    ips.push(ip);
  }

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <>
        <Typography>
          Welcome to the file diagnostic! If your save file is really big it's likely because you have too many
          text/scripts. This tool can help you narrow down where they are.
        </Typography>
        {ips.map((ip: string) => (
          <ServerAccordion key={ip} ip={ip} />
        ))}
      </>
    </Modal>
  );
}
