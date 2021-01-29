const express = require('express')


const connectToMongo = require('./db/mongoose')
connectToMongo()

const auctionRouter = require('./routers/auction')

const app = express()

app.use(express.json())
app.use(auctionRouter)

const port = `${process.env.PORT}` || 3000

app.listen(port, () => {
    console.log('Auction service running on port ' + port)
})