const mongoose   = require('mongoose');
const { nanoid } = require('nanoid');
const { slugify } = require('../../../libs/utils');

module.exports = class SchoolManager { 

    constructor({utils, validators, mongomodels}={}){
        this.utils        = utils;
        this.validators   = validators; 
        this.mongomodels  = mongomodels;
        this.httpExposed  = ['register'];
    }

    async register({name, country, city, address, password}){
        const data = {name, country, city, address, password};

        // Data validation
        let input = await this.validators.school.register(data);
        if(input) return {errors: input};
        
        // Logic
        let slug, result;
        const session = await mongoose.startSession();
        session.startTransaction()

        try {
            slug = this.utils.slugify(`${name}-${nanoid(6)}`);
            const school = await this.mongomodels.School.create([{name, slug, country, city, address}], {session});
            const schoolId = school[0]._id;
            const schoolSuperAdmin = await this.mongomodels.SchoolAdmin.create([{name, username: slug, password, school: schoolId, isSchoolSuperAdmin: true}], {session});
            await this.mongomodels.School.updateOne({ _id: schoolId}, {$push: {admins: schoolSuperAdmin[0]._id}}, {session});
            await session.commitTransaction();
            result = {username: slug}
        } catch(error) {
            await session.abortTransaction();
            result = {error: error.message || 'Something went wrong'}
        } finally {
            session.endSession();
            return result
        }
    }

}