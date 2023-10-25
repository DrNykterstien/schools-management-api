module.exports = ({ meta, config, managers, mongomodels }) =>{
    return async ({req, res, next, results})=>{
        const {userId, userKey} = results.__shortToken
        const user = await mongomodels[userKey].findById(userId).select('-__v');
        if (!user) return managers.responseDispatcher.dispatch(res, {ok: false, code:403, errors: 'forbidden'});
        next(user);
    }
}