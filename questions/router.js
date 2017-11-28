'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const { Question } = require('./models');
const router = express.Router();
const jsonParser = bodyParser.json();

router.post('/', jsonParser, (req, res) => {
  const requiredFields = ['question', 'answers', 'correctAnswer'];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'Validation Error',
      message: 'Missing field',
      location: missingField
    });
  }

  const stringFields = ['question', 'correctAnswer'];
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

  const explicityTrimmedFields = ['question', 'answers', 'correctAnswer'];
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

  let { question, answers, correctAnswer } = req.body;
  return Question.create({ question, answers, correctAnswer })
    .then(question => {
      return res.status(201).json({ question });
    })
    .catch(err => {
      if (err.reason === 'Validation Error') {
        return res.status(err.code).json(err);
      }
      console.error(err);
      res.status(500).json({ code: 500, message: 'Internal server error' });
    });
});

module.exports = { router };