const mongoose = require('mongoose')


const auctionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (value.length > 40) {
                throw new Error('Title should contain 40 characters at most.')
            }
        }
    },
    description: {
        type: String,
        trim: true,
        validate(value) {
            if (value.length > 300) {
                throw new Error('Title should contain 40 characters at most.')
            }
        }
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    best_offer: {
        type: Number,
        required: true,
        validate (value) {
            if (value < 0) {
                throw new Error('Highest offer must be positive!')
            }
        }
    },
    highest_bidder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

const Auction = mongoose.model('Auction', auctionSchema)

module.exports = Auction