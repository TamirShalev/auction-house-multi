const express = require('express')


// Connect to the database.
const connectToMongo = require('./db/mongoose')
connectToMongo()

const userRouter = require('./routers/user')

const app = express()

app.use(express.json())
app.use(userRouter)

const port = `${process.env.PORT}` || 3000

app.listen(port, () => {
    console.log('User service running on port ' + port)
})