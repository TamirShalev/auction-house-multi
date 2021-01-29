const User = require('../models/user')
const Auction = require('../models/auction')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const userserv = require('../services/userService')
const auctionserv = require('../services/auctionService')
const userService = new userserv()
const auctionService = new auctionserv()


const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: "userone",
    age: 27,
    email: "userone@example.com",
    password: "userone123",
    tokens: [{
        token: jwt.sign({ _id: userOneId }, `${process.env.SECRET}`)
    }]
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    name: "usertwo",
    age: 27,
    email: "usertwo@example.com",
    password: "usertwo123",
    tokens: [{
        token: jwt.sign({ _id: userTwoId }, `${process.env.SECRET}`)
    }]
}

const auctionOne = {
    _id: new mongoose.Types.ObjectId(),
    title: 'Broom',
    description: 'Helps keep your house clean!',
    best_offer: 20,
    owner: userOneId
}

const auctionTwo = {
    _id: new mongoose.Types.ObjectId(),
    title: 'PS4',
    description: 'Great to pass the time in the quaranteen.',
    best_offer: 20,
    owner: userOneId
}

const auctionThree = {
    _id: new mongoose.Types.ObjectId(),
    title: 'Fujitsu laptop',
    description: 'Awesome performance',
    best_offer: 20,
    owner: userTwoId
}

const setupDatabase = async () => {
    await userService.deleteMany()
    await auctionService.deleteMany()
    await userService.create(userOne)
    await userService.create(userTwo)
    await auctionService.create(auctionOne)
    await auctionService.create(auctionTwo)
    await auctionService.create(auctionThree)
}

module.exports = {
    userService,
    auctionService,
    userOneId,
    userOne,
    userTwoId, 
    userTwo,
    auctionOne,
    auctionTwo,
    auctionThree,
    setupDatabase
}