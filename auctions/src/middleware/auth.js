const jwt = require('jsonwebtoken')
const userserv = require('../services/userService')
const userService = new userserv()

// Middleware function that will be called before route handlers.
// Checks for authentication.
// next() must be called at the end to allow next handlers to run.
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, `${process.env.SECRET}`)
        // const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
        const {success, user, error} = await userService.findOne({_id: decoded._id, 'tokens.token':token })
    
        if (!user) {
            throw new Error('Authentication failed')
        }
    
        req.user = user
        req.token = token
        next()
    } catch (e) {
        res.status(401).send({error: 'Please authenticate.'})
    }
    
}

module.exports = auth