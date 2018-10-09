.. _changelog:

Changelog
=========

v0.40.5 - 10/09/2018
--------------------
* Added codingcontract.getContractType() Netscript function
* Bug Fix: codingcontract.getData() Netscript function now returns arrays by value rather than reference
* Bug Fix: Decreased highest possible data value for 'Find Largest Prime Factor' Coding Contract (to avoid hangs when solving it)
* Bug Fix: Fixed a bug that caused game to freeze during Coding Contract generation

v0.40.4 - 9/29/2018
-------------------
* Added new Coding Contracts mechanic. Solve programming problems to earn rewards
* The write() and read() Netscript functions now work on scripts
* Added getStockSymbols() Netscript function to the TIX API (by InfraK)
* Added wget() Netscript function
* Added bladeburner.getActionRepGain() function to the Netscript Bladeburner API
* The getLevelUpgradeCost(), getRamUpgradeCost(), and getCoreUpgradeCost() functions in the Hacknet API now return Infinity if the node is at max level. See documentation
* It is now possible to use freely use angled bracket (<, >) and create DOM elements using tprint()
* The game's theme colors can now be set through the Terminal configuration (.fconf).
* You can now switch to the old left-hand main menu bar through the Terminal configuration (.fconf)
* Bug Fix: grow() percentage is no longer reported as Infinity when a server's money is grown from 0 to X
* Bug Fix: Infiltration popup now displays the correct amount of exp gained

v0.40.3 - 9/15/2018
-------------------
* Bladeburner Changes:
    * Increased the effect that agi and dexterity have on action time
    * Starting number of contracts/operations available will be slightly lower
    * Random events will now happen slightly more often
    * Slightly increased the rate at which the Overclock skill point cost increases
