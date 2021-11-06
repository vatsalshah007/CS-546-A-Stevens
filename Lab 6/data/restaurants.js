const mongoCollections = require('../config/mongoCollections')
let { ObjectId } = require('mongodb')
const { reviews } = require('.')
const restaurants = mongoCollections.restaurants

// ERROR CHECKING FUNCTIONS START
const typecheckCreate = async (name, location, phoneNumber, website, priceRange, cuisines, serviceOptions) => {
    if (!name || !location || !phoneNumber || !website || !priceRange || !cuisines || !serviceOptions) {
        throw "Please provide all the input fields"
    }
    if (typeof name !== "string") throw "Name needs to be a string"
    if (name.trim().length === 0) {
        throw `Name cannot be just empty spaces`
    }
    if (typeof location !== "string") throw "Location needs to be a string"
    if (location.trim().length === 0) {
        throw `Location cannot be just empty spaces`
    }
    if (typeof phoneNumber !== "string"){ // PHONE NUMBER
        throw "Phone Number needs to be a string"
    } else {
        if (phoneNumber.trim().length === 0) {
        throw `Phone Number cannot be just empty spaces`
        }
        phoneNumArr = phoneNumber.split('-')
        if (phoneNumArr.length !== 3) {
            throw `Please provide a valid phone number`
        } else {
            phoneNumArr.forEach(x =>{
                if (x.length !== 3 && (x == phoneNumArr[0] || x == phoneNumArr[1])) {
                    throw `Please provide the phone number in the format xxx-xxx-xxxx`
                } else if(x == phoneNumArr[2] && x.length !== 4){
                    throw `Please provide the phone number in the format xxx-xxx-xxxx`
                } else if (!(/[0-9]+$/).test(x)) {
                    throw `It is a phone number, please enter numbers in the form of a string in xxx-xxx-xxxx format`
                }
            })
        }
    }
    await websiteCheck(website)
    if (typeof priceRange !== "string") throw "Price Range needs to be a string"
    if (priceRange.trim().length === 0) {
        throw `Price Range cannot be just empty spaces`
    }
    priceArr = priceRange.split('') // PRICE RANGE
    if (priceArr.length < 1 || priceArr.length > 4) {
        throw `Price range needs to be between "$" and "$$$$"`
    } else {
        priceArr.forEach(x => {
            if (x !== "$") {
                throw "Please provide valid price range only in terms of '$', between  '$' and '$$$$'"
            }
        });
    }
    if (!Array.isArray(cuisines)) { // CUISINES
        throw `Cuisines needs to be in Array format`
    } else if (cuisines.length < 1) {
        throw `Please provide at least one Cuisine`
    } else {
        cuisines.forEach(x => {
            if (typeof x !== "string") {
                throw `Every type of cuisine needs to be in the String format`
            } else if (x.trim().length === 0) {
                throw `You cannot enter the name of cuisines as empty spaces`
            }
        });
    }
    if (typeof serviceOptions !== "object" || Array.isArray(serviceOptions)) { //SERVICE OPTIONS
        throw `Service Options is an Object. Please define the options in terms of an Object`
    } else {
        serviceOptionsArr = Object.keys(serviceOptions)
        if (serviceOptionsArr.length > 3) {
            throw `There are only 3 type of service options, dineIn, takeOut and delivery`
        } else if (!serviceOptionsArr[0] || !serviceOptionsArr[1] || !serviceOptionsArr[2]) {
            throw `Please define the different service types, i.e. dineIn, takeOut, delivery`
        } else if (!("dineIn" in serviceOptions) || !("takeOut" in serviceOptions) || !("delivery" in serviceOptions)) {
            throw `Service options can only be dineIn, takeOut and delivery`
        } else if (typeof serviceOptions[serviceOptionsArr[0]] !== "boolean" || typeof serviceOptions[serviceOptionsArr[1]] !== "boolean" || 
                    typeof serviceOptions[serviceOptionsArr[2]] !== "boolean") {
            throw `All 3 service options needs to be of the type boolean, i.e true or false`
        }
    }
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
    if (!ObjectId.isValid(id)) {
        throw `Please provide a valid ObjectId`
    }
}

