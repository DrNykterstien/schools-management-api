module.exports = {
    register: [
        {
            label: 'School Name',
            path: 'name',
            model: 'name',
            required: true,
        },
        {
            label: 'Country',
            path: 'country',
            model: 'country',
            required: true,
        },
        {
            label: 'City',
            path: 'city',
            model: 'text',
            required: true,
        },
        {
            label: 'Address',
            path: 'address',
            model: 'longText',
            required: true,
        },
        {
            label: 'Password',
            path: 'password',
            model: 'password',
            required: true,
        }
    ]
}