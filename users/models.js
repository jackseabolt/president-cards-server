'use strict'; 

const bcrypt = require('bcryptjs'); 
const mongoose = require('mongoose'); 

mongoose.Promise = global.Promise; 

const UserSchema = mongoose.Schema({
    username: {
        type: String, 
        required: true, 
        unique: true
    }, 
    password: {
        type: String, 
        required: true
    }
});

UserSchema.method.apiRepr = () => ({
    username: this.username
}); 

UserSchema.methods.validatePassword = password => {
    return bcrypt.compare(password, this.password); 
}

UserSchema.statics.hashPassword = password => {
    return bcrypt.hash(password, 10); 
}; 

const User = mongoose.models.User || mongoose.model('User', UserSchema); 

module.expport = { User }; 