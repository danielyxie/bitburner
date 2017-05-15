# netburner
Netburner Idle Game

TESTING TODO:

	If a server has no more money available it cannot be hacked anymore
		Should work automatically...because your money gained percentage will be multiplied by 0
	When the game is loaded re-load all of the scripts in runningScripts
		- Seems to be working
		
	Adjust leveling formula. Goes up way too high at first
		http://gamedev.stackexchange.com/questions/55151/rpg-logarithmic-leveling-formula
		- might be too slow now? 
    
   
    Change Company pages to display "apply for promotion" and other stuff when you are already employed there

    
    rm command seems to work
    
    
    + Traveling
        
    Script logging functionality? Logs to internal "log file" (property of script itself)
        Can see log with tail.
        Should add something where if you click it in the "Active Scripts" GUI you can see the logs too        
        
        Seems to work fine
    
    Gyms - Later..don't need for MVP
    
        
Tasks TODO:
    Adding augmentations for Silhouette fac
    Factions Info page isn't formatted correctly
    
    Augmentations that decrease time to make programs
    
    New server hostname in Purchase Server Pop-up Box needs limits..don't think the ones set in HTML work
    
	Secret Servers
	
	Hack time formula needs rebalancing I think, so does hack exp formula
	
    Create new menu page for purchased servers
    
	Account for Max possible int when gaining exp (it will overflow)
	
	OPTIMIZATION
		https://gamealchemist.wordpress.com/2013/05/01/lets-get-those-javascript-arrays-to-work-fast/
        
        
        
Private beta feedback
    2 things right off the bat, I'd suggest putting a "Back" button in the tutorial 
    window, and you could highlight or otherwise point out which tab the tutorial is 
    suggesting I click on next
    Maybe have a different colour for each tab, and then in the tutorial window it
    can have the name of the tab with that colour
    
    Also not really a big deal, but I'm at 110% zoom on chrome and the tutorial window
    covers some of the text
    
    For the last thing of the tutorial, I would just have a button like "Finish Tutorial" rather than "Next"