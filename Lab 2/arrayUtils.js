const average = function average(arr) {
    let sum = 0
    let count = 0
    if (!arr || arr.length === 0 || Array.isArray(arr)==false) {
                throw 'Parameter is not a number!';
    } else {
        arr.forEach(arrayElement => {
            if ( !arrayElement || arrayElement.length === 0 || Array.isArray(arr)==false) {
                throw 'Parameter is not a number!';
            } else {
                arrayElement.forEach(y => {
                    if (y === null) {
                        throw 'Parameter is not a number!';
                    } else if (typeof y !== "number") {
                        throw 'Parameter is not a number!';
                    } else {
                        sum = sum + y
                        count++
                    }
                });    
            }
        });    
    }    
    return sum/count
}

const modeSquared = function modeSquared (arr){
    if (!arr || Array.isArray(arr) == false || arr.length === 0) {
        throw "Invalid Input"
    }
    let modeObj = {}
    let count = 1
    let max = undefined
    arr.forEach(x => {
        if (typeof x !== "number") {
            throw "Array Element should be number"
        }
        if (x in modeObj) {
            modeObj[x]++
        } else {
            modeObj[x] = count
        }
        if (max === undefined) {
            max = modeObj[x]
        } else if(modeObj[x] > max){
            max = modeObj[x]
        }
    });
    let modeSqr = []
    for (const key in modeObj) {
        // compare the max and key values now and if the key value matches, then you square it.
        if (modeObj[key] === max) {
            modeSqr.push(Math.pow(parseInt(key), 2))
        }
    }
    if (modeSqr.length > 1) {
        let sumModeSqr = 0
        modeSqr.forEach(x => {
            sumModeSqr += x 
        })
        return parseInt(sumModeSqr)
    } else {
        return parseInt(modeSqr)
    }    
}

const medianElement = function medianElement (arr){
    let median = {}
    const ogArr = arr.map(x => x)
    let myMedian = undefined
    let medianPositionLeft = undefined
    let medianPositionRight = undefined 
    if (!arr || arr.length === 0 || Array.isArray(arr)==false) {
        throw "There is no Array"
    } else {
        arr.forEach(x => {
            if (x === null || typeof x !== "number") {
                throw "Invalid Array"
            }
        })
    }
    let sortedArr = arr.sort((a, b) => {
        return a - b
    })
    if (sortedArr.length % 2 == 0) {
        medianPositionLeft = (sortedArr.length/2) -1
        medianPositionRight = (sortedArr.length/2)
        myMedian = (sortedArr[medianPositionLeft]+sortedArr[medianPositionRight])/2
        // median[myMedian] = medianPositionRight
    } else {
        let medianPosition = Math.floor(sortedArr.length/2)
        myMedian = sortedArr[medianPosition]
        // median[myMedian] = medianPosition
    }
    ogArr.forEach(x => {
        if (ogArr.length % 2 == 0) {
            median[myMedian] = ogArr.indexOf(sortedArr[medianPositionRight])
        } else {
            if (x == myMedian) {
                median[myMedian] = ogArr.indexOf(x)
            }
        }
    })
    return median
}

const merge = function merge (arrayOne, arrayTwo){
    let mergedArr = []
    let lowerCaseArr = []
    let upperCaseArr = []
    let numbersArr = []
    let escChars = new RegExp (/[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g)
    if (!arrayOne || !arrayTwo || arrayOne.length === 0 || arrayTwo.length === 0) {
        throw "No array"
    }
    arrayOne.forEach(x => {
        if (!x || x.length === 0) {
            throw "Null"
        }
        if (typeof x === "string") {
            if (escChars.test(x)) {
                throw "Invalid String it is"
            }
            if (x == x.toLowerCase()) {
                lowerCaseArr.push(x)
            } else if (x == x.toUpperCase()) {
                upperCaseArr.push(x)
            }   
        } else if (typeof x === "number") {
            numbersArr.push(x)
        }
    })
    arrayTwo.forEach(x => {
        if (!x || x.length === 0) {
            throw "Null"
        }
        if (typeof x === "string") {
            if (escChars.test(x)) {
                throw "Invalid String it is"
            }
            if (x == x.toLowerCase()) {
                lowerCaseArr.push(x)
            } else if (x == x.toUpperCase()) {
                upperCaseArr.push(x)
            } else {
                throw "Inavlid String"
            }    
        } else if (typeof x === "number") {
            numbersArr.push(x)
        }
    })
    lowerCaseArr.sort()
    upperCaseArr.sort()
    let sortedArr = numbersArr.sort((a, b) => {
        return a - b
    })
    numbersArr = sortedArr
    mergedArr = mergedArr.concat(lowerCaseArr).concat(upperCaseArr).concat(numbersArr)

    return mergedArr
}


module.exports = {
    average,
    modeSquared,
    medianElement,
    merge
}