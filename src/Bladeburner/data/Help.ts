export const ConsoleHelpText: {
  [key: string]: string[];
  helpList: string[];
  automate: string[];
  clear: string[];
  cls: string[];
  help: string[];
  log: string[];
  skill: string[];
  start: string[];
  stop: string[];
} = {
    helpList: [
      "Use 'help [command]' to get more information about a particular Bladeburner console command.",
      "",
      "    automate [var] [val] [hi/low] Configure simple automation for Bladeburner tasks",
      "    clear/cls                     Clear the console",
      "    help [cmd]                    Display this help text, or help text for a specific command",
      "    log [en/dis] [type]           Enable or disable logging for events and actions",
      "    skill [action] [name]         Level or display info about your Bladeburner skills",
      "    start [type] [name]           Start a Bladeburner action/task" ,
      "    stop                          Stops your current Bladeburner action/task",
    ],
    automate: [
      "automate [var] [val] [hi/low]",
      "",
      "A simple way to automate your Bladeburner actions. This console command can be used " +
      "to automatically start an action when your stamina rises above a certain threshold, and " +
      "automatically switch to another action when your stamina drops below another threshold.",
      "    automate status - Check the current status of your automation and get a brief description of what it'll do",
      "    automate en - Enable the automation feature",
      "    automate dis - Disable the automation feature",
      "",
      "There are four properties that must be set for this automation to work properly. Here is how to set them:",
      "",
      "    automate stamina 100 high",
      "    automate contract Tracking high",
      "    automate stamina 50 low",
      "    automate general 'Field Analysis' low",
      "",
      "Using the four console commands above will set the automation to perform Tracking contracts " +
      "if your stamina is 100 or higher, and then switch to Field Analysis if your stamina drops below " +
      "50. Note that when setting the action, the name of the action is CASE-SENSITIVE. It must " +
      "exactly match whatever the name is in the UI.",
    ],
    clear: [
      "clear",
      "",
      "Clears the console",
    ],
    cls: [
      "cls",
      "",
      "Clears the console",
    ],
    help: [
      "help [command]",
      "",
      "Running 'help' with no arguments displays the general help text, which lists all console commands " +
      "and a brief description of what they do. A command can be specified to get more specific help text " +
      "about that particular command. For example:",
      "",
      "    help automate",
      "",
      "will display specific information about using the automate console command",
    ],
    log: [
      "log [en/dis] [type]",
      "",
      "Enable or disable logging. By default, the results of completing actions such as contracts/operations are logged " +
      "in the console. There are also random events that are logged in the console as well. The five categories of " +
      "things that get logged are:",
      "",
      "[general, contracts, ops, blackops, events]",
      "",
      "The logging for these categories can be enabled or disabled like so:",
      "",
      "    log dis contracts - Disables logging that occurs when contracts are completed",
      "    log en contracts - Enables logging that occurs when contracts are completed",
      "    log dis events - Disables logging for Bladeburner random events",
      "",
      "Logging can be universally enabled/disabled using the 'all' keyword:",
      "",
      "    log dis all",
      "    log en all",
    ],
    skill: [
      "skill [action] [name]",
      "",
      "Level or display information about your skills.",
      "",
      "To display information about all of your skills and your multipliers, use:",
      "",
      "    skill list",
      "",
      "To display information about a specific skill, specify the name of the skill afterwards. " +
      "Note that the name of the skill is case-sensitive. Enter it exactly as seen in the UI. If " +
      "the name of the skill has whitespace, enclose the name of the skill in double quotation marks:",
      "",
      "    skill list Reaper<br>" +
      "    skill list 'Digital Observer'",
      "",
      "This console command can also be used to level up skills:",
      "",
      "    skill level [skill name]",
    ],
    start: [
      "start [type] [name]",
      "",
      "Start an action. An action is specified by its type and its name. The " +
      "name is case-sensitive. It must appear exactly as it does in the UI. If " +
      "the name of the action has whitespace, enclose it in double quotation marks. " +
      "Valid action types include:",
      "",
      "[general, contract, op, blackop]",
      "",
      "Examples:",
      "",
      "    start contract Tracking",
      "    start op 'Undercover Operation'",
    ],
    stop:[
      "stop",
      "",
      "Stop your current action and go idle.",
    ],
}