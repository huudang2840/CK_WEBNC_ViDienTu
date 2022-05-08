const mongoose = require('mongoose')
const Schema = mongoose.Schema


const AccountSchema = new Schema({
    username: { type: 'string', unique: true },
    password: { type: 'string' }
})

module.exports = mongoose.model('Accountc', AccountSchema)