import React from "react";
import { AllServers } from "../Server/AllServers";
import { BBAccordion } from "../ui/React/BBAccordion";
import { numeralWrapper } from "../ui/numeralFormat";

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
    <BBAccordion
      headerContent={
        <>
          {server.hostname} ({numeralWrapper.formatBigNumber(totalSize)}b)
        </>
      }
      panelContent={
        <ul>
          {files.map((file: File) => (
            <li key={file.name}>
              {file.name}: {numeralWrapper.formatBigNumber(file.size)}b
            </li>
          ))}
        </ul>
      }
    />
  );
}

export function FileDiagnosticPopup(): React.ReactElement {
  const ips: string[] = [];
  for (const ip of Object.keys(AllServers)) {
    ips.push(ip);
  }

  return (
    <>
      <p>
        Welcome to the file diagnostic! If your save file is really big it's likely because you have too many
        text/scripts. This tool can help you narrow down where they are.
      </p>
      {ips.map((ip: string) => (
        <ServerAccordion key={ip} ip={ip} />
      ))}
    </>
  );
}
