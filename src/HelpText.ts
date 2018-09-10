/* tslint:disable:max-line-length completed-docs variable-name*/
export const TerminalHelpText: string =
    "Type 'help name' to learn more about the command 'name'<br><br>" +
    'alias [-g] [name="value"]      Create or display Terminal aliases<br>' +
    "analyze                        Get information about the current machine <br>" +
    "buy [-l/program]               Purchase a program through the Dark Web<br>" +
    "cat [file]                     Display a .msg, .lit, or .txt file<br>" +
    "check [script] [args...]       Print a script's logs to Terminal<br>" +
    "clear                          Clear all text on the terminal <br>" +
    "cls                            See 'clear' command <br>" +
    "connect [ip/hostname]          Connects to a remote server<br>" +
    "download [script/text file]    Downloads scripts or text files to your computer<br>" +
    "free                           Check the machine's memory (RAM) usage<br>" +
    "hack                           Hack the current machine<br>" +
    "help [command]                 Display this help text, or the help text for a command<br>" +
    "home                           Connect to home computer<br>" +
    "hostname                       Displays the hostname of the machine<br>" +
    "ifconfig                       Displays the IP address of the machine<br>" +
    "kill [script] [args...]        Stops the specified script on the current server <br>" +
    "killall                        Stops all running scripts on the current machine<br>" +
    "ls [| grep pattern]            Displays all files on the machine<br>" +
    "lscpu                          Displays the number of CPU cores on the machine<br>" +
    "mem [script] [-t] [n]          Displays the amount of RAM required to run the script<br>" +
    "nano [file]                    Text editor - Open up and edit a script or text file<br>" +
    "ps                             Display all scripts that are currently running<br>" +
    "rm [file]                      Delete a file from the server<br>" +
    "run [name] [-t] [n] [args...]  Execute a program or script<br>" +
    "scan                           Prints all immediately-available network connections<br>" +
    "scan-analyze [d] [-a]          Prints info for all servers up to <i>d</i> nodes away<br>" +
    "scp [file] [server]            Copies a file to a destination server<br>" +
    "sudov                          Shows whether you have root access on this computer<br>" +
    "tail [script] [args...]        Displays dynamic logs for the specified script<br>" +
    "theme [preset] | bg txt hlgt   Change the color scheme of the UI<br>" +
    "top                            Displays all running scripts and their RAM usage<br>" +
    'unalias "[alias name]"         Deletes the specified alias<br>' +
    "wget [url] [target file]       Retrieves code/text from a web server<br>";

