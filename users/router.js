'use strict'; 

const express = require('express'); 
const bodyParser = require('body-parser'); 
const { User } = require('./models');
const { Question } = require('../questions/models'); 
const router = express.Router(); 
const jsonParser = bodyParser.json(); 

router.post('/', jsonParser, (req, res) => {
    const requiredFields = ['firstName', 'lastName', 'username', 'password']; 
    const missingField = requiredFields.find(field => !(field in req.body));

    if (missingField) {
        return res.status(422).json({
            code: 422, 
            reason: 'Validation Error', 
            message: 'Missing field', 
            location: missingField
        });
    }

    const stringFields = ['firstName', 'lastName', 'username', 'password']; 
    const nonStringField = stringFields.find(
        field => field in req.body && typeof req.body[field] !== 'string'
    ); 

    if (nonStringField) {
        return res.status(422).json({
            code: 422, 
            reson: 'Validation Error', 
            message: 'Incorrect field type: expect string', 
            location: nonStringField
        }); 
    }

    const explicityTrimmedFields = ['firstName', 'lastName', 'username', 'password']; 
    const nonTrimmedField = explicityTrimmedFields.find(
        field => req.body[field].trim() !== req.body[field]
      );
    
      if (nonTrimmedField) {
        return res.status(422).json({
          code: 422,
          reason: 'ValidationError',
          message: 'Cannot start or end with whitespace',
          location: nonTrimmedField
        });
      }
    
      const sizedFields = {
        firstName: { min: 1 },
        lastName: { min: 1 },
        username: { min: 1 },
        password: { min: 10, max: 72 }
      };
      const tooSmallField = Object.keys(sizedFields).find(field =>
        'min' in sizedFields[field] &&
        req.body[field].trim().length < sizedFields[field].min
      );
      const tooLargeField = Object.keys(sizedFields).find(field =>
        'max' in sizedFields[field] &&
        req.body[field].trim().length > sizedFields[field].max
      );
    
      if (tooSmallField || tooLargeField) {
        return res.status(422).json({
          code: 422,
          reason: 'ValidationError',
          message: tooSmallField
            ? `Must be at least ${sizedFields[tooSmallField].min} characters long`
            : `Must be at most ${sizedFields[tooLargeField].max} characters long`,
          location: tooSmallField || tooLargeField
        });
      }
    
      let { firstName, lastName, username, password } = req.body;
      return User.find({ username })
        .count()
        .then(count => {
            if (count > 0) {
                return Promise.reject({
                    code: 422, 
                    reason: 'Validation Error', 
                    message: 'Username already taken', 
                    location: 'username'
                })
            }
            return Promise.all([User.hashPassword(password), 
                Question.find()
            ]);
        })
        .then(data => {
            console.log(data)
            const questions = data[1].map((question, index) => {
                return {
                    question: question.question,
                    answers: question.answers,
                    correct_answer: question.correct_answer,
                    next: 1, 
                    m: 1
                }
            });
            return User.create({ firstName, lastName, username, password: data[0], questions: questions }); 
        })
        .then(user => {
            console.log('user:', user);
            return res.status(201).json(user.apiRepr()); 
        })
        .catch(err => {
            if (err.reason === 'Validation Error') {
                return res.status(err.code).json(err); 
            }
            console.error(err);
            res.status(500).json({ code: 500, message: 'Internal server error'});
        });
});

router.get('/', (req, res) => {
    User.find()
        .then(users => res.json(users.map(user => user.apiRepr()))); 
}); 

router.put('/', jsonParser, (req, res) => {  // should authenticate this route
    console.log(req.body.username); 
    console.log(req.body.answerInput); 
    User.findOne({username: req.body.username})
        .then(user => { 
            let correctAnswer = user.questions[user.head].correct_answer;
            console.log(user.questions[user.head].correct_answer)


        })    
    //         let userAnswer = req.body.answerInput; 
    //         let currentQuestion = user[0].questions[0]; 
    //         if(userAnswer === correctAnswer) {
                
                
    //             // User.set({username: req.body.username, "questions.m": "1" }); 

    //             User.questions[0].update({
                     

                    
    //             })


    //             // Recipes.update({
    //             //     id: req.params.id,
    //             //     name: req.body.name,
    //             //     ingredients: req.body.ingredients
    //             //   });
    //             //   res.status(204).end();
    //         }
    //     })
})

module.exports = { router }; 