const express = require('express')


// Connect to the database.
const connectToMongo = require('./db/mongoose')
connectToMongo()

// Use the route defined in another module to create modularity
const userRouter = require('./routers/user')
const auctionRouter = require('./routers/auction')

const app = express()

// Middleware that accepts incoming req.body as json.
app.use(express.json())
app.use(userRouter)
app.use(auctionRouter)

module.exports = app