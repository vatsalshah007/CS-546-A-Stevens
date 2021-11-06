const express = require('express');
const router = express.Router();
const { restaurants, reviews } = require('../data/index')
const { ObjectId } = require('bson');


// ERROR CHECKING FUNCTIONS START
const restaurantIdCheck = async (id) => {
    await idIsValid(id)
    let restaurantExists = await restaurants.get(id)
    if (!restaurantExists) {
        res.status(404).json(`No such restaurant with the id:- ${req.params.id}`)
        return
    }
}
const typecheckCreate = async (title, reviewer, rating, dateOfReview, review) => {
    if (!title || !reviewer || !rating || !dateOfReview || !review) {
        throw "Please provide all the input fields"
    }
    if (typeof title !== "string") throw "Title needs to be a string"
    if (title.trim().length === 0) {
        throw `Title cannot be just empty spaces`
    }
    if (typeof reviewer !== "string") throw "reviewer needs to be a string"
    if (reviewer.trim().length === 0) {
        throw `reviewer cannot be just empty spaces`
    }
    if (typeof rating !== "number" || rating == NaN){ // Rating
        throw "Rating needs to be a number"
    } else if (rating < 1 || rating > 5) {
        throw `Rating needs to be between 1 and 5`
    }
    await dateCheck(dateOfReview)
    if (typeof title !== "string") throw "Review needs to be a string"
    if (review.trim().length === 0){
       throw "Review cannot be just empty spaces"
    }   
}

const dateCheck = async(dateOfReview) => {
    let todaysDate = new Date()
    let inputDate = dateOfReview.split('/')
    if (inputDate[0] != (todaysDate.getMonth())+1 || inputDate[1] != todaysDate.getDate() || inputDate[2] != todaysDate.getFullYear()) {
        throw `Please provide today's date in the following format mm/dd/yyyy`        
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
// ERROR CHECKING FUNCTIONS ENDS


// POST /reviews/{restaurantId}
router.post('/:id', async (req, res) => {    
    try {
        await restaurantIdCheck(req.params.id)

        const reviewData = req.body
        const { title, reviewer, rating, dateOfReview, review } = reviewData
        await typecheckCreate(title, reviewer, rating, dateOfReview, review)
        
        const createReview = await reviews.create(req.params.id, title, reviewer, rating, dateOfReview, review);
        res.json(createReview)
    } catch (e) {
        if (e.code) {
            res.status(e.code).json(e.error)
        } else {
            res.status(400).json(e)            
        }
    }
})

// GET /reviews/{restaurantId}
router.get('/:id', async (req, res) => {
    try {
        await restaurantIdCheck(req.params.id)

        const getAllReviewsByRestaurantId = await reviews.getAll(req.params.id)
        res.json(getAllReviewsByRestaurantId)
    } catch (e) {
        if (e.code) {
            res.status(e.code).json(e.error)
        } else {
            res.status(400).json(e)            
        }
    }
})


// GET /reviews/review/{reviewId)
router.get('/review/:id', async (req, res) => {
    try {
        await idIsValid(req.params.id)

        const getReview = await reviews.get(req.params.id)
        res.json(getReview)
    } catch (e) {
        if (e.code) {
            res.status(e.code).json(e.error)
        } else {
            res.status(400).json(e)            
        }
    }
})

// Delete /reviews/{reviewId)
router.delete('/:id', async (req, res) => {
    try {        
        await idIsValid(req.params.id)

        const deleteReview = await reviews.remove(req.params.id)
        res.json(deleteReview)
    } catch (e) {
        if (e.code) {
            res.status(e.code).json(e)
        } else {
            res.status(400).json(e)
        }
    }
})

module.exports = router;
