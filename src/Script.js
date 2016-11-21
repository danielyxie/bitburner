/* Script.js
 *  Script object
 */
function Script() {
    //Function queue that holds the next functions to be
    //executed in this script. A function from this queue
    //is executed every second (this may change)
    this.functionQueue = [];
    
    this.code       = "";
    this.ramUsage   = 0;
    
    /* Properties to calculate offline progress. Only applies for infinitely looping scripts */
    
    //Time it takes to execute one iteration of the entire script
    //Each function takes 1 second, plus hacking time plus and sleep commands
    this.executionTimeMillis    = 0;
    
    //Number of instructions ("lines") in the code. Any call ending in a ; 
    //is considered one instruction. Used to calculate executionTime
    this.numInstructions        = 0;
    
    //Which servers are hacked in one iteration of the script. May contain duplicates
    this.serversHacked          = [];
}

//Execute the next function in the Script's function queue
Script.prototype.executeNext() {
    if (this.functionQueue.length <= 0) {return;}
    
    //Shift the next element off ths function queue and then execute it
    (this.functionQueue.shift())();
}

Script.prototype.setCode(code) {
    this.code = code;
}

/* Wrapper object that wraps a function with its arguments.
 *      These objects are pushed onto a Script object's function queue.
 *      The functions can be called with the standard () operator
 *
 *  Example:
 *      //Define the function
 *      var fooFunc = function(a1, a2, a3) {
 *          return a1 + a2 + a3;
 *      }
 *      //Wrap the function in the wrapper object
 *      var fooObj = functionObject(fooFunc, this, [2, 3, 4]); 
 *      //Call the function 
 *      fooObj();   
 *
 */
function functionObject = function(fn, context, params) {
    return function() {
        fn.apply(context, params);
    }
}