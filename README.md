# netburner
Netburner Idle Game

TESTING TODO:

	If a server has no more money available it cannot be hacked anymore
		Should work automatically...because your money gained percentage will be multiplied by 0
		
	Adjust leveling formula. Goes up way too high at first
		http://gamedev.stackexchange.com/questions/55151/rpg-logarithmic-leveling-formula
		- might be too slow now? 
    
   
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
    I'd suggest putting a "Back" button in the tutorial 
    window,
    
    Also not really a big deal, but I'm at 110% zoom on chrome and the tutorial window
    covers some of the text
    
    Now, only other suggestion before sleep would be to be able to buy multiple Hacknet upgrades in one click
    
2) - "Wrong Command! Try Again!" seemed a bit out of place for a terminal.  Trying to repro this, it seems you may have already fixed it?
5) - As a programmer... you cannot take the TAB key from us in the script editor. :neutral_face:  Not sure how the game itself is coded, but if you've got to EAT a ghost-tab just to give me one in-editor... let me tab out my code in-script, or I'll go mad.
6) - Maybe show total $ somewhere onscreen at all (or most) times.  $/sec would also be good to know, depending on if you want the player to know that. Bottom of the menu on the left is an empty enough place to keep these.
