const mongoose   = require('mongoose');
const { nanoid } = require('nanoid');
const md5        = require('md5');
const bcrypt     = require('bcrypt');

module.exports = class SchoolManager { 

    constructor({utils, validators, mongomodels, managers}={}){
        this.utils              = utils;
        this.validators         = validators; 
        this.mongomodels        = mongomodels;
        this.tokenManager       = managers.token;
        this.responseDispatcher = managers.responseDispatcher;
        this.httpExposed        = ['register', 'login', 'get=current', 'get=currentAdmin', 'addAdmin', 'get=admins', 'get=admin', 'delete=deleteAdmin'];
    }

    async register({name, country, city, address, password}) {
        const data = {name, country, city, address, password};

        // Data validation
        let input = await this.validators.school.register(data);
        if(input) return {errors: input};
        
        // Logic
        let result;
        const session = await mongoose.startSession();
        session.startTransaction()

        try {
            const slug = this.utils.slugify(`${name}-${nanoid(6)}`);
            const school = await this.mongomodels.School.create([{name, slug, country, city, address}], {session});
            const schoolId = school[0]._id;
            const schoolSuperAdmin = await this.mongomodels.SchoolAdmin.create([{name, username: slug, password, school: schoolId, isSchoolSuperAdmin: true}], {session});
            await this.mongomodels.School.updateOne({ _id: schoolId}, {$push: {admins: schoolSuperAdmin[0]._id}}, {session});
            await session.commitTransaction();
            result = {username: slug}
        } catch(error) {
            await session.abortTransaction();
            result = {error: error.message || 'Something went wrong'};
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

    async current({__shortToken, __schoolAdmin}) {
        const school = await this.mongomodels.School.findById(__schoolAdmin.school).select('-__v -updatedAt').lean();
        return school;
    }

    async currentAdmin({__shortToken, __schoolAdmin}) {
        const {password, ...schoolAdmin} = __schoolAdmin;
        return schoolAdmin;
    }

    async addAdmin({__shortToken, __schoolAdmin, name, password, res}) {
        const data = {name, password};

        // Data validation
        let input = await this.validators.school.addAdmin(data);
        if(input) return {errors: input};

        // Logic
        const {school, isSchoolSuperAdmin} = __schoolAdmin;
        if (!isSchoolSuperAdmin) this.responseDispatcher.dispatch(res, {ok: false, code:403, errors: 'forbidden'});

        let result;
        const session = await mongoose.startSession();
        session.startTransaction()

        try {
            const slug = this.utils.slugify(`${name}-${nanoid(9)}`);
            const schoolAdmin = await this.mongomodels.SchoolAdmin.create([{name, username: slug, password, school}], {session});
            await this.mongomodels.School.findByIdAndUpdate(school, {$push: {admins: schoolAdmin[0]._id}}, {session});
            await session.commitTransaction();
            result = {username: slug};
        } catch(error) {
            await session.abortTransaction();
            result = {error: error.message || 'Something went wrong'};
        } finally {
            session.endSession();
            return result
        }
    }

    async admin({__shortToken, __schoolAdmin, __query}) {
        // Data validation
        let input = await this.validators.school.admin(__query);
        if(input) return {errors: input};

        // Logic
        const {schoolAdminId} = __query
        const {school} = __schoolAdmin;
        const schoolAdmin = await this.mongomodels.SchoolAdmin.findOne({_id: schoolAdminId, school}).select('-__v -password -updatedAt');
        if(!schoolAdmin) return {error: 'School Admin does not exist'};
        return schoolAdmin
    }

    async admins({__shortToken, __schoolAdmin}) {
        const {school} = __schoolAdmin;
        return await this.mongomodels.SchoolAdmin.find({school}).select('-__v -password -updatedAt');
    }

    async deleteAdmin({__shortToken, __schoolAdmin, schoolAdminId}) {
        const data = {schoolAdminId};

        // Data validation
        let input = await this.validators.school.deleteAdmin(data);
        if(input) return {errors: input};
        
        // Logic
        const {school, isSchoolSuperAdmin} = __schoolAdmin;
        if (!isSchoolSuperAdmin) this.responseDispatcher.dispatch(res, {ok: false, code:403, errors: 'forbidden'});

        let result;
        const session = await mongoose.startSession();
        session.startTransaction()

        try {
            const {deletedCount} = await this.mongomodels.SchoolAdmin.deleteOne({_id: schoolAdminId, school, isSchoolSuperAdmin: false}, {session});
            if (deletedCount === 0) throw new Error('School Admin does not exist');
            await this.mongomodels.School.findByIdAndUpdate(school, {$pull: {admins: schoolAdminId}}, {session});
            await session.commitTransaction();
            result = true;
        } catch(error) {
            await session.abortTransaction();
            result = {error: error.message || 'Something went wrong'};
        } finally {
            session.endSession();
            return result;
        }
    }

    async schoolAdminByIdOrError({schoolAdminId}) {
        const schoolAdmin = await this.mongomodels.SchoolAdmin.findById(schoolAdminId).select('-__v').lean();
        if (!schoolAdmin) return {error: 'School Admin does not exist'};
        return schoolAdmin;
    }

}