interface IMap<T> {
    [key: string]: T;
}
export const HelpTexts: IMap<string> = {
    alias:          'alias [-g] [name="value"] <br>' +
                    "Create or display aliases. An alias enables a replacement of a word with another string. " +
                    "It can be used to abbreviate a commonly used command, or commonly used parts of a command. The NAME " +
                    "of an alias defines the word that will be replaced, while the VALUE defines what it will be replaced by. For example, " +
                    "you could create the alias 'nuke' for the Terminal command 'run NUKE.exe' using the following: <br><br>" +
                    'alias nuke="run NUKE.exe"<br><br>' +
                    "Then, to run the NUKE.exe program you would just have to enter 'nuke' in Terminal rather than the full command. " +
                    "It is important to note that 'default' aliases will only be substituted for the first word of a Terminal command. For " +
                    "example, if the following alias was set: <br><br>" +
                    'alias worm="HTTPWorm.exe"<br><br>' +
                    "and then you tried to run the following terminal command: <br><br>" +
                    "run worm<br><br>" +
                    "This would fail because the worm alias is not the first word of a Terminal command. To allow an alias to be substituted " +
                    "anywhere in a Terminal command, rather than just the first word, you must set it to be a global alias using the -g flag: <br><br>" +
                    'alias -g worm="HTTPWorm.exe"<br><br>' +
                    "Now, the 'worm' alias will be substituted anytime it shows up as an individual word in a Terminal command. <br><br>" +
                    "Entering just the command 'alias' without any arguments prints the list of all defined aliases in the reusable form " +
                    "'alias NAME=VALUE' on the Terminal. <br><br>" +
                    "The 'unalias' command can be used to remove aliases.<br><br>",
    analyze:        "analze<br>" +
                    "Prints details and statistics about the current server. The information that is printed includes basic " +
                    "server details such as the hostname, whether the player has root access, what ports are opened/closed, and also " +
                    "hacking-related information such as an estimated chance to successfully hack, an estimate of how much money is " +
                    "available on the server, etc.",
    buy:            "buy [-l / program]<br>" +
                    "Purchase a program through the Dark Web. Requires a TOR router to use.<br><br>" +
                    "If this command is ran with the '-l' flag, it will display a list of all programs that can be bought through the " +
                    "dark web to the Terminal, as well as their costs.<br><br>" +
                    "Otherwise, the name of the program must be passed in as a parameter. This is name is NOT case-sensitive.",
    cat:            "cat [file]<br>" +
                    "Display message (.msg), literature (.lit), or text (.txt) files. Examples:<br><br>" +
                    "cat j1.msg<br>" +
                    "cat foo.lit<br>" +
                    "cat servers.txt",
    check:          "check [script name] [args...]<br>" +
                    "Print the logs of the script specified by the script name and arguments to the Terminal. Each argument must be separated by " +
                    "a space. Remember that a running script is uniquely " +
                    "identified both by its name and the arguments that are used to start it. So, if a script was ran with the following arguments: <br><br>" +
                    "run foo.script 1 2 foodnstuff<br><br>" +
                    "Then to run the 'check' command on this script you would have to pass the same arguments in: <br><br>" +
                    "check foo.script 1 2 foodnstuff",
    clear:          "clear<br>" +
                    "Clear the Terminal screen, deleting all of the text. Note that this does not delete the user's command history, so using the up " +
                    "and down arrow keys is still valid. Also note that this is permanent and there is no way to undo this. Synonymous with 'cls' command",
    cls:            "cls<br>" +
                    "Clear the Terminal screen, deleting all of the text. Note that this does not delete the user's command history, so using the up " +
                    "and down arrow keys is still valid. Also note that this is permanent and there is no way to undo this. Synonymous with 'clear' command",
    connect:        "connect [hostname/ip]<br>" +
                    "Connect to a remote server. The hostname or IP address of the remote server must be given as the argument " +
                    "to this command. Note that only servers that are immediately adjacent to the current server in the network can be connected to. To " +
                    "see which servers can be connected to, use the 'scan' command.",
    download:       "download [script/text file]<br>" +
                    "Downloads a script or text file to your computer (like your real life computer).<br>" +
                    "You can also download all of your scripts/text files as a zip file using the following Terminal commands:<br><br>" +
                    "Download all scripts and text files: download *<br>" +
                    "Download all scripts: download *.script<br>" +
                    "Download all text files: download *.txt<br>",
    free:           "free<br>" +
                    "Display's the memory usage on the current machine. Print the amount of RAM that is available on the current server as well as " +
                    "how much of it is being used.",
    hack:           "hack<br>" +
                    "Attempt to hack the current server. Requires root access in order to be run. See the wiki page for hacking mechanics<br>",
    help:           "help [command]<br>" +
                    "Display Terminal help information. Without arguments, 'help' prints a list of all valid Terminal commands and a brief " +
                    "description of their functionality. You can also pass the name of a Terminal command as an argument to 'help' to print " +
                    "more detailed information about the Terminal command. Examples: <br><br>" +
                    "help alias<br>" +
                    "help scan-analyze",
    home:           "home<br>" +
                    "Connect to your home computer. This will work no matter what server you are currently connected to.",
    hostname:       "hostname<br>" +
                    "Prints the hostname of the current server",
    ifconfig:       "ipconfig<br>" +
                    "Prints the IP address of the current server",
    kill:           "kill [script name] [args...]<br>" +
                    "Kill the script specified by the script name and arguments. Each argument must be separated by " +
                    "a space. Remember that a running script is uniquely identified by " +
                    "both its name and the arguments that are used to start it. So, if a script was ran with the following arguments:<br><br>" +
                    "run foo.script 1 sigma-cosmetics<br><br>" +
                    "Then to kill this script the same arguments would have to be used:<br><br>" +
                    "kill foo.script 1 sigma-cosmetics<br><br>" +
                    "Note that after issuing the 'kill' command for a script, it may take a while for the script to actually stop running. " +
                    "This will happen if the script is in the middle of a command such as grow() or weaken() that takes time to execute. " +
                    "The script will not be stopped/killed until after that time has elapsed.",
    killall:        "killall<br>" +
                    "Kills all scripts on the current server. " +
                    "Note that after the 'kill' command is issued for a script, it may take a while for the script to actually stop running. " +
                    "This will happen if the script is in the middle of a command such as grow() or weaken() that takes time to execute. " +
                    "The script will not be stopped/killed until after that time has elapsed.",
    ls:             "ls [| grep pattern]<br>" +
                    "The ls command, with no arguments, prints all files on the current server to the Terminal screen. " +
                    "This includes all scripts, programs, and message files. " +
                    "The files will be displayed in alphabetical order. <br><br>" +
                    "The '| grep pattern' optional parameter can be used to only display files whose filenames match the specified pattern. " +
                    "For example, if you wanted to only display files with the .script extension, you could use: <br><br>" +
                    "ls | grep .script<br><br>" +
                    "Alternatively, if you wanted to display all files with the word purchase in the filename, you could use: <br><br>" +
                    "ls | grep purchase",
    lscpu:          "lscpu<br>" +
                    "Prints the number of CPU Cores the current server has",
    mem:            "mem [script name] [-t] [num threads]<br>" +
                    "Displays the amount of RAM needed to run the specified script with a single thread. The command can also be used to print " +
                    "the amount of RAM needed to run a script with multiple threads using the '-t' flag. If the '-t' flag is specified, then " +
                    "an argument for the number of threads must be passed in afterwards. Examples:<br><br>" +
                    "mem foo.script<br>" +
                    "mem foo.script -t 50<br>" +
                    "The first example above will print the amount of RAM needed to run 'foo.script' with a single thread. The second example " +
                    "above will print the amount of RAM needed to run 'foo.script' with 50 threads.",
    nano:           "nano [file name]<br>" +
                    "Opens up the specified file in the Text Editor. Only scripts (.script) or text files (.txt) can be " +
                    "edited using the Text Editor. If the file does not already exist, then a new, empty one " +
                    "will be created",
    ps:             "ps<br>" +
                    "Prints all scripts that are running on the current server",
    rm:             "rm [file]<br>" +
                    "Removes the specified file from the current server. A file can be a script, a program, or a message file. <br><br>" +
                    "WARNING: This is permanent and cannot be undone",
    run:            "run [file name] [-t] [num threads] [args...]<br>" +
                    "Execute a program or a script.<br><br>" +
                    "The '[-t]', '[num threads]', and '[args...]' arguments are only valid when running a script. The '-t' flag is used " +
                    "to indicate that the script should be run with the specified number of threads. If the flag is omitted, " +
                    "then the script will be run with a single thread by default. " +
                    "If the '-t' flag is used, then it MUST come immediately " +
                    "after the script name, and the [num threads] argument MUST come immediately afterwards. <br><br>" +
                    "[args...] represents a variable number of arguments that will be passed into the script. See the documentation " +
                    "about script arguments. Each specified argument must be separated by a space. <br><br>",
    scan:           "scan<br>" +
                    "Prints all immediately-available network connection. This will print a list of all servers that you can currently connect " +
                    "to using the 'connect' Terminal command.",
    "scan-analyze": "scan-analyze [depth] [-a]<br>" +
                    "Prints detailed information about all servers up to [depth] nodes away on the network. Calling " +
                    "'scan-analyze 1' will display information for the same servers that are shown by the 'scan' Terminal " +
                    "command. This command also shows the relative paths to reach each server.<br><br>" +
                    "By default, the maximum depth that can be specified for 'scan-analyze' is 3. However, once you have " +
                    "the DeepscanV1.exe and DeepscanV2.exe programs, you can execute 'scan-analyze' with a depth up to " +
                    "5 and 10, respectively.<br><br>" +
                    "The information 'scan-analyze' displays about each server includes whether or not you have root access to it, " +
                    "its required hacking level, the number of open ports required to run NUKE.exe on it, and how much RAM " +
                    "it has.<br><br>" +
                    "By default, this command will not display servers that you have purchased. However, you can pass in the " +
                    "-a flag at the end of the command if you would like to enable that.",
    scp:            "scp [filename] [target server]<br>" +
                    "Copies the specified file from the current server to the target server. " +
                    "This command only works for script files (.script extension), literature files (.lit extension), " +
                    "and text files (.txt extension). " +
                    "The second argument passed in must be the hostname or IP of the target server.",
    sudov:          "sudov<br>" +
                    "Prints whether or not you have root access to the current machine",
    tail:           "tail [script name] [args...]<br>" +
                    "Displays dynamic logs for the script specified by the script name and arguments. Each argument must be separated " +
                    "by a space. Remember that a running script is uniquely identified by both its name and the arguments that were used " +
                    "to run it. So, if a script was ran with the following arguments: <br><br>" +
                    "run foo.script 10 50000<br><br>" +
                    "Then in order to check its logs with 'tail' the same arguments must be used: <br><br>" +
                    "tail foo.script 10 50000",
    theme:          "theme [preset] | [#background #text #highlight]<br>" +
                    "Change the color of the game's user interface<br><br>" +
                    "This command can be called with a preset theme. Currently, the supported presets are 'default', 'muted', and 'solarized'. " +
                    "However, you can also specify your own color scheme using hex values. To do so, you must specify three hex color values " +
                    "for the background color, the text color, and the highlight color. These hex values must be preceded by a pound sign (#) and " +
                    "must be either 3 or 6 digits. Example:<br><br>" +
                    "theme #ffffff #385 #235012<br><br>" +
                    "A color picker such as " +
                    "<a href='https://www.google.com/search?q=color+picker&oq=color+picker&aqs=chrome.0.0l6.951j0j1&sourceid=chrome&ie=UTF-8' target='_blank'>Google's</a> " +
                    "can be used to get your desired hex color values<br><br>" +
                    "Themes are not saved, so when the game is closed and then re-opened or reloaded then it will revert back to the default theme.",
    top:            "top<br>" +
                    "Prints a list of all scripts running on the current server as well as their thread count and how much " +
                    "RAM they are using in total.",
    unalias:        'unalias "[alias name]"<br>' +
                    "Deletes the specified alias. Note that the double quotation marks are required. <br><br>" +
                    "As an example, if an alias was declared using:<br><br>" +
                    'alias r="run"<br><br>' +
                    "Then it could be removed using:<br><br>" +
                    'unalias "r"<br><br>' +
                    "It is not necessary to differentiate between global and non-global aliases when using 'unalias'",
    wget:           "wget [url] [target file]<br>" +
                    "Retrieves data from a URL and downloads it to a file on the current server. The data can only " +
                    "be downloaded to a script (.script, .ns, .js) or a text file (.txt). If the file already exists, " +
                    "it will be overwritten by this command.<br><br>" +
                    "Note that it will not be possible to download data from many websites because they do not allow " +
                    "cross-origin resource sharing (CORS). Example:<br><br>" +
                    "wget https://raw.githubusercontent.com/danielyxie/bitburner/master/README.md game_readme.txt",
};
