/* Script.js
 *  Script object
 */
function Script() {
    //Function queue that holds the next functions to be
    //executed in this script. A function from this queue
    //is executed every second (this may change)
    this.functionQueue = [];
    
    this.code = "";
    this.ramUsage = 0;
    
}

//Execute the next function in the Script's function queue
Script.prototype.executeNext() {
    if (this.functionQueue.length <= 0) {return;}
    
    //Shift the next element off ths function queue and then execute it
    (this.functionQueue.shift())();
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