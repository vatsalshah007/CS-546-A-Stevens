const sortString = function sortString(string){
    if (!string || string.length == 0 || typeof string !== "string" || string.trim().length == 0) {
        throw "invalid string"
    }
    let splitStr = string.split("");
    let lowerCaseStr = [];
    let upperCaseStr = [];
    let spChar = [];
    let numStr = [];
    let spaceStr = [];
    splitStr.forEach(x => {
        if (!isNaN(x) && x !== " ") {
            numStr.push(parseInt(x))
        }else if ((/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g).test(x)) {
            spChar.push(x)
        } else if ((/[ ]/).test(x)) {
            spaceStr.push(x)
        } else if (x == x.toLowerCase()) {
            lowerCaseStr.push(x)
        } else if (x == x.toUpperCase()) {
            upperCaseStr.push(x)
        }
    });
    let sortedNums = numStr.sort((a, b) => {
        return a - b
    })
    numStr = String(sortedNums).replaceAll(',', '')
    lowerCaseStr = String(lowerCaseStr.sort()).replaceAll(',', '')
    upperCaseStr = String(upperCaseStr.sort()).replaceAll(',', '')
    spChar = String(spChar).replaceAll(',', '')
    spaceStr = String(spaceStr).replaceAll(',', '')

    let sortedStr = lowerCaseStr+upperCaseStr+spChar+numStr+spaceStr
    // sortString
    return sortedStr
}

const replaceChar = function replaceChar(string, idx){
    if (typeof string !== "string" || (idx <= 0 && idx < (string.length - 2)) || !string || string.length == 0 || 
         idx > string.length || typeof idx !== "number" || string.trim().length == 0) {
        throw "Error in Imput"
    }
    let lIndex = string[idx-1], rIndex = string[idx+1], count = 1
    for (let i = 0; i < string.length; i++) {
        if (string[i] === string[idx] && i !== idx) {
            if (count % 2 == 0) {
                string = string.substr(0, i) + rIndex + string.substr(i+1)
                count++
            } else {
                string = string.substr(0, i) + lIndex + string.substr(i+1)
                count++
            }
        }
    }
    return string
}

const mashUp = function mashUp(string1, string2, char){
    if (!string1 || !string2 || !char || string1.length == 0 || string2.length == 0 || char.trim().length !== 1 ||
         typeof string1 !== "string" || typeof string2 !== "string" || typeof char !== "string" || string1.trim().length == 0 || string2.trim().length == 0 ||
         char.trim().length == 0) {
        throw "Error, Invalid Inputs"
    }
    let newStr = []
    if (string1.length < string2.length) {
        for (let i = string1.length; i < string2.length; i++) {
            string1 = string1 + char            
        }
        for (let i = 0; i < string2.length; i++) {
            newStr.push(string1[i])
            newStr.push(string2[i])
        }
    } else if (string1.length > string2.length) {
        for (let i = string2.length; i < string1.length; i++) {
            string2 = string2 + char            
        }
        for (let i = 0; i < string1.length; i++) {
            newStr.push(string1[i])
            newStr.push(string2[i])
        }
    } else {
        for (let i = 0; i < string1.length; i++) {
            newStr.push(string1[i])
            newStr.push(string2[i])
        }
    }

    newStr = newStr.join('')
    return newStr
}

module.exports = {
    sortString,
    replaceChar,
    mashUp
}