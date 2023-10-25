module.exports = {
    register: [
        {
            label: 'School Name',
            path: 'name',
            model: 'name',
            required: true
        },
        {
            label: 'Country',
            path: 'country',
            model: 'country',
            required: true
        },
        {
            label: 'City',
            path: 'city',
            model: 'text',
            required: true
        },
        {
            label: 'Address',
            path: 'address',
            model: 'longText',
            required: true
        },
        {
            label: 'Password',
            path: 'password',
            model: 'password',
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
    ],
    addAdmin: [
        {
            label: 'Admin Name',
            path: 'name',
            model: 'name',
            required: true
        },
        {
            label: 'Password',
            path: 'password',
            model: 'password',
            required: true
        }
    ],
    deleteAdmin: [
        {
            label: 'Admin ID',
            path: 'schoolAdminId',
            model: 'mongoId',
            required: true
        }
    ],
    admin: [
        {
            label: 'Admin ID',
            path: 'schoolAdminId',
            model: 'mongoId',
            required: true
        }
    ],
    updateDetails: [
        {
            label: 'School Name',
            path: 'name',
            model: 'name'
        },
        {
            label: 'Country',
            path: 'country',
            model: 'country'
        },
        {
            label: 'City',
            path: 'city',
            model: 'text'
        },
        {
            label: 'Address',
            path: 'address',
            model: 'longText'
        }
    ]
}