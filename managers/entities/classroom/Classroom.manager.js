
module.exports = class StudentManager { 

    constructor({utils, validators, mongomodels, managers}={}){
        this.utils              = utils;
        this.validators         = validators; 
        this.mongomodels        = mongomodels;
        this.tokenManager       = managers.token;
        this.responseDispatcher = managers.responseDispatcher;
        this.httpExposed        = ['add'];
    }

    async add({__shortToken, __schoolAdmin, name, code}) {
        const data = {name, code};

        // Data validation
        let input = await this.validators.classroom.add(data);
        if(input) return {errors: input};
        
        // Logic
        const {school} = __schoolAdmin;
        let classroom =  await this.mongomodels.Classroom.findOne({code, school});
        if(classroom) return{error: `Classroom with code ${code} already exists`}
        return await this.mongomodels.Classroom.create({...data, school});
    }

}