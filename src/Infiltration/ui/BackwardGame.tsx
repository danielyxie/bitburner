import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { IMinigameProps } from "./IMinigameProps";
import { KeyHandler } from "./KeyHandler";
import { GameTimer } from "./GameTimer";

export function BackwardGame(props: IMinigameProps) {
    const timer = 15000;
    const [answer, setAnswer] = useState(makeAnswer());
    const [guess, setGuess] = useState("");

    function press(event: React.KeyboardEvent<HTMLElement>) {
        if(event.keyCode === 16) return;
        const nextGuess = guess + event.key.toUpperCase();
        if(!answer.startsWith(nextGuess)) {
            props.onFailure();
        } else if (answer === nextGuess) {
            props.onSuccess();
        } else {
            setGuess(nextGuess);
        }
    }

    return (<Grid container spacing={3}>
        <GameTimer millis={timer} onExpire={props.onFailure} />
        <Grid item xs={12}>
            <h1 className={"noselect"}>Type it backward</h1>
            <KeyHandler onKeyDown={press} />
        </Grid>
        <Grid item xs={6}>
            <p style={{transform: 'scaleX(-1)'}}>{answer}</p>
        </Grid>
        <Grid item xs={6}>
            <p>{guess}</p>
        </Grid>
    </Grid>)
}

function makeAnswer(): string {
    const length = 1 + Math.random()*2;
    let answer = "";
    for(let i = 0; i < length; i++) {
        if(i > 0) answer += " "
        answer += words[Math.floor(Math.random() * words.length)];
    }

    return answer;
}

const words = ["ALGORITHM", "ANALOG", "APP", "APPLICATION", "ARRAY", "BACKUP",
    "BANDWIDTH", "BINARY", "BIT", "BITE", "BITMAP", "BLOG", "BLOGGER",
    "BOOKMARK", "BOOT", "BROADBAND", "BROWSER", "BUFFER", "BUG", "BUS", "BYTE",
    "CACHE", "CAPS LOCK", "CAPTCHA", "CD", "CD-ROM", "CLIENT", "CLIP ART",
    "CLIP BOARD", "CLOUD COMPUTING", "COMMAND", "COMPILE", "COMPRESS",
    "COMPUTER", "COMPUTER PROGRAM", "CONFIGURE", "COOKIE", "COPY", "CPU",
    "CYBERCRIME", "CYBERSPACE", "DASHBOARD", "DATA", "DATA MINING", "DATABASE",
    "DEBUG", "DECOMPRESS", "DELETE", "DESKTOP", "DEVELOPMENT", "DIGITAL",
    "DISK", "DNS", "DOCUMENT", "DOMAIN", "DOMAIN NAME", "DOT", "DOT MATRIX",
    "DOWNLOAD", "DRAG", "DVD", "DYNAMIC", "EMAIL", "EMOTICON", "ENCRYPT",
    "ENCRYPTION", "ENTER", "EXABYTE", "FAQ", "FILE", "FINDER", "FIREWALL",
    "FIRMWARE", "FLAMING", "FLASH", "FLASH DRIVE", "FLOPPY DISK", "FLOWCHART",
    "FOLDER", "FONT", "FORMAT", "FRAME", "FREEWARE", "GIGABYTE", "GRAPHICS",
    "HACK", "HACKER", "HARDWARE", "HOME PAGE", "HOST", "HTML", "HYPERLINK",
    "HYPERTEXT", "ICON", "INBOX", "INTEGER", "INTERFACE", "INTERNET",
    "IP ADDRESS", "ITERATION", "JAVA", "JOYSTICK", "JUNK MAIL", "KERNEL",
    "KEY", "KEYBOARD", "KEYWORD", "LAPTOP", "LASER PRINTER", "LINK", "LINUX",
    "LOG OUT", "LOGIC", "LOGIN", "LURKING", "MACINTOSH", "MACRO", "MAINFRAME",
    "MALWARE", "MEDIA", "MEMORY", "MIRROR", "MODEM", "MONITOR", "MOTHERBOARD",
    "MOUSE", "MULTIMEDIA", "NET", "NETWORK", "NODE", "NOTEBOOK COMPUTER",
    "OFFLINE", "ONLINE", "OPEN SOURCE", "OPERATING SYSTEM", "OPTION", "OUTPUT",
    "PAGE", "PASSWORD", "PASTE", "PATH", "PHISHING", "PIRACY", "PIRATE",
    "PLATFORM", "PLUGIN", "PODCAST", "POPUP", "PORTAL", "PRINT", "PRINTER",
    "PRIVACY", "PROCESS", "PROGRAM", "PROGRAMMER", "PROTOCOL", "QUEUE",
    "QWERTY", "RAM", "REALTIME", "REBOOT", "RESOLUTION", "RESTORE", "ROM",
    "ROOT", "ROUTER", "RUNTIME", "SAVE", "SCAN", "SCANNER", "SCREEN",
    "SCREENSHOT", "SCRIPT", "SCROLL", "SCROLL BAR", "SEARCH ENGINE",
    "SECURITY", "SERVER", "SHAREWARE", "SHELL", "SHIFT", "SHIFT KEY",
    "SNAPSHOT", "SOCIAL NETWORKING", "SOFTWARE", "SPAM", "SPAMMER",
    "SPREADSHEET", "SPYWARE", "STATUS BAR", "STORAGE", "SUPERCOMPUTER", "SURF",
    "SYNTAX", "TABLE", "TAG", "TERMINAL", "TEMPLATE", "TERABYTE", "TEXT EDITOR",
    "THREAD", "TOOLBAR", "TRASH", "TROJAN HORSE", "TYPEFACE", "UNDO", "UNIX",
    "UPLOAD", "URL", "USER", "USER INTERFACE", "USERNAME", "UTILITY", "VERSION",
    "VIRTUAL", "VIRTUAL MEMORY", "VIRUS", "WEB", "WEB HOST", "WEBMASTER",
    "WEBSITE", "WIDGET", "WIKI", "WINDOW", "WINDOWS", "WIRELESS",
    "WORD PROCESSOR", "WORKSTATION", "WORLD WIDE WEB", "WORM", "WWW", "XML",
    "ZIP"];