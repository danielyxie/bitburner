
var Engine = {
	
    //Clickable objects
    Clickables: {
        hackButton:     null,
        
        //Load, save, and delete
        saveButton:     null,
        loadButton:     null,
        deleteButton:   null
    },
    
    //Display objects
    Display: {
        //Progress bar
        progress:       null,
        
        //Display for status text (such as "Saved" or "Loaded")
        statusText:     null,
        
        hackingSkill:   null,
    },
		
    //Player objects
	Player: {
		hackingSkill:   0,
        money:          0,
        strength:       0, 
        defense:        0, 
        agility:        0, 
        dexterity:      0, 
	},
	
	//Time variables (milliseconds unix epoch time)
	_timeThen: new Date().getTime(),
	_timeNow: new Date().getTime(),
	
	_ticks: 0,          //Total ticks
	_idleSpeed: 200,    //Speed (in ms) at which the main loop is updated
    
    //Display a status update text
    _lastStatus: null,
    displayStatusText: function(text) {
        Engine.Display.statusText.innerHTML = text;
        
        clearTimeout(Engine._lastStatus);
        //Wipe status message after 3 seconds
        Engine._lastStatus = setTimeout(function() {
            Engine.Display.statusText.innerHTML = "";
        }, 3000);
    },
    
    //Save function
    saveFile: function() {
        var tempSaveFile = JSON.stringify(Engine.Player);
        
        window.localStorage.setItem("netburnerSave", tempSaveFile);
        
        Engine.displayStatusText("Saved!");
    },
    
    //Load saved game function
    loadSave: function() {
        //Check to see if file exists
        if (!window.localStorage.getItem("netburnerSave")) {
            Engine.displayStatusText("No save file present for load!");
        } else {
            var tempSaveFile = window.localStorage.getItem("netburnerSave");
            Engine.Player = JSON.parse(tempSaveFile);
            Engine.displayStatusText("Loaded successfully!");
        }
    },
    
    deleteSave: function() {
        if (!window.localStorage.getItem("netburnerSave")) {
            Engine.displayStatusText("No save file present for deletion");
        } else {
            window.localStorage.removeItem("netburnerSave");
            Engine.displayStatusText("Deleted successfully!");
        }
    },
	
	/* Main Event Loop */
	idleTimer: function() {
		//Get time difference
		Engine._timeNow = new Date().getTime();
		var timeDifference = Engine._timeNow - Engine._timeThen - Engine._ticks;
		
		while (timeDifference >= Engine._idleSpeed) {			
			Engine.Display.hackingSkill.innerHTML = Engine.Player.hackingSkill;
			
			//Update timeDifference based on the idle speed
			timeDifference -= Engine._idleSpeed;
			
			//Update the total tick counter
			Engine._ticks += Engine._idleSpeed;
		}
        
        var idleTime = Engine._idleSpeed - timeDifference;
        
        // - The $ means, "Start jQuery function" 
		// - The ("#progressvalue") tells jQuery to target that CSS element.
		// - Next is .animate({ which means - start an animation.
		// - The width: "100%" line tells jQuery what to animate.
		// - the idleTime is how long the animation should run for.
		// - the function() { starts AFTER the animation is finished.
		// - $(this).css("width","0%"); resets the width of the element to zero.
		$("#progressvalue").animate({
			width: "100%"
		}, idleTime, function() {
			$(this).css("width","0%");
		});
		
		// Once that entire "while loop" has run, we call the IdleTimer 
		// function again, but this time with a timeout (delay) of 
		// _idleSpeed minus timeDifference
		setTimeout(Engine.idleTimer, idleTime);
		
	},
	
    /* Initialization */
	init: function() {
        //Progress button
        Engine.Display.Progress = document.getElementById("progressvalue");
        
        //Hacking button
        Engine.Clickables.hackButton = document.getElementById("hackbutton");
        
        //Event Listener for hacking button
        Engine.Clickables.hackButton.addEventListener("click", function() {
            ++Engine.Player.hackingSkill;
            
            //Returns false so that once the code runs, the button won't try to do
            //anything else
            return false;
        });
        
        //Hacking Skill Display
        Engine.Display.hackingSkill = document.getElementById("hackingskill");
        
        //Status display
        Engine.Display.statusText = document.getElementById("status");
        
        //Load, save, and delete buttons
        Engine.Clickables.saveButton = document.getElementById("save");
		Engine.Clickables.saveButton.addEventListener("click", function() {
			Engine.saveFile();
			return false;
		});
		
		Engine.Clickables.loadButton = document.getElementById("load");
		Engine.Clickables.loadButton.addEventListener("click", function() {
			Engine.loadSave();
			return false;
		});
		
		Engine.Clickables.deleteButton = document.getElementById("delete");
		Engine.Clickables.deleteButton.addEventListener("click", function() {
			Engine.deleteSave();
			return false;
		});

        //Run main loop
		Engine.idleTimer();
	}
	
};

window.onload = function() {
	Engine.init();
};


	

		