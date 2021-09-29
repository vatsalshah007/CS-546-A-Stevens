const computeObjects = function computeObjects(objects, func){
    if (!objects || !func || Array.isArray(objects) == false || objects.length == 0 || typeof func !== "function") {
        throw "Error Invalid Inputs"
    }
    let result = {}
    objects.forEach(x => {
        if (!x || Array.isArray(x) == true || typeof x === "number" || typeof x === "string" || typeof x === "boolean") {
            throw "Error invalid Inputs"
        }
        for (const i in x) {
            if (typeof x[i] === "undefined") {
                throw "Invalid Input"
            }
            if (i in result) {
                let square2 = func(x[i])
                result[i] = result[i] + square2 
            } else {
                result[i] = func(x[i])
            }            
        }
    });
    return result
}

const commonKeys = function commonKeys(obj1, obj2) {
    if (!obj1 || !obj2 || typeof obj1 !== "object" || typeof obj2 !== "object" || Array.isArray(obj1) === true || Array.isArray(obj2) === true) {
        throw "Error Invalid Input"
    }
    let result = {}
    
    if (Object.keys(obj1).length === 0 && Object.keys(obj2).length === 0 ) {
        return result
    }
    for (const i in obj1) {
        for (const j in obj2) {
              if (i == j) {
                  if (obj1[i] == obj2[j] && (typeof obj1[i]) == typeof obj2[j]) {
                      result[i] = obj1[i]
                  } else if (Array.isArray(obj1[i]) && Array.isArray(obj2[j])) {
                      let arrValResult = []
                      obj1[i].forEach(x => {
                          if (obj2[j].indexOf(x) >= 0) {
                              arrValResult.push(x)
                          }
                      })
                      if (arrValResult.length == obj2[j].length && arrValResult.length == obj1[i].length) {
                        result[i] = arrValResult
                    }
                  } else if (typeof obj1[i] === "object" && typeof obj2[j] === "object" && Array.isArray(obj1[i]) === false && Array.isArray(obj2[j]) === false) {
                      let valResult = commonKeys(obj1[i], obj2[j])
                      if (Object.keys(valResult).length > 0) {
                            result[i] = valResult      
                      } else if (Object.keys(valResult).length === 0 && Object.keys(obj1[i]).length === 0 && Object.keys(obj2[i]).length === 0) {
                          result[i] = {}
                      } 
                  }
              }
        }
    }
    return result    
}

const flipObject = function flipObject(object) {
    if (!object || Object.keys(object).length < 1 || typeof object !== "object" || (typeof object === "object" && Array.isArray(object) == true)) {
        throw "Invalid Input "
    }
    let result = {}
    for (const i in object) {
        if (typeof object[i] === "object" && Array.isArray(object[i]) === false) {
            let objResult = flipObject(object[i])
            result[i] = objResult
        } else if (Array.isArray(object[i])) {
            object[i].forEach(x => {
            result[x] = i
        })
        } else{
            result[object[i]] = i
    }}
    return result
    
}

module.exports = {
    computeObjects,
    commonKeys,
    flipObject
}