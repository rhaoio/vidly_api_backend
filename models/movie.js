const Joi = require('joi');

const string = require('joi/lib/types/string');
const {genreSchema} = require('./genre');

//mongoose
const mongoose = require('mongoose');

//Setup a mongoose Model - object of schema


const movieSchema = new mongoose.Schema({
  
    title: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 250
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        min: 0,
        max:1000,
        required: true
    },
    dailyRentalRate: {
        type: Number,
        min: 0,
        max:1000,
        required: true
    }
  });

const Movie = mongoose.model('Movie', movieSchema);

function validateMovie(movie){
//Validate
    const schema = Joi.object({
        title: Joi.string().min(1).required(),
        genreId: Joi.objectId().required(),
        numberInStock: Joi.number().required(),
        dailyRentalRate: Joi.number().required()

    });

    return schema.validate(movie);


}

exports.movieSchema = movieSchema;
exports.Movie = Movie;
exports.validate = validateMovie;
