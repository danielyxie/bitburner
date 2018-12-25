import { DarkWebItem } from "./DarkWebItem";
import { IMap } from "../types";
import { Programs } from "../Programs/Programs";

export const DarkWebItems: IMap<DarkWebItem> = {
    BruteSSHProgram:  new DarkWebItem(Programs.BruteSSHProgram.name, 500000, "Opens up SSH Ports"),
    FTPCrackProgram:  new DarkWebItem(Programs.FTPCrackProgram.name, 1500000, "Opens up FTP Ports"),
    RelaySMTPProgram: new DarkWebItem(Programs.RelaySMTPProgram.name, 5000000, "Opens up SMTP Ports"),
    HTTPWormProgram:  new DarkWebItem(Programs.HTTPWormProgram.name, 30000000, "Opens up HTTP Ports"),
    SQLInjectProgram: new DarkWebItem(Programs.SQLInjectProgram.name, 250000000, "Opens up SQL Ports"),
    DeepscanV1:       new DarkWebItem(Programs.DeepscanV1.name, 500000, "Enables 'scan-analyze' with a depth up to 5"),
    DeepscanV2:       new DarkWebItem(Programs.DeepscanV2.name, 25000000, "Enables 'scan-analyze' with a depth up to 10"),
    AutolinkProgram:  new DarkWebItem(Programs.AutoLink.name, 1000000, "Enables direct connect via 'scan-analyze'"),
};
