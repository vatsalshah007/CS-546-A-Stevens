const { default: axios } = require("axios")

async function getStocks() {
    const { data } = await axios.get('https://gist.githubusercontent.com/graffixnyc/8c363d85e61863ac044097c0d199dbcc/raw/7d79752a9342ac97e4953bce23db0388a39642bf/stocks.json')
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
}

const getStockById = async function getStockById(id) {
    await idCheck(id)
    
    let stocksData = await getStocks()
    let result
    stocksData.forEach(x => {
                if (x.id == id) {
                    result = x
            }
    });
    if (!result) throw "stock not found"
    return result
}

const getAll = async function getAll() {
    if (arguments.length > 0 || arguments === null) {
        throw `This get function does not take in any arguments.`
    }
    let stocksData = await getStocks()
    return stocksData 
}

module.exports = {
    getStockById,
    getAll,
}