'use strict'; 

const mongoose = require('mongoose'); 

mongoose.Promise = global.Promise; 

const QuestionSchema = mongoose.Schema(
    {
    question: {
        type: String, 
        required: true, 
        unique: true
    }, 
    answers: [
        {
            type: String, 
            required: true
        }
        // IS THIS CORRECT
    ], 
    correct_answer: {
        type: String, 
        required: true
    }
}); 

const Question = mongoose.modelNames.Question || mongoose.model('Question', QuestionSchema); 

module.exports = { Question }; 
