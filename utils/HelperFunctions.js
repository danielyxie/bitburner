//General helper functions

//Returns the size (number of keys) of an object
function sizeOfObject(obj) {
	var size = 0, key;
	for (key in obj) {
		if (obj.hasOwnProperty(key)) size++;
	}
	return size;
}

//Adds a random offset to a number within a certain percentage
//e.g. addOffset(100, 5) will return anything from 95 to 105. 
//The percentage argument must be between 0 and 100;
function addOffset(n, percentage) {
    if (percentage < 0 || percentage > 100) {return ;}
    
    var offset = n * (percentage / 100);
    
    return n * (Math.random() * (2 * offset) - offset);
}