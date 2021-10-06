const { throws } = require("assert")
const { default: axios } = require("axios")

async function getPeople() {
    const { data } = await axios.get('https://gist.githubusercontent.com/graffixnyc/a1196cbf008e85a8e808dc60d4db7261/raw/9fd0d1a4d7846b19e52ab3551339c5b0b37cac71/people.json')
    return data
}

const getPersonById = async function getPersonById(id) {
    if (!id) {
        throw "ID not provided"
    } else if (typeof id !== "string") {
        throw "ID provided is not a String"
    } else if (id.trim().length === 0 || id.length === 0) {
        throw "ID cannot be just empty spaces"
    }
    
    let peopleData = await getPeople()
    let result = {}
    
    peopleData.forEach(x => {
        for (const i in x) {
            if(i === "id"){
                if (x[i] === id) {
                    result = x
                }
            }
        }
        if (!result) throw "people not found"
    });

    return result
}

const sameStreet = async function sameStreet(streetName, streetSuffix) {
    if (!streetName || !streetSuffix) {
        throw "Street Name or Street Suffix not provided"
    } else if (typeof streetName !== "string" || typeof streetSuffix !== "string") {
        throw "Street Name and Street Suffix, both should be a string"
    } else  if (streetName.trim().length === 0 || streetName.length === 0 || streetSuffix.trim().length === 0 || streetSuffix.length === 0) {
        throw "Street Name or Street Suffix cannot be just empty spaces"
    }
    
    let peopleData = await getPeople()
    let result = []
    streetName = streetName.trim(), streetSuffix = streetSuffix.trim()
    
    peopleData.forEach(x => {
        if((x.address.home.street_name.toLowerCase() === streetName.toLowerCase() && x.address.home.street_suffix.toLowerCase() === streetSuffix.toLowerCase()) || 
        (x.address.work.street_name.toLowerCase() === streetName.toLowerCase() && x.address.work.street_suffix.toLowerCase() === streetSuffix.toLowerCase())){
            result.push(x)
        }
    })
    if (result.length < 2) {
        throw `there are not at least two people that live or work on ${streetName} ${streetSuffix}`
    }
    return result
}

const manipulateSsn = async function manipulateSsn() {
    if (arguments.length > 0 || arguments === null) {
        throw "This function does not require any values to be passed"
    }
    let peopleData = await getPeople()
    let sortSSN = {}, average = 0, result = {}, max = 0,  minArr = [], highest = {}, lowest = {}

    peopleData.forEach(x =>{
        sortSSN[x.ssn] = parseInt(x.ssn.replaceAll('-', '').split('').sort().join(''))
        average += sortSSN[x.ssn]
        if (sortSSN[x.ssn] > max) {
            max = sortSSN[x.ssn]
            highest["firstname"] = x.first_name
            highest["lastname"] = x.last_name
            result["highest"] = highest
        }
        minArr.push(sortSSN[x.ssn])
        min = Math.min(...minArr)
    })

    for (const x in sortSSN) {
        if (sortSSN[x] == min) {
            peopleData.forEach(y => {
                if (y.ssn == x) {
                    lowest['firstname'] = y.first_name
                    lowest['lastname'] = y.last_name
                    result["lowest"] = lowest
                }
            })
            
        }
    }
    
    average = Math.floor(average/Object.keys(sortSSN).length) 
    result["average"] = average 
    return result
}

const sameBirthday = async function sameBirthday(month, day) {
    if (!month || !day) {
        throw "Month or Day cannot be empty"
    } else if (typeof month === "string" || typeof day === "string") {
        if (typeof month === 'string') {
            if (month.trim().length === 0) {
                throw "Month cannot be empty spaces"
            }
            month = Number(month)
            if (isNaN(month) || Number.isInteger(month) === false) {
                throw "Month is not a valid number"
            }    
        } 
        if (typeof day === 'string') {
            if (day.trim().length === 0) {
                throw "Day cannot be empty spaces"
            }
            day = Number(day)
            if (isNaN(day) || !Number.isInteger(day)) {
                throw "Day either is not a valid number"
            }
        } 
    } else if (typeof month !== 'number' || typeof day !== 'number') {
        throw 'Month and Day both should be numbers'
    }
    if (month > 12) {
        throw "Months cannot be greater than 12"
    }else if (month < 1) {
        throw "Month cannot be less than 1"
    } else if (month == 2 || month == 02) {
        if (day > 28) {
            throw "There are not 29 days in Feb"
        }
    } else if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
        if (day > 31) {
            let months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"]
            throw `There are not ${day} days in ${months[month-1]}`
        }
    } else if (month == 4 || month == 6 || month == 9 || month == 11) {
        if (day > 30) {
            let months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"]
            throw `There are not ${day} days in ${months[month-1]}`
        }
    }

    let peopleData = await getPeople()
    let result = []
    peopleData.forEach(x => {
        let dob = x.date_of_birth.split('/')
        dob.pop()
        if (String(month).length === 1) {
            dob[0] = parseInt(dob[0].split('').sort().join(''))
        }
        if (dob[0] == month && dob[1] == day) {
            result.push(x.first_name + " " + x.last_name)
        
        }
    })
    if (result.length === 0) {
        throw "There are no People with this Birthday"
    }
    return result
}

module.exports = {
    getPersonById,
    sameStreet,
    manipulateSsn,
    sameBirthday
}