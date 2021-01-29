const mongoose = require("mongoose")

const connectToMongo = () => {
    mongoose.connect(`${process.env.MONGODB_URL}`, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
}

module.exports = connectToMongo
