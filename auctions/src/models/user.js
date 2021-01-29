const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const Auction = require('./auction')


// Define a schema, later to be created as a model
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        required: true,
        validate(value) {
            if (value<0) {
                throw new Error('Age must be a non-negative number!')
            }
        }
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Please insert a valid email address.')
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (value.length < 8) {
                throw new Error('Password must contain at least 8 characters.')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})

userSchema.virtual('auctions', {
    ref: 'Auction',
    localField: '_id',
    foreignField: 'owner'
})

// We can define instance methods on schemas.
// Use normal function and not arrow so we can access 'this'
userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, `${process.env.SECRET}`)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

userSchema.statics.findByEmailAndPassword = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Unable to log in')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Unable to log in')
    }

    return user
}

// When we send the user back on 'app.send()', behind the scenes the user object
// gets called by JSON.stringify(). Whenever an object gets called by this function
// we can define 'toJSON' function that can manipulate the object and return whatever we want. 
userSchema.methods.toJSON = function () { 
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

// Encrypt password before saving
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

// Delete all user related auctions when removed
userSchema.pre('remove', async function (next) {
    const user = this
    await Auction.deleteMany({owner: user._id})
    next()
})


// Create a model using the defined schema.
const User = mongoose.model('User', userSchema)

module.exports = User