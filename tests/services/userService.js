const User = require('../models/user')
const jwt = require('jsonwebtoken')
const mongooseService = require('./mongooseService')

class userService {

    /**
     * @description Creates an instance of userService
     */
    constructor() {
        // Create instance of DAL
        this.mongooseServiceInstance = new mongooseService( User )
    }

    /**
     * @description Creates a user document
     * @param {object} body Body object to create the document
     * @returns {Promise} Returns success status and the object/error depends on success or not
     */
    async create(body) {
        try {
            const result = await this.mongooseServiceInstance.create(body)
            return {success: true, user: result}
        } catch (e) {
            return {success: false, error: e}
        }
    }

    async findOne (body) {
        try {
            const result = await this.mongooseServiceInstance.findOne(body)
            return {success: true, user: result}
        } catch (e) {
            return {success: false, error: e}
        }
    }

    async findById (id) {
        try {
            const result = await this.mongooseServiceInstance.findById(id)
            return {success: true, user: result}
        } catch (e) {
            return {success: false, error: e}
        }
    }

    async save(user) {
        try {
            await user.save()
            return {success: true}
        } catch (e) {
            return {success: false, error: e}
        }
    }

    async remove(user) {
        try {
            await user.remove()
            return {success: true}
        } catch (e) {
            return {success: false, error: e}
        }
    }

    async deleteMany (filter) {
        try {
            const result = await this.mongooseServiceInstance.deleteMany(filter)
            return {success: true, user: result}
        } catch (e) {
            return {success: false, error: e}
        }
    }

    async findOneAndUpdate (filter, updates, options) {
        try {
            const result = await this.mongooseServiceInstance.findOneAndUpdate(filter, updates, options)
            return {success: true, user: result}
        } catch (e) {
            return {success: false, error: e}
        }
    }

    /**
     * @description Creates a token for user
     * @param {object} user User object to create the token for
     * @returns {Promise} Returns the token created
     */
    async generateAuthToken(user) {
        const token = await user.generateAuthToken()
        return token
    }

    /**
     * @description Find user by emaila and password
     * @returns {Promise} Returns the user if found
     */
    async findByEmailAndPassword (email, password) {
        const user = await User.findByEmailAndPassword(email, password)
        return user
    }
}

module.exports = userService