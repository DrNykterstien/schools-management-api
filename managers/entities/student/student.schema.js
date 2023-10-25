module.exports = {
    add: [
        {
            label: 'Student Name',
            path: 'name',
            model: 'name',
            required: true
        },
        {
            label: 'Password',
            path: 'password',
            model: 'password',
            required: true
        },
        {
            label: 'Classroom ID',
            path: 'classroomId',
            model: 'mongoId',
            required: true
        }
    ]
}