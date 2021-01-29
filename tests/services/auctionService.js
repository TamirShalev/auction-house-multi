const Auction = require('../models/auction')
const jwt = require('jsonwebtoken')
const mongooseService = require('./mongooseService')

class auctionService {

    /**
     * @description Creates an instance of userService
     */
    constructor() {
        // Create instance of DAL
        this.mongooseServiceInstance = new mongooseService( Auction )
    }

    /**
     * @description Creates a user document
     * @param {object} body Body object to create the document
     * @returns {Promise} Returns success status and the object/error depends on success or not
     */
    async create(body) {
        try {
            const result = await this.mongooseServiceInstance.create(body)
            return {success: true, auction: result}
        } catch (e) {
            return {success: false, error: e}
        }
    }

    async findOne (body) {
        try {
            const result = await this.mongooseServiceInstance.findOne(body)
            return {success: true, auction: result}
        } catch (e) {
            return {success: false, error: e}
        }
    }

    async findById (id) {
        try {
            const result = await this.mongooseServiceInstance.findById(id)
            return {success: true, auction: result}
        } catch (e) {
            return {success: false, error: e}
        }
    }

    async find (body) {
        try {
            const result = await this.mongooseServiceInstance.find(body)
            return {success: true, auctions: result}
        } catch (e) {
            return {success: false, error: e}
        }
    }

    async findAndSort (searchTerm, sortTerm) {
        try {
            const filter = {title: {$regex : new RegExp(searchTerm, "i")}}
            const result = await this.mongooseServiceInstance.findAndSort(filter, sortTerm)
            return {success: true, auctions: result}
        } catch (e) {
            return {success: false, error: e}
        }
    }

    async findOneAndUpdate (filter, updates, options) {
        try {
            const result = await this.mongooseServiceInstance.findOneAndUpdate(filter, updates, options)
            return {success: true, updatedAuction: result}
        } catch (e) {
            return {success: false, error: e}
        } 
    }

    async sort (query, sortTerms) {
        const result = await query.sort(sortTerms)
        return result
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

    
}

module.exports = auctionService