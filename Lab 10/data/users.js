const mongoCollections = require('../config/mongoCollections')
let { ObjectId } = require('mongodb')
const users = mongoCollections.users
const bcrypt = require('bcryptjs');

let saltRounds = 10;

// ERROR CHECKING STARTS
    async function typeCheck(username, password) {
        if (!username || !password) throw { code: 400, error: `Username or Password cannot be empty`}
        if (typeof username != "string") throw { code: 400, error: `Username needs to be a string`}
        let myUsername = username.split(" ")
        if (myUsername.length > 1) throw  { code: 400, error: `Username cannot have spaces`}
        if (/[^\w\s]/.test(username)) throw  { code: 400, error: `Username can only be alphanumeric characters`}
        if (username.length < 4) throw { code: 400, error: `Username must be at least 4 characters long`}

        if (typeof password != "string") throw { code: 400, error: `Password needs to be a string`}
        let myPassword = password.split(" ")
        if (myPassword.length > 1) throw  { code: 400, error: `Password cannot have spaces`}
        if (password.length < 6) throw { code: 400, error: `Password must be at least 4 characters long`}
    }
// ERROR CHECKING ENDS

const createUsers = async function createUsers(username, password) {
    await typeCheck(username, password)

    const userDatabase = await users() 

    username = username.toLowerCase()
    let getUser = await userDatabase.findOne({username: username})
    if (getUser) {
        throw { code: 400, error: "Username already exists in the database"}
    }
    hashedPassword = await bcrypt.hash(password, saltRounds)
    let newUser = {
        _id: new ObjectId(),
        username: username,
        password: hashedPassword
    }
    let userInserted = await userDatabase.insertOne(newUser)
    if (userInserted.insertedCount === 0) {
        throw { code: 500, error: `Unable to create new user`}
    }
    
    return {userInserted: true}
}

const checkUser = async function checkUser(username, password) {
    await typeCheck(username, password)

    const userDatabase = await users() 

    username = username.toLowerCase()
    let getUser = await userDatabase.findOne({username: username})
    if (!getUser) {
        throw {code: 400, error: `Either the username or password is invalid`}
    }

    let passMatch = await bcrypt.compare(password, getUser.password) 
    // console.log(passMatch)
    if (!passMatch) {
        throw {code: 400, error: `Either the username or password is invalid`}
    } 
    return {authenticated: true}
}
module.exports = {
    createUsers,
    checkUser
}