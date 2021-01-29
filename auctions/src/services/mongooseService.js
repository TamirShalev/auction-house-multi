class mongooseService {
    /**
   * @description Creates an instance of the MongooseService class
   * @param Model {mongoose.model} Mongoose Model to use for the instance
   */
    constructor(Model) {
        this.model = Model
    }

    /**
     * @description Create and insert an object to the database
     * @param body {object} Body object to create the object with
     * @returns {Promise} Returns the query result
     */
    create (body) {
        return this.model.create(body)
    }

    delete (id) {
        return this.model.findByIdAndDelete(id)
    }

    deleteMany (filter) {
        return this.model.deleteMany(filter)
    }

    findOne (body) {
        return this.model.findOne(body)
    }

    findById (id) {
        return this.model.findById(id)
    }

    find (body) {
        return this.model.find(body)
    }

    findAndSort (filter, sortTerm) {
        return this.model.find(filter).sort(sortTerm)
    }

    findOneAndUpdate (filter, updates, options) {
        if (options.new === true){
            return this.model.findOneAndUpdate(filter, updates, {new: true})
        }
        return this.model.findOneAndUpdate(filter, updates, {new: false})
    }
}

module.exports = mongooseService