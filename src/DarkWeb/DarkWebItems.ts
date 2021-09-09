import { DarkWebItem } from "./DarkWebItem";
import { IMap } from "../types";
import { Programs } from "../Programs/Programs";

export const DarkWebItems: IMap<DarkWebItem> = {
  BruteSSHProgram: new DarkWebItem(Programs.BruteSSHProgram.name, 500e3, "Opens up SSH Ports"),
  FTPCrackProgram: new DarkWebItem(Programs.FTPCrackProgram.name, 1500e3, "Opens up FTP Ports"),
  RelaySMTPProgram: new DarkWebItem(Programs.RelaySMTPProgram.name, 5e6, "Opens up SMTP Ports"),
  HTTPWormProgram: new DarkWebItem(Programs.HTTPWormProgram.name, 30e6, "Opens up HTTP Ports"),
  SQLInjectProgram: new DarkWebItem(Programs.SQLInjectProgram.name, 250e6, "Opens up SQL Ports"),
  DeepscanV1: new DarkWebItem(Programs.DeepscanV1.name, 500000, "Enables 'scan-analyze' with a depth up to 5"),
  DeepscanV2: new DarkWebItem(Programs.DeepscanV2.name, 25e6, "Enables 'scan-analyze' with a depth up to 10"),
  AutolinkProgram: new DarkWebItem(Programs.AutoLink.name, 1e6, "Enables direct connect via 'scan-analyze'"),
  ServerProfilerProgram: new DarkWebItem(
    Programs.ServerProfiler.name,
    1e6,
    "Displays hacking and Netscript-related information about a server",
  ),
};
