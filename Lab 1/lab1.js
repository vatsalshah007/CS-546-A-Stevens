const questionOne = function questionOne(arr) {
    // Implement question 1 here
    let result = { };
    if (!arr) {
        return result;
    }
    arr.forEach(x => {
        let a = Math.abs(Math.pow(x, 2) - 7);
        if (x === null) {
            return result
        } else if (a === 1) {
            result[a] = false;
        } else if (a === 2) {
            result[a] = true;
        } else {
            for (let i = 2; i < a; i++) {
                if (a % i == 0) {
                    result[a] = false;
                    break;
                } else {
                    result[a] = true;
                }
            }
        }

    });
    return result;
}

const questionTwo = function questionTwo(arr) { 
    // Implement question 2 here
    let result = [];
    if (!arr) {
        return result
    } else {
        arr.forEach(x => {
            if (result.indexOf(x) < 0) {
                result.push(x)
            }    
        });
    }
    
    return result
}

const questionThree = function questionThree(arr) {
    // Implement question 3 here
    let result = {}
    let keyArray = []
    let valueArray = []
    if (!arr) {
        return result
    } else {
        arr.forEach(x => {
            let tempElementX = x.split("").sort().join("");
            if (keyArray.indexOf(tempElementX) < 0) {
                keyArray.push(tempElementX)
                
            }
            let tempValArr = []
            arr.forEach(y => {
                let tempElementY = y.split("").sort().join("");
                if (tempElementX === tempElementY & tempValArr.indexOf(y) < 0) {
                    tempValArr.push(y) 
                    valueArray.push(y)   
                }
            })
            if (tempValArr.length != 1) {
                result[tempElementX] = tempValArr;     
            }
        });
    }
    return result    
}

const questionFour = function questionFour(num1, num2, num3) {
    // Implement question 4 here
    let numArr = [num1, num2, num3]
    let sum = 0
    numArr.forEach(x => {
        let fact = 1
        if (x === 1 || x === 0) {
            fact = 1
        } else {
            for (let i = x; i >= 1; i--) {
                fact = fact * i
            }
        }
        sum = sum + fact
    });
    let avg = (num1 + num2 + num3)/3
    let result = Math.floor(sum/avg)
    return result
}

module.exports = {
    firstName: "Vatsal", 
    lastName: "Shah", 
    studentId: "10474245",
    questionOne,
    questionTwo,
    questionThree,
    questionFour
};