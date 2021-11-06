const { ObjectId } = require('bson');
const express = require('express');
const res = require('express/lib/response');
const router = express.Router();
const { restaurants } = require('../data/index')


// ERROR CHECKING STARTS
const restaurantIdCheck = async (id) => {
    await idIsValid(id)
    let restaurantExists = await restaurants.get(id)
    if (!restaurantExists) {
        res.status(404).json(`No such restaurant with the id:- ${req.params.id}`)
        return
    }
}
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

const idIsValid = async (id) => {
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
// ERROR CHECKING STOPS

router.get('/:id', async (req, res) => {
    try {
        await restaurantIdCheck(req.params.id)
        
        const getRestaurantById = await restaurants.get(req.params.id);
        res.json(getRestaurantById);
    } catch (e) {
        if (e.code) {
            res.status(e.code).json(e.error);
        } else {
            res.status(400).json(e)
        }
    }
});

router.post('/', async (req, res) => {
    try {
        const restuarantData = req.body
        const { name, location, phoneNumber, website, priceRange, cuisines, serviceOptions } = restuarantData
        await typecheckCreate(name, location, phoneNumber, website, priceRange, cuisines, serviceOptions)

        const createRestaurant = await restaurants.create(name, location, phoneNumber, website, priceRange, cuisines, serviceOptions);
        res.json(createRestaurant)
    } catch (e) {
        if (e.code) {
            res.status(e.code).json(e.error)
        } else {
            res.status(400).json(e)          
        }
    }
})

router.get('/', async (req, res) => {
    try {
      const restaurantList = await restaurants.getAll();
      res.json(restaurantList);
    } catch (e) {
        if (e.code) {
            res.status(e.code).json(e.error)
        } else {
            res.status(400).json(e)          
        }
    }
});

router.put('/:id', async (req, res) => {
    try {
        await restaurantIdCheck(req.params.id)

        let restaurantUpdationFields = req.body
        let { name, location, phoneNumber, website, priceRange, cuisines, serviceOptions } = restaurantUpdationFields
        await typecheckCreate(name, location, phoneNumber, website, priceRange, cuisines, serviceOptions)

        const updateRestaurant = await restaurants.update(req.params.id, name, location, phoneNumber, website, priceRange, cuisines, serviceOptions)
        res.json(updateRestaurant)
    } catch (e) {
        if (e.code) {
            res.status(e.code).json(e.error)
        } else {
            res.status(400).json(e)          
        }
    }
})

router.delete('/:id', async (req, res) => {
    try {
        await restaurantIdCheck(req.params.id)
        
        const deleteRestaurant = await restaurants.remove(req.params.id)
        res.json(deleteRestaurant)
    } catch (e) {
        if (e.code) {
            res.status(e.code).json(e.error)
        } else {
            res.status(400).json(e)          
        }
    }
})



module.exports = router;
