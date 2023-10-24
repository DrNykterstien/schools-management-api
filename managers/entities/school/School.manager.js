const mongoose   = require('mongoose');
const { nanoid } = require('nanoid');
const md5        = require('md5');
const bcrypt     = require('bcrypt');

module.exports = class SchoolManager { 

    constructor({utils, validators, mongomodels, managers}={}){
        this.utils        = utils;
        this.validators   = validators; 
        this.mongomodels  = mongomodels;
        this.tokenManager = managers.token;
        this.httpExposed  = ['register', 'login'];
    }

    async register({name, country, city, address, password}) {
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

    async login({__device, username, password}) {
        const data = {username, password};

        // Data validation
        let input = await this.validators.school.login(data);
        if(input) return {errors: input};

        // Logic
        const schoolAdmin = await this.mongomodels.SchoolAdmin.findOne({username}).select('-__v -updatedAt').lean();
        if (!schoolAdmin) return {error: 'Incorrect email or password'};
        
        const isMatched = await bcrypt.compare(password, schoolAdmin.password);
        if (!isMatched) return {error: 'Incorrect email or password'};

        const tokenData = {userId: schoolAdmin._id, userKey: schoolAdmin.username, sessionId: nanoid(), deviceId: md5(__device)};
        const longToken = this.tokenManager.genLongToken(tokenData);
        const shortToken = this.tokenManager.genShortToken(tokenData);
        const {password: _, ...result} = schoolAdmin;
        
        return {shortToken, longToken, user: result};
    }

}