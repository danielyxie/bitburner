# netburner
Netburner Idle Game

TESTING TODO:
	hack() and sleep() in a script
		hack() seems to be working
			
		Sleep() seems to be working
	Creating the foreign server network doesn't seem to be  (Fixed it I think? Confirm later)
	Script RAM Usage and corresponding terminal commands
	If a server has no more money available it cannot be hacked anymore
		Should work automatically...because your money gained percentage will be multiplied by 0
	When the game is loaded re-load all of the scripts in runningScripts
		- Does not seem to work. Although the addWorkerScript() function itself seems to work
		- LOoks like its because AllServer is an object, so AllServers.length does not work. Have
			to make a custom AllServers.size() function or something oogle it im too tired right now
Tasks TODO:
	Script offline progress
	If a script has bad syntax...it fucks everything up when you try to run it so fix that
	Scroll all the way down when something is post()ed
	Scripts tab that shows script stats
	Script logging functionality? Logs to internal "log file" (property of script itself)
	Update skill level on cycle
	Parse script firs tot see if there are any syntax errors, and tell user if there are (when user calls "run")
	Tutorial and help
	Server growth