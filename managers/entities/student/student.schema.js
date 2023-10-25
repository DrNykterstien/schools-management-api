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
    ],
    delete: [
        {
            label: 'Student ID',
            path: 'studentId',
            model: 'mongoId',
            required: true
        }
    ],
    login: [
        {
            label: 'Username',
            path: 'username',
            model: 'longText',
            required: true
        },
        {
            label: 'Password',
            path: 'password',
            model: 'password',
            required: true
        }
    ]
}