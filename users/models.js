'use strict'; 

const bcrypt = require('bcryptjs'); 
const mongoose = require('mongoose'); 

mongoose.Promise = global.Promise; 

const UserSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    username: {
        type: String, 
        required: true, 
        unique: true
    }, 
    password: {
        type: String, 
        required: true
    },
    questions: [
        {
            question: String,
            answers: [
                {
                    type: String
                }
            ],  
            correct_answer: String,
            next: Number, 
            m: Number
        }
    ],
    head: {
        type: Number,
        default: 0
    }
    // questions array of questions
});

UserSchema.methods.apiRepr = function() {
    return {
        firstName: this.firstName,
        lastName: this.lastName,
        username: this.username,
        // questions: this.questions, 
        question: this.questions[this.head].question, // question at head
        answers: this.questions[this.head].answers, // answers to question, not correct answer
        id: this._id
    };
}; 

UserSchema.methods.validatePassword = function(password) {
    return bcrypt.compare(password, this.password); 
}

UserSchema.statics.hashPassword = function(password) {
    return bcrypt.hash(password, 10); 
}; 

const User = mongoose.models.User || mongoose.model('User', UserSchema); 

module.exports = { User }; 