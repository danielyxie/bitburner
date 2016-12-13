# netburner
Netburner Idle Game

TESTING TODO:
	hack() and sleep() in a script
		Hack() not finished, need a safeguard to allow script to only hack servers that the player
			has admin access to 
		Sleep() seems to be working
	Creating the foreign server network doesn't seem to be working
	
Tasks TODO:
	If a server has no more money available it cannot be hacked anymore
	Script RAM Usage and corresponding terminal commands
	Script offline progress
	When the game is loaded re-load all of the scripts in runningScripts
	If a script has bad syntax...it fucks everything up when you try to run it so fix that
	Scroll all the way down when something is post()ed
	Scripts tab that shows script stats
	Script logging functionality? Logs to internal "log file" (property of script itself)
	Update skill level on cycle
	Parse script firs tot see if there are any syntax errors, and tell user if there are (when user calls "run")