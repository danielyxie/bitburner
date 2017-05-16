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
    
1) - multiple commands to do the same thing? (why?) <--- there are a few of these in the initial help... clear/cls, scan/netstat, connect/telnet... Maybe just pick one to unclutter it?
2) - "Wrong Command! Try Again!" seemed a bit out of place for a terminal.  Trying to repro this, it seems you may have already fixed it?
3) - If you can help it, please don't require the code to be exactly pasted from the tutorial to finish the tutorial. I copied the code and then "corrected" the brackets and spacing... and it wouldn't let me continue. :D
5) - As a programmer... you cannot take the TAB key from us in the script editor. :neutral_face:  Not sure how the game itself is coded, but if you've got to EAT a ghost-tab just to give me one in-editor... let me tab out my code in-script, or I'll go mad.
6) - Maybe show total $ somewhere onscreen at all (or most) times.  $/sec would also be good to know, depending on if you want the player to know that. Bottom of the menu on the left is an empty enough place to keep these.
7) - default the focus to in-editor when you nano up a new script, so you can start typing immediately upon commanding one to be created.