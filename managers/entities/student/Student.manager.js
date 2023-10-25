const mongoose   = require('mongoose');
const { nanoid } = require('nanoid');
const md5        = require('md5');
const bcrypt     = require('bcrypt');

module.exports = class ClassroomManager { 

    constructor({utils, validators, mongomodels, managers}={}){
        this.utils              = utils;
        this.validators         = validators; 
        this.mongomodels        = mongomodels;
        this.tokenManager       = managers.token;
        this.responseDispatcher = managers.responseDispatcher;
        this.httpExposed        = ['add', 'delete=delete', 'login'];
    }

    async add({__shortToken, __schoolAdmin, name, classroomId, password}) {
        const data = {name, classroomId, password};

        // Data validation
        let input = await this.validators.student.add(data);
        if(input) return {errors: input};
        
        // Logic
        const {school} = __schoolAdmin;

        let result;
        const session = await mongoose.startSession();
        session.startTransaction()

        try {
            let classroom =  await this.mongomodels.Classroom.findOne({_id: classroomId, school});
            if(!classroom) throw new Error('Classroom does not exist');

            const slug = this.utils.slugify(`${name}-${nanoid(9)}-s`);
            const student = await this.mongomodels.Student.create([{name, username: slug, password, school, classroom: classroomId}], {session});
            await this.mongomodels.Classroom.findByIdAndUpdate(classroomId, {$push: {students: student[0]._id}}, {session});
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

    async delete({__shortToken, __schoolAdmin, studentId}) {
        const data = {studentId};

        // Data validation
        let input = await this.validators.student.delete(data);
        if(input) return {errors: input};
        
        // Logic
        const {school} = __schoolAdmin;

        let result;
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const student = await this.mongomodels.Student.findOne({_id: studentId, school});
            if (!student) throw new Error('Student does not exist');
            await this.mongomodels.Student.deleteOne({_id: studentId, school}, {session});
            await this.mongomodels.Classroom.findByIdAndUpdate(student.classroom, {$pull: {students: studentId}}, {session});
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

    async login({__device, username, password}) {
        const data = {username, password};

        // Data validation
        let input = await this.validators.student.login(data);
        if(input) return {errors: input};

        // Logic
        const student = await this.mongomodels.Student.findOne({username}).select('-__v -updatedAt').lean();
        if (!student) return {error: 'Incorrect email or password'};
        
        const isMatched = await bcrypt.compare(password, student.password);
        if (!isMatched) return {error: 'Incorrect email or password'};

        const tokenData = {userId: student._id, userKey: 'Student', sessionId: nanoid(), deviceId: md5(__device)};
        const longToken = this.tokenManager.genLongToken(tokenData);
        const shortToken = this.tokenManager.genShortToken(tokenData);
        const {password: _, ...result} = student;
        
        return {shortToken, longToken, user: result};
    }
}