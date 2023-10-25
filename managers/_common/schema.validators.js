const mongoose = require("mongoose");

module.exports = {
    'username': (data)=>{
        if(data.trim().length < 3){
            return false;
        }
        return true;
    },
    'mongoId': (data)=>{
        const valid = mongoose.Types.ObjectId.isValid(data);
        if (valid) return true
        throw new Error();
    }
}