const websiteCheck = async (website) => {
    if (!website) {
        throw `Please provide the new website`
    } 
    if (typeof website !== "string") {
        throw `Website needs to be a string`
    } else if (website.trim().length === 0) {
        throw `Website cannot be empty spaces`
    }
    website = website.toLowerCase()
    websiteArr = website.split('.')
    if (websiteArr.length !== 3) {
        throw `Please enter a valid website URL`
    }
    if (!(websiteArr[0] === "http://www" || websiteArr[0] === "https://www") || websiteArr[2] !== "com") {
        throw `${website} isn't a valid URL`
    } 
    if (websiteArr[1].length < 5 || websiteArr[1].trim().length === 0) {
        throw `Website name in the URL needs to be at least 5 characters`
    }
    if ((/[!@#$%^&*()_+=\[\]{}; ':"\\|,.<>\/?]/g).test(websiteArr[1])) {
        throw `Please enter a valid domian name for the URL`
    }
}
// ERROR CHECKING FUNCTIONS ENDS


const create = async function create(name, location, phoneNumber, website, priceRange, cuisines, serviceOptions){
    await typecheckCreate(name, location, phoneNumber, website, priceRange, cuisines, serviceOptions)

    website = website.toLowerCase()
    let result
    let restaurantsCollection = await restaurants()
    let newRestaurant = {
        name: name,
        location: location,
        phoneNumber: phoneNumber,
        website: website,
        priceRange: priceRange,
        cuisines: cuisines,
        overallRating: 0,
        serviceOptions: serviceOptions,
        reviews: []
    }

    const insertRestaurant = await restaurantsCollection.insertOne(newRestaurant)
    if (insertRestaurant.insertedCount === 0) {
        throw {code: 500, error: `Unable to add the restaurant`}
    }

    let newRestaurantId = insertRestaurant.insertedId
    result = await restaurantsCollection.findOne({_id: newRestaurantId}) 
    if (!result) {
        throw {code: 404, error: `No such restaurant with the id:- ${id}`}
    }
    result._id = result._id.toString()

    return result
}

const getAll = async function getAll() {
    if (arguments.length > 0 || arguments === null) {
        throw {code: 400, error: `This get function does not take in any argument.`}
    }
    let restaurantsCollection = await restaurants()

    let restaurantList = await restaurantsCollection.find({}, {projection: {_id: 1, name: 1}}).toArray()
    if (restaurantList.length === 0) {
        throw {code: 404, error: `No restaurants in the Database`}
    }
    restaurantList.forEach(x => {
        x._id = x._id.toString()
    });

    return restaurantList    
}

const get = async function get(id) { 
    await idCheck(id)
    
    let restaurantsCollection = await restaurants()

    let result = await restaurantsCollection.findOne({_id: ObjectId(id)})
    if (!result) {
        throw {code: 404, error: `No such restaurant with the id:- ${id}`}
    }
    result._id = result._id.toString()

    return result
}
const remove = async function remove(id) {
    await idCheck(id)

    let restaurantsCollection = await restaurants()
    
    let result = await restaurantsCollection.findOne({_id: ObjectId(id)})
    if (!result) {
        throw {code: 404, error: `No such restaurant with the id:- ${id}`}
    }
    restaurantName = result.name
    
    result = await restaurantsCollection.deleteOne({_id: ObjectId(id)})
    if (result.deletedCount === 0) {
        throw {code: 500, error: `unable to delete the restaurant`}
    }
    let deletionOutput = {
        restaurantId: id,
        deleted: true
    }

    return deletionOutput 
}

const update = async function update(id, name, location, phoneNumber, website, priceRange, cuisines, serviceOptions) {
    await idCheck(id)
    await typecheckCreate(name, location, phoneNumber, website, priceRange, cuisines, serviceOptions)

    let restaurantsCollection = await restaurants()
    let result = await restaurantsCollection.findOne({_id: ObjectId(id)})
    if (!result) {
        throw {code: 404, error: `No such restaurant with the id :- ${id}`}
    }

    if (result.name == name && result.location == location && result.phoneNumber == phoneNumber && result.website == website &&
        result.priceRange == priceRange && result.serviceOptions.dineIn == serviceOptions.dineIn && result.serviceOptions.takeOut == serviceOptions.takeOut && 
        result.serviceOptions.delivery == serviceOptions.delivery) {
            if (cuisines.forEach((x, i) => x == result.cuisines[i])) {
                throw {code: 400, error: `No new values to update. Please provide at least 1 new value to update`}
            }
    }

    let overallRating = result.overallRating
    let reviews = result.reviews

    let updatedRestaurantData = {
        name: name,
        location: location,
        phoneNumber: phoneNumber,
        website: website,
        priceRange: priceRange,
        cuisines: cuisines,
        overallRating: overallRating,
        serviceOptions: serviceOptions,
        reviews: reviews
    }

    let updatedRestaurant = await restaurantsCollection.updateOne({_id: ObjectId(id)}, {$set: updatedRestaurantData})
    if (updatedRestaurant.modifiedCount === 0) {
        throw {code: 500, error: `Unable to update data of the restaurant`}
    }

    updatedRestaurant = await restaurantsCollection.findOne({_id: ObjectId(id)})
    if (!updatedRestaurant) {
        throw {code: 404, error: `No such restaurant with the id :- ${id}`}
    }
    
    updatedRestaurant._id = updatedRestaurant._id.toString()
    return updatedRestaurant
}
module.exports = {
    create,
    getAll,
    get,
    remove,
    update
}