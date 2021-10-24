const { default: axios } = require("axios")

async function getPeople() {
    const { data } = await axios.get('https://gist.githubusercontent.com/graffixnyc/a1196cbf008e85a8e808dc60d4db7261/raw/9fd0d1a4d7846b19e52ab3551339c5b0b37cac71/people.json')
    return data
}

const idCheck = async (id) => {
    if (!id) {
        throw `Id field cannot be empty`
    }
    if (typeof id !== "string") {
        throw `Id needs to be a string`
    } else if (id.trim().length === 0) {
        throw `Id cannot be empty spaces`
    }
    if (id.trim().length !== id.length) {
        throw `Spaces are not allowed in ID`
    }
}

const getPersonById = async function getPersonById(id) {
    await idCheck(id)
    
    let peopleData = await getPeople()
    let result
    peopleData.forEach(x => {
                if (x.id == id) {
                    result = x
            }
    });
    if (!result) throw "people not found"
    return result
}

const getAll = async function getAll() {
    if (arguments.length > 0 || arguments === null) {
        throw `This get function does not take in any arguments.`
    }
    let peopleData = await getPeople()
    return peopleData 
}

module.exports = {
    getPersonById,
    getAll,
}