module.exports = ({ meta, config, managers }) =>{
    return async ({req, res, next, results})=>{
        const schoolAdminId = results.__shortToken.userId;
        let schoolAdmin = await managers.school.schoolAdminByIdOrError({schoolAdminId});
        if (schoolAdmin.error) return managers.responseDispatcher.dispatch(res, {ok: false, code:403, errors: 'forbidden'});
        next(schoolAdmin);
    }
}