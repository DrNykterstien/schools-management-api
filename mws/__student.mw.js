module.exports = ({ meta, config, managers }) =>{
    return async ({req, res, next, results})=>{
        const studentId = results.__shortToken.userId;
        let student = await managers.student.studentByIdOrError({studentId});
        if (student.error) return managers.responseDispatcher.dispatch(res, {ok: false, code:403, errors: 'forbidden'});
        next(student);
    }
}