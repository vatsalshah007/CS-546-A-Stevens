const { default: axios } = require("axios")

async function getPeople() {
    const { data } = await axios.get('https://gist.githubusercontent.com/graffixnyc/a1196cbf008e85a8e808dc60d4db7261/raw/9fd0d1a4d7846b19e52ab3551339c5b0b37cac71/people.json')
    return data
}
async function getStocks() {
    const { data } = await axios.get('https://gist.githubusercontent.com/graffixnyc/8c363d85e61863ac044097c0d199dbcc/raw/7d79752a9342ac97e4953bce23db0388a39642bf/stocks.json')
    return data
}

const listShareholders = async function listShareholders() {
    if (arguments.length > 0 || arguments === null) {
        throw "This function does not require any values to be passed"
    }
    
    let peopleData = await getPeople()
    let stocksData = await getStocks()
    

    stocksData.forEach(x => {
        x.shareholders.forEach(y => {
            let count = 0
            peopleData.forEach(z => {
                if (y.userId === z.id) {
                    count++
                    delete y.userId
                    y["first_name"] = z.first_name
                    y["last_name"] = z.last_name
                }
            })
            if (count == 0) {
                delete y.userId
                delete y.number_of_shares
            }
        })
    });
    return stocksData
}

const topShareholder = async function topShareolder(stockName) {
    if (!stockName) {
        throw "Stock name not provided"
    } else if (typeof stockName !== "string") {
        throw "Stock Name need to be a string"
    } else  if (stockName.trim().length === 0 || stockName.length === 0) {
        throw "Stock name cannot be empty spaces"
    }

    let peopleData = await getPeople()
    let stocksData = await getStocks()
    let max = 0, userIdMax, maxShares, firstname, lastname
    stockName = stockName.trim()
    for (const x of stocksData) {
        if(x.stock_name === stockName){
            if (x.shareholders.length === 0) {
                return `${stockName} currently has no shareholders.`
            }
            x.shareholders.forEach(y => {
                if (y.number_of_shares > max) {
                    max = y.number_of_shares
                    userIdMax = y.userId
                    maxShares = y.number_of_shares
                }
            })
        }
    }

    if (max == 0) {
        throw `No stock with the name, ${stockName}.`
    }

    peopleData.forEach(x =>{
        if (x.id === userIdMax) {
            firstname = x.first_name
            lastname = x.last_name
        }
    })
    return `With ${maxShares} shares in ${stockName}, ${firstname} ${lastname} is the top shareholder.`
}

const listStocks = async function listStocks(firstName, lastName) {
    if (!firstName || !lastName) {
        throw "First name or Last name not provided"
    } else if (typeof firstName !== "string" || typeof lastName !== "string") {
        throw "First name and Last name both need to be Strings"
    } else if (firstName.trim().length === 0 || firstName.length === 0 || lastName.trim().length === 0|| lastName.length === 0) {
        throw "First name or Last name cannot be empty spaces"
    }
    
    let peopleData = await getPeople()
    let stocksData = await getStocks()
    let result = [], count = 0
    firstName = firstName.trim(), lastName = lastName.trim()
    peopleData.forEach(x =>{
        if (x.first_name === firstName && x.last_name === lastName) {
            stocksData.forEach(y => {
                y.shareholders.forEach(z => {
                    if (z.userId === x.id) {
                        let stockList = {}
                        stockList["stock_name"] = y.stock_name
                        stockList["number_of_shares"] = z.number_of_shares
                        result.push(stockList)
                    }
                })
            })
            count++
        }
    })
    if (count == 0) {
        throw `${firstName} ${lastName} is not in people.json`
    }
    if (result.length === 0) {
        throw  `${firstName} ${lastName} doesn't own any shares`
    }
    return result

}

const getStockById = async function getStockById(id){
    if (!id) {
        throw "ID not provided"
    } else if (typeof id !== "string") {
        throw "ID provided is not a String"
    } else if (id.trim().length === 0 || id.length === 0) {
        throw "ID cannot be just empty spaces"
    }

    let stocksData = await getStocks()
    let stock
    
    stocksData.forEach(x => {
        if (x.id === id) {
            stock = x
        }
    })
    if (stock === undefined) {
        throw "stock not found"
    }
    return stock
}

module.exports = {
    listShareholders,
    topShareholder,
    listStocks,
    getStockById
}