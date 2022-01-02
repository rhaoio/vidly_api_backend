const Joi = require('joi');
const string = require('joi/lib/types/string');

//mongoose
const mongoose = require('mongoose');

//Setup a mongoose Model - object of schema

const genreSchema = new mongoose.Schema({
  
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  }
});


const Genre = mongoose.model('Genre', genreSchema);

function validateGenre(genre){
//Validate
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required()
        
    });

    return schema.validate(genre);


}

exports.genreSchema = genreSchema;
exports.Genre = Genre;
exports.validate = validateGenre;
