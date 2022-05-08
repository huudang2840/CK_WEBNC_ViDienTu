const mongoose = require('mongoose')
const Schema = mongoose.Schema


const RegisterSchema = new Schema({
    phone: { type: 'string', unique: true },
    email: { type: 'string', unique: true },
    name: { type: 'string' },
    birthday: { type: 'date', },
    address: { type: 'string' },
    front_IDcard: { type: 'string' },
    back_IDcard: { type: 'string' },
    username: { type: 'string' },
    password: { type: 'string' },
})

module.exports = mongoose.model('Account', RegisterSchema)