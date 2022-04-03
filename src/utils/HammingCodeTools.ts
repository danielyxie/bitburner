// by Discord: H3draut3r#6722, feel free to ask me any questions. i probably don't know the answer 🤣
export function HammingEncode(value: number): string { // encoding following Hammings rule
  function HammingSumOfParity(_lengthOfDBits: number): number {
  // will calculate the needed amount of parityBits 'without' the "overall"-Parity (that math took me 4 Days to get it working)
    return (_lengthOfDBits < 3 || _lengthOfDBits == 0) // oh and of course using ternary operators, it's a pretty neat function
      ? ((_lengthOfDBits == 0) ? 0 : _lengthOfDBits + 1)
      // the following math will only work, if the length is greater equal 3, otherwise it's "kind of" broken :D
      : ((Math.ceil(Math.log2(_lengthOfDBits * 2))) <= Math.ceil(Math.log2(1 + _lengthOfDBits + Math.ceil(Math.log2(_lengthOfDBits)))))
        ? Math.ceil(Math.log2(_lengthOfDBits) + 1)
        : Math.ceil(Math.log2(_lengthOfDBits))
  }
  const _data=value.toString(2).split(""); // first, change into binary string, then create array with 1 bit per index
  const _sumParity: number = HammingSumOfParity(_data.length); // get the sum of needed parity bits (for later use in encoding)
  const count = (arr: Array<string>, val: string): number => arr.reduce((a: number, v: string) => (v === val ? a + 1 : a), 0);
  // function count for specific entries in the array, for later use

  const _build = ["x", "x", ..._data.splice(0, 1)]; // init the "pre-build"
  for (let i = 2; i < _sumParity; i++) { // add new paritybits and the corresponding data bits (pre-building array)
    _build.push("x", ..._data.splice(0, Math.pow(2, i) - 1))
  }
  // now the "calculation"... get the paritybits ('x') working
  for (const index of _build.reduce(function (a: Array<number>, e: string, i: number) { if (e == "x") a.push(i); return a; }, [])) {
    // that reduce will result in an array of index numbers where the "x" is placed
    const _tempcount = index + 1; // set the "stepsize" for the parityBit
    const _temparray = []; // temporary array to store the extracted bits
    const _tempdata = [..._build]; // only work with a copy of the _build
    while (_tempdata[index] !== undefined) { // as long as there are bits on the starting index, do "cut"
      const _temp: Array<string> = _tempdata.splice(index, _tempcount * 2); // cut stepsize*2 bits, then...
      _temparray.push(..._temp.splice(0, _tempcount)); // ... cut the result again and keep the first half
    }
    _temparray.splice(0, 1); // remove first bit, which is the parity one
    _build[index] = ((count(_temparray, "1")) % 2.).toString(); // count with remainder of 2 and"toString" to store the parityBit
  } // parity done, now the "overall"-parity is set
  _build.unshift(((count(_build, "1")) % 2.).toString()); // has to be done as last element
  return _build.join(""); // return the _build as string
}

export function HammingDecode(_data: string): number { //check for altered bit and decode
  const _build = _data.split(""); // ye, an array for working, again
  const _testArray = [];  //for the "truthtable". if any is false, the data has an altered bit, will check for and fix it
  const _sumParity = Math.ceil(Math.log2(_data.length)); // sum of parity for later use
  const count = (arr: Array<string>, val: string): number => arr.reduce((a: number, v: string) => (v === val ? a + 1 : a), 0);
  // the count.... again ;)

  let _overallParity = _build.splice(0, 1).join(""); // store first index, for checking in next step and fix the _build properly later on
  _testArray.push((_overallParity == (count(_build, "1") % 2).toString()) ? true : false); // first check with the overall parity bit
  for (let i = 0; i < _sumParity; i++) { // for the rest of the remaining parity bits we also "check"
    const _tempIndex = Math.pow(2, i) - 1; // get the parityBits Index
    const _tempStep = _tempIndex + 1; // set the stepsize
    const _tempData = [..._build]; // get a "copy" of the build-data for working
    const _tempArray = []; // init empty array for "testing"
    while (_tempData[_tempIndex] != undefined) { // extract from the copied data until the "starting" index is undefined
      const _temp = [..._tempData.splice(_tempIndex, _tempStep * 2)]; // extract 2*stepsize
      _tempArray.push(..._temp.splice(0, _tempStep))  // and cut again for keeping first half
    }
    const _tempParity = _tempArray.shift(); // and again save the first index separated for checking with the rest of the data
    _testArray.push(((_tempParity == (count(_tempArray, "1") % 2).toString())) ? true : false)
    // is the _tempParity the calculated data? push answer into the 'truthtable'
  }
  let _fixIndex = 0; // init the "fixing" index and start with 0
  for (let i = 1; i < _sumParity + 1; i++) { // simple binary adding for every boolean in the _testArray, starting from 2nd index of it
    _fixIndex += (_testArray[i]) ? 0 : (Math.pow(2, i) / 2)
  }
  _build.unshift(_overallParity); // now we need the "overall" parity back in it's place
  // try fix the actual encoded binary string if there is an error
  if (_fixIndex > 0 && _testArray[0] == false) {
  // if the overall is false and the sum of calculated values is greater equal 0, fix the corresponding hamming-bit
    _build[_fixIndex] = (_build[_fixIndex] == "0") ? "1" : "0"
  }
  else if (_testArray[0] == false) {
    // otherwise, if the the overall_parity is the only wrong, fix that one
    _overallParity = (_overallParity == "0") ? "1" : "0"
  }
  else if (_testArray[0] == true && _testArray.some((truth) => truth == false)) {
    return 0 // uhm, there's some strange going on... 2 bits are altered? How? This should not happen 👀
  }
  // oof.. halfway through... we fixed an possible altered bit, now "extract" the parity-bits from the _build
  for (let i = _sumParity; i >= 0; i--) { // start from the last parity down the 2nd index one
    _build.splice(Math.pow(2, i), 1)
  }
  _build.splice(0, 1); // remove the overall parity bit and we have our binary value
  return parseInt(_build.join(""), 2); // parse the integer with redux 2 and we're done!
}
