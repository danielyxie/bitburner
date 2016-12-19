# netburner
Netburner Idle Game

TESTING TODO:
	hack() and sleep() in a script
		hack() seems to be working
			
		Sleep() seems to be working
	Creating the foreign server network doesn't seem to be working
		--Seems to be fixed 
	Script RAM Usage and corresponding terminal commands
	If a server has no more money available it cannot be hacked anymore
		Should work automatically...because your money gained percentage will be multiplied by 0
	When the game is loaded re-load all of the scripts in runningScripts
		- Seems to be working
	Update skill level on cycle
	If a script has bad syntax...it fucks everything up when you try to run it so fix that
		Try catch for script?
		Check that killing scripts still works fine (TESTED - LOoks to work fine)
		Check that if script has bad syntax it wont run at all and everthing works normally (Seems to work fine)
		Check if script throws during runtime it shuts down correctly (seems to work fine)
		
	Adjust leveling formula. Goes up way too high at first
		http://gamedev.stackexchange.com/questions/55151/rpg-logarithmic-leveling-formula
		- might be too slow now? 
		
	Scripts tab that shows script stats
		Seems to work, at least the basics (for online production)
		
Tasks TODO:
	Script offline progress
	ctrl+C functionality for all running command like hack(), analyze(), and tail 
	Scroll all the way down when something is post()ed
	Script logging functionality? Logs to internal "log file" (property of script itself)
	Tutorial and help
	Server growth
	
	Hack time formula needs rebalancing I think
	
	Factions
	Augmentations
	Update CONSTANTS.HelpText
	Account for Max possible int when gaining exp
	Text in script editor that says ("ctrl + x" to save and quit)
	
	Companies
		Add possible CompanyPositions for every Company
		Applying/working for companies
	
	OPTIMIZATION
		https://gamealchemist.wordpress.com/2013/05/01/lets-get-those-javascript-arrays-to-work-fast/