* The maximum volatility of stocks is now randomized (randomly generated within a certain range every time the game resets)
* Increased the range of possible values for initial stock prices
* b1t_flum3.exe program can now be created immediately at Hacking level 1 (rather than hacking level 5)
* UI improvements for the character overview panel and the left-hand menu (by mat-jaworski)
* General UI improvements for displays and Terminal (by mat-jaworski)
* Added optional parameters to the getHackTime(), getGrowTime(), and getWeakenTime() Netscript functions
* Added isLogEnabled() and getScriptLogs() Netscript functions
* Added donateToFaction() Singularity function
* Updated documentation to reflect the fact that Netscript port handles (getPortHandle()) only works in NetscriptJS (2.0), NOT Netscript 1.0
* Added tryWrite() Netscript function
* When working (for a company/faction), experience is gained immediately/continuously rather than all at once when the work is finished
* Added a setting in .fconf for enabling line-wrap in the Terminal input
* Adding a game option for changing the locale that most numbers are displayed in (this mostly applies for whenever money is displayed)
* The randomized parameters of many high-level servers can now take on a higher range of values
* Many 'foreign' servers (hackable servers that you don't own) now have a randomized amount of RAM
* Added 'wget' Terminal command
* Improved the introductory tutorial

v0.40.2 - 8/27/2018
-------------------
* Bladeburner Changes:
    * Added getBonusTime(), getSkillUpgradeCost(), and getCity() Netscript functions to the API
    * Buffed the effects of many Bladeburner Augmentations
    * The Blade's Simulacrum Augmentation requires significantly less reputation but slightly more money
    * Slightly increased the amount of successes needed for a Contract/Operation in order to increase its max level
    * Increased the amount of money gained from Contracts by ~25%
    * Increased the base amount of rank gained from Operations by 10%
    * Significantly increased the 'randomness' in determining a Contract/Operation's initial count and rate of count increase
    * The number (count) of Operations should now increase significantly faster
    * There are now, on average, more Synthoid communities in a city
    * If automation is enabled (the feature in Bladeburner console), then switching to another action such as working for a company will now disable the automation
* Stock Market Changes:
    * Added a watchlist filter feature to the UI that allows you to specify which stocks to show
    * Added the Four Sigma (4S) Market Data feed, which provides volatility and price forecast information about stocks
    * Added the 4S Market Data TIX API, which lets you access the aforementioned data through Netscript
* There is now a setting for enabling/disabling the popup that appears when you are hospitalized
* Bug Fix: Stock market should now be correctly initialized in BitNode-8 (by Kline-)
* Bug Fix: bladeburner.getCurrentAction() should now properly an 'Idle' object rather than null (by Kline-)
* Bug Fix: Bladeburner skill cost multiplier should now properly increase in BitNode-12 (by hydroflame)
* Bug Fix: 'document', 'hacknet', and 'window' keywords should no longer be counted multiple times in RAM calculations
* Bug Fix: Joining factions through Singularity functions should now prevent you from joining opposing factions
* Bug Fix: Four Sigma should no longer have two 'Speech Enhancement' Augmentations (by Kline-)

v0.40.1 - 8/5/2018 - Community Update
-------------------------------------
* Added getPurchasedServerCost() Netscript function (by kopelli)
* Added getFavorToDonate() Netscript function (by hydroflame)
* Added getFactionFavorGain() and getCompanyFavorGain() Singularity functions (by hydroflame)
* Accumulated 'bonus' time in Bladeburner is now displayed in the UI (by hydroflame)
* The Red Pill can now be purchased with negative money (since its supposed to be free) (by hydroflame)
* Cranial Signal Processor Augmentations now have the previous generation as a prerequisite. i.e. Cranial Signal Processor - Gen II requires Gen I (by Kline-)
* Terminal now supports semicolon usage (end of command). This allows chaining multiple Terminal commands (by hydroflame)
* Bladeburner Raid operations can no longer be performed if your estimate of Synthoid communities is zero (by hydroflame)
* The difficulty of BN-12 now scales faster (by hydroflame)
* Active Scripts UI now shows a RAM Usage bar for each server (by kopelli)
* Bug Fix: Corrected terminal timestamp format (by kopelli)
* Bug Fix: NetscriptJS scripts should now die properly if they don't have a 'main' function (by hydroflame)
* Bug Fix: write(), read(), and tryWrite() Netscript functions should now work properly for writing Arrays/objects to Netscript Ports
* Various minor UI/QOL fixes by hydroflame, kopelli, and Kline-

v0.40.0 - 7/28/2018
-------------------
* **WARNING: This update makes some significant changes to Netscript and therefore you may need to make some changes to your scripts. See** `this post <https://www.reddit.com/r/Bitburner/comments/9252j4/psa_netscript_10_changes_in_next_version_v0400/>`_ **this post for details**
* Netscript 1.0 (NS1) now uses a fully-fledged ES5 JavaScript Interpreter. This means many new features are now available in NS1, and this also fixes several bugs.
  However this also means any ES6+ features are no longer supported in NS1
* When a server is hacked with a very large number of threads and left with no money, the server's security level
  now only increases by however many threads were needed to drain the server. For example, if you hack a server with
  5000 threads but it only needed 2000 threads to deplete the server's money, then the server's security will only increase
  as if you had hacked it with 2000 threads (change by hydroflame)
* Added getCurrentAction() to Bladeburner API
* Added a variety of functions to Bladeburner API that deal with action levels (change by hydroflame)
* Added getPurchasedServerLimit() and getPurchasedServerMaxRam() functions to Netscript (change by hydroflame & kopelli)
* Added getOwnedSourceFiles() Singularity function (by hydroflame)
* Completely re-designed the Hacknet Node API
* getSkillLevel() in Bladeburner API now returns an error if no argument is passed in (as opposed to an object with all skill levels). This may break scripts
* Minimum Netscript execution time reduced from 15ms to 10ms (configurable in Options)
* Company reputation needed to get invited to Megacorporation factions decreased from 250k to 200k
* HP is now reset (restored) when Augmenting
* Source-File 6 now increases both the level and experience gain of all combat stats (it was only experience gain previously)
* Reverted a previous change for Source-File 12. It's benefits are now multiplicative rather than additive
* Starting Infiltration security level for almost every location decreased by ~10%
* Changed 'fl1ght.exe' message when its listed conditions are fulfilled (by hydroflame)
* The 'Save Game' button in the top-right overview panel now flashes red if autosave is disabled
* Bug Fix: Infiltration buttons can no longer be clicked through NetscriptJS
* Bug Fix: Bladeburner 'Overclock' skill can no longer be leveled above max level through the API (by hydroflame)
* Bug Fix: Healthcare division in Bladeburner should no longer cause game to crash

v0.39.1 - 7/4/2018
------------------

* Bladeburner Rank gain in BN-7 is now reduced by 40% instead of 50%
* Quadrupled the amount of money gained from Bladeburner contracts
* Added joinBladeburnerDivision() Netscript function to Bladeburner API
* Doubled the effects of Source-File 5. Now gives 8%, 12%, and 14% increase to all hacking multipliers at levels 1, 2, and 3, respectively (increased from 4%/6%, 7%)
* Increased the effect of Source-File 8. It now gives a 12%, 18% and 21% to your hacking growth multiplier at levels 1, 2, and 3, respectively (increased from 8%, 12%, 14%)
* The effect of Source-File 12 is now additive with itself, rather than multiplicative. This means that level N of Source-File 12 now increases all multipliers by N%
* The setting to suppress the confirmation box when purchasing Augmentations was moved into the main Options menu (by Github user hydroflame)
* Bug Fix: Crime Success rates were being calculated incorrectly (by Github user hydroflame)
* When an Infiltration is finished, you will now return back to the company's page, rather than the city
* Infiltration faction reputation selector now remembers your last choice
* Significantly increased the amount of money gained from Infiltration
* Bug Fix: Copying a NetscriptJS script to another server using scp now properly takes into account the script's changes.
* Bug Fix: Fixed an issue where game would not load in Edge due to incompatible features
* travelToCity() Singularity function no longer grants Intelligence exp"

v0.39.0 - 6/25/2018
-------------------

* Added BitNode-7: Bladeburner 2079
* Infiltration base difficulty decreased by 10% for most locations
* Experience gains from Infiltration slightly increased
* Money gained from Infiltration increased by 20%
* Added 'var' declarations in Netscript 1.0 (only works with 'var', not 'let' or 'const')
* Script base RAM cost is now 1.6 GB (increased from 1.4 GB)
* While/for loops and if statements no longer cost RAM in scripts
* Made short-circuit evaluation logic more consistent in Netscript 1.0 (see https://github.com/danielyxie/bitburner/issues/308)
* Changelog button in the Options menu now links to the new Changelog URL (by Github user thePalindrome)
* Skill level calculation is now 'smoother' (by Github user hydroflame)
* Added a button to 'beautify' scripts in the text editor (by Github user hydroflame)
* Added favicon (by Github user kopelli)

v0.38.1 - 6/15/2018
-------------------
* Bug Fix: Using 'Object.prototype' functions like toLocaleString() or toString() should no longer cause errors in NetscriptJS
* Implemented by Github user hydroflame:
    * Accessing the 'window' and 'document' objects in Netscript JS now requires a large amount of RAM (100 GB)
    * Added game option to suppress travel confirmation
    * Text on buttons can no longer be highlighted
    * Bug Fix: Fixed an issue that caused NaN values when exporting Real Estate in Corporations
    * Bug Fix: Competition and Demand displays in Corporation are now correct (were reversed before)
    * Added ps() Netscript function
    * Bug Fix: grow() should no longer return/log a negative value when it runs on a server that's already at max money
    * Bug Fix: serverExists() Netscript function should now properly return false for non-existent hostname/ips
    * Bug Fix: Sever's security level should now properly increase when its money is grown to max value

v0.38.0 - 6/12/2018
-------------------
* New BitNode: BN-12 The Recursion - Implemented by Github user hydroflame
* Bladeburner Changes:
    * Bladeburner progress is no longer reset when installing Augmentations
    * The number of successess needed to increase a Contract/Operation's max level now scales with the current max level (gradually gets harder)
    * All Bladeburner Augmentations are now slightly more expensive and require more reputation
    * Black Operations now give higher rank rewards
    * Doubled the base amount of money gained from Contracts
    * Increased the amount of experience gained from Contracts/Actions
    * Added a new Augmentation: The Blade's Simulacrum
    * Bladeburner faction reputation gain is now properly affected by favor
* Hacking is now slightly less profitable in BitNode-3
* Updated Hacknet Nodes UI - Implemented by Github user kopelli
* Bug Fix: Fixed an exploit that allowed calling any Netscript function without incurring any RAM Cost in NetscriptJS

v0.37.2 - 6/2/2018
------------------

* After joining the Bladeburners division, there is now a button to go to the Bladeburner content
  in the 'City' page
* You now start with $250m in BitNode-8 (increased from $100m)
* Bug Fix: You can now no longer directly edit Hacknet Node values through NetscriptJS (hopefully)
* Bug Fix: Bladeburners is no longer accessible in BN-8
* Bug Fix: getBitNodeMultipliers() Netscript function now returns a copy rather than the original object

v0.37.1 - 5/22/2018
-------------------
* You now earn money from successfully completing Bladeburner contracts. The amount you earn is based
  on the difficulty of the contract.
* Completing Field Analysis in Bladeburner now grants 0.1 rank
* The maximum RAM you can get on a purchased server is now 1,048,576 GB (2^20)
* Bug Fix: Fixed Netscript syntax highlighting issues with the new NetscriptJS
* Bug Fix: Netscript Functions now properly incur RAM costs in NetscriptJS
* Bug Fix: deleteServer() now fails if its called on the server you are currently connected to
* Removed in-game Netscript documentation, since it was outdated and difficult to maintain.
* Bug Fix: Updated the gymWorkout() Singularity function with the new exp/cost values for gyms


v0.37.0 - 5/20/2018
-------------------
* NetscriptJS (Netscript 2.0) released (Documentation here: http://bitburner.readthedocs.io/en/latest/netscriptjs.html)
* Running the game with the '?noScripts' query will start the game without loading any of your scripts. This should be used if you accidentally write a script that crashes your game

v0.36.1 - 5/11/2018
-------------------
* Bladeburner Changes:
    * Bug Fix: You can no longer get Bladeburner faction reputation through Infiltration
    * Initial difficulty of Tracking contracts reduced
    * Datamancer skill effect increased from 4% per level to 5%
    * Slightly decreased the base stamina cost of contracts/operations
    * Slightly increased the effects of the Tracer, Digital Observer, Short Circuit, Cloak, and Blade's Intuition skills
    * Overclock skill capped at level 95, rather than 99
    * Training gives significantly more exp/s
* Crime, Infiltration, and Hacking are now slightly more profitable in BN-6
* Gyms are now more expensive, but give slightly more exp
* Added getScriptName() and getHacknetMultipliers() Netscript functions (added by Github user hydroflame)
* getScriptRam() Netscript function now has default value for the second argument, which is hostname/ip (implemented by Github user hydroflame)
* There is now a soft-cap on stock price, which means it's no longer possible for the price of a stock to reach insanely-high values
* The ctrl+b hotkey in the text editor should now also be triggered by command+b on OSX (I don't have OSX so I can't confirm if this works)
* Many servers now have additional RAM
* Added an option to disable hotkeys/keyboard shortcuts
* Refactored 'Active Scripts' UI page to optimize its performance
* Added a new .fconf Terminal setting: ENABLE_TIMESTAMP
* 'Netscript Execution Time', which can be found in the Options, now has a minimum value of 15ms rather than 25ms
* Bug Fix: Fixed a typo in the Fulcrum Technologies company name (Technolgies -> Technologies)
* Bug Fix: hacknetnodes keyword should no longer incur RAM cost if its in a comment
* Bug Fix: disableLog() now works for the commitCrime() Netscript function (fixed by Github user hydroflame)

v0.36.0 - 5/2/2018
------------------
* Added BN-6: Bladeburners
* Rebalanced many combat Augmentations so that they are slightly less powerful
* Bug Fix: When faction invites are suppressed, an invitation will no longer load the Faction page


v0.35.2 - 3/26/2018
-------------------
* Corporation Changes:
    * Fixed an issue with Warehouse upgrade cost. Should now be significantly cheaper than before.
    * Scientific Research now has a slightly more significant effect on Product quality
    * The Energy and Water Utilities industries are now slightly more profitable
    * The Robotics and Computer Hardware industries are now less profitable
    * The Software industry is slightly less profitable
    * When selling Materials and Products, the 'PROD' qualifier can now be used to set dynamic sell amounts based on your production
    * Exporting MAX should now work properly
    * You can no longer export past storage limits
    * Scientific Research production reduced
    * Effects of AdVert. Inc upgrade were reduced, but the effect that popularity and awareness have on sales was increased to compensate (popularity/awareness numbers were getting too big with Advert. Inc)
    * Bug Fix: Products from Computer Hardware division should now properly have ratings
* Improved Augmentation UI/UX. Now contains collapsible headers and sort buttons
* Improved Faction Augmentations display UI/UX. Now contains sort buttons. There is also an option to disable confirmation when purchasing Augmentations

v0.35.1 - 3/12/2018
-------------------
* You can now easily download all of your scripts/text files as zip folders. Use the 'help download' Terminal command for details
* Scripts are now downloaded with the .script.js extension at the end of their filename
* Corporation Management Changes:
    * Implemented Smart Supply unlock
    * Changed the way a division's Production Multiplier is calculated. It is now the sum of the individual Production Multiplier for every city. Therefore, it is now beneficial to open offices in different cities
    * Several small UI/UX improvements
    * Numerous balance changes. The significant ones are listed below.
    * Product descriptions will now display their estimated market price
    * The sale price of Products can no longer be marked up as high as before
    * Scientific Research now affects the rating of Products
    * In general, the maximum amount of product you are able to sell is reduced
    * Sale bonus from advertising (popularity/awareness) now has diminishing returns rather than scaling linearly
* Experience gained during Infiltration now scales linearly based on the clearance level you reach. Compared to before, the experience gained will be much less at lower clearance levels, but much more at higher clearance levels
* The editor can now be used to edit both scripts and text files
* New Terminal config file that can be edited using the command 'nano .fconf'. Right now there is only one option, but there will be more in the future.
* You can now enable Bash-style Terminal hotkeys using the .fconf file referenced above
* Bug Fix: Fixed an issue with the UI elements of Gang Management persisting across different instances of BitNode-2

v0.35.0 - 3/3/2018
------------------
* Minor rebalancing of BitNodes due to the fact that Corporations provide a (relatively) new method of progressing
* Corporation Management Changes:
    * Once your Corporation gets big/powerful enough, you can now bribe Factions for reputation using company funds an/or stock shares
    * You can now only create one Division for every Industry type
    * Added several new UI/UX elements
    * Wilson Analytics multiplier was significantly reduced to 1% per level (additive).
    * Reduced the effect of Advert Inc upgrade. Advert Inc. upgrade price increases faster
    * Materials can now be marked up at higher prices
* Added Javascript's built-in Number object to Netscript
* Added getCharacterInformation(), getCompanyFavor(), and getFactionFavor() Netscript Singularity functions
* Rebalanced Singularity Function RAM Costs. They now cost x8 as much when outside of BN-4 (rather than x10). Also, many of the functions now use significantly less RAM
* Refactored Netscript Ports. You can now get a handle for a Netscript port using the getPortHandle() Netscript function. This allows you to access a port's underlying queue (which is just an array) and also makes several new functions available such as tryWrite(), full(), and empty().
* Number of Netscript Ports increased from 10 to 20
* Netscript assignments should now return proper values. i.e. i = 5 should return 5.
* Added throw statements to Netscript. It's not super useful since 'catch' isn't implemented, but it can be used to generate custom runtime error messages.
* Added import declaration to Netscript. With this, you are able to import functions (and only functions) from other files. Using export declarations is not necessary
* Most Netscript Runtime errors (the ones that cause your script to crash) should now include the line number where the error occured
* When working for a company, your current company reputation is now displayed
* Whenever you get a Faction Invite it will be immediately appended to your 'invited factions' list. Therefore the checkFactionInvitations() Singularity Function should now be properly useable since you no longer need to decline a Faction Invitation before it shows up in the result.
* Bug Fix: When purchasing servers, whitespace should now automatically be removed from the hostname
* Bug Fix: Can no longer have whitespace in the filename of text files created using write()
* Bug Fix: In Netscript, you can no longer assign a Hacknet Node handle (hacknetnodes[i]) to another value
* Bug Fix: If you are in the Factions tab when you accept an invitation from a Faction, the page will now properly 'refresh'
* Bug Fix: Scripts that run recursive functions should now be killed properly


v0.34.5 - 2/24/2018
-------------------
* Corporation Management Changes:
    * Market Research unlocks are now cheaper
    * New 'VeChain' upgrade: displays useful statistics about Corporation
    * Corporation cycles are processed 25% faster
    * Corporation valuation was lowered by ~10% (this affects stock price and investments)
    * Rebalanced the effects of advertising. Should now be more effective for every Industry
    * Fixed several bugs/exploits involving selling and buying back stock shares
    * You will now receive a Corporation Handbook (.lit file) when starting out BitNode-3. It contains a brief guide to help you get started. This same handbook can be viewed from the Corporation management screen
    * Slightly decreased the amount by which a Product's sell price can be marked up
    * Employees can now be assigned to a 'Training' task, during which they will slowly increase several of their stats
* Hopefully fixed an exploit with Array.forEach(). If there are any issues with using forEach, let me know
* Arguments passed into a script are now passed by value. This means modifying the 'args' array in a script should no longer cause issues
* Scripts executed programatically (via run(), exec(), etc.) will now fail if null/undefined is passed in as an argument
* Added peek() Netscript function
* killall() Netscript function now returns true if any scripts were killed, and false otherwise.
* hack() Netscript function now returns the amount of money gained for successful hacks, and 0 for failed hacks
* scp Terminal command and Netscript function now work for txt files
* Changes courtesy of Wraithan:
    * Text files are now displayed using 'pre' rather than 'p' elements when using the 'cat' Terminal command. This means tabs are retained and lines don't automatically wrap
    * ls() Netscript function now returns text files as well
* Removed round() Netscript function, since you can just use Math.round() instead
* Added disableLog() and enableLog() Netscript functions
* Removed the 'log' argument from sleep(), since you can now use the new disableLog function
* 'Netscript Documentation' button on script editor now points to new readthedocs documentation rather than wiki
* When working for a faction, your current faction reputation is now displayed
* Bug Fix: Hacking Missions should no longer break when dragging an existing connection to another Node
* Bug Fix: Fixed RAM usage of getNextHacknetNodeCost() (is not 1.5GB instead of 4GB)


v0.34.4 - 2/14/2018
-------------------
* Added several new features to Gang UI to make it easier to manage your Gang.
* Changed the Gang Member upgrade mechanic. Now, rather than only being able to have one weapon/armor/vehicle/etc., you can purchase all the upgrades for each Gang member and their multipliers will stack. To balance this out, the effects (AKA multipliers) of each Gang member upgrade were reduced.
* Added a new script editor option: Max Error Count. This affects how many approximate lines the script editor will process (JSHint) for common errors. Increasing this option can affect negatively affect performance
* Game theme colors (set using 'theme' Terminal command) are now saved when re-opening the game
* 'download' Terminal command now works on scripts
* Added stopAction() Singularity function and the spawn() Netscript function
* The 'Purchase Augmentations' UI screen will now tell you if you need a certain prerequisite for Augmentations.
* Augmentations with prerequisites can now be purchased as long as their prerequisites are puchased (before, you had to actually install the prerequisites before being able to purchase)

v0.34.3 - 1/31/2018
-------------------
* Minor balance changes to Corporations:
    * Upgrades are generally cheaper and/or have more powerful effects.
    * You will receive more funding while your are a private company.
    * Product demand decreases at a slower rate.
    * Production multiplier for Industries (receives for owning real estate/hardware/robots/etc.) is slightly higher
* Accessing the hacknetnodes array in Netscript now costs 4.0GB of RAM (only counts against RAM usage once)
* Bug Fix: Corporation oustanding shares should now be numeric rather than a string
* Bug Fix: Corporation production now properly calculated for industries that dont produce materials.
* Bug Fix: Gangs should now properly reset when switching BitNodes
* Bug Fix: Corporation UI should now properly reset when you go public

v0.34.2 - 1/27/2018
-------------------
* Corporation Management Changes:
    * Added advertising mechanics
    * Added Industry-specific purchases
    * Re-designed employee management UI
    * Rebalancing: Made many upgrades/purchases cheaper. Receive more money from investors in early stage. Company valuation is higher after going public
    * Multiple bug fixes
* Added rm() Netscript function
* Updated the way script RAM usage is calculated. Now, a function only increases RAM usage the first time it is called. i.e. even if you call hack() multiple times in a script, it only counts against RAM usage once. The same change applies for while/for loops and if conditionals.
* The RAM cost of the following were increased:
    * If statements: increased by 0.05GB
    * run() and exec(): increased by 0.2GB
    * scp(): increased by 0.1GB
    * purchaseServer(): increased by 0.25GB
* Note: You may need to re-save all of your scripts in order to re-calculate their RAM usages. Otherwise, it should automatically be re-calculated when you reset/prestige
* The cost to upgrade your home computer's RAM has been increased (both the base cost and the exponential upgrade multiplier)
* The cost of purchasing a server was increased by 10% (it is now $55k per RAM)
* Bug fix: (Hopefully) removed an exploit where you could avoid RAM usage for Netscript function calls by assigning functions to a variable (foo = hack(); foo('helios');)
* Bug fix: (Hopefully) removed an exploit where you could run arbitrary Javascript code using the constructor() method
* Thanks to Github user mateon1 and Reddit users havoc_mayhem and spaceglace for notifying me of the above exploits
* The fileExists() Netscript function now works on text files (.txt). Thanks to Github user devoidfury for this


v0.34.1 - 1/19/2018
-------------------
* Updates to Corporation Management:
    * Added a number of upgrades to various aspects of your Corporation
    * Rebalanced the properties of Materials and the formula for determining the valuation of the Corporation
    * Fixed a number of bugs
* 'Stats' page now shows information about current BitNode
* You should now be able to create Corporations in other BitNodes if you have Source-File 3
* Added a new create-able program called b1t_flum3.exe. This program can be used to reset and switch BitNodes
* Added an option to adjust autosave interval
* Line feeds, newlines, and tabs will now work with the tprint() Netscript function
* Bug fix: 'check' Terminal command was broken
* Bug fix: 'theme' Terminal command was broken when manually specifying hex codes
* Bug fix: Incorrect promotion requirement for 'Business'-type jobs
* Bug fix: Settings input bars were incorrectly formatted when loading game


v0.34.0 - 12/6/2017
-------------------
* Added clear() and exit() Netscript functions
* When starting out or prestiging, you will now receive a 'Hacking Starter Guide'. It provides tips/pointers for new players
* Doubled the amount of RAM on low-level servers (up to required hacking level 150)
* Slightly increased experience gain from Infiltration
* buyStock(), sellStock(), shortStock(), and sellShort() Netscript function now return the stock price at which the transaction occurred, rather than a boolean. If the function fails for some reason, 0 will be returned.
* Hacking Mission Changes:
    * You can now select multiple Nodes of the same type by double clicking. This allows you to set the action of all of selected nodes at once (e.g. set all Transfer Nodes to Fortify). Creating connections does not work with this multi-select functionality yet
    * Shield and Firewall Nodes can now fortify
    * The effects of Fortifying are now ~5% lower
    * Conquering a Spam Node now increases your time limit by 25 seconds instead of 15
    * Damage dealt by Attacking was slightly reduced
    * The effect of Scanning was slightly reduced
    * Enemy CPU Core Nodes start with slightly more attack. Misc Nodes start with slightly less defense
* Corporation Management changes:
    * Added several upgrades that unlock new features
    * Implemented Exporting mechanic
    * Fixed many bugs

v0.33.0 - 12/1/2017
-------------------
* Added BitNode-3: Corporatocracy. In this BitNode you can start and manage your own corporation. This feature is incomplete. Much more will be added to it in the near future
* Minor bug fixes

v0.32.1 - 11/2/2017
-------------------
* Updated Netscript's 'interpreter/engine' to use the Bluebird promise library instead of native promises. It should now be faster and more memory-efficient. If this has broken any Netscript features please report it through Github or the subreddit (reddit.com/r/bitburner)
* Rebalanced stock market (adjusted parameters such as the volatility/trends/starting price of certain stocks)
* Added prompt() Netscript function
* Added 'Buy Max' and 'Sell All' functions to Stock Market UI
* Added 'Portfolio' Mode to Stock Market UI so you can only view stocks you have a position/order in
* Added a button to kill a script from its log display box


v0.32.0 - 10/25/2017
--------------------
* Added BitNode-8: Ghost of Wall Street
* Re-designed Stock Market UI
* Minor bug fixes

v0.31.0 - 10/15/2017
--------------------
* Game now saves to IndexedDb (if your browser supports it). This means you should no longer have trouble saving the game when your save file gets too big (from running too many scripts). The game will still be saved to localStorage as well
* New file type: text files (.txt). You can read or write to text files using the read()/write() Netscript commands. You can view text files in Terminal using 'cat'. Eventually I will make it so you can edit them in the editor but that's not available yet. You can also download files to your real computer using the 'download' Terminal command
* Added a new Crime: Bond Forgery. This crime takes 5 minutes to attempt and gives $4,500,000 if successful. It is meant for mid game.
* Added commitCrime(), getCrimeChance(), isBusy(), and getStats() Singularity Functions.
* Removed getIntelligence() Netscript function
* Added sprintf and vsprintf to Netscript. See [https://github.com/alexei/sprintf.js this Github page for details]
* Increased the amount of money gained from Infiltration by 20%, and the amount of faction reputation by 12%
* Rebalanced BitNode-2 so that Crime and Infiltration are more profitable but hacking is less profitable. Infiltration also gives more faction rep
* Rebalanced BitNode-4 so that hacking is slightly less profitable
* Rebalanced BitNode-5 so that Infiltration is more profitable and gives more faction rep
* Rebalanced BitNode-11 so that Crime and Infiltration are more profitable. Infiltration also gives more faction rep.
* Fixed an annoying issue in Hacking Missions where sometimes you would click a Node but it wouldnt actually get selected
* Made the Hacking Mission gameplay a bit slower by lowering the effect of Scan and reducing Attack damage
* Slightly increased the base reputation gain rate for factions when doing Field Work and Security Work

v0.30.0 - 10/9/2017
-------------------
* Added getAugmentations() and getAugmentationsFromFaction() Netscript Singularity Functions
* Increased the rate of Intelligence exp gain
* Added a new upgrade for home computers: CPU Cores. Each CPU core on the home computer grants an additional starting Core Node in Hacking Missions. I may add in other benefits later. Like RAM upgrades, upgrading the CPU Core on your home computer persists until you enter a new BitNode.
* Added lscpu Terminal command to check number of CPU Cores
* Changed the effect of Source-File 11 and made BitNode-11 a little bit harder
* Fixed a bug with Netscript functions (the ones you create yourself)
* Hacking Missions officially released (they give reputation now). Notable changes in the last few updates:
    * Misc Nodes slowly gain hp/defense over time
    * Conquering a Misc Node will increase the defense of all remaining Misc Nodes that are not being targeted by a certain percentage
    * Reputation reward for winning a Mission is now affected by faction favor and Player's faction rep multiplier
    * Whenever a Node is conquered, its stats are reduced

v0.29.3 - 10/3/2017
-------------------
* Fixed bug for killing scripts and showing error messages when there are errors in a player-defined function
* Added function name autocompletion in Script Editor. Press Ctrl+space on a prefix to show autocompletion options.
* Minor rebalancing and bug fixes for Infiltration and Hacking Missions

v0.29.2 - 10/1/2017
-------------------
* installAugmentations() Singularity Function now takes a callback script as an argument. This is a script that gets ran automatically after Augmentations are installed. The script is run with no arguments and only a single thread, and must be found on your home computer.
* Added the ability to create your own functions in Netscript. See [[Netscript Functions|this link]] for details
* Added :q, :x, and :wq Vim Ex Commands when using the Vim script editor keybindings. :w, :x, and :wq will all save the script and return to Terminal. :q will quit (return to Terminal) WITHOUT saving. If anyone thinks theres an issue with this please let me know, I don't use Vim
* Added a new Augmentation: ADR-V2 Pheromone Gene
* In Hacking Missions, enemy nodes will now automatically target Nodes and perform actions.
* Re-balanced Hacking Missions through minor tweaking of many numbers
* The faction reputation reward for Hacking Missions was slightly increased

v0.29.1 - 9/27/2017
-------------------
* New gameplay feature that is currently in BETA: Hacking Missions. Hacking Missions is an active gameplay mechanic (its a minigame) that is meant to be used to earn faction reputation. However, since this is currently in beta, hacking missions will NOT grant reputation for the time being, since the feature likely has many bugs, balance problems, and other issues. If you have any feedback regarding the new feature, feel free to let me know
* CHANGED THE RETURN VALUE OF getScriptIncome() WHEN RAN WITH NO ARGUMENTS. It will now return an array of two values rather than a single value. This may break your scripts, so make sure to update them!
* Added continue statement for for/while loops
* Added getServerMinSecurityLevel(), getPurchasedServers(), and getTimeSinceLastAug() Netscript functions
* Netscript scp() function can now take an array as the first argument, and will try to copy every file specified in the array (it will just call scp() normally for every element in the array). If an array is passed in, then the scp() function returns true if at least one element from the array is successfully copied
* Added Javascript's Date module to Netscript. Since 'new' is not supported in Netscript yet, only the Date module's static methods will work (now(), UTC(), parse(), etc.).
* Failing a crime now gives half the experience it did before
* The forced repeated 'Find The-Cave' message after installing The Red Pill Augmentation now only happens if you've never destroyed a BitNode before, and will only popup every 15 minutes. If you have already destroyed a BitNode, the message will not pop up if you have messages suppressed (if you don't have messages suppressed it WILL still repeatedly popup)
* fileExists() function now works on literature files

v0.29.0 - 9/19/2017
-------------------
* Added BitNode-5: Artificial Intelligence
* Added getIp(), getIntelligence(), getHackingMultipliers(), and getBitNodeMultipliers() Netscript functions (requires Source-File 5)
* Updated scan() Netscript function so that you can choose to have it print IPs rather than hostnames
* Refactored scp() Netscript function so that it takes an optional 'source server' argument
* For Infiltration, decreased the percentage by which the security level increases by about 10% for every location
* Using :w in the script editor's Vim keybinding mode should now save and quit to Terminal
* Some minor optimizations that should reduce the size of the save file
* scan-analyze Terminal command will no longer show your purchased servers, unless you pass a '-a' flag into the command
* After installing the Red Pill augmentation from Daedalus, the message telling you to find 'The-Cave' will now repeatedly pop up regardless of whether or not you have messages suppressed
* Various bugfixes

v0.28.6 - 9/15/2017
-------------------
* Time required to create programs now scales better with hacking level, and should generally be much faster
* Added serverExists(hostname/ip) and getScriptExpGain(scriptname, ip, args...) Netscript functions
* Short circuiting && and || logical operators should now work
* Assigning to multidimensional arrays should now work
* Scripts will no longer wait for hack/grow/weaken functions to finish if they are killed. They will die immediately
* The script loop that checks whether any scripts need to be started/stopped now runs every 6 seconds rather than 10 (resulting in less delays when stopping/starting scripts)
* Fixed several bugs/exploits
* Added some description for BitNode-5 (not implemented yet, should be soon though)

v0.28.5 - 9/13/2017
-------------------
* The fl1ght.exe program that is received from jump3r is now sent very early on in the game, rather than at hacking level 1000
* Hostname is now displayed in Terminal
* Syntax highlighting now works for all Netscript functions
* Export should now work on Edge/IE

v0.28.4 - 9/11/2017
-------------------
* Added getScriptIncome() Netscript function
* Added Javascript's math module to Netscript. See [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math this link for details]
* Added several member variables for the Hacknet Node API that allow you to access info about their income
* All valid Netscript functions are now syntax highlighted as keywords in the editor. This means they will a different color than invalid netscript functions. The color will depend on your theme. Note that right now, this only applies for normal Netscript functions, not functions in the TIX API, Hacknet Node API, or Singularity Functions.
* Comments and operators no longer count towards RAM usage in scripts.
* Variety of bug fixes and updates to informational text in the game

v0.28.3 - 9/7/2017
------------------
* Added ls() Netscript function
* Increased company wages by about ~10% across the board
* The scp() Netsction function and Terminal command now works for .lit files
* Increased the amount of RAM on many lower level servers (up to level 200 hacking level required).

v0.28.2 - 9/4/2017
------------------
* Added several configuration options for script editor (key bindings, themes, etc.)
* Certain menu options will now be hidden until their relevant gameplay is unlocked. This includes the Factions, Augmentations, Create Program, Travel, and Job tabs. This will only affect newer players.
* Most unrecognize or un-implemented syntax errors in Netscript will now include the line number in the error message

v0.28.1 - 9/1/2017
------------------
* The script editor now uses the open-source Ace editor, which provides a much better experience when coding!
* Added tprint() Netscript function

v0.28.0 - 8/30/2017
-------------------
* Added BitNode-4: The Singularity
* Added BitNode-11: The Big Crash
* Migrated the codebase to use webpack (doesn't affect any in game content, except maybe some slight performance improvements and there may be bugs that result from dependency errors

v0.27.3 - 8/19/2017
-------------------
* You can now purchase upgrades for Gang Members (BitNode 2 only)
* Decreased Gang respect gains and slightly increased wanted gains (BitNode 2 only)
* Other gangs will increase in power faster (BitNode 2 only)
* Added getHackTime(), getGrowTime(), and getWeakenTime() Netscript functions

v0.27.2 - 8/18/2017
-------------------
* Added getServerGrowth() Netscript function
* Added getNextHacknetNodeCost() Netscript function
* Added new 'literature' files (.lit extension) that are used to build lore for the game. These .lit files can be found in certain servers throughout the game. They can be viewed with the 'cat' Terminal command and copied over to other servers using the 'scp' command. These .lit files won't be found until you reset by installing Augmentations
* Fixed some bugs with Gang Territory(BitNode 2 only)

v0.27.1 - 8/15/2017
-------------------
* Changed the way Gang power was calculated to make it scale better late game (BitNode 2 only)
* Lowered the respect gain rate in Gangs (Bitnode 2 only)
* Added '| grep pattern' option for ls Terminal command. This allows you to only list files that contain a certain pattern
* Added break statement in Netscript
* Display for some numerical values is now done in shorthand (e.g 1.000m instead of 1,000,000)

v0.27.0 - 8/13/2017
-------------------
* Added secondary 'prestige' system - featuring Source Files and BitNodes
* MILD SPOILERS HERE: Installing 'The Red Pill' Augmentation from Daedalus will unlock a special server called w0r1d_d43m0n. Finding and manually hacking this server through Terminal will destroy the Player's current BitNode, and allow the player to enter a new one. When destroying a BitNode, the player loses everything except the scripts on his/her home computer. The player will then gain a powerful second-tier persistent upgrade called a Source File. The player can then enter a new BitNode to start the game over. Each BitNode has different characteristics, and many will have new content/mechanics as well. Right now there are only 2 BitNodes. Each BitNode grants its own unique Source File. Restarting and destroying a BitNode you already have a Source File for will upgrade your Source File up to a maximum level of 3.

* Reputation gain with factions and companies is no longer a linear conversion, but an exponential one. It will be much easier to gain faction favor at first, but much harder later on.
* Significantly increased Infiltration exp gains
* Fixed a bug with company job requirement tooltips
* Added scriptRunning(), scriptKill(), and getScriptRam() Netscript functions. See documentation for details
* Fixed a bug with deleteServer() Netscript function

v0.26.4 - 8/1/2017
------------------
* All of the 'low-level servers' in early game that have a required hacking level now have 8GB of RAM instead of 4GB
* Increased the amount of experience given at university
* Slightly increased the production of Hacknet Nodes and made them cheaper to upgrade
* Infiltration now gives slightly more EXP and faction reputation
* Added two new crimes. These crimes are viable to attempt early on in the game and are relatively passive (each take 60+ seconds to complete)
* Crimes give more exp and more money
* Max money available on a server decreased from 50x the server's starting money to 25x
* Significantly increased wages for all jobs

v0.26.3
-------
* Added support for large numbers using Decimal.js. Right now it only applies for the player's money
* Purchasing servers with the Netscript function purchaseServer() is no longer 2x as expensive as doing manually it now costs the same
* Early game servers have more starting money

v0.26.2
-------
* Major rebalancing and randomization of the amount of money that servers start with
* Significantly lowered hacking exp gain from hacking servers. The exp gain for higher-level servers was lowered more than that of low level servers. (~16% for lower level servers, up to ~25% for higher-level servers)
* Added deleteServer() Netscript function
* You can now purchase a maximum of 25 servers each run (Deleting a server will allow you to purchase a new one)
* Added autocompletion for './' Terminal command
* Darkweb prices now displayed properly using toLocaleString()
* Added NOT operator (!) and negation operator(-) in Netscript, so negative numbers should be functional now
* Rejected faction invitations will now show up as 'Outstanding Faction Invites' in the Factions page. These can be accepted at any point in the future
* Added a few more configurable game settings for suppressing messages and faction invitations
* Added tooltips for company job requirements

v0.26.1
-------
* Added autocompletion for aliases
* Added getServerRam() Netscript function()
* Added getLevelUpgradeCost(n), getRamUpgradeCost(), getCoreUpgradeCost() functions for Netscript Hacknet Node API
* Added some configurable settings (See Game Options menu)


v0.26.0
-------
* Game now has a real ending, although it's not very interesting/satisfying right now. It sets up the framework for the secondary prestige system in the future
* Forgot to mention that since last update, comments now work in Netscript. Use // for single line comments or /* and \*/ for multiline comments just like in Javascript
* Added ports to Netscript. These ports are essentially serialized queues. You can use the write() Netscript function to write a value to a queue, and then you can use the read() Netscript function to read the value from the queue. Once you read a value from the queue it will be removed. There are only 10 queues (1-10), and each has a maximum capacity of 50 entries. If you try to write to a queue that is full, the the first value is removed. See wiki/Netscript documentation for more details
* You can now use the 'help' Terminal command for specific commands
* You can now use './' to run a script/program (./NUKE.exe). However, tab completion currently doesn't work for it (I'm working on it)
* Decreased the base growth rate of servers by ~25%
* Both the effect of weaken() and its time to execute were halved. In other words, calling weaken() on a server only lowers its security by 0.05 (was 0.1 before) but the time to execute the function is half of what it was before. Therefore, the effective rate of weaken() should be about the same
* Increased all Infiltration rewards by ~10%, and increased infiltration rep gains by an additional 20% (~32% total for rep gains)
* The rate at which the security level of a facility increases during Infiltration was decreased significantly (~33%)
* Getting treated at the Hospital is now 33% more expensive
* Slightly increased the amount of time it takes to hack a server
* Slightly decreased the amount of money gained when hacking a server (~6%)
* Slightly decreased the base cost for RAM on home computer, but increased the cost multiplier. This means that upgrading RAM on the home computer should be slightly cheaper at the start, but slightly more expensive later on
* Increased the required hacking level for many late game servers
* The sleep() Netscript function now takes an optional 'log' argument that specifies whether or not the 'Sleeping for N milliseconds' will be logged for the script
* Added clearLog() Netscript function
* Deleted a few stocks. Didn't see a reason for having so many, and it just affects performance. Won't take effect until you reset by installing Augmentations
* There was a typo with Zeus Medical's server hostname. It is now 'zeus-med' rather than 'zeud-med'
* Added keyboard shortcuts to quickly navigate between different menus. See wiki link (http://bitburner.wikia.com/wiki/Shortcuts)
* Changed the Navigation Menu UI

v0.25.0
-------
* Refactored Netscript to use the open-source Acorns Parser. This re-implementation was done by [https://github.com/MrNuggelz Github user MrNuggelz]. This has resulted in several changes in the Netscript language. Some scripts might break because of these changes. Changes listed below: 
* Arrays are now fully functional Javascript arrays. You no longer need to use the 'Array' keyword to declare them. 
* The length(), clear/clear(), insert(), and remove() functions no longer work for arrays. 
* All Javascript array methods are available (splice(), push(), pop(), join(), shift(), indexOf(), etc. See documentation)
* Variables assigned to arrays are now passed by value rather than reference

* Incrementing/Decrementing are now available (i++, ++i)

* You no longer need semicolons at the end of block statements

* Elif is no longer valid. Use 'else if' instead

* Netscript's Hacknet Node API functions no longer log anything
* Stock prices now update every ~6 seconds when the game is active (was 10 seconds before)
* Added a new mechanic that affects how stock prices change
* Script editor now has dynamic indicators for RAM Usage and Line number
* Augmentation Rebalancing - Many late game augmentations are now slightly more expensive. Several early game augmentations had their effects slightly decreased
* Increased the amount of rewards (both money and rep) you get from infiltration
* Purchasing servers is now slightly more expensive
* Calling the Netscript function getServerMoneyAvailable('home') now return's the player's money
* Added round(n) Netscript function - Rounds a number
* Added purchaseServer(hostname, ram) Netscript function
* Added the TIX API. This must be purchased in the WSE. It persists through resets. Access to the TIX API allows you to write scripts that perform automated algorithmic trading. See Netscript documentation
* Minor rebalancing in a lot of different areas
* Changed the format of IP Addresses so that they are smaller (will consist mostly of single digit numbers now). This will reduce the size of the game's save file.

v0.24.1
-------
* Adjusted cost of upgrading home computer RAM. Should be a little cheaper for the first few upgrades (up to ~64GB), and then will start being more expensive than before. High RAM upgrades should now be significantly more expensive than before.
* Slightly lowered the starting money available on most mid-game and end-game servers (servers with required hacking level greater than 200) by about 10-15%
* Rebalanced company/company position reputation gains and requirements
* Studying at a university now gives slightly more EXP and early jobs give slightly less EXP
* Studying at a university is now considerably more expensive
* Rebalanced stock market
* Significantly increased cost multiplier for purchasing additional Hacknet Nodes
* The rate at which facility security level increases during infiltration for each clearance level was lowered slightly for all companies
* Updated Faction descriptions
* Changed the way alias works. Normal aliases now only work at the start of a Terminal command (they will only replace the first word in the Terminal command). You can also create global aliases that work on any part of the command, like before. Declare global aliases by entering the optional -g flag: alias -g name="value" - [https://github.com/MrNuggelz Courtesy of Github user MrNuggelz]
* 'top' Terminal command implemented courtesy of [https://github.com/LTCNugget Github user LTCNugget]. Currently, the formatting gets screwed up if your script names are really long.

v0.24.0
-------
* Players now have HP, which is displayed in the top right. To regain HP, visit the hospital. Currently the only way to lose HP is through infiltration
* Infiltration - Attempt to infiltrate a company and steal their classified secrets. See 'Companies' documentation for more details
* Stock Market - Added the World Stock Exchange (WSE), a brokerage that lets you buy/sell stocks. To begin trading you must first purchase an account. A WSE account will persist even after resetting by installing Augmentations. How the stock market works should hopefully be self explanatory. There is no documentation about it currently, I will add some later. NOTE: Stock prices only change when the game is open. The Stock Market is reset when installing Augmentations, which means you will lose all your stocks
* Decreased money gained from hacking by ~12%
* Increased reputation required for all Augmentations by ~40%
* Cost increase when purchasing multiple augmentations increased from 75% to 90%
* Added basic variable runtime to Netscript operations. Basic commands run in 100ms. Any function incurs another 100ms in runtime (200ms total). Any function that starts with getServer incurs another 100ms runtime (300ms total). exec() and scp() require 400ms total. 
* Slightly reduced the amount of experience gained from hacking

v0.23.1
-------
* scan() Netscript function now takes a single argument representing the server from which to scan. 

v0.23.0
-------
* You can now purchase multiple Augmentations in a run. When you purchase an Augmentation you will lose money equal to the price and then the cost of purchasing another Augmentation during this run will be increased by 75%. You do not gain the benefits of your purchased Augmentations until you install them. This installation can be done through the 'Augmentation' tab. When you install your Augmentations, your game will reset like before. 
* Reputation needed to gain a favor from faction decreased from 7500 to 6500
* Reputation needed to gain a favor from company increased from 5000 to 6000
* Reputation cost of all Augmentations increased by 16%
* Higher positions at companies now grant slightly more reputation for working
* Added getServerMaxMoney() Netscript function
* Added scan() Netscript function
* Added getServerNumPortsRequired() Netscript function
* There is now no additional RAM cost incurred when multithreading a script

v0.22.1
-------
* You no longer lose progress on creating programs when cancelling your work. Your progress will be saved and you will pick up where you left off when you start working on it again
* Added two new programs: AutoLink.exe and ServerProfiler.exe
* Fixed bug with Faction Field work reputation gain

v0.22.0 - Major rebalancing, optimization, and favor system
-----------------------------------------------------------
* Significantly nerfed most augmentations
* Almost every server with a required hacking level of 200 or more now has slightly randomized server parameters. This means that after every Augmentation purchase, the required hacking level, base security level, and growth factor of these servers will all be slightly different
* The hacking speed multiplier now increases rather than decreases. The hacking time is now divided by your hacking speed multiplier rather than multiplied. In other words, a higher hacking speed multiplier is better
* Servers now have a minimum server security, which is approximately one third of their starting ('base') server security
* If you do not steal any money from a server, then you gain hacking experience equal to the amount you would have gained had you failed the hack
* The effects of grow() were increased by 50%
* grow() and weaken() now give hacking experience based on the server's base security level, rather than a flat exp amount
* Slightly reduced amount of exp gained from hack(), weaken(), and grow()
* Rebalanced formulas that determine crime success
* Reduced RAM cost for multithreading a script. The RAM multiplier for each thread was reduced from 1.02 to 1.005
* Optimized Script objects so they take less space in the save file
* Added getServerBaseSecurityLevel() Netscript function
* New favor system for companies and factions. Earning reputation at a company/faction will give you favor for that entity when you reset after installing an Augmentation. This favor persists through the rest of the game. The more favor you have, the faster you will earn reputation with that faction/company
* You can no longer donate to a faction for reputation until you have 150 favor with that faction
* Added unalias Terminal command
* Changed requirements for endgame Factions

v0.21.1
-------
* IF YOUR GAME BREAKS, DO THE FOLLOWING: Options -> Soft Reset -> Save Game -> Reload Page. Sorry about that! 
* Autocompletion for aliases - courtesy of [https://github.com/LTCNugget Github user LTCNugget]

v0.21.0
-------
* Added dynamic arrays. See Netscript documentation
* Added ability to pass arguments into scripts. See documentation
* The implementation/function signature of functions that deal with scripts have changed. Therefore, some old scripts might not work anymore. Some of these functions include run(), exec(), isRunning(), kill(), and some others I may have forgot about. Please check the updated Netscript documentation if you run into issues.-Note that scripts are now uniquely identified by the script name and their arguments. For example, you can run a script using::

    run foodnstuff.script 1

and you can also run the same script with a different argument::

    run foodnstuff.script 2

These will be considered two different scripts. To kill the first script you must run::

    kill foodnstuff.script 1

and to kill the second you must run::

    kill foodnstuff.script 2

Similar concepts apply for Terminal Commands such as tail, and Netscript commands such as run(), exec(), kill(), isRunning(), etc.

* Added basic theme functionality using the 'theme' Terminal command - All credit goes to /u/0x726564646974 who implemented the awesome feature
* Optimized Script objects, which were causing save errors when the player had too many scripts
* Formula for determining exp gained from hacking was changed
* Fixed bug where you could purchase Darkweb items without TOR router
* Slightly increased cost multiplier for Home Computer RAM
* Fixed bug where you could hack too much money from a server (and bring its money available below zero)
* Changed tail command so that it brings up a display box with dynamic log contents. To get old functionality where the logs are printed to the Terminal, use the new 'check' command
* As a result of the change above, you can no longer call tail/check on scripts that are not running
* Added autocompletion for buying Programs in Darkweb

v0.20.2
-------
* Fixed several small bugs
* Added basic array functionality to Netscript
* Added ability to run scripts with multiple threads. Running a script with n threads will multiply the effects of all hack(), grow(), and weaken() commands by n. However, running a script with multiple threads has drawbacks in terms of RAM usage. A script's ram usage when it is 'multithreaded' is calculated as: base cost * numThreads * (1.02 ^ numThreads). A script can be run multithreaded using the 'run [script] -t n' Terminal command or by passing in an argument to the run() and exec() Netscript commands. See documentation.
* RAM is slightly (~10%) more expensive (affects purchasing server and upgrading RAM on home computer)
* NeuroFlux Governor augmentation cost multiplier decreased
* Netscript default operation runtime lowered to 200ms (was 500ms previously)

v0.20.1
-------
* Fixed bug where sometimes scripts would crash without showing the error
* Added Deepscan programs to Dark Web
* Declining a faction invite will stop you from receiving invitations from that faction for the rest of the run
* (BETA) Added functionality to export/import saves. WARNING This is only lightly tested. You cannot choose where to save your file it just goes to the default save location. Also I have no idea what will happen if you try to import a file that is not a valid save. I will address these in later updates

v0.20.0
-------
* Refactored Netscript Interpreter code. Operations in Netscript should now run significantly faster (Every operation such as a variable assignment, a function call, a binary operator, getting a variable's value, etc. used to take up to several seconds, now each one should only take ~500 milliseconds). 
* Percentage money stolen when hacking lowered to compensate for faster script speeds
* Hacking experience granted by grow() halved
* Weaken() is now ~11% faster, but only grants 3 base hacking exp upon completion instead of 5 
* Rebalancing of script RAM costs. Base RAM Cost for a script increased from 1GB to 1.5GB. Loops, hack(), grow() and weaken() all cost slightly less RAM than before 
* Added getServerRequiredHackingLevel(server) Netscript command. 
* Added fileExists(file, [server]) Netscript command, which is used to check if a script/program exists on a specified server
* Added isRunning(script, [server]) Netscript command, which is used to check if a script is running on the specified server
* Added killall Terminal command. Kills all running scripts on the current machine
* Added kill() and killall() Netscript commands. Used to kill scripts on specified machines. See Netscript documentation
* Re-designed 'Active Scripts' tab
* Hacknet Node base production rate lowered from 1.6 to 1.55 ($/second)
* Increased monetary cost of RAM (Upgrading home computer and purchasing servers will now be more expensive)
* NEW GROWTH MECHANICS - The rate of growth on a server now depends on a server's security level. A higher security level will result in lower growth on a server when using the grow() command. Furthermore, calling grow() on a server raises that server's security level by 0.004. For reference, if a server has a security level of 10 it will have approximately the same growth rate as before. 
* Server growth no longer happens naturally
* Servers now have a maximum limit to their money. This limit is 50 times it's starting money
* Hacking now grants 10% less hacking experience
* You can now edit scripts that are running
* Augmentations cost ~11% more money and 25% more faction reputation

v0.19.7
-------
* Added changelog to Options menu
* Bug fix with autocompletion (wasn't working properly for capitalized filenames/programs

v0.19.6
-------
* Script editor now saves its state even when you change tabs 
* scp() command in Terminal/script will now overwrite files at the destination 
* Terminal commands are no longer case-sensitive (only the commands themselves such as 'run' or 'nano'. Filenames are still case sensitive
* Tab automcompletion will now work on commands

v0.19.0
-------
* Hacknet Nodes have slightly higher base production, and slightly increased RAM multiplier. But they are also a bit more expensive at higher levels
* Calling grow() and weaken() in a script will now work offline, at slower rates than while online (The script now keeps track of the rate at which grow() and weaken() are called when the game is open. These calculated rates are used to determine how many times the calls would be made while the game is offline)
* Augmentations now cost 20% more reputation and 50% more money
* Changed the mechanic for getting invited to the hacking factions (CyberSec, NiteSec, The Black Hand, BitRunners) Now when you get to the required level to join these factions you will get a message giving you instructions on what to do in order to get invited.
* Added a bit of backstory/plot into the game. It's not fully fleshed out yet but it will be used in the future
* Made the effects of many Augmentations slightly more powerful
* Slightly increased company job wages across the board (~5-10% for each position)
* Gyms and classes are now significantly more expensive
* Doubled the amount by which a server's security increases when it is hacked. Now, it will increase by 0.002. Calling weaken() on a server will lower the security by 0.1.

v0.18.0
-------
* Major rebalancing (sorry didn't record specifics. But in general hacking gives more money and hacknet nodes give less)
* Server growth rate (both natural and manual using grow()) doubled
* Added option to Soft Reset
* Cancelling a full time job early now only results in halved gains for reputation. Exp and money earnings are gained in full
* Added exec() Netscript command, used to run scripts on other servers. 
* NEW HACKING MECHANICS: Whenever a server is hacked, its 'security level' is increased by a very small amount. The security level is denoted by a number between 1-100. A higher security level makes it harder to hack a server and also decreases the amount of money you steal from it. Two Netscript functions, weaken() and getServerSecurityLevel() level, were added. The weaken(server) function lowers a server's security level. See the Netscript documentation for more details
* When donating to factions, the base rate is now $1,000,000 for 1 reputation point. Before, it was $1,000 for 1 reputation point.
* Monetary costs for all Augmentations increased. They are now about ~3.3 - 3.75 times more expensive than before

v0.17.1
-------
* Fixed issue with purchasing Augmentations that are 'upgrades' and require previous Augmentations to be installed
* Increased the percentage of money stolen from servers when hacking

v0.17.0
-------
* Greatly increased amount of money gained for crimes (by about 400% for most crimes)
* Criminal factions require slightly less negative karma to get invited to
* Increased the percentage of money stolen from servers when hacking
* Increased the starting amount of money available on beginning servers (servers with <50 required hacking))
* Increased the growth rate of servers (both naturally and manually when using the grow() command in a script)
* Added getHostname() command in Netscript that returns the hostname of the server a script is running on
* jQuery preventDefault() called when pressing ctrl+b in script editor
* The Neuroflux Governor augmentation (the one that can be repeatedly leveled up) now increases ALL multipliers by 1%. To balance it out, it's price multiplier when it levels up was increased
* Hacknet Node base production decreased from $1.75/s to $1.65/s
* Fixed issue with nested for loops in Netscript (stupid Javascript references)
* Added 'scp' command to Terminal and Netscript
* Slightly nerfed Hacknet Node Kernel DNI and Hacknet Node Core DNI Augmentations
* Increased TOR Router cost to $200k

v0.16.0
-------
* New Script Editor interface 
* Rebalanced hacknet node - Increased base production but halved the multiplier from additional cores. This should boost its early-game production but nerf its late-game production
* Player now starts with 8GB of RAM on home computer
* 'scan-analyze' terminal command displays RAM on servers
* Slightly buffed the amount of money the player steals when hacking servers (by about ~8%)
* Time to execute grow() now depends on hacking skill and server security, rather than taking a flat 2 minutes.
* Clicking outside of a pop-up dialog box will now close it
* BruteSSH.exe takes 33% less time to create
* 'iron-gym' and 'max-hardware' servers now have 2GB of RAM
* Buffed job salaries across the board
* Updated Tutorial
* Created a Hacknet Node API for Netscript that allows you to access and upgrade your Hacknet Nodes. See the Netscript documentation for more details. WARNING The old upgradeHacknetNode() and getNumHacknetNodes() functions waere removed so any script that has these will no longer work 

v0.15.0
-------
* Slightly reduced production multiplier for Hacknet Node RAM
* Faction pages now scroll
* Slightly increased amount of money gained from hacking
* Added 'alias' command
* Added 'scan-analyze' terminal command - used to get basic hacking info about all immediate network connections
* Fixed bugs with upgradeHacknetNode() and purchaseHacknetNode() commands
* Added getNumHacknetNodes() and hasRootAccess(hostname/ip) commands to Netscript
* Increased Cost of university classes/gym
* You can now see what an Augmentation does and its price even while its locked
