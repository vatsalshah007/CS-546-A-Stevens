const mongoCollections = require('../config/mongoCollections')
let { ObjectId } = require('mongodb')
const restaurants = mongoCollections.restaurants
const restaurantData = require('./restaurants')


// ERROR CHECKING FUNCTIONS START
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
// ERROR CHECKING FUNCTIONS ENDS


// UPDATE THE OVERALL RATING
const updateOverallRating = async (restaurantWithReview) => {
    let ratingsSum = 0
    if (restaurantWithReview.reviews.length === 0) {
        return ratingsSum
        // result = await restaurantsCollection.updateOne({_id: ObjectId(restaurantId)}, {$set: {overallRating: 0}})
    } else {
        restaurantWithReview.reviews.forEach(x => {
            ratingsSum = ratingsSum + x.rating
        })
        let ratingAvg = ratingsSum/(restaurantWithReview.reviews.length)
        return ratingAvg
    }
    
}


const create = async function create(restaurantId, title, reviewer, rating, dateOfReview, review) {
    await idCheck(restaurantId)
    await typecheckCreate(title, reviewer, rating, dateOfReview, review)

    let restaurantsCollection = await restaurants()
    let reviewData = {
        _id: new ObjectId(),
        title: title,
        reviewer: reviewer,
        rating: rating,
        dateOfReview: dateOfReview,
        review: review
    }


    let restaurantWithoutReview = await restaurantData.get(restaurantId)
    if (!restaurantWithoutReview) {
        throw {code: 404, error: `No such restaurant exists to add any reviews`}
    }
    
    let result = await restaurantsCollection.updateOne({_id: ObjectId(restaurantId)}, {$addToSet: {reviews: reviewData}})
    if (result.modifiedCount === 0) {
        throw {code: 500, error: `Unable to add the review to the restaurant`} 
    }
    let restaurantWithReview = await restaurantData.get(restaurantId)
    if (!restaurantWithReview) {
        throw {code: 404, error: `Unable to get the restaurant after adding the review`}
    }

    //Updating Rating
    let updatedOverallRating = await updateOverallRating(restaurantWithReview)
    if (updatedOverallRating === 0) {
        result = await restaurantsCollection.updateOne({_id: ObjectId(restaurantId)}, {$set: {overallRating: updatedOverallRating}})
        if (result.modifiedCount === 0) {
            throw {code: 500, error: `Unable to update the overallRating of the restaurant`} 
        }
    } else if (updatedOverallRating !== rating || restaurantWithReview.reviews.length === 1) {
        result = await restaurantsCollection.updateOne({_id: ObjectId(restaurantId)}, {$set: {overallRating: updatedOverallRating}})
        if (result.modifiedCount === 0) {
            throw {code: 500, error: `Unable to update the overallRating of the restaurant`} 
        }
    }

    restaurantWithReview = await restaurantData.get(restaurantId)
    if (!restaurantWithReview) {
        throw {code: 404, error: `Unable to get the restaurant after updating the Overall Rating`}
    }
    restaurantWithReview._id = restaurantWithReview._id.toString()
    restaurantWithReview.reviews.forEach(x => {
        x._id = x._id.toString()
    });
    return restaurantWithReview
}

const getAll = async function getAll(restaurantId) {
    await idCheck(restaurantId)

    restaurantWithReview = await restaurantData.get(restaurantId)
    if (!restaurantWithReview) {
        throw {code: 404, error: `No such restaurant exists with the id ${restaurantId} to display any reviews`}
    }

    if (restaurantWithReview.reviews.length === 0) {
        throw {code: 404, error: `There are no reviews for the restaurant with id ${restaurantId}`}
    }
    restaurantWithReview.reviews.forEach(x => {
        x._id = x._id.toString()
    });

    return restaurantWithReview.reviews

}

const get = async function get(reviewId) {
    await idCheck(reviewId)
    let flag1 = false, review
    let restaurantsCollection = await restaurants()
    let restaurantsList = await restaurantsCollection.find({}).toArray()
    
    restaurantsList.forEach(x => {
        x.reviews.forEach(y => {
            if (y._id.toString() === reviewId) {
                flag1 = true
                review = y
                review._id = review._id.toString()
            }
        })
    })
    if (flag1 === false) {
        throw {code: 404, error: `Review Not Found`}
    }
    return review
}

const remove = async function remove(reviewId) {
    await idCheck(reviewId)

    let restaurantsCollection = await restaurants()
    let restaurantsList = await restaurantsCollection.find({}).toArray()
    let deletedReviewId, deleted, restaurantId
    for (const x of restaurantsList) {
        for (const y of x.reviews) {
            if (y._id.toString() === reviewId) {
                let result = await restaurantsCollection.updateMany({}, {$pull: {reviews: {_id: ObjectId(reviewId)}}})
                if (result.modifiedCount === 0) {
                    throw `Unable to delete the review with id ${reviewId}`
                }
                deletedReviewId = reviewId
                deleted = true
                restaurantId = x._id.toString()
            }
        }
    }
    if (deleted === false) {
        throw `No review with that id:${reviewId}`
    }
    let deletionOutput = {
        reviewId: deletedReviewId,
        deleted: deleted
    }
    if (deleted === true) {
        //Updating Rating
        let restaurantWithReview = await restaurantData.get(restaurantId)
        if (!restaurantWithReview) {
            throw `Unable to get the restaurant after removing the review`
        }
        let updatedOverallRating = await updateOverallRating(restaurantWithReview)
        if (updatedOverallRating === 0) {
            result = await restaurantsCollection.updateOne({_id: ObjectId(restaurantId)}, {$set: {overallRating: updatedOverallRating}})
            if (result.modifiedCount === 0) {
                throw `Unable to update the overallRating of the restaurant`
            }
        } else {
            result = await restaurantsCollection.updateOne({_id: ObjectId(restaurantId)}, {$set: {overallRating: updatedOverallRating}})
            if (result.modifiedCount === 0) {
                throw `Unable to update the overallRating of the restaurant`
            }
        }
    }

    return deletionOutput
}

module.exports = {
    create,
    getAll,
    get,
    remove
}